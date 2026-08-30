import type { Component } from 'vue'
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
