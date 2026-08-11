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
    </div>

    <!-- Carousel with max-width to align with the section content -->
    <div class="product-carousel-wrapper max-w-content mx-auto px-page sm:px-gutter md:px-page-lg" data-aos="fade-up">
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
        @mouseenter="paused = true"
        @mouseleave="paused = false"
        @focusin="paused = true"
        @focusout="paused = false"
        @touchstart.passive="handleTouchStart"
        @touchmove.passive="handleTouchMove"
        @touchend.passive="handleTouchEnd"
      >
        <div ref="track" class="product-track" aria-label="Vitadiet products">
          <NuxtLink
            v-for="(product, index) in loopProducts"
            :key="`${product.slug}-${index}`"
            :to="productPath(product.slug)"
            :aria-hidden="index >= products.length ? 'true' : undefined"
            :tabindex="index >= products.length ? -1 : undefined"
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

            <div class="flex flex-1 flex-col gap-3 sm:gap-page p-3 sm:p-page">
              <div class="flex flex-col sm:flex-row items-start sm:items-start sm:justify-between gap-2 sm:gap-page">
                <h3 class="product-title text-copy font-bold leading-tight sm:leading-heading text-ink">{{ $t(product.titleKey) }}</h3>
                <span class="shrink-0 rounded-pill bg-brand-primary-soft px-2 sm:px-page py-1 sm:py-control-y-sm text-caption sm:text-small font-bold text-brand-primary flex items-center justify-center gap-1">
                  <span>{{ $t(product.priceKey) }}</span>
                  <SaudiRiyalIcon v-if="isNumericPrice(product.priceKey)" class="h-3 w-3 sm:h-4 sm:w-4 shrink-0" aria-hidden="true" />
                </span>
              </div>

              <div class="mt-auto flex items-center justify-between gap-2 sm:gap-page border-t border-line pt-3 sm:pt-page">
                <span class="text-caption sm:text-small font-bold tracking-label uppercase text-ink-subtle leading-tight">
                  {{ $t('homePage.stats.b2bOnly') }}
                </span>
                <span class="product-arrow shrink-0 inline-flex h-8 w-8 sm:h-icon-2xl sm:w-icon-2xl items-center justify-center rounded-pill bg-brand-primary text-surface transition-transform duration-300">
                  <ArrowUpRightIcon class="h-4 w-4 sm:h-icon-sm sm:w-icon-sm rtl:-rotate-90" aria-hidden="true" />
                </span>
              </div>
            </div>
          </NuxtLink>
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

    <div class="max-w-content mx-auto px-page sm:px-gutter md:px-page-lg">
      <div class="mt-gutter-lg flex justify-center" data-aos="fade-up">
        <BaseButton :to="localePath('/products/')" variant="secondary">
          {{ $t('homePage.products.viewAll') }}
        </BaseButton>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { products } from '~/data/home'
import { ArrowUpRightIcon, ChevronLeftIcon, ChevronRightIcon, SaudiRiyalIcon } from 'lucide-vue-next'

const { productPath } = useProductPath()
const localePath = useLocalePath()
const { t } = useI18n()
const canUseHover = ref(false)
let hoverQuery: MediaQueryList | undefined

// Render the list twice so the marquee can loop seamlessly.
const loopProducts = computed(() => [...products, ...products])

const viewport = ref<HTMLElement | null>(null)
const track = ref<HTMLElement | null>(null)
const paused = ref(false)

let lastTouchX = 0
let isDragging = false
let touchStartY = 0

const AUTO_SPEED = 0.5 // pixels per frame for the ambient auto-scroll
let offset = 0 // current translation in pixels (always >= 0)
let manualTarget = 0 // extra distance queued by the arrow buttons
let rafId = 0
let isRtl = false
let prefersReducedMotion = false

function loopWidth(): number {
  // Half of the track = one full copy of the product list.
  return track.value ? track.value.scrollWidth / 2 : 0
}

function applyTransform() {
  if (!track.value) return
  const half = loopWidth()
  if (half > 0) {
    offset = ((offset % half) + half) % half
  }
  const sign = isRtl ? 1 : -1
  track.value.style.transform = `translate3d(${sign * offset}px, 0, 0)`
}

