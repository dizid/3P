# Module 3: How the Pieces Talk — Reactivity, Props, Events

### Teaching Arc
- **Metaphor:** A marching band. The drum major (the store) keeps time. When the tempo changes, every musician hears it instantly and adjusts. Musicians pass signals to each other too — a trumpet cues a trombone, a flute answers a clarinet. Nobody checks a central whiteboard every second ("is the tempo still 120 bpm?"). They *react* to what they hear.
- **Opening hook:** "When you drag a slider, the number at the bottom updates instantly. No refresh, no waiting. How? Three patterns: reactivity, props, events. You'll know all three by the end of this module."
- **Key insight:** Vue updates the screen *automatically* when data changes, but only if the data is "reactive". If you mutate data outside the reactive system, the UI doesn't know. This is the #1 source of "why doesn't my UI update?" bugs — including when AI coding tools forget to put data in the store.
- **"Why should I care?":** When AI writes Vue code that "looks right" but the UI doesn't update, 90% of the time the problem is data outside the reactive system. Knowing the three patterns lets you spot it in seconds.

### Code Snippets (pre-extracted)

**Snippet 1 — Reactivity: getter auto-recalculates**

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

**Snippet 2 — Props down: parent sends data to child**

File: `src/views/TenTenTenView.vue` (from template)
```vue
<ToolHeader
  icon="&#9200;"
  title="10-10-10 Rule"
  description="How will you feel in 10 minutes, 10 months, and 10 years?"
  color="#3b82f6"
/>
```

**Snippet 3 — Events up: child tells parent something happened**

File: `src/components/shared/GutCheck.vue` (lines 36-47)
```js
const props = defineProps({
  modelValue: { type: String, default: '' }
})

const emit = defineEmits(['update:modelValue'])

const options = [
  { value: 'yes',    label: 'Lean Yes \u2713' },
  { value: 'no',     label: 'Lean No \u2717' },
  { value: 'unsure', label: 'No Idea ?' }
]

function select(value) {
  emit('update:modelValue', props.modelValue === value ? '' : value)
}
```

**Snippet 4 — v-model: props + events combined**

File: `src/views/TenTenTenView.vue` (inline in template)
```vue
<GutCheck v-if="!showResult" v-model="gutFeeling" />
```

**Snippet 5 — Router navigation: "go somewhere else"**

File: `src/components/shared/ToolCard.vue` (lines 1-5)
```vue
<template>
  <RouterLink
    :to="to"
    class="block glass-card p-6 card-lift group cursor-pointer"
  >
```

### Interactive Elements

- [x] **Code↔English translation** — Snippet 3 (GutCheck's `emit`). Teach:
  - `defineProps({ modelValue: ... })` = "The parent gives me a value. I can read it but can't change it directly."
  - `defineEmits(['update:modelValue'])` = "I promise I'll send an event called 'update:modelValue' when the value should change."
  - `emit('update:modelValue', newValue)` = "Hey parent — please update the value to this."
  - The combo = v-model = "two-way binding without us having to manually wire both sides."
- [x] **Quiz** — 3-4 questions.
  1. "You add `let totalClicks = 0` at the top of a `<script setup>`. You then increment `totalClicks` on every click, and display `{{ totalClicks }}` in the template. Does the UI update?" Options: (a) yes, (b) no — it's not reactive, you need `ref(0)`, (c) yes, but only after a page refresh, (d) only in production builds. Correct: (b) — plain variables aren't reactive. `ref()` or store state are.
  2. "A child component needs to tell its parent 'a form was submitted'. Which pattern?" Options: (a) mutate a prop, (b) import the parent, (c) emit an event, (d) use localStorage. Correct: (c) — props down, events up.
  3. "You have two sibling components that need to share data. Which is best?" Options: (a) pass it through their common parent via props/events, (b) use a Pinia store, (c) both work but a store is cleaner for non-trivial data, (d) use `window.globalData`. Correct: (c) — simple cases can use parent, but stores exist exactly for this.
  4. "A user reports: 'I click Login and nothing happens'. You check — the click handler runs and sets `user.email = 'foo@bar.com'`. But the UI still says 'Guest'. What's the likely cause?" Options: (a) typo in the email, (b) `user` isn't reactive — it's a plain object not `ref()` or in a store, (c) the server rejected the login, (d) missing semicolon. Correct: (b) — classic reactivity-miss bug.
- [x] **Data flow animation** — Actors: `Parent View`, `Slider Component`, `ToolsStore`, `Result Component`. Show the v-model round trip:
  1. User drags slider to 80 → highlight Slider
  2. Slider emits `update:modelValue` with 80 → packet Slider → Parent View
  3. Parent assigns to `store.tententen.feel10months` → packet View → Store
  4. Store's `tententenScore` getter detects dependency change, recalculates → Store sparkles
  5. Result component's template reads the new getter value → packet Store → Result
  6. Result re-renders with updated score → highlight Result
- [x] **Side-by-side comparison** — Pattern cards showing: "Parent → Child (props)" vs "Child → Parent (events)" vs "Anywhere → Anywhere (store)". Each card: one-line description, one-line example, when to use it, when NOT to use it.
- [x] **Glossary tooltips** — first-use this module:
  - **reactive** — "Data that Vue watches. When it changes, the UI updates automatically."
  - **ref()** — "Wraps a plain value (string, number, object) to make it reactive. `const count = ref(0)`; read it with `count.value`."
  - **computed** — "A value derived from other reactive values. Auto-recalculates. Like a spreadsheet formula."
  - **emit** — "Send a custom event up to the parent. The parent listens with `@eventName`."
  - **v-model** — "Shortcut for 'prop down + event up'. Creates two-way binding."
  - **watcher** — "Code that runs whenever a specific piece of reactive data changes. Used for side effects."
  - **mutation** — "Changing data. In Pinia, you mutate state directly (`store.count++`); other systems require explicit mutation functions."
  - **declarative** — "You describe WHAT the UI should look like based on the data. The framework figures out HOW to update it. Opposite of imperative (telling the browser step-by-step what to do)."

### Reference Files to Read
- `references/interactive-elements.md` → "Code↔English Translation Blocks", "Multiple-Choice Quizzes", "Data Flow / Message Flow Animation", "Pattern Cards"
- `references/content-philosophy.md` → full file
- `references/gotchas.md` → full file

### Connections
- **Previous module:** Module 2 introduced the cast. We know who's who.
- **Next module:** "The Outside World" — so far we've only talked about what runs in the browser. Now we bring in APIs, the database, and Stripe.
- **Tone/style notes:** Keep the marching band metaphor running. The drum major (store) keeps tempo. Musicians (components) react and pass signals.
