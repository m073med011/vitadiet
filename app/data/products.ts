import { PRODUCT_SLUGS, type ProductSlug } from '#shared/products'
import type { HomeProduct } from '~/types'

type ProductRegistryItem = Omit<HomeProduct, 'slug'> & { slug: ProductSlug }

const prodBecalme = '/images/Products/becalme/becalme-supplement-front-view.webp'
const prodBestrong = '/images/Products/bestrong/bestrong-supplement-front-view.webp'
const prodDplus = '/images/Products/dplus/dplus-supplement-front-view.webp'
const prodFemavit = '/images/Products/femavit/femavit-supplement-front-view.webp'
const prodGreen = '/images/Products/green-pharmacy/green-pharmacy-supplement-front-view.webp'
const prodFloradit = '/images/Products/floradit/floradit-supplement-front-view.webp'
const prodVitagen = '/images/Products/vitagen/vitagen-supplement-front-view.webp'
const prodDplusSubMain = '/images/Products/dplus/dplus-supplement-details.webp'
const prodFlowadite = '/images/Products/flowadite/flowadite-supplement-front-view.webp'
const prodSoluro = '/images/Products/soluro/soluro-supplement-front-view.webp'
const prodBecalmeSubMain = '/images/Products/becalme/becalme-supplement-details.webp'
const prodBestrongSubMain = '/images/Products/bestrong/bestrong-supplement-details.webp'
const prodFemavitSubMain = '/images/Products/femavit/femavit-supplement-details.webp'
const prodVitagenSubMain = '/images/Products/vitagen/vitagen-supplement-details.webp'

export const products: ProductRegistryItem[] = [
  {
    titleKey: 'homePage.products.items.bestrong.title',
    priceKey: 'homePage.products.items.bestrong.price',
    descriptionKey: 'productDetails.bestrong.description',
    slug: 'bestrong',
    image: prodBestrong,
    gallery: [prodBestrongSubMain],
    buyLink:
      'https://www.noon.com/saudi-ar/bestrong-30-capsules/Z0A78CE20D0670E8247E8Z/p/?o=b085f0baf8350ccc&shareId=55cbcdbc-fd96-4405-b8b4-a9e080dcd82b',
  },
  {
    titleKey: 'homePage.products.items.becalme.title',
    priceKey: 'homePage.products.items.becalme.price',
    descriptionKey: 'productDetails.becalme.description',
    slug: 'becalme',
    image: prodBecalme,
    gallery: [prodBecalmeSubMain],
    buyLink:
      'https://www.noon.com/saudi-ar/becalme-30-capsules/Z452A1BEE5A19A8DA4747Z/p/?utm_source=C1000094L&utm_medium=referral&o=d460e066583a294c&shareId=2d3fedf9-3d8a-42d5-bb15-f75a87f3f67f',
  },
  {
    titleKey: 'homePage.products.items.vitagen.title',
    priceKey: 'homePage.products.items.vitagen.price',
    descriptionKey: 'productDetails.vitagen.description',
    slug: 'vitagen',
    image: prodVitagen,
    gallery: [prodVitagenSubMain],
    buyLink:
      'https://www.noon.com/saudi-ar/vitagen-30-capsules/Z22305437D29BF099F2E6Z/p/?utm_source=C1000094L&utm_medium=referral&o=c1d5a9304d019fac&shareId=69113b68-bce3-4c81-bd28-e3513e2d14ac',
  },
  {
    titleKey: 'homePage.products.items.femavit.title',
    priceKey: 'homePage.products.items.femavit.price',
    descriptionKey: 'productDetails.femavit.description',
    slug: 'femavit',
    image: prodFemavit,
    gallery: [prodFemavitSubMain],
    buyLink:
      'https://www.noon.com/saudi-ar/femavit-plus-30-capsules/Z3058C2F313DDA75557DCZ/p/?o=f82fddebb7fe0f4c',
  },
  {
    titleKey: 'homePage.products.items.floradit.title',
    priceKey: 'homePage.products.items.floradit.price',
    descriptionKey: 'productDetails.floradit.description',
    slug: 'floradit',
    image: prodFloradit,
    buyLink:
      'https://www.noon.com/saudi-ar/floradiet-20-capsules/Z924896138C9EAB959880Z/p/?o=c2ffb29d5ff1618a',
  },
  {
    titleKey: 'homePage.products.items.greenPharmacy.title',
    priceKey: 'homePage.products.items.greenPharmacy.price',
    descriptionKey: 'productDetails.greenPharmacy.description',
    slug: 'green-pharmacy',
    image: prodGreen,
    buyLink:
      'https://www.noon.com/saudi-ar/green-pharmacy-herbal-cleansing-gel/ZE1F26AF85CD2E72E8C09Z/p/?o=afbf327c818b3cdf&shareId=cdc8f2ed-b201-4dd6-a4b2-2e52558114e3',
  },
  {
    titleKey: 'homePage.products.items.dplus.title',
    priceKey: 'homePage.products.items.dplus.price',
    descriptionKey: 'productDetails.dplus.description',
    highlights: [
      'productDetails.dplus.highlights.zinc',
      'productDetails.dplus.highlights.vitaminD',
      'productDetails.dplus.highlights.bComplex',
    ],
    slug: 'dplus',
    image: prodDplus,
    gallery: [prodDplusSubMain],
    buyLink:
      'https://www.noon.com/saudi-ar/d-plus-60-tablets/Z3435D02D8C058A6CC517Z/p/?o=dbef8bf85bc52a1b',
  },
  {
    titleKey: 'homePage.products.items.soluro.title',
    priceKey: 'homePage.products.items.soluro.price',
    descriptionKey: 'productDetails.soluro.description',
    slug: 'soluro',
    image: prodSoluro,
  },
  {
    titleKey: 'homePage.products.items.flowadite.title',
    priceKey: 'homePage.products.items.flowadite.price',
    descriptionKey: 'productDetails.flowadite.description',
    slug: 'flowadite',
    image: prodFlowadite,
  },
]

const registeredProductSlugs = new Set(products.map((product) => product.slug))

for (const slug of PRODUCT_SLUGS) {
  if (!registeredProductSlugs.has(slug)) {
    throw new Error(`Missing product registry entry for slug: ${slug}`)
  }
}
