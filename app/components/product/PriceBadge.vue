<template>
  <span
    class="shrink-0 rounded-pill bg-brand-primary-soft font-bold text-brand-primary flex items-center justify-center"
    :class="
      size === 'lg'
        ? 'px-page py-control-y-sm text-title gap-rule'
        : 'px-2 sm:px-page py-1 sm:py-control-y-sm text-caption sm:text-small gap-1'
    "
  >
    <span>{{ priceLabel }}</span>
    <SaudiRiyalIcon
      v-if="showsCurrency"
      class="shrink-0"
      :class="size === 'lg' ? 'h-icon-md w-icon-md' : 'h-3 w-3 sm:h-4 sm:w-4'"
      aria-hidden="true"
    />
    <span v-if="showsCurrency" class="sr-only">
      {{ $t('a11y.priceCurrency') }}
    </span>
  </span>
</template>

<script setup lang="ts">
import { SaudiRiyalIcon } from 'lucide-vue-next'
import type { ProductPrice } from '~/types'
import { formatOfficialPrice, hasApprovedPrice } from '~/services/product-catalog'
import { isNumericPrice } from '~/utils/price'

const props = withDefaults(
  defineProps<{
    price?: ProductPrice
    priceKey?: string
    size?: 'sm' | 'lg'
  }>(),
  {
    price: undefined,
    priceKey: undefined,
    size: 'sm',
  },
)

const { t } = useI18n()

const priceLabel = computed(() => {
  if (hasApprovedPrice(props.price)) return formatOfficialPrice(props.price)
  if (props.priceKey) return t(props.priceKey)
  return t('productPage.comingSoon')
})

const showsCurrency = computed(() => {
  if (hasApprovedPrice(props.price)) return true
  return isNumericPrice(priceLabel.value)
})
</script>
