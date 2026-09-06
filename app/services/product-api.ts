import type {
  ApiFeaturedProduct,
  ApiProduct,
  ApiProductFaq,
  ApiProductListItem,
  ApiPurchaseLink,
} from '#shared/api'
import type {
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
 * Translation of the Dashboard wire format into the app's own product model.
 *
 * This is the only file that reads a snake_case API field. Pages and components consume
 * `Product` and the selectors in `~/services/product-catalog`, so the card, the detail
 * page and the JSON-LD builders never learn where their data came from.
 */

/**
 * The API sends no intrinsic dimensions. Every surface that renders a product image does
 * so in a square, object-cover or object-contain box, so this is a layout hint for the
 * <img> rather than a claim about the file - it only fixes the aspect ratio the browser
 * reserves before the bytes arrive.
 */
const API_IMAGE_SIZE = 800

/**
 * Dashboard paths arrive with a doubled slash after the host
 * (`https://dashboard.vitadiet.sa//storage/...`). Apache serves it, but it breaks cache
 * keys and looks like a bug in view-source, so it is collapsed here.
 */
export const normalizeApiImageUrl = (url: string): string => url.replace(/([^:])\/{2,}/g, '$1/')

/**
 * `title`, `subtitle` and the section prose come back already translated into the
 * requested `lang`, so the same string fills both slots of the locale map. Re-fetching on
 * a locale switch is what changes the copy - `useApi()` watches the locale for exactly
 * this reason.
 */
const toLocalizedCopy = (text: string): LocalizedCopy => ({ ar: text, en: text })

/**
 * Everything the API publishes is live copy, so it maps to `approved`. The status field
 * survives because `app/data/site-content.ts` still carries drafts through the same
 * `ApprovedCopy` gate; see docs/PRODUCT-DATA-MODEL.md.
 */
const approved = (text: string): ApprovedCopy => ({
  status: 'approved',
  text: toLocalizedCopy(text),
})

/** An `ApprovedCopy` only when there is copy: an empty section stays absent. */
const approvedOrNone = (text: string | undefined | null): ApprovedCopy | undefined => {
  const trimmed = text?.trim()
  return trimmed ? approved(trimmed) : undefined
}

const AVAILABILITY_VALUES: PurchaseAvailability[] = ['in_stock', 'out_of_stock', 'coming_soon']

/**
 * An unrecognised `availability_status` reads as "not on sale" rather than as in stock:
 * a new Dashboard value must never turn into a buy button the product does not have.
 */
const toAvailability = (status: string | undefined): PurchaseAvailability =>
  AVAILABILITY_VALUES.includes(status as PurchaseAvailability)
    ? (status as PurchaseAvailability)
    : 'coming_soon'

/**
 * The API sends the price as a decimal string. An unparseable or negative value is
 * dropped rather than rendered: `ProductPriceBadge` then falls back to "coming soon",
 * which is the honest reading of a missing price.
 */
const toProductPrice = (value: string | undefined): ProductPrice | undefined => {
  const amount = Number.parseFloat(value ?? '')
  if (!Number.isFinite(amount) || amount < 0) return undefined

  return { amount, currency: 'SAR', status: 'approved' }
}

const toProductImage = (
  url: string,
  alt: string,
  role: ProductImageAsset['role'],
): ProductImageAsset => ({
  alt: toLocalizedCopy(alt),
  height: API_IMAGE_SIZE,
  role,
  src: url,
  width: API_IMAGE_SIZE,
})

/**
 * Stands in for a product the Dashboard has no photo for. Every card, every gallery and
 * every SEO tag dereferences image zero, so the alternative to a placeholder is an
 * `<img src="">` on the page and an empty `og:image` in the head. The brand mark says
 * "no photograph yet" without pretending to be one.
 */
const PLACEHOLDER_IMAGE_SRC = '/images/vitadiet-official-logo.svg'

/**
 * The gallery, front-of-pack photo first.
 *
 * The list is deduplicated because `images` sometimes repeats `image`, which would
 * otherwise render the same thumbnail twice and give the gallery two tabs onto one file.
 */
const toProductImages = (item: ApiProduct | ApiProductListItem): ProductImageAsset[] => {
  const gallery = 'images' in item ? (item.images ?? []) : []
  const urls = [item.image, ...gallery].filter(Boolean).map(normalizeApiImageUrl)
  const unique = [...new Set(urls)]

  if (!unique.length) return [toProductImage(PLACEHOLDER_IMAGE_SRC, item.title, 'front')]

  return unique.map((url, index) =>
    toProductImage(url, item.title, index === 0 ? 'front' : 'details'),
  )
}

/**
 * One list row as a `Product`.
 *
 * A row without a slug is unrenderable - the card links to `/product/<slug>/` and the
 * grid keys on it - so `toProducts()` drops it rather than mapping it.
 */
export const toProduct = (item: ApiProductListItem): Product => {
  const title = toLocalizedCopy(item.title)
  const listingDescription = approvedOrNone(item.subtitle) ?? { status: 'approved', text: title }

  return {
    availability: toAvailability(item.availability_status),
    images: toProductImages(item),
    listingDescription,
    price: toProductPrice(item.price),
    seo: {
      description: listingDescription,
      title: { status: 'approved', text: title },
    },
    slug: item.slug,
    title,
  }
}

const hasSlug = (item: ApiProductListItem): boolean => Boolean(item?.slug)

/** The `data` array of `GET /products`, in catalog order, as app products. */
export const toProducts = (items: ApiProductListItem[]): Product[] =>
  items.filter(hasSlug).map(toProduct)

/**
 * Sentence boundaries in a section paragraph.
 *
 * The Dashboard stores each `sections.*` value as one run of prose while the product
 * page renders benefits, usage, warnings and suitability as lists. Splitting on a
 * terminator followed by whitespace recovers the list the copy already is, and leaves a
 * decimal such as "1.5" intact because no space follows its point. A paragraph with no
 * terminator stays a single item, which renders as the paragraph it was.
 */
const SENTENCE_BOUNDARY = /(?<=[.!?؟۔])\s+/

const toApprovedSentences = (text: string | undefined): ApprovedCopy[] | undefined => {
  const sentences = (text ?? '')
    .split(SENTENCE_BOUNDARY)
    .map((sentence) => sentence.trim())
    .filter(Boolean)

  return sentences.length ? sentences.map(approved) : undefined
}

/** A FAQ pair ships only when both halves carry text, so no empty <details> is rendered. */
const toProductFaqs = (faqs: ApiProductFaq[] | undefined): ProductFaq[] | undefined => {
  const pairs = (faqs ?? []).flatMap<ProductFaq>((faq) => {
    const question = approvedOrNone(faq?.question)
    const answer = approvedOrNone(faq?.answer)
    return question && answer ? [{ answer, question }] : []
  })

  return pairs.length ? pairs : undefined
}

/**
 * One `purchase_links` row as a platform button.
 *
 * A row with no name has nothing to label the platform with, so it is dropped. A row
 * with no URL is kept: `canBuyFromOption()` then renders it as a disabled badge, which
 * is how a platform that is not live yet is meant to read.
 */
const toPurchaseOption = (
  link: ApiPurchaseLink,
  productSlug: string,
  index: number,
): ProductPurchaseOption[] => {
  const name = (link?.name ?? link?.platform ?? link?.title ?? '').trim()
  if (!name) return []

  return [
    {
      availability: toAvailability(link.availability_status ?? 'in_stock'),
      id: String(link.id ?? link._id ?? `${productSlug}-${index}`),
      logoText: name.slice(0, 2),
      name: toLocalizedCopy(name),
      productSlug,
      url: link.url,
    },
  ]
}

const toPurchaseOptions = (
  links: ApiPurchaseLink[] | undefined,
  productSlug: string,
): ProductPurchaseOption[] | undefined => {
  const options = (links ?? []).flatMap((link, index) => toPurchaseOption(link, productSlug, index))

  return options.length ? options : undefined
}

/**
 * `GET /products/{id_or_slug}` as a `Product`: the list fields plus everything the
 * detail response adds.
 *
 * `description` becomes the overview paragraph and the hero copy, while
 * `sections.overview` becomes the benefit list - the Dashboard writes the first as a
 * definition of the product and the second as what it does for the person taking it,
 * which is the same split the page renders.
 */
export const toProductDetail = (item: ApiProduct): Product => {
  const sections = item.sections ?? {}

  return {
    ...toProduct(item),
    availabilityLabel: item.availability_label?.trim() || undefined,
    benefits: toApprovedSentences(sections.overview),
    definition: approvedOrNone(item.description),
    faqs: toProductFaqs(item.faqs),
    purchaseOptions: toPurchaseOptions(item.purchase_links, item.slug),
    relatedProducts: (item.related_products ?? []).filter(hasSlug).map(toProduct),
    stockCount: typeof item.stock_count === 'number' ? item.stock_count : undefined,
    suitableFor: toApprovedSentences(sections.suitable_for),
    usage: toApprovedSentences(sections.usage),
    warnings: toApprovedSentences(sections.warnings),
  }
}

/* ------------------------------------------------------------------------- *
 * Featured products (home page strip)
 * ------------------------------------------------------------------------- */

/** What a featured card renders. Flat strings: the endpoint already localised them. */
export interface FeaturedProductView {
  benefit: string
  id: string | number
  imageAlt: string
  imageSrc: string
  intro: string
  /**
   * The product this card advertises. The endpoint does not send it yet, and nothing is
   * inferred from the title - the featured titles carry pack sizes that the product
   * titles do not, so matching on them would link cards to the wrong product about as
   * often as to the right one. A card without a slug renders without its "learn more"
   * and "where to buy" buttons, which is better than a link to a guessed page.
   */
  slug?: string
  title: string
}

/** The `data` array of `GET /featured-products`, ordered by `sort_order`, as cards. */
export const toFeaturedProducts = (items: ApiFeaturedProduct[]): FeaturedProductView[] =>
  [...items]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((item) => ({
      benefit: item.subdesc,
      id: item.id,
      imageAlt: item.title,
      imageSrc: normalizeApiImageUrl(item.image),
      intro: item.desc,
      slug: item.slug,
      title: item.title,
    }))
