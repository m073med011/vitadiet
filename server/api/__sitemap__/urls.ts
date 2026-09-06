import type { SitemapUrlInput } from '#sitemap/types'
import type { ApiCollection, ApiProductListItem } from '#shared/api'

/** Matches `MAX_COLLECTION_PAGES` in `app/composables/useApi.ts`. */
const MAX_PAGES = 25

/**
 * Product URLs for the sitemap, read from the Dashboard rather than from a slug list in
 * the repository: the API is the catalog now, so a product added there reaches the
 * sitemap on the next build without a code change.
 *
 * The pages themselves are prerendered by crawling `/products/`, which links to all of
 * them. This handler exists so those URLs also carry a `lastmod` and a priority - and it
 * walks `links.next` for the same reason the client does, because a sitemap that stops at
 * Laravel's fifteenth product is worse than no sitemap entry at all.
 *
 * Locale prefixes are added by @nuxtjs/sitemap from the i18n config, so `loc` is the
 * unprefixed path.
 */
export default defineSitemapEventHandler(async (event) => {
  const { apiBaseUrl } = useRuntimeConfig(event).public
  const lastmod = new Date().toISOString()
  const slugs: string[] = []
  let next: string | null = 'products'

  for (let page = 0; next && page < MAX_PAGES; page += 1) {
    // The cast undoes `$fetch`'s route-table lookup, which types a bare string request as
    // an internal Nitro route. This one is external, so the generic is the only
    // description of the body - and inferring against the route table blows the type
    // instantiation depth on a URL that is not in it.
    const response = (await $fetch<ApiCollection<ApiProductListItem>>(next, {
      baseURL: apiBaseUrl,
      headers: { accept: 'application/json' },
    })) as ApiCollection<ApiProductListItem>

    slugs.push(...(response.data ?? []).map((product) => product.slug).filter(Boolean))
    next = response.links?.next ?? null
  }

  return slugs.map<SitemapUrlInput>((slug) => ({
    loc: `/product/${slug}/`,
    lastmod,
    changefreq: 'weekly',
    priority: 0.8,
  }))
})
