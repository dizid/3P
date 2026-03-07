import { defineStore } from 'pinia'
import { useAuthStore } from '@/stores/AuthStore'

export const useSubscriptionStore = defineStore({
  id: 'SubscriptionStore',

  state: () => ({
    // Subscription state is derived from AuthStore user data
    loading: false,
    error: null
  }),

  getters: {
    // Plan comes from AuthStore (set by auth session check)
    plan() {
      const authStore = useAuthStore()
      return authStore.user?.plan || 'free'
    },

    isPro() {
      return this.plan === 'pro'
    },

    // Legacy getter — kept for components using isPremium
    isPremium() {
      return this.isPro
    },

    canUseFeature() {
      return (feature) => {
        // Free features — always available
        const freeFeatures = ['tools', 'compare', 'basicHistory', 'templates']
        if (freeFeatures.includes(feature)) return true

        // Pro features
        if (this.isPro) return true

        return false
      }
    },

    historyLimit() {
      return this.isPro ? Infinity : 10
    },

    features() {
      const pro = this.isPro
      return {
        aiAdvice: pro,
        unlimitedHistory: pro,
        insights: pro,
        export: pro,
        aiCoaching: pro,
        outcomeReminders: pro,
        shareableLinks: pro
      }
    }
  },

  actions: {
    // No-op — subscription is checked via AuthStore.checkSession()
    async checkSubscription() {
      // Subscription plan is returned as part of auth session
    },

    clearSubscription() {
      // Handled by AuthStore.logout()
    }
  }
})

// Pricing tiers for the pricing page
export const pricingTiers = {
  free: {
    name: 'Free',
    price: 0,
    features: [
      'All 8 decision tools',
      'Compare decisions side-by-side',
      'Save last 10 decisions',
      '1 AI analysis per month',
      'Copy to clipboard export',
      'Decision templates'
    ],
    limitations: [
      'Basic AI (1/month)',
      'Limited history (10)',
      'No insights dashboard',
      'No PDF export'
    ]
  },
  pro: {
    name: 'Pro',
    monthlyPrice: 7.99,
    yearlyPrice: 69,
    yearlySaving: '28%',
    features: [
      'Everything in Free',
      'Unlimited AI coaching (Claude Sonnet)',
      'AI follow-up conversations',
      'Unlimited decision history',
      'Outcome tracking & reminders',
      'Personal insights dashboard',
      'PDF export',
      'Shareable decision links'
    ],
    badge: 'Recommended'
  }
}
