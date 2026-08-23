<template>
  <ProductLanding :product="product" />
</template>

<script setup lang="ts">
import { products } from '~/data/products'

definePageMeta({
  headerSticky: false,
})

const route = useRoute()
const slug = computed(() => route.params.slug)
const { t } = useI18n()

const slugValue = computed(() => {
  const value = slug.value
  return Array.isArray(value) ? (value[0] ?? '') : String(value)
})

const product = computed(() => {
  const foundProduct = products.find((item) => item.slug === slugValue.value)
  if (!foundProduct) {
    throw createError({
      statusCode: 404,
      statusMessage: t('error.notFound'),
    })
  }
  return foundProduct
})

const productSeo = useProductSeo(product)
const { imageHeight, imageWidth, metaDescription, pageName, productImageUrl } = productSeo

usePageSeo({
  title: () => pageName.value,
  description: () => metaDescription.value,
  image: () => productImageUrl.value,
  imageAlt: () => pageName.value,
  imageHeight,
  imageWidth,
})

useProductSchema(product.value, productSeo)
</script>
