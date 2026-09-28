# Module 1: Click → Result — What Happens When You Use De 3 P's

### Teaching Arc
- **Metaphor:** A record player lowering its needle onto vinyl. The grooves were always there — the record (your app) was pressed when it was built — but nothing happens until the needle (the user click) drops. Then vibrations travel from needle → tonearm → cartridge → amplifier → speakers. Each stop transforms the signal, but none of it plays without that first touch.
- **Opening hook:** "You open the app. You pick '10-10-10 Rule'. You answer three sliders. A score appears. Feels instant, right? Here's what actually happens in those two seconds."
- **Key insight:** The app is made of *small independent parts* that only do something when triggered by a user action. Nothing runs "on its own" — every bit of code waits for a click, a keystroke, or a page load.
- **"Why should I care?":** When you ask AI to "add a new decision tool," knowing this flow means you can say "the form goes here, the scoring goes in the store, the result shows here" — precise instructions beat vague ones.

### What this app does (for the opening of the course)
De 3 P's is a decision-support web app. Eight different frameworks (like "10-10-10 Rule", "Regret Minimization", "Coin Flip Test") help you think through a hard choice. You fill out a short form, the app calculates a score, and gives you a recommendation. Your history saves so you can revisit decisions later.

### Tech stack (2 sentences each)
- **Vue 3** — The framework that runs in your browser. It turns your code into HTML that users see, and makes the page update automatically when data changes (no manual DOM juggling).
- **Vite** — The build tool. When you save a file while developing, Vite updates your browser in under a second. In production, it packages everything into compact files users download.
- **Pinia** — The shared memory. When the form needs to pass data to the result screen, it goes through a Pinia "store" — a central bucket both screens can read and write.
- **Tailwind CSS** — The styling system. Instead of writing CSS in separate files, you add classes like `bg-blue-500` or `p-4` directly in your HTML. Faster, more consistent.
- **Vue Router** — Handles navigation. When the URL changes from `/tools` to `/tools/10-10-10`, Vue Router swaps out which component is shown, without reloading the page.

### Code Snippets (pre-extracted)

**Snippet 1 — The router decides which view to show**

File: `src/router/index.js` (lines 38-42)
```js
{
  path: '/tools/10-10-10',
  name: 'tententen',
  component: () => import('../views/TenTenTenView.vue')
},
```

**Snippet 2 — The store holds the answers**

File: `src/stores/ToolsStore.js` (lines 7-13)
```js
// 10-10-10 Rule State
tententen: {
  decision: '',
  feel10min: 50,
  feel10months: 50,
  feel10years: 50
},
```

**Snippet 3 — The getter calculates the score live**

File: `src/stores/ToolsStore.js` (lines 85-91)
```js
tententenScore: (state) => {
  return Math.round(
    (state.tententen.feel10min * 0.15) +
    (state.tententen.feel10months * 0.35) +
    (state.tententen.feel10years * 0.50)
  )
},
```

**Snippet 4 — The advice getter returns a verdict**

File: `src/stores/ToolsStore.js` (lines 93-102)
```js
tententenAdvice: (state) => {
  const score = Math.round(
    (state.tententen.feel10min * 0.15) +
    (state.tententen.feel10months * 0.35) +
    (state.tententen.feel10years * 0.50)
  )
  if (score >= 60) return { text: 'Go for it!', type: 'positive' }
  if (score >= 40) return { text: 'Consider carefully', type: 'neutral' }
  return { text: 'Probably not', type: 'negative' }
},
```

### Interactive Elements

- [x] **Code↔English translation** — Snippet 3 (the scoring getter). Line by line: `tententenScore: (state) =>` = "Here's a live number the store will calculate and share". `Math.round(...)` = "Round the number so we don't show decimals". `state.tententen.feel10min * 0.15` = "Short-term feelings count for 15%". The weights add up to 100%.
- [x] **Quiz** — 3 questions, scenario style.
  1. "The user reports: 'I'm changing the sliders but the score doesn't update'. Where would you look first?" Options: (a) the HTML template, (b) the Pinia getter, (c) the CSS, (d) the router. Correct: (b) — getters recalculate when state changes, so if the score is frozen, the getter isn't reading the updated state.
  2. "You want to add a 4th slider (e.g., '10 days') without changing the code for 10min/months/years. Which file do you touch?" Options: (a) the router, (b) the form component only, (c) both the store AND the form component, (d) the Vue config. Correct: (c) — state lives in the store, the UI lives in the component, so both need the new field.
  3. "A user opens the URL `/tools/10-10-10` directly in a fresh browser tab. What does the router do?" Options: (a) redirects to home, (b) shows a 404, (c) lazy-loads `TenTenTenView.vue` and renders it, (d) errors out. Correct: (c) — the `() => import(...)` pattern means the code isn't downloaded until the route is visited.
- [x] **Data flow animation** — Actors: `User`, `Form Component`, `Pinia Store`, `Result Component`. Steps:
  1. User drags "10 months" slider to 80 → highlight User + Form
  2. Form writes `state.tententen.feel10months = 80` → packet flies Form → Store
  3. Store's `tententenScore` getter recalculates → highlight Store with sparkle
  4. Result Component re-renders with new score → packet flies Store → Result
  5. User sees "Go for it!" → highlight Result
- [x] **Group chat animation** — Chat between Router, TenTenTenView, and ToolsStore when the user visits `/tools/10-10-10`:
  - **Router**: "Hey, the URL says /tools/10-10-10. Who handles this?"
  - **TenTenTenView**: "That's me. Let me load…"
  - **Router**: "Mounting you now."
  - **TenTenTenView**: "ToolsStore, are you there? I need your tententen state."
  - **ToolsStore**: "Here you go: `{ feel10min: 50, feel10months: 50, feel10years: 50 }`"
  - **TenTenTenView**: "Thanks! Rendering the form with those defaults now."
- [x] **Glossary tooltips** — Aggressive. First-use terms to tooltip:
  - **component** — "A reusable piece of UI with its own HTML, styles, and logic. Like a LEGO brick you can snap into different places."
  - **state** — "Data the app remembers. When it changes, the UI updates automatically."
  - **store** — "A shared bucket of state that multiple components can read from and write to."
  - **getter** — "A computed value that automatically updates when its source data changes. Like a spreadsheet formula."
  - **route** — "A mapping from a URL path to which component to show. Like a phone book for your app."
  - **lazy-load** — "Don't download a chunk of code until it's actually needed. Makes the app start faster."
  - **framework** — "A pre-built structure that handles the boring parts so you can focus on what makes your app unique."
  - **Vue** — "A JavaScript framework for building interactive web apps. Competes with React and Svelte."
  - **Pinia** — "Vue's official state management library. The store system this app uses."
  - **reactivity** — "When you change data, the screen updates automatically — no manual refresh needed."

### Reference Files to Read
- `references/interactive-elements.md` → "Code↔English Translation Blocks", "Multiple-Choice Quizzes", "Data Flow / Message Flow Animation", "Group Chat Animation", "Glossary Tooltips"
- `references/content-philosophy.md` → the whole file
- `references/gotchas.md` → the whole file
- `references/design-system.md` → color tokens, typography scale

### Connections
- **Previous module:** None — this is module 1. Open with a 1-paragraph "What is De 3 P's?" intro before diving in.
- **Next module:** "Meet the Cast" — we've traced one flow. Next, we zoom out and see all the actors (views, components, stores, services).
- **Tone/style notes:** Accent color = "vermillion" (warm orange-red). Actor naming: "ToolsStore", "TenTenTenView", "Router" — use the real code names, not invented ones. Keep the metaphor consistent (record player → needle → amplifier).
