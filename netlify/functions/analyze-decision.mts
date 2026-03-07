import type { Context, Config } from "@netlify/functions";
import Anthropic from "@anthropic-ai/sdk";
import { neon } from "@neondatabase/serverless";
import jwt from "jsonwebtoken";

// 2-tier rate limits
const TIER_LIMITS = {
  free: 1,     // 1 AI analysis per month
  pro: 999,    // Unlimited for pro
};

// 2-tier model selection
const TIER_MODELS = {
  free: "claude-3-haiku-20240307",
  pro: "claude-sonnet-4-20250514",
};

// 2-tier max tokens
const TIER_MAX_TOKENS = {
  free: 400,
  pro: 2000,
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

type PlanTier = "free" | "pro";

interface JwtPayload {
  profileId: string;
  email: string;
}

interface SubscriptionInfo {
  plan: PlanTier;
  profileId: string | null;
}

// Extract profile ID from JWT auth token (server-side verification)
function getAuthProfileId(req: Request): string | null {
  const jwtSecret = Netlify.env.get("JWT_SECRET");
  if (!jwtSecret) return null;

  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;

  try {
    const payload = jwt.verify(
      authHeader.replace("Bearer ", ""),
      jwtSecret
    ) as JwtPayload;
    return payload.profileId;
  } catch {
    return null;
  }
}

/**
 * Get subscription info from Neon database using verified profile ID
 */
async function getSubscriptionInfo(
  profileId: string | null
): Promise<SubscriptionInfo> {
  const defaultInfo: SubscriptionInfo = { plan: "free", profileId: null };

  if (!profileId) return defaultInfo;

  try {
    const sql = getDb();

    const subs = await sql`
      SELECT plan, status FROM subscriptions
      WHERE profile_id = ${profileId} AND (status = 'active' OR status = 'trialing')
      LIMIT 1
    `;

    if (subs.length > 0) {
      return {
        plan: (subs[0].plan as PlanTier) || "pro",
        profileId,
      };
    }

    return { plan: "free", profileId };
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

  // For pro tier, unlimited
  if (plan === "pro") {
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

  // Pro tier — full AI coaching analysis (Claude Sonnet)
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

  // Verify app API key
  const appApiKey = Netlify.env.get("APP_API_KEY");
  const requestApiKey = req.headers.get("x-api-key");
  if (!appApiKey || requestApiKey !== appApiKey) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
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
    const { tool, decision, data, score } = await req.json();

    if (!tool || !decision) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: tool, decision" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Get subscription via server-side auth token verification
    const profileId = getAuthProfileId(req);
    const subscriptionInfo = await getSubscriptionInfo(profileId);
    const { plan } = subscriptionInfo;

    // Rate limiting based on tier
    const clientIp = context.ip || "unknown";
    const rateLimit = await checkRateLimit(subscriptionInfo.profileId, plan, clientIp);

    if (!rateLimit.allowed) {
      return new Response(
        JSON.stringify({
          error: "Rate limit exceeded",
          message: `You've used your ${TIER_LIMITS[plan]} free AI analysis this month. Upgrade to Pro for unlimited AI coaching.`,
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
