<template>
  <div class="glass-card p-6">
    <h2 class="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
      &#128161; Your Patterns
    </h2>

    <div class="space-y-4">
      <!-- Favorite Tool -->
      <div v-if="favoriteTool" class="flex items-start gap-4 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-xl">
        <span class="text-3xl" v-html="getToolIcon(favoriteTool)"></span>
        <div>
          <h3 class="font-bold text-blue-700 dark:text-blue-300">Preferred Tool</h3>
          <p class="text-gray-700 dark:text-gray-300">
            You tend to use <strong>{{ getToolName(favoriteTool) }}</strong> most often.
            This suggests you value {{ getToolInsight(favoriteTool) }}.
          </p>
        </div>
      </div>

      <!-- Tracking Habit -->
      <div class="flex items-start gap-4 p-4 bg-green-50 dark:bg-green-900/30 rounded-xl">
        <span class="text-3xl">&#128202;</span>
        <div>
          <h3 class="font-bold text-green-700 dark:text-green-300">Outcome Tracking</h3>
          <p class="text-gray-700 dark:text-gray-300">
            <template v-if="trackingRate >= 50">
              Great job! You've tracked outcomes for <strong>{{ trackingRate }}%</strong> of your decisions.
              This helps you learn from past choices.
            </template>
            <template v-else-if="trackingRate > 0">
              You've tracked <strong>{{ trackingRate }}%</strong> of outcomes.
              Consider tracking more to identify patterns in your decision quality.
            </template>
            <template v-else>
              You haven't tracked any outcomes yet. Go to History to record how your decisions turned out!
            </template>
          </p>
        </div>
      </div>

      <!-- Decision Frequency -->
      <div class="flex items-start gap-4 p-4 bg-purple-50 dark:bg-purple-900/30 rounded-xl">
        <span class="text-3xl">&#128197;</span>
        <div>
          <h3 class="font-bold text-purple-700 dark:text-purple-300">Activity Level</h3>
          <p class="text-gray-700 dark:text-gray-300">
            <template v-if="totalDecisions >= 20">
              You're a <strong>power user</strong> with {{ totalDecisions }} analyzed decisions!
              Your systematic approach to decision-making is impressive.
            </template>
            <template v-else-if="totalDecisions >= 10">
              You've analyzed <strong>{{ totalDecisions }} decisions</strong> so far.
              Keep building your decision-making muscle!
            </template>
            <template v-else-if="totalDecisions >= 5">
              You're getting started with <strong>{{ totalDecisions }} decisions</strong>.
              Try different tools to find what works best for you.
            </template>
            <template v-else>
              You've made <strong>{{ totalDecisions }}</strong> {{ totalDecisions === 1 ? 'analysis' : 'analyses' }} so far.
              The more you use these tools, the better your decisions become!
            </template>
          </p>
        </div>
      </div>

      <!-- Outcome Quality -->
      <div v-if="averageOutcome !== 'N/A'" class="flex items-start gap-4 p-4 bg-amber-50 dark:bg-amber-900/30 rounded-xl">
        <span class="text-3xl">&#11088;</span>
        <div>
          <h3 class="font-bold text-amber-700 dark:text-amber-300">Decision Quality</h3>
          <p class="text-gray-700 dark:text-gray-300">
            <template v-if="parseFloat(averageOutcome) >= 7">
              Your tracked decisions have an excellent average outcome of <strong>{{ averageOutcome }}/10</strong>.
              Your analysis is paying off!
            </template>
            <template v-else-if="parseFloat(averageOutcome) >= 5">
              Your average outcome is <strong>{{ averageOutcome }}/10</strong>.
              Good, but there's room to improve. Consider spending more time on analysis.
            </template>
            <template v-else>
              Your average outcome of <strong>{{ averageOutcome }}/10</strong> suggests room for improvement.
              Try using multiple tools for important decisions.
            </template>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { toolMeta } from '@/stores/HistoryStore'

const props = defineProps({
  totalDecisions: {
    type: Number,
    required: true
  },
  trackedCount: {
    type: Number,
    required: true
  },
  averageOutcome: {
    type: [Number, String],
    required: true
  },
  favoriteTool: {
    type: String,
    default: null
  }
})

const trackingRate = computed(() => {
  if (props.totalDecisions === 0) return 0
  return Math.round((props.trackedCount / props.totalDecisions) * 100)
})

const getToolIcon = (tool) => {
  return toolMeta[tool]?.icon || '&#128196;'
}

const getToolName = (tool) => {
  return toolMeta[tool]?.name || tool
}

const getToolInsight = (tool) => {
  const insights = {
    tententen: 'considering both short and long-term perspectives',
    regret: 'thinking about future regrets and life satisfaction',
    pmi: 'systematically weighing pros, cons, and interesting factors',
    swot: 'strategic thinking with internal and external analysis',
    opportunityCost: 'understanding trade-offs and alternatives',
    coinFlip: 'trusting your gut feelings and instincts',
    fearRegret: 'confronting fears and avoiding future regret'
  }
  return insights[tool] || 'structured decision analysis'
}
</script>
