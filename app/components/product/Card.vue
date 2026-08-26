<template>
  <article
    class="product-card group/card flex h-full flex-col overflow-hidden rounded-card border border-line/80 bg-surface shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
  >
    <div class="relative aspect-square w-full overflow-hidden bg-surface-muted">
      <BaseImage
        :src="primaryImage.src"
        :alt="imageAlt"
        :width="primaryImage.width"
        :height="primaryImage.height"
        sizes="xs:85vw md:50vw xl:25vw"
        fill
        :class="productImageClasses"
      />
    </div>

    <div class="flex flex-1 flex-col gap-1.5 p-3 sm:gap-2 sm:p-4">
      <div class="flex items-start">
        <h3 class="product-title text-copy font-bold leading-tight text-ink sm:leading-heading">
          {{ productTitle }}
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
          <template v-else>
            <span class="badge-pill bg-surface-raised text-ink-soft">
              {{ packSize }}
            </span>
            <span
              class="badge-pill"
              :class="
                isAvailable
                  ? 'bg-brand-primary-soft text-brand-primary'
                  : 'bg-surface-muted text-ink-soft'
              "
            >
              {{ $t(cardAvailabilityKey) }}
            </span>
            <ProductPriceBadge
              v-if="hasApprovedPrice(product.price)"
              class="product-meta__price"
              :price="product.price"
            />
          </template>
        </div>

        <div class="product-actions grid gap-2">
          <BaseButton :to="productPath(product.slug)" variant="secondary">
            <InfoIcon class="h-icon-sm w-icon-sm" aria-hidden="true" />
            {{ $t('productCard.learnMore') }}
            <span class="sr-only"> - {{ productTitle }}</span>
          </BaseButton>
          <BaseButton
            v-if="isAvailable && purchaseMode === 'modal'"
            native-type="button"
            variant="primary"
            @click="$emit('showPurchase', product)"
          >
            <ShoppingBagIcon class="h-icon-sm w-icon-sm" aria-hidden="true" />
            {{ $t('productCard.whereBuy') }}
          </BaseButton>
          <BaseButton
            v-else-if="isAvailable"
            :to="`${productPath(product.slug)}#where-to-buy`"
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
import { InfoIcon, ShoppingBagIcon } from 'lucide-vue-next'
import type { HomeProduct } from '~/types'
import {
  getProductDescription,
  getProductImageAlt,
  getProductTitle,
  getPrimaryImage,
  hasApprovedPrice,
  hasBuyablePurchaseOptions,
  localizeCopy,
} from '~/services/product-catalog'

const props = withDefaults(
  defineProps<{
    product: HomeProduct
    purchaseMode?: 'anchor' | 'modal'
  }>(),
  {
    purchaseMode: 'anchor',
  },
)

defineEmits<{
  showPurchase: [product: HomeProduct]
}>()

const { locale } = useI18n()
const { productPath } = useProductPath()

const primaryImage = computed(() => getPrimaryImage(props.product))
const productTitle = computed(() => getProductTitle(props.product, locale.value))
const imageAlt = computed(() => getProductImageAlt(primaryImage.value, locale.value))
const shortDescription = computed(() => getProductDescription(props.product, locale.value))
const packSize = computed(() => localizeCopy(props.product.packSize, locale.value))
const isAvailable = computed(() => hasBuyablePurchaseOptions(props.product))
const cardAvailabilityKey = computed(() =>
  isAvailable.value ? 'productCard.availability.available' : 'productCard.availability.soon',
)
const showSingleComingSoonBadge = computed(() => !isAvailable.value && !props.product.price)
const productImageClasses = computed(() => [
  'object-cover transition-[filter,transform] duration-500 group-hover/card:scale-105',
  !isAvailable.value && 'grayscale group-hover/card:grayscale-0',
])
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
