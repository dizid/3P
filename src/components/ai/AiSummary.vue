<template>
  <div class="space-y-6">
    <!-- Rate limit warning -->
    <div v-if="summary.rateLimited" class="glass p-5 rounded-xl border-l-4 border-red-500">
      <h4 class="font-bold text-gray-800 dark:text-gray-100 mb-2 flex items-center gap-2">
        <span class="text-xl">&#9888;&#65039;</span>
        Rate Limit Reached
      </h4>
      <p class="text-gray-700 dark:text-gray-300 mb-4">{{ summary.message }}</p>
      <RouterLink
        :to="summary.upgradeUrl || '/pricing'"
        class="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-shadow"
      >
        <span>Upgrade Now</span>
        <span>&#8594;</span>
      </RouterLink>
    </div>

    <template v-else>
      <!-- Plan badge and usage -->
      <div v-if="summary.plan" class="flex items-center justify-between mb-4">
        <span
          class="px-3 py-1 rounded-full text-xs font-semibold"
          :class="{
            'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400': summary.plan === 'free',
            'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300': summary.plan === 'pro',
            'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300': summary.plan === 'coach'
          }"
        >
          {{ summary.plan === 'coach' ? 'Coach' : summary.plan === 'pro' ? 'Pro' : 'Free' }} Analysis
        </span>
        <span v-if="summary.remaining !== undefined && summary.plan !== 'coach'" class="text-sm text-gray-500 dark:text-gray-400">
          {{ summary.remaining }} analyses remaining this month
        </span>
      </div>

      <!-- Clarity Score (Coach only) -->
      <div v-if="summary.clarityScore" class="glass p-5 rounded-xl border-l-4 border-purple-500">
        <h4 class="font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center justify-between">
          <span class="flex items-center gap-2">
            <span class="text-xl">&#127919;</span>
            Decision Clarity Score
          </span>
          <span class="text-3xl font-bold text-purple-600 dark:text-purple-400">{{ summary.clarityScore.score }}/10</span>
        </h4>
        <p class="text-gray-700 dark:text-gray-300">{{ summary.clarityScore.explanation }}</p>
      </div>

      <!-- Summary / Core Insight -->
      <div class="glass p-5 rounded-xl">
        <h4 class="font-bold text-gray-800 dark:text-gray-100 mb-2 flex items-center gap-2">
          <span class="text-xl">&#128161;</span>
          {{ summary.plan === 'coach' ? 'Core Insight' : 'Summary' }}
        </h4>
        <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
          {{ summary.summary }}
        </p>
      </div>

      <!-- Cognitive Biases (Pro & Coach) -->
      <div v-if="summary.biases && summary.biases.length > 0" class="glass p-5 rounded-xl border-l-4 border-orange-500">
        <h4 class="font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
          <span class="text-xl">&#129504;</span>
          Cognitive Biases Detected
        </h4>
        <ul class="space-y-3">
          <li
            v-for="(bias, index) in summary.biases"
            :key="index"
            class="text-gray-700 dark:text-gray-300"
          >
            <template v-if="typeof bias === 'string'">
              <span class="flex items-start gap-2">
                <span class="text-orange-500 mt-0.5 flex-shrink-0">&#9888;</span>
                <span>{{ bias }}</span>
              </span>
            </template>
            <template v-else>
              <div class="space-y-1">
                <div class="flex items-start gap-2">
                  <span class="text-orange-500 mt-0.5 flex-shrink-0">&#9888;</span>
                  <span class="font-medium">{{ bias.name }}</span>
                </div>
                <p class="ml-6 text-sm text-gray-600 dark:text-gray-400">{{ bias.manifestation }}</p>
                <p class="ml-6 text-sm italic text-indigo-600 dark:text-indigo-400">"{{ bias.challenge }}"</p>
              </div>
            </template>
          </li>
        </ul>
      </div>

      <!-- Scenarios (Pro & Coach) -->
      <div v-if="summary.scenarios" class="glass p-5 rounded-xl">
        <h4 class="font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
          <span class="text-xl">&#127914;</span>
          Scenario Analysis
        </h4>
        <div class="grid gap-3">
          <div class="flex items-start gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
            <span class="text-green-600 dark:text-green-400 text-lg">&#10003;</span>
            <div>
              <span class="font-medium text-green-700 dark:text-green-300">Best Case:</span>
              <p class="text-gray-700 dark:text-gray-300 text-sm">{{ summary.scenarios.best }}</p>
            </div>
          </div>
          <div v-if="summary.scenarios.likely" class="flex items-start gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
            <span class="text-blue-600 dark:text-blue-400 text-lg">&#8594;</span>
            <div>
              <span class="font-medium text-blue-700 dark:text-blue-300">Most Likely:</span>
              <p class="text-gray-700 dark:text-gray-300 text-sm">{{ summary.scenarios.likely }}</p>
            </div>
          </div>
          <div class="flex items-start gap-3 p-3 rounded-lg bg-red-50 dark:bg-red-900/20">
            <span class="text-red-600 dark:text-red-400 text-lg">&#10007;</span>
            <div>
              <span class="font-medium text-red-700 dark:text-red-300">Worst Case:</span>
              <p class="text-gray-700 dark:text-gray-300 text-sm">{{ summary.scenarios.worst }}</p>
            </div>
          </div>
        </div>
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

      <!-- Framework Fit (Coach only) -->
      <div v-if="summary.frameworkFit" class="glass p-5 rounded-xl border-l-4 border-indigo-500">
        <h4 class="font-bold text-gray-800 dark:text-gray-100 mb-2 flex items-center gap-2">
          <span class="text-xl">&#128736;</span>
          Framework Fit
        </h4>
        <div class="flex items-center gap-2 mb-2">
          <span
            class="px-2 py-1 rounded text-xs font-medium"
            :class="summary.frameworkFit.suitable
              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
              : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'"
          >
            {{ summary.frameworkFit.suitable ? 'Good Fit' : 'Consider Alternatives' }}
          </span>
        </div>
        <p class="text-gray-700 dark:text-gray-300 text-sm">{{ summary.frameworkFit.reason }}</p>
        <p v-if="summary.frameworkFit.alternative && !summary.frameworkFit.suitable" class="mt-2 text-indigo-600 dark:text-indigo-400 text-sm font-medium">
          Try: {{ summary.frameworkFit.alternative }}
        </p>
      </div>

      <!-- Confidence -->
      <div class="glass p-5 rounded-xl">
        <h4 class="font-bold text-gray-800 dark:text-gray-100 mb-2 flex items-center gap-2">
          <span class="text-xl">&#127775;</span>
          Confidence Level
        </h4>
        <div class="flex items-center gap-3">
          <div class="flex gap-1">
            <div
              v-for="n in 3"
              :key="n"
              class="w-8 h-2 rounded-full"
              :class="n <= confidenceLevel
                ? confidenceColor
                : 'bg-gray-200 dark:bg-gray-700'"
            ></div>
          </div>
          <span class="text-sm font-medium capitalize" :class="confidenceTextColor">{{ summary.confidence }}</span>
        </div>
        <p v-if="summary.confidenceReason" class="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {{ summary.confidenceReason }}
        </p>
        <ul v-if="summary.confidenceMissing && summary.confidenceMissing.length > 0" class="mt-2 space-y-1">
          <li v-for="(item, index) in summary.confidenceMissing" :key="index" class="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
            <span class="text-xs">&#8226;</span>
            Missing: {{ item }}
          </li>
        </ul>
      </div>

      <!-- Coaching Questions (Coach only) -->
      <div v-if="summary.questions && summary.questions.length > 0" class="glass p-5 rounded-xl border-l-4 border-purple-500">
        <h4 class="font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
          <span class="text-xl">&#129300;</span>
          Questions to Consider
        </h4>
        <ul class="space-y-3">
          <li
            v-for="(question, index) in summary.questions"
            :key="index"
            class="flex items-start gap-2 text-gray-700 dark:text-gray-300"
          >
            <span class="text-purple-500 mt-0.5 flex-shrink-0">{{ index + 1 }}.</span>
            <span class="italic">{{ question }}</span>
          </li>
        </ul>
      </div>

      <!-- Next Steps -->
      <div class="glass p-5 rounded-xl border-l-4 border-green-500">
        <h4 class="font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
          <span class="text-xl">&#128640;</span>
          Next Step
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
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  summary: {
    type: Object,
    required: true
  }
})

const confidenceLevel = computed(() => {
  const conf = props.summary.confidence?.toLowerCase() || 'medium'
  if (conf === 'high') return 3
  if (conf === 'medium') return 2
  return 1
})

const confidenceColor = computed(() => {
  const conf = props.summary.confidence?.toLowerCase() || 'medium'
  if (conf === 'high') return 'bg-green-500'
  if (conf === 'medium') return 'bg-amber-500'
  return 'bg-red-500'
})

const confidenceTextColor = computed(() => {
  const conf = props.summary.confidence?.toLowerCase() || 'medium'
  if (conf === 'high') return 'text-green-600 dark:text-green-400'
  if (conf === 'medium') return 'text-amber-600 dark:text-amber-400'
  return 'text-red-600 dark:text-red-400'
})
</script>
