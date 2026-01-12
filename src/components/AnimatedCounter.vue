<template>
  <span class="tabular-nums">{{ formattedValue }}</span>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue'

const props = defineProps({
  value: {
    type: Number,
    required: true
  },
  duration: {
    type: Number,
    default: 1500
  },
  delay: {
    type: Number,
    default: 0
  },
  locale: {
    type: String,
    default: 'nl-NL'
  }
})

const displayValue = ref(0)

const formattedValue = computed(() => {
  return displayValue.value.toLocaleString(props.locale)
})

const animateValue = (start, end, duration) => {
  const startTime = performance.now()

  const animate = (currentTime) => {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)

    // Easing function (ease-out-cubic)
    const easeOutCubic = 1 - Math.pow(1 - progress, 3)

    displayValue.value = Math.round(start + (end - start) * easeOutCubic)

    if (progress < 1) {
      requestAnimationFrame(animate)
    }
  }

  requestAnimationFrame(animate)
}

onMounted(() => {
  setTimeout(() => {
    animateValue(0, props.value, props.duration)
  }, props.delay)
})

watch(() => props.value, (newVal, oldVal) => {
  animateValue(oldVal || 0, newVal, props.duration)
})
</script>
