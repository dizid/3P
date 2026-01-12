<template>
  <div>
    <!-- Decision Input -->
    <div class="glass-card p-6 mb-6 animate-on-enter">
      <label class="block text-lg font-bold text-gray-800 mb-3">
        What life decision are you considering?
      </label>
      <input
        v-model="store.regret.decision"
        type="text"
        placeholder="e.g., Start my own business, Pursue a creative passion..."
        class="w-full px-4 py-3.5 bg-white border-2 border-gray-300 rounded-xl text-gray-800 text-base placeholder-gray-400 shadow-sm transition-all duration-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 focus:outline-none hover:border-gray-400"
      />
    </div>

    <!-- Future Self Visualization -->
    <div class="glass p-6 rounded-2xl mb-6 text-center animate-on-enter stagger-1">
      <div class="text-6xl mb-3">&#129491;</div>
      <p class="text-gray-600 italic">
        "Imagine yourself at 80, looking back on your life..."
      </p>
    </div>

    <!-- Question Cards -->
    <div class="space-y-4 mb-8">
      <!-- Question 1: Regret of Inaction -->
      <div class="glass p-6 rounded-2xl border border-purple-200/50 card-lift animate-on-enter stagger-2">
        <div class="flex items-start gap-4 mb-5">
          <div class="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center text-2xl shadow-lg flex-shrink-0">
            &#128557;
          </div>
          <div class="flex-1">
            <h3 class="text-lg font-bold text-gray-800 mb-1">Regret of NOT Trying</h3>
            <p class="text-sm text-gray-500">How much would you regret never attempting this?</p>
          </div>
          <div class="text-3xl font-bold text-purple-600 tabular-nums">
            {{ store.regret.regretNotTrying }}
          </div>
        </div>

        <div class="mb-2">
          <AnimatedSlider
            v-model="store.regret.regretNotTrying"
            :min="1"
            :max="100"
            color="#a855f7"
          />
        </div>
        <div class="flex justify-between text-xs text-gray-500">
          <span>No regret</span>
          <span>Devastating regret</span>
        </div>
      </div>

      <!-- Question 2: Reversibility -->
      <div class="glass p-6 rounded-2xl border border-indigo-200/50 card-lift animate-on-enter stagger-3">
        <div class="flex items-start gap-4 mb-5">
          <div class="w-12 h-12 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-2xl flex items-center justify-center text-2xl shadow-lg flex-shrink-0">
            &#128260;
          </div>
          <div class="flex-1">
            <h3 class="text-lg font-bold text-gray-800 mb-1">Reversibility</h3>
            <p class="text-sm text-gray-500">How easy would it be to course-correct if needed?</p>
          </div>
          <div class="text-3xl font-bold text-indigo-600 tabular-nums">
            {{ store.regret.reversibility }}
          </div>
        </div>

        <div class="mb-2">
          <AnimatedSlider
            v-model="store.regret.reversibility"
            :min="1"
            :max="100"
            color="#6366f1"
          />
        </div>
        <div class="flex justify-between text-xs text-gray-500">
          <span>Irreversible</span>
          <span>Fully reversible</span>
        </div>
      </div>

      <!-- Question 3: Value Alignment -->
      <div class="glass p-6 rounded-2xl border border-violet-200/50 card-lift animate-on-enter stagger-4">
        <div class="flex items-start gap-4 mb-5">
          <div class="w-12 h-12 bg-gradient-to-br from-violet-400 to-violet-600 rounded-2xl flex items-center justify-center text-2xl shadow-lg flex-shrink-0">
            &#128142;
          </div>
          <div class="flex-1">
            <h3 class="text-lg font-bold text-gray-800 mb-1">Value Alignment</h3>
            <p class="text-sm text-gray-500">How aligned is this with your core values?</p>
          </div>
          <div class="text-3xl font-bold text-violet-600 tabular-nums">
            {{ store.regret.valueAlignment }}
          </div>
        </div>

        <div class="mb-2">
          <AnimatedSlider
            v-model="store.regret.valueAlignment"
            :min="1"
            :max="100"
            color="#8b5cf6"
          />
        </div>
        <div class="flex justify-between text-xs text-gray-500">
          <span>Not aligned</span>
          <span>Perfectly aligned</span>
        </div>
      </div>

      <!-- Question 4: 80-Year-Old Perspective -->
      <div class="glass p-6 rounded-2xl border border-fuchsia-200/50 card-lift animate-on-enter stagger-5">
        <div class="flex items-start gap-4 mb-5">
          <div class="w-12 h-12 bg-gradient-to-br from-fuchsia-400 to-fuchsia-600 rounded-2xl flex items-center justify-center text-2xl shadow-lg flex-shrink-0">
            &#129491;
          </div>
          <div class="flex-1">
            <h3 class="text-lg font-bold text-gray-800 mb-1">At 80, Looking Back</h3>
            <p class="text-sm text-gray-500">How important will this decision feel?</p>
          </div>
          <div class="text-3xl font-bold text-fuchsia-600 tabular-nums">
            {{ store.regret.age80Perspective }}
          </div>
        </div>

        <div class="mb-2">
          <AnimatedSlider
            v-model="store.regret.age80Perspective"
            :min="1"
            :max="100"
            color="#d946ef"
          />
        </div>
        <div class="flex justify-between text-xs text-gray-500">
          <span>Trivial</span>
          <span>Life-defining</span>
        </div>
      </div>
    </div>

    <!-- Live Score Preview -->
    <div class="glass-card p-6 mb-6 animate-on-enter stagger-6">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="font-bold text-gray-800">Confidence Score</h3>
          <p class="text-sm text-gray-500">Higher = stronger case to take action</p>
        </div>
        <div class="text-4xl font-bold" :class="scoreColor">
          {{ store.regretScore }}
        </div>
      </div>
    </div>

    <!-- Submit Button -->
    <div class="animate-on-enter stagger-6">
      <button
        @click="handleSubmit"
        :disabled="!store.regret.decision.trim()"
        class="w-full relative overflow-hidden bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-bold py-4 px-8 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] btn-ripple btn-glow disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        <span class="relative z-10 flex items-center justify-center gap-2 text-lg">
          See Your Result
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useToolsStore } from '@/stores/ToolsStore'
import AnimatedSlider from '@/components/AnimatedSlider.vue'

const store = useToolsStore()
const emit = defineEmits(['complete'])

const scoreColor = computed(() => {
  const score = store.regretScore
  if (score >= 65) return 'text-green-600'
  if (score >= 45) return 'text-amber-600'
  return 'text-red-600'
})

const handleSubmit = () => {
  if (store.regret.decision.trim()) {
    emit('complete')
  }
}
</script>
