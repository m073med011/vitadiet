<template>
  <ProductLanding :product="product" />
</template>

<script setup lang="ts">
import type { HomeProduct } from '~/types'
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
// touching this page. An unknown slug becomes a real 404 during SSR rather than an
// exception thrown from inside a render pass.
const { data } = await useAsyncData(
  () => `product:${slugValue.value}`,
  async () => {
    const found = await getProductBySlug(slugValue.value)
    if (!found) {
      throw createError({
        statusCode: 404,
        statusMessage: t('error.notFound'),
        fatal: true,
      })
    }
    return found
  },
  { watch: [slugValue] },
)

const product = computed(() => data.value as HomeProduct)

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
