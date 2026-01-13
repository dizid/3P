<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const loading = ref(true)
const error = ref(null)
const decision = ref(null)

// Tool display names
const toolNames = {
  threeps: 'De 3 P\'s',
  tententen: '10-10-10 Rule',
  regret: 'Regret Minimization',
  pmi: 'PMI Analysis',
  swot: 'SWOT Analysis',
  coinflip: 'Coin Flip',
  fearRegret: 'Fear/Regret Matrix',
  opportunityCost: 'Opportunity Cost'
}

const toolName = computed(() => toolNames[decision.value?.tool] || decision.value?.tool)

const adviceLabel = computed(() => {
  if (!decision.value?.adviceType) return ''
  const labels = {
    go: 'Recommended: Go for it!',
    consider: 'Consider carefully',
    stop: 'Think twice'
  }
  return labels[decision.value.adviceType] || ''
})

const adviceColor = computed(() => {
  if (!decision.value?.adviceType) return 'bg-gray-100 text-gray-700'
  const colors = {
    go: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    consider: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    stop: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
  }
  return colors[decision.value.adviceType] || 'bg-gray-100 text-gray-700'
})

onMounted(async () => {
  const token = route.params.token
  if (!token) {
    error.value = 'Invalid share link'
    loading.value = false
    return
  }

  try {
    const API_BASE = import.meta.env.DEV ? 'http://localhost:8888' : ''
    const response = await fetch(`${API_BASE}/api/shared-decision?token=${token}`)

    if (!response.ok) {
      if (response.status === 404) {
        error.value = 'This decision was not found or is no longer shared.'
      } else {
        error.value = 'Failed to load shared decision.'
      }
      loading.value = false
      return
    }

    const data = await response.json()
    decision.value = data.decision
  } catch (err) {
    console.error('Error loading shared decision:', err)
    error.value = 'Failed to load shared decision.'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="min-h-screen py-12 px-4">
    <div class="max-w-3xl mx-auto">
      <!-- Loading -->
      <div v-if="loading" class="glass-card p-12 text-center">
        <div class="animate-spin w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p class="text-gray-600 dark:text-gray-400">Loading shared decision...</p>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="glass-card p-12 text-center">
        <div class="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <span class="text-3xl">&#128533;</span>
        </div>
        <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Oops!</h1>
        <p class="text-gray-600 dark:text-gray-400 mb-6">{{ error }}</p>
        <RouterLink
          to="/tools"
          class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-shadow"
        >
          Try De 3 P's Yourself
          <span>&#8594;</span>
        </RouterLink>
      </div>

      <!-- Decision -->
      <div v-else-if="decision" class="space-y-6">
        <!-- Header -->
        <div class="glass-card p-8">
          <div class="flex items-start justify-between mb-4">
            <div>
              <span class="text-sm text-indigo-600 dark:text-indigo-400 font-medium">
                Analyzed with {{ toolName }}
              </span>
              <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-1">
                {{ decision.title }}
              </h1>
            </div>
            <span v-if="decision.score !== null" class="text-4xl font-bold text-indigo-600 dark:text-indigo-400">
              {{ decision.score }}
            </span>
          </div>

          <p v-if="decision.description" class="text-gray-600 dark:text-gray-400 mb-4">
            {{ decision.description }}
          </p>

          <div v-if="adviceLabel" class="inline-block px-4 py-2 rounded-lg font-medium" :class="adviceColor">
            {{ adviceLabel }}
          </div>
        </div>

        <!-- Outcome (if tracked) -->
        <div v-if="decision.outcome_rating" class="glass-card p-6">
          <h2 class="font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
            <span class="text-xl">&#9989;</span>
            Outcome Tracked
          </h2>
          <div class="flex items-center gap-4 mb-2">
            <span class="text-gray-600 dark:text-gray-400">Rating:</span>
            <div class="flex gap-1">
              <div
                v-for="n in 10"
                :key="n"
                class="w-6 h-2 rounded-full"
                :class="n <= decision.outcome_rating ? 'bg-indigo-500' : 'bg-gray-200 dark:bg-gray-700'"
              ></div>
            </div>
            <span class="font-bold text-indigo-600 dark:text-indigo-400">{{ decision.outcome_rating }}/10</span>
          </div>
          <p v-if="decision.outcome_notes" class="text-gray-600 dark:text-gray-400 text-sm mt-2">
            "{{ decision.outcome_notes }}"
          </p>
        </div>

        <!-- CTA -->
        <div class="glass-card p-8 text-center bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
          <h2 class="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            Make Better Decisions
          </h2>
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            Use De 3 P's and 7 other decision-making tools to clarify your thinking.
          </p>
          <RouterLink
            to="/tools"
            class="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all hover:scale-105"
          >
            Try It Free
            <span>&#8594;</span>
          </RouterLink>
        </div>

        <!-- Footer -->
        <p class="text-center text-sm text-gray-500 dark:text-gray-400">
          Shared via <RouterLink to="/" class="text-indigo-600 dark:text-indigo-400 hover:underline">De 3 P's</RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>
