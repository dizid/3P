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

"De 3 P's" is a Dutch-language Vue 3 decision tool that helps users evaluate projects based on three personal values:
- **Poen** (Money) - Financial reward importance
- **Pret** (Fun) - Enjoyment and meaning
- **Prestige** (Status) - Recognition and professional standing

The app calculates a weighted score by multiplying user baseline values by project-specific ratings. Scores above 6000 recommend proceeding with the project.

## Architecture

**Stack**: Vue 3 + Vite + Pinia + Vue Router + FormKit + Tailwind CSS

**User Flow**: Home (baseline values) → Project (project ratings) → Result (score + recommendation)

**Key Files**:
- [PStore.js](src/stores/PStore.js) - Pinia store holding all slider values and computing `endScore`
- [router/index.js](src/router/index.js) - Routes: `/` (home), `/project`, `/resultaat`, `/about`
- [style.css](src/style.css) - Custom Tailwind components: `.glass`, `.gradient-mesh`, `.card-3d`, page transitions, FormKit overrides

**Path Alias**: `@` maps to `./src` (configured in vite.config.js)

**Pattern**: Views are thin wrappers that import a single component (e.g., HomeView imports BaselineQuestions)

## Styling Notes

- FormKit inputs are styled via Tailwind in [style.css](src/style.css) using `[data-type="range"]` and `[data-type="text"]` selectors
- Custom animations defined in both [tailwind.config.js](tailwind.config.js) and style.css
- Glass-morphism effects use backdrop-filter (`.glass`, `.glass-card` classes)
