<template>
  <section class="relative w-full overflow-hidden bg-surface pt-5 ">
    <!-- Lotus grid backdrop -->
    <div class="lotus-backdrop" aria-hidden="true"></div>

    <!-- Hero image gallery -->
    <div class="relative z-10 w-full max-w-shell mx-auto h-[360px] sm:h-[420px] md:h-[500px] pointer-events-none">
      <div
        v-for="(img, index) in heroImages"
        :key="index"
        class="hero-gallery-item absolute pointer-events-auto"
        :class="img.class"
        data-aos="zoom-in"
        data-aos-duration="700"
        :data-aos-delay="index * 100"
      >
        <div class="hero-gallery-card h-full w-full overflow-hidden rounded-card bg-surface-muted shadow-card ring-1 ring-line">
          <BaseImage
            :src="img.src"
            alt="Certified supplement portfolio for B2B distribution"
            fill
          />
        </div>
      </div>
    </div>

    <!-- Hero copy block -->
    <div class="relative z-20 px-page max-w-content mx-auto -mt-rule-sm sm:-mt-section-lg ">
      <div class=" mx-auto max-w-[60rem] px-page py-gutter sm:px-card sm:py-card text-center ">
        <span
          class="inline-flex items-center gap-control-y-sm py-control-y-sm px-icon-md rounded-pill bg-brand-primary-soft text-small font-semibold text-brand-primary mb-gutter border border-line"
          data-aos="fade-up"
          data-aos-delay="150"
        >
          <ShieldCheckIcon class="h-icon-sm w-icon-sm" aria-hidden="true" />
          {{ $t('homePage.hero.badge') }}
        </span>

        <h1
          class="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-normal text-ink mb-gutter leading-heading"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          {{ $t('homePage.hero.heading') }}
        </h1>

        <p
          class="mt-gutter text-copy sm:text-copy-lg text-ink-soft max-w-copy mx-auto font-medium leading-copy"
          data-aos="fade-up"
          data-aos-delay="300"
        >
          {{ $t('homePage.hero.subheading') }}
        </p>

        <div
          class="mt-gutter flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-page"
          data-aos="fade-up"
          data-aos-delay="400"
        >
          <BaseButton :to="sectionPath('#footer')" variant="primary">
            {{ $t('homePage.hero.primary') }}
            <ArrowRightIcon class="h-icon-md w-icon-md rtl:rotate-180" aria-hidden="true" />
          </BaseButton>
          <BaseButton :to="sectionPath('#products')" variant="secondary">
            {{ $t('homePage.hero.secondary') }}
          </BaseButton>
        </div>

        <ul
          class="mt-gutter flex flex-wrap items-center justify-center gap-control-y-sm text-small text-ink-soft"
          data-aos="fade-up"
          data-aos-delay="500"
        >
          <li
            v-for="item in trustItems"
            :key="item.labelKey"
            class="inline-flex items-center gap-control-y-sm rounded-pill border border-line bg-surface-raised px-page py-control-y-sm font-semibold"
          >
            <component :is="item.icon" class="h-icon-sm w-icon-sm text-brand-primary" aria-hidden="true" />
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
  FileCheckIcon,
  HandshakeIcon,
  ShieldCheckIcon,
} from 'lucide-vue-next'
import { heroImages } from '~/data/home'

const { sectionPath } = useSectionPath()

const trustItems = [
  { labelKey: 'homePage.stats.b2bOnly', icon: HandshakeIcon },
  { labelKey: 'homePage.stats.scientificReview', icon: FileCheckIcon },
  { labelKey: 'homePage.stats.sfdaFocus', icon: ShieldCheckIcon },
]
</script>

<style scoped>
/* Complex multi-layer radial + grid background — cannot be expressed in Tailwind utilities */
.lotus-backdrop {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.55;
  background:
    radial-gradient(circle at 50% 20%, color-mix(in oklab, var(--color-brand-accent) 10%, transparent) 0 12rem, transparent 24rem),
    linear-gradient(90deg, color-mix(in oklab, var(--color-brand-primary) 8%, transparent) 1px, transparent 1px),
    linear-gradient(180deg, color-mix(in oklab, var(--color-brand-primary) 7%, transparent) 1px, transparent 1px);
  background-size: auto, 9rem 9rem, 9rem 9rem;
}

.hero-panel {
  backdrop-filter: blur(14px);
}

.hero-gallery-item:hover {
  z-index: 20;
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
  .hero-gallery-card,
  .hero-gallery-card :deep(img) {
    transition-duration: 1ms;
  }
}
</style>
