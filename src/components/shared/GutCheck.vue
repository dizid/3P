<template>
  <div class="glass mb-6 rounded-xl border border-dashed border-gray-300 dark:border-slate-600 px-4 py-3">
    <p class="text-xs text-gray-500 dark:text-gray-400 mb-2 font-medium tracking-wide uppercase">
      Before you start &mdash; what&rsquo;s your gut telling you?
    </p>
    <div class="flex gap-2 flex-wrap">
      <button
        v-for="option in options"
        :key="option.value"
        type="button"
        @click="select(option.value)"
        :class="[
          'px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-150 border',
          modelValue === option.value
            ? 'bg-indigo-600 border-indigo-500 text-white shadow-sm'
            : 'bg-white/5 dark:bg-white/5 border-white/15 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:border-indigo-400/50 hover:text-gray-300'
        ]"
      >
        {{ option.label }}
      </button>
    </div>
  </div>
</template>

<script setup>
// GutCheck — captures the user's gut feeling before they start a tool.
// Parent manages state via v-model; this component is purely presentational + emits.

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const options = [
  { value: 'yes',    label: 'Lean Yes \u2713' },
  { value: 'no',     label: 'Lean No \u2717' },
  { value: 'unsure', label: 'No Idea ?' }
]

function select(value) {
  // Toggle off if clicking the already-selected option
  emit('update:modelValue', props.modelValue === value ? '' : value)
}
</script>
