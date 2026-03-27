<template>
  <div class="min-h-screen py-8 px-4">
    <div class="max-w-5xl mx-auto">
      <ToolHeader
        icon="&#9878;"
        title="PMI Analysis"
        description="Edward de Bono's Plus, Minus, Interesting method. Systematically explore all angles of your decision."
        color="#10b981"
        color-dark="#059669"
      />

      <GutCheck v-if="!showResult" v-model="gutFeeling" />
      <PmiForm v-if="!showResult" @complete="showResult = true" />
      <PmiResult v-else @back="showResult = false" @reset="handleReset" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useToolsStore } from '@/stores/ToolsStore'
import ToolHeader from '@/components/shared/ToolHeader.vue'
import GutCheck from '@/components/shared/GutCheck.vue'
import PmiForm from '@/components/pmi/PmiForm.vue'
import PmiResult from '@/components/pmi/PmiResult.vue'

const store = useToolsStore()
const showResult = ref(false)
const gutFeeling = ref('')

const handleReset = () => {
  store.resetPmi()
  showResult.value = false
}
</script>
