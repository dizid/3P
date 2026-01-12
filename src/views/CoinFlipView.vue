<template>
  <div class="min-h-screen py-8 px-4">
    <div class="max-w-2xl mx-auto">
      <ToolHeader
        icon="&#129689;"
        title="Coin Flip Test"
        description="When logic fails, trust your gut. Flip a coin and pay attention to how you feel about the result - your reaction reveals your true preference."
        color="#ec4899"
        color-dark="#db2777"
      />

      <CoinFlipForm v-if="!showResult" @complete="showResult = true" />
      <CoinFlipResult v-else @back="showResult = false" @reset="handleReset" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useToolsStore } from '@/stores/ToolsStore'
import ToolHeader from '@/components/shared/ToolHeader.vue'
import CoinFlipForm from '@/components/coinflip/CoinFlipForm.vue'
import CoinFlipResult from '@/components/coinflip/CoinFlipResult.vue'

const store = useToolsStore()
const showResult = ref(false)

const handleReset = () => {
  store.resetCoinFlip()
  showResult.value = false
}
</script>
