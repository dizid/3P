<template>
  <div class="space-y-3">
    <div
      v-for="item in data"
      :key="item.tool"
      class="flex items-center gap-4"
    >
      <span class="text-2xl w-10 text-center" v-html="item.icon"></span>
      <div class="flex-1">
        <div class="flex justify-between text-sm mb-1">
          <span class="font-medium text-gray-700 dark:text-gray-200">{{ item.name }}</span>
          <span class="text-gray-500 dark:text-gray-400">{{ item.count }} uses</span>
        </div>
        <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            class="h-full rounded-full transition-all duration-700 ease-out"
            :class="getBarColor(item.tool)"
            :style="{ width: getPercentage(item.count) + '%' }"
          ></div>
        </div>
      </div>
    </div>

    <div v-if="data.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
      No tool usage data yet.
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  data: {
    type: Array,
    required: true
  }
})

const maxCount = computed(() => {
  return Math.max(...props.data.map(d => d.count), 1)
})

const getPercentage = (count) => {
  return (count / maxCount.value) * 100
}

const getBarColor = (tool) => {
  const colors = {
    tententen: 'bg-gradient-to-r from-blue-500 to-indigo-500',
    regret: 'bg-gradient-to-r from-rose-500 to-pink-500',
    pmi: 'bg-gradient-to-r from-emerald-500 to-teal-500',
    swot: 'bg-gradient-to-r from-amber-500 to-orange-500',
    opportunityCost: 'bg-gradient-to-r from-violet-500 to-purple-500',
    coinFlip: 'bg-gradient-to-r from-pink-500 to-rose-500',
    fearRegret: 'bg-gradient-to-r from-cyan-500 to-blue-500'
  }
  return colors[tool] || 'bg-gradient-to-r from-gray-400 to-gray-500'
}
</script>
