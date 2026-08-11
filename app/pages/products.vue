<template>
  <div class="pt-24 pb-12 min-h-screen">
    <div class="content-container">
      <h1 class="text-4xl font-bold text-center mb-8" data-aos="fade-up">{{ $t('productPage.heading') }}</h1>
      <p class="text-copy-lg leading-copy text-ink-soft text-center max-w-copy mx-auto mb-8" data-aos="fade-up" data-aos-delay="100">
        {{ $t('productPage.description') }}
      </p>

      <!-- Indexable product index: real internal links to every product detail page -->
      <ul class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter mb-12">
        <li v-for="product in products" :key="product.slug" data-aos="fade-up">
          <ProductCard :product="product" />
        </li>
      </ul>

      <div class="text-center" data-aos="fade-up" data-aos-delay="200">
        <BaseButton href="mailto:b2b@vitadiet.sa" variant="primary">
          {{ $t('productPage.cta') }}
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { products } from '~/data/home'

const { t } = useI18n()
const { productPath } = useProductPath()
const siteUrl = useSiteConfig().url

// ItemList schema mirrors the visible product grid so the listing can earn a
// richer, ordered result in search.
useSchemaOrg([
  defineItemList({
    itemListElement: products.map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: t(product.titleKey),
      url: new URL(productPath(product.slug), siteUrl).toString(),
    })),
  }),
])

// titleTemplate in app.vue appends " - Vitadiet"; keep this brand-free.
useSeoMeta({
  title: () => t('productPage.heading'),
  description: () => t('productPage.description'),
  ogTitle: () => t('productPage.heading'),
  ogDescription: () => t('productPage.description'),
})
</script>
