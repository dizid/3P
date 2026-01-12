<template>
  <div>
    <!-- Confetti for positive results -->
    <ConfettiCelebration :active="showConfetti && isPositive" :count="80" />

    <!-- Result Card -->
    <div class="glass-card overflow-hidden animate-on-enter">
      <!-- Header with Animated Recommendation -->
      <div
        class="relative p-8 sm:p-10 text-center overflow-hidden"
        :class="headerClass"
      >
        <!-- Animated background circles -->
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
          <div
            class="absolute top-1/2 right-1/4 w-24 h-24 rounded-full opacity-10"
            :class="circleClass"
            style="animation: float 5s ease-in-out infinite"
          ></div>
        </div>

        <div class="relative z-10 text-white">
          <div
            class="text-5xl sm:text-6xl mb-4"
            :class="isPositive ? 'animate-bounce-subtle' : ''"
          >
            {{ resultIcon }}
          </div>
          <h1 class="text-4xl sm:text-5xl font-extrabold mb-4 tracking-tight">
            {{ store.threepsAdvice.text }}
          </h1>
          <p class="text-lg sm:text-xl opacity-95 leading-relaxed max-w-2xl mx-auto">
            Op basis van jouw waarden en project
            <span class="font-bold underline decoration-2 underline-offset-4">"{{ store.threeps.project }}"</span>
            is het advies: <span class="font-extrabold text-2xl">{{ adviceWord }}</span> doen.
          </p>
        </div>
      </div>

      <!-- Score Overview with Animated Counter -->
      <div class="p-6 sm:p-8 bg-gradient-to-b from-gray-50 to-white dark:from-slate-800 dark:to-slate-900">
        <div class="text-center mb-8">
          <div class="inline-block">
            <div
              class="text-6xl sm:text-7xl font-black mb-2 bg-clip-text text-transparent"
              :class="scoreGradient"
            >
              <AnimatedCounter :value="store.threepsScore" :duration="2000" />
            </div>
            <div class="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-widest font-semibold">
              Totale Score
            </div>
          </div>
        </div>

        <!-- Animated Progress Bar -->
        <div class="max-w-md mx-auto">
          <div class="flex justify-between text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            <span>Score</span>
            <span>{{ scorePercentage }}%</span>
          </div>
          <div class="relative h-5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              class="absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ease-out"
              :class="barClass"
              :style="{ width: animatedWidth }"
            >
              <div class="absolute inset-0 shimmer"></div>
            </div>
            <!-- Threshold marker at 6000 (20% of 30000) -->
            <div
              class="absolute top-0 bottom-0 w-0.5 bg-gray-700 dark:bg-gray-300 z-10"
              style="left: 20%"
            >
              <div class="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-bold text-gray-600 dark:text-gray-400 whitespace-nowrap">
                6.000
              </div>
            </div>
          </div>
          <div class="flex justify-between text-xs text-gray-400 dark:text-gray-500 mt-1">
            <span>0</span>
            <span>30.000</span>
          </div>
        </div>
      </div>

      <!-- Individual P Breakdown -->
      <div class="p-6 sm:p-8">
        <h2 class="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">
          Breakdown per P
        </h2>

        <div class="space-y-4">
          <!-- Poen -->
          <div class="glass p-5 sm:p-6 rounded-2xl border border-green-200/50 dark:border-green-800/50 card-lift animate-on-enter stagger-1">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-3 sm:gap-4">
                <div class="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl shadow-lg">
                  &#128176;
                </div>
                <div>
                  <h3 class="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100">Poen</h3>
                  <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Financiele waarde</p>
                </div>
              </div>
              <div class="text-right">
                <div class="text-2xl sm:text-3xl font-bold text-green-600">
                  <AnimatedCounter :value="poenScore" :delay="200" />
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400">{{ poenPercentage }}% van totaal</div>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3 sm:gap-4 mb-4">
              <div class="bg-white/60 dark:bg-slate-800/60 rounded-xl p-3 text-center">
                <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">Jouw waarde</div>
                <div class="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100">{{ store.threeps.baselinePoen }}</div>
              </div>
              <div class="bg-white/60 dark:bg-slate-800/60 rounded-xl p-3 text-center">
                <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">Project waarde</div>
                <div class="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100">{{ store.threeps.projectPoen }}</div>
              </div>
            </div>

            <div class="h-3 bg-green-100 dark:bg-green-900/30 rounded-full overflow-hidden">
              <div
                class="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all duration-1000"
                :style="{ width: `${Math.min((poenScore / 10000) * 100, 100)}%` }"
              ></div>
            </div>
          </div>

          <!-- Pret -->
          <div class="glass p-5 sm:p-6 rounded-2xl border border-blue-200/50 dark:border-blue-800/50 card-lift animate-on-enter stagger-2">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-3 sm:gap-4">
                <div class="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl shadow-lg">
                  &#127881;
                </div>
                <div>
                  <h3 class="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100">Pret</h3>
                  <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Plezier & zingeving</p>
                </div>
              </div>
              <div class="text-right">
                <div class="text-2xl sm:text-3xl font-bold text-blue-600">
                  <AnimatedCounter :value="pretScore" :delay="400" />
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400">{{ pretPercentage }}% van totaal</div>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3 sm:gap-4 mb-4">
              <div class="bg-white/60 dark:bg-slate-800/60 rounded-xl p-3 text-center">
                <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">Jouw waarde</div>
                <div class="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100">{{ store.threeps.baselinePret }}</div>
              </div>
              <div class="bg-white/60 dark:bg-slate-800/60 rounded-xl p-3 text-center">
                <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">Project waarde</div>
                <div class="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100">{{ store.threeps.projectPret }}</div>
              </div>
            </div>

            <div class="h-3 bg-blue-100 dark:bg-blue-900/30 rounded-full overflow-hidden">
              <div
                class="h-full bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full transition-all duration-1000"
                :style="{ width: `${Math.min((pretScore / 10000) * 100, 100)}%` }"
              ></div>
            </div>
          </div>

          <!-- Prestige -->
          <div class="glass p-5 sm:p-6 rounded-2xl border border-purple-200/50 dark:border-purple-800/50 card-lift animate-on-enter stagger-3">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-3 sm:gap-4">
                <div class="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-purple-400 to-pink-600 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl shadow-lg">
                  &#128081;
                </div>
                <div>
                  <h3 class="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100">Prestige</h3>
                  <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Status & erkenning</p>
                </div>
              </div>
              <div class="text-right">
                <div class="text-2xl sm:text-3xl font-bold text-purple-600">
                  <AnimatedCounter :value="prestigeScore" :delay="600" />
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400">{{ prestigePercentage }}% van totaal</div>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3 sm:gap-4 mb-4">
              <div class="bg-white/60 dark:bg-slate-800/60 rounded-xl p-3 text-center">
                <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">Jouw waarde</div>
                <div class="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100">{{ store.threeps.baselinePrestige }}</div>
              </div>
              <div class="bg-white/60 dark:bg-slate-800/60 rounded-xl p-3 text-center">
                <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">Project waarde</div>
                <div class="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100">{{ store.threeps.projectPrestige }}</div>
              </div>
            </div>

            <div class="h-3 bg-purple-100 dark:bg-purple-900/30 rounded-full overflow-hidden">
              <div
                class="h-full bg-gradient-to-r from-purple-400 to-pink-500 rounded-full transition-all duration-1000"
                :style="{ width: `${Math.min((prestigeScore / 10000) * 100, 100)}%` }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Advice Section -->
      <div class="p-6 sm:p-8 bg-gray-50 dark:bg-slate-800 border-t dark:border-slate-700 animate-on-enter stagger-4">
        <h2 class="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
          <span>&#128172;</span> Wat betekent dit?
        </h2>
        <div class="prose prose-lg max-w-none text-gray-700 dark:text-gray-300">
          <p v-if="isPositive" class="leading-relaxed">
            <span class="text-emerald-600 font-semibold">Geweldig nieuws!</span>
            Dit project sluit uitstekend aan bij jouw persoonlijke waarden.
            De combinatie van wat jij belangrijk vindt en wat dit project biedt,
            geeft een sterke match. Ga vol vertrouwen door met dit project!
          </p>
          <p v-else-if="isNeutral" class="leading-relaxed">
            <span class="text-amber-600 font-semibold">Het is kantje boord...</span>
            Dit project heeft potentie, maar sluit niet perfect aan bij al je waarden.
            Overweeg wat je kunt aanpassen of waar je compromissen wilt maken.
          </p>
          <p v-else class="leading-relaxed">
            <span class="text-rose-600 font-semibold">Even nadenken...</span>
            Op basis van deze analyse lijkt dit project minder goed aan te sluiten
            bij wat jij belangrijk vindt. Dit betekent niet dat het project slecht is,
            maar dat het mogelijk niet het beste gebruik is van jouw tijd en energie.
          </p>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center mt-8 animate-on-enter stagger-5">
      <button
        @click="$emit('back')"
        class="glass hover:bg-white/80 dark:hover:bg-slate-700/80 text-gray-700 dark:text-gray-200 font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-600 transform transition-all duration-200 hover:scale-105"
      >
        <span class="flex items-center justify-center gap-2">
          &#8592; Aanpassen
        </span>
      </button>
      <SaveToHistoryButton
        tool="threeps"
        :decision="store.threeps.project"
        :score="store.threepsScore"
        :recommendation="store.threepsAdvice.text"
        :recommendation-type="store.threepsAdvice.type"
        :data="{ ...store.threeps }"
      />
      <button
        @click="$emit('reset')"
        class="btn-ripple bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105"
      >
        <span class="flex items-center justify-center gap-2">
          &#128260; Nieuw Project
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
const animatedWidth = ref('0%')

