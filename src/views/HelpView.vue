<template>
  <div class="min-h-screen py-8 px-4">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-12 animate-on-enter">
        <h1 class="text-4xl sm:text-5xl font-bold mb-4">
          <span class="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            How to Use Decision Tools
          </span>
        </h1>
        <p class="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Learn when and how to use each tool to make better decisions in work, life, and everything in between.
        </p>
      </div>

      <!-- Decision Guide -->
      <DecisionGuide class="mb-12" />

      <!-- Tool Explanations -->
      <div class="space-y-6 mb-12">
        <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100 text-center mb-8">
          Tool Deep Dives
        </h2>

        <ToolExplanation
          v-for="tool in tools"
          :key="tool.id"
          :tool="tool"
          class="animate-on-enter"
        />
      </div>

      <!-- Tips Section -->
      <TipsSection />
    </div>
  </div>
</template>

<script setup>
import DecisionGuide from '@/components/help/DecisionGuide.vue'
import ToolExplanation from '@/components/help/ToolExplanation.vue'
import TipsSection from '@/components/help/TipsSection.vue'

const tools = [
  {
    id: 'threeps',
    name: "De 3 P's",
    icon: '&#128176;',
    color: '#6366f1',
    colorDark: '#4f46e5',
    tagline: 'Evaluate projects by your personal values',
    bestFor: 'Project evaluation, career decisions, freelance work',
    howItWorks: 'Rate how important Money (Poen), Fun (Pret), and Prestige are to you personally. Then rate how much a potential project delivers on each. The tool combines these to show if the project aligns with your values.',
    tips: [
      'Be honest about what you truly value - not what you think you should value',
      'Compare similar projects to calibrate your ratings',
      'A low score means bad fit, not a bad project'
    ]
  },
  {
    id: 'tententen',
    name: '10-10-10 Rule',
    icon: '&#9200;',
    color: '#3b82f6',
    colorDark: '#1d4ed8',
    tagline: 'See your decision through the lens of time',
    bestFor: 'Emotional decisions, impulse control, regret prevention',
    howItWorks: 'Ask yourself: How will I feel about this decision in 10 minutes? In 10 months? In 10 years? This shifts focus from immediate emotions to long-term impact.',
    tips: [
      'Long-term perspective (10 years) carries the most weight',
      'If something feels good now but bad later, reconsider',
      'Great for decisions where emotions are running high'
    ]
  },
  {
    id: 'regret',
    name: 'Regret Minimization',
    icon: '&#129300;',
    color: '#8b5cf6',
    colorDark: '#6d28d9',
    tagline: "Jeff Bezos' framework for life-changing choices",
    bestFor: 'Major life decisions, career changes, starting a business',
    howItWorks: 'Imagine yourself at 80 years old, looking back at this decision. Would you regret NOT taking the chance? This framework was famously used by Jeff Bezos when deciding to start Amazon.',
    tips: [
      'Focus on the regret of inaction, not just action',
      'Consider reversibility - can you undo this decision?',
      'Great for when fear is holding you back'
    ]
  },
  {
    id: 'pmi',
    name: 'PMI Analysis',
    icon: '&#9878;',
    color: '#10b981',
    colorDark: '#059669',
    tagline: 'Edward de Bono\'s structured thinking method',
    bestFor: 'Complex decisions, team discussions, thorough analysis',
    howItWorks: 'List all the Plus (positive), Minus (negative), and Interesting (neutral but notable) aspects of a decision. Weigh each point to see the overall picture.',
    tips: [
      '"Interesting" often reveals overlooked opportunities',
      'Include items even if they seem minor',
      'Great for decisions that need group buy-in'
    ]
  },
  {
    id: 'swot',
    name: 'SWOT Analysis',
    icon: '&#127919;',
    color: '#f59e0b',
    colorDark: '#d97706',
    tagline: 'Strategic planning in a 2x2 grid',
    bestFor: 'Business decisions, strategic planning, competitive analysis',
    howItWorks: 'Map out Strengths (internal +), Weaknesses (internal -), Opportunities (external +), and Threats (external -). This classic framework helps you see the full strategic picture.',
    tips: [
      'Internal = what you control; External = what you don\'t',
      'Leverage strengths to capture opportunities',
      'Prepare for threats that exploit weaknesses'
    ]
  },
  {
    id: 'opportunityCost',
    name: 'Opportunity Cost',
    icon: '&#9878;',
    color: '#06b6d4',
    colorDark: '#0891b2',
    tagline: 'Compare what you gain vs. what you sacrifice',
    bestFor: 'Resource allocation, time management, investment decisions',
    howItWorks: 'Every choice has a trade-off. List what you gain by taking action and what you sacrifice (time, money, other opportunities). Is the exchange worth it?',
    tips: [
      'Include intangible costs like stress and time',
      'Consider the best alternative, not just "nothing"',
      'Great for when you\'re spread too thin'
    ]
  },
  {
    id: 'coinFlip',
    name: 'Coin Flip Test',
    icon: '&#129689;',
    color: '#ec4899',
    colorDark: '#db2777',
    tagline: 'Reveal what your gut already knows',
    bestFor: 'Tie-breakers, analysis paralysis, gut-check validation',
    howItWorks: 'Assign each option to heads or tails. Flip the coin. In that moment of reveal, notice your gut reaction. Disappointed? Relieved? That tells you more than the coin.',
    tips: [
      'It\'s not about the coin - it\'s about your reaction',
      'Use after analysis when both options seem equal',
      'Trust that flash of feeling before logic kicks in'
    ]
  },
  {
    id: 'fearRegret',
    name: 'Fear vs Regret',
    icon: '&#128168;',
    color: '#ef4444',
    colorDark: '#dc2626',
    tagline: 'Balance your fears of action and inaction',
    bestFor: 'Overcoming fear, taking leaps, avoiding paralysis',
    howItWorks: 'List your fears of taking action (what could go wrong?) and your fears of NOT taking action (what will you miss?). Which set of fears is stronger?',
    tips: [
      'Fears of inaction are often underestimated',
      'Consider: "What if I never try?"',
      'Action fears tend to be temporary; inaction fears linger'
    ]
  }
]
</script>
