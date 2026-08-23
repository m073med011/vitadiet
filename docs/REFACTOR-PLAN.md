# Vitadiet Refactor Plan

**Audience:** the model/developer executing this refactor.
**Goal:** make the project organized, readable, scalable, and maintainable.

## How to use this document

Work **one phase at a time, in order**. Each phase is one git commit.

**After every phase from Phase 2 onward, run the gate:**

```bash
npx prettier --check . && npm run lint && npm run typecheck && npm run generate
```

**Commit only when all four pass.** Never combine phases. Never skip the gate.

If a phase's verification fails, fix it inside that phase. Do not carry a
broken gate into the next phase — the whole value of this sequencing is that
"the gate was green and now it isn't" tells you exactly which phase broke it.

---

## Context: why this work is happening

The site is a Nuxt 4 statically-generated bilingual (Arabic-default / English)
B2B supplement catalogue, deployed to Apache via `nuxt generate`. It works and
is SEO-tuned, but it grew without guardrails:

- **No tooling at all** — no linting, no formatting, no type checking. Style
  drifts file to file, and nothing catches dead code or type errors.
- **No single source of truth** — the site URL, brand name, phone, email,
  social links, logo path and schema.org `@id`s are each duplicated across
  3-6 files. The product slug list is triplicated, so adding a product means
  editing three places or silently shipping a broken page.
- **Logic living in the wrong layer** — a page component holds 150 lines of
  business logic; a leaf component mutates page-level schema.org; four files
  reimplement reduced-motion detection while an unused composable for it
  already exists.
- **Dead weight** — 119 of 233 translation keys are unreferenced, ~2.4 MB of
  images are never served, two dependencies are installed but unused, and a
  whole page branch is unreachable.
- **A latent production bug** — image folder names are mixed-case and don't
  match product slugs. The site is generated on Windows (case-insensitive) and
  served from Linux (case-sensitive), so these are live 404 risks.

The intended outcome: same site, same URLs, same structured data, but with one
definition per fact, logic in the right layer, and automated gates that keep it
that way.

---

## Stack facts you must know before editing

- **Nuxt 4.4.6**, `app/` as `srcDir` (not set explicitly — it is the v4 default).
- **Tailwind v4, CSS-first.** There is **no `tailwind.config.js`**. Design tokens
  live in an `@theme` block in `app/assets/css/_tokens.css`. Tailwind is wired
  through the Vite plugin, not a Nuxt module.
- **i18n**: `@nuxtjs/i18n` v10. Arabic is the **default** locale and serves from
  the root (`/`); English is prefixed (`/en/`). `strategy: 'prefix_except_default'`.
  Locale files are at `app/locales/` via `restructureDir: '.'` + `langDir`.
- **`@nuxt/image` with `provider: 'none'`** — there is no runtime image resizing.
  Responsive tiers are hand-made files (`sm_`, `xs_` prefixes).
- **`@nuxtjs/seo`** provides `useSiteConfig`, sitemap, robots, schema-org, og-image.
- **Two existing build guards** in `scripts/`, wired into `npm run build` and
  `npm run generate`. They are the primary safety net for this whole refactor:
  - `check-no-localhost.mjs` — fails if `localhost`/`127.0.0.1` leaks into
    prerendered HTML/XML/JSON (guards against `useRequestURL()` poisoning canonicals).
  - `check-schema-org.mjs` — asserts exactly one canonical `WebSite`/`Organization`/
    `ImageObject` node per page and correct cross-references between them.

**Read `scripts/check-schema-org.mjs` before touching any schema.org code.**

---

## Corrections to assumptions — read this before Phase 0

These are verified facts that contradict what a surface reading suggests.
Getting any of them wrong breaks the site.

1. **The `xs_*.webp` images ARE used.** `app/components/home/HomeHero.vue:134`
   derives them at runtime with `img.src.replace('sm_', 'xs_')`. A naive
   "delete unreferenced assets" scan is wrong in **both** directions: it flags
   all 9 `xs_` files as dead, and it *fails* to flag the 9 full-size banners
   (because `sm_vitadiet-foo.webp` contains `vitadiet-foo.webp` as a substring).
   **Never** auto-delete assets here. Use the explicit 16-path list in Phase 6.

2. **`categoryKeyBySlug` in `app/pages/product/[slug].vue:51-57` is dead AND broken.**
   None of its five i18n keys exist in `ar.json`/`en.json`, and none of its slugs
   are in `nitro.prerender.routes` — so on static Apache those URLs 404 before
   Nuxt is reached. If the branch *were* reachable it would render raw key strings.
   **Delete the whole `v-else` branch.** Do not extract it into a composable.

3. **You cannot collapse all five reduced-motion sites into one composable.**
   `app/router.options.ts` and `app/plugins/aos.client.ts` are not component setup
   contexts — `onMounted`/`onUnmounted` would leak or no-op there. You need **two**
   primitives sharing one query constant (spec in Phase 7).

4. **`'Vitadiet'` in the schema graph is NOT `$t('appName')`.** `ar.json.appName`
   is `فيتادايت`. The Latin literals are the deliberately locale-invariant legal
   brand name for JSON-LD. Name the constant `BRAND_NAME_LATIN` and **do not**
   "de-duplicate" it against `t('appName')` — that would silently change the
   Arabic Organization name.

5. **`mt-26`, `max-w-152`, `max-w-136` are not typos.** Tailwind v4 keeps the
   numeric `--spacing`-multiple scale alongside named tokens, so `mt-26` = 6.5rem
   and compiles fine. They are off-scale, not broken. Cosmetic only.

6. **`AppHeader.vue:13`'s raw shadow already has a token.**
   `shadow-[0_16px_40px_rgb(29,43,91,0.16)]` is exactly `--shadow-float`
   (`_tokens.css:95`) → substitute `shadow-float`. But `MobileSidebar.vue:15`'s
   `shadow-[4px_0_60px_rgba(27,56,97,0.18)]` has **no** token — it needs a new one.

