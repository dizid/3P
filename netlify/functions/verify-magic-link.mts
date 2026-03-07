import type { Context, Config } from "@netlify/functions";
import { neon } from "@neondatabase/serverless";
import jwt from "jsonwebtoken";

const getDb = () => {
  const dbUrl = Netlify.env.get("DATABASE_URL");
  if (!dbUrl) throw new Error("DATABASE_URL not configured");
  return neon(dbUrl);
};

export default async (req: Request, context: Context) => {
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

  const jwtSecret = Netlify.env.get("JWT_SECRET");
  if (!jwtSecret) {
    return new Response(
      JSON.stringify({ error: "Auth service not configured" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const { token } = await req.json();

    if (!token) {
      return new Response(
        JSON.stringify({ error: "Token is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const sql = getDb();

    // Find profile with this token
    const profiles = await sql`
      SELECT id, email, display_name, magic_link_token, token_expires_at
      FROM profiles
      WHERE magic_link_token = ${token}
      LIMIT 1
    `;

    if (profiles.length === 0) {
      return new Response(
        JSON.stringify({ error: "Invalid or expired link" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const profile = profiles[0];

    // Check expiry
    if (
      !profile.token_expires_at ||
      new Date(profile.token_expires_at) < new Date()
    ) {
      // Clear expired token
      await sql`
        UPDATE profiles
        SET magic_link_token = NULL, token_expires_at = NULL
        WHERE id = ${profile.id}
      `;
      return new Response(
        JSON.stringify({ error: "Link has expired. Please request a new one." }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // Token is valid — mark email as verified and clear token
    await sql`
      UPDATE profiles
      SET email_verified = TRUE, magic_link_token = NULL, token_expires_at = NULL, updated_at = NOW()
      WHERE id = ${profile.id}
    `;

    // Create JWT session token (30 days)
    const sessionToken = jwt.sign(
      {
        profileId: profile.id,
        email: profile.email,
      },
      jwtSecret,
      { expiresIn: "30d" }
    );

    // Get subscription info
    const subs = await sql`
      SELECT plan, status FROM subscriptions
      WHERE profile_id = ${profile.id} AND (status = 'active' OR status = 'trialing')
      LIMIT 1
    `;

    const plan = subs.length > 0 ? subs[0].plan : "free";

    return new Response(
      JSON.stringify({
        success: true,
        token: sessionToken,
        user: {
          id: profile.id,
          email: profile.email,
          displayName: profile.display_name,
          plan,
        },
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Verify magic link error:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to verify login link",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

export const config: Config = {
  path: "/api/auth/verify",
};
