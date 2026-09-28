<template>
  <div class="min-h-screen py-8 px-4">
    <div class="max-w-5xl mx-auto">

      <!-- Header -->
      <div class="glass-card overflow-hidden mb-8 animate-on-enter">
        <div class="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white text-center">
          <h1 class="text-4xl sm:text-5xl font-bold mb-3">About The 3 P's</h1>
          <p class="text-xl opacity-90">A framework for better project decisions</p>
        </div>

        <!-- Introduction -->
        <div class="p-8 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">What are The 3 P's?</h2>
          <p class="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            The 3 P's is a simple but powerful framework for deciding whether or not to take on
            a project. It helps you make deliberate choices based on what truly matters to you
            in your life and career.
          </p>
          <p class="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            The framework is built on three fundamental motivations that drive people:
            <strong>Pay</strong> (money), <strong>Play</strong> (fun), and <strong>Prestige</strong> (status).
            It started as a Dutch rule of thumb: <em>Poen, Pret &amp; Prestige</em>.
          </p>
        </div>

        <!-- The 3 P's Explained -->
        <div class="p-8 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-slate-800/50">
          <h2 class="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">The three P's explained</h2>
          <div class="grid md:grid-cols-3 gap-6">

            <!-- Pay -->
            <div class="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border-2 border-green-200 dark:border-green-700">
              <div class="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-4xl mb-4 mx-auto">&#128176;</div>
              <h3 class="text-2xl font-bold text-gray-800 dark:text-gray-100 text-center mb-3">Pay</h3>
              <p class="text-gray-700 dark:text-gray-300 leading-relaxed text-center mb-4">Money & Finances</p>
              <ul class="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <li>&#8226; Income and salary</li>
                <li>&#8226; Financial security</li>
                <li>&#8226; Earning potential</li>
                <li>&#8226; Economic value</li>
              </ul>
            </div>

            <!-- Play -->
            <div class="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border-2 border-blue-200 dark:border-blue-700">
              <div class="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-4xl mb-4 mx-auto">&#127881;</div>
              <h3 class="text-2xl font-bold text-gray-800 dark:text-gray-100 text-center mb-3">Play</h3>
              <p class="text-gray-700 dark:text-gray-300 leading-relaxed text-center mb-4">Fun & Meaning</p>
              <ul class="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <li>&#8226; Enjoyable, engaging work</li>
                <li>&#8226; Personal fulfilment</li>
                <li>&#8226; Purpose and passion</li>
                <li>&#8226; Work-life balance</li>
              </ul>
            </div>

            <!-- Prestige -->
            <div class="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border-2 border-purple-200 dark:border-purple-700">
              <div class="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center text-4xl mb-4 mx-auto">&#128081;</div>
              <h3 class="text-2xl font-bold text-gray-800 dark:text-gray-100 text-center mb-3">Prestige</h3>
              <p class="text-gray-700 dark:text-gray-300 leading-relaxed text-center mb-4">Status & Recognition</p>
              <ul class="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <li>&#8226; Professional reputation</li>
                <li>&#8226; Social recognition</li>
                <li>&#8226; Career progression</li>
                <li>&#8226; Influence and impact</li>
              </ul>
            </div>

          </div>
        </div>

        <!-- How It Works -->
        <div class="p-8 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">How does it work?</h2>
          <div class="space-y-6">

            <div class="flex gap-4">
              <div class="flex-shrink-0">
                <div class="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl">1</div>
              </div>
              <div>
                <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">Define your personal values</h3>
                <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Rate how important each of the 3 P's is to you in your life and career.
                  This becomes your personal frame of reference.
                </p>
              </div>
            </div>

            <div class="flex gap-4">
              <div class="flex-shrink-0">
                <div class="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-xl">2</div>
              </div>
              <div>
                <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">Rate the project</h3>
                <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Estimate how much the project delivers on each of the 3 P's. Be realistic
                  and compare with past experiences.
                </p>
              </div>
            </div>

            <div class="flex gap-4">
              <div class="flex-shrink-0">
                <div class="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-xl">3</div>
              </div>
              <div>
                <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">Get your advice</h3>
                <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
                  The tool calculates a match score based on your values and what the
                  project offers. A high score means a good match!
                </p>
              </div>
            </div>

          </div>
        </div>

        <!-- Formula Explanation -->
        <div class="p-8 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-slate-800/50">
          <h2 class="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">The calculation</h2>
          <p class="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            The total score is calculated by multiplying your personal value for each P
            by the project value, then adding the three together:
          </p>
          <div class="glass rounded-lg p-6 border-2 border-gray-200 dark:border-gray-600 font-mono text-center text-base sm:text-lg text-gray-800 dark:text-gray-100 mb-4">
            Score = (Your Pay &#215; Project Pay) + (Your Play &#215; Project Play) + (Your Prestige &#215; Project Prestige)
          </div>
          <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
            A score above <strong class="text-green-600 dark:text-green-400">6,000</strong> means the project
            fits your values well. A lower score suggests you may want to reconsider
            or adjust the project.
          </p>
        </div>

        <!-- Tips -->
        <div class="p-8 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">Tips for use</h2>
          <div class="grid md:grid-cols-2 gap-6">

            <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-700">
              <h3 class="font-bold text-gray-800 dark:text-gray-100 mb-2">&#128161; Be honest</h3>
              <p class="text-sm text-gray-700 dark:text-gray-300">
                There are no right or wrong answers. It's about your personal
                values and priorities.
              </p>
            </div>

            <div class="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6 border border-purple-200 dark:border-purple-700">
              <h3 class="font-bold text-gray-800 dark:text-gray-100 mb-2">&#127919; Be realistic</h3>
              <p class="text-sm text-gray-700 dark:text-gray-300">
                Make an honest estimate of what the project will actually
                deliver, not what you hope it will deliver.
              </p>
            </div>

            <div class="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 border border-green-200 dark:border-green-700">
              <h3 class="font-bold text-gray-800 dark:text-gray-100 mb-2">&#128202; Compare projects</h3>
              <p class="text-sm text-gray-700 dark:text-gray-300">
                Use the framework to compare several projects side by side
                and make better choices.
              </p>
            </div>

            <div class="bg-pink-50 dark:bg-pink-900/20 rounded-lg p-6 border border-pink-200 dark:border-pink-700">
              <h3 class="font-bold text-gray-800 dark:text-gray-100 mb-2">&#128260; Update your values</h3>
              <p class="text-sm text-gray-700 dark:text-gray-300">
                Your personal values can change over time. Review them
                regularly for accurate results.
              </p>
            </div>

          </div>
        </div>

        <!-- CTA -->
        <div class="p-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center">
          <h2 class="text-3xl font-bold mb-4">Ready to start?</h2>
          <p class="text-lg opacity-90 mb-6">
            Use The 3 P's to evaluate your next project and make better decisions!
          </p>
          <RouterLink
            to="/"
            class="inline-block bg-white text-blue-600 font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
          >
            Start Now &#8594;
          </RouterLink>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
// Composition API — no setup needed
</script>
