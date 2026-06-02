import { defineSitemapEventHandler } from '#imports'
import type { SitemapUrlInput } from '#sitemap/types'

/**
 * Product slugs surfaced to the sitemap. Kept inline (not imported from
 * app/data/home.ts) so the server bundle doesn't pull in image asset imports.
 */
const productSlugs = [
  'bestrong',
  'becalme',
  'vitagen',
  'femavit',
  'floradit',
  'green-pharmacy',
  'dplus',
  'soluro',
  'flowadite',
]

export default defineSitemapEventHandler(() => {
  return productSlugs.map<SitemapUrlInput>((slug) => ({
    loc: `/product/${slug}`,
  }))
})
