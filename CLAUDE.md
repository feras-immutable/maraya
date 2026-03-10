# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What is Maraya

Maraya (مرايا, "mirrors") is a structural reader for the Qur'an built as a single-file React component (JSX). It visualizes the compositional architecture of each surah — where the text turns, how the two halves balance, and where the structural pivot falls relative to center. The concept is: the Qur'an rendered as architecture.

## Project structure

The entire application lives in `maraya_v1_6.jsx` — a single file (~1180 lines) with 12 clearly marked sections:

1. **RAW STRUCTURAL DATASET** — 114 surah records from `quran_structural_dataset_v1.2_final.json`. Generated programmatically, zero hand-typed values.
2. **PIVOT VERSE TEXT** — Arabic (Tanzil.net Uthmani Minimal) and English (Sahih International) text for each surah's pivot verse(s), keyed by surah number.
3. **VALIDATION** — Fails hard on load if any dataset entry is missing, malformed, or mismatched. The app will not render if validation fails.
4. **DATA LAYER** — Single source of truth. All derived values (labels, colors, parsed ranges, stats) computed here. No component touches RAW_DATASET or PIVOT_VERSES directly.
5. **STRUCTURAL BAR COMPONENT** — The core visual of Maraya. Shows the shape of a surah as a horizontal bar with pre-pivot, pivot zone, post-pivot regions, pivot midpoint, and geometric center.
6. **STYLES** — All CSS in a single `STYLE` template literal string. Google Fonts loaded via `@import`. CSS custom properties define the palette, typography, and spacing.
7. **LANDING PAGE** — Hero with Arabic title, three featured surahs (Q.2, Q.18, Q.110), corpus stats strip.
8. **PANORAMA** — 114 structural bars in a grid. Supports mushaf order and sort-by-length.
9. **BROWSE PAGE** — Searchable, sortable, filterable grid of all 114 surahs.
10. **DETAIL PAGE** — Core product surface for a single surah: identity, metadata strip, structural bar (the hero), pivot verse cards with Arabic and English.
11. **ABOUT** — Provenance, methodology citation, source credits.
12. **APP SHELL** — Router-like state machine: Landing → Panorama → Browse → Detail → About.

## Technical constraints

- **Single JSX file** — keep everything in one file
- **No build system** — the app runs as a React artifact (e.g. Claude artifact renderer), not via npm/webpack
- **No Tailwind** — all styling is inline or via the `STYLE` constant
- **No external state** — no localStorage, no router, no external dependencies beyond React and lucide-react
- **Dataset integrity is sacred** — never modify RAW_DATASET, PIVOT_VERSES, validation logic, or any data computation
- **All Google Fonts** loaded via `@import` in the STYLE string

## Fonts

- Cormorant Garamond — headlines
- Source Sans 3 — body text
- JetBrains Mono — metadata, labels, mono elements
- Amiri — Arabic text

## Palette

- Background: `#060608` (--bg) with layered surfaces
- Gold: `#c9a652` (--gold) — the signal color
- Text: `#e8e6e1` (--t1), `#9a978f` (--t2), `#504e48` (--t3)
- Teal: `#6b9dad` (--teal) — post-pivot region tint

## Classification types

Six structural classifications, each with an assigned color:
- compound_seam, single_concentration, distributed_convergence, refrain_governed, terminal, multi_pivot

## Design direction — core product law

- The structural bar is the hero — it appears before text, above text, larger than text.
- Arabic text is the emotional anchor.
- Gold (#c9a652) is the signal.
- Everything else stays quiet.
- Structure before language: the user sees the shape, then reads the explanation.

## Target feel

- Apple-like restraint (one dominant idea per screen, immaculate spacing, restrained motion)
- Luxury editorial product, not a SaaS dashboard
- Research-grade precision
- Cinematic calm — a revelation interface, not a product page
- Tactile depth — machined object in darkness, not flat dark mode
- Less app, more instrument

## Hard rules — NEVER do the following

- No gradient mesh backgrounds
- No neon effects
- No decorative Islamic motifs or illustrations
- No visual clutter around the structural bar
- No glassmorphism or heavy blur
- No charts pretending to be premium
- No heavy drop shadows
- No bright blue or extra accent colors beyond the existing palette
- No "SaaS landing page" sections or startup marketing patterns
- No explanatory overload or extra feature panels
- If a surface treatment is noticeable to a casual viewer, it's too much — pull it back
- Do not break dataset integrity, validation, or any data computation
- Do not remove any existing view or navigation path
- Preserve the structural bar component logic

## Always prefer

- Fewer elements with stronger hierarchy
- More whitespace and vertical breathing room
- Better motion over more motion
- More precise typography (larger scale contrast between levels)
- Clearer focal points (one per screen)
- Premium restraint over decoration
- Deeper tonal separation between background layers (not more borders)

## Plugin coordination

The frontend-design plugin may be active. It helps with code quality and avoiding generic aesthetics. However, the aesthetic direction for Maraya is ALREADY DECIDED — do not choose a new one. Follow the design direction in this file exactly. The plugin should enhance execution quality, not override the creative brief.
