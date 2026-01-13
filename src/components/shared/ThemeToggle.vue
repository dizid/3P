<template>
  <button
    @click="themeStore.cycleTheme()"
    class="p-2 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800"
    :title="tooltipText"
    :aria-label="tooltipText"
    type="button"
  >
    <!-- Sun icon (light mode) -->
    <svg
      v-if="themeStore.resolvedTheme === 'light' && themeStore.theme !== 'system'"
      class="w-5 h-5 text-amber-500"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>

    <!-- Moon icon (dark mode) -->
    <svg
      v-else-if="themeStore.resolvedTheme === 'dark' && themeStore.theme !== 'system'"
      class="w-5 h-5 text-indigo-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
      />
    </svg>

    <!-- System icon (auto mode) -->
    <svg
      v-else
      class="w-5 h-5 text-gray-500 dark:text-gray-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  </button>
</template>

<script setup>
import { computed } from 'vue'
import { useThemeStore } from '@/stores/ThemeStore'

const themeStore = useThemeStore()

const tooltipText = computed(() => {
  switch (themeStore.theme) {
    case 'light':
      return 'Light mode (click for dark)'
    case 'dark':
      return 'Dark mode (click for auto)'
    case 'system':
      return `Auto mode (${themeStore.resolvedTheme}) - click for light`
    default:
      return 'Toggle theme'
  }
})
</script>
