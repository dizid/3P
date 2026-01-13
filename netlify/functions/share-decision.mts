import type { Context, Config } from "@netlify/functions";
import { neon } from "@neondatabase/serverless";

// Get database connection
const getDb = () => {
  const dbUrl = Netlify.env.get("DATABASE_URL");
  if (!dbUrl) throw new Error("DATABASE_URL not configured");
  return neon(dbUrl);
};

// Generate a random share token
const generateToken = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  for (let i = 0; i < 12; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
};

export default async (req: Request, context: Context) => {
  // Only allow POST
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { decisionId, action } = await req.json();

    if (!decisionId) {
      return new Response(
        JSON.stringify({ error: "Missing decision ID" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const sql = getDb();

    if (action === "unshare") {
      // Remove sharing
      await sql`
        UPDATE decisions
        SET is_public = false, share_token = NULL
        WHERE id = ${decisionId}
      `;

      return new Response(
        JSON.stringify({
          success: true,
          message: "Decision is no longer shared",
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Check if already shared
    const existing = await sql`
      SELECT share_token FROM decisions
      WHERE id = ${decisionId}
      AND is_public = true
      AND share_token IS NOT NULL
      LIMIT 1
    `;

    if (existing.length > 0) {
      // Already shared, return existing token
      return new Response(
        JSON.stringify({
          success: true,
          token: existing[0].share_token,
          alreadyShared: true,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Generate new share token
    const token = generateToken();

    await sql`
      UPDATE decisions
      SET is_public = true, share_token = ${token}
      WHERE id = ${decisionId}
    `;

    return new Response(
      JSON.stringify({
        success: true,
        token,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error sharing decision:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to share decision",
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
  path: "/api/share-decision",
};
