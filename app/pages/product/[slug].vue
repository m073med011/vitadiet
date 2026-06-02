<template>
  <ProductLanding v-if="product" :product="product" />

  <div v-else class="pt-24 pb-12 min-h-screen">
    <div class="max-w-content mx-auto px-page sm:px-gutter md:px-page-lg">
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
import ProductLanding from '~/components/ProductLanding.vue'
import { products } from '~/data/home'

definePageMeta({
  headerSticky: false
})

const route = useRoute()
const slug = computed(() => route.params.slug)

const { t, te } = useI18n()
const localePath = useLocalePath()
const requestUrl = useRequestURL()

const slugValue = computed(() => {
  const value = slug.value
  return Array.isArray(value) ? value[0] : String(value)
})

const product = computed(() => products.find((item) => item.slug === slugValue.value))

const categoryKeyBySlug: Record<string, string> = {
  'european-supplements': 'homePage.products.items.europeanSupplements.title',
  'vitamins-minerals': 'homePage.products.items.vitaminsMinerals.title',
  'herbal-formulas': 'homePage.products.items.herbalFormulas.title',
  'specialty-nutrition': 'homePage.products.items.specialtyNutrition.title',
  'pharmacy-ready-skus': 'homePage.products.items.pharmacySkus.title',
}

const categoryName = computed(() => {
  return categoryKeyBySlug[slugValue.value] ? t(categoryKeyBySlug[slugValue.value]) : slugValue.value
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
  product.value ? new URL(product.value.image, requestUrl.origin).toString() : undefined
)

/**
 * Numeric SAR price for the Offer, or null when the price isn't a number (e.g.
 * "Coming Soon"). Normalizes Arabic-Indic digits (٠–٩) to ASCII first so the
 * Arabic locale's prices still produce a valid Offer.
 */
const offerPrice = computed(() => {
  if (!product.value) return null
  const raw = t(product.value.priceKey).replace(/[٠-٩]/g, (d) =>
    String(d.charCodeAt(0) - 0x0660)
  )
  return /\d/.test(raw) ? raw.replace(/[^\d.]/g, '') : null
})

// The titleTemplate in app.vue already appends " - Vitadiet"; keep page titles brand-free.
useSeoMeta({
  title: () => pageName.value,
  description: () => metaDescription.value,
  ogTitle: () => pageName.value,
  ogDescription: () => metaDescription.value,
  ogImage: () => productImageUrl.value,
  twitterImage: () => productImageUrl.value,
})

watchEffect(() => {
  if (!product.value) return

  useSchemaOrg([
    defineBreadcrumb({
      itemListElement: [
        { name: t('home'), item: localePath('/') },
        { name: t('productPage.heading'), item: localePath('/products') },
        { name: pageName.value, item: localePath(`/product/${product.value.slug}`) },
      ],
    }),
    defineProduct({
      name: pageName.value,
      description: metaDescription.value,
      ...(productImageUrl.value ? { image: productImageUrl.value } : {}),
      brand: { '@type': 'Brand', name: 'Vitadiet' },
      ...(offerPrice.value
        ? {
            offers: {
              '@type': 'Offer',
              price: offerPrice.value,
              priceCurrency: 'SAR',
              availability: 'https://schema.org/InStock',
              ...(product.value.buyLink ? { url: product.value.buyLink } : {}),
            },
          }
        : {}),
    }),
  ])
})
</script>
