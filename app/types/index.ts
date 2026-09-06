import type { Component } from 'vue'
import type { LegalSlug } from '#shared/legal'
import type { AppLocale } from '#shared/site'

export type ApprovalStatus = 'approved' | 'pending_approval' | 'rejected'

export type LocalizedCopy = Record<AppLocale, string>

export interface ApprovedCopy {
  status: ApprovalStatus
  text: LocalizedCopy
}

export interface ProductImageAsset {
  alt: LocalizedCopy
  height: number
  role: 'front' | 'details'
  src: string
  width: number
}

export interface ProductPrice {
  amount: number
  currency: 'SAR'
  status: ApprovalStatus
  validUntil?: string
}

export type PurchaseAvailability = 'in_stock' | 'out_of_stock' | 'coming_soon'

export interface PlatformLogo {
  alt: LocalizedCopy
  height: number
  src: string
  width: number
}

export interface ProductPurchaseOption {
  availability: PurchaseAvailability
  id: string
  /** Optional brand mark. When absent the platform renders as a text-only badge. */
  logo?: PlatformLogo
  logoText: string
  name: LocalizedCopy
  productSlug: string
  url?: string
}

export interface ProductFaq {
  answer: ApprovedCopy
  question: ApprovedCopy
}

/**
 * A product as the app renders it, whichever endpoint it came from.
 *
 * The fields divide into two groups. `GET /products` (the list) fills the first: slug,
 * title, listing description, price, availability and the front image - everything a card
 * needs. `GET /products/{slug}` (the detail) adds the rest, so an optional field being
 * absent means "this product was read from the list", not "the Dashboard has no value for
 * it". Every section on the product page is guarded on its own field for that reason.
 *
 * `~/services/product-api.ts` is the only place that builds one of these; see
 * docs/PRODUCT-DATA-MODEL.md.
 */
export interface Product {
  availability: PurchaseAvailability
  /** Availability as the Dashboard words it ("متوفر"). Detail responses only. */
  availabilityLabel?: string
  benefits?: ApprovedCopy[]
  definition?: ApprovedCopy
  faqs?: ProductFaq[]
  images: ProductImageAsset[]
  listingDescription: ApprovedCopy
  price?: ProductPrice
  purchaseOptions?: ProductPurchaseOption[]
  /** Read from the detail response, which sends whole list records rather than slugs. */
  relatedProducts?: Product[]
  seo: {
    description: ApprovedCopy
    title: ApprovedCopy
  }
  slug: string
  /** Units on hand. Rendered as a fact, never used to override `availability`. */
  stockCount?: number
  suitableFor?: ApprovedCopy[]
  title: LocalizedCopy
  usage?: ApprovedCopy[]
  warnings?: ApprovedCopy[]
}

export interface NavItem {
  labelKey: string
  hash: string
  path?: string
  icon?: Component
  /**
   * Link to `hash` on the current page instead of the home page. Used by footer
   * links whose target (the contact block) is rendered on every route.
   */
  anchor?: boolean
}

export interface FaqItem {
  answerKey: string
  key: string
  questionKey: string
}

export interface SocialLink {
  label: string
  href: string
  icon?: Component
  path?: string
  viewBox?: string
  stroke?: string
  strokeWidth?: number
  strokeLinejoin?: 'round' | 'inherit' | 'miter' | 'bevel'
}

/* ------------------------------------------------------------------------- *
 * Phase 3 site content: quality and accreditation, legal documents, and the
 * partnership form. Every changeable string lives in `app/data/site-content.ts`
 * and reaches the UI through `app/services/site-content.ts`, so a future
 * Dashboard can replace the source without touching a component or a URL.
 * ------------------------------------------------------------------------- */

/** Icon key resolved to a component by the consuming section, so data stays serialisable. */
export type QualityIconKey = 'clipboard-check' | 'factory' | 'shield-check' | 'file-search' | 'eye'

export interface QualityPillar {
  description: ApprovedCopy
  iconKey: QualityIconKey
  id: string
  /** Extra detail rendered on the quality page only; the home section shows the summary. */
  points?: ApprovedCopy[]
  title: ApprovedCopy
}

export type LegalDocumentSlug = LegalSlug

export interface LegalSection {
  body: ApprovedCopy[]
  heading: ApprovedCopy
  id: string
}

export interface LegalDocument {
  intro: ApprovedCopy
  lastReviewed: string
  sections: LegalSection[]
  seoDescription: ApprovedCopy
  slug: LegalDocumentSlug
  title: LocalizedCopy
}

export interface PartnerFormOption {
  id: string
  label: LocalizedCopy
}

export interface PartnerFormOptions {
  facilityTypes: PartnerFormOption[]
  partnershipTypes: PartnerFormOption[]
}

export interface PartnerLead {
  city: string
  consent: boolean
  email: string
  facilityName: string
  facilityType: string
  interestedProducts: string[]
  message: string
  name: string
  partnershipType: string
  phone: string
}

export type PartnerSubmissionStatus =
  'idle' | 'submitting' | 'success' | 'server_error' | 'network_error'

export interface FooterLinkGroup {
  items: NavItem[]
  labelKey: string
}
