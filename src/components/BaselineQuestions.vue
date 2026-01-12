<template>
  <div class="min-h-screen py-8 px-4">
    <div class="max-w-4xl mx-auto">

      <!-- Animated Progress Stepper -->
      <ProgressStepper :current-step="1" />

      <!-- Main Card with Glass Effect -->
      <div class="glass-card overflow-hidden card-3d animate-on-enter">

        <!-- Header with Gradient and Decorative Elements -->
        <div class="relative bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 p-8 text-white overflow-hidden">
          <!-- Decorative circles -->
          <div class="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div class="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
          <div class="absolute top-1/2 right-1/4 w-20 h-20 bg-white/5 rounded-full"></div>

          <div class="relative z-10">
            <h1 class="text-3xl sm:text-4xl font-bold mb-3">Welkom bij De 3 P's</h1>
            <p class="text-base sm:text-lg opacity-90 leading-relaxed max-w-2xl">
              Dit tooltje helpt je beslissen of een project bij jou past. Begin met aan te geven
              hoe belangrijk elk van de 3 P's voor jou persoonlijk is.
            </p>
          </div>
        </div>

        <!-- Form Content -->
        <div class="p-6 sm:p-8">
          <h2 class="text-xl sm:text-2xl font-bold text-gray-800 mb-2 text-center">
            Hoe belangrijk zijn deze waarden voor jou?
          </h2>
          <p class="text-center text-gray-500 mb-8 text-sm sm:text-base">
            Schuif de sliders naar rechts voor hogere belangrijkheid
          </p>

          <FormKit type="form" @submit="handleSubmit" :actions="false">

            <!-- Poen Card -->
            <div class="mb-6 animate-on-enter stagger-1">
              <div class="glass p-5 sm:p-6 rounded-2xl border border-green-200/50 card-lift group">
                <div class="flex items-center gap-3 sm:gap-4 mb-5">
                  <div class="relative flex-shrink-0">
                    <div class="absolute inset-0 bg-green-500 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity"></div>
                    <div class="relative w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                      &#128176;
                    </div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <h3 class="text-lg sm:text-xl font-bold text-gray-800">Poen (Geld)</h3>
                    <p class="text-xs sm:text-sm text-gray-500 truncate">Financiele beloning, inkomen</p>
                  </div>
                  <div class="text-3xl sm:text-4xl font-bold text-green-600 tabular-nums min-w-[50px] sm:min-w-[60px] text-right">
                    {{ answerStore.baselinepoen }}
                  </div>
                </div>

                <AnimatedSlider
                  v-model="answerStore.baselinepoen"
                  :min="1"
                  :max="100"
                  color="#10b981"
                />
              </div>
            </div>

            <!-- Pret Card -->
            <div class="mb-6 animate-on-enter stagger-2">
              <div class="glass p-5 sm:p-6 rounded-2xl border border-blue-200/50 card-lift group">
                <div class="flex items-center gap-3 sm:gap-4 mb-5">
                  <div class="relative flex-shrink-0">
                    <div class="absolute inset-0 bg-blue-500 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity"></div>
                    <div class="relative w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                      &#127881;
                    </div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <h3 class="text-lg sm:text-xl font-bold text-gray-800">Pret (Plezier)</h3>
                    <p class="text-xs sm:text-sm text-gray-500 truncate">Plezier hebben, zingevend werk</p>
                  </div>
                  <div class="text-3xl sm:text-4xl font-bold text-blue-600 tabular-nums min-w-[50px] sm:min-w-[60px] text-right">
                    {{ answerStore.baselinepret }}
                  </div>
                </div>

                <AnimatedSlider
                  v-model="answerStore.baselinepret"
                  :min="1"
                  :max="100"
                  color="#3b82f6"
                />
              </div>
            </div>

            <!-- Prestige Card -->
            <div class="mb-6 animate-on-enter stagger-3">
              <div class="glass p-5 sm:p-6 rounded-2xl border border-purple-200/50 card-lift group">
                <div class="flex items-center gap-3 sm:gap-4 mb-5">
                  <div class="relative flex-shrink-0">
                    <div class="absolute inset-0 bg-purple-500 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity"></div>
                    <div class="relative w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-purple-400 to-pink-600 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                      &#128081;
                    </div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <h3 class="text-lg sm:text-xl font-bold text-gray-800">Prestige (Status)</h3>
                    <p class="text-xs sm:text-sm text-gray-500 truncate">Erkenning, aanzien, status</p>
                  </div>
                  <div class="text-3xl sm:text-4xl font-bold text-purple-600 tabular-nums min-w-[50px] sm:min-w-[60px] text-right">
                    {{ answerStore.baselineprestige }}
                  </div>
                </div>

                <AnimatedSlider
                  v-model="answerStore.baselineprestige"
                  :min="1"
                  :max="100"
                  color="#a855f7"
                />
              </div>
            </div>

            <!-- Project Name -->
            <div class="mb-8 animate-on-enter stagger-4">
              <div class="glass p-5 sm:p-6 rounded-2xl border border-gray-200/50 card-lift">
                <div class="flex items-center gap-3 sm:gap-4 mb-4">
                  <div class="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-gray-500 to-gray-700 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl shadow-lg flex-shrink-0">
                    &#128203;
                  </div>
                  <div>
                    <h3 class="text-lg sm:text-xl font-bold text-gray-800">Project Naam</h3>
                    <p class="text-xs sm:text-sm text-gray-500">Welk project wil je beoordelen?</p>
                  </div>
                </div>
                <FormKit
                  name="project"
                  v-model="answerStore.project"
                  type="text"
                  label=""
                  placeholder="Bijv: Nieuwe website, Cursus, Carrièreswitch..."
                  validation="required"
                  :validation-messages="{
                    required: 'Vul een projectnaam in om verder te gaan'
                  }"
                  input-class="w-full px-4 py-3.5 bg-white border-2 border-gray-300 rounded-xl text-gray-800 text-base placeholder-gray-400 shadow-sm transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none hover:border-gray-400"
                />
              </div>
            </div>

            <!-- Submit Button -->
            <div class="animate-on-enter stagger-5">
              <button
                type="submit"
                class="w-full relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 px-8 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] btn-ripple btn-glow"
              >
                <span class="relative z-10 flex items-center justify-center gap-2 text-base sm:text-lg">
                  Verder naar Project Waarden
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>
            </div>

          </FormKit>
        </div>
      </div>

      <!-- Info Box -->
      <div class="mt-6 glass p-5 sm:p-6 rounded-xl border-l-4 border-blue-500 animate-on-enter stagger-6">
        <p class="text-sm text-gray-700 flex items-start gap-3">
          <span class="text-xl flex-shrink-0">&#128161;</span>
          <span><strong>Tip:</strong> Wees eerlijk tegen jezelf. Er zijn geen goede of foute antwoorden -
          dit gaat om jouw persoonlijke waarden en prioriteiten in het leven.</span>
        </p>
      </div>

    </div>
  </div>
</template>

<script setup>
import { usePStore } from '@/stores/PStore'
import { useRouter } from 'vue-router'
import ProgressStepper from './ProgressStepper.vue'
import AnimatedSlider from './AnimatedSlider.vue'

const answerStore = usePStore()
const router = useRouter()

const handleSubmit = () => {
  router.push('project')
}
</script>
