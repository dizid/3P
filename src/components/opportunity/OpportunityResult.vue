<template>
  <div>
    <!-- Confetti for positive results -->
    <ConfettiCelebration :active="showConfetti && isPositive" :count="60" />

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
          <div class="text-5xl mb-4" :class="isPositive ? 'animate-bounce-subtle' : ''">
            {{ resultIcon }}
          </div>
          <h1 class="text-4xl font-extrabold mb-3">{{ store.opportunityAdvice.text }}</h1>
          <p class="text-lg opacity-90">
            For: <span class="font-bold underline">"{{ store.opportunityCost.decision }}"</span>
          </p>
        </div>
      </div>

      <!-- Score Display -->
      <div class="p-8 bg-gradient-to-b from-gray-50 to-white">
        <div class="grid grid-cols-3 gap-4 text-center mb-8">
          <div class="glass p-4 rounded-xl border-2 border-green-200">
            <div class="text-sm text-gray-500 uppercase tracking-wider mb-1">Gains</div>
            <div class="text-3xl font-black text-green-600">
              +{{ store.opportunityGainsScore }}
            </div>
          </div>
          <div class="glass p-4 rounded-xl border-2 border-red-200">
            <div class="text-sm text-gray-500 uppercase tracking-wider mb-1">Sacrifices</div>
            <div class="text-3xl font-black text-red-600">
              -{{ store.opportunitySacrificesScore }}
            </div>
          </div>
          <div class="glass p-4 rounded-xl border-2 border-cyan-300">
            <div class="text-sm text-gray-500 uppercase tracking-wider mb-1">Net Value</div>
            <div class="text-3xl font-black" :class="netClass">
              <AnimatedCounter :value="store.opportunityNetScore" :duration="1500" show-sign />
            </div>
          </div>
        </div>

        <!-- Visual Scale -->
        <div class="max-w-md mx-auto">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium text-red-600">{{ store.opportunityCost.optionBName }}</span>
            <span class="text-sm font-medium text-green-600">{{ store.opportunityCost.optionAName }}</span>
          </div>
          <div class="relative h-6 bg-gradient-to-r from-red-200 via-gray-200 to-green-200 rounded-full overflow-hidden">
            <div
              class="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-white border-4 rounded-full shadow-lg transition-all duration-1000"
              :class="needleClass"
              :style="{ left: needlePosition + '%' }"
            ></div>
          </div>
        </div>
      </div>

      <!-- Breakdown -->
      <div class="p-8 border-t">
        <h2 class="text-xl font-bold text-gray-800 mb-6 text-center">Trade-off Breakdown</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Gains List -->
          <div>
            <h3 class="font-bold text-green-700 mb-3 flex items-center gap-2">
              <span class="text-xl">&#128200;</span> What You Gain
            </h3>
            <div class="space-y-2">
              <div
                v-for="item in filledGains"
                :key="item.id"
                class="flex items-center justify-between p-3 bg-green-50 rounded-lg"
              >
                <span class="text-gray-800">{{ item.text }}</span>
                <span class="font-bold text-green-600">+{{ item.weight }}</span>
              </div>
              <div v-if="!filledGains.length" class="text-gray-400 italic p-3">
                No gains listed
              </div>
            </div>
          </div>

          <!-- Sacrifices List -->
          <div>
            <h3 class="font-bold text-red-700 mb-3 flex items-center gap-2">
              <span class="text-xl">&#128201;</span> What You Sacrifice
            </h3>
            <div class="space-y-2">
              <div
                v-for="item in filledSacrifices"
                :key="item.id"
                class="flex items-center justify-between p-3 bg-red-50 rounded-lg"
              >
                <span class="text-gray-800">{{ item.text }}</span>
                <span class="font-bold text-red-600">-{{ item.weight }}</span>
              </div>
              <div v-if="!filledSacrifices.length" class="text-gray-400 italic p-3">
                No sacrifices listed
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Insight -->
      <div class="p-8 bg-gray-50 border-t">
        <h2 class="text-xl font-bold text-gray-800 mb-4">The Bottom Line</h2>
        <div class="flex gap-4 items-start">
          <div class="text-4xl">&#9878;</div>
          <p class="text-gray-700 leading-relaxed italic">
            <template v-if="isPositive">
              "The gains outweigh the sacrifices. This trade-off appears favorable.
              You're not just getting something - you're getting more than you're giving up.
              That's the definition of a good deal."
            </template>
            <template v-else-if="isNeutral">
              "The trade-off is roughly balanced. This isn't clearly good or bad -
              it depends on what matters most to you. Consider which specific gains or sacrifices
              carry the most personal significance."
            </template>
            <template v-else>
              "The sacrifices outweigh the gains. You'd be giving up more than you receive.
              This doesn't mean don't do it - some things are worth the cost.
              But go in with eyes open about what you're trading away."
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
          &#8592; Adjust Values
        </span>
      </button>
      <SaveToHistoryButton
        tool="opportunityCost"
        :decision="store.opportunityCost.decision"
        :score="store.opportunityNetScore"
        :recommendation="store.opportunityAdvice.text"
        :recommendation-type="store.opportunityAdvice.type"
        :data="{ ...store.opportunityCost }"
      />
      <button
        @click="$emit('reset')"
        class="bg-gradient-to-r from-cyan-500 to-teal-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105"
      >
        <span class="flex items-center justify-center gap-2">
          &#9878; New Analysis
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
import SaveToHistoryButton from '@/components/shared/SaveToHistoryButton.vue'

const store = useToolsStore()
const showConfetti = ref(false)

defineEmits(['back', 'reset'])

onMounted(() => {
  setTimeout(() => {
    showConfetti.value = true
  }, 500)
})

const filledGains = computed(() => store.opportunityCost.gains.filter(i => i.text.trim()))
const filledSacrifices = computed(() => store.opportunityCost.sacrifices.filter(i => i.text.trim()))

const isPositive = computed(() => store.opportunityNetScore >= 3)
const isNeutral = computed(() => store.opportunityNetScore >= -3 && store.opportunityNetScore < 3)

const resultIcon = computed(() => {
  if (isPositive.value) return '&#128176;'
  if (isNeutral.value) return '&#9878;'
  return '&#128184;'
})

const headerClass = computed(() => {
  if (isPositive.value) return 'bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500'
  if (isNeutral.value) return 'bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500'
  return 'bg-gradient-to-r from-rose-500 via-red-500 to-pink-500'
})

const circleClass = computed(() => {
  if (isPositive.value) return 'bg-cyan-300'
  if (isNeutral.value) return 'bg-amber-300'
  return 'bg-rose-300'
})

const netClass = computed(() => {
  if (isPositive.value) return 'text-green-600'
  if (isNeutral.value) return 'text-amber-600'
  return 'text-red-600'
})

const needleClass = computed(() => {
  if (isPositive.value) return 'border-green-500'
  if (isNeutral.value) return 'border-amber-500'
  return 'border-red-500'
})

// Position needle on scale (-30 to +30 mapped to 0-100%)
const needlePosition = computed(() => {
  const score = Math.max(-30, Math.min(30, store.opportunityNetScore))
  return ((score + 30) / 60) * 100
})
</script>

<style scoped>
@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(5deg); }
}
</style>
