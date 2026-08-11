/**
 * The only internal URL format for product detail pages.
 * `localePath` keeps the visitor in the active locale and i18n's trailingSlash
 * policy maps it directly to the generated directory URL (HTTP 200).
 */
export const useProductPath = () => {
  const localePath = useLocalePath()
  const productPath = (slug: string) => localePath(`/product/${slug}/`)

  return { productPath }
}
