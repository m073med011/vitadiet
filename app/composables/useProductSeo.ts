import type { ComputedRef } from 'vue'
import { BCP47_BY_LOCALE, type AppLocale } from '#shared/site'
import type { HomeProduct } from '~/types'
import { parseOfferPrice } from '~/utils/price'

const META_DESCRIPTION_MAX = 160
const PRODUCT_IMAGE_SIZE = { width: 668, height: 911 } as const

export function useProductSeo(product: ComputedRef<HomeProduct>) {
  const { t, te, locale } = useI18n()
  const { absoluteSiteUrl } = useSiteUrls()

  const pageName = computed(() => t(product.value.titleKey))

  const pageDescription = computed(() => {
    return product.value.descriptionKey
      ? t(product.value.descriptionKey)
      : t('categoryPage.description')
  })

  const metaDescription = computed(() => {
    const descKey = product.value.descriptionKey

    if (descKey) {
      const metaKey = descKey.replace(/\.description$/, '.metaDescription')
      if (te(metaKey)) return t(metaKey)
    }

    const firstLine = pageDescription.value.split('\n')[0]?.trim() ?? pageDescription.value

    return firstLine.length > META_DESCRIPTION_MAX
      ? `${firstLine.slice(0, META_DESCRIPTION_MAX - 3).trimEnd()}...`
      : firstLine
  })

  const productImageUrl = computed(() => absoluteSiteUrl(product.value.image))

  const offerPrice = computed(() => parseOfferPrice(t(product.value.priceKey)))

  const priceValidUntil = useState('offer-price-valid-until', () => {
    const date = new Date()
    date.setFullYear(date.getFullYear() + 1)
    return date.toISOString().split('T')[0]
  })

  const schemaLanguage = computed(() => BCP47_BY_LOCALE[locale.value as AppLocale])

  return {
    imageHeight: PRODUCT_IMAGE_SIZE.height,
    imageWidth: PRODUCT_IMAGE_SIZE.width,
    metaDescription,
    offerPrice,
    pageDescription,
    pageName,
    priceValidUntil,
    productImageUrl,
    schemaLanguage,
  }
}
