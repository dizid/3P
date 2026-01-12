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
          <h1 class="text-4xl font-extrabold mb-3">{{ store.pmiAdvice.text }}</h1>
          <p class="text-lg opacity-90">
            For: <span class="font-bold underline">"{{ store.pmi.decision }}"</span>
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
            {{ store.pmiNetScore >= 0 ? '+' : '' }}<AnimatedCounter :value="Math.abs(store.pmiNetScore)" :duration="1500" />
          </div>
          <div class="text-sm text-gray-500 uppercase tracking-widest">Net Score</div>
        </div>

        <!-- Score Breakdown -->
        <div class="flex justify-center gap-6 text-center">
          <div>
            <div class="text-2xl font-bold text-green-600">+{{ store.pmiPlusScore }}</div>
            <div class="text-xs text-gray-500">Plus</div>
          </div>
          <div>
            <div class="text-2xl font-bold text-red-600">-{{ store.pmiMinusScore }}</div>
            <div class="text-xs text-gray-500">Minus</div>
          </div>
          <div>
            <div class="text-2xl font-bold text-blue-600">~{{ Math.round(store.pmiInterestingScore) }}</div>
            <div class="text-xs text-gray-500">Interesting</div>
          </div>
        </div>
      </div>

      <!-- Item Lists -->
      <div class="p-8 border-t">
        <h2 class="text-xl font-bold text-gray-800 mb-6 text-center">Your Analysis</h2>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Plus Items -->
          <div v-if="filledPlusItems.length" class="space-y-2">
            <h3 class="font-bold text-green-600 flex items-center gap-2">
              <span>&#10133;</span> Plus ({{ store.pmiPlusScore }})
            </h3>
            <div
              v-for="item in filledPlusItems"
              :key="item.id"
              class="flex items-center justify-between p-3 bg-green-50 rounded-lg"
            >
              <span class="text-gray-800">{{ item.text }}</span>
              <span class="text-green-600 font-bold">+{{ item.weight }}</span>
            </div>
          </div>

          <!-- Minus Items -->
          <div v-if="filledMinusItems.length" class="space-y-2">
            <h3 class="font-bold text-red-600 flex items-center gap-2">
              <span>&#10134;</span> Minus ({{ store.pmiMinusScore }})
            </h3>
            <div
              v-for="item in filledMinusItems"
              :key="item.id"
              class="flex items-center justify-between p-3 bg-red-50 rounded-lg"
            >
              <span class="text-gray-800">{{ item.text }}</span>
              <span class="text-red-600 font-bold">-{{ item.weight }}</span>
            </div>
          </div>

          <!-- Interesting Items -->
          <div v-if="filledInterestingItems.length" class="space-y-2">
            <h3 class="font-bold text-blue-600 flex items-center gap-2">
              <span>&#10067;</span> Interesting (~{{ Math.round(store.pmiInterestingScore) }})
            </h3>
            <div
              v-for="item in filledInterestingItems"
              :key="item.id"
              class="flex items-center justify-between p-3 bg-blue-50 rounded-lg"
            >
              <span class="text-gray-800">{{ item.text }}</span>
              <span class="text-blue-600 font-bold">{{ item.weight }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Advice -->
      <div class="p-8 bg-gray-50 border-t">
        <h2 class="text-xl font-bold text-gray-800 mb-4">What This Means</h2>
        <p class="text-gray-700 leading-relaxed">
          <template v-if="store.pmiNetScore >= 10">
            <span class="text-green-600 font-semibold">Strong positive signal!</span>
            Your analysis shows significantly more benefits than drawbacks.
            The plusses clearly outweigh the minuses - this looks like a good decision.
          </template>
          <template v-else-if="store.pmiNetScore >= 3">
            <span class="text-green-600 font-semibold">Leaning positive.</span>
            The benefits edge out the risks. Consider if the "interesting" factors
            might tip the balance further in either direction.
          </template>
          <template v-else-if="store.pmiNetScore >= -3">
            <span class="text-amber-600 font-semibold">It's balanced.</span>
            The pros and cons are roughly equal. Look at your "interesting" items -
            they may hold the key to your decision. What unknowns need resolution?
          </template>
          <template v-else-if="store.pmiNetScore >= -10">
            <span class="text-red-600 font-semibold">Leaning negative.</span>
            The drawbacks currently outweigh the benefits. Can any minuses be mitigated?
            Are there hidden plusses you haven't considered?
          </template>
          <template v-else>
            <span class="text-red-600 font-semibold">Strong caution signal.</span>
            Your analysis shows significantly more risks than benefits.
            Unless circumstances change, this may not be the right move.
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
          &#8592; Edit Analysis
        </span>
      </button>
      <SaveToHistoryButton
        tool="pmi"
        :decision="store.pmi.decision"
        :score="store.pmiNetScore"
        :recommendation="store.pmiAdvice.text"
        :recommendation-type="store.pmiAdvice.type"
        :data="{ ...store.pmi }"
      />
      <button
        @click="$emit('reset')"
        class="bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105"
      >
        <span class="flex items-center justify-center gap-2">
          &#128260; New Analysis
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

const filledPlusItems = computed(() => store.pmi.plusItems.filter(i => i.text.trim()))
const filledMinusItems = computed(() => store.pmi.minusItems.filter(i => i.text.trim()))
const filledInterestingItems = computed(() => store.pmi.interestingItems.filter(i => i.text.trim()))

const isPositive = computed(() => store.pmiNetScore >= 3)
const isNeutral = computed(() => store.pmiNetScore >= -3 && store.pmiNetScore < 3)

const resultIcon = computed(() => {
  if (store.pmiNetScore >= 10) return '&#128640;'
  if (store.pmiNetScore >= 3) return '&#128077;'
  if (store.pmiNetScore >= -3) return '&#129300;'
  if (store.pmiNetScore >= -10) return '&#128078;'
  return '&#128683;'
})

const headerClass = computed(() => {
  if (store.pmiNetScore >= 3) return 'bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500'
  if (store.pmiNetScore >= -3) return 'bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500'
  return 'bg-gradient-to-r from-rose-500 via-red-500 to-pink-500'
})

const circleClass = computed(() => {
  if (store.pmiNetScore >= 3) return 'bg-emerald-300'
  if (store.pmiNetScore >= -3) return 'bg-amber-300'
  return 'bg-rose-300'
})

const scoreGradient = computed(() => {
  if (store.pmiNetScore >= 3) return 'bg-gradient-to-r from-emerald-600 to-teal-600'
  if (store.pmiNetScore >= -3) return 'bg-gradient-to-r from-amber-600 to-orange-600'
  return 'bg-gradient-to-r from-rose-600 to-pink-600'
})
</script>

<style scoped>
@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(5deg); }
}
</style>
