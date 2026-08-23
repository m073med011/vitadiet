<template>
  <section class="relative w-full overflow-hidden bg-surface pt-5">
    <div class="lotus-backdrop" aria-hidden="true"></div>

    <div
      class="relative z-10 hidden w-full max-w-shell mx-auto h-[500px] pointer-events-none lg:block"
    >
      <div
        v-for="(img, index) in heroSection.images"
        :key="index"
        class="hero-gallery-item absolute pointer-events-auto"
        :class="img.class"
      >
        <div
          class="hero-gallery-card relative h-full w-full overflow-hidden rounded-card bg-surface-muted shadow-card ring-1 ring-line"
        >
          <span v-if="showHeroImageNumbers" class="hero-image-debug-number" aria-hidden="true">
            {{ index + 1 }}
          </span>

          <BaseImage
            :src="img.src"
            alt=""
            fill
            :loading="index === 0 ? 'eager' : 'lazy'"
            :fetchpriority="index === 0 ? 'high' : 'auto'"
            sizes="(min-width: 1024px) 14vw, 240px"
          />
        </div>
      </div>
    </div>

    <div
      class="hero-mobile-gallery-frame relative z-10 w-full overflow-hidden lg:hidden"
      aria-hidden="true"
      dir="ltr"
    >
      <div class="hero-mobile-marquee">
        <div
          v-for="(img, index) in mobileHeroLoopImages"
          :key="`mobile-hero-${index}`"
          class="hero-mobile-marquee-item"
        >
          <div class="hero-mobile-gallery-card">
            <span v-if="showHeroImageNumbers" class="hero-image-debug-number" aria-hidden="true">
              {{ index + 1 }}
            </span>

            <BaseImage
              :src="img.src"
              alt=""
              fill
              :loading="index === 0 ? 'eager' : 'lazy'"
              :fetchpriority="index === 0 ? 'high' : 'auto'"
              sizes="(max-width: 640px) 28vw, (max-width: 1023px) 18vw, 160px"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="relative z-20 px-page max-w-content mx-auto lg:-mt-section-lg">
      <div class="mx-auto max-w-[60rem] px-page py-gutter sm:px-card sm:py-card text-center">
        <span
          class="inline-flex items-center gap-control-y-sm py-control-y-sm px-icon-md rounded-pill bg-brand-primary-soft text-small font-semibold text-brand-primary mb-gutter border border-line"
        >
          <ShieldCheckIcon class="h-icon-sm w-icon-sm" aria-hidden="true" />
          {{ $t('homePage.hero.badge') }}
        </span>

        <h1
          class="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-normal text-ink mb-gutter leading-heading"
        >
          {{ $t('homePage.hero.heading') }}
        </h1>

        <p
          class="mt-gutter text-copy sm:text-copy-lg text-ink-soft max-w-copy mx-auto font-medium leading-copy"
        >
          {{ $t('homePage.hero.subheading') }}
        </p>

        <div
          class="mt-gutter grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-row items-stretch lg:items-center justify-center gap-page"
        >
          <BaseButton href="/vitadiet-catalog.pdf" download="كتالوج فيتادايت.pdf" variant="primary">
            {{ $t('homePage.hero.primary') }}
            <DownloadIcon class="h-icon-md w-icon-md" aria-hidden="true" />
          </BaseButton>
          <BaseButton :to="localePath('/products/')" variant="secondary">
            {{ $t('homePage.products.viewAll') }}
          </BaseButton>
        </div>

        <ul
          class="mt-gutter flex flex-wrap items-center justify-center gap-control-y-sm text-small text-ink-soft"
        >
          <li
            v-for="item in trustItems"
            :key="item.labelKey"
            class="inline-flex items-center gap-control-y-sm rounded-pill border border-line bg-surface-raised px-page py-control-y-sm font-semibold"
          >
            <component
              :is="item.icon"
              class="h-icon-sm w-icon-sm text-brand-primary"
              aria-hidden="true"
            />
            {{ $t(item.labelKey) }}
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import {
  ArrowRightIcon,
  DownloadIcon,
  FileCheckIcon,
  HandshakeIcon,
  ShieldCheckIcon,
} from 'lucide-vue-next'
import { heroSection } from '~/data/home'

const { sectionPath } = useSectionPath()
const localePath = useLocalePath()

const showHeroImageNumbers = import.meta.dev

const mobileHeroImages = computed(() =>
  heroSection.images
    .filter((_, index) => [0, 2, 5, 7].includes(index))
    .map((img) => ({ ...img, src: img.src.replace('sm_', 'xs_') })),
)
const mobileHeroLoopImages = computed(() => [...mobileHeroImages.value, ...mobileHeroImages.value])

const trustItems = [
  { labelKey: 'homePage.stats.b2bOnly', icon: HandshakeIcon },
  { labelKey: 'homePage.stats.scientificReview', icon: FileCheckIcon },
  { labelKey: 'homePage.stats.sfdaFocus', icon: ShieldCheckIcon },
]
</script>

