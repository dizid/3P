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
          <h1 class="text-4xl font-extrabold mb-3">{{ store.swotAdvice.text }}</h1>
          <p class="text-lg opacity-90">
            For: <span class="font-bold underline">"{{ store.swot.decision }}"</span>
          </p>
        </div>
      </div>

      <!-- Score Display -->
      <div class="p-8 bg-gradient-to-b from-gray-50 to-white">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-center mb-8">
          <div class="glass p-4 rounded-xl">
            <div class="text-sm text-gray-500 uppercase tracking-wider mb-1">Internal</div>
            <div class="text-4xl font-black" :class="internalClass">
              {{ store.swotInternalScore >= 0 ? '+' : '' }}{{ store.swotInternalScore }}
            </div>
            <div class="text-xs text-gray-500 mt-1">S - W</div>
          </div>
          <div class="glass p-4 rounded-xl">
            <div class="text-sm text-gray-500 uppercase tracking-wider mb-1">External</div>
            <div class="text-4xl font-black" :class="externalClass">
              {{ store.swotExternalScore >= 0 ? '+' : '' }}{{ store.swotExternalScore }}
            </div>
            <div class="text-xs text-gray-500 mt-1">O - T</div>
          </div>
          <div class="glass p-4 rounded-xl border-2 border-amber-300">
            <div class="text-sm text-gray-500 uppercase tracking-wider mb-1">Overall</div>
            <div class="text-4xl font-black" :class="overallClass">
              <AnimatedCounter :value="store.swotOverallScore" :duration="1500" show-sign />
            </div>
            <div class="text-xs text-gray-500 mt-1">Position</div>
          </div>
        </div>

        <!-- Score Bar -->
        <div class="max-w-md mx-auto">
          <div class="relative h-4 bg-gray-200 rounded-full overflow-hidden">
            <div
              class="absolute inset-y-0 rounded-full transition-all duration-1000"
              :class="[barClass, barPosition]"
              :style="{ width: barWidth + '%' }"
            >
              <div class="absolute inset-0 shimmer"></div>
            </div>
          </div>
          <div class="flex justify-between text-xs text-gray-500 mt-2">
            <span>-50</span>
            <span>0</span>
            <span>+50</span>
          </div>
        </div>
      </div>

      <!-- Quadrant Summary -->
      <div class="p-8 border-t">
        <h2 class="text-xl font-bold text-gray-800 mb-6 text-center">Your SWOT Breakdown</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Strengths -->
          <div class="p-4 bg-green-50 rounded-xl">
            <div class="flex items-center gap-2 mb-3">
              <span class="text-2xl">&#128170;</span>
              <span class="font-bold text-green-700">Strengths</span>
              <span class="ml-auto text-lg font-bold text-green-600">+{{ store.swotStrengthsScore }}</span>
            </div>
            <ul class="space-y-1 text-sm text-gray-700">
              <li v-for="item in filledStrengths" :key="item.id" class="flex justify-between">
                <span>{{ item.text }}</span>
                <span class="text-green-600 font-medium">+{{ item.weight }}</span>
              </li>
              <li v-if="!filledStrengths.length" class="text-gray-400 italic">None added</li>
            </ul>
          </div>

          <!-- Weaknesses -->
          <div class="p-4 bg-red-50 rounded-xl">
            <div class="flex items-center gap-2 mb-3">
              <span class="text-2xl">&#128683;</span>
              <span class="font-bold text-red-700">Weaknesses</span>
              <span class="ml-auto text-lg font-bold text-red-600">-{{ store.swotWeaknessesScore }}</span>
            </div>
            <ul class="space-y-1 text-sm text-gray-700">
              <li v-for="item in filledWeaknesses" :key="item.id" class="flex justify-between">
                <span>{{ item.text }}</span>
                <span class="text-red-600 font-medium">-{{ item.weight }}</span>
              </li>
              <li v-if="!filledWeaknesses.length" class="text-gray-400 italic">None added</li>
            </ul>
          </div>

          <!-- Opportunities -->
          <div class="p-4 bg-blue-50 rounded-xl">
            <div class="flex items-center gap-2 mb-3">
              <span class="text-2xl">&#127775;</span>
              <span class="font-bold text-blue-700">Opportunities</span>
              <span class="ml-auto text-lg font-bold text-blue-600">+{{ store.swotOpportunitiesScore }}</span>
            </div>
            <ul class="space-y-1 text-sm text-gray-700">
              <li v-for="item in filledOpportunities" :key="item.id" class="flex justify-between">
                <span>{{ item.text }}</span>
                <span class="text-blue-600 font-medium">+{{ item.weight }}</span>
              </li>
              <li v-if="!filledOpportunities.length" class="text-gray-400 italic">None added</li>
            </ul>
          </div>

          <!-- Threats -->
          <div class="p-4 bg-orange-50 rounded-xl">
            <div class="flex items-center gap-2 mb-3">
              <span class="text-2xl">&#9888;</span>
              <span class="font-bold text-orange-700">Threats</span>
              <span class="ml-auto text-lg font-bold text-orange-600">-{{ store.swotThreatsScore }}</span>
            </div>
            <ul class="space-y-1 text-sm text-gray-700">
              <li v-for="item in filledThreats" :key="item.id" class="flex justify-between">
                <span>{{ item.text }}</span>
                <span class="text-orange-600 font-medium">-{{ item.weight }}</span>
              </li>
              <li v-if="!filledThreats.length" class="text-gray-400 italic">None added</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Strategic Advice -->
      <div class="p-8 bg-gray-50 border-t">
        <h2 class="text-xl font-bold text-gray-800 mb-4">Strategic Insight</h2>
        <div class="flex gap-4 items-start">
          <div class="text-4xl">&#127919;</div>
          <p class="text-gray-700 leading-relaxed italic">
            <template v-if="isPositive">
              "Your strengths and opportunities outweigh your weaknesses and threats.
              This is a favorable position! Focus on leveraging your strengths to capitalize on opportunities,
              while working to address weaknesses before they become critical."
            </template>
            <template v-else-if="isNeutral">
              "Your analysis shows a balanced situation with both opportunities and challenges.
              Consider which specific strengths can offset your weaknesses, and develop strategies
              to mitigate threats while pursuing the most promising opportunities."
            </template>
            <template v-else>
              "The threats and weaknesses currently outweigh the positives.
              This doesn't mean you shouldn't proceed, but you should develop mitigation strategies.
              Focus on strengthening weak areas and preparing contingencies for potential threats."
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
          &#8592; Adjust Analysis
        </span>
      </button>
      <SaveToHistoryButton
        tool="swot"
        :decision="store.swot.decision"
        :score="store.swotOverallScore"
        :recommendation="store.swotAdvice.text"
        :recommendation-type="store.swotAdvice.type"
        :data="{ ...store.swot }"
      />
      <button
        @click="$emit('reset')"
        class="bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105"
      >
        <span class="flex items-center justify-center gap-2">
          &#127919; New Analysis
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

