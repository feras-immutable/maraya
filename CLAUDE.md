# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What is Maraya

Maraya (مرايا, "mirrors") is a structural reader for the Qur'an built with Vite + React. It visualizes the compositional architecture of each surah — where the text turns, how the two halves balance, and where the structural pivot falls relative to center. The concept is: the Qur'an rendered as architecture.

## Commands

- `npm run dev` — start local dev server
- `npm run build` — production build to `dist/`
- `npm run preview` — preview production build locally

## Project structure

```
maraya/
├── index.html          — entry HTML with OG meta tags
├── package.json
├── vite.config.js
├── vercel.json         — SPA rewrite rules for Vercel
├── src/
│   ├── main.jsx        — ReactDOM entry point
│   ├── App.jsx         — the entire application (single file)
│   └── index.css       — minimal global styles
├── maraya_v1_6.jsx     — original artifact version (kept for reference)
└── CLAUDE.md
```

The application lives in `src/App.jsx` — a single file with 12 clearly marked sections:

1. **RAW STRUCTURAL DATASET** — 114 surah records. Generated programmatically, zero hand-typed values.
2. **PIVOT VERSE TEXT** — Arabic (Tanzil.net Uthmani Minimal) and English (Sahih International) for each pivot.
3. **GOLD WORDS** — Curated semantic-structural echoes. Hand-picked Arabic words whose meaning mirrors the structural position.
4. **VALIDATION** — Fails hard on load if any dataset entry is missing or malformed.
5. **DATA LAYER** — Single source of truth. All derived values computed here.
6. **STRUCTURAL BAR COMPONENT** — The core visual. Shows the shape of a surah.
7. **STYLES** — All CSS in a single `STYLE` template literal. Google Fonts via `@import`.
8. **LANDING PAGE** — Hero with structural bar assembly animation.
9. **PANORAMA** — 114 structural bars in a grid with wave reveal and ambient breathing.
10. **BROWSE PAGE** — Searchable, sortable, filterable grid.
11. **DETAIL PAGE** — Core product surface with progressive reveal.
12. **ABOUT** — Provenance, methodology citation, source credits.
13. **APP SHELL** — URL-based routing via History API (no React Router).

## URL scheme

| URL | View |
|-----|------|
| `/` | Landing |
| `/explore` | Panorama (114-bar grid) |
| `/browse` | Browse (search/filter) |
| `/surah/N` | Detail page for surah N (1–114) |
| `/about` | About |

## Technical constraints

- **Single source file** — keep all app code in `src/App.jsx`
- **No React Router** — routing uses History API (`pushState`, `popstate`)
- **No Tailwind** — all styling via the `STYLE` template literal constant
- **No external state** — no localStorage, no state management libraries
- **Dataset integrity is sacred** — never modify RAW_DATASET, PIVOT_VERSES, GOLD_WORDS, validation logic, or any data computation
- **All Google Fonts** loaded via `@import` in the STYLE string

## Palette (kiswah-inspired)

- Background: `#0a0a0b` (--bg) — warm neutral black
- Gold: `#d4a843` (--gold) — rich amber, the signal color
- Gold bright: `#e2c05c` (--gold-bright)
- Text: `#ebebeb` (--t1), `#9a978f` (--t2), `#5e5c56` (--t3), `#484848` (--t4)
- Teal: `#6b9dad` (--teal) — post-pivot region tint

## Fonts

- Cormorant Garamond — headlines (48/28/20px)
- Source Sans 3 — body text (15px)
- JetBrains Mono — metadata, labels (16/11/10/9px)
- Amiri — Arabic text (30/16px)

## Design direction — core product law

- The structural bar is the hero — it appears before text, above text, larger than text.
- Arabic text is the emotional anchor.
- Gold (#d4a843) is the signal.
- Everything else stays quiet.
- Structure before language: the user sees the shape, then reads the explanation.

## Design scales

- **Spacing**: 4px base (4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128)
- **Motion**: `ease` for entrances, `0.2s` for hovers
- **One focal point per screen**

## Hard rules — NEVER do the following

- No gradient mesh backgrounds
- No neon effects
- No decorative Islamic motifs or illustrations
- No visual clutter around the structural bar
- No glassmorphism or heavy blur
- No heavy drop shadows
- No bright blue or extra accent colors beyond the existing palette
- No "SaaS landing page" sections or startup marketing patterns
- Do not break dataset integrity, validation, or any data computation
- Do not remove any existing view or navigation path
- Preserve the structural bar component logic

## Deployment

Deployed to Vercel. The `vercel.json` rewrites all paths to `index.html` for SPA routing.

## Plugin coordination

The frontend-design plugin may be active. The aesthetic direction for Maraya is ALREADY DECIDED — do not choose a new one. Follow the design direction in this file exactly.
