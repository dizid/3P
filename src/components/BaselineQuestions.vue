<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
    <div class="max-w-4xl mx-auto">

      <!-- Progress Indicator -->
      <div class="mb-8">
        <div class="flex items-center justify-center gap-4">
          <div class="flex items-center">
            <div class="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
            <span class="ml-3 font-semibold text-gray-700">Jouw Waarden</span>
          </div>
          <div class="w-16 h-1 bg-gray-300"></div>
          <div class="flex items-center opacity-50">
            <div class="w-10 h-10 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center font-bold">2</div>
            <span class="ml-3 font-semibold text-gray-500">Project Waarden</span>
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
        <div class="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
          <h1 class="text-4xl font-bold mb-3">Welkom bij De 3 P's</h1>
          <p class="text-lg opacity-90 leading-relaxed">
            Dit tooltje helpt je beslissen of een project bij jou past. Begin met aan te geven
            hoe belangrijk elk van de 3 P's voor jou persoonlijk is.
          </p>
        </div>

        <!-- Form Content -->
        <div class="p-8">
          <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">
            Hoe belangrijk zijn deze waarden voor jou?
          </h2>
          <p class="text-center text-gray-600 mb-8">
            Schuif de sliders naar rechts voor hogere belangrijkheid (1 = niet belangrijk, 100 = zeer belangrijk)
          </p>

          <FormKit type="form" @submit="handleSubmit" submit-label="Verder naar Project Waarden →">

            <!-- Poen -->
            <div class="mb-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-2xl">💰</div>
                <div class="flex-1">
                  <h3 class="text-xl font-bold text-gray-800">Poen (Geld)</h3>
                  <p class="text-sm text-gray-600">Financiële beloning, inkomen, geld verdienen</p>
                </div>
                <div class="text-3xl font-bold text-green-700">{{ answerStore.baselinepoen }}</div>
              </div>
              <FormKit
                name="werk"
                v-model="answerStore.baselinepoen"
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
                  <p class="text-sm text-gray-600">Plezier hebben, leuk werk, zingevend bezig zijn</p>
                </div>
                <div class="text-3xl font-bold text-blue-700">{{ answerStore.baselinepret }}</div>
              </div>
              <FormKit
                name="sociaal"
                v-model="answerStore.baselinepret"
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
                  <p class="text-sm text-gray-600">Erkenning, aanzien, professionele status</p>
                </div>
                <div class="text-3xl font-bold text-purple-700">{{ answerStore.baselineprestige }}</div>
              </div>
              <FormKit
                name="relatie"
                v-model="answerStore.baselineprestige"
                type="range"
                label=""
                min="1"
                max="100"
              />
            </div>

            <!-- Project Name -->
            <div class="mb-8 p-6 bg-gray-50 rounded-xl border-2 border-gray-200">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center text-2xl">📋</div>
                <div>
                  <h3 class="text-xl font-bold text-gray-800">Project Naam</h3>
                  <p class="text-sm text-gray-600">Welk project wil je beoordelen?</p>
                </div>
              </div>
              <FormKit
                name="project"
                v-model="answerStore.project"
                type="text"
                label=""
                placeholder="Bijvoorbeeld: Nieuwe website bouwen, Cursus volgen, Carrièreswitch maken..."
                validation="required"
                :validation-messages="{
                  required: 'Vul een projectnaam in om verder te gaan'
                }"
              />
            </div>

          </FormKit>
        </div>
      </div>

      <!-- Info Box -->
      <div class="mt-6 bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
        <p class="text-sm text-gray-700">
          💡 <strong>Tip:</strong> Wees eerlijk tegen jezelf. Er zijn geen goede of foute antwoorden -
          dit gaat om jouw persoonlijke waarden en prioriteiten in het leven.
        </p>
      </div>

    </div>
  </div>
</template>

<script setup>
// Imports
import { usePStore } from '@/stores/PStore'
import { useRouter } from 'vue-router'

// Connection with the Pinia store
const answerStore = usePStore()
const router = useRouter()

// After submitting the form - use the router
const handleSubmit = () => {
  router.push('project')
}
</script>

<style>
  [data-type="submit"] .formkit-input {
    display: inline-block;
    outline: 0;
    border: 0;
    cursor: pointer;
    background: linear-gradient(to right, #3B82F6, #8B5CF6);
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
    box-shadow: 0 6px 12px rgba(59, 130, 246, 0.3);
  }

  [data-type="range"] .formkit-inner {
    max-width: 100%;
  }
</style>