import type { SitemapUrlInput } from '#sitemap/types'

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
  const lastmod = new Date().toISOString()

  return productSlugs.map<SitemapUrlInput>((slug) => ({
    loc: `/product/${slug}/`,
    lastmod,
    changefreq: 'weekly',
    priority: 0.8,
  }))
})
