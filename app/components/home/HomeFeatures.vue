<template>
  <section id="why" class="w-full py-section bg-surface-raised/50 dark:bg-dark-surface transition-colors section-flower">
    <div class="max-w-content mx-auto px-page sm:px-gutter md:px-page-lg">

      <div class="text-center max-w-copy mx-auto mb-rule-sm" data-aos="fade-up">
        <h2 class="text-heading md:text-heading-lg leading-heading font-bold text-ink dark:text-dark-ink uppercase tracking-label mb-gutter">
          {{ $t('homePage.why.heading') }}
        </h2>
        <p class="text-copy-lg leading-copy text-ink-soft dark:text-dark-ink-soft">
          {{ $t('homePage.why.description') }}
        </p>
      </div>

      <!-- Petal cards grid -->
      <div class="petal-grid">
        <article
          v-for="(petal, index) in whyPetals"
          :key="petal.titleKey"
          class="feature-card relative min-h-[18rem] overflow-hidden rounded-card bg-surface dark:bg-dark-surface-raised border border-line/80 dark:border-dark-line p-card shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
          data-aos="fade-up"
          :data-aos-delay="index * 100"
        >
          <div class="relative z-10 flex items-start justify-between gap-page mb-gutter">
            <span class="rounded-pill bg-brand-primary-soft dark:bg-dark-surface-glow px-page py-control-y-sm text-caption font-bold tracking-label text-brand-primary dark:text-brand-accent">
              {{ String(index + 1).padStart(2, '0') }}
            </span>
            <span class="feature-icon inline-flex h-feature-icon w-feature-icon items-center justify-center rounded-card border border-line dark:border-dark-line bg-surface-raised dark:bg-dark-surface-muted">
              <component :is="iconMap[petal.icon]" class="w-icon-xl h-icon-xl text-brand-primary dark:text-brand-accent" />
            </span>
          </div>
          <h3 class="relative z-10 text-title font-bold text-ink dark:text-dark-ink mb-page leading-heading">{{ $t(petal.titleKey) }}</h3>
          <p class="relative z-10 text-ink-soft dark:text-dark-ink-soft leading-copy">{{ $t(petal.descriptionKey) }}</p>
        </article>
      </div>

      <!-- Silent lab panel -->
      <article
        class="quality-panel relative mt-gutter min-h-[22rem] rounded-card overflow-hidden border border-line dark:border-dark-line bg-brand-dark text-on-primary p-card flex items-end shadow-float"
        data-aos="fade-up"
      >
        <div class="relative z-10 max-w-copy">
          <p class="text-caption font-bold tracking-label uppercase text-brand-accent mb-page">
            {{ $t('blog') }}
          </p>
          <h3 class="text-heading md:text-display leading-heading font-bold mb-page" style="color: var(--color-on-primary);">
            {{ $t('homePage.lab.heading') }}
          </h3>
          <p class="text-copy-lg leading-copy" style="color: var(--color-on-primary);">
            {{ $t('homePage.lab.description') }}
          </p>
        </div>
        <BaseImage
          src="~/assets/images/medcal_factory.jpg"
          alt="Laboratory review for supplement quality"
          fill
          class="absolute inset-0 opacity-25"
        />
      </article>

    </div>
  </section>
</template>

<script setup lang="ts">
import {
  FileCheckIcon,
  HeartPulseIcon,
  MicroscopeIcon,
  ShieldCheckIcon,
  SparklesIcon,
  TruckIcon,
} from 'lucide-vue-next'
import { whyPetals } from '~/data/home'

const iconMap: Record<string, object> = {
  FileCheckIcon,
  HeartPulseIcon,
  MicroscopeIcon,
  ShieldCheckIcon,
  SparklesIcon,
  TruckIcon,
}
</script>

<style scoped>
/* CSS grid repeat(auto-fit) — cannot be expressed in Tailwind utilities */
.petal-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
  gap: 1rem;
}

.feature-card::after {
  content: "";
  position: absolute;
  inset: auto -3rem -4rem auto;
  width: 10rem;
  height: 10rem;
  border-radius: 9999px;
  background: color-mix(in oklab, var(--color-brand-primary) 9%, transparent);
  transition:
    transform var(--motion-standard) var(--motion-ease-out),
    opacity var(--motion-standard) var(--motion-ease-out);
}

.feature-card:hover::after {
  opacity: 0.9;
  transform: scale(1.12);
}

.feature-icon {
  box-shadow: inset 0 1px 0 color-mix(in oklab, var(--color-surface) 70%, transparent);
}

.quality-panel::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 1;
  background:
    linear-gradient(90deg, color-mix(in oklab, var(--color-brand-dark) 94%, transparent) 0%, color-mix(in oklab, var(--color-brand-dark) 72%, transparent) 44%, transparent 100%),
    radial-gradient(circle at 16% 20%, color-mix(in oklab, var(--color-brand-accent) 24%, transparent), transparent 18rem);
}

/* Section flower decorative circle pseudo-element */
.section-flower {
  position: relative;
}

.section-flower::before {
  content: "";
  position: absolute;
  inset: 2rem auto auto 2rem;
  width: 14rem;
  height: 14rem;
  border: 1px solid color-mix(in oklab, var(--color-brand-accent) 20%, transparent);
  border-radius: 50%;
  opacity: 0.35;
  pointer-events: none;
}

html[dir="rtl"] .section-flower::before {
  inset-inline-start: auto;
  inset-inline-end: 2rem;
}
</style>
