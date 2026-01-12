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
      </div>

      <!-- Info Box -->
      <div class="mt-10 glass p-6 rounded-xl border-l-4 border-purple-500 animate-on-enter stagger-4">
        <p class="text-sm text-gray-700 flex items-start gap-3">
          <span class="text-xl flex-shrink-0">&#128161;</span>
          <span>
            <strong>Tip:</strong> Different tools work best for different decisions.
            Use 10-10-10 for emotional choices, Regret Minimization for life-changing decisions,
            and PMI for analytical evaluation.
          </span>
        </p>
      </div>

    </div>
  </div>
</template>

<script setup>
import ToolCard from '@/components/shared/ToolCard.vue'
</script>
