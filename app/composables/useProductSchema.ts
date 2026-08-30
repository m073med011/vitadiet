import { SCHEMA_ID } from '#shared/site'
import type { HomeProduct } from '~/types'
import {
  canBuyFromOption,
  getApprovedFaqs,
  getPurchaseOptions,
  hasApprovedPrice,
  localizeCopy,
} from '~/services/product-catalog'

export function useProductSchema(product: HomeProduct, seo: ReturnType<typeof useProductSeo>) {
  const { locale, t } = useI18n()
  const localePath = useLocalePath()
  const { productPath } = useProductPath()
  const { absoluteSiteUrl } = useSiteUrls()
  const offerNodes = computed(() => {
    const price = product.price
    if (!hasApprovedPrice(price) || !seo.offerPrice.value) return []

    return getPurchaseOptions(product).map((option) => ({
      '@type': 'Offer',
      availability:
        option.availability === 'in_stock'
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      price: seo.offerPrice.value,
      priceCurrency: price.currency,
      ...(seo.priceValidUntil.value ? { priceValidUntil: seo.priceValidUntil.value } : {}),
      ...(canBuyFromOption(product, option) ? { url: option.url } : {}),
    }))
  })

  // Same approval gate the page itself renders through, so the schema can never assert
  // a claim the page withholds.
  const approvedFaqs = getApprovedFaqs(product)

  useSchemaOrg([
    // `schemaOrg: { defaults: false }` disables the automatic WebPage -> FAQPage
    // upgrade, which would leave the Question nodes orphaned and unreadable by search
    // engines. Declaring the page type explicitly attaches them.
    ...(approvedFaqs.length
      ? [
          defineWebPage({ '@type': ['WebPage', 'FAQPage'] }),
          ...approvedFaqs.map((faq) =>
            defineQuestion({
              name: () => localizeCopy(faq.question.text, locale.value),
              acceptedAnswer: () => localizeCopy(faq.answer.text, locale.value),
            }),
          ),
        ]
      : []),
    defineBreadcrumb({
      itemListElement: [
        { name: () => t('home'), item: () => absoluteSiteUrl(localePath('/')) },
        {
          name: () => t('productPage.heading'),
          item: () => absoluteSiteUrl(localePath('/products/')),
        },
        {
          name: () => seo.pageName.value,
          item: () => absoluteSiteUrl(productPath(product.slug)),
        },
      ],
    }),
    defineProduct({
      name: () => seo.pageName.value,
      description: () => seo.metaDescription.value,
      inLanguage: () => seo.schemaLanguage.value,
      image: () => seo.productImageUrl.value,
      brand: { '@id': SCHEMA_ID.organization },
      ...(offerNodes.value.length
        ? {
            offers: () => (offerNodes.value.length === 1 ? offerNodes.value[0] : offerNodes.value),
          }
        : {}),
    }),
  ])
}
