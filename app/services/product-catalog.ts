import type { AppLocale } from '#shared/site'
import type {
  ApprovalStatus,
  ApprovedCopy,
  HomeProduct,
  LocalizedCopy,
  ProductCatalogItem,
  ProductFact,
  ProductImageAsset,
  ProductIngredient,
  ProductPrice,
  ProductPurchaseOption,
  PurchaseAvailability,
} from '~/types'

export const isApproved = (status?: ApprovalStatus): boolean => status === 'approved'

/**
 * Single read path for the product list. Today it resolves the bundled catalog, so it
 * settles during SSR and the markup never waits on the client. Swapping the body for a
 * `$fetch` against the future Dashboard API needs no change in the pages, because they
 * already handle the pending and error branches this signature implies.
 */
export const getProducts = async (): Promise<HomeProduct[]> => {
  const { products } = await import('~/data/products')
  return products
}

export const getProductBySlug = async (slug: string): Promise<HomeProduct | undefined> => {
  const catalog = await getProducts()
  return catalog.find((product) => product.slug === slug)
}

export const localizeCopy = (copy: LocalizedCopy, locale: string): string => {
  const normalizedLocale: AppLocale = locale === 'ar' ? 'ar' : 'en'
  return copy[normalizedLocale]
}

export const localizeApprovedCopy = (
  copy: ApprovedCopy | undefined,
  locale: string,
): string | undefined => {
  if (!copy || !isApproved(copy.status)) return undefined
  return localizeCopy(copy.text, locale)
}

export const getApprovedCopies = (items: ApprovedCopy[] | undefined, locale: string): string[] =>
  (items ?? [])
    .filter((item) => isApproved(item.status))
    .map((item) => localizeCopy(item.text, locale))

export const getApprovedFacts = (items: ProductFact[] | undefined): ProductFact[] =>
  (items ?? []).filter((item) => isApproved(item.status))

export const getApprovedIngredients = (
  ingredients: ProductIngredient[] | undefined,
): ProductIngredient[] => (ingredients ?? []).filter((ingredient) => isApproved(ingredient.status))

type ProductResourceLink = {
  label: LocalizedCopy
  status: ApprovalStatus
  url?: string
}

export type LocalizedProductResourceLink = {
  label: string
  url?: string
}

const getApprovedResourceLinks = (
  items: ProductResourceLink[] | undefined,
  locale: string,
): LocalizedProductResourceLink[] =>
  (items ?? [])
    .filter((item) => isApproved(item.status))
    .map((item) => ({
      label: localizeCopy(item.label, locale),
      url: item.url,
    }))

export const getApprovedProductFiles = (
  product: ProductCatalogItem,
  locale: string,
): LocalizedProductResourceLink[] => getApprovedResourceLinks(product.productFiles, locale)

export const getApprovedReferences = (
  product: ProductCatalogItem,
  locale: string,
): LocalizedProductResourceLink[] => getApprovedResourceLinks(product.references, locale)

export const getPrimaryImage = (product: ProductCatalogItem): ProductImageAsset => {
  const image = product.images[0]
  if (!image) {
    throw new Error(`Missing product image for slug: ${product.slug}`)
  }
  return image
}

export const hasApprovedPrice = (price?: ProductPrice): price is ProductPrice =>
  Boolean(price && isApproved(price.status))

export const formatOfficialPrice = (price: ProductPrice): string => price.amount.toFixed(2)

export const getProductTitle = (product: ProductCatalogItem, locale: string): string =>
  localizeCopy(product.title, locale)

export const getProductDescription = (product: ProductCatalogItem, locale: string): string =>
  localizeApprovedCopy(product.listingDescription, locale) ?? getProductTitle(product, locale)

export const getProductImageAlt = (image: ProductImageAsset, locale: string): string =>
  localizeCopy(image.alt, locale)

export const getPurchaseOptions = (product: ProductCatalogItem): ProductPurchaseOption[] =>
  product.purchaseOptions ?? []

export const canBuyFromOption = (
  product: ProductCatalogItem,
  option: ProductPurchaseOption,
): boolean =>
  option.availability === 'in_stock' && option.productSlug === product.slug && Boolean(option.url)

export const getBuyablePurchaseOptions = (product: ProductCatalogItem): ProductPurchaseOption[] =>
  getPurchaseOptions(product).filter((option) => canBuyFromOption(product, option))

export const hasBuyablePurchaseOptions = (product: ProductCatalogItem): boolean =>
  getBuyablePurchaseOptions(product).length > 0

export const getAvailabilityLabelKey = (availability: PurchaseAvailability): string => {
  const keys: Record<PurchaseAvailability, string> = {
    coming_soon: 'purchase.status.comingSoon',
    in_stock: 'purchase.status.inStock',
    out_of_stock: 'purchase.status.outOfStock',
  }

  return keys[availability]
}

export const getProductAvailabilityLabelKey = (product: ProductCatalogItem): string =>
  hasBuyablePurchaseOptions(product) ? 'purchase.status.inStock' : 'purchase.status.comingSoon'

export const productMatchesSearch = (
  product: HomeProduct,
  query: string,
  locale: string,
): boolean => {
  const normalizedQuery = query.trim().toLocaleLowerCase()
  if (!normalizedQuery) return true

  const values = [
    getProductTitle(product, locale),
    product.englishName,
    product.arabicName,
    product.slug,
  ].map((value) => value.toLocaleLowerCase())

  return values.some((value) => value.includes(normalizedQuery))
}
