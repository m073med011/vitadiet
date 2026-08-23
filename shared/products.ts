export const PRODUCT_SLUGS = [
  'bestrong',
  'becalme',
  'vitagen',
  'femavit',
  'floradit',
  'green-pharmacy',
  'dplus',
  'soluro',
  'flowadite',
] as const

export type ProductSlug = (typeof PRODUCT_SLUGS)[number]
