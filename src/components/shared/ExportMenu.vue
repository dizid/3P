<template>
  <div class="relative">
    <button
      @click="isOpen = !isOpen"
      class="flex items-center gap-2 px-4 py-2 rounded-xl font-medium bg-white/80 text-gray-700 hover:bg-blue-100 hover:text-blue-700 border border-gray-200 hover:border-blue-300 transition-all"
    >
      <span class="text-lg">&#128228;</span>
      Export
      <svg class="w-4 h-4 transition-transform" :class="{ 'rotate-180': isOpen }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <Transition name="dropdown">
      <div
        v-if="isOpen"
        class="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50"
      >
        <button
          @click="handleExport('markdown')"
          class="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <span class="text-lg">&#128203;</span>
          <div>
            <div class="font-medium">Copy as Markdown</div>
            <div class="text-xs text-gray-500">For docs & notes</div>
          </div>
        </button>

        <button
          @click="handleExport('text')"
          class="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-50 transition-colors border-t border-gray-100"
        >
          <span class="text-lg">&#128196;</span>
          <div>
            <div class="font-medium">Copy as Text</div>
            <div class="text-xs text-gray-500">Plain text format</div>
          </div>
        </button>

        <button
          @click="handleExport('pdf')"
          class="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-50 transition-colors border-t border-gray-100"
        >
          <span class="text-lg">&#128438;</span>
          <div>
            <div class="font-medium">Print / Save PDF</div>
            <div class="text-xs text-gray-500">Via print dialog</div>
          </div>
        </button>
      </div>
    </Transition>

    <!-- Toast notification -->
    <Transition name="toast">
      <div
        v-if="showToast"
        class="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 z-50"
      >
        <span>&#10003;</span> Copied to clipboard!
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useExport } from '@/composables/useExport'

const props = defineProps({
  decision: { type: Object, required: true }
})

const { exportAsMarkdown, exportAsText, exportAsPdf } = useExport()

const isOpen = ref(false)
const showToast = ref(false)

const handleExport = async (format) => {
  isOpen.value = false

  let success = false
  switch (format) {
    case 'markdown':
      success = await exportAsMarkdown(props.decision)
      break
    case 'text':
      success = await exportAsText(props.decision)
      break
    case 'pdf':
      exportAsPdf(props.decision)
      return // No toast for PDF
  }

  if (success) {
    showToast.value = true
    setTimeout(() => {
      showToast.value = false
    }, 2000)
  }
}

// Close dropdown when clicking outside
const handleClickOutside = (e) => {
  if (!e.target.closest('.relative')) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
