import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useThemeStore = defineStore('ThemeStore', () => {
  // State
  const theme = ref('light') // 'light' | 'dark' | 'system'
  const resolvedTheme = ref('light') // Actual theme being applied

  // Initialize from localStorage
  const init = () => {
    const saved = localStorage.getItem('theme')
    if (saved && ['light', 'dark', 'system'].includes(saved)) {
      theme.value = saved
    }
    updateResolvedTheme()
    applyTheme()
  }

  // Update resolved theme based on system preference
  const updateResolvedTheme = () => {
    if (theme.value === 'system') {
      resolvedTheme.value = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    } else {
      resolvedTheme.value = theme.value
    }
  }

  // Apply theme to document
  const applyTheme = () => {
    const html = document.documentElement
    if (resolvedTheme.value === 'dark') {
      html.classList.add('dark')
    } else {
      html.classList.remove('dark')
    }
  }

  // Set theme
  const setTheme = (newTheme) => {
    theme.value = newTheme
    localStorage.setItem('theme', newTheme)
    updateResolvedTheme()
    applyTheme()
  }

  // Toggle between light and dark
  const toggleTheme = () => {
    if (resolvedTheme.value === 'light') {
      setTheme('dark')
    } else {
      setTheme('light')
    }
  }

  // Cycle through themes: light -> dark -> system
  const cycleTheme = () => {
    const order = ['light', 'dark', 'system']
    const currentIndex = order.indexOf(theme.value)
    const nextIndex = (currentIndex + 1) % order.length
    setTheme(order[nextIndex])
  }

  // Listen for system theme changes
  if (typeof window !== 'undefined') {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (theme.value === 'system') {
        updateResolvedTheme()
        applyTheme()
      }
    })
  }

  return {
    theme,
    resolvedTheme,
    init,
    setTheme,
    toggleTheme,
    cycleTheme
  }
})
