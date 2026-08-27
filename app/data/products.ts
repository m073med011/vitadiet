import { PRODUCT_SLUGS, type ProductSlug } from '#shared/products'
import { productCatalog } from '~/data/product-catalog'
import type { HomeProduct } from '~/types'

type LegacyProductKeys = {
  descriptionKey: string
  highlights?: string[]
  packSizeKey: string
  priceKey: string
  titleKey: string
}

const legacyKeysBySlug: Record<ProductSlug, LegacyProductKeys> = {
  bestrong: {
    descriptionKey: 'productDetails.bestrong.description',
    packSizeKey: 'productCard.packSize.bestrong',
    priceKey: 'homePage.products.items.bestrong.price',
    titleKey: 'homePage.products.items.bestrong.title',
  },
  becalme: {
    descriptionKey: 'productDetails.becalme.description',
    packSizeKey: 'productCard.packSize.becalme',
    priceKey: 'homePage.products.items.becalme.price',
    titleKey: 'homePage.products.items.becalme.title',
  },
  vitagen: {
    descriptionKey: 'productDetails.vitagen.description',
    packSizeKey: 'productCard.packSize.vitagen',
    priceKey: 'homePage.products.items.vitagen.price',
    titleKey: 'homePage.products.items.vitagen.title',
  },
  femavit: {
    descriptionKey: 'productDetails.femavit.description',
    packSizeKey: 'productCard.packSize.femavit',
    priceKey: 'homePage.products.items.femavit.price',
    titleKey: 'homePage.products.items.femavit.title',
  },
  'green-pharmacy': {
    descriptionKey: 'productDetails.greenPharmacy.description',
    packSizeKey: 'productCard.packSize.greenPharmacy',
    priceKey: 'homePage.products.items.greenPharmacy.price',
    titleKey: 'homePage.products.items.greenPharmacy.title',
  },
  dplus: {
    descriptionKey: 'productDetails.dplus.description',
    highlights: [
      'productDetails.dplus.highlights.zinc',
      'productDetails.dplus.highlights.vitaminD',
      'productDetails.dplus.highlights.bComplex',
    ],
    packSizeKey: 'productCard.packSize.dplus',
    priceKey: 'homePage.products.items.dplus.price',
    titleKey: 'homePage.products.items.dplus.title',
  },
  soluro: {
    descriptionKey: 'productDetails.soluro.description',
    packSizeKey: 'productCard.packSize.soluro',
    priceKey: 'homePage.products.items.soluro.price',
    titleKey: 'homePage.products.items.soluro.title',
  },
}

export const products: HomeProduct[] = productCatalog.map((product) => {
  const primaryImage = product.images[0]
  const buyLink = product.purchaseOptions?.find(
    (option) => option.availability === 'in_stock' && option.productSlug === product.slug,
  )?.url

  if (!primaryImage) {
    throw new Error(`Missing product image for slug: ${product.slug}`)
  }

  return {
    ...product,
    ...legacyKeysBySlug[product.slug],
    buyLink,
    gallery: product.images.slice(1).map((image) => image.src),
    image: primaryImage.src,
  }
})

const registeredProductSlugs = new Set(products.map((product) => product.slug))

for (const slug of PRODUCT_SLUGS) {
  if (!registeredProductSlugs.has(slug)) {
    throw new Error(`Missing product registry entry for slug: ${slug}`)
  }
}
