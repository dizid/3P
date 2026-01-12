<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-black/50 backdrop-blur-sm"
          @click="$emit('close')"
        ></div>

        <!-- Modal -->
        <div class="relative glass-card max-w-md w-full p-6 animate-on-enter">
          <h2 class="text-xl font-bold text-gray-800 mb-4">Track Outcome</h2>

          <p class="text-gray-600 mb-6">
            How did <span class="font-medium">"{{ decision?.decision }}"</span> work out?
          </p>

          <!-- Rating -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Rate the outcome (1-10)
            </label>
            <div class="flex items-center gap-2">
              <input
                v-model.number="rating"
                type="range"
                min="1"
                max="10"
                class="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                style="accent-color: #3b82f6"
              />
              <span class="text-2xl font-bold text-blue-600 w-8 text-center">{{ rating }}</span>
            </div>
            <div class="flex justify-between text-xs text-gray-500 mt-1">
              <span>Terrible</span>
              <span>Amazing</span>
            </div>
          </div>

          <!-- Notes -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Notes (optional)
            </label>
            <textarea
              v-model="notes"
              placeholder="What happened? Any lessons learned?"
              rows="3"
              class="w-full px-3 py-2 bg-white border-2 border-gray-200 rounded-lg text-gray-800 focus:border-blue-500 focus:outline-none resize-none"
            ></textarea>
          </div>

          <!-- Actions -->
          <div class="flex gap-3">
            <button
              @click="$emit('close')"
              class="flex-1 py-2 px-4 text-gray-700 font-medium border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="handleSave"
              class="flex-1 py-2 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Outcome
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  isOpen: { type: Boolean, default: false },
  decision: { type: Object, default: null }
})

const emit = defineEmits(['close', 'save'])

const rating = ref(5)
const notes = ref('')

watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    rating.value = 5
    notes.value = ''
  }
})

const handleSave = () => {
  emit('save', {
    rating: rating.value,
    notes: notes.value
  })
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .glass-card {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-enter-from .glass-card {
  transform: scale(0.95);
  opacity: 0;
}
</style>