7. **`#shared` alias already exists** in this install (verified in
   `.nuxt/tsconfig.app.json:122` and `.nuxt/tsconfig.shared.json:122`), but the
   `shared/` directory does not exist yet. From app code and Nitro, import
   `#shared/x`. From `nuxt.config.ts`, you **must** use a relative path
   (`./shared/x`) because aliases don't exist at config-load time.

8. **The root `tsconfig.json` does not currently typecheck `shared/` or `server/`.**
   It only extends `.nuxt/tsconfig.json`. Since the product registry moves into
   `shared/`, you must switch to project references in Phase 2 or the
   single-source file is unchecked.

9. **`nuxt typecheck` exists** (nuxi v3.37.0). Use it rather than hand-rolling
   `vue-tsc -p` — it handles the four-way project references for you.

10. **`homePage.why.petals.safety` carries "Long-Term Partnerships" copy.** This
    is consistent with `whoWeAre.petals.safety`, so `safety` is a legacy key name
    rendering intentional copy — not a bug. `homePage.why.petals.partnership` is
    a byte-identical unused duplicate and is safe to delete.

### Two latent bugs to fix along the way

- **Conflicting `og:image` dimensions.** `app/app.vue:66-68` sets 1080×356
  globally via `useHead`; `[slug].vue:120-121` sets 668×911 via `useSeoMeta`.
  These are different unhead dedupe channels. Fix in Phase 7 and assert the
  built HTML has exactly one of each tag.
- **A relative URL inside a breadcrumb.** `[slug].vue:141` correctly wraps its
  item in `new URL(...)`; `:142` does not. That is a real SEO bug. Fix in Phase 8.

---

## New files this refactor creates

### `shared/` — three zero-dependency leaf modules

**Hard rule: files in `shared/` may not import anything at all.** No `vue`, no
`lucide-vue-next`, no `#imports`. They are loaded by jiti inside
`nuxt.config.ts`, and any import pulls that dependency into config-load time.

These live at `shared/` root (not `shared/utils/`) deliberately, so that every
use site writes an explicit `import { X } from '#shared/y'`. Auto-import
collisions are painful to debug; explicit is better here.

`shared/products.ts`

```ts
export const PRODUCT_SLUGS = [
  'bestrong', 'becalme', 'vitagen', 'femavit', 'floradit',
  'green-pharmacy', 'dplus', 'soluro', 'flowadite',
] as const

export type ProductSlug = (typeof PRODUCT_SLUGS)[number]
```

`shared/site.ts`

```ts
export const SITE_URL = 'https://www.vitadiet.sa'
export const SITE_ORIGIN = `${SITE_URL}/`

/**
 * Latin legal/brand name used in JSON-LD and site.name.
 * NOT $t('appName') — the Arabic display name is فيتادايت.
 */
export const BRAND_NAME_LATIN = 'Vitadiet'

export const BCP47_BY_LOCALE = { ar: 'ar-SA', en: 'en-US' } as const
export type AppLocale = keyof typeof BCP47_BY_LOCALE

export const SCHEMA_ID = {
  organization: `${SITE_ORIGIN}#organization`,
  website: `${SITE_ORIGIN}#website`,
  logo: `${SITE_ORIGIN}#logo`,
} as const

export const absoluteUrl = (path: string, origin: string = SITE_URL): string =>
  new URL(path, origin).toString()
```

`shared/brand.ts`

```ts
export const CONTACT = {
  phone: '+966508178161',
  whatsappUrl: 'https://wa.me/966508178161',
  email: 'b2b@vitadiet.sa',
  vatId: '302135132900003',
  address: {
    streetAddress:
      'Palestine Street, Al Hamra District, Palestine Commercial Center, First Floor, Office No. 12',
    addressLocality: 'Jeddah',
    addressCountry: 'SA',
  },
} as const

/** Canonical social profiles. Single source for footer links AND Organization.sameAs. */
export const SOCIAL_URLS = {
  linkedin: 'https://www.linkedin.com/company/Vitadiet',
  instagram: 'https://www.instagram.com/Vitadiet.sa',
  tiktok: 'https://www.tiktok.com/@vitadiet.sa',
  x: 'https://x.com/Vitadiet_sa',
  snapchat: 'https://www.snapchat.com/add/Vitadiet',
} as const

export const ASSETS = {
  logo: '/images/vitadiet-official-logo.svg',
  ogImage: '/images/vitadiet-social-share-preview.png',
  catalog: '/vitadiet-catalog.pdf',
} as const

export const OG_IMAGE_SIZE = { width: 1080, height: 356 } as const

/**
 * Must stay in sync with --color-brand-primary in app/assets/css/_tokens.css.
 * A <meta> tag cannot read a CSS custom property.
 */
