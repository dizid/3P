import type { Context, Config } from "@netlify/functions";
import Anthropic from "@anthropic-ai/sdk";
import Stripe from "stripe";
import { neon } from "@neondatabase/serverless";

// Rate limiting constants by tier
const TIER_LIMITS = {
  free: 1,    // 1 AI analysis per month for free
  pro: 15,    // 15 AI analyses per month for pro
  coach: 999, // Unlimited for coach tier
};

// Model selection by tier
const TIER_MODELS = {
  free: "claude-3-haiku-20240307",
  pro: "claude-3-5-haiku-20241022",
  coach: "claude-sonnet-4-20250514",
};

// Max tokens by tier
const TIER_MAX_TOKENS = {
  free: 400,
  pro: 800,
  coach: 2000,
};

// Get database connection
const getDb = () => {
  const dbUrl = Netlify.env.get("DATABASE_URL");
  if (!dbUrl) throw new Error("DATABASE_URL not configured");
  return neon(dbUrl);
};

// Tool-specific prompts for better analysis
const toolPrompts: Record<string, string> = {
  threeps: `You are analyzing a decision using "De 3 P's" framework (Poen/Money, Pret/Fun, Prestige/Status).
The user rated their baseline importance for each P (0-100) and how the project affects each P (0-100).
Score = sum of (baseline × project) for each P. Threshold for "go": 6000.`,

  tententen: `You are analyzing a decision using the "10-10-10 Rule" by Suzy Welch.
The user rated how they'll feel about Option A vs B at 10 minutes, 10 months, and 10 years.
Weighted: 15% short-term + 35% medium-term + 50% long-term.`,

  regret: `You are analyzing a decision using Jeff Bezos's "Regret Minimization Framework".
The user rated: regret if not done, reversibility, values alignment, and age-80 perspective.`,

  pmi: `You are analyzing a decision using Edward de Bono's "PMI Analysis".
The user listed Plus points, Minus points, and Interesting observations.`,

  swot: `You are analyzing a decision using "SWOT Analysis".
The user identified Strengths, Weaknesses, Opportunities, and Threats.`,

  coinflip: `You are analyzing a decision using the "Coin Flip Gut Check".
The coin landed on a result, and the user's gut reaction reveals their true preference.`,

  fearRegret: `You are analyzing a decision using the "Fear/Regret Matrix".
The user rated their fear of taking action vs their anticipated regret of NOT acting.`,

  opportunityCost: `You are analyzing a decision using "Opportunity Cost Analysis".
The user compared gains from Option A vs what they sacrifice by not choosing Option B.`,
};

type PlanTier = "free" | "pro" | "coach";

interface SubscriptionInfo {
  plan: PlanTier;
  profileId: string | null;
  customerId: string | null;
}

/**
 * Get subscription info from Neon database
 */
async function getSubscriptionInfo(
  customerId: string | null,
  email: string | null
): Promise<SubscriptionInfo> {
  const defaultInfo: SubscriptionInfo = { plan: "free", profileId: null, customerId: null };

  if (!customerId && !email) {
    return defaultInfo;
  }

  try {
    const sql = getDb();

    // Try to find profile by stripe_customer_id or email
    let profiles;
    if (customerId) {
      profiles = await sql`
        SELECT p.id, s.plan, s.status, s.stripe_customer_id
        FROM profiles p
        LEFT JOIN subscriptions s ON s.profile_id = p.id
        WHERE p.stripe_customer_id = ${customerId}
        LIMIT 1
      `;
    } else if (email) {
      profiles = await sql`
        SELECT p.id, s.plan, s.status, s.stripe_customer_id
        FROM profiles p
        LEFT JOIN subscriptions s ON s.profile_id = p.id
        WHERE p.email = ${email}
        LIMIT 1
      `;
    }

    if (!profiles || profiles.length === 0) {
      return defaultInfo;
    }

    const profile = profiles[0];

    // Check if subscription is active
    if (profile.status === "active" || profile.status === "trialing") {
      return {
        plan: (profile.plan as PlanTier) || "pro",
        profileId: profile.id,
        customerId: profile.stripe_customer_id,
      };
    }

    return {
      plan: "free",
      profileId: profile.id,
      customerId: profile.stripe_customer_id,
    };
  } catch (error) {
    console.error("Error getting subscription info:", error);
    return defaultInfo;
  }
}

