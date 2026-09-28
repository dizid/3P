# Module 5: Bugs and Battles — Real Fixes From This Codebase

### Teaching Arc
- **Metaphor:** A detective's casebook. Each bug is a case file. There's the symptom (what the user saw), the prime suspects (what might have caused it), the interrogation (how you narrowed it down), the confession (the actual cause), and the fix. Good detectives don't guess — they follow evidence. Same with debugging.
- **Opening hook:** "This isn't a theoretical course. This app has real bugs in its git history — some took 4 attempts to fix. Here are the best ones, and what they teach."
- **Key insight:** Almost every frustrating bug has a boring cause: something in the system that *seems* like it should work but doesn't, because of an invisible rule (like CSS stacking contexts). When AI gets stuck in a bug loop, it's because AI only knows the *visible* rules. Your job is to name the invisible one.
- **"Why should I care?":** The #1 AI-assisted coding failure mode is the "bug loop" — AI suggests fix A, you try it, doesn't work, AI suggests fix B (related to A), doesn't work, repeat. Knowing how to *break the loop* by reframing the problem is the single highest-leverage skill.

### The Case File: Nav Overlap Saga
This really happened in this codebase. 4 commits attempted to fix a single bug:

| # | Commit | What was tried | Result |
|---|--------|---------------|--------|
| 1 | `df3e862` | Make nav background fully opaque with `!important` | Still overlapped |
| 2 | `ff98905` | Add `isolate` (new stacking context) to `<main>` | Still overlapped |
| 3 | Unnumbered | Set `z-0` on `<main>` | Still overlapped |
| 4 | `7b69ec5` | Set `-z-10` on `<main>` | STILL overlapped (user very frustrated) |
| 5 | `eec1314` | **Change nav from `sticky` to `fixed`, remove transform-based page transitions** | FIXED |

The invisible rule: CSS `transform` creates a new stacking context. The nav was `position: sticky` (still in normal flow). During page transitions, the router-view's `translateX` created a stacking context that could paint *above* the sticky nav, regardless of z-index values. No z-index tweak could fix it because the issue wasn't z-index — it was that the nav stayed in the document flow while transforms created their own layer "lifted" above it.

### Code Snippets (pre-extracted)

