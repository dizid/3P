import type { Context, Config } from "@netlify/functions";
import Anthropic from "@anthropic-ai/sdk";
import Stripe from "stripe";
import { getStore } from "@netlify/blobs";

// Rate limiting constants
const FREE_TIER_LIMIT = 3; // 3 AI analyses per month for free users
const RATE_LIMIT_WINDOW = 30 * 24 * 60 * 60 * 1000; // 30 days in ms

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

interface UsageRecord {
  count: number;
  windowStart: number;
}

/**
 * Check if user is premium subscriber via Stripe
 */
async function checkPremiumStatus(
  customerId: string | null,
  email: string | null
): Promise<boolean> {
  const stripeKey = Netlify.env.get("STRIPE_SECRET_KEY");
  if (!stripeKey || (!customerId && !email)) {
    return false;
  }

  try {
    const stripe = new Stripe(stripeKey);

    let customer: Stripe.Customer | null = null;

    if (customerId) {
      try {
        customer = (await stripe.customers.retrieve(
          customerId
        )) as Stripe.Customer;
      } catch {
        // Customer not found
      }
    } else if (email) {
      const customers = await stripe.customers.list({ email, limit: 1 });
      if (customers.data.length > 0) {
        customer = customers.data[0];
      }
    }

    if (!customer || customer.deleted) {
      return false;
    }

    // Check for active subscription
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: "active",
      limit: 1,
    });

    if (subscriptions.data.length > 0) {
      return true;
    }

    // Check for trialing subscription
    const trialingSubs = await stripe.subscriptions.list({
      customer: customer.id,
      status: "trialing",
      limit: 1,
    });

    return trialingSubs.data.length > 0;
  } catch (error) {
    console.error("Error checking premium status:", error);
    return false;
  }
}

/**
 * Check and update rate limit for free users
 * Uses Netlify Blobs for persistent storage
 */
async function checkRateLimit(
  userId: string
): Promise<{ allowed: boolean; remaining: number; resetDate: Date }> {
  const store = getStore("ai-usage");
  const now = Date.now();

  try {
    const existingData = await store.get(userId, { type: "json" });
    let usage: UsageRecord = existingData as UsageRecord;

    // Check if we need to reset the window
    if (!usage || now - usage.windowStart > RATE_LIMIT_WINDOW) {
      usage = { count: 0, windowStart: now };
    }

    const remaining = FREE_TIER_LIMIT - usage.count;
    const resetDate = new Date(usage.windowStart + RATE_LIMIT_WINDOW);

    if (usage.count >= FREE_TIER_LIMIT) {
      return { allowed: false, remaining: 0, resetDate };
    }

    // Increment usage
    usage.count++;
    await store.setJSON(userId, usage);

    return { allowed: true, remaining: FREE_TIER_LIMIT - usage.count, resetDate };
  } catch (error) {
    console.error("Rate limit check error:", error);
    // On error, allow the request but log it
    return { allowed: true, remaining: FREE_TIER_LIMIT, resetDate: new Date() };
  }
}

/**
 * Generate a user ID from request info
 * In production, this would come from auth
 */
function getUserId(
  customerId: string | null,
  email: string | null,
  ip: string
): string {
  if (customerId) return `cus_${customerId}`;
  if (email) return `email_${email}`;
  return `ip_${ip}`;
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

    // Check premium status
    const isPremium = await checkPremiumStatus(customerId, email);

    // Rate limiting for free users
    if (!isPremium) {
      const clientIp = context.ip || "unknown";
      const userId = getUserId(customerId, email, clientIp);
      const rateLimit = await checkRateLimit(userId);

      if (!rateLimit.allowed) {
        return new Response(
          JSON.stringify({
            error: "Rate limit exceeded",
            message: `Free tier allows ${FREE_TIER_LIMIT} AI analyses per month. Upgrade to Premium for unlimited access.`,
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
    }

    const toolContext = toolPrompts[tool] || "You are analyzing a decision.";

    const client = new Anthropic({ apiKey });

    const response = await client.messages.create({
      model: "claude-3-haiku-20240307", // Fast and cost-effective
      max_tokens: 500,
      messages: [
        {
          role: "user",
          content: `${toolContext}

The user is deciding: "${decision}"

Their analysis data:
${JSON.stringify(data, null, 2)}

${score !== undefined ? `Their calculated score: ${score}` : ""}

Please provide a brief, actionable analysis in JSON format:
{
  "insight": "One key insight from their analysis (1-2 sentences)",
  "blindSpots": ["2-3 things they might have overlooked"],
  "nextStep": "One concrete next action they should take",
  "confidence": "low" | "medium" | "high" based on how complete their analysis is
}

Be direct, practical, and specific to THEIR decision. No generic advice.`,
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
        model: "claude-3-haiku",
        isPremium,
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
