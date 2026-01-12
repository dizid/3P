<template>
  <div>
    <!-- Decision Input -->
    <div class="glass-card p-6 mb-6 animate-on-enter">
      <label class="block text-lg font-bold text-gray-800 mb-3">
        What decision are you analyzing?
      </label>
      <input
        v-model="store.pmi.decision"
        type="text"
        placeholder="e.g., Accept remote work position, Launch new product..."
        class="w-full px-4 py-3.5 bg-white border-2 border-gray-300 rounded-xl text-gray-800 text-base placeholder-gray-400 shadow-sm transition-all duration-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 focus:outline-none hover:border-gray-400"
      />
    </div>

    <!-- Three Columns -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
      <!-- Plus Column -->
      <div class="glass p-5 rounded-2xl border-2 border-green-300 animate-on-enter stagger-1">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center text-xl shadow-lg">
            &#10133;
          </div>
          <div>
            <h3 class="text-lg font-bold text-gray-800">Plus</h3>
            <p class="text-xs text-gray-500">Benefits & positives</p>
          </div>
          <div class="ml-auto text-2xl font-bold text-green-600">
            +{{ store.pmiPlusScore }}
          </div>
        </div>

        <div class="space-y-2 mb-4">
          <PmiItemCard
            v-for="item in store.pmi.plusItems"
            :key="item.id"
            :item="item"
            placeholder="Add a benefit..."
            color="#10b981"
            @update:text="item.text = $event"
            @update:weight="item.weight = $event"
            @remove="store.removePlusItem(item.id)"
          />
        </div>

        <button
          @click="store.addPlusItem()"
          class="w-full py-2 px-4 border-2 border-dashed border-green-300 rounded-xl text-green-600 font-medium hover:bg-green-50 hover:border-green-400 transition-colors flex items-center justify-center gap-2"
        >
          <span>&#10133;</span> Add Plus
        </button>
      </div>

      <!-- Minus Column -->
      <div class="glass p-5 rounded-2xl border-2 border-red-300 animate-on-enter stagger-2">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 bg-gradient-to-br from-red-400 to-rose-600 rounded-xl flex items-center justify-center text-xl shadow-lg">
            &#10134;
          </div>
          <div>
            <h3 class="text-lg font-bold text-gray-800">Minus</h3>
            <p class="text-xs text-gray-500">Drawbacks & risks</p>
          </div>
          <div class="ml-auto text-2xl font-bold text-red-600">
            -{{ store.pmiMinusScore }}
          </div>
        </div>

        <div class="space-y-2 mb-4">
          <PmiItemCard
            v-for="item in store.pmi.minusItems"
            :key="item.id"
            :item="item"
            placeholder="Add a drawback..."
            color="#ef4444"
            @update:text="item.text = $event"
            @update:weight="item.weight = $event"
            @remove="store.removeMinusItem(item.id)"
          />
        </div>

        <button
          @click="store.addMinusItem()"
          class="w-full py-2 px-4 border-2 border-dashed border-red-300 rounded-xl text-red-600 font-medium hover:bg-red-50 hover:border-red-400 transition-colors flex items-center justify-center gap-2"
        >
          <span>&#10134;</span> Add Minus
        </button>
      </div>

      <!-- Interesting Column -->
      <div class="glass p-5 rounded-2xl border-2 border-blue-300 animate-on-enter stagger-3">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-xl flex items-center justify-center text-xl shadow-lg">
            &#10067;
          </div>
          <div>
            <h3 class="text-lg font-bold text-gray-800">Interesting</h3>
            <p class="text-xs text-gray-500">Neutral observations</p>
          </div>
          <div class="ml-auto text-2xl font-bold text-blue-600">
            ~{{ Math.round(store.pmiInterestingScore) }}
          </div>
        </div>

        <div class="space-y-2 mb-4">
          <PmiItemCard
            v-for="item in store.pmi.interestingItems"
            :key="item.id"
            :item="item"
            placeholder="Add an observation..."
            color="#3b82f6"
            @update:text="item.text = $event"
            @update:weight="item.weight = $event"
            @remove="store.removeInterestingItem(item.id)"
          />
        </div>

        <button
          @click="store.addInterestingItem()"
          class="w-full py-2 px-4 border-2 border-dashed border-blue-300 rounded-xl text-blue-600 font-medium hover:bg-blue-50 hover:border-blue-400 transition-colors flex items-center justify-center gap-2"
        >
          <span>&#10067;</span> Add Interesting
        </button>
      </div>
    </div>

    <!-- Live Score Preview -->
    <div class="glass-card p-6 mb-6 animate-on-enter stagger-4">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="font-bold text-gray-800">Net Score</h3>
          <p class="text-sm text-gray-500">Plus - Minus + (Interesting × 0.5)</p>
        </div>
        <div class="text-4xl font-bold" :class="scoreColor">
          {{ store.pmiNetScore >= 0 ? '+' : '' }}{{ store.pmiNetScore }}
        </div>
      </div>
    </div>

    <!-- Submit Button -->
    <div class="animate-on-enter stagger-5">
      <button
        @click="handleSubmit"
        :disabled="!canSubmit"
        class="w-full relative overflow-hidden bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold py-4 px-8 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] btn-ripple btn-glow disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        <span class="relative z-10 flex items-center justify-center gap-2 text-lg">
          See Your Analysis
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </span>
      </button>
    </div>

    <!-- Tip -->
    <div class="mt-6 glass p-4 rounded-xl border-l-4 border-emerald-500 animate-on-enter stagger-6">
      <p class="text-sm text-gray-700 flex items-start gap-3">
        <span class="text-lg flex-shrink-0">&#128161;</span>
        <span>
          <strong>Tip:</strong> The "Interesting" category is for things that are neither good nor bad
          but worth considering - uncertainties, what-ifs, and observations.
        </span>
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useToolsStore } from '@/stores/ToolsStore'
import PmiItemCard from './PmiItemCard.vue'

const store = useToolsStore()
const emit = defineEmits(['complete'])

const scoreColor = computed(() => {
  const score = store.pmiNetScore
  if (score >= 3) return 'text-green-600'
  if (score >= -3) return 'text-amber-600'
  return 'text-red-600'
})

const canSubmit = computed(() => {
  const hasDecision = store.pmi.decision.trim()
  const hasItems = store.pmi.plusItems.some(i => i.text.trim()) ||
                   store.pmi.minusItems.some(i => i.text.trim()) ||
                   store.pmi.interestingItems.some(i => i.text.trim())
  return hasDecision && hasItems
})

const handleSubmit = () => {
  if (canSubmit.value) {
    emit('complete')
  }
}
</script>
