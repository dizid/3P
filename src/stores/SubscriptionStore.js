import { defineStore } from 'pinia'
import { stripeService } from '@/services/stripeService'

export const useSubscriptionStore = defineStore({
  id: 'SubscriptionStore',

  state: () => ({
    tier: 'free', // 'free' | 'premium'
    status: null, // 'active' | 'trialing' | 'canceled' | 'past_due' | null
    customerId: null, // Stripe customer ID
    subscriptionId: null, // Stripe subscription ID
    currentPeriodEnd: null,
    features: {
      aiAdvice: false,
      unlimitedHistory: false,
      insights: false,
      export: false
    },
    loading: false,
    error: null
  }),

  getters: {
    isPremium: (state) => {
      return state.tier === 'premium' &&
        (state.status === 'active' || state.status === 'trialing')
    },

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
    },

    isTrialing: (state) => state.status === 'trialing'
  },

  actions: {
    /**
     * Check subscription status from Stripe via API
     * Uses cached customer email/ID if available
     */
    async checkSubscription() {
      this.loading = true
      this.error = null

      try {
        // Try to get cached customer info
        const cached = this.getCachedCustomer()

        if (!cached.customerId && !cached.email) {
          // No customer info, stay on free tier
          this.resetToFree()
          return
        }

        // Call the real Stripe API
        const result = await stripeService.getSubscriptionStatus(
          cached.customerId,
          cached.email
        )

        // Update state from API response
        this.tier = result.tier || 'free'
        this.status = result.status || null
        this.customerId = result.customerId || cached.customerId
        this.subscriptionId = result.subscriptionId || null
        this.currentPeriodEnd = result.currentPeriodEnd || null
        this.features = result.features || this.getDefaultFeatures()

        // Cache the customer info for faster subsequent checks
        this.cacheCustomer()
      } catch (error) {
        console.error('Subscription check failed:', error)
        this.error = 'Failed to verify subscription'
        // Fallback to cached data if API fails
        this.loadFromCache()
      } finally {
        this.loading = false
      }
    },

    /**
     * Get cached customer info from localStorage
     */
    getCachedCustomer() {
      try {
        const cached = localStorage.getItem('subscription_customer')
        if (cached) {
          return JSON.parse(cached)
        }
      } catch {
        // Ignore parse errors
      }
      return { customerId: null, email: null }
    },

    /**
     * Cache customer info for faster checks
     */
    cacheCustomer() {
      if (this.customerId) {
        localStorage.setItem('subscription_customer', JSON.stringify({
          customerId: this.customerId,
          tier: this.tier,
          status: this.status,
          currentPeriodEnd: this.currentPeriodEnd
        }))
      }
    },

    /**
     * Load subscription from cache (fallback when API unavailable)
     */
    loadFromCache() {
      try {
        const cached = localStorage.getItem('subscription_customer')
        if (cached) {
          const data = JSON.parse(cached)
          this.tier = data.tier || 'free'
          this.status = data.status || null
          this.customerId = data.customerId || null
          this.currentPeriodEnd = data.currentPeriodEnd || null
          this.updateFeatures()
        }
      } catch {
        this.resetToFree()
      }
    },

    /**
     * Set customer info after successful checkout
     */
    setCustomer(customerId, email = null) {
      this.customerId = customerId
      localStorage.setItem('subscription_customer', JSON.stringify({
        customerId,
        email
      }))
      // Refresh subscription status
      this.checkSubscription()
    },

    /**
     * Get default features based on tier
     */
    getDefaultFeatures() {
      return {
        aiAdvice: false,
        unlimitedHistory: false,
        insights: false,
        export: false
      }
    },

    updateFeatures() {
      if (this.tier === 'premium' && (this.status === 'active' || this.status === 'trialing')) {
        this.features = {
          aiAdvice: true,
          unlimitedHistory: true,
          insights: true,
          export: true
        }
      } else {
        this.features = this.getDefaultFeatures()
      }
    },

    resetToFree() {
      this.tier = 'free'
      this.status = null
      this.subscriptionId = null
      this.currentPeriodEnd = null
      this.features = this.getDefaultFeatures()
    },

    /**
     * Clear all subscription data (logout)
     */
    clearSubscription() {
      this.resetToFree()
      this.customerId = null
      localStorage.removeItem('subscription_customer')
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
