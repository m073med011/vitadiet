<template>
  <span
    class="shrink-0 rounded-pill bg-brand-primary-soft font-bold text-brand-primary flex items-center justify-center"
    :class="
      size === 'lg'
        ? 'px-page py-control-y-sm text-title gap-rule'
        : 'px-2 sm:px-page py-1 sm:py-control-y-sm text-caption sm:text-small gap-1'
    "
  >
    <span>{{ $t(priceKey) }}</span>
    <SaudiRiyalIcon
      v-if="isNumericPrice(t(priceKey))"
      class="shrink-0"
      :class="size === 'lg' ? 'h-icon-md w-icon-md' : 'h-3 w-3 sm:h-4 sm:w-4'"
      aria-hidden="true"
    />
    <span v-if="isNumericPrice(t(priceKey))" class="sr-only">
      {{ $t('a11y.priceCurrency') }}
    </span>
  </span>
</template>

<script setup lang="ts">
import { SaudiRiyalIcon } from 'lucide-vue-next'
import { isNumericPrice } from '~/utils/price'

withDefaults(
  defineProps<{
    priceKey: string
    size?: 'sm' | 'lg'
  }>(),
  {
    size: 'sm',
  },
)

const { t } = useI18n()
</script>
