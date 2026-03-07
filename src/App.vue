<script setup>
import { onMounted } from 'vue'
import { useThemeStore } from '@/stores/ThemeStore'
import ThemeToggle from '@/components/shared/ThemeToggle.vue'
import OnboardingModal from '@/components/onboarding/OnboardingModal.vue'

const themeStore = useThemeStore()

onMounted(() => {
  themeStore.init()
})
</script>

<template>
  <div class="min-h-screen gradient-mesh">
    <!-- Skip Link for Accessibility -->
    <a
      href="#main-content"
      class="skip-link sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-indigo-600 focus:text-white focus:rounded-lg focus:shadow-lg"
    >
      Skip to main content
    </a>

    <!-- Navigation Header with Glass Effect -->
    <nav class="glass dark:glass-dark sticky top-0 z-50 border-b border-white/20 dark:border-gray-700/50 shadow-glass" aria-label="Main navigation">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-20">
          <!-- Logo/Brand with Animation -->
          <div class="flex items-center gap-3">
            <RouterLink to="/" class="flex items-center gap-3 group">
              <div class="relative">
                <!-- Glow effect behind logo -->
                <div class="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl blur-lg opacity-40 group-hover:opacity-70 transition-opacity duration-300"></div>
                <div class="relative w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-lg">
                  <span class="text-2xl font-bold text-white">3P</span>
                </div>
              </div>
              <div class="hidden sm:block">
                <h1 class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  De 3 P's
                </h1>
                <p class="text-xs text-gray-600 dark:text-gray-400 -mt-1 tracking-wide">Projecten Beoordelen</p>
              </div>
            </RouterLink>
          </div>

          <!-- Navigation Links - Simple & Readable -->
          <div class="flex items-center gap-2 sm:gap-3">
            <RouterLink
              to="/"
              class="px-4 py-2 rounded-xl font-semibold bg-blue-500 text-white hover:bg-blue-600 transition-colors"
            >
              <span class="flex items-center gap-2">
                <span class="text-lg">🏠</span>
                <span class="hidden sm:inline">Start</span>
              </span>
            </RouterLink>
            <RouterLink
              to="/tools"
              class="px-4 py-2 rounded-xl font-semibold bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
            >
              <span class="flex items-center gap-2">
                <span class="text-lg">🧰</span>
                <span class="hidden sm:inline">Tools</span>
              </span>
            </RouterLink>
            <RouterLink
              to="/history"
              class="px-4 py-2 rounded-xl font-semibold bg-amber-500 text-white hover:bg-amber-600 transition-colors"
            >
              <span class="flex items-center gap-2">
                <span class="text-lg">📚</span>
                <span class="hidden sm:inline">History</span>
              </span>
            </RouterLink>
            <RouterLink
              to="/help"
              class="px-4 py-2 rounded-xl font-semibold bg-indigo-500 text-white hover:bg-indigo-600 transition-colors"
            >
              <span class="flex items-center gap-2">
                <span class="text-lg">❓</span>
                <span class="hidden sm:inline">Help</span>
              </span>
            </RouterLink>
            <RouterLink
              to="/about"
              class="px-4 py-2 rounded-xl font-semibold bg-purple-500 text-white hover:bg-purple-600 transition-colors"
            >
              <span class="flex items-center gap-2">
                <span class="text-lg">ℹ️</span>
                <span class="hidden sm:inline">Info</span>
              </span>
            </RouterLink>

            <!-- Theme Toggle -->
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content with Page Transitions -->
    <main id="main-content" class="relative z-0" tabindex="-1">
      <RouterView v-slot="{ Component, route }">
        <Transition name="page" mode="out-in">
          <component :is="Component" :key="route.path" />
        </Transition>
      </RouterView>
    </main>

    <!-- Onboarding Modal for First-time Users -->
    <OnboardingModal />
  </div>
</template>

<style>
#app {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Force nav text to be visible */
nav a {
  color: #000 !important;
}
nav a.router-link-active {
  color: inherit !important;
}
.dark nav a {
  color: #fff !important;
}
</style>
