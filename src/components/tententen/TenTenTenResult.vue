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
          <h1 class="text-4xl font-extrabold mb-3">{{ store.tententenAdvice.text }}</h1>
          <p class="text-lg opacity-90">
            For decision: <span class="font-bold underline">"{{ store.tententen.decision }}"</span>
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
            <AnimatedCounter :value="store.tententenScore" :duration="1500" />
          </div>
          <div class="text-sm text-gray-500 uppercase tracking-widest">Weighted Score</div>
        </div>

        <!-- Score Bar -->
        <div class="max-w-md mx-auto">
          <div class="relative h-4 bg-gray-200 rounded-full overflow-hidden">
            <div
              class="absolute inset-y-0 left-0 rounded-full transition-all duration-1000"
              :class="barClass"
              :style="{ width: store.tententenScore + '%' }"
            >
              <div class="absolute inset-0 shimmer"></div>
            </div>
          </div>
          <div class="flex justify-between text-xs text-gray-500 mt-2">
            <span>0</span>
            <span class="font-bold">40</span>
            <span class="font-bold">60</span>
            <span>100</span>
          </div>
        </div>
      </div>

      <!-- Breakdown -->
      <div class="p-8 border-t">
        <h2 class="text-xl font-bold text-gray-800 mb-6 text-center">Time Perspective Breakdown</h2>

        <div class="space-y-4">
          <div class="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
            <div class="flex items-center gap-3">
              <span class="text-2xl">&#9201;</span>
              <div>
                <div class="font-semibold text-gray-800">10 Minutes</div>
                <div class="text-xs text-gray-500">15% weight</div>
              </div>
            </div>
            <div class="text-2xl font-bold text-blue-600">{{ store.tententen.feel10min }}</div>
          </div>

          <div class="flex items-center justify-between p-4 bg-indigo-50 rounded-xl">
            <div class="flex items-center gap-3">
              <span class="text-2xl">&#128197;</span>
              <div>
                <div class="font-semibold text-gray-800">10 Months</div>
                <div class="text-xs text-gray-500">35% weight</div>
              </div>
            </div>
            <div class="text-2xl font-bold text-indigo-600">{{ store.tententen.feel10months }}</div>
          </div>

          <div class="flex items-center justify-between p-4 bg-purple-50 rounded-xl">
            <div class="flex items-center gap-3">
              <span class="text-2xl">&#9203;</span>
              <div>
                <div class="font-semibold text-gray-800">10 Years</div>
                <div class="text-xs text-gray-500">50% weight</div>
              </div>
            </div>
            <div class="text-2xl font-bold text-purple-600">{{ store.tententen.feel10years }}</div>
          </div>
        </div>
      </div>

      <!-- Advice -->
      <div class="p-8 bg-gray-50 border-t">
        <h2 class="text-xl font-bold text-gray-800 mb-4">What This Means</h2>
        <p class="text-gray-700 leading-relaxed">
          <template v-if="isPositive">
            <span class="text-green-600 font-semibold">Great news!</span>
            Your long-term perspective shows this decision will likely serve you well.
            The 10-10-10 rule suggests that choices feeling good in 10 years are usually worth the short-term discomfort.
          </template>
          <template v-else-if="isNeutral">
            <span class="text-amber-600 font-semibold">It's a close call.</span>
            Your feelings are mixed across time horizons. Consider what's driving the uncertainty
            and whether you can gather more information before deciding.
          </template>
          <template v-else>
            <span class="text-red-600 font-semibold">Pause and reflect.</span>
            The long-term outlook doesn't seem positive. Consider whether the short-term appeal
            is masking potential regret. Sometimes the best decision is to wait.
          </template>
        </p>
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
      <SaveToHistoryButton
        tool="tententen"
        :decision="store.tententen.decision"
        :score="store.tententenScore"
        :recommendation="store.tententenAdvice.text"
        :recommendation-type="store.tententenAdvice.type"
        :data="{ ...store.tententen }"
      />
      <button
        @click="$emit('reset')"
        class="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105"
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
import SaveToHistoryButton from '@/components/shared/SaveToHistoryButton.vue'

const store = useToolsStore()
const showConfetti = ref(false)

defineEmits(['back', 'reset'])

onMounted(() => {
  setTimeout(() => {
    showConfetti.value = true
  }, 500)
})

const isPositive = computed(() => store.tententenScore >= 60)
const isNeutral = computed(() => store.tententenScore >= 40 && store.tententenScore < 60)

const resultIcon = computed(() => {
  if (isPositive.value) return '&#127881;'
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
