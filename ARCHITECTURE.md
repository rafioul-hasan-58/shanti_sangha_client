# Architecture

```
src/
├── app/
│   ├── globals.css
│   └── [locale]/            # en | bn, every page lives here
│       ├── layout.tsx       # fonts, Navbar, Footer, RoleProvider
│       ├── page.tsx         # landing page
│       ├── dashboard/       # member dashboard
│       └── admin/           # admin dashboard
├── components/
│   ├── layout/              # Navbar, Footer, LanguageSwitcher
│   ├── home/                # landing page sections (HeroCarousel)
│   └── dashboard/           # DashboardShell, RoleSwitcher
├── context/RoleContext.tsx  # active role (user | admin), saved in localStorage
├── i18n/                    # config, getDictionary, dictionaries/en.json + bn.json
├── lib/                     # helpers, API calls (empty for now)
├── types/                   # shared TypeScript types
└── middleware.ts            # redirects "/" -> "/en"
```

## Decisions
- **Language** is part of the URL (`/en/...`, `/bn/...`). No extra i18n library; text comes from JSON dictionaries loaded on the server and passed to components as props.
- **Role switch** is UI-only for now. Real security (auth, permission checks) must be enforced on the backend later.
- **Theme** lives only in `tailwind.config.ts`.
