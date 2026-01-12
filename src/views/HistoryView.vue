<template>
  <div class="min-h-screen py-8 px-4">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-8 animate-on-enter">
        <div class="text-5xl mb-4">&#128218;</div>
        <h1 class="text-4xl font-bold mb-2">
          <span class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Decision History
          </span>
        </h1>
        <p class="text-gray-600">
          Review past decisions and track their outcomes over time.
        </p>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 animate-on-enter stagger-1">
        <div class="glass p-4 rounded-xl text-center relative">
          <div class="text-3xl font-bold text-blue-600">{{ historyStore.totalDecisions }}</div>
          <div class="text-xs text-gray-500 uppercase tracking-wider">Total Decisions</div>
          <span
            v-if="!isPremium && historyStore.totalDecisions > historyLimit"
            class="absolute -top-2 -right-2 bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full"
          >
            {{ historyLimit }} shown
          </span>
        </div>
        <div class="glass p-4 rounded-xl text-center">
          <div class="text-3xl font-bold text-green-600">{{ trackedCount }}</div>
          <div class="text-xs text-gray-500 uppercase tracking-wider">Outcomes Tracked</div>
        </div>
        <div class="glass p-4 rounded-xl text-center">
          <div class="text-3xl font-bold text-purple-600">{{ mostUsedTool }}</div>
          <div class="text-xs text-gray-500 uppercase tracking-wider">Favorite Tool</div>
        </div>
        <div class="glass p-4 rounded-xl text-center">
          <div class="text-3xl font-bold text-amber-600">{{ averageOutcome }}</div>
          <div class="text-xs text-gray-500 uppercase tracking-wider">Avg Outcome</div>
        </div>
      </div>

      <!-- Filters -->
      <HistoryFilters
        v-model:selectedTool="selectedTool"
        v-model:sortOrder="sortOrder"
        v-model:outcomeFilter="outcomeFilter"
        class="animate-on-enter stagger-2"
        @clear-filters="clearFilters"
      />

      <!-- Empty State -->
      <div
        v-if="filteredDecisions.length === 0"
        class="glass-card p-12 text-center animate-on-enter stagger-3"
      >
        <div class="text-6xl mb-4">&#128203;</div>
        <h2 class="text-xl font-bold text-gray-800 mb-2">
          {{ historyStore.totalDecisions === 0 ? 'No decisions yet' : 'No matching decisions' }}
        </h2>
        <p class="text-gray-600 mb-6">
          {{ historyStore.totalDecisions === 0
            ? 'Complete an analysis with any decision tool and save it to see it here.'
            : 'Try adjusting your filters to see more results.'
          }}
        </p>
        <router-link
          v-if="historyStore.totalDecisions === 0"
          to="/tools"
          class="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-6 rounded-xl hover:shadow-lg transition-all"
        >
          Explore Tools
        </router-link>
      </div>

      <!-- Decision List -->
      <div v-else class="space-y-4">
        <HistoryCard
          v-for="decision in filteredDecisions"
          :key="decision.id"
          :decision="decision"
          class="animate-on-enter"
          @delete="handleDelete"
          @track-outcome="openOutcomeModal"
        />

        <!-- History Limit Upgrade Prompt -->
        <UpgradePrompt
          v-if="hiddenCount > 0"
          :title="`${hiddenCount} more decision${hiddenCount === 1 ? '' : 's'} hidden`"
          description="Upgrade to Premium for unlimited history access and track all your decisions over time."
          buttonText="Unlock Full History"
          class="animate-on-enter"
        />
      </div>

      <!-- Clear All Button -->
      <div
        v-if="historyStore.totalDecisions > 0"
        class="mt-8 text-center animate-on-enter"
      >
        <button
          @click="confirmClearAll"
          class="text-sm text-gray-500 hover:text-red-500 transition-colors"
        >
          Clear All History
        </button>
      </div>
    </div>

    <!-- Outcome Modal -->
    <OutcomeModal
      :is-open="outcomeModalOpen"
      :decision="selectedDecision"
      @close="outcomeModalOpen = false"
      @save="saveOutcome"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useHistoryStore, toolMeta } from '@/stores/HistoryStore'
