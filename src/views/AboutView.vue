<template>
  <div class="min-h-screen py-8 px-4">
    <div class="max-w-5xl mx-auto">

      <!-- Header -->
      <div class="glass-card overflow-hidden mb-8 animate-on-enter">
        <div class="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white text-center">
          <h1 class="text-4xl sm:text-5xl font-bold mb-3">Over De 3 P's</h1>
          <p class="text-xl opacity-90">Een framework voor betere project-beslissingen</p>
        </div>

        <!-- Introduction -->
        <div class="p-8 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">Wat zijn De 3 P's?</h2>
          <p class="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            De 3 P's is een eenvoudig maar krachtig framework om te beslissen of je een project
            wel of niet moet aangaan. Het helpt je om bewuste keuzes te maken op basis van wat
            jij echt belangrijk vindt in je leven en carrière.
          </p>
          <p class="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            Het framework is gebaseerd op drie fundamentele motivaties die mensen drijven:
            <strong>Poen</strong> (geld), <strong>Pret</strong> (plezier), en <strong>Prestige</strong> (status).
          </p>
        </div>

        <!-- The 3 P's Explained -->
        <div class="p-8 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-slate-800/50">
          <h2 class="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">De drie P's uitgelegd</h2>
          <div class="grid md:grid-cols-3 gap-6">

            <!-- Poen -->
            <div class="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border-2 border-green-200 dark:border-green-700">
              <div class="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-4xl mb-4 mx-auto">&#128176;</div>
              <h3 class="text-2xl font-bold text-gray-800 dark:text-gray-100 text-center mb-3">Poen</h3>
              <p class="text-gray-700 dark:text-gray-300 leading-relaxed text-center mb-4">Geld & Financiën</p>
              <ul class="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <li>&#8226; Inkomen en salaris</li>
                <li>&#8226; Financiële zekerheid</li>
                <li>&#8226; Verdienpotentieel</li>
                <li>&#8226; Economische waarde</li>
              </ul>
            </div>

            <!-- Pret -->
            <div class="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border-2 border-blue-200 dark:border-blue-700">
              <div class="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-4xl mb-4 mx-auto">&#127881;</div>
              <h3 class="text-2xl font-bold text-gray-800 dark:text-gray-100 text-center mb-3">Pret</h3>
              <p class="text-gray-700 dark:text-gray-300 leading-relaxed text-center mb-4">Plezier & Zingeving</p>
              <ul class="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <li>&#8226; Leuk en boeiend werk</li>
                <li>&#8226; Persoonlijke voldoening</li>
                <li>&#8226; Zingeving en passie</li>
                <li>&#8226; Werk-privé balans</li>
              </ul>
            </div>

            <!-- Prestige -->
            <div class="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border-2 border-purple-200 dark:border-purple-700">
              <div class="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center text-4xl mb-4 mx-auto">&#128081;</div>
              <h3 class="text-2xl font-bold text-gray-800 dark:text-gray-100 text-center mb-3">Prestige</h3>
              <p class="text-gray-700 dark:text-gray-300 leading-relaxed text-center mb-4">Status & Erkenning</p>
              <ul class="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <li>&#8226; Professionele reputatie</li>
                <li>&#8226; Sociale erkenning</li>
                <li>&#8226; Carrière vooruitgang</li>
                <li>&#8226; Invloed en impact</li>
              </ul>
            </div>

          </div>
        </div>

        <!-- How It Works -->
        <div class="p-8 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">Hoe werkt het?</h2>
          <div class="space-y-6">

            <div class="flex gap-4">
              <div class="flex-shrink-0">
                <div class="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl">1</div>
              </div>
              <div>
                <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">Bepaal jouw persoonlijke waarden</h3>
                <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Geef aan hoe belangrijk elk van de 3 P's voor jou is in je leven en carrière.
                  Dit vormt jouw persoonlijke referentiekader.
                </p>
              </div>
            </div>

            <div class="flex gap-4">
              <div class="flex-shrink-0">
                <div class="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-xl">2</div>
              </div>
              <div>
                <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">Beoordeel het project</h3>
                <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Schat in hoeveel elk van de 3 P's het project oplevert. Wees realistisch
                  en vergelijk met eerdere ervaringen.
                </p>
              </div>
            </div>

            <div class="flex gap-4">
              <div class="flex-shrink-0">
                <div class="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-xl">3</div>
              </div>
              <div>
                <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">Krijg je advies</h3>
                <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Het systeem berekent een match-score op basis van jouw waarden en wat het
                  project biedt. Een hoge score betekent een goede match!
                </p>
              </div>
            </div>

          </div>
        </div>

        <!-- Formula Explanation -->
        <div class="p-8 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-slate-800/50">
          <h2 class="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">De berekening</h2>
          <p class="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            De totale score wordt berekend door voor elke P jouw persoonlijke waarde te vermenigvuldigen
            met de project waarde, en deze vervolgens bij elkaar op te tellen:
          </p>
          <div class="glass rounded-lg p-6 border-2 border-gray-200 dark:border-gray-600 font-mono text-center text-base sm:text-lg text-gray-800 dark:text-gray-100 mb-4">
            Score = (Jouw Poen &#215; Project Poen) + (Jouw Pret &#215; Project Pret) + (Jouw Prestige &#215; Project Prestige)
          </div>
          <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
            Een score boven de <strong class="text-green-600 dark:text-green-400">6.000</strong> betekent dat het project
            goed aansluit bij jouw waarden. Een score daaronder suggereert dat je het project
            mogelijk moet heroverwegen of aanpassen.
          </p>
        </div>

        <!-- Tips -->
        <div class="p-8 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">Tips voor gebruik</h2>
          <div class="grid md:grid-cols-2 gap-6">

            <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-700">
              <h3 class="font-bold text-gray-800 dark:text-gray-100 mb-2">&#128161; Wees eerlijk</h3>
              <p class="text-sm text-gray-700 dark:text-gray-300">
                Er zijn geen goede of foute antwoorden. Het gaat om jouw persoonlijke
                waarden en prioriteiten.
              </p>
            </div>

            <div class="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6 border border-purple-200 dark:border-purple-700">
              <h3 class="font-bold text-gray-800 dark:text-gray-100 mb-2">&#127919; Wees realistisch</h3>
              <p class="text-sm text-gray-700 dark:text-gray-300">
                Probeer een eerlijke inschatting te maken van wat het project werkelijk
                oplevert, niet wat je hoopt dat het oplevert.
              </p>
            </div>

            <div class="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 border border-green-200 dark:border-green-700">
              <h3 class="font-bold text-gray-800 dark:text-gray-100 mb-2">&#128202; Vergelijk projecten</h3>
              <p class="text-sm text-gray-700 dark:text-gray-300">
                Gebruik het framework om meerdere projecten met elkaar te vergelijken
                en betere keuzes te maken.
              </p>
            </div>

            <div class="bg-pink-50 dark:bg-pink-900/20 rounded-lg p-6 border border-pink-200 dark:border-pink-700">
              <h3 class="font-bold text-gray-800 dark:text-gray-100 mb-2">&#128260; Update je waarden</h3>
              <p class="text-sm text-gray-700 dark:text-gray-300">
                Je persoonlijke waarden kunnen veranderen over tijd. Herzie ze
                regelmatig voor accurate resultaten.
              </p>
            </div>

          </div>
        </div>

        <!-- CTA -->
        <div class="p-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center">
          <h2 class="text-3xl font-bold mb-4">Klaar om te beginnen?</h2>
          <p class="text-lg opacity-90 mb-6">
            Gebruik De 3 P's om jouw volgende project te beoordelen en betere beslissingen te nemen!
          </p>
          <RouterLink
            to="/"
            class="inline-block bg-white text-blue-600 font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
          >
            Start Nu &#8594;
          </RouterLink>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
// Composition API — no setup needed
</script>