export const THEME_COLOR = '#1a7039'
```

**Why `shared/` and not `app/constants/` or `runtimeConfig`:**
`app/utils/*` is app-only — Nitro cannot alias into `app/`. And `runtimeConfig`
is for values that vary per environment (these don't) and is **not readable
from inside `nuxt.config.ts`'s own `nitro.prerender.routes` array**, so it
cannot solve the slug triplication at all. `shared/` is the only location
addressable by app code, Nitro, and the config file.

### Composables

```ts
// app/utils/motion.ts  — pure, no Vue lifecycle. For plugins / router.options.
export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'
export const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' && window.matchMedia(REDUCED_MOTION_QUERY).matches
```

```ts
// app/composables/useReducedMotion.ts — ALREADY EXISTS, currently unused.
// Keep the signature; rewire it to use REDUCED_MOTION_QUERY.
export function useReducedMotion(): { prefersReducedMotion: Ref<boolean> }
```

| Composable | File | Signature | Replaces |
|---|---|---|---|
| `useSiteUrls` | `app/composables/useSiteUrls.ts` | `() => { origin, absolute(path), canonical: ComputedRef<string>, organizationId, websiteId, logoId, logoUrl, ogImageUrl }` | the `#organization`/`#website`/`#logo` triplication and ~7 inline `new URL(x, siteUrl)` sites. Internally reads `useSiteConfig().url` — keep nuxt-site-config as the single runtime authority, since `check-no-localhost.mjs` exists to protect exactly that. |
| `useNavPath` | `app/composables/useNavPath.ts` | `() => { navPath: (item: NavItem) => string }` | the 3× `item.path ? localePath(item.path) : sectionPath(item.hash)` ternary. **Then delete `app/composables/useSectionPath.ts`.** |
| `useProductSeo` | `app/composables/useProductSeo.ts` | `(product: ComputedRef<HomeProduct>) => { pageName, metaDescription, imageUrl, offerPrice, priceValidUntil }` | the SEO logic in `[slug].vue`. Owns the `.description`→`.metaDescription` key swap, `META_DESCRIPTION_MAX = 160` with `slice(0, MAX - 3)`, and `parseOfferPrice`. Keep `useState('offer-price-valid-until')` — it exists to keep the prerendered payload and hydration consistent. |
| `useProductSchema` | `app/composables/useProductSchema.ts` | `(product: HomeProduct, seo: ReturnType<typeof useProductSeo>) => void` | the reactive `watchEffect` schema block. Takes a **plain** product, not a ref — see Phase 8 for why that is the fix, not a limitation. |
| `usePageSeo` | `app/composables/usePageSeo.ts` | `(input: { title: () => string; description: () => string; image?: () => string \| undefined; imageWidth?: number; imageHeight?: number }) => void` | the `useSeoMeta` quadruplication across the 3 pages. |

### Shared components

| Resolved name | File | Props | Replaces |
|---|---|---|---|
| `BaseSectionHeader` | `app/components/base/SectionHeader.vue` | `{ heading: string; description?: string; tone?: 'ink' \| 'primary' }` | the verbatim header block in `HomeFeatures:6-13`, `HomeProducts:4-11`, `HomeFaq:4-8`. `tone` exists because Features uses `text-brand-primary` and Products uses `text-ink`; Faq passes no `description`. |
| `FooterColumnHeading` | `app/components/footer/ColumnHeading.vue` | `{ label: string }` | `footer/Links.vue:3-5` and `footer/Contact.vue:3-5` — and drops both dead `\|\| 'Quick Links'` / `\|\| 'Contact Us'` fallbacks. |
| `FooterContactRow` | `app/components/footer/ContactRow.vue` | `{ icon: Component; href?: string; external?: boolean; dir?: 'ltr' \| 'rtl'; preLine?: boolean }` + default slot | the 4 near-identical rows in `footer/Contact.vue:8-37`. Renders `<a>` when `href` is present, `<div>` otherwise. |
| `ProductPriceBadge` | `app/components/product/PriceBadge.vue` | `{ priceKey: string; size?: 'sm' \| 'lg' }` | `product/Card.vue:27-30` + `product/Landing.vue:23-28`. Owns `isNumericPrice` and the `SaudiRiyalIcon`. |

### New guard scripts

`scripts/check-i18n-keys.mjs` — see Phase 3b.
`scripts/check-site-url-sync.mjs` — see Phase 4.

---

# The phases

## Phase 0 — Baseline and safety net

**Goal:** a known-good reference build and a hard prerender gate, with zero source changes.

1. In `nuxt.config.ts`, add `failOnError: true` inside `nitro.prerender`.

   This one line is the cheapest, highest-value guardrail in the whole plan.
   With it on, a slug that has no matching product entry becomes a hard build
   failure instead of a silently-prerendered 404 page.

2. Run `npm run generate`. It must pass.
   **If `failOnError` makes it fail, stop and report. Do not proceed.**
   (`nuxt-link-checker` ships with `@nuxtjs/seo` and may surface pre-existing
   broken links. Those need triaging before any refactor starts.)

3. Capture the baseline into a scratch directory **outside the repo**:
   - sorted file list of `.output/public/**`
   - SHA-256 of every `.output/public/**/*.html`
   - sorted `<loc>` list and total URL count from `.output/public/sitemap*.xml`
   - the count of Offer nodes across `.output/public/product/*/index.html` (expect **7**)
   - a full copy of `.output/public` as `baseline/`

**Verify:** `npm run generate` green with `failOnError: true`; baseline captured.

---

## Phase 1 — Formatting

**Goal:** one mechanical formatting commit, provably output-neutral.

Prettier goes **first**, and this is not a close call. The reason is not diff
size, it is **verifiability**: a whole-repo Prettier pass is the only change in
this entire refactor that is provably semantics-preserving in a way you can
check without judgement — *build before, build after, the HTML must be
byte-identical*. That proof is unavailable in every later phase, because every
later phase legitimately changes output. Running Prettier last instead would
bury real logic changes inside ~4,000 reformatted lines and destroy your ability
to tell whether an unexpected build diff came from the refactor or the formatter.

1. Add `prettier` as a devDependency.
2. `.prettierrc` — semi false, singleQuote true, printWidth 100
   (matches the dominant existing style).
3. `.prettierignore` — `.nuxt`, `.output`, `dist`, `node_modules`,
   `package-lock.json`, `public`, and **`app/locales`**.
   Locale files are excluded on purpose: reformatting Arabic-containing JSON is
   pure churn with a real risk of mangling i18n escape sequences.
4. `.editorconfig`.
5. Scripts: `format` running `prettier --write .`, and `format:check` running
   `prettier --check .`.
6. Run `npm run format`.

**Do NOT add `prettier-plugin-tailwindcss`.** Class reordering is semantically
safe in Tailwind, but it triples the size of an already-large commit, breaks the
byte-identical assertion below (the class attribute changes), and buys nothing.
Explicitly out of scope.

**Verify:** run `npm run generate`, then diff `.output/public` against `baseline/`.
**Every HTML file must be byte-identical.** If any differ, the formatter changed
semantics — revert and investigate. Do not skip this; it is the one unambiguous
proof available in this entire refactor.

---

## Phase 2 — Tooling gates and dependency hygiene

**Goal:** a green lint + typecheck baseline that every later phase must preserve.

Landing these *now*, before any refactor, is what makes them gates rather than
noise. If they arrive after the refactor they surface a hundred findings at once
and you cannot tell pre-existing from self-inflicted.

1. Add `@nuxt/eslint` to `modules`, configured with stylistic rules **off** so
   ESLint never fights Prettier over formatting. Create `eslint.config.mjs`
   extending `withNuxt()`.
2. devDependencies: `eslint`, `typescript`, `vue-tsc`, `prettier`.
3. Scripts: `lint` running `eslint .`, `lint:fix` running `eslint . --fix`,
   and `typecheck` running `nuxt typecheck`.
4. Replace the root `tsconfig.json` with project references — **required**, or
   `shared/` and `server/` are never checked at all:

   ```json
   {
     "files": [],
     "references": [
       { "path": "./.nuxt/tsconfig.app.json" },
       { "path": "./.nuxt/tsconfig.server.json" },
       { "path": "./.nuxt/tsconfig.shared.json" },
       { "path": "./.nuxt/tsconfig.node.json" }
     ]
   }
   ```

5. Dependency hygiene in `package.json`:
   - Remove `@nuxtjs/color-mode` (installed but absent from `modules`; zero references).
   - Remove `playwright-core` (no test harness references it).
   - Move `@nuxtjs/seo` from `devDependencies` to `dependencies` — it is a
     registered runtime module.
   - Run `npm install`.
6. Run `npm run lint:fix`, then fix residual errors by hand until zero.

**Bonus:** ESLint's default unused-vars rule finds most of the dead code and
auto-import inconsistency that Phase 3 targets, so this step does part of
Phase 3 for free.

**Verify:** all four gate commands green.
**Watch specifically:** removing `playwright-core` could in principle affect
`nuxt-og-image` (bundled by `@nuxtjs/seo`) if it ever selects the chromium
renderer. The `generate` step in the gate is what proves it doesn't. If it
breaks, put `playwright-core` back and note why in the commit message.

---

## Phase 3 — Deletions only

**Goal:** subtract. No new abstractions, no moves.

Doing deletion *before* extraction means you never build a composable around
code you are about to delete, and every later phase has a smaller surface to touch.

### 3a — Dead code

Mechanical, no judgement required:

- `AppHeader.vue:70` — remove the unused `handleScroll` destructure
  (`useScrollState` already registers its own listener internally).
- `HomeHero.vue:118` — remove the unused `ArrowRightIcon` import; line 126,
  remove the unused `sectionPath`.
- `HomeHero.vue:159-161` — remove the `.hero-panel` CSS rule (no element has that class).
- `HomeFaq.vue:116-118` — remove the RTL `.faq-trigger` rule (no such class
  exists; the button uses an id, not a class).
- `AppFooter.vue:24-25` — remove the empty script setup block.
- `nuxt.config.ts` — remove the empty `experimental: {}`.
- Delete the 0-byte `pagespeed.json`.
- Remove the two dead i18n fallbacks in `footer/Contact.vue:4` and
  `footer/Links.vue:4` — both keys exist and the translate helper never returns
  falsy, so those fallbacks can never fire.
- `AppHeader.vue:13` — replace the raw shadow with the `shadow-float` token.
- `HomeProducts.vue:197-213` — drop the five off-palette CSS var fallbacks.
  This is the only place in the repo that reintroduces off-palette colours.
- Name the AOS stagger magic numbers: a shared `AOS_STAGGER_MS = 80` (used in
  3 files), plus the `index * 100`, `index * 35`, and `400 + index * 100` values.
- **Normalize auto-imports:** remove every explicit
  `import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'` —
  Nuxt auto-imports all of them. **Keep** the `import type { Component }` type imports.

Two items in 3a that need a sentence of care:

- **`app/pages/product/[slug].vue` — delete the dead category branch.** Remove
  the entire `v-else` template block (lines 4-22) plus `categoryKeyBySlug`,
  `isCategorySlug`, `categoryName`, and `isKnownSlug`. The 404 becomes a single
  `createError` call guarded on `!product.value`. This alone takes the page from
  171 lines to roughly 65.
- **`HomeFaq.vue:96-97` — fix a real content bug.** The open-panel rule caps
  height at `32rem`, silently truncating any answer taller than that. Replace it
  with a `grid-template-rows: 0fr → 1fr` transition (or `interpolate-size:
  allow-keywords` with `max-height: max-content`).
- `app/data/home.ts:38` — delete the `export type { HomeProduct }` re-export
  (nothing imports it from here; consumers already use `~/types`).

### 3b — Dead i18n keys

**Do not hand-pick keys.** Write the guard first, let it produce the list.

Create `scripts/check-i18n-keys.mjs` implementing this algorithm:

1. Flatten `app/locales/ar.json` and `app/locales/en.json` to dotted leaf paths.
2. Assert the two key sets are identical (today both are 233, zero drift — a
   free parity guard).
3. Concatenate every `.vue` / `.ts` / `.mjs` file under `app/`, `server/`,
   `shared/`, `scripts/`, plus `nuxt.config.ts`. **Exclude `app/locales/**`**,
   or every key trivially references itself.
4. Allowlist the two genuinely-dynamic key sites:
   - prefix `homePage.whoWeAre.petals.` — built in `WhoWeAre.vue:52` from a
     template literal over `feature.key`
   - pattern `productDetails.<name>.metaDescription` — derived in `[slug].vue:88`
     by rewriting the `.description` suffix
5. A key is dead when the concatenated source does not contain it and no
   allowlist pattern matches it.
6. Exit non-zero if any dead keys remain, printing each one.

The allowlist is trustworthy rather than a fudge because both dynamic sites are
*closed*: `WhoWeAre` iterates a fixed 6-element array, and the metaDescription
rewrite is mechanically derived from a `descriptionKey` the type system already
requires.

Then:

1. Run the script. It should print exactly **119** keys. That printed list *is*
   the delete list.
2. **Before deleting, mirror those 119 keys to `docs/i18n-backlog.json`** in the
   same commit. These are professionally-translated Arabic marketing strings —
   an entire `stats` section plus `vision`, `values`, `coverage`, `partners`,
   `certificates`, `downloads`, `contactSection`, `trustBox`. They read as a
   content backlog, not garbage. The file lives outside `app/locales/` so the
   i18n `langDir` never loads it: zero bundle cost, and someone can actually
   find the copy in six months.
3. Delete the 119 keys from both `ar.json` and `en.json`.
4. Re-run the script: zero dead. Wire it into `package.json` as `test:i18n` and
   into `build` / `generate`, so any future orphaned key fails the build.

Note: `footer.contact.email` appears in the dead list because
`footer/Contact.vue:46` hardcodes the address. Phase 4's constant supersedes it,
so deleting it is correct.

Also delete `homePage.why.petals.partnership` — verified to be a byte-identical
unused duplicate of `homePage.why.petals.safety`. (The `safety` key name is a
legacy misnomer that renders intentional "Long-Term Partnerships" copy,
consistent with `whoWeAre.petals.safety`. Leave that one alone.)

### 3c — Documentation

- **Rewrite `README.md`.** It is currently untouched Nuxt starter boilerplate.
  Cover: what the project is, the `app/` srcDir layout, Tailwind-v4-CSS-first
  with no config file, the i18n strategy (Arabic at root, English at `/en`), the
  build guards and what each protects, and the Apache / `nuxt generate` deploy
  including the `.htaccess` contract.
- Consider gitignoring `skills-lock.json`.

**Verify:** gate green. The `.output/public` file list is unchanged vs baseline.
`node scripts/check-i18n-keys.mjs` reports zero dead. Both locale files now hold
114 keys with identical key sets.

---

## Phase 4 — Constants

**Goal:** one definition per fact.

Create `shared/site.ts` and `shared/brand.ts` (specs above), then rewire:

| File | Change |
|---|---|
| `nuxt.config.ts:37,113` | `site.url` and `i18n.baseUrl` to `SITE_URL`; `site.name` to `BRAND_NAME_LATIN`. Import **relatively**: `from './shared/site'` |
| `app/app.vue:8,9` | `ASSETS.ogImage`, `ASSETS.logo` |
| `app/app.vue:22-24` | `SCHEMA_ID.website` / `.organization` / `.logo` |
| `app/app.vue:29` | `BCP47_BY_LOCALE[locale.value]` |
| `app/app.vue:66-68` | `OG_IMAGE_SIZE` |
| `app/app.vue:73` | `THEME_COLOR` |
| `app/app.vue:85,103,109` | `BRAND_NAME_LATIN` |
| `app/app.vue:89-95` | `Object.values(SOCIAL_URLS)` — **this fixes a real divergence**: `social-links.ts:21` carries the TikTok URL with tracking params, `app.vue:92` has the clean form. Canonical is the **clean** form, in both places. |
| `app/app.vue:96-97` | `CONTACT.address`, `CONTACT.phone`, `CONTACT.email` (**acc@ becomes b2b@**), `CONTACT.vatId` |
| `footer/Contact.vue:15,46` | `CONTACT.whatsappUrl`, `CONTACT.email` (**acc@ becomes b2b@**) |
| `footer/Contact.vue:22` | use `CONTACT.phone` instead of the i18n key; then delete `footer.contact.phone` from both locale files (it is a phone number, not copy — identical in both) |
| `AppHeader.vue:63`, `footer/Brand.vue:44`, `MobileSidebar.vue:66` | `ASSETS.logo` |
| `HomeHero.vue:90` | `ASSETS.catalog` |
| `data/social-links.ts` | each `href` reads from `SOCIAL_URLS` |
| `[slug].vue:42` | `SCHEMA_ID.organization` |
| `pages/products.vue:17`, `[slug].vue:17` | `CONTACT.email` |
| `scripts/check-schema-org.mjs:12` | **leave hardcoded** — see below |

### Two things NOT to de-duplicate

**Leave `scripts/check-schema-org.mjs` and `public/.htaccess` hardcoded.** Apache
cannot import TypeScript, and a guard that imports the value it is guarding stops
guarding anything. Instead, add a fourth guard that converts unavoidable
duplication into *verified* duplication:

`scripts/check-site-url-sync.mjs` — read `shared/site.ts` as text, extract
`SITE_URL` by regex, then assert that every vitadiet URL occurrence in
`nuxt.config.ts`, `public/.htaccess`, and `scripts/check-schema-org.mjs` matches
that origin. Wire it into the `test:` scripts alongside the others.

**Do NOT extract the VAT number or street address out of `footer.contact.vat` /
`footer.contact.address`.** Those are localized prose with per-language labels
(Arabic vs English); templating a constant into them is high churn with a real
chance of breaking Arabic text direction around the digits. The
*machine-readable* values already come from `CONTACT` for the schema graph.

**Verify:** gate green. `node scripts/check-site-url-sync.mjs` passes.
Grepping `app/` and `scripts/` for `acc@vitadiet` returns nothing.
`b2b@vitadiet.sa` appears in the built home page. The TikTok URL appears in
exactly one form across the repo.

---

## Phase 5 — Single-source product registry

**Goal:** one list of slugs, enforced in both directions.

1. Create `shared/products.ts`.
2. `git mv app/data/home.ts app/data/products.ts`. Strip it to just the
   `products` array plus its product-image path constants, and type
   `slug: ProductSlug`.
3. Move `faqItems` to a new `app/data/faq.ts` **now** — Phase 8 needs the page
   to import it. (The other four presentational arrays move into their
   components in Phase 9.)
4. `nuxt.config.ts` — replace the 20 hardcoded prerender routes:

   ```ts
   import { PRODUCT_SLUGS } from './shared/products'

   const paths = ['/', '/products', ...PRODUCT_SLUGS.map(s => `/product/${s}`)]
   // ...
   routes: [...paths, ...paths.map(p => (p === '/' ? '/en' : `/en${p}`))],
   ```

   **Note the `/` special case.** A naive `'/en' + p` yields `/en/`, which is
   not what the current list contains.
5. `server/api/__sitemap__/urls.ts` — import `PRODUCT_SLUGS` from
   `#shared/products` and delete the local array.
6. Update the two importers of the old path: `pages/products.vue:26` and
   `pages/product/[slug].vue:26` now import from `~/data/products`.

**Why this is now genuinely single-source, not merely deduplicated:** a slug in
`PRODUCT_SLUGS` with no matching product entry becomes a hard build failure via
Phase 0's `failOnError`, and a product whose slug is not in `PRODUCT_SLUGS`
becomes a compile error via `slug: ProductSlug`. Both directions are mechanically
enforced.

**Verify:** gate green. The sitemap `<loc>` list is byte-identical to baseline.
The `.output/public` file list is identical to baseline. `PRODUCT_SLUGS` appears
in exactly three non-definition files.

**Caution:** the sitemap API currently emits un-prefixed product paths and relies
on the sitemap module's i18n integration to generate the `/en/` variants, so a
change here has non-obvious blast radius. **Diff the XML; do not reason about it.**

---

## Phase 6 — Image assets

**Goal:** make the responsive tiers explicit, fix the case hazards, delete dead bytes.
**Irreversible — do this carefully and in this order.**

### 6a — Kill the string-munging first

Replace each of the 9 `heroSection.images` entries with explicit fields:

```ts
{
  src: '/images/Banners/sm_....webp',
  srcMobile: '/images/Banners/xs_....webp',
  showOnMobile: true,
  class: '...',
}
```

Write **both** paths out literally for all 9 entries. Then `HomeHero.vue:131-135`
becomes a filter on `showOnMobile` mapping to `srcMobile`, which deletes both the
`img.src.replace('sm_', 'xs_')` munging and the `[0, 2, 5, 7].includes(index)`
literal-index selection.

**This step is what makes 6c safe** — after it, the `xs_` files are literally
referenced in source, so any future unreferenced-asset scan is correct.

### 6b — Folder casing and slug alignment

This is the **highest-severity item in the whole plan**: the site is generated on
Windows (case-insensitive) and served from Linux (case-sensitive), so a casing
mismatch is a live 404 on the production host.

Renames needed: `Becalme` → `becalme`, `Bestrong` → `bestrong`, `Dplus` → `dplus`,
`Femavit` → `femavit`, `Green` → `green-pharmacy`, `spasmail` → `floradit`.

The last two also fix folder names that do not match their product slug.
Also rename the file `floradit-spasmail-supplement-front-view.webp` →
`floradit-supplement-front-view.webp`.

**Every casing rename must be a two-step `git mv`**, because a single-step rename
on a case-insensitive filesystem is a no-op or an error:

```bash
git mv public/images/Products/Becalme public/images/Products/__tmp
git mv public/images/Products/__tmp   public/images/Products/becalme
```

Then update the 14 image path constants in `app/data/products.ts`.

### 6c — Delete exactly these 16 files, and nothing else

```
public/images/Banners/vitadiet-b2b-certified-medical-supplements.webp
public/images/Banners/vitadiet-beauty-and-collagen-nutrition.webp
public/images/Banners/vitadiet-herbal-digestive-health-formula.webp
public/images/Banners/vitadiet-immune-system-defense-capsules.webp
public/images/Banners/vitadiet-natural-energy-boost-vitamins.webp
public/images/Banners/vitadiet-premium-health-supplements-collection.webp
public/images/Banners/vitadiet-saudi-fda-approved-vitamins.webp
public/images/Banners/vitadiet-stress-relief-and-calm-supplements.webp
public/images/Banners/vitadiet-womens-daily-wellness-support.webp
public/images/Banners/temp_vitadiet-b2b-certified-medical-supplements.webp
public/images/Banners/sm_temp_vitadiet-b2b-certified-medical-supplements.webp
public/images/Banners/xs_temp_vitadiet-b2b-certified-medical-supplements.webp
public/images/do-distribution-logo-black.gif
public/images/footer/do-distribution-logo-black.gif
public/images/footer/do-distribution-logo-yellow.gif
public/images/icons/vitadiet-snapchat-social-icon.svg
```

That is roughly 2.4 MB. `public/images/footer/` and `public/images/icons/` become
empty and go away. The Snapchat SVG is dead because `data/social-links.ts:13`
inlines the path data directly.

**Verify:** gate green, plus the survivor assertion that actually matters —
**all 9 `xs_vitadiet-*.webp` files still exist and none contains `temp`**
(count them; must be 9). Also: no filename under `public/images` contains an
uppercase letter; `public/images` shrank by roughly 2.4 MB; the `.output/public`
HTML file list is identical to baseline; and no image reference in the built
output points at a missing file.

---

## Phase 7 — Composables

**Goal:** each cross-cutting behaviour defined exactly once.

1. **Reduced motion.** Create `app/utils/motion.ts` and rewire the existing
   `useReducedMotion.ts` to use `REDUCED_MOTION_QUERY`. Then replace the four
   inline reimplementations:
   - `plugins/aos.client.ts:6` and `router.options.ts:9` → the pure
     `prefersReducedMotion()` function (these are **not** component contexts,
     which is why they cannot use the composable).
   - `useMarquee.ts:151-154,168-170` and `product/Landing.vue:114,160-163,174-179`
     → the `useReducedMotion()` composable. In `useMarquee`, the local
     `let prefersReducedMotion` becomes a `.value` read inside `tick()` —
     reactive reads inside requestAnimationFrame are fine and simpler than the
     manual listener.
2. **`useSiteUrls.ts`** — rewire `app.vue:21-27`, `pages/products.vue:30,40`,
   `[slug].vue:41-42,96`.
3. **`useNavPath.ts`** — rewire `DesktopNav.vue:10`, `MobileSidebar.vue:38`,
   `footer/Links.vue:14`. **Then delete `app/composables/useSectionPath.ts`.**
4. **`useProductSeo.ts`** — move `pageName`, `metaDescription`, `imageUrl`,
   `offerPrice`, and `priceValidUntil` out of `[slug].vue`. Introduce
   `META_DESCRIPTION_MAX = 160` and slice at `MAX - 3`.
5. **`usePageSeo.ts`** — rewire `pages/index.vue:15-20`,
   `pages/products.vue:46-51`, `[slug].vue:114-126`.
   **While here, resolve the conflicting og:image dimensions** (see Corrections):
   decide whether the global `app.vue` values or the per-page values win, then
   assert the built HTML contains exactly one `og:image:width` and one
   `og:image:height` per page.
6. **`app/types/page-meta.d.ts`** — add the type augmentation for
   `headerSticky`, which is currently set in `[slug].vue:30` and read in
   `AppHeader.vue:5-6` with no typing at all. **Both** blocks are needed: the
   `#app` `PageMeta` augmentation types `definePageMeta`, and the `vue-router`
   `RouteMeta` augmentation types `route.meta.headerSticky`.

**Verify:** gate green. Grepping `app/` for `prefers-reduced-motion` returns only
`app/utils/motion.ts` and the CSS files (the CSS media queries are correct and
stay). Grepping `app/` for `new URL(` returns only `useSiteUrls.ts`. The three
schema `@id` strings are built in exactly one place. Review the `.output/public`
HTML diff against baseline by eye and be able to explain every difference.

---

## Phase 8 — Schema.org (do this alone)

**Goal:** page-level schema owned by pages; no reactive re-registration.

This is the highest-risk phase. **Never combine it with another phase.** It is
guarded by `scripts/check-schema-org.mjs`, which runs automatically in the gate.

1. **Move the FAQPage schema out of the leaf component.** Move
   `defineWebPage({'@type': ['WebPage','FAQPage']})` and the three question nodes
   from `home/HomeFaq.vue:77-85` into `pages/index.vue`, importing `faqItems`
   from `~/data/faq` (moved there in Phase 5). `HomeFaq.vue` keeps only its
   accordion state. A leaf component mutating page-level schema is the problem
   being fixed here.

2. **De-reactify the product schema.** Extract `[slug].vue:132-170` into
   `useProductSchema.ts` as a **single top-level `useSchemaOrg([...])` call with
   getter-valued leaf fields** — exactly the pattern `app.vue:86,101,110` already
   uses successfully. Delete the `watchEffect`.

   *Why calling it once is correct, not a regression:* the conditional `offers`
   block is the only thing that looked like it needed reactivity. `offerPrice` is
   null exactly when the translated price string contains no digits — and in both
   locale files, `soluro` and `flowadite` are "coming soon" while the other seven
   are numeric. So the presence or absence of `offers` is locale-invariant and
   static per slug. Under `nuxt generate`, each locale's page is a fresh render
   anyway. A plain conditional spread with getters on the leaf values
   (`price`, `priceValidUntil`) is correct.

3. Replace the inline `locale.value === 'ar' ? 'ar-SA' : 'en-US'` with
   `BCP47_BY_LOCALE`.

4. **Fix the relative breadcrumb URL.** `[slug].vue:141` correctly wraps its item
   in an absolute URL; line 142 does not. Make both absolute.

**Verify:** gate green (`check-schema-org.mjs` runs automatically), plus these
explicit assertions:
- `.output/public/index.html` and `/en/index.html` each contain `FAQPage` and
  exactly three `Question` nodes.
- `.output/public/products/index.html` contains **no** `FAQPage`.
- Offer node count is 7 across `product/*/index.html`, and 7 again across
  `en/product/*/index.html`.
- No relative breadcrumb item (no `"item":"/`) anywhere in the built HTML.
- `npm run test:urls` passes — no localhost leak from the reshuffled URL construction.

---

## Phase 9 — Components

**Goal:** deduplicate markup, split by cohesion, unify naming.

This phase has the largest markup churn, which is why it comes after the schema
and data work — a mistake here cannot be confused with a schema or registry mistake.

### 9a — Extract the four shared components

Build the four components from the table above and rewire all call sites.

### 9b — Split the four giant components

Split by **cohesion**, not line count. Each split point below is a real seam:

- **`home/HomeHero.vue`** (323 lines) → `home/Hero.vue` (badge, h1, CTAs, trust
  list) + `home/HeroDesktopGallery.vue` + `home/HeroMobileMarquee.vue`. The seam
  is genuine: two mutually-exclusive presentations (`lg:block` / `lg:hidden`)
  with completely disjoint CSS.
- **`home/HomeFeatures.vue`** (311 lines) → `home/Features.vue` (petal grid) +
  `home/QualityPanel.vue`. Two unrelated sections currently sharing one file.
- **`home/HomeProducts.vue`** (224 lines) → `home/Products.vue` (header + CTA) +
  `home/ProductCarousel.vue` (owns `useMarquee`, the SSR-fallback branch, focus
  handling, and all carousel CSS).
- **`product/Landing.vue`** (186 lines) → extract `product/ImageRotator.vue`
  with props `{ images: string[]; alt: string }`, owning the rotation timer,
  `useReducedMotion`, `IMAGE_ROTATION_DELAY`, the transition, and the gallery wiring.

### 9c — Dissolve `app/data/home.ts`

Five of its six arrays are presentational config for exactly one component. Moving
them into their components makes three separate problems evaporate rather than
needing fixes — the Tailwind-classes-embedded-in-data problem, the
`icon: string` + `petalIconMap` indirection, and the two-competing-icon-conventions
problem:

| Export | Destination |
|---|---|
| `heroSection` (+ the 24 path aliases + embedded Tailwind classes) | local const in `home/HeroDesktopGallery.vue` |
| `whyPetals` + `petalIconMap` | local const in `home/Features.vue`, with **direct icon component imports** — this deletes the name-string-to-map lookup and its unconstrained-key problem outright |
| `qualitySteps` | local const in `home/QualityPanel.vue` |
| `aboutFeatures` | local const in `home/WhoWeAre.vue` |
| `faqItems` | already moved to `app/data/faq.ts` in Phase 5 |
| `products` | already moved to `app/data/products.ts` in Phase 5 |

`app/data/home.ts` ceases to exist. Final `app/data/`: `products.ts`,
`navigation.ts`, `social-links.ts`, `faq.ts`.

### 9d — Types

In `app/types/index.ts`: fix the broken indentation at line 25, add a `FaqItem`
interface, and change `HomeProduct.slug` from `string` to `ProductSlug` imported
from `#shared/products`.

### 9e — Props cleanup

- **`base/BaseButton.vue`** is the only component still using runtime
  `defineProps({...})` with a validator; all 18 others use typed generics.
  Convert to `withDefaults(defineProps<{ variant?: 'primary' | 'secondary' |
  'icon' | 'none'; to?: string | RouteLocationRaw; href?: string; nativeType?:
  'button' | 'submit' | 'reset' }>(), { variant: 'primary', nativeType: 'button' })`.
  The runtime validator becomes a compile-time union — strictly better.
- **`product/Card.vue`** declares `ariaHidden` and `tabIndex` props only to
  re-emit them through a manual `extraAttrs` computed. Delete both props and the
  computed; let fall-through attrs handle it.
  **Gotcha:** `HomeProducts.vue:59` must change `:tab-index` to `:tabindex`,
  because fall-through attrs are not camelCase-normalized the way declared props
  are. `:aria-hidden` already works as-is.

### 9f — Naming

Pure `git mv`, with **zero** call-site changes, because Nuxt's directory-prefixed
component names are unaffected: `home/HomeHero.vue` → `Hero.vue`,
`HomeFeatures.vue` → `Features.vue`, `HomeProducts.vue` → `Products.vue`,
`HomeFaq.vue` → `Faq.vue`. This makes `home/` consistent with `footer/`,
`header/`, and `product/`, which all rely on the folder for the prefix.

**Verify:** gate green. Confirm every lazy component reference in
`pages/index.vue` still resolves — **a name typo here fails silently as an empty
render**, so grep the built HTML for a known translated string from each section
rather than trusting the build. Then run `npm run dev` and confirm the carousel
still works on both `/` and `/en`, in both RTL and LTR.

---

## Phase 10 — Tokens, hardcoded strings, error page

**Goal:** the cosmetic tail. Visual regressions are expected and accepted here.

1. **New shadow token.** Add `--shadow-sidebar: 4px 0 60px rgb(27 56 97 / 0.18)`
   to `_tokens.css` and use it in `MobileSidebar.vue:15`. (Unlike the header
   shadow, this one has no existing token equivalent.)
2. **Bring stragglers onto the token scale.** `home/WhoWeAre.vue`,
   `pages/products.vue`, and `[slug].vue` currently ignore the design tokens
   their siblings use: convert raw `py-16 md:py-24` to the `py-section` scale,
   `text-4xl` to `text-heading-lg`, and so on.
3. **Name the remaining magics.** In `WhoWeAre.vue`, the circle circumference
   `312` appears as both a template attribute and a CSS value — make it one
   shared constant so the two cannot drift.
4. **i18n the hardcoded strings.** Add keys to **both** locale files and rewire:
   - `a11y.homeLink`, `a11y.openMenu`, `a11y.closeMenu`, `a11y.logoAlt` —
     currently English-only aria-labels and alt text on a bilingual site
     (`AppHeader.vue:17,21,38`, `MobileSidebar.vue:21,26`, `footer/Brand.vue:3,4`)
   - `langSwitcher.short` / `langSwitcher.long` — `LangSwitcher.vue:44-46`
     hardcodes the language names
   - `catalog.filename` — `HomeHero.vue:90` hardcodes an **Arabic** PDF download
     filename that is currently served to English visitors too
   - `error.notFound` — the `[slug].vue` 404 `statusMessage`
5. **Add `app/error.vue`.** There is currently none, and no `ErrorDocument` in
   `public/.htaccess`, so any URL outside the prerender list gets a bare Apache
   404 with no layout, locale, or header. Create the error page (layout + locale
   + a link home), add `ErrorDocument 404 /404.html` to `.htaccess`, and add
   `/404.html` to the prerender routes.
6. **Prune two config guesses.** Check whether
   `vite.vue.template.transformAssetUrls.BaseImage` does anything — every `src`
   reaching `BaseImage` is a runtime string from a data file, and
   `transformAssetUrls` only rewrites literal template attributes. If the build
   is unaffected without it, delete it. Ask the same question of the
   `@vue/devtools-*` entries in `optimizeDeps.include`.

**Verify:** gate green. Grepping `app/` for the removed English literals
("Vitadiet home", "Open menu", "Close menu", "Vitadiet Logo", "Page Not Found")
returns nothing. No Arabic remains in any `download=` or `aria-label=` attribute
in the `/en/` output. `.output/public/404.html` exists.

---

## Summary: what changes structurally

**New directories:** `shared/` (3 files), `docs/`.

**New files:** 3 shared constants modules, 5 composables, 1 util, 4 shared
components, 6 split components, 1 type augmentation, 1 error page, 2 guard
scripts, plus tooling config (`eslint.config.mjs`, `.prettierrc`,
`.prettierignore`, `.editorconfig`).

**Deleted:** `app/data/home.ts`, `app/composables/useSectionPath.ts`,
`pagespeed.json`, 119 i18n keys, 16 image files (~2.4 MB), 2 npm dependencies,
and the unreachable category branch.

**Guards after this work — all wired into `build` / `generate`:**

| Guard | Protects |
|---|---|
| `check-no-localhost.mjs` | canonical URLs never leak a dev origin |
| `check-schema-org.mjs` | the JSON-LD graph stays single-rooted and cross-referenced |
| `check-i18n-keys.mjs` | no orphaned or missing translation keys, and ar/en parity |
| `check-site-url-sync.mjs` | the site URL stays consistent across TS, config, and Apache |
| `nitro.prerender.failOnError` | every registered slug actually renders |
| `nuxt typecheck` | `shared/`, `server/`, and app code all type-check |
| `eslint` | no dead code or unused imports |
| `prettier --check` | consistent formatting |

**Ordering rationale in one line each:**
Prettier first (only phase with a byte-identical proof) → tooling second (creates
the gate) → deletions third (never refactor code you are about to delete) →
constants fourth (everything downstream reads from it) → registry fifth (needs
typechecked `shared/`) → assets sixth (irreversible, and needs the registry) →
composables seventh (needs constants) → schema eighth (highest risk, isolated) →
components ninth (largest churn, so failures are unambiguous) → cosmetics last.