import { useSubscriptionStore } from '@/stores/SubscriptionStore'
import HistoryFilters from '@/components/history/HistoryFilters.vue'
import HistoryCard from '@/components/history/HistoryCard.vue'
import OutcomeModal from '@/components/history/OutcomeModal.vue'
import UpgradePrompt from '@/components/premium/UpgradePrompt.vue'

const historyStore = useHistoryStore()
const subscriptionStore = useSubscriptionStore()

const isPremium = computed(() => subscriptionStore.isPremium)
const historyLimit = computed(() => subscriptionStore.historyLimit)

// Filters
const selectedTool = ref('')
const sortOrder = ref('newest')
const outcomeFilter = ref('')

// Modal
const outcomeModalOpen = ref(false)
const selectedDecision = ref(null)

onMounted(() => {
  historyStore.loadFromLocalStorage()
})

const allFilteredDecisions = computed(() => {
  let decisions = [...historyStore.decisions]

  // Filter by tool
  if (selectedTool.value) {
    decisions = decisions.filter(d => d.tool === selectedTool.value)
  }

  // Filter by outcome status
  if (outcomeFilter.value === 'tracked') {
    decisions = decisions.filter(d => d.outcome)
  } else if (outcomeFilter.value === 'untracked') {
    decisions = decisions.filter(d => !d.outcome)
  }

  // Sort
  switch (sortOrder.value) {
    case 'oldest':
      decisions.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      break
    case 'score-high':
      decisions.sort((a, b) => (b.score ?? -Infinity) - (a.score ?? -Infinity))
      break
    case 'score-low':
      decisions.sort((a, b) => (a.score ?? Infinity) - (b.score ?? Infinity))
      break
    default: // newest
      decisions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }

  return decisions
})

// Apply history limit for free users
const filteredDecisions = computed(() => {
  if (isPremium.value) {
    return allFilteredDecisions.value
  }
  return allFilteredDecisions.value.slice(0, historyLimit.value)
})

// Check if there are hidden decisions
const hiddenCount = computed(() => {
  if (isPremium.value) return 0
  return Math.max(0, allFilteredDecisions.value.length - historyLimit.value)
})

const trackedCount = computed(() => {
  return historyStore.decisions.filter(d => d.outcome).length
})

const mostUsedTool = computed(() => {
  const stats = historyStore.toolUsageStats
  const entries = Object.entries(stats)
  if (entries.length === 0) return 'N/A'
  const [tool] = entries.reduce((a, b) => a[1] > b[1] ? a : b)
  return toolMeta[tool]?.name.split(' ')[0] || 'N/A'
})

const averageOutcome = computed(() => {
  const tracked = historyStore.decisions.filter(d => d.outcome)
  if (tracked.length === 0) return 'N/A'
  const avg = tracked.reduce((sum, d) => sum + d.outcome.rating, 0) / tracked.length
  return avg.toFixed(1)
})

const clearFilters = () => {
  selectedTool.value = ''
  sortOrder.value = 'newest'
  outcomeFilter.value = ''
}

const handleDelete = (id) => {
  if (confirm('Are you sure you want to delete this decision?')) {
    historyStore.removeDecision(id)
  }
}

const openOutcomeModal = (decision) => {
  selectedDecision.value = decision
  outcomeModalOpen.value = true
}

const saveOutcome = (outcome) => {
  if (selectedDecision.value) {
    historyStore.updateOutcome(selectedDecision.value.id, outcome)
  }
  outcomeModalOpen.value = false
  selectedDecision.value = null
}

const confirmClearAll = () => {
  if (confirm('Are you sure you want to clear all decision history? This cannot be undone.')) {
    historyStore.clearHistory()
  }
}
</script>
