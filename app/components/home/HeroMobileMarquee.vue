<template>
  <div
    class="hero-mobile-gallery-frame relative z-10 w-full overflow-hidden lg:hidden"
    aria-hidden="true"
    dir="ltr"
  >
    <div class="hero-mobile-marquee">
      <div
        v-for="(img, index) in loopImages"
        :key="`mobile-hero-${index}`"
        class="hero-mobile-marquee-item"
      >
        <div class="hero-mobile-gallery-card">
          <HomeHeroImageNumber :index="index" />

          <BaseImage
            :src="img.srcMobile"
            alt=""
            :width="200"
            :height="268"
            fill
            :loading="index === 0 ? 'eager' : 'lazy'"
            :fetchpriority="index === 0 ? 'high' : 'auto'"
            sizes="(max-width: 640px) 28vw, (max-width: 1023px) 18vw, 160px"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { heroBanners } from './hero-banners'

const mobileImages = heroBanners.filter((img) => img.showOnMobile)

/** Duplicated so the CSS marquee can translate -50% and loop seamlessly. */
const loopImages = [...mobileImages, ...mobileImages]
</script>

<style scoped>
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

@media (prefers-reduced-motion: reduce) {
  .hero-mobile-marquee {
    animation: none;
  }
}
</style>
