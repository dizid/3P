<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
    <div class="max-w-4xl mx-auto">

      <!-- Main Result Card -->
      <div class="bg-white rounded-2xl shadow-2xl overflow-hidden mb-8 transform transition-all duration-300 hover:shadow-3xl">

        <!-- Header with recommendation -->
        <div :class="[
          'p-8 text-center border-b-4',
          isPositive ? 'bg-gradient-to-r from-green-500 to-emerald-600 border-green-700' : 'bg-gradient-to-r from-red-500 to-pink-600 border-red-700'
        ]">
          <div class="text-white">
            <h1 class="text-5xl font-bold mb-4">
              {{ isPositive ? '✓ Ga ervoor!' : '✗ Overweeg goed' }}
            </h1>
            <p class="text-xl opacity-90 leading-relaxed">
              Op basis van jouw levensvisie en de waarden voor project
              <span class="font-bold underline">"{{ store.project }}"</span>,
              is het advies om dit <span class="font-extrabold text-2xl">{{ Advice }}</span> te gaan doen.
            </p>
          </div>
        </div>

        <!-- Score Overview -->
        <div class="p-8 bg-gray-50">
          <div class="text-center mb-6">
            <div class="text-6xl font-bold text-gray-800 mb-2">{{ store.endScore.toLocaleString() }}</div>
            <div class="text-sm text-gray-600 uppercase tracking-wide">Totale Score</div>
            <div class="text-xs text-gray-500 mt-1">Drempelwaarde: 6.000</div>
          </div>

          <!-- Score Progress Bar -->
          <div class="relative pt-2">
            <div class="flex items-center justify-between mb-2">
              <div class="text-xs font-semibold text-gray-600">Score Indicator</div>
              <div class="text-xs font-semibold text-gray-600">{{ scorePercentage }}%</div>
            </div>
            <div class="overflow-hidden h-4 text-xs flex rounded-full bg-gray-200">
              <div
                :style="{ width: Math.min(scorePercentage, 100) + '%' }"
                :class="[
                  'shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-500',
                  isPositive ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-gradient-to-r from-red-400 to-pink-500'
                ]"
              ></div>
            </div>
            <div class="flex justify-between text-xs text-gray-500 mt-1">
              <span>0</span>
              <span class="font-bold">6.000</span>
              <span>30.000</span>
            </div>
          </div>
        </div>

        <!-- Individual P Breakdown -->
        <div class="p-8">
          <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">Breakdown per P</h2>

          <div class="space-y-6">
            <!-- Poen (Money) -->
            <div class="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-2xl">💰</div>
                  <div>
                    <h3 class="text-xl font-bold text-gray-800">Poen (Geld)</h3>
                    <p class="text-sm text-gray-600">Financiële waarde</p>
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-3xl font-bold text-green-700">{{ poenScore.toLocaleString() }}</div>
                  <div class="text-xs text-gray-600">{{ poenPercentage }}% van totaal</div>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div class="bg-white rounded-lg p-3">
                  <div class="text-gray-600">Jouw waarde</div>
                  <div class="text-2xl font-bold text-gray-800">{{ store.baselinepoen }}</div>
                </div>
                <div class="bg-white rounded-lg p-3">
                  <div class="text-gray-600">Project waarde</div>
                  <div class="text-2xl font-bold text-gray-800">{{ store.projectpoen }}</div>
                </div>
              </div>
              <div class="mt-3 h-2 bg-green-200 rounded-full overflow-hidden">
                <div
                  :style="{ width: (poenScore / 100) + '%' }"
                  class="h-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-500"
                ></div>
              </div>
            </div>

            <!-- Pret (Fun) -->
            <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-2xl">🎉</div>
                  <div>
                    <h3 class="text-xl font-bold text-gray-800">Pret (Plezier)</h3>
                    <p class="text-sm text-gray-600">Leuk & zinvol</p>
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-3xl font-bold text-blue-700">{{ pretScore.toLocaleString() }}</div>
                  <div class="text-xs text-gray-600">{{ pretPercentage }}% van totaal</div>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div class="bg-white rounded-lg p-3">
                  <div class="text-gray-600">Jouw waarde</div>
                  <div class="text-2xl font-bold text-gray-800">{{ store.baselinepret }}</div>
                </div>
                <div class="bg-white rounded-lg p-3">
                  <div class="text-gray-600">Project waarde</div>
                  <div class="text-2xl font-bold text-gray-800">{{ store.projectpret }}</div>
                </div>
              </div>
              <div class="mt-3 h-2 bg-blue-200 rounded-full overflow-hidden">
                <div
                  :style="{ width: (pretScore / 100) + '%' }"
                  class="h-full bg-gradient-to-r from-blue-400 to-indigo-500 transition-all duration-500"
                ></div>
              </div>
            </div>

            <!-- Prestige -->
            <div class="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-2xl">👑</div>
                  <div>
                    <h3 class="text-xl font-bold text-gray-800">Prestige (Status)</h3>
                    <p class="text-sm text-gray-600">Erkenning & aanzien</p>
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-3xl font-bold text-purple-700">{{ prestigeScore.toLocaleString() }}</div>
                  <div class="text-xs text-gray-600">{{ prestigePercentage }}% van totaal</div>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div class="bg-white rounded-lg p-3">
                  <div class="text-gray-600">Jouw waarde</div>
                  <div class="text-2xl font-bold text-gray-800">{{ store.baselineprestige }}</div>
                </div>
                <div class="bg-white rounded-lg p-3">
                  <div class="text-gray-600">Project waarde</div>
                  <div class="text-2xl font-bold text-gray-800">{{ store.projectprestige }}</div>
                </div>
              </div>
              <div class="mt-3 h-2 bg-purple-200 rounded-full overflow-hidden">
                <div
                  :style="{ width: (prestigeScore / 100) + '%' }"
                  class="h-full bg-gradient-to-r from-purple-400 to-pink-500 transition-all duration-500"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Advice Section -->
        <div class="p-8 bg-gray-50 border-t">
          <h2 class="text-2xl font-bold text-gray-800 mb-4">Wat betekent dit?</h2>
          <div class="prose prose-lg max-w-none text-gray-700">
            <p v-if="isPositive" class="leading-relaxed">
              Geweldig nieuws! Dit project sluit goed aan bij jouw persoonlijke waarden.
              De combinatie van wat jij belangrijk vindt en wat dit project biedt, geeft een
              sterke match. Ga vol vertrouwen door met dit project!
            </p>
            <p v-else class="leading-relaxed">
              Op basis van deze analyse lijkt dit project minder goed aan te sluiten bij wat
              jij belangrijk vindt. Dit betekent niet dat het project slecht is, maar dat het
              mogelijk niet het beste gebruik is van jouw tijd en energie. Overweeg of je de
              voorwaarden kunt aanpassen, of zoek naar projecten die beter bij je passen.
            </p>
          </div>
        </div>

      </div>

      <!-- Action Buttons -->
      <div class="flex flex-wrap gap-4 justify-center">
        <button
          @click="startOver"
          class="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 hover:shadow-xl"
        >
          🔄 Nieuw Project Beoordelen
        </button>
        <button
          @click="back"
          class="bg-white hover:bg-gray-50 text-gray-700 font-bold py-4 px-8 rounded-xl shadow-lg border-2 border-gray-300 transform transition-all duration-200 hover:scale-105 hover:shadow-xl"
        >
          ← Waarden Aanpassen
        </button>
        <button
          @click="goHome"
          class="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 hover:shadow-xl"
        >
          🏠 Opnieuw Beginnen
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { usePStore } from '@/stores/PStore'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const store = usePStore()
const router = useRouter()

// Navigation functions
const back = () => { router.push('/project') }
const startOver = () => { router.push('/project') }
const goHome = () => { router.push('/') }

// Main advice
const Advice = computed(() => {
  return store.endScore > 6000 ? "wel" : "niet"
})

const isPositive = computed(() => store.endScore > 6000)

// Individual P scores
const poenScore = computed(() => store.baselinepoen * store.projectpoen)
const pretScore = computed(() => store.baselinepret * store.projectpret)
const prestigeScore = computed(() => store.baselineprestige * store.projectprestige)

// Percentages of total score
const poenPercentage = computed(() =>
  store.endScore > 0 ? Math.round((poenScore.value / store.endScore) * 100) : 0
)
const pretPercentage = computed(() =>
  store.endScore > 0 ? Math.round((pretScore.value / store.endScore) * 100) : 0
)
const prestigePercentage = computed(() =>
  store.endScore > 0 ? Math.round((prestigeScore.value / store.endScore) * 100) : 0
)

// Score as percentage of maximum possible (30,000)
const scorePercentage = computed(() =>
  Math.round((store.endScore / 30000) * 100)
)
</script>
    
  