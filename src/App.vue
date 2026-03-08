<script setup>
import { ref, onMounted } from 'vue'
import { useThemeStore } from '@/stores/ThemeStore'
import { useAuthStore } from '@/stores/AuthStore'
import ThemeToggle from '@/components/shared/ThemeToggle.vue'
import OnboardingModal from '@/components/onboarding/OnboardingModal.vue'
import LoginModal from '@/components/auth/LoginModal.vue'

const themeStore = useThemeStore()
const authStore = useAuthStore()
const showLoginModal = ref(false)

onMounted(() => {
  themeStore.init()
  authStore.checkSession()
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

          <!-- Navigation Links -->
          <div class="flex items-center gap-1 sm:gap-2">
            <RouterLink
              to="/"
              class="nav-link"
              exact-active-class="nav-link-active"
            >
              Start
            </RouterLink>
            <RouterLink
              to="/tools"
              class="nav-link"
              active-class="nav-link-active"
            >
              Tools
            </RouterLink>
            <RouterLink
              to="/history"
              class="nav-link"
              active-class="nav-link-active"
            >
              History
            </RouterLink>
            <RouterLink
              to="/help"
              class="nav-link"
              active-class="nav-link-active"
            >
              Help
            </RouterLink>
            <RouterLink
              to="/about"
              class="nav-link"
              active-class="nav-link-active"
            >
              Info
            </RouterLink>

            <!-- Divider -->
            <div class="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>

            <!-- Auth: Login / User menu -->
            <button
              v-if="!authStore.isAuthenticated"
              @click="showLoginModal = true"
              class="px-3 py-1.5 rounded-lg text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
            >
              Login
            </button>
            <div v-else class="relative group">
              <button class="nav-link flex items-center gap-1.5">
                {{ authStore.userName }}
                <span v-if="authStore.isPro" class="text-[10px] bg-gradient-to-r from-amber-400 to-orange-500 text-white px-1.5 py-0.5 rounded font-bold leading-none">PRO</span>
              </button>
              <!-- Dropdown -->
              <div class="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 p-2 z-50">
                <div class="px-3 py-2 text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 mb-1">
                  {{ authStore.userEmail }}
                </div>
                <RouterLink
                  to="/pricing"
                  v-if="!authStore.isPro"
                  class="block px-3 py-2 text-sm text-gray-900 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  Upgrade to Pro
                </RouterLink>
                <button
                  @click="authStore.logout()"
                  class="w-full text-left px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                >
                  Log out
                </button>
              </div>
            </div>

            <!-- Theme Toggle -->
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content with Page Transitions -->
    <main id="main-content" class="relative -z-10 isolate" tabindex="-1">
      <RouterView v-slot="{ Component, route }">
        <Transition name="page" mode="out-in">
          <component :is="Component" :key="route.path" />
        </Transition>
      </RouterView>
    </main>

    <!-- Login Modal -->
    <LoginModal
      :show="showLoginModal"
      @close="showLoginModal = false"
      @authenticated="showLoginModal = false"
    />

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

/* Nav link styles */
.nav-link {
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  transition: background-color 0.15s, color 0.15s;
}
.nav-link:hover {
  background-color: rgba(99, 102, 241, 0.08);
  color: #4f46e5;
}
.nav-link-active {
  background-color: rgba(99, 102, 241, 0.12);
  color: #4f46e5;
  font-weight: 600;
}
.dark .nav-link {
  color: #d1d5db;
}
.dark .nav-link:hover {
  background-color: rgba(99, 102, 241, 0.15);
  color: #a5b4fc;
}
.dark .nav-link-active {
  background-color: rgba(99, 102, 241, 0.2);
  color: #a5b4fc;
}
</style>
