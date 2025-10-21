<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
    <div class="max-w-4xl mx-auto">

      <!-- Progress Indicator -->
      <div class="mb-8">
        <div class="flex items-center justify-center gap-4">
          <div class="flex items-center opacity-50">
            <div class="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">✓</div>
            <span class="ml-3 font-semibold text-gray-500">Jouw Waarden</span>
          </div>
          <div class="w-16 h-1 bg-blue-600"></div>
          <div class="flex items-center">
            <div class="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
            <span class="ml-3 font-semibold text-gray-700">Project Waarden</span>
          </div>
          <div class="w-16 h-1 bg-gray-300"></div>
          <div class="flex items-center opacity-50">
            <div class="w-10 h-10 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center font-bold">3</div>
            <span class="ml-3 font-semibold text-gray-500">Resultaat</span>
          </div>
        </div>
      </div>

      <!-- Main Card -->
      <div class="bg-white rounded-2xl shadow-2xl overflow-hidden">

        <!-- Header -->
        <div class="bg-gradient-to-r from-purple-600 to-pink-600 p-8 text-white">
          <h1 class="text-4xl font-bold mb-3">Project: "{{ answerStore.project }}"</h1>
          <p class="text-lg opacity-90 leading-relaxed">
            Nu gaan we kijken hoeveel elk van de 3 P's dit specifieke project oplevert.
            Wees realistisch in je inschatting.
          </p>
        </div>

        <!-- Form Content -->
        <div class="p-8">
          <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">
            Hoeveel levert dit project op?
          </h2>
          <p class="text-center text-gray-600 mb-8">
            Schuif de sliders naar rechts voor hogere opbrengst (1 = niets, 100 = zeer veel)
          </p>

          <FormKit type="form" @submit="handleSubmit" submit-label="Bekijk Mijn Resultaat →">

            <!-- Poen -->
            <div class="mb-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-2xl">💰</div>
                <div class="flex-1">
                  <h3 class="text-xl font-bold text-gray-800">Poen (Geld)</h3>
                  <p class="text-sm text-gray-600">Hoeveel financiële opbrengst verwacht je?</p>
                </div>
                <div class="text-3xl font-bold text-green-700">{{ answerStore.projectpoen }}</div>
              </div>
              <FormKit
                name="werk"
                v-model="answerStore.projectpoen"
                type="range"
                label=""
                min="1"
                max="100"
              />
            </div>

            <!-- Pret -->
            <div class="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-2xl">🎉</div>
                <div class="flex-1">
                  <h3 class="text-xl font-bold text-gray-800">Pret (Plezier)</h3>
                  <p class="text-sm text-gray-600">Hoe leuk/zinvol zal dit project zijn?</p>
                </div>
                <div class="text-3xl font-bold text-blue-700">{{ answerStore.projectpret }}</div>
              </div>
              <FormKit
                name="sociaal"
                v-model="answerStore.projectpret"
                type="range"
                label=""
                min="1"
                max="100"
              />
            </div>

            <!-- Prestige -->
            <div class="mb-8 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-2xl">👑</div>
                <div class="flex-1">
                  <h3 class="text-xl font-bold text-gray-800">Prestige (Status)</h3>
                  <p class="text-sm text-gray-600">Hoeveel erkenning/aanzien levert dit op?</p>
                </div>
                <div class="text-3xl font-bold text-purple-700">{{ answerStore.projectprestige }}</div>
              </div>
              <FormKit
                name="relatie"
                v-model="answerStore.projectprestige"
                type="range"
                label=""
                min="1"
                max="100"
              />
            </div>

          </FormKit>

          <!-- Back Button -->
          <div class="mt-6 text-center">
            <button
              @click="back"
              class="inline-flex items-center px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-xl border-2 border-gray-300 shadow-md transition-all duration-200 hover:shadow-lg"
            >
              ← Terug naar Jouw Waarden
            </button>
          </div>
        </div>
      </div>

      <!-- Info Box -->
      <div class="mt-6 bg-purple-50 border-l-4 border-purple-500 p-6 rounded-lg">
        <p class="text-sm text-gray-700">
          💡 <strong>Tip:</strong> Probeer een realistische inschatting te maken. Vergelijk dit project
          met andere projecten die je gedaan hebt om een beter beeld te krijgen.
        </p>
      </div>

    </div>
  </div>
</template>

<script setup>
import { usePStore } from '@/stores/PStore'
import { useRouter } from 'vue-router'

// Connection with the Pinia store
const answerStore = usePStore()
const router = useRouter()

// After submitting the form - use the router
const handleSubmit = () => {
  router.push('resultaat')
}
const back = () => { router.push('/') }
</script>

<style>
  [data-type="submit"] .formkit-input {
    display: inline-block;
    outline: 0;
    border: 0;
    cursor: pointer;
    background: linear-gradient(to right, #8B5CF6, #EC4899);
    border-radius: 12px;
    padding: 16px 32px;
    font-size: 18px;
    font-weight: 700;
    color: white;
    line-height: 26px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: all 0.2s;
  }

  [data-type="submit"] .formkit-input:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(139, 92, 246, 0.3);
  }

  [data-type="range"] .formkit-inner {
    max-width: 100%;
  }
</style>