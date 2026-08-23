import { SCHEMA_ID } from '#shared/site'
import type { HomeProduct } from '~/types'

export function useProductSchema(product: HomeProduct, seo: ReturnType<typeof useProductSeo>) {
  const { t } = useI18n()
  const localePath = useLocalePath()
  const { productPath } = useProductPath()
  const { absoluteSiteUrl } = useSiteUrls()

  useSchemaOrg([
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
      ...(seo.offerPrice.value
        ? {
            offers: {
              '@type': 'Offer',
              price: () => seo.offerPrice.value,
              priceCurrency: 'SAR',
              priceValidUntil: () => seo.priceValidUntil.value,
              availability: product.buyLink
                ? 'https://schema.org/InStock'
                : 'https://schema.org/PreOrder',
              ...(product.buyLink ? { url: product.buyLink } : {}),
            },
          }
        : {}),
    }),
  ])
}
