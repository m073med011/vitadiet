import { toAppLocale } from '#shared/site'
import type {
  ApprovalStatus,
  ApprovedCopy,
  LocalizedCopy,
  Product,
  ProductFaq,
  ProductImageAsset,
  ProductPrice,
  ProductPurchaseOption,
  PurchaseAvailability,
} from '~/types'

/**
 * Selectors over the product model. No data source: products are read from the Dashboard
 * API through `useProductCatalog()` and `useProduct()`, and mapped by
 * `~/services/product-api.ts`. Everything here is a pure function of a `Product`, so a
 * component never has to know which endpoint filled it in.
 *
 * The approval helpers are shared with `~/services/site-content.ts`, which still carries
 * draft copy through the same gate. API copy is published copy, so it always maps to
 * `approved`.
 */

export const isApproved = (status?: ApprovalStatus): boolean => status === 'approved'

export const localizeCopy = (copy: LocalizedCopy, locale: string): string =>
  copy[toAppLocale(locale)]

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

/**
 * The FAQ approval rule, defined once. A pair ships only when BOTH halves are approved:
 * the rendered <details> list and the JSON-LD Question nodes have to apply the identical
 * rule, or the markup asserts a claim the page itself withholds.
 */
export const getApprovedFaqs = (product: Product): ProductFaq[] =>
  (product.faqs ?? []).filter(
    (faq) => isApproved(faq.question.status) && isApproved(faq.answer.status),
  )

export const getPrimaryImage = (product: Product): ProductImageAsset => {
  const image = product.images[0]
  if (!image) {
    throw new Error(`Missing product image for slug: ${product.slug}`)
  }
  return image
}

export const hasApprovedPrice = (price?: ProductPrice): price is ProductPrice =>
  Boolean(price && isApproved(price.status))

export const formatOfficialPrice = (price: ProductPrice): string => price.amount.toFixed(2)

export const getProductTitle = (product: Product, locale: string): string =>
  localizeCopy(product.title, locale)

export const getProductDescription = (product: Product, locale: string): string =>
  localizeApprovedCopy(product.listingDescription, locale) ?? getProductTitle(product, locale)

export const getProductImageAlt = (image: ProductImageAsset, locale: string): string =>
  localizeCopy(image.alt, locale)

export const getPurchaseOptions = (product: Product): ProductPurchaseOption[] =>
  product.purchaseOptions ?? []

export const canBuyFromOption = (product: Product, option: ProductPurchaseOption): boolean =>
  option.availability === 'in_stock' && option.productSlug === product.slug && Boolean(option.url)

export const getBuyablePurchaseOptions = (product: Product): ProductPurchaseOption[] =>
  getPurchaseOptions(product).filter((option) => canBuyFromOption(product, option))

export const hasBuyablePurchaseOptions = (product: Product): boolean =>
  getBuyablePurchaseOptions(product).length > 0

/**
 * Whether the product is on sale, as the Dashboard states it.
 *
 * Deliberately independent of `purchaseOptions`: the list endpoint sends no purchase
 * links at all, so a card that inferred availability from them would mark every product
 * "coming soon". Where a platform button can actually be rendered is a separate
 * question, answered by `hasBuyablePurchaseOptions()`.
 */
export const isProductAvailable = (product: Product): boolean => product.availability === 'in_stock'

export type AvailabilityLabelKey =
  'purchase.status.comingSoon' | 'purchase.status.inStock' | 'purchase.status.outOfStock'

export const getAvailabilityLabelKey = (
  availability: PurchaseAvailability,
): AvailabilityLabelKey => {
  const keys: Record<PurchaseAvailability, AvailabilityLabelKey> = {
    coming_soon: 'purchase.status.comingSoon',
    in_stock: 'purchase.status.inStock',
    out_of_stock: 'purchase.status.outOfStock',
  }

  return keys[availability]
}

/**
 * The availability wording for a product: `availability_label` when the detail endpoint
 * sent one, so the page says what the Dashboard says, and the translated status label
 * otherwise. List rows carry no label, which is why the fallback exists at all.
 */
export const getProductAvailabilityLabel = (
  product: Product,
  translate: (key: AvailabilityLabelKey) => string,
): string => product.availabilityLabel ?? translate(getAvailabilityLabelKey(product.availability))

export const productMatchesSearch = (product: Product, query: string, locale: string): boolean => {
  const normalizedQuery = query.trim().toLocaleLowerCase()
  if (!normalizedQuery) return true

  const values = [getProductTitle(product, locale), product.slug].map((value) =>
    value.toLocaleLowerCase(),
  )

  return values.some((value) => value.includes(normalizedQuery))
}
