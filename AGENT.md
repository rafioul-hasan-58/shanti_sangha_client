# Rules for the AI agent (read this first, every session)

## Project
Shanti Sangha sporting club website. Next.js App Router + TypeScript + Tailwind.
Two languages: English (`en`) and Bangla (`bn`). Green theme. Roles: member and admin (one person can be both).

## Hard rules
1. Read ARCHITECTURE.md and TODO.md before changing anything.
2. NEVER hard-code visible text. Add it to BOTH `src/i18n/dictionaries/en.json` and `bn.json`.
3. NEVER hard-code colors (no `#hex`, no `bg-green-500`). Use theme names from `tailwind.config.ts` (`brand-*`, `pitch`, `lime`, `chalk`).
4. One component per file, max ~150 lines. Split if bigger.
5. Server components by default. Add `"use client"` only when state/effects/events are needed.
6. API calls go in `src/lib` or `src/services`, never inside components.
7. Every page lives under `src/app/[locale]/` and must work in both languages and on mobile.
8. Check Bangla text fits the layout (it is often longer).

## Workflow
- Small changes, one task at a time. Explain the plan first for anything big.
- After each task: update TODO.md and CHANGELOG.md.
- Explain changes in simple language.