defineEmits(['back', 'reset'])

onMounted(() => {
  setTimeout(() => {
    showConfetti.value = true
  }, 500)

  setTimeout(() => {
    animatedWidth.value = `${Math.min(scorePercentage.value, 100)}%`
  }, 300)
})

// Computed values
const poenScore = computed(() => store.threeps.baselinePoen * store.threeps.projectPoen)
const pretScore = computed(() => store.threeps.baselinePret * store.threeps.projectPret)
const prestigeScore = computed(() => store.threeps.baselinePrestige * store.threeps.projectPrestige)

const isPositive = computed(() => store.threepsScore >= 6000)
const isNeutral = computed(() => store.threepsScore >= 4500 && store.threepsScore < 6000)

const adviceWord = computed(() => isPositive.value ? 'wel' : 'niet')

const poenPercentage = computed(() =>
  store.threepsScore > 0 ? Math.round((poenScore.value / store.threepsScore) * 100) : 0
)
const pretPercentage = computed(() =>
  store.threepsScore > 0 ? Math.round((pretScore.value / store.threepsScore) * 100) : 0
)
const prestigePercentage = computed(() =>
  store.threepsScore > 0 ? Math.round((prestigeScore.value / store.threepsScore) * 100) : 0
)
const scorePercentage = computed(() =>
  Math.round((store.threepsScore / 30000) * 100)
)

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
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-15px) rotate(5deg);
  }
}
</style>
