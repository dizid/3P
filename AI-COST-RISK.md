# AI Cost / Abuse Risk — Public Endpoint, Not Yet Monetized

## Status
Disabled — 1 endpoint, default-on demo mode

## Date
2026-07-20

## Risk level
Scanner flagged this project for Anthropic use with a non-recursive scan (`ok(0)` — the
call site is inside `netlify/functions/`, so it should actually have been caught, but is
noted here per the portfolio effort's manual-check requirement). On inspection: one live
Netlify Function, `netlify/functions/analyze-decision.mts`, imports `@anthropic-ai/sdk`
and calls `client.messages.create()` directly — this is the only Anthropic call site in
the repo (confirmed via `grep -rniE "anthropic|claude|messages\.create"` across `src/`,
`netlify/functions/`, `scripts/`; the only other hits are marketing copy referencing
"Claude Sonnet" as a pricing-page feature bullet).

## What was found

**Live, publicly deployed, reachable endpoint** — this is not a build-time script:
- Site is deployed and serving: `de3ps` (Netlify site id `a5e53b4a-5519-4c1e-b21e-0ad9c9846503`), primary URL `https://3p.tnxz.nl`, current deploy state `ready`, no password/SSO gate on the project.
- `analyze-decision.mts` is routed publicly at `/api/analyze-decision` (`export const config = { path: "/api/analyze-decision" }`), called from `src/services/aiService.js` on every "get AI analysis" and "get AI guidance" action across all 8 decision tools.

**Auth on this endpoint is weak, not real user auth:**
- The only gate is a shared `x-api-key` header checked against `APP_API_KEY`. The value is also exposed to the client as `VITE_APP_API_KEY` and shipped in the built JS bundle (`src/services/aiService.js`) — anyone can read it out of devtools/bundle and call the endpoint directly with curl, exactly the "weakly-authenticated" case this remediation effort targets.
- A JWT (`Authorization: Bearer`) is optionally checked to look up a paid `pro` plan via `getAuthProfileId()` + `subscriptions` table, but it is **not required** — omitting it simply defaults to the `free` tier. Free tier is still a real (capped) Anthropic call, not a rejection.
- **Bug found in the free-tier rate limiter**: `checkRateLimit()` only persists usage counts for requests carrying a `profileId` (i.e., a valid JWT). For anonymous requests (no `profileId`), it unconditionally returns `{ allowed: true, remaining: 0 }` on every single call — there is no per-IP or per-session tracking, so the "1 free analysis/month" cap does not actually apply to anonymous traffic. Anyone with the extractable `APP_API_KEY` could script unlimited free-tier (Haiku, 400 tokens) calls.

**No evidence of real monetization** — checked all the signals this effort looks for:
- Local `.env` and the live Netlify env vars were both checked. Netlify env vars currently configured on the `de3ps` site are **only** `DATABASE_URL` and `VITE_APP_API_KEY`. There is no `ANTHROPIC_API_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `JWT_SECRET`, or (server-side) `APP_API_KEY` deployed. Practically, this means the live endpoint currently 401s on every request today (missing server-side `APP_API_KEY` causes the auth check to always fail) and would 500 even if that passed (no `ANTHROPIC_API_KEY`) — **zero real Anthropic spend is possible right now**, but only because required secrets were never deployed, not because of any real safeguard.
- Local `.env` has literal template placeholders that were never filled in, even for local dev: `STRIPE_SECRET_KEY=sk_test_...`, `VITE_STRIPE_PRICE_MONTHLY=price_...`, `VITE_STRIPE_PRICE_YEARLY=price_...`, `ANTHROPIC_API_KEY=sk-ant-...`, `RESEND_API_KEY=re_...`. Compare to clientpilot's escalated case, which had real hardcoded `price_1TJr2...` IDs — nothing like that exists here. `src/services/stripeService.js` even falls back to the literal strings `'price_monthly_placeholder'` / `'price_yearly_placeholder'` if the env var is unset.
- The project's own `CLAUDE.md` documents `stripeService.js` and `aiService.js` in its file table as "(placeholder)" and `AuthStore` as "(placeholder)" — consistent with an MVP scaffold, not a launched product, despite `aiService.js`'s file header claiming "Real AI-powered advice."
- `profiles` / `subscriptions` / `ai_usage` tables exist in `db/schema.sql` (real Neon DB is provisioned — `DATABASE_URL` is a genuine connection string, not a placeholder) but no webhook has ever received a real Stripe event in production since `STRIPE_WEBHOOK_SECRET` was never deployed.
- Git history is sparse and stale: last commit `e8650c8` "Fix dark mode across all 7 result components" on 2026-03-27 — about 4 months old as of this audit, no commits since. The Stripe/subscription/API-key work (`48d5c6b` "Add Pro subscription MVP", `f5a5d32` "Add API key authentication") landed 2026-03-07 and was not followed by iteration, hardening, or launch-related commits — unlike clientpilot's pattern of recent active anti-abuse commits.

**Conclusion**: live public (weakly-authenticated) endpoint, code fully wired to call Anthropic, but no real monetization evidence and no real secrets deployed today. This is the same "no evidence of real revenue -> disable via default-on demo mode" bucket as `underwear`, applied preventively: the code is one env var away from going live with the anonymous rate-limit bug above, so the guard was added now rather than waiting for that to happen unnoticed.

## Treatment applied

Added a default-on `DEMO_MODE` guard to `netlify/functions/analyze-decision.mts`, same pattern used elsewhere in this remediation effort — guard-not-delete, zero code change needed to re-enable later:

```ts
const DEMO_MODE = (Netlify.env.get("DEMO_MODE") ?? "true") !== "false"; // default ON

// ...inside the handler, after auth/subscription/rate-limit logic runs unchanged...
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
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}

