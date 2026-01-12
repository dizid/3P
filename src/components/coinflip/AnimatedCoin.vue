<template>
  <div class="coin-container">
    <div
      class="coin"
      :class="{ flipping: isFlipping, 'show-heads': showHeads, 'show-tails': showTails }"
    >
      <div class="coin-face heads">
        <div class="coin-inner">
          <span class="text-4xl">{{ optionAIcon }}</span>
          <span class="text-sm font-bold mt-1 text-center px-2 truncate w-full">{{ optionA }}</span>
        </div>
      </div>
      <div class="coin-face tails">
        <div class="coin-inner">
          <span class="text-4xl">{{ optionBIcon }}</span>
          <span class="text-sm font-bold mt-1 text-center px-2 truncate w-full">{{ optionB }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  isFlipping: { type: Boolean, default: false },
  result: { type: String, default: null }, // 'A' or 'B'
  optionA: { type: String, default: 'Option A' },
  optionB: { type: String, default: 'Option B' }
})

const showHeads = computed(() => !props.isFlipping && props.result === 'A')
const showTails = computed(() => !props.isFlipping && props.result === 'B')

const optionAIcon = computed(() => {
  return '&#127919;' // Target
})

const optionBIcon = computed(() => {
  return '&#128260;' // Arrows
})
</script>

<style scoped>
.coin-container {
  perspective: 1000px;
  width: 150px;
  height: 150px;
  margin: 0 auto;
}

.coin {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.1s ease-out;
}

.coin.flipping {
  animation: coinFlip 2s ease-out forwards;
}

.coin.show-heads {
  transform: rotateY(0deg);
}

.coin.show-tails {
  transform: rotateY(180deg);
}

.coin-face {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  backface-visibility: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06),
    inset 0 2px 4px rgba(255, 255, 255, 0.3);
}

.coin-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.heads {
  background: linear-gradient(135deg, #ec4899 0%, #db2777 50%, #be185d 100%);
  color: white;
  border: 4px solid #f9a8d4;
}

.tails {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 50%, #6d28d9 100%);
  color: white;
  border: 4px solid #c4b5fd;
  transform: rotateY(180deg);
}

@keyframes coinFlip {
  0% {
    transform: rotateY(0) rotateX(0) translateY(0);
  }
  25% {
    transform: rotateY(900deg) rotateX(30deg) translateY(-80px);
  }
  50% {
    transform: rotateY(1800deg) rotateX(-30deg) translateY(-100px);
  }
  75% {
    transform: rotateY(2700deg) rotateX(15deg) translateY(-50px);
  }
  100% {
    transform: rotateY(var(--final-rotation, 3600deg)) rotateX(0) translateY(0);
  }
}

.coin.flipping.show-heads {
  --final-rotation: 3600deg;
}

.coin.flipping.show-tails {
  --final-rotation: 3780deg;
}
</style>
