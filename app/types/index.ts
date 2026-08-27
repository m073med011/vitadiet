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

export interface ProductReference {
  label: LocalizedCopy
  status: ApprovalStatus
  url?: string
}

export interface ProductFile {
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
  packSize: LocalizedCopy
  positioning?: ApprovedCopy
  price?: ProductPrice
  productFiles?: ProductFile[]
  purchaseOptions?: ProductPurchaseOption[]
  references?: ProductReference[]
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

export interface HomeProduct extends ProductCatalogItem {
  descriptionKey?: string
  gallery?: string[]
  highlights?: string[]
  image: string
  buyLink?: string
  packSizeKey: string
  titleKey: string
  priceKey: string
}

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
