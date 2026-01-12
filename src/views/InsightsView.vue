<template>
  <div class="min-h-screen py-8 px-4">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-8 animate-on-enter">
        <div class="flex items-center justify-center gap-3 mb-4">
          <span class="text-5xl">&#128202;</span>
          <PremiumBadge v-if="!isPremium" />
        </div>
        <h1 class="text-4xl font-bold mb-2">
          <span class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Decision Insights
          </span>
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Personal analytics from your decision-making patterns.
        </p>
      </div>

      <!-- Premium Gate for Insights -->
      <FeatureGate
        v-if="!isPremium"
        feature="insights"
        title="Unlock Decision Insights"
        description="Get detailed analytics, pattern recognition, and personalized recommendations based on your decision history."
      >
        <template #preview>
          <!-- Blurred preview of insights -->
          <div class="space-y-6 blur-sm pointer-events-none select-none">
            <!-- Fake stats -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div class="glass p-4 rounded-xl text-center">
                <div class="text-3xl font-bold text-blue-600">12</div>
                <div class="text-xs text-gray-500">Total Decisions</div>
              </div>
              <div class="glass p-4 rounded-xl text-center">
                <div class="text-3xl font-bold text-green-600">8</div>
                <div class="text-xs text-gray-500">Tracked</div>
              </div>
              <div class="glass p-4 rounded-xl text-center">
                <div class="text-3xl font-bold text-amber-600">7.2</div>
                <div class="text-xs text-gray-500">Avg Score</div>
              </div>
              <div class="glass p-4 rounded-xl text-center">
                <div class="text-3xl font-bold text-purple-600">5</div>
                <div class="text-xs text-gray-500">This Month</div>
              </div>
            </div>
            <!-- Fake chart -->
            <div class="glass-card p-6">
              <div class="h-32 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg"></div>
            </div>
            <!-- Fake patterns -->
            <div class="glass-card p-6">
              <div class="space-y-3">
                <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </template>
      </FeatureGate>

      <!-- Empty State (for premium users with no data) -->
      <div
        v-else-if="historyStore.totalDecisions === 0"
        class="glass-card p-12 text-center animate-on-enter"
      >
        <div class="text-6xl mb-4">&#128200;</div>
        <h2 class="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          No data yet
        </h2>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          Complete a few decision analyses to start seeing your patterns and insights.
        </p>
        <router-link
          to="/tools"
          class="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-6 rounded-xl hover:shadow-lg transition-all"
        >
          Explore Tools
        </router-link>
      </div>

      <!-- Insights Dashboard (for premium users) -->
      <div v-else class="space-y-6">
        <!-- Overview Stats -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 animate-on-enter">
          <InsightCard
            icon="&#128200;"
            :value="historyStore.totalDecisions"
            label="Total Decisions"
            color="blue"
          />
          <InsightCard
            icon="&#10004;"
            :value="trackedCount"
            label="Outcomes Tracked"
            color="green"
          />
          <InsightCard
            icon="&#11088;"
            :value="averageOutcome"
            label="Avg Outcome"
            color="amber"
          />
          <InsightCard
            icon="&#128197;"
            :value="decisionsThisMonth"
            label="This Month"
            color="purple"
          />
        </div>

        <!-- Tool Usage Chart -->
        <div class="glass-card p-6 animate-on-enter stagger-1">
          <h2 class="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6">
            Tool Usage
          </h2>
          <UsageChart :data="toolUsageData" />
        </div>

        <!-- Score Distribution -->
        <div class="glass-card p-6 animate-on-enter stagger-2">
          <h2 class="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            Score Distribution
          </h2>
          <div class="flex items-end justify-between gap-2 h-32">
            <div
              v-for="(count, range) in scoreDistribution"
              :key="range"
              class="flex-1 flex flex-col items-center"
            >
              <div
                class="w-full rounded-t-lg transition-all duration-500"
                :class="getScoreBarColor(range)"
                :style="{ height: getBarHeight(count) + '%' }"
              ></div>
              <span class="text-xs text-gray-500 dark:text-gray-400 mt-2">{{ range }}</span>
            </div>
          </div>
          <div class="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>Low scores</span>
            <span>High scores</span>
          </div>
        </div>

        <!-- Pattern Summary -->
        <PatternSummary
          :total-decisions="historyStore.totalDecisions"
          :tracked-count="trackedCount"
          :average-outcome="averageOutcome"
          :favorite-tool="favoriteTool"
          class="animate-on-enter stagger-3"
        />

        <!-- Recent Activity -->
        <div class="glass-card p-6 animate-on-enter stagger-4">
          <h2 class="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            Recent Activity
          </h2>
          <div class="space-y-3">
            <div
              v-for="decision in recentDecisions"
              :key="decision.id"
              class="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl"
            >
              <span class="text-2xl" v-html="getToolIcon(decision.tool)"></span>
              <div class="flex-1 min-w-0">
                <p class="font-medium text-gray-800 dark:text-gray-100 truncate">
                  {{ decision.decision }}
                </p>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {{ formatDate(decision.createdAt) }}
                </p>
              </div>
              <div
                v-if="decision.score !== null"
                class="text-lg font-bold"
                :class="getScoreColor(decision.score)"
              >
                {{ decision.score }}
              </div>
            </div>
          </div>
          <router-link
            to="/history"
            class="block text-center text-blue-600 dark:text-blue-400 font-medium mt-4 hover:underline"
          >
            View All History &rarr;
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useHistoryStore, toolMeta } from '@/stores/HistoryStore'
import { useSubscriptionStore } from '@/stores/SubscriptionStore'
import InsightCard from '@/components/insights/InsightCard.vue'
import UsageChart from '@/components/insights/UsageChart.vue'
import PatternSummary from '@/components/insights/PatternSummary.vue'
import PremiumBadge from '@/components/premium/PremiumBadge.vue'
import FeatureGate from '@/components/premium/FeatureGate.vue'

