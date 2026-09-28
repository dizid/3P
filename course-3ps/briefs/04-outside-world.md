# Module 4: The Outside World — APIs, Claude AI, Database, Stripe

### Teaching Arc
- **Metaphor:** A lighthouse keeper. Most of your work is *inside* the lighthouse — polishing the lens, trimming the wicks, logging the weather. But when a ship calls on the radio, you talk to the outside. Each outside call has a cost (radio battery, attention, potential miscommunication) and can fail (static, no signal, ship doesn't answer). The lighthouse runs fine without the radio — but it's *much more useful* when the radio works.
- **Opening hook:** "Everything we've seen so far runs in your browser. But the app also talks to Claude AI for smart advice, saves decisions to a database, and charges money via Stripe. How?"
- **Key insight:** External calls are different. They take time, they can fail, and they cost money (Claude API, database queries, Stripe transactions). The app is designed to work *without them when possible* — that's why everything saves to localStorage first, and the server sync is a bonus.
- **"Why should I care?":** When AI writes code that calls an external API, ask: "What happens if it fails? What if it's slow? Does this cost money per call?" Those three questions catch 80% of production bugs.

### Code Snippets (pre-extracted)

**Snippet 1 — A Netlify Function: server code that runs on-demand**

File: `netlify/functions/analyze-decision.mts` (lines 1-23)
```ts
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
```

**Snippet 2 — Frontend service: calls the Netlify Function**

File: `src/services/aiService.js` (lines 39-56)
```js
async getAnalysisSummary(tool, data, decision = '', score = null) {
  try {
    const response = await fetch(`${API_BASE}/api/analyze-decision`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        tool,
        data,
        decision: decision || data.decision || 'This decision',
        score
      })
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('AI analysis failed:', error)
```

**Snippet 3 — Offline-first: save locally first, sync to server after**

File: `src/stores/HistoryStore.js` (lines 88-112)
```js
// Always save locally
this.decisions.push(newDecision)
this.saveToLocalStorage()

// If authenticated, also save to server
if (authStore.isAuthenticated) {
  try {
    await fetch(`${API_BASE}/api/decisions`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        tool: decision.tool,
        title: decision.decision || decision.title || 'Untitled Decision',
        description: decision.recommendation || null,
        data: decision.data || {},
        score: decision.score || null,
        adviceType: decision.recommendationType || null
      })
    })
  } catch (err) {
    console.error('Failed to sync decision to server:', err)
  }
}
```

**Snippet 4 — JWT auth: prove who you are**

File: `src/stores/HistoryStore.js` (lines 8-18)
```js
const getHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
    'x-api-key': API_KEY
  }
  const token = localStorage.getItem('auth_token')
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  return headers
}
```

### Interactive Elements

- [x] **Code↔English translation** — Snippet 3 (the "offline-first" save). Teach:
  - `this.decisions.push(newDecision)` = "Add it to the in-memory list right now — no waiting."
  - `this.saveToLocalStorage()` = "Persist to the browser's local storage, in case they refresh."
  - `if (authStore.isAuthenticated)` = "Only bother with the server if they're logged in."
  - `try { ... } catch (err) { console.error(...) }` = "If the server call fails, don't crash — just log the error. The local save already worked."
  - The insight: saving never fails from the user's perspective, because local save is synchronous and instant.
- [x] **Quiz** — 3-4 questions.
  1. "Your serverless function calls Claude AI. A user reports it's suddenly slow (5s instead of 1s). What's NOT a likely cause?" Options: (a) Claude is busy, (b) your database query before Claude is slow, (c) your frontend CSS, (d) network latency between Netlify and Anthropic. Correct: (c) — CSS is in-browser, external calls are the suspects.
  2. "You want to add 'export to PDF' as a paid feature. Which tier of the checklist does this match?" Options: (a) it should be free — it's just a button, (b) it should be Pro because PDF generation uses server compute and libraries — real costs, (c) make it Pro because Pro users deserve more, (d) doesn't matter. Correct: (b) — features that cost actual money per use (compute, AI tokens, bandwidth) are the natural Pro candidates.
  3. "A Netlify Function reads `Netlify.env.get('DATABASE_URL')`. Why not put the URL directly in the code?" Options: (a) saves typing, (b) environment variables are private — the URL stays out of git history and can be rotated without redeploying code, (c) Netlify doesn't allow hardcoded strings, (d) TypeScript requires it. Correct: (b) — secrets in code = leaked on GitHub = bad day.
  4. "Your app uses Stripe to handle payments. The user reports 'I paid but I'm still on the free plan'. Where would you look?" Options: (a) the pricing page, (b) the Stripe webhook handler — Stripe tells your server when a payment completes, and if the webhook fails, your DB never updates, (c) the frontend, (d) Vue Router. Correct: (b) — webhook failures are THE classic cause of "paid-but-unprovisioned" bugs.
- [x] **Group chat animation** — "The user asks Claude for decision advice" scenario. Actors: `User`, `Frontend`, `Netlify Function`, `Neon Database`, `Claude API`.
  - User: "Click 'Get AI Advice'"
  - Frontend: "POST /api/analyze-decision with the decision data + auth token"
  - Netlify Function: "Let me verify the JWT..." (quick check)
  - Netlify Function → Neon: "Check rate limit — has this user used their free analysis this month?"
  - Neon: "Yes, they have 0 used. Go ahead."
  - Netlify Function → Claude: "Hey Claude, here's a decision. Give me: insight, blind spots, next step. Max 400 tokens." (Haiku for free users)
  - Claude: *writes response*
  - Netlify Function → Neon: "Log this usage (user X, month Y, +1)"
  - Netlify Function → Frontend: "Here's the analysis"
  - Frontend: "Render it in AiAdvicePanel"
- [x] **Architecture diagram** — A two-column layout: "In Your Browser" vs "Outside World". Left side: Vue app, stores, components. Right side: Netlify Functions, Claude API, Neon Postgres, Stripe. Arrows showing which talks to which. Each external box gets a short "what it does" + "what it costs" annotation.
- [x] **Glossary tooltips** — aggressive:
  - **API** — "Application Programming Interface. A menu of functions another program can call. 'POST /api/analyze-decision' is an API endpoint."
  - **serverless** — "Code that runs on someone else's server *only when called*. You don't manage the server, don't pay when idle, and it scales automatically."
  - **Netlify** — "A hosting platform. Serves your static frontend AND runs your serverless functions. Competitors: Vercel, Cloudflare."
  - **fetch** — "Built-in browser function to make HTTP requests. The modern replacement for XMLHttpRequest."
  - **HTTP method** — "A verb saying what you want to do: GET (read), POST (create), PATCH (update), DELETE (remove)."
  - **endpoint** — "A specific URL an API exposes. `/api/decisions` is one endpoint; `/api/analyze-decision` is another."
  - **headers** — "Metadata attached to a request/response. Tells the server your content type, authentication, etc."
  - **JWT** — "JSON Web Token. A signed string proving you're logged in. Sent in the `Authorization: Bearer ...` header."
  - **magic link** — "Instead of passwords, you get an email with a one-click login link. What this app uses for auth."
  - **Anthropic** — "The company that makes Claude. Their API lets you send text and get AI responses."
  - **Claude** — "A large language model. The AI used in this app for decision advice."
  - **Haiku / Sonnet** — "Two sizes of Claude. Haiku is cheap and fast; Sonnet is smarter but costs more. Free users get Haiku, Pro users get Sonnet."
  - **tokens** — "The AI's unit of text. Roughly 1 token = 4 characters. You pay per token in/out."
  - **rate limit** — "A cap on how often you can call an API. Prevents abuse and runaway bills."
  - **environment variable** — "A secret value (like an API key or DB password) set on the server, not in your code. Accessed via `Netlify.env.get()`."
  - **Postgres** — "A popular open-source database. Neon is a cloud Postgres service."
  - **Stripe** — "A payment processor. Handles credit cards, subscriptions, refunds so you don't have to."
  - **webhook** — "A URL on your server that Stripe (or any third party) calls when something happens — e.g., 'a payment just completed'."
  - **optimistic update** — "Update the UI immediately assuming success; if the server rejects it, roll back. Used here for 'save decision'."

### Reference Files to Read
- `references/interactive-elements.md` → "Code↔English Translation Blocks", "Multiple-Choice Quizzes", "Group Chat Animation", "Architecture Diagrams"
- `references/content-philosophy.md` → full file
- `references/gotchas.md` → full file

### Connections
- **Previous module:** Module 3 covered in-browser communication (reactivity, props, events).
- **Next module:** "Bugs and Battles" — real git-history stories from this project. The nav overlap saga, dark mode audits, the 4-attempt fix.
- **Tone/style notes:** Keep the lighthouse metaphor running. External calls = radio transmissions. Each has cost and failure modes.
