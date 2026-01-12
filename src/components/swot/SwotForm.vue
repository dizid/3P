<template>
  <div>
    <!-- Decision Input -->
    <div class="glass-card p-6 mb-6 animate-on-enter">
      <label class="block text-lg font-bold text-gray-800 mb-3">
        What decision or project are you analyzing?
      </label>
      <input
        v-model="store.swot.decision"
        type="text"
        placeholder="e.g., Launch new product line, Career change, Start a business..."
        class="w-full px-4 py-3.5 bg-white border-2 border-gray-300 rounded-xl text-gray-800 text-base placeholder-gray-400 shadow-sm transition-all duration-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-100 focus:outline-none hover:border-gray-400"
      />
    </div>

    <!-- 2x2 Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
      <!-- Strengths (Internal Positive) -->
      <SwotQuadrant
        title="Strengths"
        subtitle="Internal positives"
        icon="&#128170;"
        placeholder="Add a strength..."
        :items="store.swot.strengths"
        :score="store.swotStrengthsScore"
        color="#10b981"
        type="strength"
        class="animate-on-enter stagger-1"
        @add="store.addStrength()"
        @remove="store.removeStrength($event)"
        @update-text="updateStrengthText"
        @update-weight="updateStrengthWeight"
      />

      <!-- Weaknesses (Internal Negative) -->
      <SwotQuadrant
        title="Weaknesses"
        subtitle="Internal negatives"
        icon="&#128683;"
        placeholder="Add a weakness..."
        :items="store.swot.weaknesses"
        :score="store.swotWeaknessesScore"
        color="#ef4444"
        type="weakness"
        class="animate-on-enter stagger-2"
        @add="store.addWeakness()"
        @remove="store.removeWeakness($event)"
        @update-text="updateWeaknessText"
        @update-weight="updateWeaknessWeight"
      />

      <!-- Opportunities (External Positive) -->
      <SwotQuadrant
        title="Opportunities"
        subtitle="External positives"
        icon="&#127775;"
        placeholder="Add an opportunity..."
        :items="store.swot.opportunities"
        :score="store.swotOpportunitiesScore"
        color="#3b82f6"
        type="opportunity"
        class="animate-on-enter stagger-3"
        @add="store.addOpportunity()"
        @remove="store.removeOpportunity($event)"
        @update-text="updateOpportunityText"
        @update-weight="updateOpportunityWeight"
      />

      <!-- Threats (External Negative) -->
      <SwotQuadrant
        title="Threats"
        subtitle="External negatives"
        icon="&#9888;"
        placeholder="Add a threat..."
        :items="store.swot.threats"
        :score="store.swotThreatsScore"
        color="#f97316"
        type="threat"
        class="animate-on-enter stagger-4"
        @add="store.addThreat()"
        @remove="store.removeThreat($event)"
        @update-text="updateThreatText"
        @update-weight="updateThreatWeight"
      />
    </div>

    <!-- Live Score Preview -->
    <div class="glass-card p-6 mb-6 animate-on-enter stagger-5">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        <div>
          <h4 class="font-semibold text-gray-600 mb-1">Internal Score</h4>
          <p class="text-xs text-gray-500 mb-2">Strengths - Weaknesses</p>
          <div class="text-3xl font-bold" :class="internalScoreColor">
            {{ store.swotInternalScore >= 0 ? '+' : '' }}{{ store.swotInternalScore }}
          </div>
        </div>
        <div>
          <h4 class="font-semibold text-gray-600 mb-1">External Score</h4>
          <p class="text-xs text-gray-500 mb-2">Opportunities - Threats</p>
          <div class="text-3xl font-bold" :class="externalScoreColor">
            {{ store.swotExternalScore >= 0 ? '+' : '' }}{{ store.swotExternalScore }}
          </div>
        </div>
        <div>
          <h4 class="font-semibold text-gray-600 mb-1">Overall Position</h4>
          <p class="text-xs text-gray-500 mb-2">Combined score</p>
          <div class="text-3xl font-bold" :class="overallScoreColor">
            {{ store.swotOverallScore >= 0 ? '+' : '' }}{{ store.swotOverallScore }}
          </div>
        </div>
      </div>
    </div>

    <!-- Submit Button -->
    <div class="animate-on-enter stagger-6">
      <button
        @click="handleSubmit"
        :disabled="!canSubmit"
        class="w-full relative overflow-hidden bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold py-4 px-8 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] btn-ripple btn-glow disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        <span class="relative z-10 flex items-center justify-center gap-2 text-lg">
          See Strategic Summary
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </span>
      </button>
    </div>

    <!-- Tip -->
    <div class="mt-6 glass p-4 rounded-xl border-l-4 border-amber-500 animate-on-enter stagger-7">
      <p class="text-sm text-gray-700 flex items-start gap-3">
        <span class="text-lg flex-shrink-0">&#128161;</span>
        <span>
          <strong>Tip:</strong> Internal factors (S/W) are things you control.
          External factors (O/T) are environmental - market trends, competition, regulations.
        </span>
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useToolsStore } from '@/stores/ToolsStore'
import SwotQuadrant from './SwotQuadrant.vue'

const store = useToolsStore()
const emit = defineEmits(['complete'])

// Update functions
const updateStrengthText = (id, text) => {
  const item = store.swot.strengths.find(i => i.id === id)
  if (item) item.text = text
}
const updateStrengthWeight = (id, weight) => {
  const item = store.swot.strengths.find(i => i.id === id)
  if (item) item.weight = weight
}
const updateWeaknessText = (id, text) => {
  const item = store.swot.weaknesses.find(i => i.id === id)
  if (item) item.text = text
}
const updateWeaknessWeight = (id, weight) => {
  const item = store.swot.weaknesses.find(i => i.id === id)
  if (item) item.weight = weight
}
const updateOpportunityText = (id, text) => {
  const item = store.swot.opportunities.find(i => i.id === id)
  if (item) item.text = text
}
const updateOpportunityWeight = (id, weight) => {
  const item = store.swot.opportunities.find(i => i.id === id)
  if (item) item.weight = weight
}
const updateThreatText = (id, text) => {
  const item = store.swot.threats.find(i => i.id === id)
  if (item) item.text = text
}
const updateThreatWeight = (id, weight) => {
  const item = store.swot.threats.find(i => i.id === id)
  if (item) item.weight = weight
}

// Score colors
const internalScoreColor = computed(() => {
  if (store.swotInternalScore >= 5) return 'text-green-600'
  if (store.swotInternalScore >= -5) return 'text-amber-600'
  return 'text-red-600'
})

const externalScoreColor = computed(() => {
  if (store.swotExternalScore >= 5) return 'text-green-600'
  if (store.swotExternalScore >= -5) return 'text-amber-600'
  return 'text-red-600'
})

const overallScoreColor = computed(() => {
  if (store.swotOverallScore >= 5) return 'text-green-600'
  if (store.swotOverallScore >= -5) return 'text-amber-600'
  return 'text-red-600'
})

const canSubmit = computed(() => {
  const hasDecision = store.swot.decision.trim()
  const hasItems = store.swot.strengths.some(i => i.text.trim()) ||
                   store.swot.weaknesses.some(i => i.text.trim()) ||
                   store.swot.opportunities.some(i => i.text.trim()) ||
                   store.swot.threats.some(i => i.text.trim())
  return hasDecision && hasItems
})

const handleSubmit = () => {
  if (canSubmit.value) {
    emit('complete')
  }
}
</script>
