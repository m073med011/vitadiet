<template>
  <section id="products" class="w-full py-section md:py-section-lg bg-surface">
    <div class="max-w-content mx-auto px-page sm:px-gutter md:px-page-lg">

      <div class="text-center max-w-copy mx-auto mb-rule-sm" data-aos="fade-up">
        <h2 class="text-heading md:text-heading-lg leading-heading font-bold text-ink uppercase tracking-label mb-page">
          {{ $t('homePage.products.heading') }}
        </h2>
        <p class="text-copy-lg leading-copy text-ink-soft">
          {{ $t('homePage.products.description') }}
        </p>
      </div>

      <div class="product-carousel-wrapper group relative" data-aos="fade-up">
        <Swiper
          :modules="[Autoplay, Navigation, Pagination]"
          :slides-per-view="1"
          :space-between="20"
          :loop="true"
          :autoplay="{
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true
          }"
          :navigation="true"
          :pagination="{
            clickable: true,
          }"
          :breakpoints="{
            '640': { slidesPerView: 2 },
            '1024': { slidesPerView: 3 },
            '1280': { slidesPerView: 4 }
          }"
          class="!pb-12"
        >
          <SwiperSlide
            v-for="product in products"
            :key="product.slug"
            class="!h-auto"
          >
            <NuxtLink
              :to="localePath(`/product/${product.slug}`)"
              class="product-card group/card flex h-full flex-col overflow-hidden rounded-card border border-line/80 bg-surface shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent"
            >
              <div class="relative aspect-[4/5] w-full overflow-hidden bg-surface-muted group/image">
                <BaseImage 
                  :src="product.image" 
                  :alt="$t(product.titleKey)" 
                  fill 
                  class="object-cover transition-all duration-500 group-hover/card:scale-105"
                  :class="{ 'group-hover/card:opacity-0': product.gallery && product.gallery[0] }"
                />
                <BaseImage 
                  v-if="product.gallery && product.gallery[0]"
                  :src="product.gallery[0]" 
                  :alt="$t(product.titleKey)" 
                  fill 
                  class="absolute inset-0 object-cover opacity-0 transition-all duration-500 group-hover/card:scale-105 group-hover/card:opacity-100" 
                />
              </div>

              <div class="flex flex-1 flex-col gap-page p-page">
                <div class="flex items-start justify-between gap-page">
                  <h3 class="product-title text-copy font-bold leading-heading text-ink">{{ $t(product.titleKey) }}</h3>
                  <span class="shrink-0 rounded-pill bg-brand-primary-soft px-page py-control-y-sm text-small font-bold text-brand-primary flex items-center justify-center gap-1">
                    <span>{{ $t(product.priceKey) }}</span>
                    <SaudiRiyalIcon v-if="isNumericPrice(product.priceKey)" class="h-4 w-4 shrink-0" aria-hidden="true" />
                  </span>
                </div>

                <div class="mt-auto flex items-center justify-between gap-page border-t border-line pt-page">
                  <span class="text-caption font-bold tracking-label uppercase text-ink-subtle">
                    {{ $t('homePage.stats.b2bOnly') }}
                  </span>
                  <span class="product-arrow inline-flex h-icon-2xl w-icon-2xl items-center justify-center rounded-pill bg-brand-primary text-surface transition-transform duration-300">
                    <ArrowUpRightIcon class="h-icon-sm w-icon-sm rtl:-rotate-90" aria-hidden="true" />
                  </span>
                </div>
              </div>
            </NuxtLink>
          </SwiperSlide>
        </Swiper>
      </div>

    </div>
  </section>
</template>

<script setup lang="ts">
import { products } from '~/data/home'
import { ArrowUpRightIcon, SaudiRiyalIcon } from 'lucide-vue-next'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay, Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const localePath = useLocalePath()
const { t } = useI18n()

/** Returns true when the translated price string contains at least one digit */
function isNumericPrice(priceKey: string): boolean {
  return /\d/.test(t(priceKey))
}
</script>

<style scoped>
.product-carousel-wrapper {
  --swiper-navigation-color: var(--color-brand-primary);
}

.product-title {
  display: -webkit-box;
  min-height: 3.5rem;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}

.product-card:hover .product-arrow {
  transform: translateX(0.25rem);
}

html[dir="rtl"] .product-card:hover .product-arrow {
  transform: translateX(-0.25rem);
}

:deep(.swiper-button-next),
:deep(.swiper-button-prev) {
  color: var(--color-brand-primary);
  opacity: 0.9;
  transition:
    transform var(--motion-standard) var(--motion-ease-out),
    opacity var(--motion-standard) var(--motion-ease-out),
    background-color var(--motion-standard) var(--motion-ease-out);
  background-color: color-mix(in oklab, var(--color-surface) 88%, transparent);
  border: 1px solid color-mix(in oklab, var(--color-line) 80%, transparent);
  width: 2.5rem;
  height: 2.5rem;
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
  backdrop-filter: blur(8px);
}

:deep(.swiper-button-next:hover),
:deep(.swiper-button-prev:hover) {
  opacity: 1;
  background-color: var(--color-brand-primary);
  color: var(--color-surface);
  transform: translateY(-1px);
}

:deep(.swiper-button-next:focus-visible),
:deep(.swiper-button-prev:focus-visible) {
  outline: 2px solid var(--color-brand-accent);
  outline-offset: 3px;
}

:deep(.swiper-button-next:after),
:deep(.swiper-button-prev:after) {
  font-size: 1.1rem;
  font-weight: bold;
}

:deep(.swiper-pagination) {
  bottom: 0;
  background-color: color-mix(in oklab, var(--color-surface) 86%, transparent);
  border: 1px solid color-mix(in oklab, var(--color-line) 80%, transparent);
  backdrop-filter: blur(8px);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.35rem 0.75rem;
  border-radius: 9999px;
  width: auto;
  left: 50%;
  transform: translateX(-50%);
}
:deep(.swiper-pagination-bullet) {
  width: 0.4rem;
  height: 0.4rem;
  background-color: var(--color-ink-subtle);
  opacity: 0.5;
  margin: 0 0.25rem !important;
  transition: all 0.3s ease;
}
:deep(.swiper-pagination-bullet-active) {
  opacity: 1;
  background-color: var(--color-brand-primary);
  width: 1.15rem;
  border-radius: var(--radius-pill);
}


</style>