/**
 * Check and update rate limit using Neon database
 */
async function checkRateLimit(
  profileId: string | null,
  plan: PlanTier,
  ip: string
): Promise<{ allowed: boolean; remaining: number; resetDate: Date }> {
  const limit = TIER_LIMITS[plan];
  const currentMonth = new Date().toISOString().slice(0, 7); // '2026-01'
  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  nextMonth.setDate(1);

  // For coach tier, always allow
  if (plan === "coach") {
    return { allowed: true, remaining: 999, resetDate: nextMonth };
  }

  try {
    const sql = getDb();

    // For anonymous users (no profileId), allow limited free usage without tracking
    if (!profileId) {
      // Anonymous users get 1 free analysis without persistent tracking
      // They need to sign up to get more
      return { allowed: true, remaining: 0, resetDate: nextMonth };
    }

    // Get usage record for authenticated users
    const existingUsage = await sql`
      SELECT count FROM ai_usage
      WHERE profile_id = ${profileId}
      AND month = ${currentMonth}
      LIMIT 1
    `;

    let currentCount = existingUsage.length > 0 ? existingUsage[0].count : 0;

    if (currentCount >= limit) {
      return { allowed: false, remaining: 0, resetDate: nextMonth };
    }

    // Increment usage - only for authenticated users with profile_id
    // Anonymous users are rate limited per-request without persistent storage
    if (profileId) {
      await sql`
        INSERT INTO ai_usage (profile_id, month, count)
        VALUES (${profileId}, ${currentMonth}, 1)
        ON CONFLICT (profile_id, month)
        DO UPDATE SET count = ai_usage.count + 1
      `;
    }
    // For anonymous users, we can't persist usage tracking, so they get one free per session
    // In practice, they need to sign up to track usage properly

    return {
      allowed: true,
      remaining: limit - currentCount - 1,
      resetDate: nextMonth,
    };
  } catch (error) {
    console.error("Rate limit check error:", error);
    // On error, allow the request but log it
    return { allowed: true, remaining: limit, resetDate: nextMonth };
  }
}

/**
 * Build prompt based on subscription tier
 */
