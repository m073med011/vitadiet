<template>
  <div class="grid gap-page">
    <p v-if="options.length" class="text-small leading-copy text-ink-soft">
      {{ $t('purchase.externalNotice') }}
    </p>

    <ul v-if="options.length" class="grid gap-page">
      <li
        v-for="option in options"
        :key="option.id"
        class="rounded-card border border-line bg-surface px-page py-page"
      >
        <div class="grid gap-page sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
          <div class="flex min-w-0 items-center gap-page">
            <!-- Brand mark when the platform logo is on file, text wordmark otherwise.
                 Either way the platform name is repeated as text in the heading below,
                 so the logo never carries information on its own. -->
            <span
              class="flex h-action w-action shrink-0 items-center justify-center overflow-hidden rounded-card border border-line bg-surface-raised text-caption font-bold uppercase text-ink"
              aria-hidden="true"
            >
              <BaseImage
                v-if="option.logo"
                :src="option.logo.src"
                alt=""
                :width="option.logo.width"
                :height="option.logo.height"
                fit="contain"
                class="h-full w-full p-1"
              />
              <template v-else>{{ option.logoText }}</template>
            </span>
            <div class="min-w-0">
              <h3 class="text-copy font-bold leading-tight text-ink">
                {{ localizeCopy(option.name, locale) }}
              </h3>
              <div class="mt-1 flex flex-wrap items-center gap-2">
                <span class="badge-pill" :class="availabilityClass(option.availability)">
                  {{ $t(getAvailabilityLabelKey(option.availability)) }}
                </span>
                <ProductPriceBadge
                  v-if="hasApprovedPrice(product.price)"
                  class="purchase-price"
                  :price="product.price"
                />
              </div>
            </div>
          </div>

          <BaseButton
            v-if="canBuyFromOption(product, option)"
            :href="option.url"
            target="_blank"
            rel="noopener noreferrer nofollow sponsored"
            variant="primary"
          >
            <ExternalLinkIcon class="h-icon-sm w-icon-sm" aria-hidden="true" />
            {{ $t('purchase.goToPlatform') }}
          </BaseButton>
          <BaseButton v-else disabled variant="secondary">
            {{
              $t(
                option.availability === 'coming_soon'
                  ? 'purchase.comingSoon'
                  : 'purchase.unavailable',
              )
            }}
          </BaseButton>
        </div>
      </li>
    </ul>

    <p
      v-else
      class="rounded-card border border-line bg-surface px-page py-page text-small text-ink-soft"
    >
      {{ $t('purchase.noOptions') }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ExternalLinkIcon } from 'lucide-vue-next'
import type { HomeProduct, PurchaseAvailability } from '~/types'
import {
  canBuyFromOption,
  getAvailabilityLabelKey,
  getPurchaseOptions,
  hasApprovedPrice,
  localizeCopy,
} from '~/services/product-catalog'

const props = defineProps<{
  product: HomeProduct
}>()

const { locale } = useI18n()

const options = computed(() => getPurchaseOptions(props.product))

const availabilityClass = (availability: PurchaseAvailability) => {
  if (availability === 'in_stock') return 'bg-brand-primary-soft text-brand-primary'
  if (availability === 'out_of_stock') return 'bg-surface-muted text-ink-soft'
  return 'bg-brand-accent-soft text-ink'
}
</script>

<style scoped>
.purchase-price {
  margin-inline-start: 0;
}
</style>
