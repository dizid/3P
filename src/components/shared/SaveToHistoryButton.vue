<template>
  <button
    @click="handleSave"
    :disabled="saved"
    class="flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200"
    :class="saved
      ? 'bg-green-100 text-green-700 cursor-default'
      : 'bg-white/80 text-gray-700 hover:bg-amber-100 hover:text-amber-700 border border-gray-200 hover:border-amber-300'
    "
  >
    <span class="text-lg">{{ saved ? '&#10003;' : '&#128218;' }}</span>
    {{ saved ? 'Saved!' : 'Save to History' }}
  </button>
</template>

<script setup>
import { ref } from 'vue'
import { useHistoryStore } from '@/stores/HistoryStore'

const props = defineProps({
  tool: { type: String, required: true },
  decision: { type: String, required: true },
  score: { type: Number, default: null },
  recommendation: { type: String, required: true },
  recommendationType: { type: String, default: 'neutral' },
  data: { type: Object, default: () => ({}) }
})

const historyStore = useHistoryStore()
const saved = ref(false)

const handleSave = () => {
  if (saved.value) return

  historyStore.addDecision({
    tool: props.tool,
    decision: props.decision,
    score: props.score,
    recommendation: props.recommendation,
    recommendationType: props.recommendationType,
    data: props.data
  })

  saved.value = true
}
</script>
