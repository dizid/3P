<template>
  <div class="min-h-screen py-8 px-4">
    <div class="max-w-4xl mx-auto">
      <ToolHeader
        icon="&#9200;"
        title="10-10-10 Rule"
        description="Evaluate your decision through the lens of time. How will you feel about this choice in 10 minutes, 10 months, and 10 years?"
        color="#3b82f6"
        color-dark="#1d4ed8"
      />

      <TenTenTenForm v-if="!showResult" @complete="showResult = true" />
      <TenTenTenResult v-else @back="showResult = false" @reset="handleReset" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useToolsStore } from '@/stores/ToolsStore'
import ToolHeader from '@/components/shared/ToolHeader.vue'
import TenTenTenForm from '@/components/tententen/TenTenTenForm.vue'
import TenTenTenResult from '@/components/tententen/TenTenTenResult.vue'

const store = useToolsStore()
const showResult = ref(false)

const handleReset = () => {
  store.resetTententen()
  showResult.value = false
}
</script>
