# Vitadiet — SEO Audit Report

**Date:** 2026-06-02
**Stack:** Nuxt 4 (SSG via `nuxt generate`), `@nuxtjs/seo`, `@nuxtjs/i18n` (en/ar), `@nuxt/image`
**Site:** https://vitadiet.sa
**Scope:** Full project analysis — config, pages, components, structured data, i18n, assets.

---

## Summary

The site has a **solid SEO foundation**: SSG prerendering, the `@nuxtjs/seo` module, per-page titles/descriptions, Open Graph + Twitter cards, Organization & Product schema, a dynamic sitemap, and proper i18n with `prefix_except_default`. The issues below are mostly **gaps and small bugs**, not a broken setup. They are ordered by impact.

Legend: 🔴 High · 🟡 Medium · 🟢 Low

---

## 🔴 High priority

### 1. No hreflang / per-locale canonical tags emitted
The app uses `@nuxtjs/i18n` with `en` + `ar`, but **`useLocaleHead()` is never called anywhere** (confirmed: no references in `app/`). Without it, the EN and AR versions of each page do not advertise each other via `rel="alternate" hreflang=...`, and `x-default` is missing. Google may treat the two language versions as duplicates or fail to serve the right one by region.

**Fix:** In `app/app.vue`, merge i18n head data into `useHead`:
```ts
const head = useLocaleHead({ addDirAttrs: true, addSeoAttributes: true })
useHead(() => ({
  htmlAttrs: head.value.htmlAttrs,
  link: head.value.link,    // canonical + hreflang alternates
  meta: head.value.meta,    // og:locale alternates
}))
```
This also lets you drop the manual `htmlAttrs.lang/dir` and `og:locale` logic in `app.vue` (they'd be duplicated).

### 2. `robots.txt` was deleted and not replaced
`git status` shows `D public/robots.txt`. The `@nuxtjs/seo` (nuxt-robots) module *does* generate a virtual `/robots.txt`, so you're likely still covered at runtime — **but verify after build**. If the generated route is missing in the static output, crawlers get a 404 and the sitemap reference is lost.

**Fix:** Confirm `/robots.txt` exists in `.output/public` after `nuxt generate`. The `robots` config in `nuxt.config.ts` already declares the sitemap, so once present it's correct. Do **not** re-add a static `public/robots.txt` (it would conflict with the module).

### 3. Product pages have **no Open Graph / Product image**, and a likely-broken slug
- `app/pages/product/[slug].vue` sets title/description and `defineProduct` schema, but **no `ogImage`**. Social shares and `Product` rich results fall back to the generic site OG image instead of the actual product photo. The `defineProduct` schema also has **no `image`** property, which Google flags as a recommended field for Product structured data.
- **Slug mismatch:** the product list (`app/data/home.ts`) and sitemap (`server/api/__sitemap__/urls.ts`) both use slug **`floradit`**, but `nuxt.config.ts` `prerender.routes` seeds **`/product/floradite`** (extra `e`). The prerendered route `floradite` does not exist in `products[]`, so it renders the empty *category* fallback. Meanwhile `flowadite` (a real product) is **not in the prerender seed list** at all — it relies on crawlLinks. Align all three lists.

**Fix:** Add to `[slug].vue`:
```ts
const productImageUrl = computed(() =>
  product.value ? new URL(product.value.image, requestUrl.origin).toString() : undefined
)
useSeoMeta({ ogImage: () => productImageUrl.value })
// and pass `image: productImageUrl.value` into defineProduct(...)
```
And reconcile slugs across `home.ts`, `urls.ts`, and `nuxt.config.ts` prerender routes.

---

## 🟡 Medium priority

### 4. Single-page-app architecture limits indexable content
The product carousel, "who we are", features, and contact are **all sections of the home page** (`#who-we-are`, `#why`, `#products`, `#footer`) — nav links are hash anchors, not real routes. There is effectively **one rich content page** plus thin product detail pages. This caps the number of keyword-targetable URLs.

**Recommendation:** Consider promoting "About" and a real "Products" listing to indexable routes with unique titles/descriptions. (Lower urgency for a B2B brochure site, but it's the main ceiling on organic reach.)

### 5. `/products` page is thin and duplicative
`app/pages/products.vue` is a heading + paragraph + mailto CTA — it does **not list the products**. It competes with the home `#products` section for the same intent but offers less. Either make it the canonical product index (render the grid, link to each `/product/[slug]`) or `noindex` it.

### 6. Product `descriptionKey` content is newline-delimited marketing copy
Descriptions like `"Provides natural energy...\nHelps improve focus...\n..."` are pushed verbatim into `<meta name="description">` and `defineProduct.description`. Meta descriptions render `\n` as spaces and get truncated at ~160 chars, so the snippet becomes a run-on. **Add a dedicated short `metaDescriptionKey`** (≤155 chars, single sentence) per product, separate from the on-page bullet copy.

### 7. `defineProduct` Offer omits required `priceValidUntil` / merchant data; price parsing is fragile
`offerPrice` strips non-digits from a translated string (`raw.replace(/[^\d.]/g, '')`). For Arabic locale, prices may contain Arabic-Indic digits (٠١٢…) which `\d` and this regex **won't match**, silently dropping the Offer. Also Google's Offer rich result recommends `priceValidUntil`. Verify AR price strings and add the field.

### 8. OG image dimensions are hardcoded and may be wrong
`app.vue` declares `og:image:width 1080 / height 356` for `ogimage.png`. If the actual asset isn't exactly 1080×356, Facebook/LinkedIn may render it cropped or skip it. 356px height is also **below the recommended 630px** for `summary_large_image` — the card may downgrade to a small thumbnail. Regenerate a 1200×630 OG image and update the dims.

### 9. `nuxt/image` has no `domains` allowlist for Noon links — and product images aren't optimized through it
`BaseImage` is a **plain `<img>`**, not `<NuxtImg>`. So despite `@nuxt/image` being configured (`format: webp, quality: 80`), product/hero images are served as-is (the raw `.jpg/.png/.webp` imports). This hurts LCP and Core Web Vitals (a ranking factor). Either route images through `<NuxtImg>`/`<NuxtPicture>`, or accept the manual `.webp` conversion you've started (the new `Banners/*.webp` files in `git status`) and document it.

---

## 🟢 Low priority / polish

### 10. Missing favicon variants & web app manifest
Only `favicon.ico` exists. No `apple-touch-icon`, no `<link rel="icon">` for SVG/PNG, no `site.webmanifest`. Organization schema `logo` points at `/favicon.ico` — Google prefers a **square PNG/SVG logo ≥112px**, not an ICO. Point `logo` at `logo.svg` (or a dedicated 512px PNG) and add icon links.

### 11. `og:title` / `twitter:title` use `welcome`, not the page title
In `app.vue` the global OG/Twitter title is `t('welcome')` ("Vitadiet: European Quality..."), while the page `<title>` uses `seoTitle`. Per-page `useSeoMeta` overrides do fix this on home/product pages, but the global default is inconsistent. Minor, but align them.

### 12. Decorative hero images use heading text as `alt`
In `HomeHero.vue`, the mobile gallery images use `:alt="$t('homePage.hero.heading')"` and the container is `aria-hidden="true"` — repeating the H1 across many decorative images is redundant for SEO and screen readers. Decorative images should have empty `alt=""`. The desktop set already hardcodes an English alt (`"Certified supplement portfolio..."`) that **doesn't localize** for Arabic — also worth fixing or emptying.

### 13. Gallery thumbnails share identical `alt`
In `ProductLanding.vue`, every gallery image and thumbnail uses the same `$t(product.titleKey)` alt. Duplicate alt text across multiple images on one page is low-value. Differentiate (e.g. "{product} — front", "{product} — supplement facts") or empty the redundant ones.

### 14. No `BreadcrumbList` schema
Product pages would benefit from breadcrumb structured data (Home › Products › {Product}) for richer SERP display. Add `defineBreadcrumb` in `[slug].vue`.

### 15. Schema `sameAs` social URLs may be placeholders
`app.vue` lists LinkedIn/Instagram/TikTok/X with mixed-case handles (`company/Vitadiet`, `Vitadiet.sa`). Verify each resolves to a real, live profile — broken `sameAs` links weaken entity trust signals.

---

## Verified as already correct ✅
- SSG prerendering enabled (`nitro.prerender.crawlLinks`), good for crawlability.
- Per-page `useSeoMeta` with i18n-reactive title/description on home, products, and product pages.
- `titleTemplate` appends brand suffix; page titles correctly kept brand-free.
- Dynamic sitemap via `server/api/__sitemap__/urls.ts`, wired into `sitemap.sources`.
- Organization + WebSite schema with NAP, phone, VAT ID, address.
- `lang`/`dir` html attributes switch with locale; RTL handled.
- Outbound Noon buy-links correctly use `rel="noopener noreferrer nofollow sponsored"`.
- One `<h1>` per page (no multiple-H1 issue found).
- Immutable cache headers on `/_nuxt`, `/_fonts`, `/images`.

---

## Suggested fix order
1. hreflang/canonical via `useLocaleHead` (#1)
2. Verify `/robots.txt` post-build (#2)
3. Product OG/Product-schema image + slug reconciliation (#3)
4. OG image 1200×630 (#8) + short meta descriptions (#6)
5. Arabic price parsing for Offer schema (#7)
6. Image optimization strategy decision (#9)
7. Favicon/manifest + logo (#10), breadcrumbs (#14), alt-text cleanup (#12, #13)
