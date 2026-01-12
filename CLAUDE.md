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

A decision support app with multiple tools:

### De 3 P's (Dutch)
Evaluates projects based on three personal values: Poen (Money), Pret (Fun), Prestige (Status). Multiplies user baseline values by project ratings. Threshold: 6000.

### Decision Tools (English)
Located at `/tools`, these are additional decision frameworks:

| Tool | Route | Store Key | Scoring |
|------|-------|-----------|---------|
| **10-10-10 Rule** | `/tools/10-10-10` | `tententen` | Weighted by time: 15% (10min) + 35% (10mo) + 50% (10yr) |
| **Regret Minimization** | `/tools/regret` | `regret` | 40% regret + 15% reversibility + 25% values + 20% age80 |
| **PMI Analysis** | `/tools/pmi` | `pmi` | Plus - Minus + (Interesting × 0.5) |

## Architecture

**Stack**: Vue 3 + Vite + Pinia + Vue Router + FormKit + Tailwind CSS

**User Flow**: Home (baseline values) → Project (project ratings) → Result (score + recommendation)

**Key Files**:
- [PStore.js](src/stores/PStore.js) - Pinia store for 3P's tool (baseline/project values, `endScore`)
- [ToolsStore.js](src/stores/ToolsStore.js) - Pinia store for decision tools (tententen, regret, pmi state + getters)
- [router/index.js](src/router/index.js) - All routes including `/tools/*`
- [style.css](src/style.css) - Custom Tailwind: `.glass`, `.gradient-mesh`, `.card-3d`, animations

**Component Structure**:
- `components/shared/` - Reusable: ToolCard, ToolHeader
- `components/tententen/` - 10-10-10 form + result
- `components/regret/` - Regret Minimization form + result
- `components/pmi/` - PMI form + item cards + result

**Path Alias**: `@` maps to `./src` (configured in vite.config.js)

**Pattern**: Views are thin wrappers that import a single component (e.g., HomeView imports BaselineQuestions)

## Styling Notes

- FormKit inputs are styled via Tailwind in [style.css](src/style.css) using `[data-type="range"]` and `[data-type="text"]` selectors
- Custom animations defined in both [tailwind.config.js](tailwind.config.js) and style.css
- Glass-morphism effects use backdrop-filter (`.glass`, `.glass-card` classes)
