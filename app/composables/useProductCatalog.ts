import { dropStaleLocaleData, fetchApiCollection } from '~/composables/useApi'
import { toProducts } from '~/services/product-api'
import type { Product } from '~/types'
import type { ApiProductListItem } from '#shared/api'

/**
 * The one product-list read for the whole app: `GET /products?lang=<locale>`, every page
 * of it, mapped into `Product[]` by `~/services/product-api`.
 *
 * Every consumer shares the `product-catalog` key, so the list resolves once during
 * prerender, is serialised once into the payload, and is reused on the client instead of
 * being re-fetched per component. Callers must `await` it: without that the server would
 * render an empty grid and the client would then hydrate over different markup.
 *
 * `data` is never null - a pending or failed read is an empty catalog - so a section can
 * iterate it without a guard and decide for itself whether to render at all. `status` and
 * `error` are there for the pages that distinguish the two, like `/products/`.
 *
 * The rows are thin by design: slug, title, subtitle, price, availability, front image.
 * A product page needs `useProduct()`, which reads the detail endpoint.
 */
export const useProductCatalog = () => {
  const { locale } = useI18n()
  const apiFetch = useApiFetch()

  // The locale belongs in the key, not in `watch`: a changing key already refetches, and
  // watching the locale as well is a second trigger for the one switch.
  const asyncData = useAsyncData(
    () => `product-catalog:${locale.value}`,
    async () => toProducts(await fetchApiCollection<ApiProductListItem>(apiFetch, 'products')),
    { default: (): Product[] => [] },
  )

  // Without this the grid keeps rendering the previous language's rows for the length of
  // the new request, because Nuxt seeds a new key with the old key's data. An empty grid
  // that fills in is honest; the wrong language is not. See `dropStaleLocaleData()`.
  dropStaleLocaleData(asyncData, locale, (): Product[] => [])

  return asyncData
}
