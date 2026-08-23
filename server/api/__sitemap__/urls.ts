import type { SitemapUrlInput } from '#sitemap/types'
import { PRODUCT_SLUGS } from '#shared/products'

export default defineSitemapEventHandler(() => {
  const lastmod = new Date().toISOString()

  return PRODUCT_SLUGS.map<SitemapUrlInput>((slug) => ({
    loc: `/product/${slug}/`,
    lastmod,
    changefreq: 'weekly',
    priority: 0.8,
  }))
})
