<script setup>
const testimonials = [
  {
    quote: "Stopped overthinking my career change. The Regret Minimization tool gave me clarity in 10 minutes what months of deliberation couldn't.",
    author: "Sarah K.",
    role: "Product Manager",
    tool: "Regret Minimization",
    avatar: null
  },
  {
    quote: "Our team uses the Compare feature before every major project decision. It's become essential to our planning process.",
    author: "Marcus T.",
    role: "Startup Founder",
    tool: "Compare Tools",
    avatar: null
  },
  {
    quote: "The AI coaching found blind spots I never would have seen myself. Identified three cognitive biases affecting my judgment.",
    author: "Elena R.",
    role: "Management Consultant",
    tool: "AI Coach",
    isPremium: true,
    avatar: null
  },
  {
    quote: "Simple but powerful. De 3 P's helped me evaluate a job offer in terms I actually care about - money, enjoyment, and growth.",
    author: "David L.",
    role: "Software Engineer",
    tool: "De 3 P's",
    avatar: null
  }
]
</script>

<template>
  <section class="py-20 relative overflow-hidden">
    <!-- Background decoration -->
    <div class="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-50/50 to-transparent dark:via-indigo-900/10"></div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
      <!-- Header -->
      <div class="text-center mb-16">
        <span class="inline-block px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-sm font-semibold mb-4">
          Trusted by Decision Makers
        </span>
        <h2 class="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          What People Are Saying
        </h2>
        <p class="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
          Join thousands who've transformed their decision-making process
        </p>
      </div>

      <!-- Testimonials Grid -->
      <div class="grid md:grid-cols-2 gap-8">
        <div
          v-for="(testimonial, index) in testimonials"
          :key="index"
          class="glass-card p-8 relative group hover:shadow-xl transition-shadow duration-300"
          :class="{ 'md:col-span-2 lg:col-span-1': index === testimonials.length - 1 && testimonials.length % 2 !== 0 }"
        >
          <!-- Quote mark -->
          <div class="absolute top-4 right-4 text-6xl text-indigo-200 dark:text-indigo-800 font-serif leading-none opacity-50 group-hover:opacity-70 transition-opacity">
            "
          </div>

          <!-- Premium badge -->
          <div v-if="testimonial.isPremium" class="absolute top-4 left-4">
            <span class="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-semibold">
              <span>&#9733;</span>
              Pro
            </span>
          </div>

          <!-- Content -->
          <div class="relative">
            <p class="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-6 italic">
              "{{ testimonial.quote }}"
            </p>

            <div class="flex items-center gap-4">
              <!-- Avatar -->
              <div class="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                {{ testimonial.author.charAt(0) }}
              </div>

              <!-- Author info -->
              <div>
                <div class="font-semibold text-gray-800 dark:text-gray-100">
                  {{ testimonial.author }}
                </div>
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  {{ testimonial.role }}
                </div>
              </div>

              <!-- Tool used -->
              <div class="ml-auto">
                <span class="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs font-medium">
                  {{ testimonial.tool }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats -->
      <div class="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div class="text-center">
          <div class="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">10,000+</div>
          <div class="text-gray-600 dark:text-gray-400">Decisions Made</div>
        </div>
        <div class="text-center">
          <div class="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">8</div>
          <div class="text-gray-600 dark:text-gray-400">Decision Tools</div>
        </div>
        <div class="text-center">
          <div class="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">4.8/5</div>
          <div class="text-gray-600 dark:text-gray-400">User Rating</div>
        </div>
        <div class="text-center">
          <div class="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">&lt;5 min</div>
          <div class="text-gray-600 dark:text-gray-400">Average Decision Time</div>
        </div>
      </div>
    </div>
  </section>
</template>
