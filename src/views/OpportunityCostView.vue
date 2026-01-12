<template>
  <div class="min-h-screen py-8 px-4">
    <div class="max-w-4xl mx-auto">
      <ToolHeader
        icon="&#9878;"
        title="Opportunity Cost"
        description="Every choice has trade-offs. Compare what you gain versus what you sacrifice to see if the exchange is worth it."
        color="#06b6d4"
        color-dark="#0891b2"
      />

      <OpportunityForm v-if="!showResult" @complete="showResult = true" />
      <OpportunityResult v-else @back="showResult = false" @reset="handleReset" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useToolsStore } from '@/stores/ToolsStore'
import ToolHeader from '@/components/shared/ToolHeader.vue'
import OpportunityForm from '@/components/opportunity/OpportunityForm.vue'
import OpportunityResult from '@/components/opportunity/OpportunityResult.vue'

const store = useToolsStore()
const showResult = ref(false)

const handleReset = () => {
  store.resetOpportunityCost()
  showResult.value = false
}
</script>