<style scoped>
.lotus-backdrop {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.55;
  background:
    radial-gradient(
      circle at 50% 20%,
      color-mix(in oklab, var(--color-brand-accent) 10%, transparent) 0 12rem,
      transparent 24rem
    ),
    linear-gradient(
      90deg,
      color-mix(in oklab, var(--color-brand-primary) 8%, transparent) 1px,
      transparent 1px
    ),
    linear-gradient(
      180deg,
      color-mix(in oklab, var(--color-brand-primary) 7%, transparent) 1px,
      transparent 1px
    );
  background-size:
    auto,
    9rem 9rem,
    9rem 9rem;
}

.hero-panel {
  backdrop-filter: blur(14px);
}

.hero-gallery-item:hover {
  z-index: 20;
}

.hero-mobile-gallery-frame {
  min-height: clamp(8rem, 32vw, 11.25rem);
  padding-block: 1rem 1.125rem;
}

.hero-mobile-gallery-frame::before,
.hero-mobile-gallery-frame::after {
  position: absolute;
  top: 0;
  bottom: 0;
  z-index: 2;
  width: 3rem;
  pointer-events: none;
  content: '';
}

.hero-mobile-gallery-frame::before {
  left: 0;
  background: linear-gradient(90deg, var(--color-surface) 2%, transparent);
}

.hero-mobile-gallery-frame::after {
  right: 0;
  background: linear-gradient(270deg, var(--color-surface) 2%, transparent);
}

.hero-mobile-marquee {
  display: flex;
  width: max-content;
  gap: 0.5rem;
  padding-inline: 0.5rem;
  will-change: transform;
  animation: hero-mobile-marquee 26s linear infinite;
}

.hero-mobile-marquee-item {
  flex: 0 0 clamp(5.5rem, 24vw, 8rem);
  aspect-ratio: 4 / 5;
}

.hero-mobile-gallery-card {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: var(--color-surface-muted);
  border: 1px solid color-mix(in oklab, var(--color-surface) 82%, var(--color-brand-dark));
  border-radius: var(--radius-card);
}

.hero-mobile-gallery-card::after {
  position: absolute;
  inset: 0;
  pointer-events: none;
  content: '';
  background:
    linear-gradient(
      135deg,
      color-mix(in oklab, var(--color-surface) 26%, transparent),
      transparent 36%
    ),
    linear-gradient(
      180deg,
      transparent 62%,
      color-mix(in oklab, var(--color-brand-dark) 16%, transparent)
    );
}

.hero-mobile-gallery-card :deep(img) {
  transform: translate3d(0, 0, 0) scale(1.02);
  filter: saturate(1.04) contrast(1.03);
}

.hero-image-debug-number {
  position: absolute;
  top: 0.375rem;
  left: 0.375rem;
  z-index: 3;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.75rem;
  height: 1.75rem;
  padding-inline: 0.375rem;
  border: 1px solid color-mix(in oklab, var(--color-surface) 72%, var(--color-brand-primary));
  border-radius: 999px;
  background: color-mix(in oklab, var(--color-surface) 86%, var(--color-brand-primary));
  box-shadow: var(--shadow-card);
  color: var(--color-ink);
  font-size: 0.75rem;
  font-weight: 800;
  line-height: 1;
}

@media (min-width: 640px) and (max-width: 1023px) {
  .hero-mobile-gallery-frame {
    min-height: clamp(10.75rem, 22vw, 14rem);
    padding-block: 1.25rem 1.5rem;
  }

  .hero-mobile-gallery-frame::before,
  .hero-mobile-gallery-frame::after {
    width: 5rem;
  }

  .hero-mobile-marquee {
    gap: 0.75rem;
    padding-inline: 0.75rem;
    animation-duration: 32s;
  }

  .hero-mobile-marquee-item {
    flex-basis: clamp(7.5rem, 17vw, 10rem);
  }
}

@keyframes hero-mobile-marquee {
  from {
    transform: translate3d(0, 0, 0);
  }

  to {
    transform: translate3d(-50%, 0, 0);
  }
}

.hero-gallery-card {
  transform: translate3d(0, 0, 0) scale(1);
  transform-origin: center;
  backface-visibility: hidden;
  will-change: transform;
  transition:
    transform 900ms cubic-bezier(0.16, 1, 0.3, 1),
    box-shadow 900ms cubic-bezier(0.16, 1, 0.3, 1),
    filter 900ms cubic-bezier(0.16, 1, 0.3, 1);
}

.hero-gallery-item:hover .hero-gallery-card {
  transform: translate3d(0, -0.4rem, 0) scale(1.045);
  box-shadow: var(--shadow-card-hover);
  filter: saturate(1.03) contrast(1.02);
}

.hero-gallery-card :deep(img) {
  transform: translate3d(0, 0, 0) scale(1.01);
  backface-visibility: hidden;
  will-change: transform;
  transition: transform 1100ms cubic-bezier(0.16, 1, 0.3, 1);
}

.hero-gallery-item:hover .hero-gallery-card :deep(img) {
  transform: translate3d(0, 0, 0) scale(1.055);
}

@media (prefers-reduced-motion: reduce) {
  .hero-mobile-marquee {
    animation: none;
  }

  .hero-gallery-card,
  .hero-gallery-card :deep(img) {
    transition-duration: 1ms;
  }
}
</style>
