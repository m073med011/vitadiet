<template>
  <article
    class="product-card group/card flex h-full flex-col overflow-hidden rounded-card border border-line/80 bg-surface shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
  >
    <div class="relative aspect-[4/5] w-full overflow-hidden bg-surface-muted">
      <BaseImage
        :src="product.image"
        :alt="$t(product.titleKey)"
        fill
        class="object-contain p-page transition-transform duration-500 group-hover/card:scale-105"
      />
    </div>

    <div class="flex flex-1 flex-col gap-3 p-3 sm:gap-page sm:p-page">
      <div
        class="flex flex-col items-start gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-page"
      >
        <h3 class="product-title text-copy font-bold leading-tight text-ink sm:leading-heading">
          {{ $t(product.titleKey) }}
        </h3>
        <ProductPriceBadge :price-key="product.priceKey" />
      </div>

      <p class="product-description text-small leading-copy text-ink-soft">
        {{ shortDescription }}
      </p>

      <div class="mt-auto grid gap-control-y border-t border-line pt-3 sm:pt-page">
        <div class="flex flex-wrap items-center gap-control-y-sm">
          <span
            class="rounded-pill bg-surface-raised px-page py-control-y-sm text-caption font-bold text-ink-soft"
          >
            {{ $t(packSizeKey) }}
          </span>
          <span
            class="rounded-pill px-page py-control-y-sm text-caption font-bold"
            :class="
              isAvailable
                ? 'bg-brand-primary-soft text-brand-primary'
                : 'bg-surface-muted text-ink-soft'
            "
          >
            {{
              $t(
                isAvailable
                  ? 'productCard.availability.available'
                  : 'productCard.availability.soon',
              )
            }}
          </span>
        </div>

        <div class="grid gap-control-y sm:grid-cols-2">
          <BaseButton :to="productPath(product.slug)" variant="secondary">
            <InfoIcon class="h-icon-sm w-icon-sm" aria-hidden="true" />
            {{ $t('productCard.learnMore') }}
            <span class="sr-only"> - {{ $t(product.titleKey) }}</span>
          </BaseButton>
          <BaseButton
            v-if="product.buyLink"
            :href="product.buyLink"
            target="_blank"
            rel="noopener noreferrer nofollow sponsored"
            variant="primary"
          >
            <ShoppingBagIcon class="h-icon-sm w-icon-sm" aria-hidden="true" />
            {{ $t('productCard.whereBuy') }}
          </BaseButton>
          <BaseButton v-else disabled variant="primary">
            <ShoppingBagIcon class="h-icon-sm w-icon-sm" aria-hidden="true" />
            {{ $t('productCard.whereBuy') }}
          </BaseButton>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { ProductSlug } from '#shared/products'
import { InfoIcon, ShoppingBagIcon } from 'lucide-vue-next'
import type { HomeProduct } from '~/types'

const props = defineProps<{
  product: HomeProduct
}>()

const { t } = useI18n()
const { productPath } = useProductPath()

const packSizeKeyBySlug: Record<ProductSlug, string> = {
  bestrong: 'productCard.packSize.bestrong',
  becalme: 'productCard.packSize.becalme',
  vitagen: 'productCard.packSize.vitagen',
  femavit: 'productCard.packSize.femavit',
  floradit: 'productCard.packSize.floradit',
  'green-pharmacy': 'productCard.packSize.greenPharmacy',
  dplus: 'productCard.packSize.dplus',
  soluro: 'productCard.packSize.soluro',
  flowadite: 'productCard.packSize.flowadite',
}

const shortDescription = computed(() => {
  if (!props.product.descriptionKey) return t('categoryPage.description')
  return t(props.product.descriptionKey).split('\n')[0]
})

const packSizeKey = computed(() => packSizeKeyBySlug[props.product.slug])
const isAvailable = computed(() => Boolean(props.product.buyLink))
</script>

<style scoped>
.product-title {
  display: -webkit-box;
  min-height: 2.75rem;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.product-description {
  display: -webkit-box;
  min-height: 3.75rem;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}

@media (min-width: 640px) {
  .product-title {
    min-height: 3.5rem;
    -webkit-line-clamp: 3;
  }

  .product-description {
    min-height: 4.75rem;
    -webkit-line-clamp: 4;
  }
}
</style>
