<template>
  <div class="glass-card p-6 sm:p-8">
    <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">
      Which Tool Should I Use?
    </h2>

    <!-- Simple flowchart -->
    <div class="space-y-4">
      <!-- Question 1 -->
      <div class="glass p-4 rounded-xl">
        <p class="font-medium text-gray-800 dark:text-gray-100 mb-3">
          What type of decision are you facing?
        </p>
        <div class="grid sm:grid-cols-2 gap-3">
          <button
            @click="setType('emotional')"
            :class="[
              'p-3 rounded-lg text-left transition-all border-2',
              selectedType === 'emotional'
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            ]"
          >
            <span class="text-xl mr-2">&#128151;</span>
            <span class="font-medium text-gray-700 dark:text-gray-200">Emotional/Personal</span>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Life choices, relationships, values</p>
          </button>
          <button
            @click="setType('strategic')"
            :class="[
              'p-3 rounded-lg text-left transition-all border-2',
              selectedType === 'strategic'
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            ]"
          >
            <span class="text-xl mr-2">&#128200;</span>
            <span class="font-medium text-gray-700 dark:text-gray-200">Strategic/Business</span>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Work, investments, planning</p>
          </button>
        </div>
      </div>

      <!-- Question 2 -->
      <div v-if="selectedType" class="glass p-4 rounded-xl animate-on-enter">
        <p class="font-medium text-gray-800 dark:text-gray-100 mb-3">
          How much time do you have?
        </p>
        <div class="grid sm:grid-cols-2 gap-3">
          <button
            @click="setTime('quick')"
            :class="[
              'p-3 rounded-lg text-left transition-all border-2',
              selectedTime === 'quick'
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            ]"
          >
            <span class="text-xl mr-2">&#9889;</span>
            <span class="font-medium text-gray-700 dark:text-gray-200">Quick (2-5 min)</span>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Need a fast answer</p>
          </button>
          <button
            @click="setTime('thorough')"
            :class="[
              'p-3 rounded-lg text-left transition-all border-2',
              selectedTime === 'thorough'
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            ]"
          >
            <span class="text-xl mr-2">&#128270;</span>
            <span class="font-medium text-gray-700 dark:text-gray-200">Thorough (10-20 min)</span>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Want to be comprehensive</p>
          </button>
        </div>
      </div>

      <!-- Recommendations -->
      <div v-if="recommendations.length > 0" class="mt-6 animate-on-enter">
        <p class="font-medium text-gray-800 dark:text-gray-100 mb-4 text-center">
          Recommended tools for you:
        </p>
        <div class="grid sm:grid-cols-2 gap-4">
          <RouterLink
            v-for="rec in recommendations"
            :key="rec.name"
            :to="rec.path"
            class="glass p-4 rounded-xl flex items-center gap-4 group hover:scale-[1.02] transition-transform"
          >
            <div
              class="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-lg group-hover:rotate-6 transition-transform"
              :style="{ background: `linear-gradient(135deg, ${rec.color}, ${rec.colorDark})` }"
              v-html="rec.icon"
            ></div>
            <div>
              <h4 class="font-bold text-gray-800 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {{ rec.name }}
              </h4>
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ rec.reason }}</p>
            </div>
          </RouterLink>
        </div>
      </div>

      <!-- Reset -->
      <button
        v-if="selectedType || selectedTime"
        @click="reset"
        class="text-sm text-indigo-600 dark:text-indigo-400 hover:underline mt-4 w-full text-center"
      >
        Start over
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const selectedType = ref(null)
const selectedTime = ref(null)

const setType = (type) => {
  selectedType.value = type
}

const setTime = (time) => {
  selectedTime.value = time
}

const reset = () => {
  selectedType.value = null
  selectedTime.value = null
}

const recommendations = computed(() => {
  if (!selectedType.value || !selectedTime.value) return []

  const allTools = {
    threeps: { name: "De 3 P's", icon: '&#128176;', path: '/tools/3ps', color: '#6366f1', colorDark: '#4f46e5' },
    tententen: { name: '10-10-10 Rule', icon: '&#9200;', path: '/tools/10-10-10', color: '#3b82f6', colorDark: '#1d4ed8' },
    regret: { name: 'Regret Minimization', icon: '&#129300;', path: '/tools/regret', color: '#8b5cf6', colorDark: '#6d28d9' },
    pmi: { name: 'PMI Analysis', icon: '&#9878;', path: '/tools/pmi', color: '#10b981', colorDark: '#059669' },
    swot: { name: 'SWOT Analysis', icon: '&#127919;', path: '/tools/swot', color: '#f59e0b', colorDark: '#d97706' },
    opportunityCost: { name: 'Opportunity Cost', icon: '&#9878;', path: '/tools/opportunity-cost', color: '#06b6d4', colorDark: '#0891b2' },
    coinFlip: { name: 'Coin Flip Test', icon: '&#129689;', path: '/tools/coin-flip', color: '#ec4899', colorDark: '#db2777' },
    fearRegret: { name: 'Fear vs Regret', icon: '&#128168;', path: '/tools/fear-regret', color: '#ef4444', colorDark: '#dc2626' }
  }

  if (selectedType.value === 'emotional' && selectedTime.value === 'quick') {
    return [
      { ...allTools.coinFlip, reason: 'Reveals your gut feeling instantly' },
      { ...allTools.tententen, reason: 'Quick time-perspective check' }
    ]
  }
  if (selectedType.value === 'emotional' && selectedTime.value === 'thorough') {
    return [
      { ...allTools.regret, reason: 'Deep reflection on life impact' },
      { ...allTools.fearRegret, reason: 'Confront what\'s holding you back' }
    ]
  }
  if (selectedType.value === 'strategic' && selectedTime.value === 'quick') {
    return [
      { ...allTools.threeps, reason: 'Fast project/value alignment' },
      { ...allTools.opportunityCost, reason: 'Quick trade-off analysis' }
    ]
  }
  if (selectedType.value === 'strategic' && selectedTime.value === 'thorough') {
    return [
      { ...allTools.swot, reason: 'Complete strategic analysis' },
      { ...allTools.pmi, reason: 'Comprehensive pros/cons' }
    ]
  }

  return []
})
</script>
