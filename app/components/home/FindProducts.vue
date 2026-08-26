<template>
  <section id="where-to-buy" class="section-block">
    <div class="content-container">
      <BaseSectionHeader
        :heading="$t('findProductsSection.heading')"
        :description="$t('findProductsSection.description')"
      />

      <div class="grid gap-gutter lg:grid-cols-[1fr_0.8fr]">
        <div class="panel-card bg-surface-raised">
          <h3 class="mb-page text-title font-bold text-ink">
            {{ $t('findProductsSection.availableHeading') }}
          </h3>
          <div class="grid gap-page sm:grid-cols-2">
            <a
              v-for="product in availableProducts"
              :key="product.slug"
              :href="`${productPath(product.slug)}#where-to-buy`"
              class="focus-ring flex min-h-16 items-center gap-page rounded-card border border-line bg-surface px-page py-page text-ink transition-colors hover:border-brand-primary hover:text-brand-primary"
            >
              <span
                class="relative h-action w-action shrink-0 overflow-hidden rounded-card bg-surface-raised"
              >
                <BaseImage
                  :src="getPrimaryImage(product).src"
                  alt=""
                  :width="getPrimaryImage(product).width"
                  :height="getPrimaryImage(product).height"
                  sizes="48px"
                  fill
                  fit="contain"
                  aria-hidden="true"
                />
              </span>
              <span class="text-small font-bold leading-tight">{{
                getProductTitle(product, locale)
              }}</span>
            </a>
          </div>
        </div>

        <div class="panel-card">
          <h3 class="mb-page text-title font-bold text-ink">
            {{ $t('findProductsSection.soonHeading') }}
          </h3>
          <ul class="grid gap-control-y">
            <li
              v-for="product in comingSoonProducts"
              :key="product.slug"
              class="flex items-center gap-page rounded-card border border-line bg-surface-raised px-page py-page text-small font-semibold text-ink-soft"
            >
              <!-- Greyed to match the not-yet-buyable treatment used on the product cards. -->
              <span class="relative h-action w-action shrink-0 overflow-hidden rounded-card">
                <BaseImage
                  :src="getPrimaryImage(product).src"
                  alt=""
                  :width="getPrimaryImage(product).width"
                  :height="getPrimaryImage(product).height"
                  sizes="48px"
                  fill
                  fit="contain"
                  class="grayscale"
                  aria-hidden="true"
                />
              </span>
              <span class="min-w-0">{{ getProductTitle(product, locale) }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { products } from '~/data/products'
import {
  getPrimaryImage,
  getProductTitle,
  hasBuyablePurchaseOptions,
} from '~/services/product-catalog'

const { locale } = useI18n()
const { productPath } = useProductPath()

const availableProducts = computed(() =>
  products.filter((product) => hasBuyablePurchaseOptions(product)),
)
const comingSoonProducts = computed(() =>
  products.filter((product) => !hasBuyablePurchaseOptions(product)),
)
</script>
