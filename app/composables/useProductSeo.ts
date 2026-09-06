import type { ComputedRef } from 'vue'
import { BCP47_BY_LOCALE, toAppLocale } from '#shared/site'
import type { Product } from '~/types'
import {
  formatOfficialPrice,
  getProductDescription,
  getProductImageAlt,
  getProductTitle,
  getPrimaryImage,
  hasApprovedPrice,
  localizeApprovedCopy,
} from '~/services/product-catalog'

const META_DESCRIPTION_MAX = 160

export function useProductSeo(product: ComputedRef<Product>) {
  const { locale } = useI18n()
  const { absoluteSiteUrl } = useSiteUrls()

  const pageName = computed(() => getProductTitle(product.value, locale.value))

  const pageDescription = computed(() => {
    return (
      localizeApprovedCopy(product.value.seo.description, locale.value) ??
      getProductDescription(product.value, locale.value)
    )
  })

  const metaDescription = computed(() => {
    const firstLine = pageDescription.value.split('\n')[0]?.trim() ?? pageDescription.value

    return firstLine.length > META_DESCRIPTION_MAX
      ? `${firstLine.slice(0, META_DESCRIPTION_MAX - 3).trimEnd()}...`
      : firstLine
  })

  const primaryImage = computed(() => getPrimaryImage(product.value))
  const productImageUrl = computed(() => absoluteSiteUrl(primaryImage.value.src))
  const productImageAlt = computed(() => getProductImageAlt(primaryImage.value, locale.value))

  const offerPrice = computed(() =>
    hasApprovedPrice(product.value.price) ? formatOfficialPrice(product.value.price) : null,
  )

  const priceValidUntil = computed(() => product.value.price?.validUntil)

  const schemaLanguage = computed(() => BCP47_BY_LOCALE[toAppLocale(locale.value)])

  return {
    imageHeight: primaryImage.value.height,
    imageWidth: primaryImage.value.width,
    metaDescription,
    offerPrice,
    pageDescription,
    pageName,
    priceValidUntil,
    productImageAlt,
    productImageUrl,
    schemaLanguage,
  }
}
