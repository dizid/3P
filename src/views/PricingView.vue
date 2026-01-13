<template>
  <div class="min-h-screen py-12 px-4">
    <div class="max-w-5xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-12 animate-on-enter">
        <h1 class="text-4xl sm:text-5xl font-bold mb-4">
          <span class="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Simple Pricing
          </span>
        </h1>
        <p class="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Start free, upgrade when you need more. All decision tools are free forever.
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
            <span class="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">-30%</span>
          </button>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="max-w-md mx-auto mb-8 animate-on-enter">
        <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
          <div class="flex items-center gap-3">
            <span class="text-red-500 text-xl">&#9888;</span>
            <div>
              <p class="text-red-800 dark:text-red-200 font-medium">{{ error }}</p>
              <button
                @click="error = null"
                class="text-red-600 dark:text-red-400 text-sm underline hover:no-underline mt-1"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Pricing Cards -->
      <div class="grid md:grid-cols-2 gap-8 mb-12">
        <!-- Free Tier -->
        <PricingCard
          name="Free"
          :price="0"
          :features="freeTier.features"
          :limitations="freeTier.limitations"
          button-text="Current Plan"
          :disabled="true"
          class="animate-on-enter stagger-2"
        />

        <!-- Premium Tier -->
        <PricingCard
          name="Premium"
          :price="billingPeriod === 'monthly' ? 5.99 : 4.17"
          :billing-period="billingPeriod === 'monthly' ? 'month' : 'month'"
          :features="premiumTier.features"
          :featured="true"
          :badge="'Best Value'"
          :savings="billingPeriod === 'yearly' ? '30% vs monthly' : null"
          :button-text="isLoading ? 'Redirecting...' : 'Get Premium'"
          :disabled="isLoading"
          @select="handleUpgrade"
          class="animate-on-enter stagger-3"
        />
      </div>

      <!-- FAQ Section -->
      <div class="glass-card p-8 animate-on-enter stagger-4">
        <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">
          Frequently Asked Questions
        </h2>

        <div class="space-y-6 max-w-3xl mx-auto">
          <div v-for="faq in faqs" :key="faq.question" class="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0">
            <h3 class="font-bold text-gray-800 dark:text-gray-100 mb-2">
              {{ faq.question }}
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              {{ faq.answer }}
            </p>
          </div>
        </div>
      </div>

      <!-- Guarantee -->
      <div class="text-center mt-12 animate-on-enter stagger-5">
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
import PricingCard from '@/components/pricing/PricingCard.vue'
import { pricingTiers, useSubscriptionStore } from '@/stores/SubscriptionStore'
import { stripeService, stripePrices } from '@/services/stripeService'
import { trackCheckoutStarted, trackUpgradeClicked } from '@/utils/analytics'

const subscriptionStore = useSubscriptionStore()

const billingPeriod = ref('monthly')
const isLoading = ref(false)
const error = ref(null)

const freeTier = pricingTiers.free
const premiumTier = pricingTiers.premium

const handleUpgrade = async () => {
  isLoading.value = true
  error.value = null

  // Track upgrade click and checkout start
  const price = billingPeriod.value === 'yearly' ? 49.99 : 5.99
  trackUpgradeClicked('pricing_page', 'premium')
  trackCheckoutStarted(billingPeriod.value, price)

  try {
    // Get the correct price ID based on billing period
    const priceId = billingPeriod.value === 'yearly'
      ? stripePrices.yearly
      : stripePrices.monthly

    // Get cached customer info if available
    const cached = subscriptionStore.getCachedCustomer()

    // Create checkout session
    const result = await stripeService.createCheckoutSession(
      priceId,
      cached.customerId,
      cached.email
    )

    if (result.url) {
      // Redirect to Stripe checkout
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
    answer: 'Yes! All 8 decision-making tools are completely free and will always remain free. Premium adds AI advice, unlimited history, and insights on top of the free tools.'
  },
  {
    question: 'Can I cancel anytime?',
    answer: 'Absolutely. You can cancel your subscription at any time. Your access continues until the end of your billing period, and you keep all your saved data.'
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, Mastercard, American Express) and iDEAL for Dutch customers. Payments are securely processed by Stripe.'
  },
  {
    question: 'What happens to my data if I downgrade?',
    answer: 'Your decision history is preserved. Free accounts show your last 10 decisions, but upgrading again restores full access to your complete history.'
  },
  {
    question: 'Is my data private?',
    answer: 'Your decisions are stored securely and never shared with third parties. Premium AI features use anonymized data for analysis but never expose your personal details.'
  }
]
</script>
