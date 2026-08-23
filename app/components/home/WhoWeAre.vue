<template>
  <section id="who-we-are" class="py-section md:py-section-lg bg-surface overflow-hidden">
    <div class="content-container">
      <div class="flex flex-col lg:flex-row items-center justify-between gap-gutter-lg">
        <div class="w-full lg:w-5/12 space-y-gutter" data-aos="fade-right">
          <h2 class="text-heading-lg lg:text-display font-medium text-brand-accent">
            {{ $t('appName') }}
          </h2>
          <p
            class="text-ink-soft text-base md:text-lg lg:text-xl leading-relaxed whitespace-pre-line"
          >
            {{ $t('homePage.whoWeAre.description') }}
          </p>
        </div>

        <div
          class="w-full lg:w-6/12 relative flex justify-center items-center py-12 lg:py-0"
          data-aos="fade-left"
          data-aos-delay="200"
        >
          <div class="relative w-[85%] sm:w-[75%] lg:w-[70%] max-w-[480px] aspect-square mx-auto">
            <div class="absolute inset-0" data-aos="draw-line">
              <svg
                class="w-full h-full -rotate-90 pointer-events-none"
                viewBox="0 0 100 100"
                overflow="visible"
                :style="{ '--circle-circumference': CIRCLE_CIRCUMFERENCE }"
              >
                <defs>
                  <mask id="circle-mask">
                    <circle
                      cx="50"
                      cy="50"
                      r="49.5"
                      fill="none"
                      stroke="white"
                      stroke-width="2"
                      :stroke-dasharray="CIRCLE_CIRCUMFERENCE"
                      class="progress-circle"
                    />
                  </mask>
                </defs>
                <circle
                  cx="50"
                  cy="50"
                  r="49.5"
                  fill="none"
                  class="stroke-line"
                  stroke-width="0.3"
                  stroke-dasharray="1 1.5"
                  mask="url(#circle-mask)"
                />
              </svg>
            </div>

            <div
              class="absolute inset-0 m-auto w-[52%] h-[52%] rounded-full bg-brand-accent flex flex-col items-center justify-center text-surface shadow-shell z-30 p-4 lg:p-6 text-center transition-transform hover:scale-105 duration-500"
            >
              <span class="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-wide mb-2 sm:mb-3">{{
                $t('appName')
              }}</span>
              <span
                class="text-[9px] sm:text-[10px] lg:text-xs opacity-90 uppercase tracking-widest font-semibold px-2 leading-relaxed"
              >
                {{ $t('homePage.whoWeAre.heading') }}
              </span>
            </div>

            <div
              v-for="(feature, index) in featuresData"
              :key="feature.key"
              class="absolute top-1/2 left-1/2 w-full h-0 pointer-events-none orbit-container"
              :style="{ '--angle': `${feature.angle}deg` }"
            >
              <div
                class="absolute top-1/2 orbit-positioner w-[36%] sm:w-[32%] lg:w-[30%] aspect-square z-20"
                data-aos="orbit-pop"
                :data-aos-delay="ORBIT_AOS_BASE_DELAY_MS + index * ORBIT_AOS_STAGGER_MS"
                data-aos-duration="700"
                :style="{ '--reverse-angle': `${-feature.angle}deg` }"
              >
                <div
                  class="w-full h-full rounded-full bg-surface-raised border border-brand-accent shadow-float flex flex-col items-center justify-center p-2 sm:p-3 lg:p-4 transition-all duration-500 hover:scale-110 hover:border-brand-primary pointer-events-auto group"
                >
                  <span
                    class="text-center text-[10px] sm:text-[11px] lg:text-sm font-semibold text-brand-accent leading-tight group-hover:text-brand-primary transition-colors w-full break-words"
                  >
                    {{ $t(`homePage.whoWeAre.petals.${feature.key}`) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-26 text-center max-w-4xl mx-auto" data-aos="fade-up" data-aos-delay="400">
        <p
          class="text-ink-subtle text-sm md:text-base font-medium leading-relaxed whitespace-pre-line"
        >
          {{ $t('homePage.whoWeAre.footerText') }}
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const ORBIT_AOS_BASE_DELAY_MS = 400
const ORBIT_AOS_STAGGER_MS = 100
const CIRCLE_CIRCUMFERENCE = 312

const featuresData = [
  { key: 'science', angle: -90 },
  { key: 'sfda', angle: -30 },
  { key: 'distribution', angle: 30 },
  { key: 'quality', angle: 90 },
  { key: 'safety', angle: 150 },
  { key: 'transparency', angle: -150 },
]
</script>

<style scoped>
html.aos-ready [data-aos='draw-line'] .progress-circle {
  stroke-dashoffset: var(--circle-circumference);
  transition: stroke-dashoffset 4.5s cubic-bezier(0.4, 0, 0.2, 1);
  transition-delay: 200ms;
}

html.aos-ready [data-aos='draw-line'][data-aos-animate] .progress-circle {
  stroke-dashoffset: 0;
}

.orbit-container {
  transform: translate(-50%, -50%) rotate(var(--angle));
}

[data-aos='orbit-pop'] {
  right: 0;
  transform: translate(50%, -50%) rotate(var(--reverse-angle)) scale(1);
}

html.aos-ready [data-aos='orbit-pop'] {
  right: 50%;
  opacity: 0;
  transform: translate(50%, -50%) rotate(var(--reverse-angle)) scale(0.2);
  transition-property: right, opacity, transform !important;
  transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1) !important;
}

html.aos-ready [data-aos='orbit-pop'][data-aos-animate] {
  right: 0;
  opacity: 1;
  transform: translate(50%, -50%) rotate(var(--reverse-angle)) scale(1);
}

@media (prefers-reduced-motion: reduce) {
  html.aos-ready [data-aos='draw-line'] .progress-circle {
    stroke-dashoffset: 0;
    transition: none;
  }

  html.aos-ready [data-aos='orbit-pop'],
  html.aos-ready [data-aos='orbit-pop'][data-aos-animate] {
    right: 0;
    opacity: 1;
    transform: translate(50%, -50%) rotate(var(--reverse-angle)) scale(1);
    transition: none !important;
  }
}
</style>
