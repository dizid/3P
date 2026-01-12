<template>
  <section class="py-20 px-4 bg-white dark:bg-slate-800">
    <div class="max-w-4xl mx-auto text-center">
      <!-- Icon -->
      <div class="text-6xl mb-6">&#128161;</div>

      <!-- Heading -->
      <h2 class="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">
        Ready to Make Better Decisions?
      </h2>

      <!-- Subheading -->
      <p class="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10">
        Start with a quick decision analysis. It only takes a few minutes to gain clarity
        on that choice you've been putting off.
      </p>

      <!-- CTA Buttons -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <RouterLink
          to="/tools/3ps"
          class="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
        >
          <span>&#128176;</span>
          <span>Start with De 3 P's</span>
        </RouterLink>

        <RouterLink
          to="/tools"
          class="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 font-bold rounded-xl border border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-slate-600 transform hover:scale-105 transition-all duration-300"
        >
          <span>Browse All Tools</span>
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </RouterLink>
      </div>

      <!-- Trust indicators -->
      <div class="mt-12 flex flex-wrap justify-center gap-8 text-sm text-gray-500 dark:text-gray-400">
        <div class="flex items-center gap-2">
          <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
          <span>No account required</span>
        </div>
        <div class="flex items-center gap-2">
          <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
          <span>100% free tools</span>
        </div>
        <div class="flex items-center gap-2">
          <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
          <span>Results in minutes</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
</script>
