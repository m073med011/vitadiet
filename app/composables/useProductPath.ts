export const useProductPath = () => {
  const localePath = useLocalePath()
  const productPath = (slug: string) => localePath(`/product/${slug}/`)

  return { productPath }
}
