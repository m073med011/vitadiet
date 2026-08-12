<template>
  <ProductLanding v-if="product" :product="product" />

  <div v-else class="pt-24 pb-12 min-h-screen">
    <div class="content-container">
      <p
        class="text-caption font-bold tracking-label uppercase text-brand-primary text-center mb-4"
        data-aos="fade-up"
      >
        {{ $t('categoryPage.eyebrow') }}
      </p>
      <h1 class="text-4xl font-bold text-center mb-8" data-aos="fade-up" data-aos-delay="100">{{ categoryName }}</h1>
      <p class="text-copy-lg leading-copy text-ink-soft text-center max-w-copy mx-auto mb-8" data-aos="fade-up" data-aos-delay="200">
        {{ $t('categoryPage.description') }}
      </p>
      <div class="text-center" data-aos="fade-up" data-aos-delay="300">
        <BaseButton href="mailto:b2b@vitadiet.sa" variant="primary">
          {{ $t('categoryPage.cta') }}
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { products } from '~/data/home'
import { parseOfferPrice } from '~/utils/price'

definePageMeta({
  headerSticky: false
})

const route = useRoute()
const slug = computed(() => route.params.slug)

const { t, te, locale } = useI18n()
const localePath = useLocalePath()
const { productPath } = useProductPath()
// Build absolute URLs from the configured site origin, not useRequestURL(): during
// static prerender the latter resolves to http://localhost and leaks into canonical/OG.
const siteUrl = useSiteConfig().url

const slugValue = computed(() => {
  const value = slug.value
  return Array.isArray(value) ? (value[0] ?? '') : String(value)
})

const product = computed(() => products.find((item) => item.slug === slugValue.value))

const categoryKeyBySlug: Record<string, string> = {
  'european-supplements': 'homePage.products.items.europeanSupplements.title',
  'vitamins-minerals': 'homePage.products.items.vitaminsMinerals.title',
  'herbal-formulas': 'homePage.products.items.herbalFormulas.title',
  'specialty-nutrition': 'homePage.products.items.specialtyNutrition.title',
  'pharmacy-ready-skus': 'homePage.products.items.pharmacySkus.title',
}

const isCategorySlug = computed(() => Boolean(categoryKeyBySlug[slugValue.value]))
const isKnownSlug = computed(() => Boolean(product.value || isCategorySlug.value))

if (!isKnownSlug.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page Not Found',
  })
}

const categoryName = computed(() => {
  const categoryKey = categoryKeyBySlug[slugValue.value]
  return categoryKey ? t(categoryKey) : slugValue.value
})

/** Page name used in the title — product name when matched, otherwise the category. */
const pageName = computed(() =>
  product.value ? t(product.value.titleKey) : categoryName.value
)

/** Full on-page description (multi-line marketing copy). */
const pageDescription = computed(() => {
  if (product.value?.descriptionKey) return t(product.value.descriptionKey)
  return t('categoryPage.description')
})

/**
 * Short single-line meta/social description (≤~155 chars). Prefers a dedicated
 * `metaDescription` key when present, otherwise collapses the multi-line on-page
 * copy to its first sentence so the SERP snippet doesn't render as a run-on.
 */
const metaDescription = computed(() => {
  // metaDescription lives alongside the product's descriptionKey
  // (e.g. productDetails.greenPharmacy.description -> .metaDescription).
  const descKey = product.value?.descriptionKey
  if (descKey) {
    const metaKey = descKey.replace(/\.description$/, '.metaDescription')
    if (te(metaKey)) return t(metaKey)
  }
  const firstLine = pageDescription.value.split('\n')[0]?.trim() ?? pageDescription.value
  return firstLine.length > 160 ? `${firstLine.slice(0, 157).trimEnd()}…` : firstLine
})

/** Absolute URL to the product's primary image, for OG tags and Product schema. */
const productImageUrl = computed(() =>
  product.value ? new URL(product.value.image, siteUrl).toString() : undefined
)

/**
 * Numeric SAR price for the Offer, or null when the price isn't a number (e.g.
 * "Coming Soon"). Normalizes Arabic-Indic digits (٠–٩) to ASCII first so the
 * Arabic locale's prices still produce a valid Offer.
 */
const offerPrice = computed(() => {
  if (!product.value) return null
  return parseOfferPrice(t(product.value.priceKey))
})

/**
 * priceValidUntil for the Offer — Google Merchant flags Offers without it. We roll
 * a year forward from the current build so static regenerations keep it in the future.
 */
const priceValidUntil = useState('offer-price-valid-until', () => {
  const d = new Date()
  d.setFullYear(d.getFullYear() + 1)
  return d.toISOString().split('T')[0]
})

// The titleTemplate in app.vue already appends " - Vitadiet"; keep page titles brand-free.
// twitterTitle/Description are set explicitly (not just ogTitle/Description) to override
// the global homepage Twitter fallback; og:image:* are overridden because product photos
// are 668x911 webp, not the 1080x356 png share preview the global tags describe.
useSeoMeta({
  title: () => pageName.value,
  description: () => metaDescription.value,
  ogTitle: () => pageName.value,
  ogDescription: () => metaDescription.value,
  ogImage: () => productImageUrl.value,
  ogImageWidth: 668,
  ogImageHeight: 911,
  ogImageAlt: () => pageName.value,
  twitterTitle: () => pageName.value,
  twitterDescription: () => metaDescription.value,
  twitterImage: () => productImageUrl.value,
})

// The canonical + hreflang cluster is emitted centrally by useLocaleHead() in app.vue
// (baseUrl + current route path). We deliberately do NOT emit a second canonical here —
// two <link rel="canonical"> tags is invalid and can cause Google to ignore both.

watchEffect(() => {
  if (!product.value) return

  useSchemaOrg([
    defineBreadcrumb({
      itemListElement: [
        // Absolute: for the default locale localePath('/') is "/", which schema-org
        // resolves against the host down to a bare origin, disagreeing with the
        // trailing-slash form used by the canonical and the sitemap.
        { name: t('home'), item: new URL(localePath('/'), siteUrl).toString() },
        { name: t('productPage.heading'), item: localePath('/products/') },
        { name: pageName.value, item: productPath(product.value.slug) },
      ],
    }),
    defineProduct({
      name: pageName.value,
      description: metaDescription.value,
      inLanguage: locale.value === 'ar' ? 'ar-SA' : 'en-US',
      ...(productImageUrl.value ? { image: productImageUrl.value } : {}),
      brand: { '@type': 'Brand', name: 'Vitadiet' },
      ...(offerPrice.value
        ? {
            offers: {
              '@type': 'Offer',
              price: offerPrice.value,
              priceCurrency: 'SAR',
              priceValidUntil: priceValidUntil.value,
              // A live marketplace link means it's buyable now; otherwise it's a
              // listed-but-not-yet-purchasable SKU.
              availability: product.value.buyLink
                ? 'https://schema.org/InStock'
                : 'https://schema.org/PreOrder',
              ...(product.value.buyLink ? { url: product.value.buyLink } : {}),
            },
          }
        : {}),
    }),
  ])
})
</script>
