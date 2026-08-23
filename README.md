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
- `nitro.prerender.failOnError` is enabled so broken generated routes fail the
  build instead of silently producing 404 output.

## Project Layout

- `app/components/` contains shared UI, header/footer, home sections, and
  product components.
- `app/pages/` contains the generated routes.
- `app/data/` currently holds navigation/home/product registries.
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

Upload the contents of `.output/public` to Apache. Keep `public/.htaccess` in
the generated output: it canonicalizes `https://www.vitadiet.sa/`, preserves
legacy `/ar/` redirects, enforces trailing slashes for generated directories,
and avoids redirect chains.
