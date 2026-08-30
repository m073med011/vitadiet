<template>
  <ProductLanding :product="product" />
</template>

<script setup lang="ts">
import { getProductBySlug } from '~/services/product-catalog'

definePageMeta({
  headerSticky: false,
})

const route = useRoute()
const { t } = useI18n()

const slugValue = computed(() => {
  const value = route.params.slug
  return Array.isArray(value) ? (value[0] ?? '') : String(value)
})

// Resolved through the adapter so a Dashboard-backed source can replace it without
// touching this page.
const { data, error } = await useAsyncData(
  () => `product:${slugValue.value}`,
  () => getProductBySlug(slugValue.value),
  { watch: [slugValue] },
)

// The 404 is raised here rather than inside the handler above: useAsyncData captures a
// handler throw into `error` and lets setup continue, so the SEO composables would go on
// to dereference a product that was never found and turn a missing page into a 500.
// A transport failure stays a 500 — only a resolved-but-absent product is a 404.
if (error.value) {
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
