<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4">
    <div class="max-w-md w-full">
      <!-- Loading State -->
      <div v-if="loading" class="text-center animate-on-enter">
        <div class="glass-card p-8">
          <div class="animate-spin w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full mx-auto mb-4"></div>
          <p class="text-gray-600 dark:text-gray-400">Verifying your subscription...</p>
        </div>
      </div>

      <!-- Success State -->
      <div v-else-if="success" class="text-center animate-on-enter">
        <div class="glass-card p-8">
          <!-- Confetti Animation -->
          <div class="relative mb-6">
            <div class="text-6xl animate-bounce">&#127881;</div>
            <div class="absolute top-0 left-1/4 text-2xl animate-ping delay-100">&#10024;</div>
            <div class="absolute top-2 right-1/4 text-2xl animate-ping delay-200">&#10024;</div>
          </div>

          <h1 class="text-3xl font-bold mb-4">
            <span class="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Welcome to Premium!
            </span>
          </h1>

          <p class="text-gray-600 dark:text-gray-400 mb-6">
            Your subscription is now active. You have full access to AI-powered insights, unlimited history, and all premium features.
          </p>

          <!-- Features Unlocked -->
          <div class="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-4 mb-6">
            <h3 class="font-semibold text-indigo-800 dark:text-indigo-200 mb-3">Features Unlocked:</h3>
            <ul class="text-left text-sm text-indigo-700 dark:text-indigo-300 space-y-2">
              <li class="flex items-center gap-2">
                <span class="text-green-500">&#10004;</span>
                AI-powered decision analysis
              </li>
              <li class="flex items-center gap-2">
                <span class="text-green-500">&#10004;</span>
                Unlimited decision history
              </li>
              <li class="flex items-center gap-2">
                <span class="text-green-500">&#10004;</span>
                Personal insights dashboard
              </li>
              <li class="flex items-center gap-2">
                <span class="text-green-500">&#10004;</span>
                PDF & JSON export
              </li>
            </ul>
          </div>

          <!-- CTA Buttons -->
          <div class="space-y-3">
            <RouterLink
              to="/tools"
              class="block w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
            >
              Start Making Decisions
            </RouterLink>
            <RouterLink
              to="/insights"
              class="block w-full px-6 py-3 glass text-indigo-600 dark:text-indigo-400 font-medium rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-all"
            >
              View Insights Dashboard
            </RouterLink>
          </div>

          <!-- Auto-redirect notice -->
          <p v-if="countdown > 0" class="text-sm text-gray-500 dark:text-gray-500 mt-6">
            Redirecting to tools in {{ countdown }}s...
          </p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else class="text-center animate-on-enter">
        <div class="glass-card p-8">
          <div class="text-5xl mb-4">&#9888;</div>
          <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            Something went wrong
          </h1>
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            {{ error || "We couldn't verify your subscription. Don't worry - if you were charged, your subscription is active." }}
          </p>
          <div class="space-y-3">
            <RouterLink
              to="/tools"
              class="block w-full px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all"
            >
              Go to Tools
            </RouterLink>
            <RouterLink
              to="/pricing"
              class="block w-full px-6 py-3 glass text-gray-600 dark:text-gray-400 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
            >
              Return to Pricing
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSubscriptionStore } from '@/stores/SubscriptionStore'
import { trackPurchaseComplete } from '@/utils/analytics'

const route = useRoute()
const router = useRouter()
const subscriptionStore = useSubscriptionStore()

const loading = ref(true)
const success = ref(false)
const error = ref(null)
const countdown = ref(5)

let countdownInterval = null

onMounted(async () => {
  const sessionId = route.query.session_id

  if (!sessionId) {
    // No session ID - might be a direct visit
    loading.value = false
    error.value = 'No checkout session found. Please complete the checkout process.'
    return
  }

  try {
    // Verify the session and get customer info
    const response = await fetch('/api/verify-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId })
    })

    if (response.ok) {
      const data = await response.json()

      // Store customer ID for future subscription checks
      if (data.customerId) {
        subscriptionStore.setCustomer(data.customerId, data.email)
      }

      // Refresh subscription status
      await subscriptionStore.checkSubscription()

      // Track successful purchase
      trackPurchaseComplete('premium', 5.99)

      success.value = true

      // Start countdown for auto-redirect
      countdownInterval = setInterval(() => {
        countdown.value--
        if (countdown.value <= 0) {
          clearInterval(countdownInterval)
          router.push('/tools')
        }
      }, 1000)
    } else {
      const errorData = await response.json()
      error.value = errorData.error || 'Failed to verify subscription'
    }
  } catch (err) {
    console.error('Session verification error:', err)
    error.value = 'Unable to verify your subscription. Please contact support if you were charged.'
  } finally {
    loading.value = false
  }
})

onUnmounted(() => {
  if (countdownInterval) {
    clearInterval(countdownInterval)
  }
})
</script>

<style scoped>
.delay-100 {
  animation-delay: 100ms;
}
.delay-200 {
  animation-delay: 200ms;
}
</style>
