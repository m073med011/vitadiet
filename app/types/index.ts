import type { Component } from 'vue'
import type { LegalSlug } from '#shared/legal'
import type { ProductSlug } from '#shared/products'
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
  updatedAt: string
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
  productSlug: ProductSlug
  updatedAt: string
  url?: string
}

export interface ProductIngredient {
  amount?: string
  name: LocalizedCopy
  status: ApprovalStatus
}

export interface ProductFact {
  label: LocalizedCopy
  value: LocalizedCopy
  status: ApprovalStatus
}

export interface ProductFaq {
  answer: ApprovedCopy
  question: ApprovedCopy
}

/**
 * One labelled, optionally linked resource attached to a product. Both `productFiles`
 * (catalog and packaging PDFs) and `references` (real scientific sources) are lists of
 * these: they carry the same shape and the same approval gate, and only the section
 * they render under differs.
 */
export interface ProductResourceLink {
  label: LocalizedCopy
  status: ApprovalStatus
  url?: string
}

export interface ProductCatalogItem {
  arabicName: string
  benefits?: ApprovedCopy[]
  compliance?: ProductFact[]
  definition?: ApprovedCopy
  englishName: string
  faqs?: ProductFaq[]
  images: ProductImageAsset[]
  ingredients?: ProductIngredient[]
  lastReviewed?: string
  listingDescription: ApprovedCopy
  manufacturer?: ProductFact[]
  packSize?: LocalizedCopy
  positioning?: ApprovedCopy
  price?: ProductPrice
  productFiles?: ProductResourceLink[]
  purchaseOptions?: ProductPurchaseOption[]
  references?: ProductResourceLink[]
  relatedSlugs?: ProductSlug[]
  seo: {
    description: ApprovedCopy
    title: ApprovedCopy
  }
  slug: ProductSlug
  suitableFor?: ApprovedCopy[]
  templateVersion: 'legacy' | 'phase-2'
  title: LocalizedCopy
  usage?: ApprovedCopy[]
  warnings?: ApprovedCopy[]
}

/**
 * Kept as a name so component prop types keep reading `HomeProduct`. The catalog item is
 * the entire shape: the translation-key fields this used to add on top were never read.
 */
export type HomeProduct = ProductCatalogItem

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
  /** Product slugs offered as "products of interest" checkboxes. */
  productSlugs: ProductSlug[]
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
