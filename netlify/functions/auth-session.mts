import type { Context, Config } from "@netlify/functions";
import { neon } from "@neondatabase/serverless";
import jwt from "jsonwebtoken";

const getDb = () => {
  const dbUrl = Netlify.env.get("DATABASE_URL");
  if (!dbUrl) throw new Error("DATABASE_URL not configured");
  return neon(dbUrl);
};

interface JwtPayload {
  profileId: string;
  email: string;
}

export default async (req: Request, context: Context) => {
  if (req.method !== "GET") {
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

  // Get token from Authorization header
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return new Response(
      JSON.stringify({ error: "Not authenticated", authenticated: false }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    // Verify JWT
    const payload = jwt.verify(token, jwtSecret) as JwtPayload;

    const sql = getDb();

    // Get profile with subscription
    const profiles = await sql`
      SELECT p.id, p.email, p.display_name, p.stripe_customer_id,
             s.plan, s.status as sub_status
      FROM profiles p
      LEFT JOIN subscriptions s ON s.profile_id = p.id AND (s.status = 'active' OR s.status = 'trialing')
      WHERE p.id = ${payload.profileId}
      LIMIT 1
    `;

    if (profiles.length === 0) {
      return new Response(
        JSON.stringify({ error: "Profile not found", authenticated: false }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const profile = profiles[0];
    const plan = profile.plan || "free";

    return new Response(
      JSON.stringify({
        authenticated: true,
        user: {
          id: profile.id,
          email: profile.email,
          displayName: profile.display_name,
          stripeCustomerId: profile.stripe_customer_id,
          plan,
        },
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    // JWT invalid or expired
    return new Response(
      JSON.stringify({ error: "Session expired", authenticated: false }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }
};

export const config: Config = {
  path: "/api/auth/session",
};
