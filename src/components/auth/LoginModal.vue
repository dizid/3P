<script setup>
import { ref, watch } from 'vue'
import { useAuthStore } from '@/stores/AuthStore'

const props = defineProps({
  show: { type: Boolean, default: false },
  message: { type: String, default: '' }
})

const emit = defineEmits(['close', 'authenticated'])

const authStore = useAuthStore()
const emailInput = ref('')

async function handleSubmitEmail() {
  if (!emailInput.value || !emailInput.value.includes('@')) return
  const result = await authStore.sendMagicLink(emailInput.value)
  if (!result.success) {
    // Error is shown via authStore.authError
  }
}

async function handleClose() {
  authStore.resetMagicLink()
  emailInput.value = ''
  emit('close')
}

// Watch for successful auth
watch(() => authStore.isAuthenticated, (isAuth) => {
  if (isAuth) {
    emit('authenticated')
    handleClose()
  }
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="handleClose"></div>

        <!-- Modal -->
        <div class="relative w-full max-w-md glass rounded-2xl p-8 shadow-2xl">
          <!-- Close button -->
          <button
            @click="handleClose"
            class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <!-- Email input step -->
          <div v-if="!authStore.magicLinkSent">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Log in to 3PS</h2>
            <p class="text-gray-600 dark:text-gray-400 mb-1">
              {{ message || 'Enter your email to get a magic login link.' }}
            </p>
            <p class="text-sm text-gray-500 dark:text-gray-500 mb-6">No password needed — we\'ll email you a link.</p>

            <form @submit.prevent="handleSubmitEmail">
              <input
                v-model="emailInput"
                type="email"
                placeholder="you@example.com"
                required
                class="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                :disabled="authStore.isLoading"
                autofocus
              />

              <p v-if="authStore.authError" class="mt-2 text-sm text-red-600 dark:text-red-400">
                {{ authStore.authError }}
              </p>

              <button
                type="submit"
                :disabled="authStore.isLoading || !emailInput.includes('@')"
                class="w-full mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-xl transition-colors"
              >
                <span v-if="authStore.isLoading" class="flex items-center justify-center gap-2">
                  <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </span>
                <span v-else>Send Login Link</span>
              </button>
            </form>
          </div>

          <!-- Magic link sent step -->
          <div v-else class="text-center">
            <div class="text-5xl mb-4">&#9993;&#65039;</div>
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Check your email</h2>
            <p class="text-gray-600 dark:text-gray-400 mb-2">
              We sent a login link to
            </p>
            <p class="font-semibold text-gray-900 dark:text-white mb-6">{{ authStore.magicLinkEmail }}</p>
            <p class="text-sm text-gray-500 dark:text-gray-500 mb-6">
              Click the link in the email to log in. The link expires in 15 minutes.
            </p>

            <button
              @click="authStore.resetMagicLink()"
              class="text-blue-600 dark:text-blue-400 hover:underline text-sm"
            >
              Use a different email
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
