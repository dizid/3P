<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-black/50 backdrop-blur-sm"
          @click="close"
        ></div>

        <!-- Modal -->
        <div class="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden">
          <!-- Close button -->
          <button
            @click="close"
            class="absolute top-4 right-4 z-10 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <!-- Steps container -->
          <div class="p-8">
            <Transition name="slide" mode="out-in">
              <OnboardingStep
                :key="currentStep"
                :icon="steps[currentStep].icon"
                :title="steps[currentStep].title"
                :description="steps[currentStep].description"
                :features="steps[currentStep].features"
              />
            </Transition>
          </div>

          <!-- Progress dots -->
          <div class="flex justify-center gap-2 pb-4">
            <button
              v-for="(step, index) in steps"
              :key="index"
              @click="currentStep = index"
              class="w-2.5 h-2.5 rounded-full transition-all duration-300"
              :class="index === currentStep
                ? 'bg-blue-500 w-8'
                : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400'"
            ></button>
          </div>

          <!-- Navigation -->
          <div class="flex items-center justify-between p-6 border-t dark:border-gray-700 bg-gray-50 dark:bg-slate-900/50">
            <label class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
              <input
                type="checkbox"
                v-model="dontShowAgain"
                class="rounded border-gray-300 dark:border-gray-600 text-blue-500 focus:ring-blue-500"
              />
              Don't show again
            </label>

            <div class="flex gap-3">
              <button
                v-if="currentStep > 0"
                @click="previousStep"
                class="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
              >
                Back
              </button>
              <button
                @click="nextStep"
                class="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
              >
                {{ currentStep === steps.length - 1 ? 'Get Started' : 'Next' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import OnboardingStep from './OnboardingStep.vue'

const emit = defineEmits(['close'])

const isOpen = ref(false)
const currentStep = ref(0)
const dontShowAgain = ref(false)

const steps = [
  {
    icon: '&#128075;',
    title: 'Welcome to De 3 P\'s!',
    description: 'Your personal decision-making toolkit. Make better choices with proven frameworks used by professionals worldwide.',
    features: []
  },
  {
    icon: '&#129520;',
    title: '7 Powerful Decision Tools',
    description: 'Each tool approaches decisions from a different angle, helping you see the full picture.',
    features: [
      '10-10-10 Rule: Consider time impact',
      'Regret Minimization: Think long-term',
      'PMI Analysis: Weigh pros and cons',
      'SWOT: Strategic assessment'
    ]
  },
  {
    icon: '&#9878;',
    title: 'Compare & Contrast',
    description: 'Run your decision through multiple frameworks and compare results to find consensus.',
    features: [
      'Side-by-side tool comparison',
      'Consensus scoring',
      'Export your analysis'
    ]
  },
  {
    icon: '&#128218;',
    title: 'Track Your Decisions',
    description: 'Save decisions to history and track outcomes over time. Learn from your past choices.',
    features: [
      'Automatic local storage',
      'Track decision outcomes',
      'View decision patterns'
    ]
  },
  {
    icon: '&#127775;',
    title: 'Ready to Decide?',
    description: 'Start with any tool or explore them all. Every great decision starts with a single step.',
    features: []
  }
]

const STORAGE_KEY = 'hasSeenOnboarding'

onMounted(() => {
  const hasSeenOnboarding = localStorage.getItem(STORAGE_KEY)
  if (!hasSeenOnboarding) {
    isOpen.value = true
  }
})

const nextStep = () => {
  if (currentStep.value < steps.length - 1) {
    currentStep.value++
  } else {
    close()
  }
}

const previousStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

const close = () => {
  if (dontShowAgain.value) {
    localStorage.setItem(STORAGE_KEY, 'true')
  }
  isOpen.value = false
  emit('close')
}

// Expose method to show onboarding again
defineExpose({
  show: () => {
    currentStep.value = 0
    isOpen.value = true
  }
})
</script>

<style scoped>
/* Modal transitions */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.95);
}

/* Slide transitions for steps */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.25s ease;
}

.slide-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.slide-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>
