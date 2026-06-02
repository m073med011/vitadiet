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

const { t } = useI18n()

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

const pageDescription = computed(() => {
  if (product.value?.descriptionKey) return t(product.value.descriptionKey)
  return t('categoryPage.description')
})

/** Numeric SAR price for the Offer, or null when the price isn't a number (e.g. "Coming Soon"). */
const offerPrice = computed(() => {
  if (!product.value) return null
  const raw = t(product.value.priceKey)
  return /\d/.test(raw) ? raw.replace(/[^\d.]/g, '') : null
})

// The titleTemplate in app.vue already appends " - Vitadiet"; keep page titles brand-free.
useSeoMeta({
  title: () => pageName.value,
  description: () => pageDescription.value,
  ogTitle: () => pageName.value,
  ogDescription: () => pageDescription.value,
})

watchEffect(() => {
  if (!product.value) return

  useSchemaOrg([
    defineProduct({
      name: pageName.value,
      description: pageDescription.value,
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
