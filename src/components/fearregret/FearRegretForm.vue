<template>
  <div>
    <!-- Decision Input -->
    <div class="glass-card p-6 mb-6 animate-on-enter">
      <label class="block text-lg font-bold text-gray-800 mb-3">
        What decision are you wrestling with?
      </label>
      <input
        v-model="store.fearRegret.decision"
        type="text"
        placeholder="e.g., Quit my job, End the relationship, Start the business..."
        class="w-full px-4 py-3.5 bg-white border-2 border-gray-300 rounded-xl text-gray-800 text-base placeholder-gray-400 shadow-sm transition-all duration-200 focus:border-red-500 focus:ring-4 focus:ring-red-100 focus:outline-none hover:border-gray-400"
      />
    </div>

    <!-- Two Columns: Fears -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
      <!-- Fears of Action -->
      <div class="glass p-5 rounded-2xl border-2 border-orange-300 animate-on-enter stagger-1">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-600 rounded-xl flex items-center justify-center text-xl text-white shadow-lg">
            &#128640;
          </div>
          <div>
            <h3 class="text-lg font-bold text-gray-800">Fears of Doing It</h3>
            <p class="text-xs text-gray-500">What scares you about taking action?</p>
          </div>
          <div class="ml-auto text-2xl font-bold text-orange-600">
            {{ store.fearOfActionScore }}
          </div>
        </div>

        <div class="space-y-2 mb-4 min-h-[120px]">
          <div
            v-for="item in store.fearRegret.fearsOfAction"
            :key="item.id"
            class="flex items-center gap-3 p-3 bg-white/60 rounded-xl group"
          >
            <input
              :value="item.text"
              @input="item.text = $event.target.value"
              type="text"
              placeholder="I'm afraid that..."
              class="flex-1 px-3 py-2 bg-transparent border-0 border-b-2 border-gray-200 focus:border-orange-500 focus:outline-none text-gray-800 placeholder-gray-400 transition-colors"
            />
            <div class="flex items-center gap-2 min-w-[100px]">
              <input
                type="range"
                :value="item.weight"
                @input="item.weight = Number($event.target.value)"
                min="1"
                max="10"
                class="w-16 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                style="accent-color: #f97316"
              />
              <span class="text-lg font-bold w-6 text-center text-orange-600">
                {{ item.weight }}
              </span>
            </div>
            <button
              @click="store.removeFearOfAction(item.id)"
              class="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <button
          @click="store.addFearOfAction()"
          class="w-full py-2 px-4 border-2 border-dashed border-orange-300 rounded-xl text-orange-600 font-medium hover:bg-orange-50 hover:border-orange-400 transition-colors flex items-center justify-center gap-2"
        >
          <span>+</span> Add Fear of Action
        </button>
      </div>

      <!-- Fears of Inaction -->
      <div class="glass p-5 rounded-2xl border-2 border-blue-300 animate-on-enter stagger-2">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-xl flex items-center justify-center text-xl text-white shadow-lg">
            &#128168;
          </div>
          <div>
            <h3 class="text-lg font-bold text-gray-800">Fears of NOT Doing It</h3>
            <p class="text-xs text-gray-500">What scares you about staying put?</p>
          </div>
          <div class="ml-auto text-2xl font-bold text-blue-600">
            {{ store.fearOfInactionScore }}
          </div>
        </div>

        <div class="space-y-2 mb-4 min-h-[120px]">
          <div
            v-for="item in store.fearRegret.fearsOfInaction"
            :key="item.id"
            class="flex items-center gap-3 p-3 bg-white/60 rounded-xl group"
          >
            <input
              :value="item.text"
              @input="item.text = $event.target.value"
              type="text"
              placeholder="I'm afraid I'll regret..."
              class="flex-1 px-3 py-2 bg-transparent border-0 border-b-2 border-gray-200 focus:border-blue-500 focus:outline-none text-gray-800 placeholder-gray-400 transition-colors"
            />
            <div class="flex items-center gap-2 min-w-[100px]">
              <input
                type="range"
                :value="item.weight"
                @input="item.weight = Number($event.target.value)"
                min="1"
                max="10"
                class="w-16 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                style="accent-color: #3b82f6"
              />
              <span class="text-lg font-bold w-6 text-center text-blue-600">
                {{ item.weight }}
              </span>
            </div>
            <button
              @click="store.removeFearOfInaction(item.id)"
              class="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <button
          @click="store.addFearOfInaction()"
          class="w-full py-2 px-4 border-2 border-dashed border-blue-300 rounded-xl text-blue-600 font-medium hover:bg-blue-50 hover:border-blue-400 transition-colors flex items-center justify-center gap-2"
        >
          <span>+</span> Add Fear of Inaction
        </button>
      </div>
    </div>

    <!-- Fear Matrix Visualization -->
    <div class="glass-card p-6 mb-6 animate-on-enter stagger-3">
      <h3 class="font-bold text-gray-800 mb-4 text-center">Your Fear Landscape</h3>
      <FearMatrix
        :action-score="store.fearOfActionScore"
        :inaction-score="store.fearOfInactionScore"
      />
    </div>

    <!-- Live Score Preview -->
    <div class="glass-card p-6 mb-6 animate-on-enter stagger-4">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="font-bold text-gray-800">Fear Balance</h3>
          <p class="text-sm text-gray-500">Inaction fears - Action fears</p>
        </div>
        <div class="text-4xl font-bold" :class="scoreColor">
          {{ store.fearNetScore >= 0 ? '+' : '' }}{{ store.fearNetScore }}
        </div>
      </div>
      <p class="text-sm text-gray-600 mt-2">
        <span v-if="store.fearNetScore > 0">Positive = Fear of inaction is stronger (lean towards action)</span>
        <span v-else-if="store.fearNetScore < 0">Negative = Fear of action is stronger (lean towards caution)</span>
        <span v-else>Balanced fears</span>
      </p>
    </div>

    <!-- Submit Button -->
    <div class="animate-on-enter stagger-5">
      <button
        @click="handleSubmit"
        :disabled="!canSubmit"
        class="w-full relative overflow-hidden bg-gradient-to-r from-red-500 to-orange-600 text-white font-bold py-4 px-8 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] btn-ripple btn-glow disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        <span class="relative z-10 flex items-center justify-center gap-2 text-lg">
          See Your Fear Analysis
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </span>
      </button>
    </div>

    <!-- Tip -->
    <div class="mt-6 glass p-4 rounded-xl border-l-4 border-red-500 animate-on-enter stagger-6">
      <p class="text-sm text-gray-700 flex items-start gap-3">
        <span class="text-lg flex-shrink-0">&#128161;</span>
        <span>
          <strong>Insight:</strong> We often focus on fears of action (what could go wrong),
          but forget the fears of inaction (what we might miss). Both deserve equal attention.
        </span>
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useToolsStore } from '@/stores/ToolsStore'
import FearMatrix from './FearMatrix.vue'

const store = useToolsStore()
const emit = defineEmits(['complete'])

const scoreColor = computed(() => {
  const score = store.fearNetScore
  if (score >= 3) return 'text-green-600'
  if (score >= -3) return 'text-amber-600'
  return 'text-red-600'
})

const canSubmit = computed(() => {
  const hasDecision = store.fearRegret.decision.trim()
  const hasItems = store.fearRegret.fearsOfAction.some(i => i.text.trim()) ||
                   store.fearRegret.fearsOfInaction.some(i => i.text.trim())
  return hasDecision && hasItems
})

const handleSubmit = () => {
  if (canSubmit.value) {
    emit('complete')
  }
}
</script>
