# shanti_sangha_client

Website for Shanti Sangha sporting club. English + Bangla, member dashboard, admin dashboard, green theme.

## Stack
Next.js 15 (App Router) · TypeScript · Tailwind CSS 3

## Run
```bash
npm install
npm run dev     # http://localhost:3000  (redirects to /en)
```

## Where to change things
| I want to change... | Edit |
|---|---|
| Colors | `tailwind.config.ts` |
| Any text (English / Bangla) | `src/i18n/dictionaries/en.json` and `bn.json` |
| Hero slides | `dictionaries/*.json` -> `hero.slides`, look in `components/home/HeroCarousel.tsx` |
| Navbar links | `components/layout/Navbar.tsx` |
