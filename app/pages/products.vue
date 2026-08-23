<template>
  <div class="pt-section-lg pb-section-sm min-h-screen">
    <div class="content-container">
      <h1 class="text-heading-lg font-bold text-center mb-8" data-aos="fade-up">
        {{ $t('productPage.heading') }}
      </h1>
      <p
        class="text-copy-lg leading-copy text-ink-soft text-center max-w-copy mx-auto mb-8"
        data-aos="fade-up"
        data-aos-delay="100"
      >
        {{ $t('productPage.description') }}
      </p>

      <ul class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-gutter mb-12">
        <li v-for="product in products" :key="product.slug" data-aos="fade-up">
          <ProductCard :product="product" />
        </li>
      </ul>

      <div class="text-center" data-aos="fade-up" data-aos-delay="200">
        <BaseButton :href="`mailto:${CONTACT.email}`" variant="primary">
          {{ $t('productPage.cta') }}
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CONTACT } from '#shared/brand'
import { products } from '~/data/products'

const { t } = useI18n()
const { productPath } = useProductPath()
const { absoluteSiteUrl } = useSiteUrls()

useSchemaOrg([
  defineItemList({
    itemListElement: products.map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: t(product.titleKey),
      url: absoluteSiteUrl(productPath(product.slug)),
    })),
  }),
])

usePageSeo({
  title: () => t('productPage.heading'),
  description: () => t('productPage.description'),
})
</script>
