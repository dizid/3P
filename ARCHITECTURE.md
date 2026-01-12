# Architecture

Technical architecture and patterns for the Decision Support App.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Vue 3 (Composition API) |
| Build | Vite |
| State | Pinia |
| Routing | Vue Router |
| Forms | FormKit |
| Styling | Tailwind CSS |
| Animations | CSS + Tailwind |

## Project Structure

```
src/
├── views/                    # Route components (thin wrappers)
│   ├── LandingView.vue       # / - Marketing homepage
│   ├── ToolsHomeView.vue     # /tools - Tool selection
│   ├── ThreePsView.vue       # /tools/3ps
│   ├── TenTenTenView.vue     # /tools/10-10-10
│   ├── RegretView.vue        # /tools/regret
│   ├── PmiView.vue           # /tools/pmi
│   ├── SwotView.vue          # /tools/swot
│   ├── CoinFlipView.vue      # /tools/coinflip
│   ├── FearRegretView.vue    # /tools/fear-regret
│   ├── OpportunityCostView.vue # /tools/opportunity
│   ├── HistoryView.vue       # /history
│   ├── InsightsView.vue      # /insights
│   ├── CompareView.vue       # /compare
│   ├── HelpView.vue          # /help
│   ├── PricingView.vue       # /pricing
│   └── AboutView.vue         # /about
│
├── components/
│   ├── shared/               # Reusable across app
│   │   ├── ToolCard.vue      # Tool grid cards
│   │   ├── ToolHeader.vue    # Tool page headers
│   │   ├── ThemeToggle.vue   # Dark/light switch
│   │   ├── SaveToHistoryButton.vue
│   │   ├── ExportMenu.vue
│   │   ├── TemplateSelector.vue
│   │   └── LanguageToggle.vue
│   │
│   ├── landing/              # Landing page sections
│   │   ├── HeroSection.vue
│   │   ├── ValueProposition.vue
│   │   ├── ToolShowcase.vue
│   │   ├── PremiumPreview.vue
│   │   └── CTASection.vue
│   │
│   ├── premium/              # Paywall components
│   │   ├── FeatureGate.vue   # Wrap premium content
│   │   ├── PremiumBadge.vue  # "Premium" indicator
│   │   └── UpgradePrompt.vue # Upgrade CTA
│   │
│   ├── ai/                   # AI advice (placeholder)
│   │   ├── AiAdvicePanel.vue
│   │   ├── AiSummary.vue
│   │   ├── AiGuidance.vue
│   │   └── AiLoadingState.vue
│   │
│   ├── history/              # History management
│   │   ├── HistoryCard.vue
│   │   ├── HistoryFilters.vue
│   │   └── OutcomeModal.vue
│   │
│   ├── insights/             # Analytics dashboard
│   │   ├── InsightCard.vue
│   │   ├── UsageChart.vue
│   │   └── PatternSummary.vue
│   │
│   ├── help/                 # Help section
│   │   ├── DecisionGuide.vue
│   │   ├── ToolExplanation.vue
│   │   └── TipsSection.vue
│   │
│   └── [tool]/               # Per-tool components
│       ├── [Tool]Form.vue    # Input collection
│       └── [Tool]Result.vue  # Score display
│
├── stores/                   # Pinia stores
│   ├── ToolsStore.js         # All tool state
│   ├── HistoryStore.js       # Decision history
│   ├── SubscriptionStore.js  # Premium status
│   ├── ThemeStore.js         # Dark mode
│   └── AuthStore.js          # User auth (placeholder)
│
├── services/                 # External integrations
│   ├── stripeService.js      # Payment (placeholder)
│   └── aiService.js          # AI advice (placeholder)
│
├── composables/              # Vue composables
│   └── useExport.js          # Export functionality
│
├── data/                     # Static data
│   └── templates.js          # Decision templates
│
├── i18n/                     # Internationalization
│   ├── index.js
│   └── locales/
│       ├── en.json
│       └── nl.json
│
├── router/
│   └── index.js              # All routes
│
├── App.vue                   # Root component
├── main.js                   # App entry
└── style.css                 # Global styles
```

## Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                        User Interface                        │
├─────────────────────────────────────────────────────────────┤
│  View (route)                                               │
│    └── imports Form/Result components                       │
│                                                             │
│  Form Component                                             │
│    └── collects input                                       │
│    └── calls store action                                   │
│                                                             │
│  Store (Pinia)                                              │
│    └── updates state                                        │
│    └── computes derived values (getters)                    │
│                                                             │
│  Result Component                                           │
│    └── reads from store getters                             │
│    └── displays score/recommendation                        │
│    └── offers save to history                               │
│                                                             │
│  HistoryStore                                               │
│    └── persists to localStorage                             │
└─────────────────────────────────────────────────────────────┘
```

## Store Architecture

### ToolsStore

```javascript
// State structure per tool
{
  toolName: {
    // Input fields
    decision: '',
    field1: 50,
    field2: 50,
    // ...
  }
}

