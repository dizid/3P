<template>
  <div>
    <!-- Decision Input -->
    <div class="glass-card p-6 mb-6 animate-on-enter">
      <label class="block text-lg font-bold text-gray-800 mb-3">
        What's the decision?
      </label>
      <input
        v-model="store.coinFlip.decision"
        type="text"
        placeholder="e.g., Should I ask them out? Apply for the job? Move to a new city?"
        class="w-full px-4 py-3.5 bg-white border-2 border-gray-300 rounded-xl text-gray-800 text-base placeholder-gray-400 shadow-sm transition-all duration-200 focus:border-pink-500 focus:ring-4 focus:ring-pink-100 focus:outline-none hover:border-gray-400"
      />
    </div>

    <!-- Options -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      <div class="glass p-5 rounded-2xl border-2 border-pink-300 animate-on-enter stagger-1">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 bg-gradient-to-br from-pink-400 to-rose-600 rounded-xl flex items-center justify-center text-xl text-white shadow-lg">
            &#127919;
          </div>
          <span class="font-bold text-gray-800">Option A (Heads)</span>
        </div>
        <input
          v-model="store.coinFlip.optionA"
          type="text"
          placeholder="Do it / Yes / Go for it..."
          class="w-full px-4 py-3 bg-white border-2 border-pink-200 rounded-xl text-gray-800 focus:border-pink-500 focus:outline-none"
        />
      </div>

      <div class="glass p-5 rounded-2xl border-2 border-purple-300 animate-on-enter stagger-2">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 bg-gradient-to-br from-purple-400 to-violet-600 rounded-xl flex items-center justify-center text-xl text-white shadow-lg">
            &#128260;
          </div>
          <span class="font-bold text-gray-800">Option B (Tails)</span>
        </div>
        <input
          v-model="store.coinFlip.optionB"
          type="text"
          placeholder="Don't do it / No / Wait..."
          class="w-full px-4 py-3 bg-white border-2 border-purple-200 rounded-xl text-gray-800 focus:border-purple-500 focus:outline-none"
        />
      </div>
    </div>

    <!-- Coin -->
    <div class="glass-card p-8 mb-6 animate-on-enter stagger-3">
      <div class="text-center mb-6">
        <AnimatedCoin
          :is-flipping="isFlipping"
          :result="store.coinFlip.result"
          :option-a="store.coinFlip.optionA || 'Option A'"
          :option-b="store.coinFlip.optionB || 'Option B'"
        />
      </div>

      <!-- Flip Button -->
      <button
        v-if="!store.coinFlip.result"
        @click="flipCoin"
        :disabled="!canFlip || isFlipping"
        class="w-full relative overflow-hidden bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-4 px-8 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] btn-ripple disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        <span class="relative z-10 flex items-center justify-center gap-2 text-lg">
          <span class="text-2xl">&#129689;</span>
          {{ isFlipping ? 'Flipping...' : 'Flip the Coin!' }}
        </span>
      </button>

      <!-- Result Display -->
      <div v-if="store.coinFlip.result && !isFlipping" class="text-center animate-on-enter">
        <div class="text-2xl font-bold mb-2" :class="resultColor">
          {{ store.coinFlip.result === 'A' ? store.coinFlip.optionA : store.coinFlip.optionB }}!
        </div>
        <p class="text-gray-600">The coin has spoken. But wait...</p>
      </div>
    </div>

    <!-- Reaction Question -->
    <div
      v-if="store.coinFlip.result && !isFlipping"
      class="glass-card p-6 mb-6 animate-on-enter"
    >
      <h3 class="text-xl font-bold text-gray-800 mb-2 text-center">
        How do you feel about this result?
      </h3>
      <p class="text-gray-600 text-center mb-6">
        Be honest - your gut reaction is the real answer.
      </p>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          @click="setReaction('relieved')"
          :class="[
            'p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105',
            store.coinFlip.reaction === 'relieved'
              ? 'bg-green-100 border-green-500 shadow-lg'
              : 'bg-white border-gray-200 hover:border-green-300'
          ]"
        >
          <div class="text-3xl mb-2">&#128524;</div>
          <div class="font-bold text-gray-800">Relieved</div>
          <div class="text-xs text-gray-500">This feels right!</div>
        </button>

        <button
          @click="setReaction('disappointed')"
          :class="[
            'p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105',
            store.coinFlip.reaction === 'disappointed'
              ? 'bg-red-100 border-red-500 shadow-lg'
              : 'bg-white border-gray-200 hover:border-red-300'
          ]"
        >
          <div class="text-3xl mb-2">&#128532;</div>
          <div class="font-bold text-gray-800">Disappointed</div>
          <div class="text-xs text-gray-500">I wanted the other one...</div>
        </button>

        <button
          @click="setReaction('neutral')"
          :class="[
            'p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105',
            store.coinFlip.reaction === 'neutral'
              ? 'bg-amber-100 border-amber-500 shadow-lg'
              : 'bg-white border-gray-200 hover:border-amber-300'
          ]"
        >
          <div class="text-3xl mb-2">&#128528;</div>
          <div class="font-bold text-gray-800">Neutral</div>
          <div class="text-xs text-gray-500">I genuinely don't mind</div>
        </button>
      </div>
    </div>

    <!-- Submit Button -->
    <div v-if="store.coinFlip.reaction" class="animate-on-enter">
      <button
        @click="handleSubmit"
        class="w-full relative overflow-hidden bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-4 px-8 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] btn-ripple btn-glow"
      >
        <span class="relative z-10 flex items-center justify-center gap-2 text-lg">
          See What Your Gut Says
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </span>
      </button>
    </div>

    <!-- Tip -->
    <div class="mt-6 glass p-4 rounded-xl border-l-4 border-pink-500 animate-on-enter stagger-4">
      <p class="text-sm text-gray-700 flex items-start gap-3">
        <span class="text-lg flex-shrink-0">&#128161;</span>
        <span>
          <strong>The secret:</strong> The coin flip doesn't decide for you.
          Your emotional reaction to the result reveals what you truly want.
        </span>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useToolsStore } from '@/stores/ToolsStore'
import AnimatedCoin from './AnimatedCoin.vue'

const store = useToolsStore()
const emit = defineEmits(['complete'])
const isFlipping = ref(false)

const canFlip = computed(() => {
  return store.coinFlip.decision.trim() &&
         store.coinFlip.optionA.trim() &&
         store.coinFlip.optionB.trim()
})

const resultColor = computed(() => {
  return store.coinFlip.result === 'A' ? 'text-pink-600' : 'text-purple-600'
})

const flipCoin = () => {
  if (!canFlip.value || isFlipping.value) return

  isFlipping.value = true
  store.flipCoin()

  setTimeout(() => {
    isFlipping.value = false
  }, 2000)
}

const setReaction = (reaction) => {
  store.setReaction(reaction)
}

const handleSubmit = () => {
  emit('complete')
}
</script>
