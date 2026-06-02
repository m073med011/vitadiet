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

      <div class="product-carousel-wrapper relative" data-aos="fade-up">
        <div class="product-rail" aria-label="Vitadiet products">
          <NuxtLink
            v-for="product in products"
            :key="product.slug"
            :to="localePath(`/product/${product.slug}`)"
            class="product-card group/card flex h-full flex-col overflow-hidden rounded-card border border-line/80 bg-surface shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent"
          >
            <div class="relative aspect-[4/5] w-full overflow-hidden bg-surface-muted group/image">
              <BaseImage
                :src="product.image"
                :alt="$t(product.titleKey)"
                fill
                class="object-cover transition-all duration-500 group-hover/card:scale-105"
                :class="{ 'group-hover/card:opacity-0': canUseHover && product.gallery && product.gallery[0] }"
              />
              <BaseImage
                v-if="canUseHover && product.gallery && product.gallery[0]"
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
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { products } from '~/data/home'
import { ArrowUpRightIcon, SaudiRiyalIcon } from 'lucide-vue-next'

const localePath = useLocalePath()
const { t } = useI18n()
const canUseHover = ref(false)
let hoverQuery: MediaQueryList | undefined

function syncHoverCapability(event?: MediaQueryListEvent) {
  canUseHover.value = event ? event.matches : Boolean(hoverQuery?.matches)
}

onMounted(() => {
  hoverQuery = window.matchMedia('(hover: hover) and (pointer: fine)')
  syncHoverCapability()
  hoverQuery.addEventListener('change', syncHoverCapability)
})

onBeforeUnmount(() => {
  hoverQuery?.removeEventListener('change', syncHoverCapability)
})

/** Returns true when the translated price string contains at least one digit */
function isNumericPrice(priceKey: string): boolean {
  return /\d/.test(t(priceKey))
}
</script>

<style scoped>
.product-carousel-wrapper {
  margin-inline: calc(var(--spacing-page, 1rem) * -1);
}

.product-rail {
  display: grid;
  grid-auto-columns: minmax(16rem, 82%);
  grid-auto-flow: column;
  gap: 1.25rem;
  overflow-x: auto;
  overscroll-behavior-inline: contain;
  padding: 0.25rem var(--spacing-page, 1rem) 0.75rem;
  scroll-padding-inline: var(--spacing-page, 1rem);
  scroll-snap-type: inline mandatory;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
}

.product-rail::-webkit-scrollbar {
  display: none;
}

.product-card {
  scroll-snap-align: start;
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

@media (min-width: 640px) {
  .product-rail {
    grid-auto-columns: minmax(17rem, calc((100% - 1.25rem) / 2));
  }
}

@media (min-width: 1024px) {
  .product-rail {
    grid-auto-columns: minmax(18rem, calc((100% - 2.5rem) / 3));
  }
}

@media (min-width: 1280px) {
  .product-rail {
    grid-auto-columns: minmax(16rem, calc((100% - 3.75rem) / 4));
  }
}
</style>
