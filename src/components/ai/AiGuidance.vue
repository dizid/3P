<template>
  <div class="space-y-4">
    <!-- Chat messages -->
    <div class="space-y-4 max-h-80 overflow-y-auto pr-2">
      <div
        v-for="(message, index) in messages"
        :key="index"
        class="flex gap-3"
        :class="message.role === 'user' ? 'justify-end' : 'justify-start'"
      >
        <!-- AI Avatar -->
        <div
          v-if="message.role === 'ai'"
          class="w-10 h-10 flex-shrink-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-xl shadow-lg"
        >
          &#129504;
        </div>

        <!-- Message bubble -->
        <div
          class="max-w-[80%] px-4 py-3 rounded-2xl"
          :class="message.role === 'user'
            ? 'bg-indigo-600 text-white rounded-br-sm'
            : 'glass rounded-bl-sm'"
        >
          <p :class="message.role === 'user' ? 'text-white' : 'text-gray-700 dark:text-gray-300'">
            {{ message.content }}
          </p>
        </div>

        <!-- User Avatar -->
        <div
          v-if="message.role === 'user'"
          class="w-10 h-10 flex-shrink-0 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-xl"
        >
          &#128100;
        </div>
      </div>
    </div>

    <!-- Follow-up suggestions -->
    <div v-if="followUps.length" class="space-y-2">
      <p class="text-sm text-gray-500 dark:text-gray-400">Ask about:</p>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="(followUp, index) in followUps"
          :key="index"
          @click="$emit('ask', followUp)"
          class="px-4 py-2 text-sm bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors"
        >
          {{ followUp }}
        </button>
      </div>
    </div>

    <!-- Input area -->
    <div class="flex gap-2">
      <input
        v-model="inputText"
        type="text"
        placeholder="Ask a follow-up question..."
        @keyup.enter="handleSend"
        class="flex-1 px-4 py-3 bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 focus:outline-none transition-all"
      />
      <button
        @click="handleSend"
        :disabled="!inputText.trim() || isLoading"
        class="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        <span v-if="isLoading" class="inline-block animate-spin">&#8987;</span>
        <span v-else>&#10148;</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  messages: {
    type: Array,
    default: () => []
  },
  followUps: {
    type: Array,
    default: () => []
  },
  isLoading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['ask', 'send'])

const inputText = ref('')

const handleSend = () => {
  if (inputText.value.trim() && !props.isLoading) {
    emit('send', inputText.value)
    inputText.value = ''
  }
}
</script>
