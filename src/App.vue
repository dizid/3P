<template>
  <div class="min-h-screen gradient-mesh">
    <!-- Navigation Header with Glass Effect -->
    <nav class="glass sticky top-0 z-50 border-b border-white/20 shadow-glass">
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
                <p class="text-xs text-gray-500 -mt-1 tracking-wide">Projecten Beoordelen</p>
              </div>
            </RouterLink>
          </div>

          <!-- Navigation Links with Enhanced Hover -->
          <div class="flex items-center gap-2 sm:gap-3">
            <RouterLink
              to="/"
              class="relative px-4 py-2 rounded-xl font-semibold text-gray-700 overflow-hidden group transition-all duration-300 hover:text-blue-600"
              active-class="bg-blue-100/80 text-blue-700"
            >
              <span class="relative z-10 flex items-center gap-2">
                <span class="text-lg transform group-hover:scale-110 transition-transform duration-200">&#127968;</span>
                <span class="hidden sm:inline">Start</span>
              </span>
              <div class="absolute inset-0 bg-blue-100 scale-0 group-hover:scale-100 transition-transform duration-300 rounded-xl origin-center"></div>
            </RouterLink>
            <RouterLink
              to="/about"
              class="relative px-4 py-2 rounded-xl font-semibold text-gray-700 overflow-hidden group transition-all duration-300 hover:text-purple-600"
              active-class="bg-purple-100/80 text-purple-700"
            >
              <span class="relative z-10 flex items-center gap-2">
                <span class="text-lg transform group-hover:scale-110 transition-transform duration-200">&#8505;&#65039;</span>
                <span class="hidden sm:inline">Info</span>
              </span>
              <div class="absolute inset-0 bg-purple-100 scale-0 group-hover:scale-100 transition-transform duration-300 rounded-xl origin-center"></div>
            </RouterLink>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content with Page Transitions -->
    <main class="relative z-0">
      <RouterView v-slot="{ Component, route }">
        <Transition name="page" mode="out-in">
          <component :is="Component" :key="route.path" />
        </Transition>
      </RouterView>
    </main>
  </div>
</template>

<style>
#app {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