// Getters pattern
toolNameScore: (state) => {
  // Calculate score from state
  return calculatedScore
}

toolNameAdvice() {
  const score = this.toolNameScore
  // Return advice based on score
  return { text: '...', type: 'positive|neutral|negative' }
}

// Actions pattern
setToolNameField(field, value) {
  this.toolName[field] = value
}

resetToolName() {
  this.toolName = { ...defaultState }
}
```

### HistoryStore

```javascript
{
  decisions: [
    {
      id: 'uuid',
      tool: 'toolName',
      decision: 'Description',
      score: 75,
      data: { /* tool-specific */ },
      outcome: null | { rating: 4, notes: '...' },
      createdAt: 'ISO date',
      updatedAt: 'ISO date'
    }
  ]
}
```

### SubscriptionStore

```javascript
{
  tier: 'free' | 'premium',
  status: 'active' | 'canceled' | null,
  features: {
    aiAdvice: boolean,
    unlimitedHistory: boolean,
    insights: boolean,
    export: boolean
  }
}

// Key getters
isPremium: boolean
historyLimit: 10 | Infinity
canUseFeature(name): boolean
```

## Component Patterns

### View Pattern
Views are thin wrappers that compose components:

```vue
<template>
  <div class="min-h-screen py-8 px-4">
    <div class="max-w-4xl mx-auto">
      <ToolHeader icon="..." title="..." />
      <ToolForm v-if="!showResult" @complete="..." />
      <ToolResult v-else @reset="..." />
    </div>
  </div>
</template>
```

### Form Pattern
Forms collect input and update store:

```vue
<script setup>
import { useToolsStore } from '@/stores/ToolsStore'
const store = useToolsStore()

const handleSubmit = () => {
  emit('complete')
}
</script>
```

### Result Pattern
Results display scores from store getters:

```vue
<script setup>
import { computed } from 'vue'
import { useToolsStore } from '@/stores/ToolsStore'

const store = useToolsStore()
const score = computed(() => store.toolNameScore)
const advice = computed(() => store.toolNameAdvice)
</script>
```

### Feature Gate Pattern
Wrap premium content:

```vue
<FeatureGate
  v-if="!isPremium"
  feature="featureName"
  title="Unlock Feature"
  description="..."
>
  <template #preview>
    <!-- Blurred preview -->
  </template>
</FeatureGate>

<ActualContent v-else />
```

## Styling System

### CSS Classes

| Class | Purpose |
|-------|---------|
| `.glass` | Subtle glass effect |
| `.glass-card` | Card with glass effect |
| `.gradient-mesh` | Background gradient |
| `.card-3d` | 3D hover effect |
| `.animate-on-enter` | Fade-in animation |
| `.stagger-1` to `.stagger-4` | Delayed animations |

### Dark Mode
All components use Tailwind dark variants:

```html
<div class="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
```

### Responsive Breakpoints

| Breakpoint | Width |
|------------|-------|
| `sm` | 640px |
| `md` | 768px |
| `lg` | 1024px |
| `xl` | 1280px |

## Route Structure

```javascript
const routes = [
  // Public
  { path: '/', component: LandingView },
  { path: '/tools', component: ToolsHomeView },
  { path: '/tools/:tool', component: DynamicToolView },
  { path: '/help', component: HelpView },
  { path: '/pricing', component: PricingView },
  { path: '/about', component: AboutView },

  // Requires history
  { path: '/history', component: HistoryView },
  { path: '/compare', component: CompareView },

  // Premium
  { path: '/insights', component: InsightsView },

  // Legacy redirects
  { path: '/project', redirect: '/tools/3ps' },
  { path: '/resultaat', redirect: '/tools/3ps' },
]
```

## Placeholder Services

### stripeService.js
Ready for Stripe integration:
- `createCheckoutSession(priceId)` - Start payment
- `createPortalSession()` - Manage subscription
- `getSubscriptionStatus()` - Check status

### aiService.js
Ready for AI integration:
- `getAnalysisSummary(tool, data)` - Post-analysis summary
- `getGuidance(context, question)` - Interactive Q&A
- `getToolRecommendation(situation)` - Suggest tool

## LocalStorage Keys

| Key | Content |
|-----|---------|
| `decision-history` | Array of past decisions |
| `subscription` | Subscription state |
| `theme` | 'light' or 'dark' |
| `onboarding-complete` | Boolean |
