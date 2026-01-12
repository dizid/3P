<template>
  <div class="relative">
    <!-- Matrix Grid -->
    <div class="aspect-square max-w-sm mx-auto relative">
      <!-- Background quadrants -->
      <div class="absolute inset-0 grid grid-cols-2 grid-rows-2 rounded-2xl overflow-hidden">
        <div class="bg-green-100"></div>
        <div class="bg-amber-100"></div>
        <div class="bg-amber-100"></div>
        <div class="bg-red-100"></div>
      </div>

      <!-- Axis lines -->
      <div class="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-300"></div>
      <div class="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-300"></div>

      <!-- Position indicator -->
      <div
        class="absolute w-8 h-8 bg-white border-4 rounded-full shadow-lg transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000"
        :class="indicatorBorder"
        :style="{ left: xPosition + '%', top: yPosition + '%' }"
      >
        <div
          class="absolute inset-1 rounded-full"
          :class="indicatorFill"
        ></div>
      </div>

      <!-- Labels -->
      <div class="absolute -left-2 top-1/2 -translate-y-1/2 -rotate-90 text-xs font-bold text-gray-500 whitespace-nowrap">
        Fear of Action
      </div>
      <div class="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-6 text-xs font-bold text-gray-500">
        Fear of Inaction
      </div>

      <!-- Quadrant labels -->
      <div class="absolute top-2 left-2 text-xs font-medium text-green-700 bg-green-200/50 px-2 py-1 rounded">
        Low Fear Zone
      </div>
      <div class="absolute top-2 right-2 text-xs font-medium text-amber-700 bg-amber-200/50 px-2 py-1 rounded text-right">
        Act Despite Fear
      </div>
      <div class="absolute bottom-2 left-2 text-xs font-medium text-amber-700 bg-amber-200/50 px-2 py-1 rounded">
        Caution Advised
      </div>
      <div class="absolute bottom-2 right-2 text-xs font-medium text-red-700 bg-red-200/50 px-2 py-1 rounded text-right">
        High Anxiety
      </div>
    </div>

    <!-- Score summary -->
    <div class="mt-6 grid grid-cols-2 gap-4 text-center">
      <div class="glass p-3 rounded-xl">
        <div class="text-xs text-gray-500 uppercase tracking-wider">Fear of Action</div>
        <div class="text-2xl font-bold text-orange-600">{{ actionScore }}</div>
      </div>
      <div class="glass p-3 rounded-xl">
        <div class="text-xs text-gray-500 uppercase tracking-wider">Fear of Inaction</div>
        <div class="text-2xl font-bold text-blue-600">{{ inactionScore }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  actionScore: { type: Number, required: true },
  inactionScore: { type: Number, required: true }
})

// Map scores (0-50 range typically) to position (10-90%)
const xPosition = computed(() => {
  const normalized = Math.min(50, props.inactionScore) / 50
  return 10 + normalized * 80
})

const yPosition = computed(() => {
  // Inverted because higher fear = higher on visual Y axis (but DOM Y is inverted)
  const normalized = Math.min(50, props.actionScore) / 50
  return 90 - normalized * 80
})

const netScore = computed(() => props.inactionScore - props.actionScore)

const indicatorBorder = computed(() => {
  if (netScore.value >= 3) return 'border-green-500'
  if (netScore.value >= -3) return 'border-amber-500'
  return 'border-red-500'
})

const indicatorFill = computed(() => {
  if (netScore.value >= 3) return 'bg-green-400'
  if (netScore.value >= -3) return 'bg-amber-400'
  return 'bg-red-400'
})
</script>
