/**
 * Legal document slugs live in `shared/` for the same reason product slugs do:
 * `nuxt.config.ts` needs them to prerender the routes, and it cannot import from
 * `app/` where the `~/types` alias is unavailable.
 *
 * A slug is a published URL. Removing or renaming one requires an approved 301 in
 * `public/.htaccess`, exactly like a product slug.
 */
export const LEGAL_SLUGS = [
  'privacy-policy',
  'terms-of-use',
  'cookies-policy',
  'medical-disclaimer',
] as const

export type LegalSlug = (typeof LEGAL_SLUGS)[number]
