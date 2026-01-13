<template>
  <div class="glass-card overflow-hidden">
    <!-- Header -->
    <div class="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">
            &#129504;
          </div>
          <div>
            <h3 class="text-xl font-bold">AI Advisor</h3>
            <p class="text-white/80 text-sm">Personalized insights for your decision</p>
          </div>
        </div>
        <div v-if="isPremium" class="flex items-center gap-2">
          <span class="px-3 py-1 bg-white/20 rounded-full text-xs font-semibold">
            {{ subscriptionStore.plan === 'coach' ? 'Coach' : 'Pro' }}
          </span>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="p-6">
      <!-- AI content available for all users (tiered) -->
      <div>
        <!-- Tabs -->
        <div class="flex gap-2 mb-6">
          <button
            @click="activeTab = 'summary'"
            class="px-4 py-2 rounded-lg font-medium transition-all"
            :class="activeTab === 'summary'
              ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'"
          >
            Summary
          </button>
          <button
            @click="activeTab = 'guidance'"
            class="px-4 py-2 rounded-lg font-medium transition-all"
            :class="activeTab === 'guidance'
              ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'"
          >
            Ask Questions
          </button>
        </div>

        <!-- Loading state -->
        <AiLoadingState v-if="isLoading" :message="loadingMessage" />

        <!-- Summary tab -->
        <AiSummary
          v-else-if="activeTab === 'summary' && summary"
          :summary="summary"
        />

        <!-- Guidance tab -->
        <AiGuidance
          v-else-if="activeTab === 'guidance'"
          :messages="chatMessages"
          :follow-ups="followUps"
          :is-loading="isChatLoading"
          @ask="handleFollowUpClick"
          @send="handleSendMessage"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useSubscriptionStore } from '@/stores/SubscriptionStore'
import PremiumBadge from '@/components/premium/PremiumBadge.vue'
import FeatureGate from '@/components/premium/FeatureGate.vue'
import AiLoadingState from './AiLoadingState.vue'
import AiSummary from './AiSummary.vue'
import AiGuidance from './AiGuidance.vue'
import aiService from '@/services/aiService'

const props = defineProps({
  tool: {
    type: String,
    required: true
  },
  data: {
    type: Object,
    required: true
  }
})

const subscriptionStore = useSubscriptionStore()
const isPremium = computed(() => subscriptionStore.isPremium)

const activeTab = ref('summary')
const isLoading = ref(false)
const isChatLoading = ref(false)
const loadingMessage = ref('Analyzing your decision...')
const summary = ref(null)
const chatMessages = ref([])
const followUps = ref([
  'What are the main risks?',
  'How can I validate this decision?',
  'What would you recommend?'
])

onMounted(async () => {
  // All users get AI analysis (tiered by subscription level)
  await loadSummary()
})

const loadSummary = async () => {
  isLoading.value = true
  loadingMessage.value = 'Analyzing your decision...'

  try {
    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    summary.value = await aiService.getAnalysisSummary(props.tool, props.data)
  } catch (error) {
    console.error('Failed to load AI summary:', error)
  } finally {
    isLoading.value = false
  }
}

const handleFollowUpClick = async (question) => {
  await handleSendMessage(question)
}

const handleSendMessage = async (message) => {
  chatMessages.value.push({
    role: 'user',
    content: message
  })

  isChatLoading.value = true

  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    const response = await aiService.getGuidance(props.tool, props.data, message)

    chatMessages.value.push({
      role: 'ai',
      content: response.response
    })

    if (response.followUps) {
      followUps.value = response.followUps
    }
  } catch (error) {
    chatMessages.value.push({
      role: 'ai',
      content: 'Sorry, I encountered an error. Please try again.'
    })
  } finally {
    isChatLoading.value = false
  }
}
</script>
