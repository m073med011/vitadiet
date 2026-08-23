import type { Component } from 'vue'

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

export interface NavItem {
  labelKey: string
  hash: string
  path?: string
  icon?: Component
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
