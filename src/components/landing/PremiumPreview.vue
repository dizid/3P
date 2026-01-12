<template>
  <section class="py-20 px-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
    <div class="max-w-6xl mx-auto relative">
      <!-- Background decoration -->
      <div class="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
      <div class="absolute bottom-0 left-0 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"></div>

      <!-- Section Header -->
      <div class="text-center mb-16 relative z-10">
        <div class="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-full mb-6 border border-amber-500/30">
          <span class="text-amber-400">&#9733;</span>
          <span class="text-sm font-medium text-amber-300">Coming Soon</span>
        </div>
        <h2 class="text-3xl sm:text-4xl font-bold mb-4">
          Unlock Deeper Insights
        </h2>
        <p class="text-lg text-gray-400 max-w-2xl mx-auto">
          Premium features to take your decision-making to the next level.
        </p>
      </div>

      <!-- Features Grid -->
      <div class="grid md:grid-cols-3 gap-8 relative z-10">
        <!-- AI Advice -->
        <div class="relative group">
          <div class="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div class="relative glass-card p-8 border border-white/10 h-full">
            <div class="w-14 h-14 mb-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-2xl shadow-lg">
              &#129302;
            </div>
            <h3 class="text-xl font-bold mb-3">AI-Powered Advice</h3>
            <p class="text-gray-400 mb-4">
              Get personalized insights and recommendations based on your analysis.
              Our AI spots blind spots and offers new perspectives.
            </p>
            <div class="flex items-center gap-2 text-indigo-400 text-sm font-medium">
              <span class="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></span>
              Interactive guidance
            </div>
          </div>
        </div>

        <!-- Unlimited History -->
        <div class="relative group">
          <div class="absolute inset-0 bg-gradient-to-br from-emerald-600/20 to-teal-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div class="relative glass-card p-8 border border-white/10 h-full">
            <div class="w-14 h-14 mb-6 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center text-2xl shadow-lg">
              &#128218;
            </div>
            <h3 class="text-xl font-bold mb-3">Unlimited History</h3>
            <p class="text-gray-400 mb-4">
              Track all your decisions forever. Review past choices, learn from patterns,
              and build your decision-making wisdom over time.
            </p>
            <div class="flex items-center gap-2 text-emerald-400 text-sm font-medium">
              <span class="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
              Outcome tracking
            </div>
          </div>
        </div>

        <!-- Deep Insights -->
        <div class="relative group">
          <div class="absolute inset-0 bg-gradient-to-br from-amber-600/20 to-orange-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div class="relative glass-card p-8 border border-white/10 h-full">
            <div class="w-14 h-14 mb-6 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center text-2xl shadow-lg">
              &#128200;
            </div>
            <h3 class="text-xl font-bold mb-3">Personal Insights</h3>
            <p class="text-gray-400 mb-4">
              Discover your decision-making patterns. Understand which tools work best
              for you and how to improve your success rate.
            </p>
            <div class="flex items-center gap-2 text-amber-400 text-sm font-medium">
              <span class="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></span>
              Analytics dashboard
            </div>
          </div>
        </div>
      </div>

      <!-- Pricing Preview -->
      <div class="mt-16 text-center relative z-10">
        <div class="inline-block glass-card p-8 border border-white/10 max-w-md">
          <div class="text-4xl font-bold mb-2">
            <span class="text-gray-400 text-lg line-through mr-2">$9.99</span>
            <span class="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">$5.99</span>
            <span class="text-gray-400 text-lg">/month</span>
          </div>
          <p class="text-gray-400 mb-6">
            Early bird pricing - Lock in this rate forever
          </p>
          <button
            disabled
            class="w-full px-8 py-4 bg-gradient-to-r from-gray-600 to-gray-700 text-gray-300 font-bold rounded-xl cursor-not-allowed opacity-75"
          >
            Coming Soon
          </button>
          <p class="text-xs text-gray-500 mt-4">
            Free tools will always remain free
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
</script>
