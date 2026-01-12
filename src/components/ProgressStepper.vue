<template>
  <div class="mb-10">
    <div class="flex items-center justify-center gap-2 sm:gap-4">
      <!-- Step 1 -->
      <div class="flex items-center">
        <div
          :class="[
            'w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-500',
            currentStep >= 1
              ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30'
              : 'bg-gray-200 text-gray-500'
          ]"
        >
          <Transition name="scale-fade" mode="out-in">
            <span v-if="currentStep > 1" key="check" class="text-xl">&#10003;</span>
            <span v-else key="num">1</span>
          </Transition>
        </div>
        <span
          :class="[
            'ml-2 sm:ml-3 font-semibold transition-all duration-300 hidden sm:block text-sm',
            currentStep >= 1 ? 'text-gray-800' : 'text-gray-400'
          ]"
        >
          Jouw Waarden
        </span>
      </div>

      <!-- Connector Line 1-2 -->
      <div class="relative w-8 sm:w-16 h-1 bg-gray-200 rounded-full overflow-hidden">
        <div
          :class="[
            'absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-700 ease-out'
          ]"
          :style="{ width: currentStep >= 2 ? '100%' : '0%' }"
        ></div>
      </div>

      <!-- Step 2 -->
      <div class="flex items-center">
        <div
          :class="[
            'w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-500',
            currentStep >= 2
              ? 'bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/30'
              : 'bg-gray-200 text-gray-500'
          ]"
        >
          <Transition name="scale-fade" mode="out-in">
            <span v-if="currentStep > 2" key="check" class="text-xl">&#10003;</span>
            <span v-else key="num">2</span>
          </Transition>
        </div>
        <span
          :class="[
            'ml-2 sm:ml-3 font-semibold transition-all duration-300 hidden sm:block text-sm',
            currentStep >= 2 ? 'text-gray-800' : 'text-gray-400'
          ]"
        >
          Project Waarden
        </span>
      </div>

      <!-- Connector Line 2-3 -->
      <div class="relative w-8 sm:w-16 h-1 bg-gray-200 rounded-full overflow-hidden">
        <div
          :class="[
            'absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 to-emerald-500 rounded-full transition-all duration-700 ease-out'
          ]"
          :style="{ width: currentStep >= 3 ? '100%' : '0%' }"
        ></div>
      </div>

      <!-- Step 3 -->
      <div class="flex items-center">
        <div
          :class="[
            'w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-500',
            currentStep >= 3
              ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30'
              : 'bg-gray-200 text-gray-500'
          ]"
        >
          <span v-if="currentStep >= 3" class="text-xl animate-bounce-subtle">&#127881;</span>
          <span v-else>3</span>
        </div>
        <span
          :class="[
            'ml-2 sm:ml-3 font-semibold transition-all duration-300 hidden sm:block text-sm',
            currentStep >= 3 ? 'text-gray-800' : 'text-gray-400'
          ]"
        >
          Resultaat
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  currentStep: {
    type: Number,
    required: true,
    validator: (value) => value >= 1 && value <= 3
  }
})
</script>
