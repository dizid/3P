<template>
  <div>
    <!-- Confetti for clear answers -->
    <ConfettiCelebration :active="showConfetti && hasAnswer" :count="60" />

    <!-- Result Card -->
    <div class="glass-card overflow-hidden animate-on-enter">
      <!-- Header -->
      <div
        class="relative p-8 text-center overflow-hidden"
        :class="headerClass"
      >
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
          <div class="text-5xl mb-4 animate-bounce-subtle">
            {{ resultIcon }}
          </div>
          <h1 class="text-4xl font-extrabold mb-3">{{ adviceText }}</h1>
          <p class="text-lg opacity-90">
            For: <span class="font-bold underline">"{{ store.coinFlip.decision }}"</span>
          </p>
        </div>
      </div>

      <!-- What Happened -->
      <div class="p-8 bg-gradient-to-b from-gray-50 to-white">
        <div class="max-w-md mx-auto">
          <div class="grid grid-cols-3 gap-4 text-center mb-8">
            <div class="glass p-4 rounded-xl">
              <div class="text-sm text-gray-500 uppercase tracking-wider mb-1">Coin Said</div>
              <div class="text-2xl font-black" :class="coinResultColor">
                {{ store.coinFlip.result === 'A' ? store.coinFlip.optionA : store.coinFlip.optionB }}
              </div>
            </div>
            <div class="glass p-4 rounded-xl">
              <div class="text-sm text-gray-500 uppercase tracking-wider mb-1">You Felt</div>
              <div class="text-2xl">
                {{ reactionEmoji }}
              </div>
              <div class="text-sm font-medium text-gray-700 capitalize">{{ store.coinFlip.reaction }}</div>
            </div>
            <div class="glass p-4 rounded-xl border-2 border-pink-300">
              <div class="text-sm text-gray-500 uppercase tracking-wider mb-1">Your Heart Says</div>
              <div class="text-2xl font-black text-pink-600">
                {{ trueChoice }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Explanation -->
      <div class="p-8 border-t">
        <h2 class="text-xl font-bold text-gray-800 mb-6 text-center">What This Means</h2>

        <div class="max-w-xl mx-auto">
          <template v-if="store.coinFlip.reaction === 'relieved'">
            <div class="flex gap-4 items-start p-4 bg-green-50 rounded-xl">
              <div class="text-3xl">&#128524;</div>
              <div>
                <h3 class="font-bold text-green-700 mb-1">Relief = Alignment</h3>
                <p class="text-gray-700">
                  When you felt relieved at "{{ coinChoice }}", your body was telling you
                  this is what you actually want. The coin didn't decide - it revealed.
                </p>
              </div>
            </div>
          </template>

          <template v-else-if="store.coinFlip.reaction === 'disappointed'">
            <div class="flex gap-4 items-start p-4 bg-purple-50 rounded-xl">
              <div class="text-3xl">&#128532;</div>
              <div>
                <h3 class="font-bold text-purple-700 mb-1">Disappointment = Hidden Desire</h3>
                <p class="text-gray-700">
                  Your disappointment at "{{ coinChoice }}" revealed that you actually
                  want "{{ otherChoice }}". You were hoping the coin would give you permission.
                </p>
              </div>
            </div>
          </template>

          <template v-else>
            <div class="flex gap-4 items-start p-4 bg-amber-50 rounded-xl">
              <div class="text-3xl">&#128528;</div>
              <div>
                <h3 class="font-bold text-amber-700 mb-1">Neutral = True Indifference</h3>
                <p class="text-gray-700">
                  If you genuinely felt nothing, maybe both options are equally valid for you.
                  In that case, either choice is fine - just pick one and commit!
                </p>
              </div>
            </div>
          </template>
        </div>
      </div>

      <!-- The Psychology -->
      <div class="p-8 bg-gray-50 border-t">
        <h2 class="text-xl font-bold text-gray-800 mb-4">Why This Works</h2>
        <div class="flex gap-4 items-start">
          <div class="text-4xl">&#129504;</div>
          <p class="text-gray-700 leading-relaxed italic">
            "Your rational mind can debate endlessly, but your emotional brain knows what it wants.
            By creating a moment of 'finality' with the coin flip, we bypass analysis paralysis
            and tap directly into your true preferences. The coin is just a mirror."
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
          &#8592; Try Again
        </span>
      </button>
      <SaveToHistoryButton
        tool="coinFlip"
        :decision="store.coinFlip.decision"
        :score="null"
        :recommendation="adviceText"
        :recommendation-type="store.coinFlip.reaction === 'neutral' ? 'neutral' : 'positive'"
        :data="{ ...store.coinFlip }"
      />
      <button
        @click="$emit('reset')"
        class="bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105"
      >
        <span class="flex items-center justify-center gap-2">
          &#129689; New Decision
        </span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useToolsStore } from '@/stores/ToolsStore'
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

const hasAnswer = computed(() => store.coinFlip.reaction !== 'neutral')

const coinChoice = computed(() => {
  return store.coinFlip.result === 'A' ? store.coinFlip.optionA : store.coinFlip.optionB
})

const otherChoice = computed(() => {
  return store.coinFlip.result === 'A' ? store.coinFlip.optionB : store.coinFlip.optionA
})

const trueChoice = computed(() => {
  if (store.coinFlip.reaction === 'relieved') {
    return coinChoice.value
  } else if (store.coinFlip.reaction === 'disappointed') {
    return otherChoice.value
  }
  return 'Either!'
})

const adviceText = computed(() => {
  if (store.coinFlip.reaction === 'relieved') {
    return `Go with ${coinChoice.value}!`
  } else if (store.coinFlip.reaction === 'disappointed') {
    return `Go with ${otherChoice.value}!`
  }
  return "You're Truly Undecided"
})

const resultIcon = computed(() => {
  if (store.coinFlip.reaction === 'neutral') return '&#129300;'
  return '&#128161;'
})

const reactionEmoji = computed(() => {
  if (store.coinFlip.reaction === 'relieved') return '&#128524;'
  if (store.coinFlip.reaction === 'disappointed') return '&#128532;'
  return '&#128528;'
})

const headerClass = computed(() => {
  if (store.coinFlip.reaction === 'neutral') {
    return 'bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500'
  }
  return 'bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500'
})

const circleClass = computed(() => {
  if (store.coinFlip.reaction === 'neutral') return 'bg-amber-300'
  return 'bg-pink-300'
})

const coinResultColor = computed(() => {
  return store.coinFlip.result === 'A' ? 'text-pink-600' : 'text-purple-600'
})
</script>

<style scoped>
@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(5deg); }
}
</style>
