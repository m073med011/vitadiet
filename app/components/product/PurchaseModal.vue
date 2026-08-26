<template>
  <div
    v-if="open && product"
    class="fixed inset-0 z-50 flex items-end justify-center bg-overlay/55 px-page py-page sm:items-center"
    role="presentation"
    @click.self="$emit('close')"
  >
    <section
      class="max-h-[min(42rem,calc(100svh_-_2rem))] w-full max-w-3xl overflow-y-auto rounded-card border border-line bg-surface p-card shadow-float"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="titleId"
    >
      <div class="mb-page flex items-start justify-between gap-page">
        <div>
          <p class="eyebrow-text">{{ $t('purchase.modalEyebrow') }}</p>
          <h2 :id="titleId" class="mt-1 text-heading font-bold leading-heading text-ink">
            {{ $t('purchase.modalTitle', { name: productTitle }) }}
          </h2>
        </div>
        <BaseButton
          native-type="button"
          variant="icon"
          :aria-label="$t('purchase.close')"
          @click="$emit('close')"
        >
          <XIcon class="h-icon-md w-icon-md" aria-hidden="true" />
        </BaseButton>
      </div>

      <ProductPurchaseOptions :product="product" />
    </section>
  </div>
</template>

<script setup lang="ts">
import { XIcon } from 'lucide-vue-next'
import type { HomeProduct } from '~/types'
import { getProductTitle } from '~/services/product-catalog'

const props = defineProps<{
  open: boolean
  product?: HomeProduct
}>()

defineEmits<{
  close: []
}>()

const { locale } = useI18n()
const titleId = useId()
const productTitle = computed(() =>
  props.product ? getProductTitle(props.product, locale.value) : '',
)
</script>
