# Module 2: Meet the Cast — Views, Components, Stores, Services

### Teaching Arc
- **Metaphor:** A film production crew. There's the *director* (the app's main layout), *actors on camera* (views = what users see), *set pieces* (components = reusable UI parts), the *script supervisor* (stores = who remembers what's been said), and *off-set specialists* (services = people you call when you need something from outside). Everyone has a role. Everyone knows when it's their scene.
- **Opening hook:** "In Module 1 we followed one user click. Now let's zoom out. Your app has ~60 code files. Who does what?"
- **Key insight:** Code isn't a monolith — it's a cast of characters with clearly defined jobs. Knowing *who does what* is the superpower that lets you ask AI "put the login logic in the AuthStore, not the AuthView."
- **"Why should I care?":** When AI puts business logic in a button component, or fetches data in a view instead of a store, it's breaking the cast. Knowing the roles means you can spot the mistake and redirect.

### Code Snippets (pre-extracted)

**Snippet 1 — A View: thin wrapper that composes components**

File: `src/views/TenTenTenView.vue` (entire file, abbreviated in the course)
```vue
<template>
  <div class="min-h-screen py-8 px-4">
    <div class="max-w-4xl mx-auto">
      <ToolHeader
        icon="&#9200;"
        title="10-10-10 Rule"
        description="How will you feel in 10 minutes, 10 months, and 10 years?"
        color="#3b82f6"
      />
      <GutCheck v-if="!showResult" v-model="gutFeeling" />
      <TenTenTenForm v-if="!showResult" @complete="showResult = true" />
      <TenTenTenResult v-else @back="showResult = false" @reset="reset" />
    </div>
  </div>
</template>
```

**Snippet 2 — A Store: shared state + derived values**

File: `src/stores/ToolsStore.js` (lines 1-13)
```js
import { defineStore } from 'pinia'

export const useToolsStore = defineStore({
  id: 'ToolsStore',

  state: () => ({
    // 10-10-10 Rule State
    tententen: {
      decision: '',
      feel10min: 50,
      feel10months: 50,
      feel10years: 50
    },
```

**Snippet 3 — A Shared Component: pure UI, no logic**

File: `src/components/shared/GutCheck.vue` (lines 1-23)
```vue
<template>
  <div class="glass mb-6 rounded-xl border border-dashed border-gray-300 dark:border-slate-600 px-4 py-3">
    <p class="text-xs text-gray-500 dark:text-gray-400 mb-2 font-medium tracking-wide uppercase">
      Before you start &mdash; what&rsquo;s your gut telling you?
    </p>
    <div class="flex gap-2 flex-wrap">
      <button
        v-for="option in options"
        :key="option.value"
        type="button"
        @click="select(option.value)"
      >
        {{ option.label }}
      </button>
    </div>
  </div>
</template>
```

**Snippet 4 — A Service: talks to the outside world**

File: `src/services/aiService.js` (lines 38-50)
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
```

### Interactive Elements

- [x] **Code↔English translation** — Snippet 1 (TenTenTenView). Teach the template syntax line by line. `<ToolHeader ... />` = "render the ToolHeader component with these settings." `v-if="!showResult"` = "only show this if showResult is false." `@complete="showResult = true"` = "when the form says 'complete', set showResult to true." `v-model="gutFeeling"` = "two-way binding — the GutCheck component can read AND write this variable."
- [x] **Quiz** — 3-4 questions.
  1. "You're asked to add a 'download as PDF' button. The PDF generation logic itself — where should it go?" Options: (a) in the result component, (b) in a new service, (c) in the Pinia store, (d) in the router. Correct: (b) — generating PDFs is an I/O-ish, reusable capability. Services are the "off-set specialists" for things components shouldn't worry about.
  2. "A button that only exists on the pricing page — component or view?" Options: (a) View, because it's a page, (b) Component, because it's reusable, (c) Component, even though it's used once — components are still the right place for UI pieces, (d) Put it directly in App.vue. Correct: (c) — views compose components, even one-off UI is better as a small component.
  3. "The `tententenScore` formula changes (weights update). Where do you edit?" Options: (a) the view, (b) the form component, (c) the store getter, (d) all three. Correct: (c) — scoring logic lives in the store. The UI reads the result; it doesn't recompute.
  4. "A user says 'my decision wasn't saved'. Which actor is the prime suspect?" Options: (a) the View, (b) ToolsStore, (c) HistoryStore, (d) Vue Router. Correct: (c) — saving decisions is the HistoryStore's job.
- [x] **Architecture diagram / cast of characters** — Visual grid with icons for each actor:
  - **App.vue** (director) — the layout shell: nav, main content area, footer
  - **Views** (on-camera actors) — 18 files under `src/views/*.vue`. One per URL path.
  - **Shared Components** (set pieces) — `ToolCard`, `ToolHeader`, `GutCheck`, `PostDecisionCoach`, `SaveToHistoryButton`, etc.
  - **Tool-specific Components** (specialized actors) — `TenTenTenForm`, `TenTenTenResult`, etc. — live under `src/components/{tool}/`.
  - **Pinia Stores** (script supervisors) — `ToolsStore` (all 8 tool states + scoring), `HistoryStore` (saved decisions + server sync), `AuthStore` (who's logged in), `SubscriptionStore` (free vs Pro), `ThemeStore` (light/dark).
  - **Services** (off-set specialists) — `aiService.js` (calls the Claude AI), `stripeService.js` (billing).
  - **Netlify Functions** (the outside world — handled in Module 4) — preview only.

  Each gets a card with: icon, name, role in one sentence, example file.
- [x] **Group chat animation** — "A decision saves" scenario, actors: `SaveToHistoryButton`, `HistoryStore`, `localStorage`, `Netlify Function`, `Neon Database`.
  - Button: "Hey HistoryStore, the user wants to save this decision."
  - HistoryStore: "Got it. First, saving to localStorage so it's instant."
  - localStorage: "Done. ✓"
  - HistoryStore: "User's logged in — let me also sync to the server."
  - Netlify Function: "Received POST /api/decisions. Verifying the JWT..."
  - Netlify Function → Neon: "INSERT INTO decisions..."
  - Neon: "Row created. ✓"
  - HistoryStore: "All synced."
- [x] **Glossary tooltips** — first-use this module:
  - **view** — "A component that maps 1-to-1 with a URL. If you navigate to `/history`, the HistoryView shows. If you go to `/tools`, the ToolsHomeView shows."
  - **template** — "The HTML part of a Vue component. It describes what the user sees."
  - **directive** — "A special attribute starting with `v-` (like `v-if`, `v-model`) that tells Vue to do something — show/hide, bind data, loop over a list."
  - **prop** — "Data passed down from a parent component to a child component. Read-only from the child's perspective."
  - **event** — "A message a child component sends up to its parent. The parent listens with `@eventName`."
  - **service** — "A plain JavaScript module (no UI) that wraps external interactions — API calls, payments, third-party libraries."
  - **JWT** — "JSON Web Token. A signed string that proves who you are to the server. Like a tamper-proof hall pass."
  - **Netlify Function** — "A tiny piece of server code that runs on-demand when called. No server to manage. Covered in Module 4."
  - **Neon** — "A cloud Postgres database. Stores data that needs to survive the user closing their browser."
  - **localStorage** — "A per-browser storage bucket. Persists between sessions but only on that one device."
  - **two-way binding** — "`v-model` — when either side changes (user types OR data updates), the other follows automatically."

### Reference Files to Read
- `references/interactive-elements.md` → "Code↔English Translation Blocks", "Multiple-Choice Quizzes", "Group Chat Animation", "Architecture Diagrams / Pattern Cards", "Glossary Tooltips"
- `references/content-philosophy.md` → the whole file
- `references/gotchas.md` → the whole file

### Connections
- **Previous module:** Module 1 traced one user flow end-to-end. We know a click eventually produces a score.
- **Next module:** "How the Pieces Talk" — we've met the cast, now we see the communication patterns (props down, events up, reactive state, router.push).
- **Tone/style notes:** Same vermillion accent. Keep the "cast of characters" metaphor running.
