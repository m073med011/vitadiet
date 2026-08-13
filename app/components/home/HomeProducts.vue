<template>
  <section id="products" class="w-full py-section md:py-section-lg bg-surface">
    <div class="content-container">
      <div class="text-center max-w-copy mx-auto mb-rule-sm" data-aos="fade-up">
        <h2 class="text-heading md:text-heading-lg leading-heading font-bold text-ink uppercase tracking-label mb-page">
          {{ $t('homePage.products.heading') }}
        </h2>
        <p class="text-copy-lg leading-copy text-ink-soft">
          {{ $t('homePage.products.description') }}
        </p>
      </div>
    </div>

    <div v-if="!isMounted" class="ssr-fallback-grid content-container mb-8">
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        <ProductCard
          v-for="(product, index) in products"
          :key="`${product.slug}-ssr-${index}`"
          :product="product"
          :show-hover-image="false"
        />
      </div>
    </div>

    <div
      v-else
      class="product-carousel-wrapper content-container"
      role="region"
      :aria-label="$t('homePage.products.carouselLabel')"
      data-aos="fade-up"
      @mouseenter="paused = true"
      @mouseleave="paused = false"
      @focusin="handleCarouselFocusIn"
      @focusout="handleCarouselFocusOut"
    >
      <button
        type="button"
        class="product-nav product-nav--prev absolute top-1/2 start-4 md:start-8 z-10"
        :aria-label="$t('homePage.products.prev')"
        @click="nudge(-1)"
      >
        <ChevronLeftIcon class="h-icon-sm w-icon-sm rtl:rotate-180" aria-hidden="true" />
      </button>

      <div
        ref="viewport"
        class="product-viewport"
        @touchstart.passive="handleTouchStart"
        @touchmove.passive="handleTouchMove"
        @touchend.passive="handleTouchEnd"
      >
        <div ref="track" class="product-track">
          <ProductCard
            v-for="(product, index) in loopProducts"
            :key="`${product.slug}-${index}`"
            :product="product"
            :show-hover-image="canUseHover"
            :aria-hidden="index >= products.length"
            :tab-index="index >= products.length ? -1 : undefined"
          />
        </div>
      </div>

      <button
        type="button"
        class="product-nav product-nav--next absolute top-1/2 end-4 md:end-8 z-10"
        :aria-label="$t('homePage.products.next')"
        @click="nudge(1)"
      >
        <ChevronRightIcon class="h-icon-sm w-icon-sm rtl:rotate-180" aria-hidden="true" />
      </button>
    </div>

    <div class="content-container">
      <div class="mt-gutter-lg flex justify-center" data-aos="fade-up">
        <BaseButton :to="localePath('/products/')" variant="secondary">
          {{ $t('homePage.products.viewAll') }}
        </BaseButton>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref } from 'vue'
import { products } from '~/data/home'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-vue-next'

const localePath = useLocalePath()
const canUseHover = ref(false)

// Keep SSR and the first client render on the same fallback branch. Rendering
// Vue components inside a body <noscript> makes browsers parse them as text
// when JavaScript is enabled, so Vue receives a different hydration tree.
const isMounted = ref(false)
let hoverQuery: MediaQueryList | undefined

const loopProducts = computed(() => [...products, ...products])

const {
  viewport,
  track,
  paused,
  nudge,
  ensureVisible,
  handleTouchStart,
  handleTouchMove,
  handleTouchEnd,
} = useMarquee()

function syncHoverCapability(event?: MediaQueryListEvent) {
  canUseHover.value = event ? event.matches : Boolean(hoverQuery?.matches)
}

function handleCarouselFocusIn(event: FocusEvent) {
  paused.value = true

  const target = event.target
  if (!(target instanceof HTMLElement)) return

  const card = target.closest<HTMLElement>('.product-card')
  if (card && !card.hasAttribute('aria-hidden')) {
    ensureVisible(card)
  }
}

function handleCarouselFocusOut(event: FocusEvent) {
  const wrapper = event.currentTarget
  const nextTarget = event.relatedTarget

  if (wrapper instanceof HTMLElement && nextTarget instanceof Node && wrapper.contains(nextTarget)) {
    return
  }

  paused.value = false
}

onMounted(() => {
  isMounted.value = true
  hoverQuery = window.matchMedia('(hover: hover) and (pointer: fine)')
  syncHoverCapability()
  hoverQuery.addEventListener('change', syncHoverCapability)
})

onBeforeUnmount(() => {
  hoverQuery?.removeEventListener('change', syncHoverCapability)
})
</script>

<style scoped>
.product-carousel-wrapper {
  position: relative;
  width: 100%;
  --product-gap: 1.25rem;
}

.product-viewport {
  width: 100%;
  overflow: hidden;
  padding-block: 0.75rem;
  -webkit-mask-image: linear-gradient(to right, transparent, #000 4rem, #000 calc(100% - 4rem), transparent);
  mask-image: linear-gradient(to right, transparent, #000 4rem, #000 calc(100% - 4rem), transparent);
}

.product-track {
  display: flex;
  gap: var(--product-gap);
  width: max-content;
  will-change: transform;
}

.product-track :deep(.product-card) {
  flex: 0 0 auto;
  width: clamp(9.5rem, 45vw, 14rem);
}

@media (min-width: 640px) {
  .product-track :deep(.product-card) {
    width: clamp(15rem, 40vw, 18rem);
  }
}

@media (min-width: 1024px) {
  .product-track :deep(.product-card) {
    width: clamp(16rem, 25vw, 22rem);
  }
}

.product-nav {
  display: inline-flex;
  flex: 0 0 auto;
  height: 2.25rem;
  width: 2.25rem;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  border: 1px solid var(--color-line, rgba(0, 0, 0, 0.1));
  background: var(--color-surface, #fff);
  color: var(--color-ink, #111);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transform: translateY(-50%);
  transition: background-color 0.2s ease, color 0.2s ease, transform 0.2s ease;
}

.product-nav:hover {
  background: var(--color-brand-primary, #111);
  color: var(--color-surface, #fff);
  transform: translateY(-50%) scale(1.05);
}

.product-nav:focus-visible {
  outline: 2px solid var(--color-brand-accent, #0a7);
  outline-offset: 2px;
}

@media (min-width: 640px) {
  .product-nav {
    display: inline-flex;
    height: 2.75rem;
    width: 2.75rem;
  }
}
</style>
