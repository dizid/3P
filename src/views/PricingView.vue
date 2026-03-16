<template>
  <div class="min-h-screen py-12 px-4">
    <div class="max-w-5xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-12 animate-on-enter">
        <h1 class="text-4xl sm:text-5xl font-bold mb-4">
          <span class="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Make Better Decisions
          </span>
        </h1>
        <p class="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          All 8 tools are free forever. Pro adds AI coaching, unlimited history, and outcome tracking.
        </p>
        <p class="text-sm text-gray-500 dark:text-gray-500 mt-2">
          If this helps you make even one better decision, it pays for itself 100x.
        </p>
      </div>

      <!-- Billing Toggle -->
      <div class="flex justify-center mb-10 animate-on-enter stagger-1">
        <div class="glass p-1 rounded-xl inline-flex">
          <button
            @click="billingPeriod = 'monthly'"
            class="px-6 py-2 rounded-lg font-medium transition-all"
            :class="billingPeriod === 'monthly'
              ? 'bg-indigo-600 text-white shadow-lg'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'"
          >
            Monthly
          </button>
          <button
            @click="billingPeriod = 'yearly'"
            class="px-6 py-2 rounded-lg font-medium transition-all flex items-center gap-2"
            :class="billingPeriod === 'yearly'
              ? 'bg-indigo-600 text-white shadow-lg'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'"
          >
            Yearly
            <span class="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">Save 28%</span>
          </button>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="max-w-md mx-auto mb-8">
        <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
          <div class="flex items-center gap-3">
            <span class="text-red-500 text-xl">&#9888;</span>
            <div>
              <p class="text-red-800 dark:text-red-200 font-medium">{{ error }}</p>
              <button @click="error = null" class="text-red-600 dark:text-red-400 text-sm underline hover:no-underline mt-1">Dismiss</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Pricing Cards -->
      <div class="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">

        <!-- Free Tier -->
        <div class="glass-card p-8 rounded-2xl animate-on-enter stagger-2">
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Free</h3>
          <div class="flex items-baseline gap-1 mb-6">
            <span class="text-4xl font-bold text-gray-900 dark:text-white">&euro;0</span>
            <span class="text-gray-500 dark:text-gray-400">/forever</span>
          </div>

          <ul class="space-y-3 mb-8">
            <li v-for="feature in freeFeatures" :key="feature" class="flex items-start gap-3">
              <span class="text-green-500 mt-0.5">&#10003;</span>
              <span class="text-gray-700 dark:text-gray-300">{{ feature }}</span>
            </li>
          </ul>

          <router-link
            to="/tools"
            class="block w-full text-center px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Start Free
          </router-link>
        </div>

        <!-- Pro Tier -->
        <div class="relative glass-card p-8 rounded-2xl border-2 border-indigo-500 animate-on-enter stagger-3">
          <!-- Badge -->
          <div class="absolute -top-3 left-1/2 -translate-x-1/2">
            <span class="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-bold px-4 py-1 rounded-full">
              Recommended
            </span>
          </div>

          <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Pro</h3>
          <div class="flex items-baseline gap-1 mb-1">
            <span class="text-4xl font-bold text-gray-900 dark:text-white">
              &euro;{{ billingPeriod === 'monthly' ? '7.99' : '5.75' }}
            </span>
            <span class="text-gray-500 dark:text-gray-400">/month</span>
          </div>
          <p v-if="billingPeriod === 'yearly'" class="text-sm text-green-600 dark:text-green-400 mb-6">
            &euro;69/year &mdash; save &euro;26.88
          </p>
          <p v-else class="text-sm text-gray-500 dark:text-gray-400 mb-6">&nbsp;</p>

          <ul class="space-y-3 mb-8">
            <li v-for="feature in proFeatures" :key="feature" class="flex items-start gap-3">
              <span class="text-indigo-500 mt-0.5">&#10003;</span>
              <span class="text-gray-700 dark:text-gray-300">{{ feature }}</span>
            </li>
          </ul>

          <button
            @click="handleUpgrade"
            :disabled="isLoading"
            class="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl"
          >
            {{ isLoading ? 'Redirecting...' : 'Upgrade to Pro' }}
          </button>
        </div>
      </div>

      <!-- ChatGPT comparison -->
      <div class="glass-card p-8 rounded-2xl mb-12 animate-on-enter stagger-4">
        <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2 text-center">
          "Why not just use ChatGPT?"
        </h2>
        <p class="text-center text-gray-500 dark:text-gray-400 mb-8">ChatGPT gives you an answer. 3PS gives you a decision.</p>

        <div class="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <div>
            <h4 class="font-semibold text-gray-500 dark:text-gray-400 mb-3 text-sm uppercase tracking-wider">ChatGPT</h4>
            <ul class="space-y-2">
              <li v-for="item in chatgptComparison" :key="item" class="flex items-start gap-2 text-gray-500 dark:text-gray-400 text-sm">
                <span class="mt-0.5">&#10060;</span>
                <span>{{ item }}</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 class="font-semibold text-indigo-600 dark:text-indigo-400 mb-3 text-sm uppercase tracking-wider">3PS Pro</h4>
            <ul class="space-y-2">
              <li v-for="item in threepsComparison" :key="item" class="flex items-start gap-2 text-gray-700 dark:text-gray-300 text-sm">
                <span class="text-green-500 mt-0.5">&#10003;</span>
                <span>{{ item }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- FAQ Section -->
      <div class="glass-card p-8 rounded-2xl animate-on-enter stagger-5">
        <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">
          Frequently Asked Questions
        </h2>

        <div class="space-y-6 max-w-3xl mx-auto">
          <div v-for="faq in faqs" :key="faq.question" class="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0">
            <h3 class="font-bold text-gray-800 dark:text-gray-100 mb-2">{{ faq.question }}</h3>
            <p class="text-gray-600 dark:text-gray-400">{{ faq.answer }}</p>
          </div>
        </div>
      </div>

      <!-- Guarantee -->
      <div class="text-center mt-12 animate-on-enter">
        <div class="inline-flex items-center gap-3 glass px-6 py-4 rounded-xl">
          <span class="text-3xl">&#128170;</span>
          <div class="text-left">
            <p class="font-bold text-gray-800 dark:text-gray-100">30-Day Money-Back Guarantee</p>
            <p class="text-sm text-gray-500 dark:text-gray-400">Not satisfied? Full refund, no questions asked.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/AuthStore'
import { stripeService, stripePrices } from '@/services/stripeService'

const authStore = useAuthStore()
const billingPeriod = ref('yearly')
const isLoading = ref(false)
const error = ref(null)

const freeFeatures = [
  'All 8 decision tools',
  'Compare decisions side-by-side',
  'Save last 10 decisions',
  '1 AI analysis per month',
  'Copy-to-clipboard export',
  'Decision templates'
]

const proFeatures = [
  'Everything in Free',
  'Unlimited AI coaching (Claude Sonnet)',
  'Interactive follow-up conversations',
  'Unlimited decision history (synced)',
  'Outcome tracking & 30/90-day reminders',
  'Personal insights dashboard',
  'PDF export',
  'Shareable decision links'
]

const chatgptComparison = [
  'Blank canvas — you need to know what to ask',
  'Forgets your last decision immediately',
  'No follow-up, no accountability',
  'Output varies wildly by prompt quality',
  'Free-form text, hard to share',
  'No pattern tracking over time'
]

const threepsComparison = [
  'Structured frameworks guide you step by step',
  'Tracks your decision history over months',
  '30/90 day reminders: "How did that go?"',
  'Consistent, reproducible scoring',
  'Clean PDF export, shareable links',
  'Pattern insights: "You always override your stated values"'
]

const handleUpgrade = async () => {
  // If not logged in, they need to log in first
  if (!authStore.isAuthenticated) {
    error.value = 'Please log in first to upgrade. Click the Login button in the navigation.'
    return
  }

  isLoading.value = true
  error.value = null

  try {
    const priceId = billingPeriod.value === 'yearly'
      ? stripePrices.yearly
      : stripePrices.monthly

    const result = await stripeService.createCheckoutSession(
      priceId,
      null,
      authStore.userEmail
    )

    if (result.url) {
      window.location.href = result.url
    } else {
      error.value = result.error || 'Failed to start checkout. Please try again.'
    }
  } catch (err) {
    console.error('Checkout error:', err)
    error.value = 'Something went wrong. Please try again.'
  } finally {
    isLoading.value = false
  }
}

const faqs = [
  {
    question: 'Are the decision tools really free?',
    answer: 'Yes! All 8 decision-making tools are completely free and will always remain free. Pro adds AI coaching, unlimited history, and outcome tracking on top of the free tools.'
  },
  {
    question: 'Can I cancel anytime?',
    answer: 'Absolutely. Cancel your subscription at any time from the billing portal. Your access continues until the end of your billing period.'
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards and iDEAL for Dutch customers. Payments are securely processed by Stripe.'
  },
  {
    question: 'What happens to my data if I cancel?',
    answer: 'Your decision history is preserved on our servers. Free accounts show your last 10 decisions, but upgrading again restores full access to your complete history. Nothing is deleted.'
  },
  {
    question: 'How is this different from ChatGPT?',
    answer: 'ChatGPT is a blank canvas — you need to know what to ask. 3PS guides you through proven decision frameworks with scoring, then adds AI coaching on top. Plus, it tracks your decisions over time and sends you reminders to review outcomes. No other tool does this.'
  }
]
</script>
