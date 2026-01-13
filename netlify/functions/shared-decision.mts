import type { Context, Config } from "@netlify/functions";
import { neon } from "@neondatabase/serverless";

// Get database connection
const getDb = () => {
  const dbUrl = Netlify.env.get("DATABASE_URL");
  if (!dbUrl) throw new Error("DATABASE_URL not configured");
  return neon(dbUrl);
};

export default async (req: Request, context: Context) => {
  // Only allow GET
  if (req.method !== "GET") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const url = new URL(req.url);
    const token = url.searchParams.get("token");

    if (!token) {
      return new Response(
        JSON.stringify({ error: "Missing share token" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const sql = getDb();

    // Find shared decision by token
    const decisions = await sql`
      SELECT
        id,
        tool,
        title,
        description,
        score,
        advice_type,
        outcome_rating,
        outcome_notes,
        outcome_date,
        created_at
      FROM decisions
      WHERE share_token = ${token}
      AND is_public = true
      LIMIT 1
    `;

    if (decisions.length === 0) {
      return new Response(
        JSON.stringify({ error: "Decision not found or not shared" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const decision = decisions[0];

    return new Response(
      JSON.stringify({
        success: true,
        decision: {
          tool: decision.tool,
          title: decision.title,
          description: decision.description,
          score: decision.score,
          adviceType: decision.advice_type,
          outcomeRating: decision.outcome_rating,
          outcomeNotes: decision.outcome_notes,
          outcomeDate: decision.outcome_date,
          createdAt: decision.created_at,
        },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error fetching shared decision:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to fetch shared decision",
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
  path: "/api/shared-decision",
};
