<template>
  <div>
    <!-- Confetti for positive results -->
    <ConfettiCelebration :active="showConfetti && isPositive" :count="60" />

    <!-- Result Card -->
    <div class="glass-card overflow-hidden animate-on-enter">
      <!-- Header -->
      <div
        class="relative p-8 text-center overflow-hidden"
        :class="headerClass"
      >
        <!-- Animated background -->
        <div class="absolute inset-0 overflow-hidden">
          <div
            class="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-20"
            :class="circleClass"
            style="animation: float 4s ease-in-out infinite"
          ></div>
          <div
            class="absolute -bottom-10 -left-10 w-32 h-32 rounded-full opacity-20"
            :class="circleClass"
            style="animation: float 3s ease-in-out infinite reverse"
          ></div>
        </div>

        <div class="relative z-10 text-white">
          <div class="text-5xl mb-4" :class="isPositive ? 'animate-bounce-subtle' : ''">
            {{ resultIcon }}
          </div>
          <h1 class="text-4xl font-extrabold mb-3">{{ store.regretAdvice.text }}</h1>
          <p class="text-lg opacity-90">
            For: <span class="font-bold underline">"{{ store.regret.decision }}"</span>
          </p>
        </div>
      </div>

      <!-- Score Display -->
      <div class="p-8 bg-gradient-to-b from-gray-50 to-white text-center">
        <div class="mb-6">
          <div
            class="text-7xl font-black mb-2 bg-clip-text text-transparent"
            :class="scoreGradient"
          >
            <AnimatedCounter :value="store.regretScore" :duration="1500" />
          </div>
          <div class="text-sm text-gray-500 uppercase tracking-widest">Confidence Score</div>
        </div>

        <!-- Score Bar -->
        <div class="max-w-md mx-auto">
          <div class="relative h-4 bg-gray-200 rounded-full overflow-hidden">
            <div
              class="absolute inset-y-0 left-0 rounded-full transition-all duration-1000"
              :class="barClass"
              :style="{ width: store.regretScore + '%' }"
            >
              <div class="absolute inset-0 shimmer"></div>
            </div>
          </div>
          <div class="flex justify-between text-xs text-gray-500 mt-2">
            <span>0</span>
            <span class="font-bold">45</span>
            <span class="font-bold">65</span>
            <span>100</span>
          </div>
        </div>
      </div>

      <!-- Breakdown -->
      <div class="p-8 border-t">
        <h2 class="text-xl font-bold text-gray-800 mb-6 text-center">Your Reflection Breakdown</h2>

        <div class="space-y-4">
          <div class="flex items-center justify-between p-4 bg-purple-50 rounded-xl">
            <div class="flex items-center gap-3">
              <span class="text-2xl">&#128557;</span>
              <div>
                <div class="font-semibold text-gray-800">Regret of Inaction</div>
                <div class="text-xs text-gray-500">40% weight</div>
              </div>
            </div>
            <div class="text-2xl font-bold text-purple-600">{{ store.regret.regretNotTrying }}</div>
          </div>

          <div class="flex items-center justify-between p-4 bg-indigo-50 rounded-xl">
            <div class="flex items-center gap-3">
              <span class="text-2xl">&#128260;</span>
              <div>
                <div class="font-semibold text-gray-800">Reversibility</div>
                <div class="text-xs text-gray-500">15% weight</div>
              </div>
            </div>
            <div class="text-2xl font-bold text-indigo-600">{{ store.regret.reversibility }}</div>
          </div>

          <div class="flex items-center justify-between p-4 bg-violet-50 rounded-xl">
            <div class="flex items-center gap-3">
              <span class="text-2xl">&#128142;</span>
              <div>
                <div class="font-semibold text-gray-800">Value Alignment</div>
                <div class="text-xs text-gray-500">25% weight</div>
              </div>
            </div>
            <div class="text-2xl font-bold text-violet-600">{{ store.regret.valueAlignment }}</div>
          </div>

          <div class="flex items-center justify-between p-4 bg-fuchsia-50 rounded-xl">
            <div class="flex items-center gap-3">
              <span class="text-2xl">&#129491;</span>
              <div>
                <div class="font-semibold text-gray-800">80-Year Perspective</div>
                <div class="text-xs text-gray-500">20% weight</div>
              </div>
            </div>
            <div class="text-2xl font-bold text-fuchsia-600">{{ store.regret.age80Perspective }}</div>
          </div>
        </div>
      </div>

      <!-- Advice -->
      <div class="p-8 bg-gray-50 border-t">
        <h2 class="text-xl font-bold text-gray-800 mb-4">Message from Your Future Self</h2>
        <div class="flex gap-4 items-start">
          <div class="text-4xl">&#129491;</div>
          <p class="text-gray-700 leading-relaxed italic">
            <template v-if="isPositive">
              "Looking back from 80, I'm so glad you took that leap. The fear was temporary,
              but the growth and experiences lasted a lifetime. You won't regret trying."
            </template>
            <template v-else-if="isNeutral">
              "This one's tricky. Maybe gather more information, talk to people who've done it,
              or wait for a stronger signal. There's wisdom in patience too."
            </template>
            <template v-else>
              "Not every opportunity is your opportunity. Sometimes the right choice is to
              protect what you have and wait for something that truly resonates with your soul."
            </template>
          </p>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex flex-col sm:flex-row gap-4 justify-center mt-8 animate-on-enter stagger-1">
      <button
        @click="$emit('back')"
        class="glass hover:bg-white/80 text-gray-700 font-bold py-3 px-8 rounded-xl shadow-lg border border-gray-200 transform transition-all duration-200 hover:scale-105"
      >
        <span class="flex items-center justify-center gap-2">
          &#8592; Adjust Values
        </span>
      </button>
      <button
        @click="$emit('reset')"
        class="bg-gradient-to-r from-purple-500 to-fuchsia-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105"
      >
        <span class="flex items-center justify-center gap-2">
          &#128260; New Decision
        </span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useToolsStore } from '@/stores/ToolsStore'
