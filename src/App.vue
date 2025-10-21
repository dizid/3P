<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation Header -->
    <nav class="bg-white shadow-lg border-b-4 border-blue-500">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-20">
          <!-- Logo/Brand -->
          <div class="flex items-center gap-3">
            <RouterLink to="/" class="flex items-center gap-3 group">
              <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center transform transition-transform group-hover:scale-110">
                <span class="text-2xl font-bold text-white">3P</span>
              </div>
              <div class="hidden sm:block">
                <h1 class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  De 3 P's
                </h1>
                <p class="text-xs text-gray-500 -mt-1">Projecten Beoordelen</p>
              </div>
            </RouterLink>
          </div>

          <!-- Navigation Links -->
          <div class="flex items-center gap-2 sm:gap-4">
            <RouterLink
              to="/"
              class="px-4 py-2 rounded-lg font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
              active-class="bg-blue-100 text-blue-700"
            >
              <span class="hidden sm:inline">🏠 Start</span>
              <span class="sm:hidden">🏠</span>
            </RouterLink>
            <RouterLink
              to="/about"
              class="px-4 py-2 rounded-lg font-semibold text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-all duration-200"
              active-class="bg-purple-100 text-purple-700"
            >
              <span class="hidden sm:inline">ℹ️ Info</span>
              <span class="sm:hidden">ℹ️</span>
            </RouterLink>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <RouterView />
  </div>
</template>

<style>
#app {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
