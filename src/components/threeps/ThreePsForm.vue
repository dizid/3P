<template>
  <div>
    <!-- Step Indicator -->
    <div class="flex items-center justify-center gap-4 mb-8">
      <div
        v-for="step in [1, 2]"
        :key="step"
        class="flex items-center gap-2"
      >
        <div
          class="w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300"
          :class="stepClass(step)"
        >
          {{ step }}
        </div>
        <span
          class="hidden sm:inline text-sm font-medium transition-colors"
          :class="store.threeps.currentStep >= step ? 'text-indigo-600' : 'text-gray-400'"
        >
          {{ step === 1 ? 'Jouw Waarden' : 'Project Waarden' }}
        </span>
        <div v-if="step < 2" class="w-8 h-0.5 bg-gray-300"></div>
      </div>
    </div>

    <!-- Step 1: Baseline Values -->
    <div v-if="store.threeps.currentStep === 1">
      <div class="glass-card overflow-hidden animate-on-enter">
        <div class="relative bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 p-8 text-white overflow-hidden">
          <div class="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div class="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>

          <div class="relative z-10">
            <h2 class="text-2xl sm:text-3xl font-bold mb-2">Stap 1: Jouw Waarden</h2>
            <p class="text-base opacity-90">
              Hoe belangrijk is elk van de 3 P's voor jou persoonlijk?
            </p>
          </div>
        </div>

        <div class="p-6 sm:p-8">
          <!-- Poen -->
          <div class="mb-6 animate-on-enter stagger-1">
            <div class="glass p-5 sm:p-6 rounded-2xl border border-green-200/50 dark:border-green-800/50 card-lift group">
              <div class="flex items-center gap-3 sm:gap-4 mb-5">
                <div class="relative flex-shrink-0">
                  <div class="absolute inset-0 bg-green-500 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity"></div>
                  <div class="relative w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    &#128176;
                  </div>
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100">Poen (Geld)</h3>
                  <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">Financiele beloning, inkomen</p>
                </div>
                <div class="text-3xl sm:text-4xl font-bold text-green-600 tabular-nums min-w-[50px] sm:min-w-[60px] text-right">
                  {{ store.threeps.baselinePoen }}
                </div>
              </div>
              <AnimatedSlider
                v-model="store.threeps.baselinePoen"
                :min="1"
                :max="100"
                color="#10b981"
              />
            </div>
          </div>

          <!-- Pret -->
          <div class="mb-6 animate-on-enter stagger-2">
            <div class="glass p-5 sm:p-6 rounded-2xl border border-blue-200/50 dark:border-blue-800/50 card-lift group">
              <div class="flex items-center gap-3 sm:gap-4 mb-5">
                <div class="relative flex-shrink-0">
                  <div class="absolute inset-0 bg-blue-500 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity"></div>
                  <div class="relative w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    &#127881;
                  </div>
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100">Pret (Plezier)</h3>
                  <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">Plezier hebben, zingevend werk</p>
                </div>
                <div class="text-3xl sm:text-4xl font-bold text-blue-600 tabular-nums min-w-[50px] sm:min-w-[60px] text-right">
                  {{ store.threeps.baselinePret }}
                </div>
              </div>
              <AnimatedSlider
                v-model="store.threeps.baselinePret"
                :min="1"
                :max="100"
                color="#3b82f6"
              />
            </div>
          </div>

          <!-- Prestige -->
          <div class="mb-6 animate-on-enter stagger-3">
            <div class="glass p-5 sm:p-6 rounded-2xl border border-purple-200/50 dark:border-purple-800/50 card-lift group">
              <div class="flex items-center gap-3 sm:gap-4 mb-5">
                <div class="relative flex-shrink-0">
                  <div class="absolute inset-0 bg-purple-500 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity"></div>
                  <div class="relative w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-purple-400 to-pink-600 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    &#128081;
                  </div>
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100">Prestige (Status)</h3>
                  <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">Erkenning, aanzien, status</p>
                </div>
                <div class="text-3xl sm:text-4xl font-bold text-purple-600 tabular-nums min-w-[50px] sm:min-w-[60px] text-right">
                  {{ store.threeps.baselinePrestige }}
                </div>
              </div>
              <AnimatedSlider
                v-model="store.threeps.baselinePrestige"
                :min="1"
                :max="100"
                color="#a855f7"
              />
            </div>
          </div>

          <!-- Project Name Input -->
          <div class="mb-8 animate-on-enter stagger-4">
            <div class="glass p-5 sm:p-6 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 card-lift">
              <div class="flex items-center gap-3 sm:gap-4 mb-4">
                <div class="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-gray-500 to-gray-700 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl shadow-lg flex-shrink-0">
                  &#128203;
                </div>
                <div>
                  <h3 class="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100">Project Naam</h3>
                  <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Welk project wil je beoordelen?</p>
                </div>
              </div>
              <input
                v-model="store.threeps.project"
                type="text"
                placeholder="Bijv: Nieuwe website, Cursus, Carrièreswitch..."
                class="w-full px-4 py-3.5 bg-white dark:bg-slate-800 border-2 border-gray-300 dark:border-gray-600 rounded-xl text-gray-800 dark:text-gray-100 text-base placeholder-gray-400 dark:placeholder-gray-500 shadow-sm transition-all duration-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900 focus:outline-none hover:border-gray-400 dark:hover:border-gray-500"
              />
            </div>
          </div>

          <!-- Next Button -->
          <div class="animate-on-enter stagger-5">
            <button
              @click="goToStep2"
              :disabled="!store.threeps.project.trim()"
              class="w-full relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 px-8 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] btn-ripple btn-glow disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <span class="relative z-10 flex items-center justify-center gap-2 text-base sm:text-lg">
                Verder naar Project Waarden
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </div>

      <!-- Tip Box -->
      <div class="mt-6 glass p-5 sm:p-6 rounded-xl border-l-4 border-blue-500 animate-on-enter stagger-6">
        <p class="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-3">
          <span class="text-xl flex-shrink-0">&#128161;</span>
          <span><strong>Tip:</strong> Wees eerlijk tegen jezelf. Er zijn geen goede of foute antwoorden -
          dit gaat om jouw persoonlijke waarden en prioriteiten in het leven.</span>
        </p>
      </div>
    </div>

    <!-- Step 2: Project Values -->
    <div v-if="store.threeps.currentStep === 2">
      <div class="glass-card overflow-hidden animate-on-enter">
        <div class="relative bg-gradient-to-r from-purple-600 via-purple-500 to-pink-600 p-8 text-white overflow-hidden">
          <div class="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div class="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>

          <div class="relative z-10">
            <h2 class="text-2xl sm:text-3xl font-bold mb-2">Project: "{{ store.threeps.project }}"</h2>
            <p class="text-base opacity-90">
              Hoeveel levert dit project op voor elk van de 3 P's?
            </p>
          </div>
        </div>

        <div class="p-6 sm:p-8">
          <!-- Poen -->
          <div class="mb-6 animate-on-enter stagger-1">
            <div class="glass p-5 sm:p-6 rounded-2xl border border-green-200/50 dark:border-green-800/50 card-lift group">
              <div class="flex items-center gap-3 sm:gap-4 mb-5">
                <div class="relative flex-shrink-0">
                  <div class="absolute inset-0 bg-green-500 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity"></div>
                  <div class="relative w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    &#128176;
                  </div>
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100">Poen (Geld)</h3>
                  <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">Hoeveel financiele opbrengst?</p>
                </div>
                <div class="text-3xl sm:text-4xl font-bold text-green-600 tabular-nums min-w-[50px] sm:min-w-[60px] text-right">
                  {{ store.threeps.projectPoen }}
                </div>
              </div>
              <AnimatedSlider
                v-model="store.threeps.projectPoen"
                :min="1"
                :max="100"
                color="#10b981"
              />
            </div>
          </div>

          <!-- Pret -->
          <div class="mb-6 animate-on-enter stagger-2">
            <div class="glass p-5 sm:p-6 rounded-2xl border border-blue-200/50 dark:border-blue-800/50 card-lift group">
              <div class="flex items-center gap-3 sm:gap-4 mb-5">
                <div class="relative flex-shrink-0">
                  <div class="absolute inset-0 bg-blue-500 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity"></div>
                  <div class="relative w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    &#127881;
                  </div>
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100">Pret (Plezier)</h3>
                  <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">Hoe leuk/zinvol zal dit zijn?</p>
                </div>
                <div class="text-3xl sm:text-4xl font-bold text-blue-600 tabular-nums min-w-[50px] sm:min-w-[60px] text-right">
                  {{ store.threeps.projectPret }}
                </div>
              </div>
              <AnimatedSlider
                v-model="store.threeps.projectPret"
                :min="1"
                :max="100"
                color="#3b82f6"
              />
            </div>
          </div>

          <!-- Prestige -->
          <div class="mb-8 animate-on-enter stagger-3">
            <div class="glass p-5 sm:p-6 rounded-2xl border border-purple-200/50 dark:border-purple-800/50 card-lift group">
              <div class="flex items-center gap-3 sm:gap-4 mb-5">
                <div class="relative flex-shrink-0">
                  <div class="absolute inset-0 bg-purple-500 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity"></div>
                  <div class="relative w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-purple-400 to-pink-600 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    &#128081;
                  </div>
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100">Prestige (Status)</h3>
                  <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">Hoeveel erkenning/aanzien?</p>
                </div>
                <div class="text-3xl sm:text-4xl font-bold text-purple-600 tabular-nums min-w-[50px] sm:min-w-[60px] text-right">
                  {{ store.threeps.projectPrestige }}
                </div>
              </div>
              <AnimatedSlider
                v-model="store.threeps.projectPrestige"
                :min="1"
                :max="100"
                color="#a855f7"
              />
            </div>
          </div>

          <!-- Live Score Preview -->
          <div class="glass-card p-6 mb-6 animate-on-enter stagger-4">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="font-bold text-gray-800 dark:text-gray-100">Live Score</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">Gecombineerde waarde-matching</p>
              </div>
              <div class="text-4xl font-bold" :class="scoreColor">
                {{ store.threepsScore.toLocaleString() }}
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row gap-4 animate-on-enter stagger-5">
            <button
              @click="goToStep1"
              class="flex-1 glass hover:bg-white/80 dark:hover:bg-slate-700/80 text-gray-700 dark:text-gray-200 font-bold py-4 px-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-600 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]"
            >
              <span class="flex items-center justify-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                </svg>
                Terug
              </span>
            </button>
            <button
              @click="$emit('complete')"
              class="flex-1 relative overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 px-8 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] btn-ripple btn-glow"
            >
              <span class="relative z-10 flex items-center justify-center gap-2 text-base sm:text-lg">
                Bekijk Resultaat
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </div>

      <!-- Tip Box -->
      <div class="mt-6 glass p-5 sm:p-6 rounded-xl border-l-4 border-purple-500 animate-on-enter stagger-6">
        <p class="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-3">
          <span class="text-xl flex-shrink-0">&#128161;</span>
          <span><strong>Tip:</strong> Probeer een realistische inschatting te maken. Vergelijk dit project
          met andere projecten die je gedaan hebt om een beter beeld te krijgen.</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useToolsStore } from '@/stores/ToolsStore'
import AnimatedSlider from '@/components/AnimatedSlider.vue'

const store = useToolsStore()
const emit = defineEmits(['complete'])

const goToStep1 = () => {
  store.setThreepsStep(1)
}

const goToStep2 = () => {
  if (store.threeps.project.trim()) {
    store.setThreepsStep(2)
  }
}

const stepClass = (step) => {
  if (store.threeps.currentStep > step) {
    return 'bg-indigo-600 text-white'
  }
  if (store.threeps.currentStep === step) {
    return 'bg-indigo-600 text-white ring-4 ring-indigo-200'
  }
  return 'bg-gray-200 text-gray-500'
}

const scoreColor = computed(() => {
  const score = store.threepsScore
  if (score >= 7500) return 'text-green-600'
  if (score >= 6000) return 'text-emerald-600'
  if (score >= 4500) return 'text-amber-600'
  return 'text-red-600'
})
</script>