import AnimatedCounter from '@/components/AnimatedCounter.vue'
import ConfettiCelebration from '@/components/ConfettiCelebration.vue'

const store = useToolsStore()
const showConfetti = ref(false)

defineEmits(['back', 'reset'])

onMounted(() => {
  setTimeout(() => {
    showConfetti.value = true
  }, 500)
})

const isPositive = computed(() => store.regretScore >= 65)
const isNeutral = computed(() => store.regretScore >= 45 && store.regretScore < 65)

const resultIcon = computed(() => {
  if (isPositive.value) return '&#128640;'
  if (isNeutral.value) return '&#129300;'
  return '&#128528;'
})

const headerClass = computed(() => {
  if (isPositive.value) return 'bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500'
  if (isNeutral.value) return 'bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500'
  return 'bg-gradient-to-r from-rose-500 via-red-500 to-pink-500'
})

const circleClass = computed(() => {
  if (isPositive.value) return 'bg-emerald-300'
  if (isNeutral.value) return 'bg-amber-300'
  return 'bg-rose-300'
})

const scoreGradient = computed(() => {
  if (isPositive.value) return 'bg-gradient-to-r from-emerald-600 to-teal-600'
  if (isNeutral.value) return 'bg-gradient-to-r from-amber-600 to-orange-600'
  return 'bg-gradient-to-r from-rose-600 to-pink-600'
})

const barClass = computed(() => {
  if (isPositive.value) return 'bg-gradient-to-r from-emerald-400 to-teal-500'
  if (isNeutral.value) return 'bg-gradient-to-r from-amber-400 to-orange-500'
  return 'bg-gradient-to-r from-rose-400 to-pink-500'
})
</script>

<style scoped>
@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(5deg); }
}
</style>
