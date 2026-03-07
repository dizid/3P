import type { Context, Config } from "@netlify/functions";
import { neon } from "@neondatabase/serverless";
import crypto from "crypto";

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

  const resendKey = Netlify.env.get("RESEND_API_KEY");
  if (!resendKey) {
    return new Response(
      JSON.stringify({ error: "Email service not configured" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return new Response(
        JSON.stringify({ error: "Valid email is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const sql = getDb();

    // Create or get profile
    const profiles = await sql`
      INSERT INTO profiles (email, email_verified)
      VALUES (${normalizedEmail}, FALSE)
      ON CONFLICT (email) DO UPDATE SET updated_at = NOW()
      RETURNING id, email, display_name
    `;
    const profile = profiles[0];

    // Generate magic link token (URL-safe, 48 chars)
    const token = crypto.randomBytes(32).toString("base64url");
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Store token
    await sql`
      UPDATE profiles
      SET magic_link_token = ${token}, token_expires_at = ${expiresAt.toISOString()}
      WHERE id = ${profile.id}
    `;

    // Build magic link URL
    const siteUrl = Netlify.env.get("URL") || "http://localhost:8888";
    const magicLink = `${siteUrl}/auth/verify?token=${token}`;

    // Send email via Resend
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "3PS <noreply@3p.tnxz.nl>",
        to: [normalizedEmail],
        subject: "Log in to 3PS - Decision Support",
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
            <h2 style="color: #1f2937; margin-bottom: 8px;">Log in to 3PS</h2>
            <p style="color: #6b7280; margin-bottom: 24px;">Click the button below to log in. This link expires in 15 minutes.</p>
            <a href="${magicLink}" style="display: inline-block; background: #3b82f6; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600;">Log In</a>
            <p style="color: #9ca3af; font-size: 14px; margin-top: 24px;">If you didn't request this, you can safely ignore this email.</p>
          </div>
        `,
      }),
    });

    if (!emailResponse.ok) {
      const errorData = await emailResponse.text();
      console.error("Resend error:", errorData);
      throw new Error("Failed to send email");
    }

    return new Response(
      JSON.stringify({ success: true, message: "Magic link sent" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Magic link error:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to send login link",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

export const config: Config = {
  path: "/api/auth/send-magic-link",
};
