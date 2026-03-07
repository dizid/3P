import { defineStore } from 'pinia'

const API_BASE = import.meta.env.DEV ? 'http://localhost:8888' : ''
const API_KEY = import.meta.env.VITE_APP_API_KEY || ''

export const useAuthStore = defineStore({
  id: 'AuthStore',

  state: () => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    // Magic link flow state
    magicLinkSent: false,
    magicLinkEmail: null,
    authError: null
  }),

  getters: {
    userEmail: (state) => state.user?.email || null,
    userName: (state) => state.user?.displayName || state.user?.email?.split('@')[0] || 'User',
    userPlan: (state) => state.user?.plan || 'free',
    isPro: (state) => state.user?.plan === 'pro',
    sessionToken: () => localStorage.getItem('auth_token')
  },

  actions: {
    // Send magic link email
    async sendMagicLink(email) {
      this.isLoading = true
      this.authError = null

      try {
        const response = await fetch(`${API_BASE}/api/auth/send-magic-link`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': API_KEY
          },
          body: JSON.stringify({ email })
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to send login link')
        }

        this.magicLinkSent = true
        this.magicLinkEmail = email
        return { success: true }
      } catch (error) {
        this.authError = error.message
        return { success: false, error: error.message }
      } finally {
        this.isLoading = false
      }
    },

    // Verify magic link token
    async verifyMagicLink(token) {
      this.isLoading = true
      this.authError = null

      try {
        const response = await fetch(`${API_BASE}/api/auth/verify`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': API_KEY
          },
          body: JSON.stringify({ token })
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Invalid or expired link')
        }

        // Store session
        localStorage.setItem('auth_token', data.token)
        this.user = data.user
        this.isAuthenticated = true
        this.magicLinkSent = false
        this.magicLinkEmail = null

        return { success: true }
      } catch (error) {
        this.authError = error.message
        return { success: false, error: error.message }
      } finally {
        this.isLoading = false
      }
    },

    // Check existing session on app load
    async checkSession() {
      const token = localStorage.getItem('auth_token')
      if (!token) {
        this.isAuthenticated = false
        this.user = null
        return
      }

      try {
        const response = await fetch(`${API_BASE}/api/auth/session`, {
          method: 'GET',
          headers: {
            'x-api-key': API_KEY,
            'Authorization': `Bearer ${token}`
          }
        })

        const data = await response.json()

        if (data.authenticated) {
          this.user = data.user
          this.isAuthenticated = true
        } else {
          // Session expired — clean up
          this.logout()
        }
      } catch {
        // Network error — keep cached state if we have it
        const cached = localStorage.getItem('auth_user_cache')
        if (cached) {
          try {
            this.user = JSON.parse(cached)
            this.isAuthenticated = true
          } catch {
            this.logout()
          }
        }
      }
    },

    logout() {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user_cache')
      this.user = null
      this.isAuthenticated = false
      this.magicLinkSent = false
      this.magicLinkEmail = null
      this.authError = null
    },

    // Reset magic link flow (go back to email input)
    resetMagicLink() {
      this.magicLinkSent = false
      this.magicLinkEmail = null
      this.authError = null
    }
  }
})
