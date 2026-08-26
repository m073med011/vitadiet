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
              class="focus-ring flex min-h-16 items-center justify-between gap-page rounded-card border border-line bg-surface px-page py-page text-ink transition-colors hover:border-brand-primary hover:text-brand-primary"
            >
              <span class="text-small font-bold leading-tight">{{
                getProductTitle(product, locale)
              }}</span>
              <ShoppingBagIcon class="h-icon-sm w-icon-sm shrink-0" aria-hidden="true" />
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
              class="rounded-card border border-line bg-surface-raised px-page py-page text-small font-semibold text-ink-soft"
            >
              {{ getProductTitle(product, locale) }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ShoppingBagIcon } from 'lucide-vue-next'
import { products } from '~/data/products'
import { getProductTitle, hasBuyablePurchaseOptions } from '~/services/product-catalog'

const { locale } = useI18n()
const { productPath } = useProductPath()

const availableProducts = computed(() =>
  products.filter((product) => hasBuyablePurchaseOptions(product)),
)
const comingSoonProducts = computed(() =>
  products.filter((product) => !hasBuyablePurchaseOptions(product)),
)
</script>
