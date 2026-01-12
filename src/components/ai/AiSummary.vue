<template>
  <div class="space-y-6">
    <!-- Summary -->
    <div class="glass p-5 rounded-xl">
      <h4 class="font-bold text-gray-800 dark:text-gray-100 mb-2 flex items-center gap-2">
        <span class="text-xl">&#128161;</span>
        Summary
      </h4>
      <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
        {{ summary.summary }}
      </p>
    </div>

    <!-- Insights -->
    <div class="glass p-5 rounded-xl">
      <h4 class="font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
        <span class="text-xl">&#127891;</span>
        Key Insights
      </h4>
      <ul class="space-y-2">
        <li
          v-for="(insight, index) in summary.insights"
          :key="index"
          class="flex items-start gap-2 text-gray-700 dark:text-gray-300"
        >
          <span class="text-indigo-500 mt-0.5 flex-shrink-0">&#10003;</span>
          <span>{{ insight }}</span>
        </li>
      </ul>
    </div>

    <!-- Blind Spots -->
    <div class="glass p-5 rounded-xl border-l-4 border-amber-500">
      <h4 class="font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
        <span class="text-xl">&#128064;</span>
        Blind Spots to Consider
      </h4>
      <ul class="space-y-2">
        <li
          v-for="(spot, index) in summary.blindSpots"
          :key="index"
          class="flex items-start gap-2 text-gray-700 dark:text-gray-300"
        >
          <span class="text-amber-500 mt-0.5 flex-shrink-0">&#9888;</span>
          <span>{{ spot }}</span>
        </li>
      </ul>
    </div>

    <!-- Suggestions -->
    <div class="glass p-5 rounded-xl border-l-4 border-green-500">
      <h4 class="font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
        <span class="text-xl">&#128640;</span>
        Next Steps
      </h4>
      <ul class="space-y-2">
        <li
          v-for="(suggestion, index) in summary.suggestions"
          :key="index"
          class="flex items-start gap-2 text-gray-700 dark:text-gray-300"
        >
          <span class="text-green-500 mt-0.5 flex-shrink-0">&#10132;</span>
          <span>{{ suggestion }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
defineProps({
  summary: {
    type: Object,
    required: true
  }
})
</script>
