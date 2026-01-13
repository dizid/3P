<template>
  <div class="glass-card overflow-hidden hover:shadow-lg transition-shadow">
    <div class="flex">
      <!-- Color bar -->
      <div
        class="w-2 flex-shrink-0"
        :style="{ backgroundColor: toolColor }"
      ></div>

      <div class="flex-1 p-4">
        <div class="flex items-start gap-4">
          <!-- Tool icon -->
          <div
            class="w-12 h-12 rounded-xl flex items-center justify-center text-2xl text-white shadow-lg flex-shrink-0"
            :style="{ backgroundColor: toolColor }"
          >
            <span v-html="toolIcon"></span>
          </div>

          <!-- Content -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <span class="text-xs font-medium text-gray-500 uppercase tracking-wider">{{ toolName }}</span>
              <span class="text-xs text-gray-400">{{ formattedDate }}</span>
            </div>

            <h3 class="font-bold text-gray-800 mb-2 truncate">{{ decision.decision }}</h3>

            <div class="flex items-center gap-4">
              <!-- Score -->
              <div class="flex items-center gap-2">
                <span class="text-sm text-gray-500">Score:</span>
                <span
                  class="text-lg font-bold"
                  :class="scoreClass"
                >
                  {{ decision.score !== null ? (decision.score >= 0 ? '+' : '') + decision.score : 'N/A' }}
                </span>
              </div>

              <!-- Recommendation -->
              <div class="flex items-center gap-2">
                <span
                  class="px-2 py-0.5 text-xs font-medium rounded-full"
                  :class="recommendationClass"
                >
                  {{ decision.recommendation }}
                </span>
              </div>

              <!-- Outcome badge -->
              <div v-if="decision.outcome" class="flex items-center gap-1">
                <span class="text-sm">Outcome:</span>
                <div class="flex">
                  <span
                    v-for="i in 5"
                    :key="i"
                    class="text-sm"
                    :class="i <= Math.ceil(decision.outcome.rating / 2) ? 'text-yellow-500' : 'text-gray-300'"
                  >
                    &#9733;
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-2">
            <button
              @click="shareDecision"
              class="p-2 text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
              title="Share"
              aria-label="Share decision"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>
            <button
              v-if="!decision.outcome"
              @click="$emit('trackOutcome', decision)"
              class="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
              title="Track Outcome"
              aria-label="Track outcome"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </button>
            <button
              @click="$emit('delete', decision.id)"
              class="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
              title="Delete"
              aria-label="Delete decision"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { toolMeta } from '@/stores/HistoryStore'

const props = defineProps({
  decision: { type: Object, required: true }
})

defineEmits(['delete', 'trackOutcome'])

// Share decision via Web Share API or clipboard
const shareDecision = async () => {
  const shareData = {
    title: `Decision: ${props.decision.decision}`,
    text: `I analyzed "${props.decision.decision}" using ${toolName.value}. Score: ${props.decision.score ?? 'N/A'} - ${props.decision.recommendation}`,
    url: window.location.origin + '/tools'
  }

  // Try Web Share API first (mobile-friendly)
  if (navigator.share) {
    try {
      await navigator.share(shareData)
      return
    } catch (err) {
      // User cancelled or share failed, fall back to clipboard
      if (err.name !== 'AbortError') {
        console.error('Share failed:', err)
      }
    }
  }

  // Fall back to copying text to clipboard
  const text = `${shareData.text}\n\nTry it yourself: ${shareData.url}`
  try {
    await navigator.clipboard.writeText(text)
    alert('Decision copied to clipboard!')
  } catch (err) {
    console.error('Copy failed:', err)
  }
}

const meta = computed(() => toolMeta[props.decision.tool] || {
  name: props.decision.tool,
  icon: '&#9878;',
  color: '#6b7280'
})

const toolName = computed(() => meta.value.name)
const toolIcon = computed(() => meta.value.icon)
const toolColor = computed(() => meta.value.color)

const formattedDate = computed(() => {
  const date = new Date(props.decision.createdAt)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
})

const scoreClass = computed(() => {
  const score = props.decision.score
  if (score === null) return 'text-gray-500'
  if (score >= 60 || score >= 3) return 'text-green-600'
  if (score >= 40 || score >= -3) return 'text-amber-600'
  return 'text-red-600'
})

const recommendationClass = computed(() => {
  const type = props.decision.recommendationType
  if (type === 'positive') return 'bg-green-100 text-green-700'
  if (type === 'neutral') return 'bg-amber-100 text-amber-700'
  return 'bg-red-100 text-red-700'
})
</script>
