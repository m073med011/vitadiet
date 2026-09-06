<template>
  <ProductLanding :product="product" />
</template>

<script setup lang="ts">
definePageMeta({
  headerSticky: false,
})

const route = useRoute()
const { t } = useI18n()

const slugValue = computed(() => {
  const value = route.params.slug
  return Array.isArray(value) ? (value[0] ?? '') : String(value)
})

// `GET /products/{slug}`, resolved during SSR so the page is fully in the prerendered
// markup. The endpoint takes an id or a slug; the route only ever supplies a slug.
const { data, error } = await useProduct(slugValue)

// The failure is classified here rather than inside the handler: useAsyncData captures a
// handler throw into `error` and lets setup continue, so the SEO composables would go on
// to dereference a product that was never found and turn a missing page into a 500.
//
// A 404 from the Dashboard means the slug is not a product, which is this site's own 404
// with this site's own copy. Anything else - a timeout, a 500, an unparseable body - is a
// server error and must stay one, or an outage would quietly de-index every product.
const requestStatus = computed(() => (error.value as { statusCode?: number } | null)?.statusCode)

if (error.value && requestStatus.value !== 404) {
  throw error.value
}

const resolvedProduct = data.value
if (!resolvedProduct) {
  throw createError({
    statusCode: 404,
    statusMessage: t('error.notFound'),
    fatal: true,
  })
}

// `data` stays the reactive source; `resolvedProduct` is only what proves to TypeScript
// that the 404 above already ruled the undefined case out.
const product = computed(() => data.value ?? resolvedProduct)

const productSeo = useProductSeo(product)
const { imageHeight, imageWidth, metaDescription, pageName, productImageAlt, productImageUrl } =
  productSeo

usePageSeo({
  title: () => pageName.value,
  description: () => metaDescription.value,
  image: () => productImageUrl.value,
  imageAlt: () => productImageAlt.value,
  imageHeight,
  imageWidth,
})

useProductSchema(product.value, productSeo)
</script>
