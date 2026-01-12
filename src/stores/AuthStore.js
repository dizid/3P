import { defineStore } from 'pinia'

export const useAuthStore = defineStore({
  id: 'AuthStore',

  state: () => ({
    user: null,
    isAuthenticated: false,
    isLoading: false
  }),

  getters: {
    userEmail: (state) => state.user?.email || null,
    userName: (state) => state.user?.name || 'User'
  },

  actions: {
    // Placeholder - will be implemented with real auth
    async login(email, password) {
      this.isLoading = true
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Placeholder: In production, this would call your auth API
        this.user = {
          id: 'user_' + Date.now(),
          email,
          name: email.split('@')[0]
        }
        this.isAuthenticated = true
        return { success: true }
      } catch (error) {
        return { success: false, error: error.message }
      } finally {
        this.isLoading = false
      }
    },

    async logout() {
      this.user = null
      this.isAuthenticated = false
    },

    async checkAuth() {
      // Placeholder: Check if user has valid session
      // In production, this would verify the JWT or session
      const savedUser = localStorage.getItem('auth_user')
      if (savedUser) {
        try {
          this.user = JSON.parse(savedUser)
          this.isAuthenticated = true
        } catch {
          this.user = null
          this.isAuthenticated = false
        }
      }
    },

    // Save user to localStorage (for demo purposes)
    persistUser() {
      if (this.user) {
        localStorage.setItem('auth_user', JSON.stringify(this.user))
      } else {
        localStorage.removeItem('auth_user')
      }
    }
  }
})
