<template>
  <div class="min-h-screen py-8 px-4">
    <!-- Confetti Celebration for Positive Results -->
    <ConfettiCelebration :active="showConfetti && isPositive" :count="80" />

    <div class="max-w-4xl mx-auto">

      <!-- Progress Stepper -->
      <ProgressStepper :current-step="3" />

      <!-- Main Result Card -->
      <div class="glass-card overflow-hidden animate-on-enter">

        <!-- Header with Animated Recommendation -->
        <div
          :class="[
            'relative p-8 sm:p-10 text-center overflow-hidden',
            isPositive
              ? 'bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500'
              : 'bg-gradient-to-r from-rose-500 via-red-500 to-pink-500'
          ]"
        >
          <!-- Animated background circles -->
          <div class="absolute inset-0 overflow-hidden">
            <div
              :class="[
                'absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-20',
                isPositive ? 'bg-emerald-300' : 'bg-rose-300'
              ]"
              style="animation: float 4s ease-in-out infinite"
            ></div>
            <div
              :class="[
                'absolute -bottom-10 -left-10 w-32 h-32 rounded-full opacity-20',
                isPositive ? 'bg-teal-300' : 'bg-pink-300'
              ]"
              style="animation: float 3s ease-in-out infinite reverse"
            ></div>
            <div
              :class="[
                'absolute top-1/2 right-1/4 w-24 h-24 rounded-full opacity-10',
                isPositive ? 'bg-green-200' : 'bg-red-200'
              ]"
              style="animation: float 5s ease-in-out infinite"
            ></div>
          </div>

          <div class="relative z-10 text-white">
            <div
              class="text-5xl sm:text-6xl mb-4"
              :class="isPositive ? 'animate-bounce-subtle' : ''"
            >
              {{ isPositive ? '&#127881;' : '&#129300;' }}
            </div>
            <h1 class="text-4xl sm:text-5xl font-extrabold mb-4 tracking-tight">
              {{ isPositive ? 'Ga ervoor!' : 'Overweeg goed' }}
            </h1>
            <p class="text-lg sm:text-xl opacity-95 leading-relaxed max-w-2xl mx-auto">
              Op basis van jouw waarden en project
              <span class="font-bold underline decoration-2 underline-offset-4">"{{ store.project }}"</span>
              is het advies: <span class="font-extrabold text-2xl">{{ Advice }}</span> doen.
            </p>
          </div>
        </div>

        <!-- Score Overview with Animated Counter -->
        <div class="p-6 sm:p-8 bg-gradient-to-b from-gray-50 to-white">
          <div class="text-center mb-8">
            <div class="inline-block">
              <div
                :class="[
                  'text-6xl sm:text-7xl font-black mb-2 bg-clip-text text-transparent',
                  isPositive
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600'
                    : 'bg-gradient-to-r from-rose-600 to-pink-600'
                ]"
              >
                <AnimatedCounter :value="store.endScore" :duration="2000" />
              </div>
              <div class="text-sm text-gray-500 uppercase tracking-widest font-semibold">
                Totale Score
              </div>
            </div>
          </div>

          <!-- Animated Progress Bar -->
          <div class="max-w-md mx-auto">
            <div class="flex justify-between text-sm font-medium text-gray-600 mb-2">
              <span>Score</span>
              <span>{{ scorePercentage }}%</span>
            </div>
            <div class="relative h-5 bg-gray-200 rounded-full overflow-hidden">
              <div
                class="absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ease-out"
                :class="isPositive
                  ? 'bg-gradient-to-r from-emerald-400 to-teal-500'
                  : 'bg-gradient-to-r from-rose-400 to-pink-500'"
                :style="{ width: animatedWidth }"
              >
                <!-- Shimmer effect -->
                <div class="absolute inset-0 shimmer"></div>
              </div>
              <!-- Threshold marker at 6000 (20% of 30000) -->
              <div
                class="absolute top-0 bottom-0 w-0.5 bg-gray-700 z-10"
                style="left: 20%"
              >
                <div class="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-bold text-gray-600 whitespace-nowrap">
                  6.000
                </div>
              </div>
            </div>
            <div class="flex justify-between text-xs text-gray-400 mt-1">
              <span>0</span>
              <span>30.000</span>
            </div>
          </div>
        </div>

        <!-- Individual P Breakdown -->
        <div class="p-6 sm:p-8">
          <h2 class="text-xl sm:text-2xl font-bold text-gray-800 mb-6 text-center">
            Breakdown per P
          </h2>

          <div class="space-y-4">
            <!-- Poen -->
            <div class="glass p-5 sm:p-6 rounded-2xl border border-green-200/50 card-lift animate-on-enter stagger-1">
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-3 sm:gap-4">
                  <div class="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl shadow-lg">
                    &#128176;
                  </div>
                  <div>
                    <h3 class="text-lg sm:text-xl font-bold text-gray-800">Poen</h3>
                    <p class="text-xs sm:text-sm text-gray-500">Financiele waarde</p>
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-2xl sm:text-3xl font-bold text-green-600">
                    <AnimatedCounter :value="poenScore" :delay="200" />
                  </div>
                  <div class="text-xs text-gray-500">{{ poenPercentage }}% van totaal</div>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-3 sm:gap-4 mb-4">
                <div class="bg-white/60 rounded-xl p-3 text-center">
                  <div class="text-xs text-gray-500 mb-1">Jouw waarde</div>
                  <div class="text-xl sm:text-2xl font-bold text-gray-800">{{ store.baselinepoen }}</div>
                </div>
                <div class="bg-white/60 rounded-xl p-3 text-center">
                  <div class="text-xs text-gray-500 mb-1">Project waarde</div>
                  <div class="text-xl sm:text-2xl font-bold text-gray-800">{{ store.projectpoen }}</div>
                </div>
              </div>

              <div class="h-3 bg-green-100 rounded-full overflow-hidden">
                <div
                  class="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all duration-1000"
                  :style="{ width: `${Math.min((poenScore / 10000) * 100, 100)}%` }"
                ></div>
              </div>
            </div>

            <!-- Pret -->
            <div class="glass p-5 sm:p-6 rounded-2xl border border-blue-200/50 card-lift animate-on-enter stagger-2">
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-3 sm:gap-4">
                  <div class="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl shadow-lg">
                    &#127881;
                  </div>
                  <div>
                    <h3 class="text-lg sm:text-xl font-bold text-gray-800">Pret</h3>
                    <p class="text-xs sm:text-sm text-gray-500">Plezier & zingeving</p>
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-2xl sm:text-3xl font-bold text-blue-600">
                    <AnimatedCounter :value="pretScore" :delay="400" />
                  </div>
                  <div class="text-xs text-gray-500">{{ pretPercentage }}% van totaal</div>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-3 sm:gap-4 mb-4">
                <div class="bg-white/60 rounded-xl p-3 text-center">
                  <div class="text-xs text-gray-500 mb-1">Jouw waarde</div>
                  <div class="text-xl sm:text-2xl font-bold text-gray-800">{{ store.baselinepret }}</div>
                </div>
                <div class="bg-white/60 rounded-xl p-3 text-center">
                  <div class="text-xs text-gray-500 mb-1">Project waarde</div>
                  <div class="text-xl sm:text-2xl font-bold text-gray-800">{{ store.projectpret }}</div>
                </div>
              </div>

              <div class="h-3 bg-blue-100 rounded-full overflow-hidden">
                <div
                  class="h-full bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full transition-all duration-1000"
                  :style="{ width: `${Math.min((pretScore / 10000) * 100, 100)}%` }"
                ></div>
              </div>
            </div>

            <!-- Prestige -->
            <div class="glass p-5 sm:p-6 rounded-2xl border border-purple-200/50 card-lift animate-on-enter stagger-3">
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-3 sm:gap-4">
                  <div class="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-purple-400 to-pink-600 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl shadow-lg">
                    &#128081;
                  </div>
                  <div>
                    <h3 class="text-lg sm:text-xl font-bold text-gray-800">Prestige</h3>
                    <p class="text-xs sm:text-sm text-gray-500">Status & erkenning</p>
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-2xl sm:text-3xl font-bold text-purple-600">
                    <AnimatedCounter :value="prestigeScore" :delay="600" />
                  </div>
                  <div class="text-xs text-gray-500">{{ prestigePercentage }}% van totaal</div>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-3 sm:gap-4 mb-4">
                <div class="bg-white/60 rounded-xl p-3 text-center">
                  <div class="text-xs text-gray-500 mb-1">Jouw waarde</div>
                  <div class="text-xl sm:text-2xl font-bold text-gray-800">{{ store.baselineprestige }}</div>
                </div>
                <div class="bg-white/60 rounded-xl p-3 text-center">
                  <div class="text-xs text-gray-500 mb-1">Project waarde</div>
                  <div class="text-xl sm:text-2xl font-bold text-gray-800">{{ store.projectprestige }}</div>
                </div>
              </div>

              <div class="h-3 bg-purple-100 rounded-full overflow-hidden">
                <div
                  class="h-full bg-gradient-to-r from-purple-400 to-pink-500 rounded-full transition-all duration-1000"
                  :style="{ width: `${Math.min((prestigeScore / 10000) * 100, 100)}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Advice Section -->
        <div class="p-6 sm:p-8 bg-gray-50 border-t animate-on-enter stagger-4">
          <h2 class="text-xl sm:text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span>&#128172;</span> Wat betekent dit?
          </h2>
          <div class="prose prose-lg max-w-none text-gray-700">
            <p v-if="isPositive" class="leading-relaxed">
              <span class="text-emerald-600 font-semibold">Geweldig nieuws!</span>
              Dit project sluit uitstekend aan bij jouw persoonlijke waarden.
              De combinatie van wat jij belangrijk vindt en wat dit project biedt,
              geeft een sterke match. Ga vol vertrouwen door met dit project!
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
          @click="startOver"
          class="btn-ripple btn-glow bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105"
        >
          <span class="flex items-center justify-center gap-2">
            &#128260; Nieuw Project
          </span>
        </button>
        <button
          @click="back"
          class="glass hover:bg-white/80 text-gray-700 font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-xl shadow-lg border border-gray-200 transform transition-all duration-200 hover:scale-105"
        >
          <span class="flex items-center justify-center gap-2">
            &#8592; Aanpassen
          </span>
        </button>
        <button
          @click="goHome"
          class="btn-ripple bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105"
        >
          <span class="flex items-center justify-center gap-2">
            &#127968; Opnieuw
          </span>
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { usePStore } from '@/stores/PStore'
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ProgressStepper from '@/components/ProgressStepper.vue'
import AnimatedCounter from '@/components/AnimatedCounter.vue'
import ConfettiCelebration from '@/components/ConfettiCelebration.vue'

