<template>
  <div class="glass-card overflow-hidden">
    <div class="p-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
      <h2 class="text-2xl font-bold mb-2">Comparison Results</h2>
      <p class="opacity-90">Decision: "{{ decision }}"</p>
    </div>

    <!-- Results Grid -->
    <div class="p-6">
      <div class="grid gap-6" :class="gridClass">
        <div
          v-for="result in results"
          :key="result.tool"
          class="glass p-4 rounded-xl border-2"
          :style="{ borderColor: toolMeta[result.tool]?.color }"
        >
          <div class="flex items-center gap-3 mb-4">
            <div
              class="w-10 h-10 rounded-lg flex items-center justify-center text-xl text-white"
              :style="{ backgroundColor: toolMeta[result.tool]?.color }"
            >
              <span v-html="toolMeta[result.tool]?.icon"></span>
            </div>
            <div>
              <div class="font-bold text-gray-800">{{ toolMeta[result.tool]?.name }}</div>
              <div class="text-xs text-gray-500">{{ getToolType(result.tool) }}</div>
            </div>
          </div>

          <div class="text-center mb-4">
            <div
              class="text-4xl font-black mb-1"
              :class="getScoreClass(result)"
            >
              {{ formatScore(result.score) }}
            </div>
            <div class="text-sm text-gray-500">Score</div>
          </div>

          <div
            class="p-3 rounded-lg text-center font-medium"
            :class="getAdviceClass(result)"
          >
            {{ result.advice }}
          </div>
        </div>
      </div>

      <!-- Consensus -->
      <div class="mt-8 p-6 bg-gray-50 rounded-xl text-center">
        <h3 class="font-bold text-gray-800 mb-2">Overall Consensus</h3>
        <div class="text-5xl mb-2">{{ consensusEmoji }}</div>
        <div class="text-xl font-bold" :class="consensusClass">{{ consensusText }}</div>
        <p class="text-gray-600 mt-2">{{ consensusDescription }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { toolMeta } from '@/stores/HistoryStore'

const props = defineProps({
  decision: { type: String, required: true },
  results: { type: Array, required: true }
})

const gridClass = computed(() => {
  return props.results.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'
})

const getToolType = (tool) => {
  const types = {
    tententen: 'Time-based',
    regret: 'Future-focused',
    pmi: 'Analytical',
    swot: 'Strategic',
    opportunityCost: 'Trade-off',
    coinFlip: 'Intuitive',
    fearRegret: 'Emotional'
  }
  return types[tool] || ''
}

const formatScore = (score) => {
  if (score === null || score === undefined) return 'N/A'
  return score >= 0 ? `+${score}` : score
}

const getScoreClass = (result) => {
  const type = result.adviceType
  if (type === 'positive') return 'text-green-600'
  if (type === 'neutral') return 'text-amber-600'
  return 'text-red-600'
}

const getAdviceClass = (result) => {
  const type = result.adviceType
  if (type === 'positive') return 'bg-green-100 text-green-700'
  if (type === 'neutral') return 'bg-amber-100 text-amber-700'
  return 'bg-red-100 text-red-700'
}

// Calculate consensus
const positiveCount = computed(() =>
  props.results.filter(r => r.adviceType === 'positive').length
)

const negativeCount = computed(() =>
  props.results.filter(r => r.adviceType === 'negative').length
)

const consensusEmoji = computed(() => {
  if (positiveCount.value === props.results.length) return '&#128640;'
  if (negativeCount.value === props.results.length) return '&#128683;'
  if (positiveCount.value > negativeCount.value) return '&#128077;'
  if (negativeCount.value > positiveCount.value) return '&#128078;'
  return '&#129300;'
})

const consensusText = computed(() => {
  if (positiveCount.value === props.results.length) return 'Strong Go!'
  if (negativeCount.value === props.results.length) return 'Strong No'
  if (positiveCount.value > negativeCount.value) return 'Leaning Positive'
  if (negativeCount.value > positiveCount.value) return 'Leaning Negative'
  return 'Mixed Signals'
})

const consensusClass = computed(() => {
  if (positiveCount.value === props.results.length) return 'text-green-600'
  if (negativeCount.value === props.results.length) return 'text-red-600'
  if (positiveCount.value > negativeCount.value) return 'text-green-600'
  if (negativeCount.value > positiveCount.value) return 'text-red-600'
  return 'text-amber-600'
})

const consensusDescription = computed(() => {
  const total = props.results.length
  if (positiveCount.value === total) {
    return 'All tools agree - this looks like a good decision!'
  }
  if (negativeCount.value === total) {
    return 'All tools suggest caution - consider alternatives.'
  }
  return `${positiveCount.value}/${total} tools lean positive, ${negativeCount.value}/${total} lean negative.`
})
</script>
