import { ASSETS, OG_IMAGE_SIZE } from '#shared/brand'

interface PageSeoOptions {
  title: () => string
  description: () => string
  image?: () => string
  imageWidth?: number
  imageHeight?: number
  imageAlt?: () => string
}

export function usePageSeo(options: PageSeoOptions) {
  const { absoluteSiteUrl } = useSiteUrls()

  const image = computed(() => options.image?.() ?? absoluteSiteUrl(ASSETS.ogImage))
  const imageAlt = computed(() => options.imageAlt?.() ?? options.title())
  const imageWidth = computed(() => options.imageWidth ?? OG_IMAGE_SIZE.width)
  const imageHeight = computed(() => options.imageHeight ?? OG_IMAGE_SIZE.height)

  useSeoMeta({
    title: options.title,
    description: options.description,
    ogTitle: options.title,
    ogDescription: options.description,
    ogImage: () => image.value,
    ogImageWidth: () => imageWidth.value,
    ogImageHeight: () => imageHeight.value,
    ogImageAlt: () => imageAlt.value,
    twitterTitle: options.title,
    twitterDescription: options.description,
    twitterImage: () => image.value,
  })
}
