export const PRODUCT_SLUGS = [
  'bestrong',
  'becalme',
  'vitagen',
  'femavit',
  'green-pharmacy',
  'dplus',
  'soluro',
] as const

export type ProductSlug = (typeof PRODUCT_SLUGS)[number]
