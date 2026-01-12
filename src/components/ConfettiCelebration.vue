<template>
  <Teleport to="body">
    <div v-if="active" class="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <div
        v-for="piece in pieces"
        :key="piece.id"
        class="absolute"
        :style="piece.style"
      >
        <div
          class="rounded-sm"
          :style="{
            width: piece.size + 'px',
            height: piece.size + 'px',
            backgroundColor: piece.color,
            transform: `rotate(${piece.rotation}deg)`
          }"
        ></div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

const props = defineProps({
  active: {
    type: Boolean,
    default: false
  },
  count: {
    type: Number,
    default: 60
  }
})

const pieces = ref([])

const colors = [
  '#10b981', // emerald
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#f59e0b', // amber
  '#ef4444', // red
  '#06b6d4', // cyan
  '#84cc16', // lime
]

const createConfetti = () => {
  pieces.value = Array.from({ length: props.count }, (_, i) => {
    const delay = Math.random() * 0.8
    const duration = 2.5 + Math.random() * 1.5
    const startX = Math.random() * 100
    const drift = (Math.random() - 0.5) * 100

    return {
      id: i,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      size: 8 + Math.random() * 8,
      style: {
        left: `${startX}%`,
        top: '-20px',
        animation: `confettiFall ${duration}s ease-out ${delay}s forwards`,
        '--drift': `${drift}px`
      }
    }
  })

  // Clean up after animation
  setTimeout(() => {
    pieces.value = []
  }, 5000)
}

watch(() => props.active, (newVal) => {
  if (newVal) {
    createConfetti()
  }
})

onMounted(() => {
  if (props.active) {
    createConfetti()
  }
})
</script>

<style scoped>
@keyframes confettiFall {
  0% {
    transform: translateY(0) translateX(0) rotate(0deg) scale(1);
    opacity: 1;
  }
  25% {
    transform: translateY(25vh) translateX(calc(var(--drift) * 0.5)) rotate(180deg) scale(1);
    opacity: 1;
  }
  50% {
    transform: translateY(50vh) translateX(var(--drift)) rotate(360deg) scale(0.9);
    opacity: 0.9;
  }
  75% {
    transform: translateY(75vh) translateX(calc(var(--drift) * 0.7)) rotate(540deg) scale(0.7);
    opacity: 0.6;
  }
  100% {
    transform: translateY(100vh) translateX(calc(var(--drift) * 0.5)) rotate(720deg) scale(0.5);
    opacity: 0;
  }
}
</style>
