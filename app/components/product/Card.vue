<template>
  <NuxtLink
    :to="productPath(product.slug)"
    v-bind="extraAttrs"
    class="product-card group/card flex h-full flex-col overflow-hidden rounded-card border border-line/80 bg-surface shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent"
  >
    <div class="relative aspect-[4/5] w-full overflow-hidden bg-surface-muted group/image">
      <BaseImage
        :src="product.image"
        alt=""
        fill
        class="object-cover transition-all duration-500 group-hover/card:scale-105"
        :class="{
          'group-hover/card:opacity-0': showHoverImage && product.gallery && product.gallery[0],
        }"
      />
      <BaseImage
        v-if="showHoverImage && product.gallery && product.gallery[0]"
        :src="product.gallery[0]"
        alt=""
        fill
        class="absolute inset-0 object-cover opacity-0 transition-all duration-500 group-hover/card:scale-105 group-hover/card:opacity-100"
      />
    </div>

    <div class="flex flex-1 flex-col gap-3 sm:gap-page p-3 sm:p-page">
      <div
        class="flex flex-col sm:flex-row items-start sm:items-start sm:justify-between gap-2 sm:gap-page"
      >
        <h3 class="product-title text-copy font-bold leading-tight sm:leading-heading text-ink">
          {{ $t(product.titleKey) }}
        </h3>
        <span
          class="shrink-0 rounded-pill bg-brand-primary-soft px-2 sm:px-page py-1 sm:py-control-y-sm text-caption sm:text-small font-bold text-brand-primary flex items-center justify-center gap-1"
        >
          <span>{{ $t(product.priceKey) }}</span>
          <SaudiRiyalIcon
            v-if="isNumericPrice(t(product.priceKey))"
            class="h-3 w-3 sm:h-4 sm:w-4 shrink-0"
            aria-hidden="true"
          />
        </span>
      </div>

      <div
        class="mt-auto flex items-center justify-between gap-2 sm:gap-page border-t border-line pt-3 sm:pt-page"
      >
        <span
          class="text-caption sm:text-small font-bold tracking-label uppercase text-ink-subtle leading-tight"
        >
          {{ $t('homePage.stats.b2bOnly') }}
        </span>
        <span
          class="product-arrow shrink-0 inline-flex h-8 w-8 sm:h-icon-2xl sm:w-icon-2xl items-center justify-center rounded-pill bg-brand-primary text-surface transition-transform duration-300"
        >
          <ArrowUpRightIcon
            class="h-4 w-4 sm:h-icon-sm sm:w-icon-sm rtl:-rotate-90"
            aria-hidden="true"
          />
        </span>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ArrowUpRightIcon, SaudiRiyalIcon } from 'lucide-vue-next'
import type { HomeProduct } from '~/types'
import { isNumericPrice } from '~/utils/price'

const props = defineProps<{
  product: HomeProduct
  showHoverImage?: boolean
  ariaHidden?: boolean
  tabIndex?: number
}>()

const { t } = useI18n()
const { productPath } = useProductPath()

const extraAttrs = computed(() => {
  const attrs: Record<string, unknown> = {}
  if (props.ariaHidden) attrs['aria-hidden'] = 'true'
  if (props.tabIndex !== undefined) attrs.tabindex = props.tabIndex
  return attrs
})
</script>

<style scoped>
.product-title {
  display: -webkit-box;
  min-height: 2.75rem;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

@media (min-width: 640px) {
  .product-title {
    min-height: 3.5rem;
    -webkit-line-clamp: 3;
  }
}

.product-card:hover .product-arrow {
  transform: translateX(0.25rem);
}

html[dir='rtl'] .product-card:hover .product-arrow {
  transform: translateX(-0.25rem);
}
</style>
