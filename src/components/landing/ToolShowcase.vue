<template>
  <section class="py-20 px-4 bg-white dark:bg-slate-800">
    <div class="max-w-6xl mx-auto">
      <!-- Section Header -->
      <div class="text-center mb-16">
        <h2 class="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          8 Powerful Decision Tools
        </h2>
        <p class="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          From quick gut-checks to deep strategic analysis, find the right tool for every decision.
        </p>
      </div>

      <!-- Tools Grid -->
      <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <RouterLink
          v-for="tool in tools"
          :key="tool.name"
          :to="tool.path"
          class="glass-card p-6 text-center group hover:scale-105 transition-all duration-300 cursor-pointer"
        >
          <div
            class="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center text-3xl shadow-lg group-hover:rotate-6 transition-transform"
            :style="{ background: `linear-gradient(135deg, ${tool.color}, ${tool.colorDark})` }"
          >
            <span v-html="tool.icon"></span>
          </div>
          <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {{ tool.name }}
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            {{ tool.shortDesc }}
          </p>
        </RouterLink>
      </div>

      <!-- CTA -->
      <div class="text-center mt-12">
        <RouterLink
          to="/tools"
          class="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
        >
          <span>View All Tools</span>
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<script setup>
const tools = [
  {
    name: "De 3 P's",
    icon: '&#128176;',
    path: '/tools/3ps',
    color: '#6366f1',
    colorDark: '#4f46e5',
    shortDesc: 'Evaluate projects by your values'
  },
  {
    name: '10-10-10 Rule',
    icon: '&#9200;',
    path: '/tools/10-10-10',
    color: '#3b82f6',
    colorDark: '#1d4ed8',
    shortDesc: 'Time perspective analysis'
  },
  {
    name: 'Regret Minimization',
    icon: '&#129300;',
    path: '/tools/regret',
    color: '#8b5cf6',
    colorDark: '#6d28d9',
    shortDesc: "Bezos' decision framework"
  },
  {
    name: 'PMI Analysis',
    icon: '&#9878;',
    path: '/tools/pmi',
    color: '#10b981',
    colorDark: '#059669',
    shortDesc: 'Plus, Minus, Interesting'
  },
  {
    name: 'SWOT Analysis',
    icon: '&#127919;',
    path: '/tools/swot',
    color: '#f59e0b',
    colorDark: '#d97706',
    shortDesc: 'Strategic planning grid'
  },
  {
    name: 'Opportunity Cost',
    icon: '&#9878;',
    path: '/tools/opportunity-cost',
    color: '#06b6d4',
    colorDark: '#0891b2',
    shortDesc: 'Trade-off analysis'
  },
  {
    name: 'Coin Flip Test',
    icon: '&#129689;',
    path: '/tools/coin-flip',
    color: '#ec4899',
    colorDark: '#db2777',
    shortDesc: 'Reveal your gut feeling'
  },
  {
    name: 'Fear vs Regret',
    icon: '&#128168;',
    path: '/tools/fear-regret',
    color: '#ef4444',
    colorDark: '#dc2626',
    shortDesc: 'Balance fear and action'
  }
]
</script>
