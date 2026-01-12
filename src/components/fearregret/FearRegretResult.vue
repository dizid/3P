<template>
  <div>
    <!-- Confetti for decisive results -->
    <ConfettiCelebration :active="showConfetti && isDecisive" :count="60" />

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
          <div class="text-5xl mb-4" :class="isDecisive ? 'animate-bounce-subtle' : ''">
            {{ resultIcon }}
          </div>
          <h1 class="text-4xl font-extrabold mb-3">{{ store.fearAdvice.text }}</h1>
          <p class="text-lg opacity-90">
            For: <span class="font-bold underline">"{{ store.fearRegret.decision }}"</span>
          </p>
        </div>
      </div>

      <!-- Score Display -->
      <div class="p-8 bg-gradient-to-b from-gray-50 to-white">
        <div class="grid grid-cols-3 gap-4 text-center mb-8">
          <div class="glass p-4 rounded-xl border-2 border-orange-200">
            <div class="text-sm text-gray-500 uppercase tracking-wider mb-1">Action Fears</div>
            <div class="text-3xl font-black text-orange-600">
              {{ store.fearOfActionScore }}
            </div>
          </div>
          <div class="glass p-4 rounded-xl border-2 border-blue-200">
            <div class="text-sm text-gray-500 uppercase tracking-wider mb-1">Inaction Fears</div>
            <div class="text-3xl font-black text-blue-600">
              {{ store.fearOfInactionScore }}
            </div>
          </div>
          <div class="glass p-4 rounded-xl border-2 border-red-300">
            <div class="text-sm text-gray-500 uppercase tracking-wider mb-1">Balance</div>
            <div class="text-3xl font-black" :class="balanceClass">
              <AnimatedCounter :value="store.fearNetScore" :duration="1500" show-sign />
            </div>
          </div>
        </div>

        <!-- Fear Matrix -->
        <div class="max-w-sm mx-auto">
          <FearMatrix
            :action-score="store.fearOfActionScore"
            :inaction-score="store.fearOfInactionScore"
          />
        </div>
      </div>

      <!-- Fear Breakdown -->
      <div class="p-8 border-t">
        <h2 class="text-xl font-bold text-gray-800 mb-6 text-center">Your Fear Inventory</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Fears of Action -->
          <div>
            <h3 class="font-bold text-orange-700 mb-3 flex items-center gap-2">
              <span class="text-xl">&#128640;</span> Fears of Action
            </h3>
            <div class="space-y-2">
              <div
                v-for="item in filledActionFears"
                :key="item.id"
                class="flex items-center justify-between p-3 bg-orange-50 rounded-lg"
              >
                <span class="text-gray-800">{{ item.text }}</span>
                <span class="font-bold text-orange-600">{{ item.weight }}</span>
              </div>
              <div v-if="!filledActionFears.length" class="text-gray-400 italic p-3">
                No fears of action listed
              </div>
            </div>
          </div>

          <!-- Fears of Inaction -->
          <div>
            <h3 class="font-bold text-blue-700 mb-3 flex items-center gap-2">
              <span class="text-xl">&#128168;</span> Fears of Inaction
            </h3>
            <div class="space-y-2">
              <div
                v-for="item in filledInactionFears"
                :key="item.id"
                class="flex items-center justify-between p-3 bg-blue-50 rounded-lg"
              >
                <span class="text-gray-800">{{ item.text }}</span>
                <span class="font-bold text-blue-600">{{ item.weight }}</span>
              </div>
              <div v-if="!filledInactionFears.length" class="text-gray-400 italic p-3">
                No fears of inaction listed
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Interpretation -->
      <div class="p-8 bg-gray-50 border-t">
        <h2 class="text-xl font-bold text-gray-800 mb-4">What This Means</h2>
        <div class="flex gap-4 items-start">
          <div class="text-4xl">&#128168;</div>
          <p class="text-gray-700 leading-relaxed italic">
            <template v-if="store.fearNetScore >= 10">
              "Your fear of regret significantly outweighs your fear of failure.
              This is often the sign that you should act - the pain of 'what if' will haunt you
              more than any potential setback. Your future self is asking you to be brave."
            </template>
            <template v-else-if="store.fearNetScore >= 3">
              "You're leaning towards action, and that instinct is worth honoring.
              While you have concerns, your deeper fear of missing out suggests this opportunity
              matters to you. Consider how to minimize risks while still moving forward."
            </template>
            <template v-else-if="store.fearNetScore >= -3">
              "Your fears are remarkably balanced - a rare state of true ambivalence.
              Neither path feels safer. In such cases, consider: which decision helps you grow?
              Which aligns with the person you want to become?"
            </template>
            <template v-else-if="store.fearNetScore >= -10">
              "Your fears of action currently outweigh fears of inaction.
              This might be wisdom speaking - or it might be comfort zone protection.
              Ask yourself: in 10 years, which fear would I rather have faced?"
            </template>
            <template v-else>
              "Your fear of action is quite strong. This could be valid protective instincts,
              or it could be fear talking. Consider: are these fears based on realistic outcomes,
              or worst-case scenarios? Sometimes our biggest fears are paper tigers."
            </template>
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
          &#8592; Adjust Fears
        </span>
      </button>
      <SaveToHistoryButton
        tool="fearRegret"
        :decision="store.fearRegret.decision"
        :score="store.fearNetScore"
        :recommendation="store.fearAdvice.text"
        :recommendation-type="store.fearAdvice.type"
        :data="{ ...store.fearRegret }"
      />
      <button
        @click="$emit('reset')"
        class="bg-gradient-to-r from-red-500 to-orange-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105"
      >
        <span class="flex items-center justify-center gap-2">
          &#128168; New Decision
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
import FearMatrix from './FearMatrix.vue'
import SaveToHistoryButton from '@/components/shared/SaveToHistoryButton.vue'

const store = useToolsStore()
const showConfetti = ref(false)

defineEmits(['back', 'reset'])

onMounted(() => {
  setTimeout(() => {
    showConfetti.value = true
  }, 500)
})

const filledActionFears = computed(() => store.fearRegret.fearsOfAction.filter(i => i.text.trim()))
const filledInactionFears = computed(() => store.fearRegret.fearsOfInaction.filter(i => i.text.trim()))

const isDecisive = computed(() => Math.abs(store.fearNetScore) >= 10)
const isPositive = computed(() => store.fearNetScore >= 3)
const isNeutral = computed(() => store.fearNetScore >= -3 && store.fearNetScore < 3)

const resultIcon = computed(() => {
  if (store.fearNetScore >= 10) return '&#128640;'
  if (store.fearNetScore >= 3) return '&#127775;'
  if (store.fearNetScore >= -3) return '&#9878;'
  if (store.fearNetScore >= -10) return '&#128260;'
  return '&#128528;'
})

const headerClass = computed(() => {
  if (isPositive.value) return 'bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500'
  if (isNeutral.value) return 'bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500'
  return 'bg-gradient-to-r from-rose-500 via-red-500 to-orange-500'
})

const circleClass = computed(() => {
  if (isPositive.value) return 'bg-emerald-300'
  if (isNeutral.value) return 'bg-amber-300'
  return 'bg-rose-300'
})

const balanceClass = computed(() => {
  if (isPositive.value) return 'text-green-600'
  if (isNeutral.value) return 'text-amber-600'
  return 'text-red-600'
})
</script>

<style scoped>
@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(5deg); }
}
</style>
