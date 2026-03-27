<template>
  <div class="mb-6 animate-on-enter">
    <!-- Collapsed trigger -->
    <button
      v-if="!isOpen"
      @click="isOpen = true"
      class="w-full glass glass-card p-4 flex items-center justify-between gap-3 text-left cursor-pointer hover:shadow-lg transition-shadow duration-200"
    >
      <div class="flex items-center gap-3">
        <span class="text-xl">&#10067;</span>
        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
          Not sure which tool to use? Take a 30-second quiz
        </span>
      </div>
      <svg class="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <!-- Open card -->
    <div v-else class="glass glass-card p-5">
      <!-- Header -->
      <div class="flex items-center justify-between mb-5">
        <h3 class="font-semibold text-gray-800 dark:text-gray-100">Find your tool</h3>
        <button
          @click="reset"
          class="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
        >
          Start over
        </button>
      </div>

      <!-- Questions -->
      <div v-if="!showResult" class="space-y-5">
        <!-- Q1 -->
        <div>
          <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            1. What kind of decision is this?
          </p>
          <div class="space-y-2">
            <label
              v-for="option in q1Options"
              :key="option.value"
              class="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
            >
              <input
                type="radio"
                :value="option.value"
                v-model="answers.q1"
                class="accent-purple-600"
              />
              <span class="text-sm text-gray-600 dark:text-gray-400">{{ option.label }}</span>
            </label>
          </div>
        </div>

        <!-- Q2 -->
        <div>
          <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            2. How much time do you have?
          </p>
          <div class="space-y-2">
            <label
              v-for="option in q2Options"
              :key="option.value"
              class="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
            >
              <input
                type="radio"
                :value="option.value"
                v-model="answers.q2"
                class="accent-purple-600"
              />
              <span class="text-sm text-gray-600 dark:text-gray-400">{{ option.label }}</span>
            </label>
          </div>
        </div>

        <!-- Q3 -->
        <div>
          <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            3. What's holding you back?
          </p>
          <div class="space-y-2">
            <label
              v-for="option in q3Options"
              :key="option.value"
              class="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
            >
              <input
                type="radio"
                :value="option.value"
                v-model="answers.q3"
                class="accent-purple-600"
              />
              <span class="text-sm text-gray-600 dark:text-gray-400">{{ option.label }}</span>
            </label>
          </div>
        </div>

        <!-- Submit -->
        <button
          @click="calculate"
          :disabled="!allAnswered"
          class="w-full py-2.5 px-4 rounded-xl text-sm font-semibold transition-all duration-200"
          :class="allAnswered
            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90 cursor-pointer'
            : 'bg-gray-100 dark:bg-white/5 text-gray-400 cursor-not-allowed'"
        >
          Show my tools
        </button>
      </div>

      <!-- Result -->
      <div v-else>
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">Based on your answers, try these:</p>
        <div class="space-y-3">
          <RouterLink
            v-for="(tool, index) in topTools"
            :key="tool.key"
            :to="tool.route"
            class="flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 group"
            :class="index === 0
              ? 'border-purple-300 dark:border-purple-700 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/40'
              : 'border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5'"
          >
            <span class="text-2xl" v-html="tool.icon"></span>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <span class="text-sm font-semibold text-gray-800 dark:text-gray-100">{{ tool.name }}</span>
                <span v-if="index === 0" class="text-xs px-1.5 py-0.5 bg-purple-200 dark:bg-purple-800 text-purple-700 dark:text-purple-300 rounded-full font-medium">Best match</span>
              </div>
              <span class="text-xs text-gray-500 dark:text-gray-400">{{ tool.time }}</span>
            </div>
            <svg class="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 flex-shrink-0 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </RouterLink>
        </div>
        <button
          @click="reset"
          class="mt-4 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
        >
          &#8592; Start over
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'

// --- Tool definitions ---
const tools = {
  coinFlip:    { name: 'Coin Flip Test',       route: '/tools/coin-flip',         icon: '&#129689;', time: '2 min' },
  tententen:   { name: '10-10-10 Rule',         route: '/tools/10-10-10',          icon: '&#9200;',   time: '2 min' },
  threeps:     { name: "De 3 P's",              route: '/tools/3ps',               icon: '&#128176;', time: '4 min' },
  regret:      { name: 'Regret Minimization',   route: '/tools/regret',            icon: '&#129300;', time: '3 min' },
  pmi:         { name: 'PMI Analysis',          route: '/tools/pmi',               icon: '&#9878;',   time: '6 min' },
  swot:        { name: 'SWOT Analysis',         route: '/tools/swot',              icon: '&#127919;', time: '6 min' },
  fearRegret:  { name: 'Fear vs Regret',        route: '/tools/fear-regret',       icon: '&#128168;', time: '5 min' },
  opportunity: { name: 'Opportunity Cost',      route: '/tools/opportunity-cost',  icon: '&#9878;',   time: '5 min' },
}

// --- Quiz options ---
const q1Options = [
  { value: 'quick',    label: 'Quick / everyday' },
  { value: 'career',  label: 'Career / project' },
  { value: 'life',    label: 'Life-changing' },
  { value: 'money',   label: 'Money / trade-off' },
]

const q2Options = [
  { value: 'now',    label: 'Decide now (< 5 min)' },
  { value: 'some',   label: 'Some time to think' },
  { value: 'big',    label: 'No rush, big decision' },
]

const q3Options = [
  { value: 'fear',     label: 'Fear / anxiety' },
  { value: 'options',  label: 'Too many options' },
  { value: 'unclear',  label: "Can't see clearly" },
  { value: 'validate', label: 'Nothing, just want validation' },
]

// --- State ---
const isOpen = ref(false)
const showResult = ref(false)
const answers = ref({ q1: null, q2: null, q3: null })
const topTools = ref([])

// --- Computed ---
const allAnswered = computed(() =>
  answers.value.q1 !== null && answers.value.q2 !== null && answers.value.q3 !== null
)

// --- Scoring weights ---
const weights = {
  q1: {
    quick:  { coinFlip: 3, tententen: 2 },
    career: { threeps: 3, swot: 2 },
    life:   { regret: 3, tententen: 2 },
    money:  { opportunity: 3, pmi: 2 },
  },
  q2: {
    now:  { coinFlip: 3, tententen: 2 },
    some: { pmi: 2, fearRegret: 2 },
    big:  { swot: 2, regret: 2 },
  },
  q3: {
    fear:     { fearRegret: 3, regret: 2 },
    options:  { pmi: 3, swot: 2 },
    unclear:  { tententen: 2, threeps: 2 },
    validate: { coinFlip: 3 },
  },
}

// --- Logic ---
function calculate() {
  if (!allAnswered.value) return

  // Tally scores
  const scores = Object.fromEntries(Object.keys(tools).map(k => [k, 0]))

  const addWeights = (questionKey, answerValue) => {
    const match = weights[questionKey][answerValue]
    if (!match) return
    for (const [toolKey, score] of Object.entries(match)) {
      scores[toolKey] += score
    }
  }

  addWeights('q1', answers.value.q1)
  addWeights('q2', answers.value.q2)
  addWeights('q3', answers.value.q3)

  // Sort and pick top 2
  topTools.value = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([key]) => ({ key, ...tools[key] }))

  showResult.value = true
}

function reset() {
  answers.value = { q1: null, q2: null, q3: null }
  showResult.value = false
  isOpen.value = false
}
</script>
