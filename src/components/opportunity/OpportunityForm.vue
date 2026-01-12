<template>
  <div>
    <!-- Decision Input -->
    <div class="glass-card p-6 mb-6 animate-on-enter">
      <label class="block text-lg font-bold text-gray-800 mb-3">
        What decision are you weighing?
      </label>
      <input
        v-model="store.opportunityCost.decision"
        type="text"
        placeholder="e.g., Take the new job, Buy the house, Start the business..."
        class="w-full px-4 py-3.5 bg-white border-2 border-gray-300 rounded-xl text-gray-800 text-base placeholder-gray-400 shadow-sm transition-all duration-200 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 focus:outline-none hover:border-gray-400"
      />
    </div>

    <!-- Option Names -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div class="glass p-4 rounded-xl animate-on-enter stagger-1">
        <label class="block text-sm font-semibold text-gray-700 mb-2">
          Option A (Do it)
        </label>
        <input
          v-model="store.opportunityCost.optionAName"
          type="text"
          placeholder="Do it"
          class="w-full px-3 py-2 bg-white border-2 border-cyan-200 rounded-lg text-gray-800 focus:border-cyan-500 focus:outline-none"
        />
      </div>
      <div class="glass p-4 rounded-xl animate-on-enter stagger-2">
        <label class="block text-sm font-semibold text-gray-700 mb-2">
          Option B (Don't do it)
        </label>
        <input
          v-model="store.opportunityCost.optionBName"
          type="text"
          placeholder="Don't do it"
          class="w-full px-3 py-2 bg-white border-2 border-gray-200 rounded-lg text-gray-800 focus:border-gray-400 focus:outline-none"
        />
      </div>
    </div>

    <!-- Two Columns: Gains vs Sacrifices -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
      <!-- Gains Column -->
      <div class="glass p-5 rounded-2xl border-2 border-green-300 animate-on-enter stagger-3">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center text-xl text-white shadow-lg">
            &#128200;
          </div>
          <div>
            <h3 class="text-lg font-bold text-gray-800">What You Gain</h3>
            <p class="text-xs text-gray-500">If you choose "{{ store.opportunityCost.optionAName }}"</p>
          </div>
          <div class="ml-auto text-2xl font-bold text-green-600">
            +{{ store.opportunityGainsScore }}
          </div>
        </div>

        <div class="space-y-2 mb-4 min-h-[100px]">
          <div
            v-for="item in store.opportunityCost.gains"
            :key="item.id"
            class="flex items-center gap-3 p-3 bg-white/60 rounded-xl group"
          >
            <input
              :value="item.text"
              @input="item.text = $event.target.value"
              type="text"
              placeholder="Add a gain..."
              class="flex-1 px-3 py-2 bg-transparent border-0 border-b-2 border-gray-200 focus:border-green-500 focus:outline-none text-gray-800 placeholder-gray-400 transition-colors"
            />
            <div class="flex items-center gap-2 min-w-[100px]">
              <input
                type="range"
                :value="item.weight"
                @input="item.weight = Number($event.target.value)"
                min="1"
                max="10"
                class="w-16 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                style="accent-color: #10b981"
              />
              <span class="text-lg font-bold w-6 text-center text-green-600">
                {{ item.weight }}
              </span>
            </div>
            <button
              @click="store.removeGain(item.id)"
              class="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <button
          @click="store.addGain()"
          class="w-full py-2 px-4 border-2 border-dashed border-green-300 rounded-xl text-green-600 font-medium hover:bg-green-50 hover:border-green-400 transition-colors flex items-center justify-center gap-2"
        >
          <span>+</span> Add Gain
        </button>
      </div>

      <!-- Sacrifices Column -->
      <div class="glass p-5 rounded-2xl border-2 border-red-300 animate-on-enter stagger-4">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 bg-gradient-to-br from-red-400 to-rose-600 rounded-xl flex items-center justify-center text-xl text-white shadow-lg">
            &#128201;
          </div>
          <div>
            <h3 class="text-lg font-bold text-gray-800">What You Sacrifice</h3>
            <p class="text-xs text-gray-500">By not choosing "{{ store.opportunityCost.optionBName }}"</p>
          </div>
          <div class="ml-auto text-2xl font-bold text-red-600">
            -{{ store.opportunitySacrificesScore }}
          </div>
        </div>

        <div class="space-y-2 mb-4 min-h-[100px]">
          <div
            v-for="item in store.opportunityCost.sacrifices"
            :key="item.id"
            class="flex items-center gap-3 p-3 bg-white/60 rounded-xl group"
          >
            <input
              :value="item.text"
              @input="item.text = $event.target.value"
              type="text"
              placeholder="Add a sacrifice..."
              class="flex-1 px-3 py-2 bg-transparent border-0 border-b-2 border-gray-200 focus:border-red-500 focus:outline-none text-gray-800 placeholder-gray-400 transition-colors"
            />
            <div class="flex items-center gap-2 min-w-[100px]">
              <input
                type="range"
                :value="item.weight"
                @input="item.weight = Number($event.target.value)"
                min="1"
                max="10"
                class="w-16 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                style="accent-color: #ef4444"
              />
              <span class="text-lg font-bold w-6 text-center text-red-600">
                {{ item.weight }}
              </span>
            </div>
            <button
              @click="store.removeSacrifice(item.id)"
              class="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <button
          @click="store.addSacrifice()"
          class="w-full py-2 px-4 border-2 border-dashed border-red-300 rounded-xl text-red-600 font-medium hover:bg-red-50 hover:border-red-400 transition-colors flex items-center justify-center gap-2"
        >
          <span>+</span> Add Sacrifice
        </button>
      </div>
    </div>

    <!-- Live Score Preview -->
    <div class="glass-card p-6 mb-6 animate-on-enter stagger-5">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="font-bold text-gray-800">Net Value</h3>
          <p class="text-sm text-gray-500">Gains - Sacrifices</p>
        </div>
        <div class="text-4xl font-bold" :class="scoreColor">
          {{ store.opportunityNetScore >= 0 ? '+' : '' }}{{ store.opportunityNetScore }}
        </div>
      </div>
    </div>

    <!-- Submit Button -->
    <div class="animate-on-enter stagger-6">
      <button
        @click="handleSubmit"
        :disabled="!canSubmit"
        class="w-full relative overflow-hidden bg-gradient-to-r from-cyan-500 to-teal-600 text-white font-bold py-4 px-8 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] btn-ripple btn-glow disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        <span class="relative z-10 flex items-center justify-center gap-2 text-lg">
          See Trade-off Analysis
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </span>
      </button>
    </div>

    <!-- Tip -->
    <div class="mt-6 glass p-4 rounded-xl border-l-4 border-cyan-500 animate-on-enter stagger-7">
      <p class="text-sm text-gray-700 flex items-start gap-3">
        <span class="text-lg flex-shrink-0">&#128161;</span>
        <span>
          <strong>Tip:</strong> Be specific about what you sacrifice. It's not just money -
          consider time, energy, other opportunities, relationships, and peace of mind.
        </span>
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useToolsStore } from '@/stores/ToolsStore'

const store = useToolsStore()
const emit = defineEmits(['complete'])

const scoreColor = computed(() => {
  const score = store.opportunityNetScore
  if (score >= 3) return 'text-green-600'
  if (score >= -3) return 'text-amber-600'
  return 'text-red-600'
})

const canSubmit = computed(() => {
  const hasDecision = store.opportunityCost.decision.trim()
  const hasItems = store.opportunityCost.gains.some(i => i.text.trim()) ||
                   store.opportunityCost.sacrifices.some(i => i.text.trim())
  return hasDecision && hasItems
})

const handleSubmit = () => {
  if (canSubmit.value) {
    emit('complete')
  }
}
</script>