const historyStore = useHistoryStore()
const subscriptionStore = useSubscriptionStore()

const isPremium = computed(() => subscriptionStore.isPremium)

onMounted(() => {
  historyStore.loadFromLocalStorage()
})

const trackedCount = computed(() => {
  return historyStore.decisions.filter(d => d.outcome).length
})

const averageOutcome = computed(() => {
  const tracked = historyStore.decisions.filter(d => d.outcome)
  if (tracked.length === 0) return 'N/A'
  const avg = tracked.reduce((sum, d) => sum + d.outcome.rating, 0) / tracked.length
  return avg.toFixed(1)
})

const decisionsThisMonth = computed(() => {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  return historyStore.decisions.filter(d => new Date(d.createdAt) >= startOfMonth).length
})

const favoriteTool = computed(() => {
  const stats = historyStore.toolUsageStats
  const entries = Object.entries(stats)
  if (entries.length === 0) return null
  const [tool] = entries.reduce((a, b) => a[1] > b[1] ? a : b)
  return tool
})

const toolUsageData = computed(() => {
  const stats = historyStore.toolUsageStats
  return Object.entries(stats).map(([tool, count]) => ({
    tool,
    name: toolMeta[tool]?.name || tool,
    count,
    icon: toolMeta[tool]?.icon || '&#128196;'
  })).sort((a, b) => b.count - a.count)
})

const scoreDistribution = computed(() => {
  const dist = {
    '0-20': 0,
    '21-40': 0,
    '41-60': 0,
    '61-80': 0,
    '81-100': 0
  }

  historyStore.decisions.forEach(d => {
    if (d.score === null) return
    if (d.score <= 20) dist['0-20']++
    else if (d.score <= 40) dist['21-40']++
    else if (d.score <= 60) dist['41-60']++
    else if (d.score <= 80) dist['61-80']++
    else dist['81-100']++
  })

  return dist
})

const recentDecisions = computed(() => {
  return [...historyStore.decisions]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)
})

const getToolIcon = (tool) => {
  return toolMeta[tool]?.icon || '&#128196;'
}

const getScoreColor = (score) => {
  if (score >= 60) return 'text-green-600'
  if (score >= 40) return 'text-amber-600'
  return 'text-red-600'
}

const getScoreBarColor = (range) => {
  if (range === '81-100') return 'bg-green-500'
  if (range === '61-80') return 'bg-green-400'
  if (range === '41-60') return 'bg-amber-400'
  if (range === '21-40') return 'bg-orange-400'
  return 'bg-red-400'
}

const getBarHeight = (count) => {
  const max = Math.max(...Object.values(scoreDistribution.value), 1)
  return Math.max((count / max) * 100, 5)
}

const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  const now = new Date()
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
</script>