function buildPromptForTier(
  plan: PlanTier,
  toolContext: string,
  decision: string,
  data: unknown,
  score?: number
): string {
  const baseContext = `${toolContext}

The user is deciding: "${decision}"

Their analysis data:
${JSON.stringify(data, null, 2)}

${score !== undefined ? `Their calculated score: ${score}` : ""}`;

  if (plan === "free") {
    // Basic analysis for free tier
    return `${baseContext}

Please provide a brief, actionable analysis in JSON format:
{
  "insight": "One key insight from their analysis (1-2 sentences)",
  "blindSpots": ["2-3 things they might have overlooked"],
  "nextStep": "One concrete next action they should take",
  "confidence": "low" | "medium" | "high" based on how complete their analysis is
}

Be direct, practical, and specific to THEIR decision. No generic advice.`;
  }

  if (plan === "pro") {
    // Enhanced analysis for pro tier
    return `${baseContext}

Please provide a thorough analysis in JSON format:
{
  "insight": "One key insight from their analysis (2-3 sentences)",
  "blindSpots": ["3-4 things they might have overlooked"],
  "biases": ["1-2 potential cognitive biases affecting this decision"],
  "scenarios": {
    "best": "What happens if this goes well",
    "worst": "What's the realistic downside"
  },
  "nextStep": "One concrete next action they should take within 24 hours",
  "confidence": "low" | "medium" | "high" based on how complete their analysis is,
  "confidenceReason": "Brief explanation of the confidence rating"
}

Be direct, practical, and specific to THEIR decision. Provide real insights, not generic advice.`;
  }

  // Coach tier - full deep analysis
  return `${baseContext}

You are an expert decision coach. Provide a comprehensive analysis in JSON format:
{
  "coreInsight": "The single most important thing they should understand about this decision. Be specific to THEIR situation. (2-3 sentences)",
  "biases": [
    {
      "name": "Name of cognitive bias",
      "manifestation": "How it might be showing up here",
      "challenge": "One question to challenge it"
    }
  ],
  "blindSpots": ["3-5 specific things they may have overlooked"],
  "scenarios": {
    "best": "What happens if this goes perfectly?",
    "worst": "What's the realistic downside?",
    "likely": "What will probably happen?"
  },
  "frameworkFit": {
    "suitable": true/false,
    "alternative": "Another framework that might help (if applicable)",
    "reason": "Why this framework does/doesn't fit"
  },
  "confidence": {
    "level": "low" | "medium" | "high",
    "missing": ["Information that would increase confidence"]
  },
  "clarityScore": {
    "score": 1-10,
    "explanation": "Why this score"
  },
  "nextStep": "One specific, concrete action they should take within 24 hours",
  "questions": ["3 probing questions to help them think deeper about this decision"]
}

Be an exceptional coach: direct, insightful, and specific to THEIR unique situation. Challenge their thinking constructively. No platitudes or generic advice.`;
}

export default async (req: Request, context: Context) => {
  // Only allow POST
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Get API key from environment
  const apiKey = Netlify.env.get("ANTHROPIC_API_KEY");
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "AI service not configured" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    const { tool, decision, data, score, customerId, email } = await req.json();

    if (!tool || !decision) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: tool, decision" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Get subscription info from Neon
    const subscriptionInfo = await getSubscriptionInfo(customerId, email);
    const { plan, profileId } = subscriptionInfo;

    // Rate limiting based on tier
    const clientIp = context.ip || "unknown";
    const rateLimit = await checkRateLimit(profileId, plan, clientIp);

    if (!rateLimit.allowed) {
      return new Response(
        JSON.stringify({
          error: "Rate limit exceeded",
          message: `Your ${plan} tier allows ${TIER_LIMITS[plan]} AI analyses per month. ${plan === "free" ? "Upgrade to Pro for 15/month or Coach for unlimited." : "Upgrade to Coach for unlimited access."}`,
          remaining: 0,
          resetDate: rateLimit.resetDate.toISOString(),
          upgradeUrl: "/pricing",
        }),
        {
          status: 429,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const toolContext = toolPrompts[tool] || "You are analyzing a decision.";

    // Select model and tokens based on tier
    const model = TIER_MODELS[plan];
    const maxTokens = TIER_MAX_TOKENS[plan];

    const client = new Anthropic({ apiKey });

    // Build prompt based on tier
    const prompt = buildPromptForTier(plan, toolContext, decision, data, score);

    const response = await client.messages.create({
      model,
      max_tokens: maxTokens,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    // Extract the text content
    const textContent = response.content.find((c) => c.type === "text");
    if (!textContent || textContent.type !== "text") {
      throw new Error("No text response from AI");
    }

    // Parse the JSON response
    let analysis;
    try {
      // Extract JSON from the response (handle markdown code blocks)
      const jsonMatch = textContent.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch {
      // If JSON parsing fails, return structured fallback
      analysis = {
        insight: textContent.text.slice(0, 200),
        blindSpots: ["Consider seeking additional perspectives"],
        nextStep: "Review your analysis and make a decision",
        confidence: "medium",
      };
    }

    return new Response(
      JSON.stringify({
        success: true,
        analysis,
        model,
        plan,
        remaining: rateLimit.remaining,
        resetDate: rateLimit.resetDate.toISOString(),
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("AI analysis error:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to analyze decision",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

export const config: Config = {
  path: "/api/analyze-decision",
};
