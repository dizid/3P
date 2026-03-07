<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/AuthStore'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const status = ref('verifying') // verifying | success | error
const errorMessage = ref('')

onMounted(async () => {
  const token = route.query.token

  if (!token) {
    status.value = 'error'
    errorMessage.value = 'No login token found. Please request a new link.'
    return
  }

  const result = await authStore.verifyMagicLink(token)

  if (result.success) {
    status.value = 'success'
    // Redirect to tools after 1.5 seconds
    setTimeout(() => {
      router.push('/tools')
    }, 1500)
  } else {
    status.value = 'error'
    errorMessage.value = result.error || 'Verification failed. Please try again.'
  }
})
</script>

<template>
  <div class="min-h-[60vh] flex items-center justify-center p-4">
    <div class="glass rounded-2xl p-8 max-w-md w-full text-center">
      <!-- Verifying -->
      <div v-if="status === 'verifying'">
        <div class="text-5xl mb-4 animate-pulse">&#128274;</div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Verifying...</h2>
        <p class="text-gray-600 dark:text-gray-400">Hang on, we're logging you in.</p>
      </div>

      <!-- Success -->
      <div v-else-if="status === 'success'">
        <div class="text-5xl mb-4">&#9989;</div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">You're in!</h2>
        <p class="text-gray-600 dark:text-gray-400 mb-4">
          Welcome{{ authStore.userName !== 'User' ? ', ' + authStore.userName : '' }}. Redirecting to your tools...
        </p>
      </div>

      <!-- Error -->
      <div v-else>
        <div class="text-5xl mb-4">&#10060;</div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Link Invalid</h2>
        <p class="text-gray-600 dark:text-gray-400 mb-6">{{ errorMessage }}</p>
        <router-link
          to="/tools"
          class="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
        >
          Go to Tools
        </router-link>
      </div>
    </div>
  </div>
</template>
