<template>
  <div class="min-h-screen py-8 px-4">
    <div class="max-w-4xl mx-auto">

      <!-- Header -->
      <div class="text-center mb-10 animate-on-enter">
        <h1 class="text-4xl sm:text-5xl font-bold mb-4">
          <span class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Decision Tools
          </span>
        </h1>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          Simple frameworks to help you make better decisions. Choose a tool below to get started.
        </p>
      </div>

      <!-- Featured Tool: De 3 P's -->
      <div class="mb-6 animate-on-enter">
        <RouterLink
          to="/tools/3ps"
          class="block relative overflow-hidden rounded-2xl p-6 text-white card-lift group cursor-pointer"
          style="background: linear-gradient(135deg, #6366f1, #4f46e5)"
        >
          <!-- Background decorations -->
          <div class="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div class="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>

          <div class="relative z-10 flex items-center gap-4">
            <div class="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-4xl shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
              &#128176;
            </div>
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-1">
                <h3 class="text-2xl font-bold">De 3 P's</h3>
                <span class="px-2 py-0.5 bg-white/20 rounded-full text-xs font-semibold uppercase tracking-wide">Featured</span>
              </div>
              <p class="text-white/90">
                Evalueer projecten op basis van Poen, Pret en Prestige. Past dit project bij jouw waarden?
              </p>
            </div>
            <div class="flex-shrink-0 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </RouterLink>
      </div>

      <!-- Tool Cards -->
      <div class="space-y-4">
        <ToolCard
          to="/tools/10-10-10"
          icon="&#9200;"
          title="10-10-10 Rule"
          description="Evaluate decisions through time: How will you feel in 10 minutes, 10 months, and 10 years?"
          color="#3b82f6"
          color-dark="#1d4ed8"
          class="animate-on-enter stagger-1"
        />

        <ToolCard
          to="/tools/regret"
          icon="&#129300;"
          title="Regret Minimization"
          description="Jeff Bezos' framework: Imagine yourself at 80 looking back. Which choice minimizes regret?"
          color="#8b5cf6"
          color-dark="#6d28d9"
          class="animate-on-enter stagger-2"
        />

        <ToolCard
          to="/tools/pmi"
          icon="&#9878;"
          title="PMI Analysis"
          description="Edward de Bono's method: List the Plus, Minus, and Interesting aspects of your decision."
          color="#10b981"
          color-dark="#059669"
          class="animate-on-enter stagger-3"
        />

        <ToolCard
          to="/tools/swot"
          icon="&#127919;"
          title="SWOT Analysis"
          description="Strategic planning: Evaluate Strengths, Weaknesses, Opportunities, and Threats in a 2x2 grid."
          color="#f59e0b"
          color-dark="#d97706"
          class="animate-on-enter stagger-4"
        />

        <ToolCard
          to="/tools/opportunity-cost"
          icon="&#9878;"
          title="Opportunity Cost"
          description="Compare what you gain versus what you sacrifice. Is the trade-off worth it?"
          color="#06b6d4"
          color-dark="#0891b2"
          class="animate-on-enter stagger-5"
        />

        <ToolCard
          to="/tools/coin-flip"
          icon="&#129689;"
          title="Coin Flip Test"
          description="Flip a coin and notice your gut reaction. Your feelings reveal your true preference."
          color="#ec4899"
          color-dark="#db2777"
          class="animate-on-enter stagger-6"
        />

        <ToolCard
          to="/tools/fear-regret"
          icon="&#128168;"
          title="Fear vs Regret"
          description="Weigh your fears of action against fears of inaction. Which scares you more?"
          color="#ef4444"
          color-dark="#dc2626"
          class="animate-on-enter stagger-7"
        />
      </div>

      <!-- Info Box -->
      <div class="mt-10 glass p-6 rounded-xl border-l-4 border-purple-500 animate-on-enter stagger-8">
        <p class="text-sm text-gray-700 flex items-start gap-3">
          <span class="text-xl flex-shrink-0">&#128161;</span>
          <span>
            <strong>Tip:</strong> Different tools work best for different decisions.
            Use 10-10-10 for emotional choices, Regret Minimization for life-changing decisions,
            SWOT for strategic planning, and Coin Flip when you just can't decide!
          </span>
        </p>
      </div>

    </div>
  </div>
</template>

<script setup>
import ToolCard from '@/components/shared/ToolCard.vue'
</script>
