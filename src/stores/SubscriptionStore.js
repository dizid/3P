import { defineStore } from 'pinia'

export const useSubscriptionStore = defineStore({
  id: 'SubscriptionStore',

  state: () => ({
    tier: 'free', // 'free' | 'premium'
    status: null, // 'active' | 'canceled' | 'past_due' | null
    currentPeriodEnd: null,
    features: {
      aiAdvice: false,
      unlimitedHistory: false,
      insights: false,
      export: false
    }
  }),

  getters: {
    isPremium: (state) => state.tier === 'premium' && state.status === 'active',

    canUseFeature: (state) => (feature) => {
      // Free tier features
      const freeFeatures = ['tools', 'compare', 'basicHistory']
      if (freeFeatures.includes(feature)) return true

      // Premium features
      return state.features[feature] === true
    },

    historyLimit: (state) => {
      return state.tier === 'premium' ? Infinity : 10
    },

    daysRemaining: (state) => {
      if (!state.currentPeriodEnd) return null
      const now = new Date()
      const end = new Date(state.currentPeriodEnd)
      const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24))
      return Math.max(0, diff)
    }
  },

  actions: {
    async checkSubscription() {
      // Placeholder: In production, this would call your backend
      // which verifies with Stripe
      const savedSub = localStorage.getItem('subscription')
      if (savedSub) {
        try {
          const sub = JSON.parse(savedSub)
          this.tier = sub.tier
          this.status = sub.status
          this.currentPeriodEnd = sub.currentPeriodEnd
          this.updateFeatures()
        } catch {
          this.resetToFree()
        }
      }
    },

    updateFeatures() {
      if (this.tier === 'premium' && this.status === 'active') {
        this.features = {
          aiAdvice: true,
          unlimitedHistory: true,
          insights: true,
          export: true
        }
      } else {
        this.features = {
          aiAdvice: false,
          unlimitedHistory: false,
          insights: false,
          export: false
        }
      }
    },

    // Demo: Upgrade to premium (for testing)
    async upgradeToPremium() {
      this.tier = 'premium'
      this.status = 'active'
      this.currentPeriodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      this.updateFeatures()
      this.persistSubscription()
    },

    resetToFree() {
      this.tier = 'free'
      this.status = null
      this.currentPeriodEnd = null
      this.updateFeatures()
      localStorage.removeItem('subscription')
    },

    persistSubscription() {
      localStorage.setItem('subscription', JSON.stringify({
        tier: this.tier,
        status: this.status,
        currentPeriodEnd: this.currentPeriodEnd
      }))
    }
  }
})

// Pricing tiers
export const pricingTiers = {
  free: {
    name: 'Free',
    price: 0,
    features: [
      'All 8 decision tools',
      'Compare decisions side-by-side',
      'Save last 10 decisions',
      'Basic export (copy to clipboard)'
    ],
    limitations: [
      'No AI advice',
      'Limited history (10)',
      'No insights dashboard',
      'No PDF/JSON export'
    ]
  },
  premium: {
    name: 'Premium',
    monthlyPrice: 5.99,
    yearlyPrice: 49.99,
    features: [
      'All Free features',
      'AI-powered advice & insights',
      'Unlimited decision history',
      'Personal insights dashboard',
      'PDF & JSON export',
      'Priority support'
    ],
    badge: 'Best Value'
  }
}
