<template>
  <div class="glass-card overflow-hidden">
    <!-- Header -->
    <div
      class="p-6 text-white cursor-pointer"
      :style="{ background: `linear-gradient(135deg, ${tool.color}, ${tool.colorDark})` }"
      @click="isOpen = !isOpen"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div class="text-4xl" v-html="tool.icon"></div>
          <div>
            <h3 class="text-xl font-bold">{{ tool.name }}</h3>
            <p class="text-white/80 text-sm">{{ tool.tagline }}</p>
          </div>
        </div>
        <svg
          class="w-6 h-6 transition-transform"
          :class="{ 'rotate-180': isOpen }"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>

    <!-- Expandable content -->
    <div
      class="overflow-hidden transition-all duration-300"
      :class="isOpen ? 'max-h-[500px]' : 'max-h-0'"
    >
      <div class="p-6 space-y-6">
        <!-- Best For -->
        <div>
          <h4 class="font-semibold text-gray-800 dark:text-gray-100 mb-2 flex items-center gap-2">
            <span class="text-lg">&#127919;</span> Best For
          </h4>
          <p class="text-gray-600 dark:text-gray-400">{{ tool.bestFor }}</p>
        </div>

        <!-- How It Works -->
        <div>
          <h4 class="font-semibold text-gray-800 dark:text-gray-100 mb-2 flex items-center gap-2">
            <span class="text-lg">&#9881;</span> How It Works
          </h4>
          <p class="text-gray-600 dark:text-gray-400">{{ tool.howItWorks }}</p>
        </div>

        <!-- Tips -->
        <div>
          <h4 class="font-semibold text-gray-800 dark:text-gray-100 mb-2 flex items-center gap-2">
            <span class="text-lg">&#128161;</span> Pro Tips
          </h4>
          <ul class="space-y-2">
            <li
              v-for="(tip, index) in tool.tips"
              :key="index"
              class="flex items-start gap-2 text-gray-600 dark:text-gray-400"
            >
              <span class="text-green-500 mt-0.5">&#10003;</span>
              <span>{{ tip }}</span>
            </li>
          </ul>
        </div>

        <!-- CTA -->
        <RouterLink
          :to="getToolPath(tool.id)"
          class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg transform hover:scale-105 transition-all"
        >
          <span>Try {{ tool.name }}</span>
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  tool: {
    type: Object,
    required: true
  }
})

const isOpen = ref(false)

const getToolPath = (id) => {
  const paths = {
    threeps: '/tools/3ps',
    tententen: '/tools/10-10-10',
    regret: '/tools/regret',
    pmi: '/tools/pmi',
    swot: '/tools/swot',
    opportunityCost: '/tools/opportunity-cost',
    coinFlip: '/tools/coin-flip',
    fearRegret: '/tools/fear-regret'
  }
  return paths[id] || '/tools'
}
</script>
