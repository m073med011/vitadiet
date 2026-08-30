import { PRODUCT_SLUGS } from '#shared/products'
import { productCatalog } from '~/data/product-catalog'
import type { HomeProduct } from '~/types'

export const products: HomeProduct[] = productCatalog

// Both registry checks stay eager: a catalog mistake fails at import time rather than
// surfacing later as a thrown getPrimaryImage() deep inside a page render.
for (const product of products) {
  if (!product.images[0]) {
    throw new Error(`Missing product image for slug: ${product.slug}`)
  }
}

const registeredProductSlugs = new Set(products.map((product) => product.slug))

for (const slug of PRODUCT_SLUGS) {
  if (!registeredProductSlugs.has(slug)) {
    throw new Error(`Missing product registry entry for slug: ${slug}`)
  }
}
