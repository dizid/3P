<template>
  <div class="min-h-screen py-8 px-4">
    <div class="max-w-4xl mx-auto">
      <ToolHeader
        icon="&#129300;"
        title="Regret Minimization"
        description="Jeff Bezos' framework: Imagine yourself at 80 looking back on your life. Which choice will you regret less?"
        color="#8b5cf6"
        color-dark="#6d28d9"
      />

      <RegretForm v-if="!showResult" @complete="showResult = true" />
      <RegretResult v-else @back="showResult = false" @reset="handleReset" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useToolsStore } from '@/stores/ToolsStore'
import ToolHeader from '@/components/shared/ToolHeader.vue'
import RegretForm from '@/components/regret/RegretForm.vue'
import RegretResult from '@/components/regret/RegretResult.vue'

const store = useToolsStore()
const showResult = ref(false)

const handleReset = () => {
  store.resetRegret()
  showResult.value = false
}
</script>
