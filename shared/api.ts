/* ------------------------------------------------------------------------- *
 * Wire shapes returned by the Vitadiet Dashboard API (Laravel API resources).
 * These describe the JSON exactly as it arrives - snake_case included - so the
 * mapping into the app's own model stays in the service layer and no component
 * ever reads a raw API field. See docs/API-LAYER.md.
 * ------------------------------------------------------------------------- */

/** `{ "data": { ... } }` - a single record. */
export interface ApiResource<T> {
  data: T
}

export interface ApiPaginationLinks {
  first: string | null
  last: string | null
  next: string | null
  prev: string | null
}

export interface ApiPaginationMetaLink {
  active: boolean
  label: string
  page: number | null
  url: string | null
}

export interface ApiPaginationMeta {
  current_page: number
  from: number | null
  last_page: number
  links: ApiPaginationMetaLink[]
  path: string
  per_page: number
  to: number | null
  total: number
}

/** `{ "data": [...], "links": {...}, "meta": {...} }` - a paginated list. */
export interface ApiCollection<T> {
  data: T[]
  links?: ApiPaginationLinks
  meta?: ApiPaginationMeta
}

/**
 * One row of `GET /products`. The list endpoint is deliberately thin: the detail
 * endpoint carries the description, the sections, the FAQ and the rest of the record.
 *
 * `title` and `subtitle` arrive already translated into the `lang` that was sent
 * with the request, so they are plain strings rather than locale maps.
 */
export interface ApiProductListItem {
  _id: number
  availability_status: string
  id: number
  image: string
  price: string
  slug: string
  subtitle: string
  title: string
}

/**
 * The four prose blocks of `GET /products/{id_or_slug}`, each a single localised
 * paragraph. Every key is optional: the Dashboard omits a section it has no copy for,
 * and the product page hides the matching heading rather than printing an empty one.
 */
export interface ApiProductSections {
  overview?: string
  suitable_for?: string
  usage?: string
  warnings?: string
}

export interface ApiProductFaq {
  _id: number
  answer: string
  id: number
  question: string
}

/**
 * One row of `purchase_links`.
 *
 * Every product currently returns an empty array, so this is the shape the mapping is
 * prepared for rather than one that has been observed: all fields are optional and
 * `toPurchaseOption()` drops a row it cannot turn into a usable platform button.
 */
export interface ApiPurchaseLink {
  _id?: number
  availability_status?: string
  id?: number | string
  name?: string
  platform?: string
  title?: string
  url?: string
}

/** `GET /products/{id_or_slug}` - the whole product record. */
export interface ApiProduct extends ApiProductListItem {
  availability_label?: string
  description?: string
  faqs?: ApiProductFaq[]
  /** Gallery shots, not including `image`, which stays the front-of-pack photo. */
  images?: string[]
  purchase_links?: ApiPurchaseLink[]
  related_products?: ApiProductListItem[]
  sections?: ApiProductSections
  stock_count?: number | null
}

/**
 * One row of `GET /featured-products`, the curated strip on the home page.
 *
 * It is a presentation record, not a product record: `desc` and `subdesc` are the two
 * marketing lines the card shows, and `sort_order` fixes their order. `slug` is optional
 * because the endpoint does not send it yet - a card without one renders without its
 * "learn more" and "where to buy" buttons rather than linking to a guessed product.
 */
export interface ApiFeaturedProduct {
  _id: number
  desc: string
  id: number
  image: string
  slug?: string
  sort_order: number
  subdesc: string
  title: string
}