// Filtered items (only those with text)
const filledStrengths = computed(() => store.swot.strengths.filter(i => i.text.trim()))
const filledWeaknesses = computed(() => store.swot.weaknesses.filter(i => i.text.trim()))
const filledOpportunities = computed(() => store.swot.opportunities.filter(i => i.text.trim()))
const filledThreats = computed(() => store.swot.threats.filter(i => i.text.trim()))

const isPositive = computed(() => store.swotOverallScore >= 5)
const isNeutral = computed(() => store.swotOverallScore >= -5 && store.swotOverallScore < 5)

const resultIcon = computed(() => {
  if (isPositive.value) return '&#127941;'
  if (isNeutral.value) return '&#129300;'
  return '&#128528;'
})

const headerClass = computed(() => {
  if (isPositive.value) return 'bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500'
  if (isNeutral.value) return 'bg-gradient-to-r from-gray-500 via-slate-500 to-zinc-500'
  return 'bg-gradient-to-r from-rose-500 via-red-500 to-pink-500'
})

const circleClass = computed(() => {
  if (isPositive.value) return 'bg-amber-300'
  if (isNeutral.value) return 'bg-gray-300'
  return 'bg-rose-300'
})

const internalClass = computed(() => {
  if (store.swotInternalScore >= 5) return 'text-green-600'
  if (store.swotInternalScore >= -5) return 'text-amber-600'
  return 'text-red-600'
})

const externalClass = computed(() => {
  if (store.swotExternalScore >= 5) return 'text-green-600'
  if (store.swotExternalScore >= -5) return 'text-amber-600'
  return 'text-red-600'
})

const overallClass = computed(() => {
  if (isPositive.value) return 'text-green-600'
  if (isNeutral.value) return 'text-amber-600'
  return 'text-red-600'
})

const barClass = computed(() => {
  if (isPositive.value) return 'bg-gradient-to-r from-amber-400 to-orange-500'
  if (isNeutral.value) return 'bg-gradient-to-r from-gray-400 to-slate-500'
  return 'bg-gradient-to-r from-rose-400 to-pink-500'
})

// Bar positioning - center at 0, scale -50 to +50
const barWidth = computed(() => {
  const score = Math.max(-50, Math.min(50, store.swotOverallScore))
  return Math.abs(score)
})

const barPosition = computed(() => {
  if (store.swotOverallScore >= 0) return 'left-1/2'
  return 'right-1/2'
})
</script>

<style scoped>
@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(5deg); }
}
</style>
