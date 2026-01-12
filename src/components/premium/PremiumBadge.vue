<template>
  <span
    class="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-full"
    :class="badgeClass"
  >
    <span v-if="showIcon" class="text-sm">&#9733;</span>
    <span>{{ label }}</span>
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'default',
    validator: (v) => ['default', 'small', 'locked'].includes(v)
  },
  showIcon: {
    type: Boolean,
    default: true
  },
  label: {
    type: String,
    default: 'Premium'
  }
})

const badgeClass = computed(() => {
  const variants = {
    default: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white',
    small: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
    locked: 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
  }
  return variants[props.variant]
})
</script>
