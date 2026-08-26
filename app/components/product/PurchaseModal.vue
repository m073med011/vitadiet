<template>
  <div
    v-if="open && product"
    class="fixed inset-0 z-50 flex items-end justify-center bg-overlay/55 px-page py-page sm:items-center"
    role="presentation"
    @click.self="$emit('close')"
  >
    <section
      ref="dialog"
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
          ref="closeButton"
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
import type { ComponentPublicInstance } from 'vue'
import type { HomeProduct } from '~/types'
import { getProductTitle } from '~/services/product-catalog'

const props = defineProps<{
  open: boolean
  product?: HomeProduct
}>()

const emit = defineEmits<{
  close: []
}>()

const { locale } = useI18n()
const titleId = useId()
const productTitle = computed(() =>
  props.product ? getProductTitle(props.product, locale.value) : '',
)

const dialog = ref<HTMLElement | null>(null)
const closeButton = ref<ComponentPublicInstance | null>(null)

const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

function getFocusableElements() {
  return Array.from(dialog.value?.querySelectorAll<HTMLElement>(focusableSelector) ?? []).filter(
    (element) => element.getClientRects().length > 0,
  )
}

function handleKeydown(event: KeyboardEvent) {
  if (!props.open) return

  if (event.key === 'Escape') {
    event.preventDefault()
    emit('close')
    return
  }

  if (event.key !== 'Tab') return

  const focusableElements = getFocusableElements()
  const firstElement = focusableElements[0]
  const lastElement = focusableElements.at(-1)

  if (!firstElement || !lastElement) {
    event.preventDefault()
    return
  }

  if (!dialog.value?.contains(document.activeElement)) {
    event.preventDefault()
    firstElement.focus()
    return
  }

  if (event.shiftKey && document.activeElement === firstElement) {
    event.preventDefault()
    lastElement.focus()
  } else if (!event.shiftKey && document.activeElement === lastElement) {
    event.preventDefault()
    firstElement.focus()
  }
}

// Remember whatever opened the modal so focus returns there on close, and hold the
// page still while the dialog owns the viewport.
let previouslyFocused: HTMLElement | null = null
let previousBodyOverflow = ''

watch(
  () => props.open,
  async (open) => {
    if (open) {
      previouslyFocused = document.activeElement as HTMLElement | null
      previousBodyOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      await nextTick()
      ;(closeButton.value?.$el as HTMLElement | undefined)?.focus()
      return
    }

    document.body.style.overflow = previousBodyOverflow
    previouslyFocused?.focus()
    previouslyFocused = null
  },
)

onMounted(() => document.addEventListener('keydown', handleKeydown))
onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeydown)
  if (props.open) document.body.style.overflow = previousBodyOverflow
})
</script>
