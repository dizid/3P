<template>
  <div class="glass border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-2xl p-6 mx-2">
    <!-- Part 1: Reflection -->
    <div>
      <p class="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-widest mb-3">
        Quick Reflection
      </p>
      <p class="text-gray-800 dark:text-gray-200 font-medium mb-4">
        Does this result surprise you?
      </p>

      <!-- Pill buttons -->
      <div class="flex flex-wrap gap-2 mb-4">
        <button
          v-for="option in reflectionOptions"
          :key="option.value"
          @click="selectReflection(option.value)"
          class="px-4 py-2 rounded-full text-sm font-medium border transition-all duration-150"
          :class="reflection === option.value
            ? 'bg-indigo-600 border-indigo-600 text-white'
            : 'bg-white/60 dark:bg-slate-800/60 border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:border-indigo-400 dark:hover:border-indigo-500'"
        >
          {{ option.label }}
        </button>
      </div>

      <!-- Conditional follow-up -->
      <div v-if="reflection === 'yes'" class="mt-1">
        <input
          v-model="expectedInstead"
          type="text"
          placeholder="What did you expect instead? (optional)"
          class="w-full text-sm px-4 py-2 rounded-xl border border-gray-300 dark:border-slate-600 bg-white/70 dark:bg-slate-800/70 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-indigo-400 dark:focus:border-indigo-500 transition-colors"
        />
      </div>

      <div v-if="reflection === 'no'" class="mt-1">
        <p class="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
          &#10003; Good &#8212; when analysis matches intuition, you can decide with confidence.
        </p>
      </div>
    </div>

    <!-- Part 2: Commitment (shown after reflection is answered) -->
    <div v-if="reflection !== null" class="mt-6 pt-6 border-t border-gray-200 dark:border-slate-700">
      <p class="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-widest mb-3">
        Make It Real
      </p>
      <p class="text-gray-800 dark:text-gray-200 font-medium mb-4">
        Ready to act? Lock it in.
      </p>

      <!-- Saved confirmation -->
      <div
        v-if="committed"
        class="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 text-sm font-medium"
      >
        <span>&#10003;</span>
        <span>Commitment saved &#8212; you got this!</span>
      </div>

      <!-- Commitment form -->
      <div v-else class="space-y-3">
        <div class="flex items-center gap-2">
          <span class="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap font-medium">I will</span>
          <input
            v-model="action"
            type="text"
            placeholder="e.g., call them back, submit my application..."
            class="flex-1 text-sm px-4 py-2 rounded-xl border border-gray-300 dark:border-slate-600 bg-white/70 dark:bg-slate-800/70 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-indigo-400 dark:focus:border-indigo-500 transition-colors"
          />
        </div>

        <div class="flex items-center gap-2">
          <span class="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap font-medium">by</span>
          <input
            v-model="deadline"
            type="date"
            class="flex-1 text-sm px-4 py-2 rounded-xl border border-gray-300 dark:border-slate-600 bg-white/70 dark:bg-slate-800/70 text-gray-800 dark:text-gray-200 focus:outline-none focus:border-indigo-400 dark:focus:border-indigo-500 transition-colors"
          />
        </div>

        <div class="flex justify-end">
          <button
            @click="saveCommitment"
            :disabled="!action.trim()"
            class="px-5 py-2 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white transition-all duration-150 transform hover:scale-105 active:scale-95"
          >
            Save commitment
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Part 1 state
const reflection = ref(null)
const expectedInstead = ref('')

// Part 2 state
const action = ref('')
const deadline = ref(defaultDeadline())
const committed = ref(false)

const reflectionOptions = [
  { value: 'yes', label: 'Yes, unexpected' },
  { value: 'no', label: 'No, confirms my gut' },
  { value: 'unsure', label: 'Not sure' },
]

function defaultDeadline() {
  const d = new Date()
  d.setDate(d.getDate() + 3)
  return d.toISOString().split('T')[0]
}

function selectReflection(value) {
  // Toggle off if already selected
  if (reflection.value === value) {
    reflection.value = null
    return
  }
  reflection.value = value
}

function saveCommitment() {
  if (!action.value.trim()) return

  const commitments = JSON.parse(localStorage.getItem('commitments') || '[]')
  commitments.push({
    action: action.value.trim(),
    deadline: deadline.value,
    createdAt: new Date().toISOString(),
  })
  localStorage.setItem('commitments', JSON.stringify(commitments))
  committed.value = true
}
</script>
