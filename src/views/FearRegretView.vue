<template>
  <div class="min-h-screen py-8 px-4">
    <div class="max-w-4xl mx-auto">
      <ToolHeader
        icon="&#128168;"
        title="Fear vs Regret"
        description="Every decision involves two types of fear: fear of action and fear of inaction. Which one weighs heavier on your soul?"
        color="#ef4444"
        color-dark="#dc2626"
      />

      <FearRegretForm v-if="!showResult" @complete="showResult = true" />
      <FearRegretResult v-else @back="showResult = false" @reset="handleReset" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useToolsStore } from '@/stores/ToolsStore'
import ToolHeader from '@/components/shared/ToolHeader.vue'
import FearRegretForm from '@/components/fearregret/FearRegretForm.vue'
import FearRegretResult from '@/components/fearregret/FearRegretResult.vue'

const store = useToolsStore()
const showResult = ref(false)

const handleReset = () => {
  store.resetFearRegret()
  showResult.value = false
}
</script>
