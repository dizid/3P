<template>
  <footer class="relative mt-auto">
    <!-- Gradient accent line -->
    <div class="h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500"></div>

    <div class="footer-bg border-t border-white/10 dark:border-gray-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">

          <!-- Brand Column -->
          <div class="sm:col-span-2 lg:col-span-1">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span class="text-lg font-bold text-white">3P</span>
              </div>
              <div>
                <h3 class="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">De 3 P's</h3>
                <p class="text-xs text-gray-500 dark:text-gray-400">Projecten Beoordelen</p>
              </div>
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed max-w-xs">
              Maak betere beslissingen met 8 bewezen tools. Van snelle buikgevoel-checks tot diepgaande analyses.
            </p>
          </div>

          <!-- Tools Column -->
          <div>
            <h4 class="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-4">Tools</h4>
            <ul class="space-y-2.5">
              <li><RouterLink to="/tools/3ps" class="footer-link">De 3 P's</RouterLink></li>
              <li><RouterLink to="/tools/10-10-10" class="footer-link">10-10-10 Rule</RouterLink></li>
              <li><RouterLink to="/tools/regret" class="footer-link">Regret Minimization</RouterLink></li>
              <li><RouterLink to="/tools/pmi" class="footer-link">PMI Analysis</RouterLink></li>
              <li><RouterLink to="/tools/swot" class="footer-link">SWOT Analysis</RouterLink></li>
              <li><RouterLink to="/tools/coin-flip" class="footer-link">Coin Flip</RouterLink></li>
              <li><RouterLink to="/tools/fear-regret" class="footer-link">Fear/Regret Matrix</RouterLink></li>
              <li><RouterLink to="/tools/opportunity-cost" class="footer-link">Opportunity Cost</RouterLink></li>
            </ul>
          </div>

          <!-- Resources Column -->
          <div>
            <h4 class="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-4">Resources</h4>
            <ul class="space-y-2.5">
              <li><RouterLink to="/tools" class="footer-link">All Tools</RouterLink></li>
              <li><RouterLink to="/compare" class="footer-link">Compare Tools</RouterLink></li>
              <li><RouterLink to="/history" class="footer-link">Decision History</RouterLink></li>
              <li><RouterLink to="/insights" class="footer-link">Insights Dashboard</RouterLink></li>
              <li><RouterLink to="/help" class="footer-link">Help & Guides</RouterLink></li>
              <li><RouterLink to="/pricing" class="footer-link">Pricing</RouterLink></li>
            </ul>
          </div>

          <!-- About Column -->
          <div>
            <h4 class="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-4">Over Ons</h4>
            <ul class="space-y-2.5">
              <li><RouterLink to="/about" class="footer-link">Over De 3 P's</RouterLink></li>
              <li><RouterLink to="/help" class="footer-link">Hoe het werkt</RouterLink></li>
            </ul>
          </div>
        </div>

        <!-- Bottom Bar -->
        <div class="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700/50">
          <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p class="text-sm text-gray-500 dark:text-gray-400">
              &copy; {{ currentYear }} De 3 P's &mdash; Made by
              <a href="https://dizid.com" target="_blank" rel="noopener" class="text-indigo-600 dark:text-indigo-400 hover:underline">Dizid</a>
            </p>
            <p class="text-xs text-gray-400 dark:text-gray-500">
              Beslissingstools voor slimmere keuzes
            </p>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
const currentYear = new Date().getFullYear()
</script>

<style scoped>
.footer-bg {
  background: rgba(249, 250, 251, 0.8);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}
.dark .footer-bg {
  background: rgba(15, 23, 42, 0.8);
}
.footer-link {
  font-size: 0.875rem;
  color: #6b7280;
  transition: color 0.15s;
}
.footer-link:hover {
  color: #4f46e5;
}
.dark .footer-link {
  color: #9ca3af;
}
.dark .footer-link:hover {
  color: #a5b4fc;
}
</style>
