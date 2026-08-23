<template>
  <div
    class="relative z-10 hidden w-full max-w-shell mx-auto h-[500px] pointer-events-none lg:block"
  >
    <div
      v-for="(img, index) in heroBanners"
      :key="index"
      class="hero-gallery-item absolute pointer-events-auto"
      :class="img.class"
    >
      <div
        class="hero-gallery-card relative h-full w-full overflow-hidden rounded-card bg-surface-muted shadow-card ring-1 ring-line"
      >
        <HomeHeroImageNumber :index="index" />

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
</template>

<script setup lang="ts">
import { heroBanners } from './hero-banners'
</script>

<style scoped>
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
