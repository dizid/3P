<template>
  <div>
    <!-- Decision Input -->
    <div class="glass-card p-6 mb-6 animate-on-enter">
      <label class="block text-lg font-bold text-gray-800 dark:text-gray-100 mb-3">
        What decision are you evaluating?
      </label>
      <input
        v-model="store.tententen.decision"
        type="text"
        placeholder="e.g., Accept the new job offer, Move to a new city..."
        class="w-full px-4 py-3.5 bg-white dark:bg-slate-800 border-2 border-gray-300 dark:border-gray-600 rounded-xl text-gray-800 dark:text-gray-100 text-base placeholder-gray-400 dark:placeholder-gray-500 shadow-sm transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900 focus:outline-none hover:border-gray-400 dark:hover:border-gray-500"
      />

      <!-- Template Selector -->
      <div class="mt-4">
        <TemplateSelector tool="tententen" @select="applyTemplate" />
      </div>
    </div>

    <!-- Time Horizon Cards -->
    <div class="space-y-4 mb-8">
      <!-- 10 Minutes -->
      <div class="glass p-6 rounded-2xl border border-blue-200/50 card-lift animate-on-enter stagger-1">
        <div class="flex items-center gap-4 mb-5">
          <div class="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center text-3xl shadow-lg">
            &#9201;
          </div>
          <div class="flex-1">
            <h3 class="text-xl font-bold text-gray-800">10 Minutes</h3>
            <p class="text-sm text-gray-500">Immediate emotional reaction</p>
          </div>
          <div class="text-4xl font-bold text-blue-600 tabular-nums">
            {{ store.tententen.feel10min }}
          </div>
        </div>

        <div class="mb-2">
          <AnimatedSlider
            v-model="store.tententen.feel10min"
            :min="1"
            :max="100"
            color="#3b82f6"
          />
        </div>
        <div class="flex justify-between text-xs text-gray-500">
          <span>Negative</span>
          <span>Neutral</span>
          <span>Positive</span>
        </div>
      </div>

      <!-- 10 Months -->
      <div class="glass p-6 rounded-2xl border border-indigo-200/50 card-lift animate-on-enter stagger-2">
        <div class="flex items-center gap-4 mb-5">
          <div class="w-14 h-14 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-2xl flex items-center justify-center text-3xl shadow-lg">
            &#128197;
          </div>
          <div class="flex-1">
            <h3 class="text-xl font-bold text-gray-800">10 Months</h3>
            <p class="text-sm text-gray-500">Medium-term consequences</p>
          </div>
          <div class="text-4xl font-bold text-indigo-600 tabular-nums">
            {{ store.tententen.feel10months }}
          </div>
        </div>

        <div class="mb-2">
          <AnimatedSlider
            v-model="store.tententen.feel10months"
            :min="1"
            :max="100"
            color="#6366f1"
          />
        </div>
        <div class="flex justify-between text-xs text-gray-500">
          <span>Negative</span>
          <span>Neutral</span>
          <span>Positive</span>
        </div>
      </div>

      <!-- 10 Years -->
      <div class="glass p-6 rounded-2xl border border-purple-200/50 card-lift animate-on-enter stagger-3">
        <div class="flex items-center gap-4 mb-5">
          <div class="w-14 h-14 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center text-3xl shadow-lg">
            &#9203;
          </div>
          <div class="flex-1">
            <h3 class="text-xl font-bold text-gray-800">10 Years</h3>
            <p class="text-sm text-gray-500">Long-term life impact</p>
          </div>
          <div class="text-4xl font-bold text-purple-600 tabular-nums">
            {{ store.tententen.feel10years }}
          </div>
        </div>

        <div class="mb-2">
          <AnimatedSlider
            v-model="store.tententen.feel10years"
            :min="1"
            :max="100"
            color="#a855f7"
          />
        </div>
        <div class="flex justify-between text-xs text-gray-500">
          <span>Negative</span>
          <span>Neutral</span>
          <span>Positive</span>
        </div>
      </div>
    </div>

    <!-- Live Score Preview -->
    <div class="glass-card p-6 mb-6 animate-on-enter stagger-4">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="font-bold text-gray-800">Weighted Score</h3>
          <p class="text-sm text-gray-500">Long-term weighted 50%, medium 35%, short 15%</p>
        </div>
        <div class="text-4xl font-bold" :class="scoreColor">
          {{ store.tententenScore }}
        </div>
      </div>
    </div>

    <!-- Submit Button -->
    <div class="animate-on-enter stagger-5">
      <button
        @click="handleSubmit"
        :disabled="!store.tententen.decision.trim()"
        class="w-full relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 px-8 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] btn-ripple btn-glow disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
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
import TemplateSelector from '@/components/shared/TemplateSelector.vue'

const store = useToolsStore()
const emit = defineEmits(['complete'])

// Apply template data
const applyTemplate = (data) => {
  store.tententen.decision = data.decision
  if (data.tenMinutes) store.tententen.feel10min = data.tenMinutes * 10
  if (data.tenMonths) store.tententen.feel10months = data.tenMonths * 10
  if (data.tenYears) store.tententen.feel10years = data.tenYears * 10
}

const scoreColor = computed(() => {
  const score = store.tententenScore
  if (score >= 60) return 'text-green-600'
  if (score >= 40) return 'text-amber-600'
  return 'text-red-600'
})

const handleSubmit = () => {
  if (store.tententen.decision.trim()) {
    emit('complete')
  }
}
</script>
