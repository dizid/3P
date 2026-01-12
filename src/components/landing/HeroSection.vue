<template>
  <section class="relative overflow-hidden py-20 px-4">
    <!-- Background gradient -->
    <div class="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500"></div>

    <!-- Decorative elements -->
    <div class="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
    <div class="absolute bottom-10 right-10 w-96 h-96 bg-pink-300/20 rounded-full blur-3xl"></div>
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-400/10 rounded-full blur-3xl"></div>

    <!-- Floating icons -->
    <div class="absolute top-20 right-[15%] text-5xl opacity-20 animate-float">&#128161;</div>
    <div class="absolute top-40 left-[10%] text-4xl opacity-20 animate-float-delayed">&#9200;</div>
    <div class="absolute bottom-32 right-[25%] text-5xl opacity-20 animate-float">&#127919;</div>
    <div class="absolute bottom-20 left-[20%] text-4xl opacity-20 animate-float-delayed">&#128176;</div>

    <div class="relative z-10 max-w-5xl mx-auto text-center text-white">
      <!-- Badge -->
      <div class="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-8 animate-on-enter">
        <span class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
        <span class="text-sm font-medium">Free decision-making tools</span>
      </div>

      <!-- Main heading -->
      <h1 class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight animate-on-enter stagger-1">
        Make Better Decisions,
        <span class="block bg-gradient-to-r from-yellow-200 via-pink-200 to-cyan-200 bg-clip-text text-transparent">
          Every Time
        </span>
      </h1>

      <!-- Subheading -->
      <p class="text-lg sm:text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-10 leading-relaxed animate-on-enter stagger-2">
        Stop second-guessing yourself. Use proven frameworks from psychology and business
        to analyze your choices and move forward with confidence.
      </p>

      <!-- CTA Buttons -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center animate-on-enter stagger-3">
        <RouterLink
          to="/tools"
          class="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-indigo-600 font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
        >
          <span>Explore Tools</span>
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </RouterLink>

        <RouterLink
          to="/tools/3ps"
          class="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-bold rounded-xl border border-white/30 hover:bg-white/20 transform hover:scale-105 transition-all duration-300"
        >
          <span>&#128176;</span>
          <span>Try De 3 P's</span>
        </RouterLink>
      </div>

      <!-- Stats -->
      <div class="flex flex-wrap justify-center gap-8 mt-16 animate-on-enter stagger-4">
        <div class="text-center">
          <div class="text-4xl font-bold">8</div>
          <div class="text-white/70 text-sm">Decision Tools</div>
        </div>
        <div class="text-center">
          <div class="text-4xl font-bold">100%</div>
          <div class="text-white/70 text-sm">Free to Use</div>
        </div>
        <div class="text-center">
          <div class="text-4xl font-bold">&#8734;</div>
          <div class="text-white/70 text-sm">Decisions Analyzed</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
</script>

<style scoped>
@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float 6s ease-in-out infinite;
  animation-delay: 2s;
}
</style>