const store = usePStore()
const router = useRouter()
const showConfetti = ref(false)
const animatedWidth = ref('0%')

onMounted(() => {
  // Trigger confetti after a short delay
  setTimeout(() => {
    showConfetti.value = true
  }, 500)

  // Animate progress bar width
  setTimeout(() => {
    animatedWidth.value = `${Math.min(scorePercentage.value, 100)}%`
  }, 300)
})

// Navigation
const back = () => router.push('/project')
const startOver = () => router.push('/project')
const goHome = () => router.push('/')

// Computed values
const Advice = computed(() => store.endScore > 6000 ? 'wel' : 'niet')
const isPositive = computed(() => store.endScore > 6000)

const poenScore = computed(() => store.baselinepoen * store.projectpoen)
const pretScore = computed(() => store.baselinepret * store.projectpret)
const prestigeScore = computed(() => store.baselineprestige * store.projectprestige)

const poenPercentage = computed(() =>
  store.endScore > 0 ? Math.round((poenScore.value / store.endScore) * 100) : 0
)
const pretPercentage = computed(() =>
  store.endScore > 0 ? Math.round((pretScore.value / store.endScore) * 100) : 0
)
const prestigePercentage = computed(() =>
  store.endScore > 0 ? Math.round((prestigeScore.value / store.endScore) * 100) : 0
)
const scorePercentage = computed(() =>
  Math.round((store.endScore / 30000) * 100)
)
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
