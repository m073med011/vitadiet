<template>
  <div class="pt-24 pb-12 min-h-screen">
    <div class="max-w-content mx-auto px-page sm:px-gutter md:px-page-lg">
      <h1 class="text-4xl font-bold text-center mb-8" data-aos="fade-up">{{ $t('productPage.heading') }}</h1>
      <p class="text-copy-lg leading-copy text-ink-soft text-center max-w-copy mx-auto mb-8" data-aos="fade-up" data-aos-delay="100">
        {{ $t('productPage.description') }}
      </p>

      <!-- Indexable product index: real internal links to every product detail page -->
      <ul class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter mb-12">
        <li v-for="product in products" :key="product.slug" data-aos="fade-up">
          <NuxtLink
            :to="productPath(product.slug)"
            class="product-card group flex h-full flex-col overflow-hidden rounded-card border border-line/80 bg-surface shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent"
          >
            <div class="relative aspect-[4/5] w-full overflow-hidden bg-surface-muted">
              <BaseImage
                :src="product.image"
                :alt="$t(product.titleKey)"
                fill
                class="object-cover transition-all duration-500 group-hover:scale-105"
              />
            </div>
            <div class="flex flex-1 flex-col gap-page p-page">
              <div class="flex items-start justify-between gap-page">
                <h2 class="text-copy font-bold leading-heading text-ink">{{ $t(product.titleKey) }}</h2>
                <span class="shrink-0 rounded-pill bg-brand-primary-soft px-page py-control-y-sm text-small font-bold text-brand-primary flex items-center justify-center gap-1">
                  <span>{{ $t(product.priceKey) }}</span>
                  <SaudiRiyalIcon v-if="isNumericPrice(product.priceKey)" class="h-4 w-4 shrink-0" aria-hidden="true" />
                </span>
              </div>
            </div>
          </NuxtLink>
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
import { SaudiRiyalIcon } from 'lucide-vue-next'

const { t } = useI18n()
const { productPath } = useProductPath()
const siteUrl = useSiteConfig().url

/** Returns true when the translated price string contains at least one digit */
function isNumericPrice(priceKey: string): boolean {
  return /\d/.test(t(priceKey))
}

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
