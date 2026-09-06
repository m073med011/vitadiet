import { toFeaturedProducts } from '~/services/product-api'
import type { FeaturedProductView } from '~/services/product-api'
import type { ApiCollection, ApiFeaturedProduct } from '#shared/api'

/**
 * The curated home page strip: `GET /featured-products?lang=<locale>`, ordered by
 * `sort_order`.
 *
 * A card is a presentation record, not a product record - the endpoint sends its own
 * title, intro line, benefit line and image. Resolving a card to a catalog product is
 * the caller's job, because it needs the product list and the strip does not.
 */
export const useFeaturedProducts = () =>
  useApi<ApiCollection<ApiFeaturedProduct>, FeaturedProductView[]>('featured-products', 'get', {
    transform: (response) => toFeaturedProducts(response.data ?? []),
  })
