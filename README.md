# VITADIET Website

Static Nuxt 4 site for VITADIET, a bilingual supplement catalogue for the Saudi
market. Arabic is the default experience at `/`; English is served from `/en`.

## Stack

- Nuxt 4 with the default `app/` source directory.
- Vue 3, TypeScript, and Nuxt auto-imports.
- Tailwind CSS v4 in CSS-first mode. There is no `tailwind.config.js`; design
  tokens live in `app/assets/css/_tokens.css` and Tailwind is loaded from
  `nuxt.config.ts` through `@tailwindcss/vite`.
- `@nuxtjs/i18n` with locale files in `app/locales/`.
- `@nuxtjs/seo`, schema.org, sitemap, robots, Nuxt Image, and Nuxt Fonts.

## Commands

```bash
npm install
npm run dev
npm run generate
```

Quality gates:

```bash
npm run format:check
npm run lint
npm run typecheck
npm run generate
```

`npm run generate` produces `.output/public` and also runs the project guards.

## Guards

- `scripts/check-no-localhost.mjs` fails if generated public files contain a dev
  host such as `localhost` or `127.0.0.1`.
- `scripts/check-schema-org.mjs` checks the generated JSON-LD graph for the
  expected canonical WebSite, Organization, logo, breadcrumbs, and Product
  nodes.
- `scripts/check-i18n-keys.mjs` enforces Arabic/English key parity and fails on
  orphaned translation keys.
- `scripts/check-site-content.mjs` validates the central site-content source: the
  five quality pillars, the legal document slugs, a single B2B inbox, and the
  forbidden health claims.
- `scripts/check-contrast.mjs` reads the design tokens and fails the build when a
  documented colour pair drops below its WCAG AA threshold.
- `nitro.prerender.failOnError` is enabled so broken generated routes fail the
  build instead of silently producing 404 output.

## Project Layout

- `app/components/` contains shared UI, header/footer, home sections, and
  product components.
- `app/pages/` contains the generated routes.
- `app/data/` holds the central content sources: navigation, product catalog,
  and the phase-3 site content (quality, legal documents, partnership form
  options). See `docs/CONTENT-DATA-MODEL.md`.
- `app/services/` is the read layer every page goes through, so the sources can be
  swapped for a Dashboard API without touching pages, components, or URLs.
- `public/api/partner-lead.php` receives the partnership form on Apache. See
  `docs/PARTNER-FORM.md`.
- `app/locales/ar.json` and `app/locales/en.json` are the only runtime locale
  files.
- `docs/i18n-backlog.json` stores retired translated copy outside the runtime
  i18n bundle.
- `public/.htaccess` is part of the production contract for Apache redirects.

## Deployment

Production deploys the static output from:

```bash
npm run generate
```

Development must be generated with the deployment environment set explicitly so
every page emits `noindex, nofollow, noarchive` for both robots and Googlebot:

```powershell
$env:VITADIET_DEPLOY_ENV = 'development'
npm run generate
```

```bash
VITADIET_DEPLOY_ENV=development npm run generate
```

Do not set `VITADIET_DEPLOY_ENV` for the production build. The default is
`production`, which remains indexable. The generated delivery check fails when
either environment receives the wrong robots policy or an image uses `1x1`
dimensions.

Upload the contents of `.output/public` to Apache. Keep `public/.htaccess` in
the generated output: it canonicalizes `https://www.vitadiet.sa/`, preserves
legacy `/ar/` redirects, enforces trailing slashes for generated directories,
and avoids redirect chains.

## Documentation

- `docs/CONTENT-DATA-MODEL.md` - where the changeable data lives and how to
  update it. Start here.
- `docs/PRODUCT-DATA-MODEL.md` - the product catalog specifically.
- `docs/PARTNER-FORM.md` - the partnership form, its states, and its endpoint.
- `docs/QA-CHECKLIST.md` - the automated gates plus the manual QA pass.
- `docs/PHASE-3-REPORT.md` - what shipped, what did not, and what still needs
  data from VITADIET.
- `docs/DEPLOYMENT.md` - build and upload steps per environment.