// --- Live implementation below, unreachable while DEMO_MODE=true ---
const client = new Anthropic({ apiKey });
// ...unchanged...
```

Details:
- The `405` method check, `x-api-key` auth check, request-body validation, JWT-based subscription lookup, and Neon-backed rate limiting are all **unchanged** and still run before the guard — only the `client.messages.create()` call itself is gated.
- The `ANTHROPIC_API_KEY` requirement was relaxed to only apply `if (!DEMO_MODE && !apiKey)` — demo mode no longer needs a real key configured at all.
- Two mock analyses (`MOCK_FREE_ANALYSIS`, `MOCK_PRO_ANALYSIS`) match the real response JSON schema exactly, field-for-field, as documented in `buildPromptForTier()`'s own prompt templates — free tier returns `insight`/`blindSpots`/`nextStep`/`confidence`; pro tier additionally returns `coreInsight`/`biases`/`scenarios`/`frameworkFit`/`clarityScore`/`questions`. Verified against the one frontend consumer, `src/services/aiService.js`'s `transformAnalysis()`, which reads exactly these fields — no frontend changes needed.
- `model`, `plan`, `remaining`, and `resetDate` in the response are computed from the real (unchanged) tier/rate-limit logic, not hardcoded, so the mock response is contextually consistent with whichever plan the caller is on.
- No changes to `src/services/aiService.js`, `src/components/ai/*`, or any other file.

## Re-enable instructions

1. Set `DEMO_MODE=false` in Netlify environment variables (Site settings -> Environment variables), with `envVarIsSecret: false` so the function runtime can read it.
2. Also add the currently-missing `ANTHROPIC_API_KEY` (and, separately, `APP_API_KEY`, `JWT_SECRET`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` if launching billing) — none of these exist on the live site today.
3. Redeploy — Netlify Functions only pick up env var changes on the next deploy.
4. **Before flipping this on for a real launch**, fix the anonymous rate-limit gap found above: `checkRateLimit()` currently allows unlimited anonymous requests through with no persistent tracking (see "What was found"). Track anonymous usage by IP (Neon `ai_usage.user_identifier` already has a column for this, just isn't populated for the anonymous path) or require the JWT for any AI call. Otherwise the free tier is effectively uncapped the moment `DEMO_MODE=false` ships.
5. Rotate `VITE_APP_API_KEY`/`APP_API_KEY` before relying on it as a real gate — it is currently shipped in the client bundle and was never designed to be secret; treat it as basic bot-friction, not authentication.

## Verification

Type check (matches how Netlify would bundle the function; no separate build-time TS check exists in this project's `npm run build`, which only runs `vite build` for the frontend):
```
npx tsc --noEmit --skipLibCheck --target es2022 --module esnext --moduleResolution bundler netlify/functions/analyze-decision.mts
# exit 0, no output
```

Frontend build:
```
npm run build
# vite v4.x building for production...
# ✓ built, dist/assets/index-*.js emitted, no errors
```

esbuild bundle check (same bundler Netlify uses for `.mts` functions):
```
npx esbuild netlify/functions/analyze-decision.mts --bundle --platform=node --format=esm --outfile=...
# ⚡ Done, no errors
```

Functional check — invoked the handler directly in Node (mocked `globalThis.Netlify.env`, anonymous requests only so no real DB or API calls were made; verified with `git status`/`git diff` that no code outside this file changed):

```
1. DEMO_MODE unset (defaults ON), anonymous/free
   -> 200 { success: true, analysis: { insight, blindSpots, nextStep, confidence: "medium" }, model: "claude-3-haiku-20240307", plan: "free", remaining: 1 }

2. DEMO_MODE=true explicit, anonymous/free
   -> 200 (same mock shape as above)

3. DEMO_MODE on, x-api-key mismatch
   -> 401 { error: "Unauthorized" }   (auth check unchanged, still enforced under demo mode)

4. DEMO_MODE=false, no ANTHROPIC_API_KEY configured
   -> 500 { error: "AI service not configured" }   (opt-out path correctly falls through
      to requiring a real key rather than silently returning mock data — proves the
      guard branches correctly in both directions, with zero real Anthropic calls made
      during this check)

5. GET request
   -> 405 { error: "Method not allowed" }   (unchanged validation, still works)
```

No database was queried, no Stripe/Anthropic keys were used, and no other files were modified during verification.

## Provider console steps

**Anthropic** (console.anthropic.com -> Billing): even with `DEMO_MODE` on by default, this is a good time to confirm a spend cap/alert exists on the account this project's future `ANTHROPIC_API_KEY` would draw from, as a backstop for whenever the key is actually added.
