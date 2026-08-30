import { getProducts } from '~/services/product-catalog'

/**
 * The one catalog read for the whole app, per the contract in docs/PRODUCT-DATA-MODEL.md:
 * nothing outside the service layer touches `~/data/products`.
 *
 * Every consumer shares the `product-catalog` key, so the list resolves once during
 * prerender, is serialised once into the payload, and is reused on the client instead of
 * being re-resolved per component. Callers must `await` it: without that the server would
 * render the `[]` default and the client would then hydrate over different markup.
 */
export const useProductCatalog = () =>
  useAsyncData('product-catalog', () => getProducts(), { default: () => [] })
