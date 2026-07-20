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

// Default-on demo mode: real Anthropic calls are gated behind this flag until
// explicitly opted out. Set DEMO_MODE=false in Netlify env vars (+ redeploy) to
// enable live AI calls. See AI-COST-RISK.md for why this was added.
const DEMO_MODE = (Netlify.env.get("DEMO_MODE") ?? "true") !== "false";

// Mock analyses returned while DEMO_MODE is on. Shapes match buildPromptForTier's
// real JSON response schema exactly (see below) so the frontend needs zero changes.
const MOCK_FREE_ANALYSIS = {
  insight:
    "Your numbers point toward a decision you already lean toward — the framework is mostly confirming a direction you've sensed for a while.",
  blindSpots: [
    "Consider whether you're weighting short-term comfort over long-term fit.",
    "Check if this choice still holds up under your worst-case assumption.",
  ],
  nextStep: "Write down the single biggest risk and how you'd handle it.",
  confidence: "medium",
};

const MOCK_PRO_ANALYSIS = {
  coreInsight:
    "This decision hinges less on the framework's math and more on one unstated assumption you're making about how things play out over time — surface that assumption before committing.",
  biases: [
    {
      name: "Confirmation bias",
      manifestation: "The inputs you rated highest tend to support the option you already favored.",
      challenge: "What score would a skeptical friend give this same option?",
    },
    {
      name: "Sunk cost fallacy",
      manifestation: "Past investment may be inflating how committed you feel to one path.",
      challenge: "If you were starting fresh today, would you still choose this?",
    },
  ],
  blindSpots: [
    "The framework doesn't capture how reversible this decision actually is.",
    "External factors outside your control aren't weighted here.",
    "You may be underestimating the emotional cost of the alternative.",
  ],
  scenarios: {
    best: "This works out close to how you're hoping, with manageable friction along the way.",
    worst: "The downside is real but recoverable within a reasonable timeframe.",
    likely: "Results land somewhere between the two, shaped mostly by how well you plan for the transition.",
  },
  frameworkFit: {
    suitable: true,
    alternative: "10-10-10 Rule",
    reason: "This framework fits your situation, though a time-horizon check could add useful contrast.",
  },
  confidence: {
    level: "medium",
    missing: ["A clearer worst-case cost estimate", "Input from someone directly affected by the outcome"],
  },
  clarityScore: {
    score: 7,
    explanation: "Your inputs are consistent and specific, though a couple of blind spots remain unaddressed.",
  },
  nextStep: "Within 24 hours, write down the one assumption this decision depends on most, and test it.",
  questions: [
    "What would have to be true for the opposite choice to be correct?",
    "Whose opinion are you most avoiding on this?",
    "What does your gut say versus what does this analysis say?",
  ],
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

  // Get API key from environment — only required when demo mode is off,
  // since the demo path never calls Anthropic.
  const apiKey = Netlify.env.get("ANTHROPIC_API_KEY");
  if (!DEMO_MODE && !apiKey) {
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

    // Select model and tokens based on tier (used for the response's "model" field
    // whether real or mocked, so the frontend display is consistent either way)
    const model = TIER_MODELS[plan];
    const maxTokens = TIER_MAX_TOKENS[plan];

    // --- Demo mode: return a mock analysis, never call Anthropic. ---
    // Everything above (auth, subscription lookup, rate limiting) is unchanged —
    // only the paid Anthropic call itself is gated.
    if (DEMO_MODE) {
      const mockAnalysis = plan === "pro" ? MOCK_PRO_ANALYSIS : MOCK_FREE_ANALYSIS;
      return new Response(
        JSON.stringify({
          success: true,
          analysis: mockAnalysis,
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
    }

    // --- Live implementation below, unreachable while DEMO_MODE=true ---
    const toolContext = toolPrompts[tool] || "You are analyzing a decision.";

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
