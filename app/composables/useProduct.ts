import { toProductDetail } from '~/services/product-api'
import type { MaybeRefOrGetter } from 'vue'
import type { Product } from '~/types'
import type { ApiProduct, ApiResource } from '#shared/api'

/**
 * One product in full: `GET /products/{id_or_slug}?lang=<locale>`.
 *
 * The endpoint accepts either identifier, so this takes whatever the route matched. The
 * response carries the description, the four prose sections, the FAQ, the purchase links
 * and the related products - everything the list endpoint leaves out.
 *
 * `data` is `null` while pending and on a failed request; the page turns a resolved-but-
 * absent product into a 404 and lets a transport failure stay a 500.
 */
export const useProduct = (slug: MaybeRefOrGetter<string>) =>
  useApi<ApiResource<ApiProduct>, Product>(() => `products/${toValue(slug)}`, 'get', {
    transform: (response) => toProductDetail(response.data),
    watch: [() => toValue(slug)],
  })