**Snippet 1 — The broken approach (what didn't work)**

Before (one of the 4 failed attempts):
```vue
<nav class="glass dark:glass-dark sticky top-0 z-50 ..." aria-label="Main navigation">
  ...
</nav>
<main id="main-content" class="relative -z-10 isolate">
  <RouterView v-slot="{ Component, route }">
    <Transition name="page" mode="out-in">
      <component :is="Component" :key="route.path" />
    </Transition>
  </RouterView>
</main>
```

```css
/* OLD page transition — uses transform */
.page-enter-from { opacity: 0; transform: translateX(20px); }
.page-leave-to { opacity: 0; transform: translateX(-20px); }
```

**Snippet 2 — The fix that actually worked**

File: `src/App.vue` (around line 29)
```vue
<nav class="fixed top-0 left-0 right-0 z-50 ... nav-bar" aria-label="Main navigation">
  ...
</nav>

<main id="main-content" class="pt-16 sm:pt-20" tabindex="-1">
```

File: `src/style.css` (new page transitions)
```css
/* ===== PAGE TRANSITIONS (opacity only — no transforms to avoid z-index issues) ===== */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.25s ease;
}

.page-enter-from {
  opacity: 0;
}

.page-leave-to {
  opacity: 0;
}
```

**Snippet 3 — The debugging red flags (how you could have spotted it)**

Three signals that said "this isn't a z-index problem":
1. Every z-index tweak produced the *same* bug — not a different one.
2. The bug only happened during route transitions, not on a static page.
3. The transitions used `transform` — and CSS has a well-known rule: `transform` creates stacking contexts.

If you Googled "sticky nav overlap transform", the first result would have explained it on attempt 1.

### Interactive Elements

- [x] **Code↔English translation** — Snippet 2 (the fix). Teach:
  - `fixed top-0 left-0 right-0` = "The nav is taken OUT of the document flow and pinned to the top of the viewport. It's no longer affected by anything that happens inside `<main>`."
  - `pt-16 sm:pt-20` = "Since the nav is out of flow, add top padding to `<main>` to prevent content from slipping under the nav."
  - `transition: opacity 0.25s ease` = "Fade in/out only. No movement. No transforms = no new stacking contexts = no overlap."
- [x] **Quiz — "spot the invisible rule" edition** — 4 scenarios.
  1. "A user reports: 'After I log out, the page still shows my name for a second'. What's the invisible rule?" Options: (a) Slow network, (b) reactive computed values may hold a stale reference to the old user object after logout, or the component hasn't re-rendered yet, (c) database caching, (d) the server. Correct: (b) — classic "state change doesn't propagate" bug. Check if `user` is re-derived from the store after logout.
  2. "A form works in dev but not production. What's the invisible rule most likely in play?" Options: (a) different Vue version, (b) env variables differ (API_BASE, keys) between dev and prod, (c) Tailwind broke, (d) the server crashed. Correct: (b) — nine times out of ten, it's env vars.
  3. "AI suggests '+ `!important`' to fix a CSS issue. Should you accept?" Options: (a) always — `!important` always wins, (b) almost never — it usually masks the real issue (wrong specificity, wrong layer), and it compounds over time, (c) only in dev, (d) only in Tailwind. Correct: (b) — `!important` is a code smell. If you need it, the real problem is elsewhere.
  4. "Your app works on desktop but the nav overlaps the content on mobile Safari only. What are you investigating?" Options: (a) iOS-specific CSS quirks (100vh vs 100dvh, safe-area-inset, backdrop-filter), (b) Vue doesn't work on Safari, (c) Tailwind has a mobile bug, (d) reinstall the app. Correct: (a) — mobile Safari has real, documented quirks. The other choices are AI-loop traps.
- [x] **Pattern cards — "How to break an AI bug loop"** — 4 cards:
  1. **Reframe the question** — "Stop asking 'how do I fix X?' Start asking 'what class of problem is this?' Nav overlap → stacking contexts. Stale data → reactivity. Flickering → layout shift."
  2. **Look for the invisible rule** — "Every framework has unwritten rules that AI doesn't volunteer. Vue reactivity, CSS stacking contexts, React's rules of hooks. Name the invisible rule and the fix usually follows."
  3. **Check the git history** — "If AI is going in circles, look at the last 5 commits that touched this file. You'll often see the same bug was fixed (or attempted) before."
  4. **Try the radical opposite** — "If you've tried z-index 10, 50, 100, 9999 — the problem isn't z-index. Switch approach entirely (sticky → fixed, absolute → flex, useEffect → useMemo)."
- [x] **Group chat animation** — "Debugging session where a senior dev walks a junior through the nav overlap"
  - **Junior**: "I tried `z-index: 9999` and it still overlaps!"
  - **Senior**: "How does the overlapping content get its z-index?"
  - **Junior**: "Wait, it doesn't have one..."
  - **Senior**: "Right. So what's lifting it above your nav?"
  - **Junior**: "...`transform: translateX(20px)` on the page transition?"
  - **Senior**: "Bingo. Transform creates a stacking context. Your sticky nav is stuck in the document's stacking context; the transformed content has its own. Z-index comparisons only work within the SAME context."
  - **Junior**: "So the fix is..."
  - **Senior**: "Either remove the transform, or take the nav out of the document flow entirely with `position: fixed`. Your pick."
- [x] **Glossary tooltips** — this module:
  - **stacking context** — "A group of elements that share a single 'z-axis' (front-to-back ordering). CSS has rules for what creates one (transform, opacity < 1, position: fixed, etc.). Z-index only works within a context, not across."
  - **z-index** — "The CSS property that controls front-to-back ordering. But only within the same stacking context. (This is the subtle part.)"
  - **sticky vs fixed** — "`sticky` stays in document flow and sticks when scrolled past a threshold. `fixed` is removed from document flow entirely and pinned to the viewport."
  - **position: absolute** — "Removed from flow, positioned relative to the nearest positioned ancestor. Useful for overlays."
  - **document flow** — "The normal top-to-bottom arrangement of elements on a page. `position: fixed` and `absolute` take elements OUT of the flow."
  - **DOM** — "Document Object Model. The tree of HTML elements that makes up the page. Vue manipulates the DOM for you."
  - **bug loop** — "When AI (or you) keeps trying related fixes that don't work, because you haven't identified the real cause. Breaking the loop requires reframing the problem."
  - **`!important`** — "A CSS override that wins against regular rules. Overusing it usually means you've got the wrong selector specificity or the wrong layer."
  - **code smell** — "A sign that something is off in the code, even if it works. Excessive `!important`, enormous functions, copy-paste patterns."
  - **commit** — "A saved snapshot of your code at one moment, with a message explaining the change."
  - **git log** — "The history of commits. Reading it tells you the story of how the codebase evolved and what's been tried."

### Reference Files to Read
- `references/interactive-elements.md` → "Code↔English Translation Blocks", "Multiple-Choice Quizzes", "Group Chat Animation", "Pattern Cards"
- `references/content-philosophy.md` → full file
- `references/gotchas.md` → full file

### Connections
- **Previous module:** Module 4 covered external services (Claude, Neon, Stripe).
- **Next module:** None — this is the final module. End with a "What now?" section: 3 suggestions for things the learner could ask AI to build next on top of this codebase (e.g., "add a 9th decision tool", "build a streak tracker", "add outcome reminders"). Final line: "You've got the map. Go explore."
- **Tone/style notes:** Detective/casebook tone. Keep it punchy — the fun is in the whodunit reveal. End the course with a brief, warm note — "Thanks for following along" feeling.
