import type { Component } from 'vue'

/**
 * A product as shown on the homepage carousel, product listing grid,
 * and product detail pages.
 */
export interface HomeProduct {
  titleKey: string
  priceKey: string
  slug: string
  image: string
  gallery?: string[]
  buyLink?: string
  descriptionKey?: string
  highlights?: string[]
}

/**
 * A navigation link used in the header nav bar, mobile sidebar,
 * and footer quick-links column.
 */
export interface NavItem {
  labelKey: string
  hash: string
  path?: string
  icon?: Component
}

/**
 * A social-media link rendered in the footer brand column.
 * Supports either a Lucide icon component or an inline SVG path.
 */
export interface SocialLink {
  label: string
  href: string
  icon?: Component
  /** Raw SVG `d` attribute for icons without a Lucide component */
  path?: string
  viewBox?: string
  stroke?: string
  strokeWidth?: number
  strokeLinejoin?: 'round' | 'inherit' | 'miter' | 'bevel'
}
