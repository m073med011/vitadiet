<template>
  <section :dir="pageDirection" class="bg-surface lg:min-h-[calc(100svh_-_var(--anchor-offset))]">
    <div
      class="mx-auto grid max-w-content items-center gap-gutter-lg px-page py-section-sm sm:px-gutter md:px-page-lg lg:min-h-[calc(100svh_-_var(--anchor-offset))] lg:grid-cols-[minmax(0,1.08fr)_var(--spacing-avatar)_minmax(0,0.92fr)] lg:gap-gutter-lg lg:py-page lg:[direction:ltr]"
    >
      <div
        :dir="pageDirection"
        class="flex items-center justify-center lg:col-start-3 lg:row-start-1"
        data-aos="fade-up"
        data-aos-delay="150"
      >
        <div class="flex w-full max-w-152 flex-col items-start justify-center text-start">
          <p
            class="mb-page inline-flex w-fit items-center rounded-pill border border-brand-primary/20 bg-brand-primary-soft px-page py-control-y-sm text-caption font-bold tracking-label uppercase text-brand-primary"
          >
            {{ $t('categoryPage.eyebrow') }}
          </p>

          <h1
            class="max-w-136 text-heading font-bold leading-heading text-ink md:text-heading-lg lg:text-display"
          >
            {{ $t(product.titleKey) }}
          </h1>

          <p
            class="mt-gutter max-w-152 whitespace-pre-line text-copy-lg font-medium leading-copy text-ink-soft"
          >
            {{ description }}
          </p>

          <div
            class="mt-gutter inline-flex w-fit flex-wrap items-center gap-page rounded-card border border-line/80 bg-surface-raised px-page py-control-y shadow-card"
          >
            <ProductPriceBadge :price-key="product.priceKey" size="lg" />
          </div>

          <div class="mt-gutter flex">
            <BaseButton
              :href="product.buyLink"
              :target="product.buyLink ? '_blank' : undefined"
              :rel="product.buyLink ? 'noopener noreferrer nofollow sponsored' : undefined"
              :disabled="!product.buyLink"
              variant="primary"
            >
              {{ product.buyLink ? $t('categoryPage.cta') : $t('productPage.comingSoon') }}
              <ArrowRightIcon
                v-if="product.buyLink"
                class="h-icon-md w-icon-md shrink-0 rtl:rotate-180"
                aria-hidden="true"
              />
            </BaseButton>
          </div>
        </div>
      </div>

      <ProductImageRotator
        :images="galleryImages"
        :alt="$t(product.titleKey)"
        :page-direction="pageDirection"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { ArrowRightIcon } from 'lucide-vue-next'
import type { HomeProduct } from '~/types'

const props = defineProps<{
  product: HomeProduct
}>()

const { t, locale } = useI18n()

const isRtl = computed(() => locale.value === 'ar')
const pageDirection = computed(() => (isRtl.value ? 'rtl' : 'ltr'))

const galleryImages = computed(() => [props.product.image, ...(props.product.gallery ?? [])])

const description = computed(() =>
  props.product.descriptionKey ? t(props.product.descriptionKey) : t('categoryPage.description'),
)
</script>
