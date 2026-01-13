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
  <div class="min-h-screen gradient-mesh dark:gradient-mesh-dark">
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

          <!-- Navigation Links with Enhanced Hover -->
          <div class="flex items-center gap-2 sm:gap-3">
            <RouterLink
              to="/"
              class="relative px-4 py-2 rounded-xl font-semibold text-gray-900 dark:text-gray-200 overflow-hidden group transition-all duration-300 hover:text-blue-600 dark:hover:text-blue-400"
              active-class="bg-blue-100/80 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300"
            >
              <span class="relative z-10 flex items-center gap-2">
                <span class="text-lg transform group-hover:scale-110 transition-transform duration-200">&#127968;</span>
                <span class="hidden sm:inline">Start</span>
              </span>
              <div class="absolute inset-0 bg-blue-100 dark:bg-blue-900/50 scale-0 group-hover:scale-100 transition-transform duration-300 rounded-xl origin-center"></div>
            </RouterLink>
            <RouterLink
              to="/tools"
              class="relative px-4 py-2 rounded-xl font-semibold text-gray-900 dark:text-gray-200 overflow-hidden group transition-all duration-300 hover:text-emerald-600 dark:hover:text-emerald-400"
              active-class="bg-emerald-100/80 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300"
            >
              <span class="relative z-10 flex items-center gap-2">
                <span class="text-lg transform group-hover:scale-110 transition-transform duration-200">&#129520;</span>
                <span class="hidden sm:inline">Tools</span>
              </span>
              <div class="absolute inset-0 bg-emerald-100 dark:bg-emerald-900/50 scale-0 group-hover:scale-100 transition-transform duration-300 rounded-xl origin-center"></div>
            </RouterLink>
            <RouterLink
              to="/history"
              class="relative px-4 py-2 rounded-xl font-semibold text-gray-900 dark:text-gray-200 overflow-hidden group transition-all duration-300 hover:text-amber-600 dark:hover:text-amber-400"
              active-class="bg-amber-100/80 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300"
            >
              <span class="relative z-10 flex items-center gap-2">
                <span class="text-lg transform group-hover:scale-110 transition-transform duration-200">&#128218;</span>
                <span class="hidden sm:inline">History</span>
              </span>
              <div class="absolute inset-0 bg-amber-100 dark:bg-amber-900/50 scale-0 group-hover:scale-100 transition-transform duration-300 rounded-xl origin-center"></div>
            </RouterLink>
            <RouterLink
              to="/help"
              class="relative px-4 py-2 rounded-xl font-semibold text-gray-900 dark:text-gray-200 overflow-hidden group transition-all duration-300 hover:text-indigo-600 dark:hover:text-indigo-400"
              active-class="bg-indigo-100/80 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300"
            >
              <span class="relative z-10 flex items-center gap-2">
                <span class="text-lg transform group-hover:scale-110 transition-transform duration-200">&#10067;</span>
                <span class="hidden sm:inline">Help</span>
              </span>
              <div class="absolute inset-0 bg-indigo-100 dark:bg-indigo-900/50 scale-0 group-hover:scale-100 transition-transform duration-300 rounded-xl origin-center"></div>
            </RouterLink>
            <RouterLink
              to="/about"
              class="relative px-4 py-2 rounded-xl font-semibold text-gray-900 dark:text-gray-200 overflow-hidden group transition-all duration-300 hover:text-purple-600 dark:hover:text-purple-400"
              active-class="bg-purple-100/80 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300"
            >
              <span class="relative z-10 flex items-center gap-2">
                <span class="text-lg transform group-hover:scale-110 transition-transform duration-200">&#8505;&#65039;</span>
                <span class="hidden sm:inline">Info</span>
              </span>
              <div class="absolute inset-0 bg-purple-100 dark:bg-purple-900/50 scale-0 group-hover:scale-100 transition-transform duration-300 rounded-xl origin-center"></div>
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
</style>
