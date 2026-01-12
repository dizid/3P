# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
npm install     # Install dependencies
npm run dev     # Start Vite dev server with hot reload
npm run build   # Build for production
npm run preview # Preview production build locally
```

## Project Overview

A decision support application with 8 decision-making tools, premium features, and AI-ready infrastructure.

### App Structure

| Route | Purpose |
|-------|---------|
| `/` | Marketing landing page |
| `/tools` | Tool selection hub (8 tools) |
| `/tools/3ps` | De 3 P's (featured) |
| `/history` | Decision history (10 free, unlimited premium) |
| `/insights` | Analytics dashboard (premium only) |
| `/help` | Tool explanations & guides |
| `/pricing` | Premium subscription page |
| `/compare` | Side-by-side tool comparison |

### Decision Tools

| Tool | Route | Store Key | Scoring Formula |
|------|-------|-----------|-----------------|
| **De 3 P's** | `/tools/3ps` | `threeps` | (baseline × project) per P, threshold: 6000 |
| **10-10-10 Rule** | `/tools/10-10-10` | `tententen` | 15% (10min) + 35% (10mo) + 50% (10yr) |
| **Regret Minimization** | `/tools/regret` | `regret` | 40% regret + 15% reversibility + 25% values + 20% age80 |
| **PMI Analysis** | `/tools/pmi` | `pmi` | Plus - Minus + (Interesting × 0.5) |
| **SWOT Analysis** | `/tools/swot` | `swot` | Strengths + Opportunities - Weaknesses - Threats |
| **Coin Flip** | `/tools/coin-flip` | `coinFlip` | Random + gut reaction analysis |
| **Fear/Regret Matrix** | `/tools/fear-regret` | `fearRegret` | Fear of inaction - Fear of action |
| **Opportunity Cost** | `/tools/opportunity-cost` | `opportunityCost` | Gains - Sacrifices comparison |

## Architecture

**Stack**: Vue 3 + Vite + Pinia + Vue Router + FormKit + Tailwind CSS

### Key Stores

| Store | File | Purpose |
|-------|------|---------|
| `ToolsStore` | [src/stores/ToolsStore.js](src/stores/ToolsStore.js) | All 8 tool states, scores, advice |
| `HistoryStore` | [src/stores/HistoryStore.js](src/stores/HistoryStore.js) | Decision history, outcome tracking |
| `SubscriptionStore` | [src/stores/SubscriptionStore.js](src/stores/SubscriptionStore.js) | Premium tier, feature flags |
| `ThemeStore` | [src/stores/ThemeStore.js](src/stores/ThemeStore.js) | Dark/light mode |
| `AuthStore` | [src/stores/AuthStore.js](src/stores/AuthStore.js) | User authentication (placeholder) |

### Component Structure

```
src/components/
├── shared/          # ToolCard, ToolHeader, ThemeToggle, SaveToHistoryButton
├── landing/         # HeroSection, ToolShowcase, PremiumPreview, CTASection
├── help/            # DecisionGuide, ToolExplanation, TipsSection
├── premium/         # FeatureGate, PremiumBadge, UpgradePrompt
├── ai/              # AiAdvicePanel, AiSummary, AiGuidance
├── history/         # HistoryCard, HistoryFilters, OutcomeModal
├── insights/        # InsightCard, UsageChart, PatternSummary
├── threeps/         # ThreePsForm, ThreePsResult
├── tententen/       # TenTenTenForm, TenTenTenResult
├── regret/          # RegretForm, RegretResult
├── pmi/             # PmiForm, PmiItemCard, PmiResult
├── swot/            # SwotForm, SwotQuadrant, SwotResult
├── coinflip/        # CoinFlipForm, CoinFlipResult, AnimatedCoin
├── fearregret/      # FearRegretForm, FearRegretResult, FearMatrix
├── opportunity/     # OpportunityForm, OpportunityResult
└── compare/         # CompareToolSelector, CompareResults
```

### Data & Services

| File | Purpose |
|------|---------|
| [templates.js](src/data/templates.js) | Quick-start templates for each tool (career, business, personal) |
| [stripeService.js](src/services/stripeService.js) | Stripe checkout/portal (placeholder) |
| [aiService.js](src/services/aiService.js) | AI advice generation (placeholder) |

### Composables

| File | Purpose |
|------|---------|
| [useExport.js](src/composables/useExport.js) | Export decisions as Markdown, TXT, or PDF |

### i18n (Internationalization)

| File | Languages |
|------|-----------|
| [src/i18n/index.js](src/i18n/index.js) | i18n setup with `t()` function and `useI18n()` composable |
| [en.json](src/i18n/locales/en.json) | English translations |
| [nl.json](src/i18n/locales/nl.json) | Dutch translations |

**Usage:** `import { t, useI18n } from '@/i18n'` or use `$t('key')` in templates.

### Premium Features

| Feature | Free | Premium |
|---------|------|---------|
| All 8 tools | ✓ | ✓ |
| Compare tools | ✓ | ✓ |
| History | 10 items | Unlimited |
| Insights dashboard | ✗ | ✓ |
| AI advice | ✗ | ✓ |
| PDF/JSON export | ✗ | ✓ |

**Feature gating**: Use `SubscriptionStore.isPremium` and `FeatureGate` component.

## Styling

- **Glass morphism**: `.glass`, `.glass-card` classes
- **Animations**: `.animate-on-enter`, `.stagger-1` through `.stagger-4`
- **Dark mode**: All components use `dark:` Tailwind variants
- **FormKit**: Styled via `[data-type="range"]` selectors in [style.css](src/style.css)

## Patterns

- **Views are thin wrappers**: Import single main component
- **Tool pattern**: Form component → collects input → store action → Result component
- **Feature gating**: Wrap premium content with `<FeatureGate feature="featureName">`
- **History saving**: Use `SaveToHistoryButton` component in results

## Path Alias

`@` maps to `./src` (configured in vite.config.js)
