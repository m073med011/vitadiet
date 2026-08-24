<template>
  <article
    class="product-card group/card flex h-full flex-col overflow-hidden rounded-card border border-line/80 bg-surface shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
  >
    <div class="relative aspect-square w-full overflow-hidden bg-surface-muted">
      <BaseImage
        :src="product.image"
        :alt="$t(product.titleKey)"
        :width="668"
        :height="911"
        fill
        class="object-cover transition-transform duration-500 group-hover/card:scale-105"
      />
    </div>

    <div class="flex flex-1 flex-col gap-1.5 p-3 sm:gap-2 sm:p-4">
      <div class="flex items-start">
        <h3 class="product-title text-copy font-bold leading-tight text-ink sm:leading-heading">
          {{ $t(product.titleKey) }}
        </h3>
      </div>

      <p class="product-description text-small leading-copy text-ink-soft">
        {{ shortDescription }}
      </p>

      <div class="mt-auto grid gap-2 border-t border-line pt-2 sm:pt-3">
        <div class="product-meta flex items-center justify-center gap-1.5">
          <span v-if="showSingleComingSoonBadge" class="badge-pill bg-surface-muted text-ink-soft">
            {{ $t('productCard.availability.soon') }}
          </span>
          <span v-else class="badge-pill bg-surface-raised text-ink-soft">
            {{ $t(packSizeKey) }}
          </span>
          <span
            v-if="!showSingleComingSoonBadge"
            class="badge-pill"
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
          <ProductPriceBadge
            v-if="!showSingleComingSoonBadge"
            class="product-meta__price"
            :price-key="product.priceKey"
          />
        </div>

        <div class="product-actions grid gap-2">
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
const normalizeBadgeText = (value: string) => value.trim().toLocaleLowerCase()
const showSingleComingSoonBadge = computed(() => {
  const soonText = normalizeBadgeText(t('productCard.availability.soon'))

  return (
    normalizeBadgeText(t(packSizeKey.value)) === soonText &&
    normalizeBadgeText(t(props.product.priceKey)) === soonText &&
    !isAvailable.value
  )
})
</script>

<style scoped>
.product-title {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.product-description {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}

.product-meta :deep(.badge-pill),
.product-meta__price {
  min-width: 0;
  padding: 0.375rem 0.625rem;
  font-size: 0.75rem;
  line-height: 1.1;
  white-space: nowrap;
}

.product-meta__price {
  margin-inline-start: 0;
}

.product-actions :deep(a),
.product-actions :deep(button) {
  box-sizing: border-box;
  min-width: 0;
  width: 100%;
  text-align: center;
  white-space: normal;
}

@media (min-width: 640px) {
  .product-title {
    -webkit-line-clamp: 3;
  }

  .product-description {
    -webkit-line-clamp: 4;
  }
}
</style>
