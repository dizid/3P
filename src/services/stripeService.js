/**
 * Stripe Service - Real payment integration via Netlify Functions
 *
 * Connects to Stripe via serverless functions for secure payment processing.
 *
 * Environment variables (in Netlify):
 * - STRIPE_SECRET_KEY
 * - STRIPE_WEBHOOK_SECRET
 */

const API_BASE = import.meta.env.DEV ? 'http://localhost:8888' : ''

export const stripeService = {
  /**
   * Create a checkout session for subscription
   * @param {string} priceId - Stripe price ID (monthly or yearly)
   * @param {string} userId - User ID from auth (optional)
   * @param {string} email - Customer email (optional)
   * @returns {Promise<{url: string}>} - Checkout URL to redirect to
   */
  async createCheckoutSession(priceId, userId = null, email = null) {
    try {
      const response = await fetch(`${API_BASE}/api/create-checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId, userId, email })
      })

      if (!response.ok) {
        const error = await response.json()
        console.error('Checkout session failed:', error)
        return {
          url: null,
          error: error.error || 'Failed to create checkout session'
        }
      }

      const result = await response.json()
      return { url: result.url }
    } catch (error) {
      console.error('Stripe service error:', error)
      return {
        url: null,
        error: 'Payment service temporarily unavailable'
      }
    }
  },

  /**
   * Create a customer portal session for managing subscription
   * @param {string} customerId - Stripe customer ID
   * @returns {Promise<{url: string}>} - Portal URL to redirect to
   */
  async createPortalSession(customerId) {
    try {
      const response = await fetch(`${API_BASE}/api/customer-portal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId })
      })

      if (!response.ok) {
        const error = await response.json()
        console.error('Portal session failed:', error)
        return {
          url: null,
          error: error.error || 'Failed to create portal session'
        }
      }

      const result = await response.json()
      return { url: result.url }
    } catch (error) {
      console.error('Stripe service error:', error)
      return {
        url: null,
        error: 'Payment service temporarily unavailable'
      }
    }
  },

  /**
   * Get subscription status for a user
   * @param {string} customerId - Stripe customer ID (optional)
   * @param {string} email - Customer email (optional)
   * @returns {Promise<{tier: string, status: string, features: object}>}
   */
  async getSubscriptionStatus(customerId = null, email = null) {
    try {
      const response = await fetch(`${API_BASE}/api/subscription-status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId, email })
      })

      if (!response.ok) {
        console.error('Subscription status check failed')
        return this.getDefaultStatus()
      }

      return await response.json()
    } catch (error) {
      console.error('Stripe service error:', error)
      return this.getDefaultStatus()
    }
  },

  /**
   * Default free tier status
   */
  getDefaultStatus() {
    return {
      tier: 'free',
      status: null,
      features: {
        aiAdvice: false,
        unlimitedHistory: false,
        insights: false,
        export: false
      }
    }
  }
}

// Price IDs - Set these in your Stripe Dashboard
// Then update via environment variables or directly here after creating products
export const stripePrices = {
  // Monthly: €5.99/month
  monthly: import.meta.env.VITE_STRIPE_PRICE_MONTHLY || 'price_monthly_placeholder',
  // Yearly: €49.99/year (save 30%)
  yearly: import.meta.env.VITE_STRIPE_PRICE_YEARLY || 'price_yearly_placeholder'
}

export default stripeService
