<template>
  <div class="min-h-screen py-8 px-4">
    <div class="max-w-5xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-8 animate-on-enter">
        <div class="text-5xl mb-4">&#9878;</div>
        <h1 class="text-4xl font-bold mb-2">
          <span class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Compare Tools
          </span>
        </h1>
        <p class="text-gray-600">
          Run your decision through multiple frameworks for a comprehensive analysis.
        </p>
      </div>

      <!-- Step 1: Decision Input -->
      <div v-if="step === 1" class="space-y-6 animate-on-enter">
        <div class="glass-card p-6">
          <label class="block text-lg font-bold text-gray-800 mb-3">
            What decision are you analyzing?
          </label>
          <input
            v-model="decision"
            type="text"
            placeholder="e.g., Accept the job offer, Start the business, Move to a new city..."
            class="w-full px-4 py-3.5 bg-white border-2 border-gray-300 rounded-xl text-gray-800 text-base placeholder-gray-400 shadow-sm transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none"
          />
        </div>

        <CompareToolSelector
          v-model:selected-tools="selectedTools"
          class="animate-on-enter stagger-1"
        />

        <button
          @click="startComparison"
          :disabled="!canStart"
          class="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-4 px-8 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          <span class="flex items-center justify-center gap-2 text-lg">
            Start Comparison
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </span>
        </button>
      </div>

      <!-- Step 2: Fill out each tool -->
      <div v-else-if="step === 2" class="animate-on-enter">
        <!-- Progress -->
        <div class="mb-6">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium text-gray-600">
              Tool {{ currentToolIndex + 1 }} of {{ selectedTools.length }}
            </span>
            <span class="text-sm text-gray-500">{{ toolMeta[currentTool]?.name }}</span>
          </div>
          <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              class="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300"
              :style="{ width: ((currentToolIndex + 1) / selectedTools.length) * 100 + '%' }"
            ></div>
          </div>
        </div>

        <!-- Tool Form -->
        <component
          :is="currentToolForm"
          @complete="handleToolComplete"
        />
      </div>

      <!-- Step 3: Results -->
      <div v-else class="animate-on-enter">
        <CompareResults
          :decision="decision"
          :results="results"
        />

        <div class="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <button
            @click="resetComparison"
            class="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105"
          >
            <span class="flex items-center justify-center gap-2">
              &#9878; New Comparison
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, markRaw } from 'vue'
import { useToolsStore } from '@/stores/ToolsStore'
import { toolMeta } from '@/stores/HistoryStore'
import CompareToolSelector from '@/components/compare/CompareToolSelector.vue'
import CompareResults from '@/components/compare/CompareResults.vue'

// Tool form imports
import TenTenTenForm from '@/components/tententen/TenTenTenForm.vue'
import RegretForm from '@/components/regret/RegretForm.vue'
import PmiForm from '@/components/pmi/PmiForm.vue'
import SwotForm from '@/components/swot/SwotForm.vue'
import OpportunityForm from '@/components/opportunity/OpportunityForm.vue'
import CoinFlipForm from '@/components/coinflip/CoinFlipForm.vue'
import FearRegretForm from '@/components/fearregret/FearRegretForm.vue'

const store = useToolsStore()

const step = ref(1)
const decision = ref('')
const selectedTools = ref([])
const currentToolIndex = ref(0)
const results = ref([])

const toolForms = {
  tententen: markRaw(TenTenTenForm),
  regret: markRaw(RegretForm),
  pmi: markRaw(PmiForm),
  swot: markRaw(SwotForm),
  opportunityCost: markRaw(OpportunityForm),
  coinFlip: markRaw(CoinFlipForm),
  fearRegret: markRaw(FearRegretForm)
}

const canStart = computed(() => {
  return decision.value.trim() && selectedTools.value.length >= 2
})

const currentTool = computed(() => {
  return selectedTools.value[currentToolIndex.value]
})

const currentToolForm = computed(() => {
  return toolForms[currentTool.value]
})

const startComparison = () => {
  if (!canStart.value) return

  // Pre-fill decision in each tool's store
  selectedTools.value.forEach(tool => {
    switch (tool) {
      case 'tententen':
        store.tententen.decision = decision.value
        break
      case 'regret':
        store.regret.decision = decision.value
        break
      case 'pmi':
        store.pmi.decision = decision.value
        break
      case 'swot':
        store.swot.decision = decision.value
        break
      case 'opportunityCost':
        store.opportunityCost.decision = decision.value
        break
      case 'coinFlip':
        store.coinFlip.decision = decision.value
        break
      case 'fearRegret':
        store.fearRegret.decision = decision.value
        break
    }
  })

  step.value = 2
}

const handleToolComplete = () => {
  // Capture result from current tool
  const tool = currentTool.value
  let score = null
  let advice = ''
  let adviceType = 'neutral'

  switch (tool) {
    case 'tententen':
      score = store.tententenScore
      advice = store.tententenAdvice.text
      adviceType = store.tententenAdvice.type
      break
    case 'regret':
      score = store.regretScore
      advice = store.regretAdvice.text
      adviceType = store.regretAdvice.type
      break
    case 'pmi':
      score = store.pmiNetScore
      advice = store.pmiAdvice.text
      adviceType = store.pmiAdvice.type
      break
    case 'swot':
      score = store.swotOverallScore
      advice = store.swotAdvice.text
      adviceType = store.swotAdvice.type
      break
    case 'opportunityCost':
      score = store.opportunityNetScore
      advice = store.opportunityAdvice.text
      adviceType = store.opportunityAdvice.type
      break
    case 'coinFlip':
      advice = store.coinFlipAdvice?.text || "Gut check complete"
      adviceType = store.coinFlip.reaction === 'neutral' ? 'neutral' : 'positive'
      break
    case 'fearRegret':
      score = store.fearNetScore
      advice = store.fearAdvice.text
      adviceType = store.fearAdvice.type
      break
  }

  results.value.push({
    tool,
    score,
    advice,
    adviceType
  })

  // Move to next tool or show results
  if (currentToolIndex.value < selectedTools.value.length - 1) {
    currentToolIndex.value++
  } else {
    step.value = 3
  }
}

const resetComparison = () => {
  step.value = 1
  decision.value = ''
  selectedTools.value = []
  currentToolIndex.value = 0
  results.value = []

  // Reset all tool stores
  store.resetTententen()
  store.resetRegret()
  store.resetPmi()
  store.resetSwot()
  store.resetOpportunityCost()
  store.resetCoinFlip()
  store.resetFearRegret()
}
</script>
