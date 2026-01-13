<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  decisionId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    default: 'My Decision'
  },
  score: {
    type: Number,
    default: null
  }
})

const isSharing = ref(false)
const shareUrl = ref(null)
const showDropdown = ref(false)
const copied = ref(false)

const API_BASE = import.meta.env.DEV ? 'http://localhost:8888' : ''

const shareDecision = async () => {
  if (isSharing.value) return

  isSharing.value = true

  try {
    const response = await fetch(`${API_BASE}/api/share-decision`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ decisionId: props.decisionId })
    })

    if (!response.ok) {
      throw new Error('Failed to share')
    }

    const data = await response.json()
    shareUrl.value = `${window.location.origin}/shared/${data.token}`
    showDropdown.value = true
  } catch (error) {
    console.error('Share error:', error)
    alert('Failed to create share link. Please try again.')
  } finally {
    isSharing.value = false
  }
}

const copyLink = async () => {
  if (!shareUrl.value) return

  try {
    await navigator.clipboard.writeText(shareUrl.value)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (error) {
    // Fallback for older browsers
    const textarea = document.createElement('textarea')
    textarea.value = shareUrl.value
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  }
}

const shareTwitter = () => {
  const text = `I just made a decision using De 3 P's!${props.score ? ` Score: ${props.score}/100` : ''}`
  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl.value)}`
  window.open(url, '_blank', 'width=550,height=420')
}

const shareLinkedIn = () => {
  const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl.value)}`
  window.open(url, '_blank', 'width=550,height=420')
}

const closeDropdown = () => {
  showDropdown.value = false
}
</script>

<template>
  <div class="relative">
    <!-- Share button -->
    <button
      @click="shareDecision"
      :disabled="isSharing"
      class="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
      :aria-label="isSharing ? 'Creating share link...' : 'Share decision'"
    >
      <svg
        v-if="!isSharing"
        class="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
        />
      </svg>
      <div v-else class="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
      <span>Share</span>
    </button>

    <!-- Share dropdown -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="showDropdown && shareUrl"
        class="absolute top-full mt-2 right-0 w-72 glass-card p-4 z-50 shadow-xl"
      >
        <!-- Close button -->
        <button
          @click="closeDropdown"
          class="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          aria-label="Close"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h4 class="font-semibold text-gray-800 dark:text-gray-100 mb-3">Share Decision</h4>

        <!-- Copy link -->
        <div class="flex gap-2 mb-4">
          <input
            :value="shareUrl"
            readonly
            class="flex-1 px-3 py-2 text-sm bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-300"
          />
          <button
            @click="copyLink"
            class="px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            :aria-label="copied ? 'Copied!' : 'Copy link'"
          >
            <span v-if="copied">&#10003;</span>
            <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
            </svg>
          </button>
        </div>

        <!-- Social share buttons -->
        <div class="flex gap-2">
          <button
            @click="shareTwitter"
            class="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#1DA1F2] text-white rounded-lg hover:bg-[#1a8cd8] transition-colors"
            aria-label="Share on Twitter"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            <span class="text-sm">Twitter</span>
          </button>
          <button
            @click="shareLinkedIn"
            class="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#0A66C2] text-white rounded-lg hover:bg-[#004182] transition-colors"
            aria-label="Share on LinkedIn"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            <span class="text-sm">LinkedIn</span>
          </button>
        </div>
      </div>
    </Transition>

    <!-- Backdrop -->
    <div
      v-if="showDropdown"
      class="fixed inset-0 z-40"
      @click="closeDropdown"
    ></div>
  </div>
</template>
