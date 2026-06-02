<template>
  <section :dir="pageDirection" class="bg-surface lg:min-h-[calc(100svh_-_var(--anchor-offset))]">
    <div class="mx-auto grid max-w-content items-center gap-gutter-lg px-page py-section-sm sm:px-gutter md:px-page-lg lg:min-h-[calc(100svh_-_var(--anchor-offset))] lg:grid-cols-[minmax(0,1.08fr)_var(--spacing-avatar)_minmax(0,0.92fr)] lg:gap-gutter-lg lg:py-page lg:[direction:ltr]">
      <div
        :dir="pageDirection"
        class="flex items-center justify-center lg:col-start-3 lg:row-start-1"
        data-aos="fade-up"
        data-aos-delay="150"
      >
        <div class="flex w-full max-w-152 flex-col items-start justify-center text-start">
          <p class="mb-page inline-flex w-fit items-center rounded-pill border border-brand-primary/20 bg-brand-primary-soft px-page py-control-y-sm text-caption font-bold tracking-label uppercase text-brand-primary">
            {{ $t('categoryPage.eyebrow') }}
          </p>

          <h1 class="max-w-136 text-heading font-bold leading-heading text-ink md:text-heading-lg lg:text-display">
            {{ $t(product.titleKey) }}
          </h1>

          <p class="mt-gutter max-w-152 whitespace-pre-line text-copy-lg font-medium leading-copy text-ink-soft">
            {{ description }}
          </p>

          <div class="mt-gutter inline-flex w-fit flex-wrap items-center gap-page rounded-card border border-line/80 bg-surface-raised px-page py-control-y shadow-card">
            <span class="inline-flex items-center justify-center gap-rule text-title font-bold leading-none text-brand-primary">
              <span>{{ $t(product.priceKey) }}</span>
              <SaudiRiyalIcon v-if="isNumericPrice(product.priceKey)" class="h-icon-md w-icon-md shrink-0" aria-hidden="true" />
            </span>
          </div>

          <div class="mt-gutter flex">
            <BaseButton
              :href="product.buyLink || 'mailto:b2b@vitadiet.sa'"
              :target="product.buyLink ? '_blank' : undefined"
              :rel="product.buyLink ? 'noopener noreferrer nofollow sponsored' : undefined"
              variant="primary"
            >
              {{ $t('categoryPage.cta') }}
              <ArrowRightIcon class="h-icon-md w-icon-md shrink-0 rtl:rotate-180" aria-hidden="true" />
            </BaseButton>
          </div>
        </div>
      </div>

      <div
        :dir="pageDirection"
        class="order-first flex flex-col items-center justify-center lg:col-start-1 lg:row-start-1"
        data-aos="fade-up"
      >
        <div
          class="flex h-[clamp(calc(var(--spacing-product-lg)_+_var(--spacing-rule-lg)_+_var(--spacing-product)_+_var(--spacing-page-lg)),58svh,calc(var(--spacing-hero)_-_var(--spacing-rule-lg)_+_var(--spacing-control-y-sm)))] min-h-[calc(var(--spacing-product-lg)_+_var(--spacing-rule-lg)_+_var(--spacing-product)_+_var(--spacing-page-lg))] w-full items-center justify-center md:h-hero md:min-h-product-lg lg:h-[min(var(--spacing-hero-lg),calc(100svh_-_var(--anchor-offset)_-_var(--spacing-gutter)))]"
        >
          <Transition
            mode="out-in"
            enter-active-class="transition-[opacity,transform] duration-[var(--motion-page)] ease-[var(--motion-ease-out)] motion-reduce:transition-none"
            leave-active-class="transition-[opacity,transform] duration-[var(--motion-page)] ease-[var(--motion-ease-out)] motion-reduce:transition-none"
            enter-from-class="translate-y-control-y-sm scale-[0.985] opacity-0 motion-reduce:translate-y-0 motion-reduce:scale-100"
            leave-to-class="translate-y-control-y-sm scale-[0.985] opacity-0 motion-reduce:translate-y-0 motion-reduce:scale-100"
          >
            <BaseImage
              :key="activeImage"
              class="block"
              :src="activeImage"
              :alt="$t(product.titleKey)"
              fill
              fit="contain"
              loading="eager"
            />
          </Transition>
        </div>

        <div
          v-if="galleryImages.length > 1"
          class="mt-gutter-lg flex w-full shrink-0 justify-center gap-page overflow-x-auto pb-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden lg:hidden"
          :aria-label="$t('products')"
        >
          <button
            v-for="(img, index) in galleryImages"
            :key="img"
            type="button"
            :aria-pressed="activeImage === img"
            :aria-label="`${$t(product.titleKey)} ${index + 1}`"
            @click="selectImage(img)"
            class="relative h-action w-action shrink-0 overflow-hidden rounded-pill border-2 bg-surface-raised transition-all duration-300 ease-[var(--motion-ease-out)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent sm:h-avatar sm:w-avatar motion-reduce:translate-y-0 motion-reduce:scale-100 motion-reduce:transition-none"
            :class="activeImage === img ? 'border-brand-primary opacity-100 shadow-float -translate-y-0.5 scale-105' : 'border-line/80 opacity-75 hover:border-brand-primary/50 hover:opacity-100 hover:-translate-y-0.5 hover:scale-105'"
          >
            <BaseImage class="block" :src="img" :alt="$t(product.titleKey)" fill fit="cover" />
          </button>
        </div>
      </div>

      <div
        v-if="galleryImages.length > 1"
        :dir="pageDirection"
        class="hidden shrink-0 flex-col items-center justify-center gap-page lg:col-start-2 lg:row-start-1 lg:flex"
        :aria-label="$t('products')"
      >
        <button
          v-for="(img, index) in galleryImages"
          :key="img"
          type="button"
          :aria-pressed="activeImage === img"
          :aria-label="`${$t(product.titleKey)} ${index + 1}`"
          @click="selectImage(img)"
          class="relative h-avatar w-avatar shrink-0 overflow-hidden rounded-pill border-2 bg-surface-raised transition-all duration-300 ease-[var(--motion-ease-out)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent motion-reduce:translate-y-0 motion-reduce:scale-100 motion-reduce:transition-none"
          :class="activeImage === img ? 'border-brand-primary opacity-100 shadow-float -translate-y-0.5 scale-105' : 'border-line/80 opacity-75 hover:border-brand-primary/50 hover:opacity-100 hover:-translate-y-0.5 hover:scale-105'"
        >
          <BaseImage class="block" :src="img" :alt="$t(product.titleKey)" fill fit="cover" />
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import {
  ArrowRightIcon,
  SaudiRiyalIcon,
} from 'lucide-vue-next'
import type { HomeProduct } from '~/data/home'

