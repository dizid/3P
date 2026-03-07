import type { Context, Config } from "@netlify/functions";
import { neon } from "@neondatabase/serverless";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const getDb = () => {
  const dbUrl = Netlify.env.get("DATABASE_URL");
  if (!dbUrl) throw new Error("DATABASE_URL not configured");
  return neon(dbUrl);
};

interface JwtPayload {
  profileId: string;
  email: string;
}

// Verify auth and return profile ID, or null for unauthenticated
function getProfileId(req: Request): string | null {
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

export default async (req: Request, context: Context) => {
  // Verify app API key
  const appApiKey = Netlify.env.get("APP_API_KEY");
  const requestApiKey = req.headers.get("x-api-key");
  if (!appApiKey || requestApiKey !== appApiKey) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const profileId = getProfileId(req);
  if (!profileId) {
    return new Response(
      JSON.stringify({ error: "Authentication required" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  const sql = getDb();

  try {
    // GET — List decisions
    if (req.method === "GET") {
      const url = new URL(req.url);
      const limit = Math.min(parseInt(url.searchParams.get("limit") || "50"), 200);
      const offset = parseInt(url.searchParams.get("offset") || "0");

      const decisions = await sql`
        SELECT id, tool, title, description, score, advice_type, outcome_rating, outcome_notes, outcome_date, share_token, is_public, created_at
        FROM decisions
        WHERE profile_id = ${profileId}
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;

      const countResult = await sql`
        SELECT COUNT(*) as total FROM decisions WHERE profile_id = ${profileId}
      `;

      return new Response(
        JSON.stringify({
          decisions,
          total: parseInt(countResult[0].total),
          limit,
          offset,
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    // POST — Create decision
    if (req.method === "POST") {
      const body = await req.json();
      const { tool, title, description, data, score, adviceType } = body;

      if (!tool || !title) {
        return new Response(
          JSON.stringify({ error: "Missing required fields: tool, title" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      const result = await sql`
        INSERT INTO decisions (profile_id, tool, title, description, data, score, advice_type)
        VALUES (${profileId}, ${tool}, ${title}, ${description || null}, ${JSON.stringify(data || {})}, ${score || null}, ${adviceType || null})
        RETURNING id, created_at
      `;

      return new Response(
        JSON.stringify({ success: true, decision: result[0] }),
        { status: 201, headers: { "Content-Type": "application/json" } }
      );
    }

    // PATCH — Update decision (outcome tracking, share settings)
    if (req.method === "PATCH") {
      const body = await req.json();
      const { decisionId, outcomeRating, outcomeNotes, isPublic } = body;

      if (!decisionId) {
        return new Response(
          JSON.stringify({ error: "Missing decisionId" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      // Build update fields
      if (outcomeRating !== undefined) {
        await sql`
          UPDATE decisions
          SET outcome_rating = ${outcomeRating}, outcome_notes = ${outcomeNotes || null}, outcome_date = NOW(), updated_at = NOW()
          WHERE id = ${decisionId} AND profile_id = ${profileId}
        `;
      }

      if (isPublic !== undefined) {
        // Generate share token if making public
        const shareToken = isPublic
          ? crypto.randomBytes(16).toString("base64url")
          : null;
        await sql`
          UPDATE decisions
          SET is_public = ${isPublic}, share_token = ${shareToken}, updated_at = NOW()
          WHERE id = ${decisionId} AND profile_id = ${profileId}
        `;
      }

      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    // DELETE — Remove decision
    if (req.method === "DELETE") {
      const url = new URL(req.url);
      const decisionId = url.searchParams.get("id");

      if (!decisionId) {
        return new Response(
          JSON.stringify({ error: "Missing decision id" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      await sql`
        DELETE FROM decisions
        WHERE id = ${decisionId} AND profile_id = ${profileId}
      `;

      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Decisions API error:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to process request",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

export const config: Config = {
  path: "/api/decisions",
};