function tick() {
  // Ease through any queued arrow movement, then apply ambient drift.
  if (manualTarget !== 0) {
    const step = manualTarget * 0.12
    offset += step
    manualTarget -= step
    if (Math.abs(manualTarget) < 0.5) {
      offset += manualTarget
      manualTarget = 0
    }
  } else if (!paused.value && !prefersReducedMotion) {
    offset += AUTO_SPEED
  }
  applyTransform()
  rafId = requestAnimationFrame(tick)
}

/** Advance one card width in the given direction (1 = next, -1 = prev). */
function nudge(direction: number) {
  const card = track.value?.querySelector<HTMLElement>('.product-card')
  const gap = 20 // matches the track gap
  const cardWidth = card ? card.offsetWidth + gap : 300
  manualTarget += direction * cardWidth
}

function handleTouchStart(e: TouchEvent) {
  paused.value = true
  const touch = e.changedTouches[0]
  if (!touch) return
  lastTouchX = touch.screenX
  touchStartY = touch.screenY
  isDragging = false
}

function handleTouchMove(e: TouchEvent) {
  if (!paused.value) return
  const touch = e.changedTouches[0]
  if (!touch) return
  const currentX = touch.screenX
  const currentY = touch.screenY
  const diffX = lastTouchX - currentX
  const diffY = Math.abs(touchStartY - currentY)

  if (!isDragging) {
    if (diffY > Math.abs(diffX)) return // User is scrolling vertically
    if (Math.abs(diffX) > 5) isDragging = true
  }

  if (isDragging) {
    lastTouchX = currentX
    const move = isRtl ? -diffX : diffX
    offset += move
    manualTarget = 0
  }
}

function handleTouchEnd(e: TouchEvent) {
  paused.value = false
}

function syncHoverCapability(event?: MediaQueryListEvent) {
  canUseHover.value = event ? event.matches : Boolean(hoverQuery?.matches)
}

onMounted(() => {
  hoverQuery = window.matchMedia('(hover: hover) and (pointer: fine)')
  syncHoverCapability()
  hoverQuery.addEventListener('change', syncHoverCapability)

  isRtl = getComputedStyle(document.documentElement).direction === 'rtl'
  prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  rafId = requestAnimationFrame(tick)
})

onBeforeUnmount(() => {
  hoverQuery?.removeEventListener('change', syncHoverCapability)
  cancelAnimationFrame(rafId)
})

/** Returns true when the translated price string contains at least one digit */
function isNumericPrice(priceKey: string): boolean {
  return /\d/.test(t(priceKey))
}
</script>

<style scoped>
.product-carousel-wrapper {
  /* Full-bleed rail. The arrows are absolutely positioned over the track, so they
     take no layout width and the viewport always spans the entire section. */
  position: relative;
  width: 100%;
  /* Shared by the CSS gap below and read back in JS for the arrow step, so the two
     can never drift apart. */
  --product-gap: 1.25rem;
}

.product-viewport {
  width: 100%;
  overflow: hidden;
  /* Room for the card's hover lift (-translate-y-1) and shadow so neither is clipped. */
  padding-block: 0.75rem;
  /* Soften both edges so cards fade out instead of being cut off mid-card. The
     fade is inset-relative, so it flips automatically for RTL. */
  -webkit-mask-image: linear-gradient(to right, transparent, #000 4rem, #000 calc(100% - 4rem), transparent);
  mask-image: linear-gradient(to right, transparent, #000 4rem, #000 calc(100% - 4rem), transparent);
}

.product-track {
  display: flex;
  gap: var(--product-gap);
  width: max-content;
  will-change: transform;
}

.product-card {
  flex: 0 0 auto;
  /* Fluid across every viewport rather than snapping at breakpoints: the clamp
     keeps cards readable on small phones and from getting oversized on desktop. */
  width: clamp(9.5rem, 45vw, 14rem);
}

@media (min-width: 640px) {
  .product-card {
    width: clamp(15rem, 40vw, 18rem);
  }
}

@media (min-width: 1024px) {
  .product-card {
    width: clamp(16rem, 25vw, 22rem);
  }
}

.product-title {
  display: -webkit-box;
  min-height: 2.75rem;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

@media (min-width: 640px) {
  .product-title {
    min-height: 3.5rem;
    -webkit-line-clamp: 3;
  }
}

.product-card:hover .product-arrow {
  transform: translateX(0.25rem);
}

html[dir="rtl"] .product-card:hover .product-arrow {
  transform: translateX(-0.25rem);
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