const props = defineProps<{
  product: HomeProduct
}>()

const { t, locale } = useI18n()

const IMAGE_ROTATION_DELAY = 3500

let imageRotationTimer: ReturnType<typeof setInterval> | undefined
let reducedMotionQuery: MediaQueryList | undefined

const prefersReducedMotion = ref(false)
const isRtl = computed(() => locale.value === 'ar')
const pageDirection = computed(() => isRtl.value ? 'rtl' : 'ltr')

/** Returns true when the translated price string contains at least one digit */
function isNumericPrice(priceKey: string): boolean {
  return /\d/.test(t(priceKey))
}

const activeImage = ref(props.product.image)
const galleryImages = computed(() => [props.product.image, ...(props.product.gallery ?? [])])

function clearImageRotation() {
  if (!imageRotationTimer) {
    return
  }

  clearInterval(imageRotationTimer)
  imageRotationTimer = undefined
}

function rotateImage() {
  const images = galleryImages.value

  if (images.length < 2) {
    return
  }

  const currentIndex = images.indexOf(activeImage.value)
  const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % images.length

  activeImage.value = images[nextIndex]
}

function startImageRotation() {
  clearImageRotation()

  if (prefersReducedMotion.value || galleryImages.value.length < 2) {
    return
  }

  imageRotationTimer = setInterval(rotateImage, IMAGE_ROTATION_DELAY)
}

function selectImage(img: string) {
  activeImage.value = img
  startImageRotation()
}

function syncReducedMotionPreference(event: MediaQueryListEvent) {
  prefersReducedMotion.value = event.matches
  startImageRotation()
}

watch(() => props.product, (newProduct) => {
  activeImage.value = newProduct.image
  startImageRotation()
})

const description = computed(() => (
  props.product.descriptionKey ? t(props.product.descriptionKey) : t('categoryPage.description')
))

onMounted(() => {
  reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  prefersReducedMotion.value = reducedMotionQuery.matches
  reducedMotionQuery.addEventListener('change', syncReducedMotionPreference)
  startImageRotation()
})

onBeforeUnmount(() => {
  clearImageRotation()
  reducedMotionQuery?.removeEventListener('change', syncReducedMotionPreference)
})

</script>
