<template>
  <div class="w-full max-w-md mx-auto">
    <!-- Success State -->
    <div v-if="submitted" class="text-center animate-on-enter">
      <div class="flex items-center justify-center gap-2 text-green-600 dark:text-green-400">
        <span class="text-xl">&#10004;</span>
        <span class="font-medium">Thanks! You're on the list.</span>
      </div>
    </div>

    <!-- Form -->
    <form
      v-else
      name="waitlist"
      method="POST"
      data-netlify="true"
      netlify-honeypot="bot-field"
      @submit.prevent="handleSubmit"
      class="flex flex-col sm:flex-row gap-3"
    >
      <!-- Hidden fields for Netlify -->
      <input type="hidden" name="form-name" value="waitlist" />
      <p class="hidden">
        <label>
          Don't fill this out if you're human:
          <input name="bot-field" v-model="honeypot" />
        </label>
      </p>

      <!-- Email input -->
      <div class="flex-1 relative">
        <label for="email-capture" class="sr-only">Email address</label>
        <input
          id="email-capture"
          v-model="email"
          type="email"
          name="email"
          :placeholder="placeholder"
          required
          :disabled="isSubmitting"
          class="w-full px-4 py-3 rounded-xl glass border border-gray-200 dark:border-gray-700
                 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20
                 placeholder-gray-400 dark:placeholder-gray-500
                 disabled:opacity-50 disabled:cursor-not-allowed
                 transition-all"
        />
      </div>

      <!-- Submit button -->
      <button
        type="submit"
        :disabled="isSubmitting || !email"
        class="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold
               rounded-xl hover:from-indigo-700 hover:to-purple-700
               disabled:opacity-50 disabled:cursor-not-allowed
               transition-all shadow-lg hover:shadow-xl
               flex items-center justify-center gap-2 min-w-[140px]"
      >
        <span v-if="isSubmitting" class="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full"></span>
        <span>{{ isSubmitting ? 'Joining...' : buttonText }}</span>
      </button>
    </form>

    <!-- Error state -->
    <p v-if="error" class="mt-2 text-sm text-red-600 dark:text-red-400 text-center">
      {{ error }}
    </p>

    <!-- Privacy note -->
    <p v-if="showPrivacyNote && !submitted" class="mt-3 text-xs text-gray-500 dark:text-gray-400 text-center">
      No spam, ever. Unsubscribe anytime.
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { trackEmailSignup } from '@/utils/analytics'

const props = defineProps({
  placeholder: {
    type: String,
    default: 'Enter your email for updates'
  },
  buttonText: {
    type: String,
    default: 'Subscribe'
  },
  showPrivacyNote: {
    type: Boolean,
    default: true
  },
  location: {
    type: String,
    default: 'landing'
  }
})

const email = ref('')
const honeypot = ref('')
const isSubmitting = ref(false)
const submitted = ref(false)
const error = ref(null)

const handleSubmit = async () => {
  // Honeypot check
  if (honeypot.value) {
    submitted.value = true
    return
  }

  isSubmitting.value = true
  error.value = null

  try {
    // Submit to Netlify Forms
    const formData = new FormData()
    formData.append('form-name', 'waitlist')
    formData.append('email', email.value)

    const response = await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(formData).toString()
    })

    if (response.ok) {
      submitted.value = true
      trackEmailSignup(props.location)
    } else {
      throw new Error('Form submission failed')
    }
  } catch (err) {
    console.error('Email signup error:', err)
    error.value = 'Something went wrong. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}
</script>
