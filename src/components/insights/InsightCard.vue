<template>
  <div class="glass p-4 rounded-xl text-center">
    <div class="text-2xl mb-1" v-html="icon"></div>
    <div
      class="text-3xl font-bold"
      :class="colorClass"
    >
      {{ value }}
    </div>
    <div class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
      {{ label }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  icon: {
    type: String,
    required: true
  },
  value: {
    type: [Number, String],
    required: true
  },
  label: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: 'blue',
    validator: (v) => ['blue', 'green', 'amber', 'purple', 'red'].includes(v)
  }
})

const colorClass = computed(() => {
  const colors = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    amber: 'text-amber-600',
    purple: 'text-purple-600',
    red: 'text-red-600'
  }
  return colors[props.color]
})
</script>
