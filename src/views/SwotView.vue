<template>
  <div class="min-h-screen py-8 px-4">
    <div class="max-w-6xl mx-auto">
      <ToolHeader
        icon="&#127919;"
        title="SWOT Analysis"
        description="Strategic planning framework: Evaluate Strengths, Weaknesses, Opportunities, and Threats to understand your decision's full landscape."
        color="#f59e0b"
        color-dark="#d97706"
      />

      <SwotForm v-if="!showResult" @complete="showResult = true" />
      <SwotResult v-else @back="showResult = false" @reset="handleReset" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useToolsStore } from '@/stores/ToolsStore'
import ToolHeader from '@/components/shared/ToolHeader.vue'
import SwotForm from '@/components/swot/SwotForm.vue'
import SwotResult from '@/components/swot/SwotResult.vue'

const store = useToolsStore()
const showResult = ref(false)

const handleReset = () => {
  store.resetSwot()
  showResult.value = false
}
</script>
