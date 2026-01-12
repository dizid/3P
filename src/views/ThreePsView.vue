<template>
  <div class="min-h-screen py-8 px-4">
    <div class="max-w-4xl mx-auto">
      <ToolHeader
        icon="&#128176;"
        title="De 3 P's"
        description="Evalueer projecten op basis van Poen, Pret en Prestige. Ontdek of dit project past bij jouw persoonlijke waarden."
        color="#6366f1"
        color-dark="#4f46e5"
      />

      <ThreePsForm v-if="store.threeps.currentStep < 3" @complete="handleComplete" />
      <ThreePsResult v-else @back="handleBack" @reset="handleReset" />
    </div>
  </div>
</template>

<script setup>
import { useToolsStore } from '@/stores/ToolsStore'
import ToolHeader from '@/components/shared/ToolHeader.vue'
import ThreePsForm from '@/components/threeps/ThreePsForm.vue'
import ThreePsResult from '@/components/threeps/ThreePsResult.vue'

const store = useToolsStore()

const handleComplete = () => {
  store.setThreepsStep(3)
}

const handleBack = () => {
  store.setThreepsStep(2)
}

const handleReset = () => {
  store.resetThreeps()
}
</script>
