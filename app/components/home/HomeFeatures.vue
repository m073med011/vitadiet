<template>
  <section id="why" class="w-full py-section bg-surface-raised/50 section-decor overflow-hidden">
    <div class="max-w-content mx-auto px-page sm:px-gutter md:px-page-lg">

      <!-- Section header -->
      <div class="text-center max-w-copy mx-auto mb-rule-sm" data-aos="fade-up">
        <p class="mb-page text-caption font-bold tracking-label uppercase text-brand-primary">
          {{ $t('homePage.why.heading') }}
        </p>
        <p class="text-copy-lg leading-copy text-ink-soft">
          {{ $t('homePage.why.description') }}
        </p>
      </div>

      <!-- ── Petal cards grid ─────────────────────────────────── -->
      <div class="petal-grid">
        <article
          v-for="(petal, index) in whyPetals"
          :key="petal.titleKey"
          class="petal-card"
          data-aos="fade-up"
          :data-aos-delay="index * 80"
        >
          <!-- Top row: number badge + icon -->
          <div class="flex items-start justify-between gap-page mb-gutter">
            <span class="petal-badge">
              {{ String(index + 1).padStart(2, '0') }}
            </span>
            <span class="petal-icon-wrap">
              <component :is="iconMap[petal.icon]" class="w-icon-xl h-icon-xl text-brand-primary" />
            </span>
          </div>

          <h3 class="text-title font-bold text-ink mb-page leading-heading">
            {{ $t(petal.titleKey) }}
          </h3>
          <p class="text-copy leading-copy text-ink-soft">
            {{ $t(petal.descriptionKey) }}
          </p>

          <!-- Decorative glow blob -->
          <span class="petal-glow" aria-hidden="true" />
        </article>
      </div>

      <!-- ── Quality panel ────────────────────────────────────── -->
      <article class="quality-panel" data-aos="fade-up" data-aos-delay="100">
        <div class="quality-image-shell">
          <BaseImage
            src="~/assets/images/medcal_factory.jpg"
            :alt="$t('homePage.quality.imageAlt')"
            fill
            class="absolute inset-0 object-cover"
          />
          <div class="quality-image-content">
            <h3 class="panel-heading">{{ $t('homePage.quality.heading') }}</h3>
          </div>
        </div>

        <div class="panel-body">
          <div class="panel-steps">
            <div
              v-for="(step, i) in qualitySteps"
              :key="step.titleKey"
              class="panel-step"
            >
              <span class="step-num">{{ String(i + 1).padStart(2, '0') }}</span>
              <component :is="step.icon" class="step-icon" aria-hidden="true" />
              <h4 class="step-title">{{ $t(step.titleKey) }}</h4>
              <p class="step-desc">{{ $t(step.descriptionKey) }}</p>
            </div>
          </div>
        </div>
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

const qualitySteps = [
  {
    titleKey: 'homePage.quality.items.safety.title',
    descriptionKey: 'homePage.quality.items.safety.description',
    icon: ShieldCheckIcon,
  },
  {
    titleKey: 'homePage.quality.items.purity.title',
    descriptionKey: 'homePage.quality.items.purity.description',
    icon: SparklesIcon,
  },
  {
    titleKey: 'homePage.quality.items.microscopic.title',
    descriptionKey: 'homePage.quality.items.microscopic.description',
    icon: MicroscopeIcon,
  },
]
</script>

<style scoped>
/* ── Section decorative element ─────────────────────────── */
.section-decor {
  position: relative;
}
.section-decor::before {
  content: "";
  position: absolute;
  inset-block-start: 3rem;
  inset-inline-end: 3rem;
  width: 18rem;
  height: 18rem;
  border-radius: 50%;
  border: 1px solid color-mix(in oklab, var(--color-brand-primary) 14%, transparent);
  opacity: 0.3;
  pointer-events: none;
}

/* ── Petal grid ─────────────────────────────────────────── */
.petal-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}

/* ── Petal card ─────────────────────────────────────────── */
.petal-card {
  position: relative;
  overflow: hidden;
  min-height: 17rem;
  border-radius: var(--radius-card);
  border: 1px solid color-mix(in oklab, var(--color-line) 80%, transparent);
  background: var(--color-surface);
  padding: var(--spacing-card);
  box-shadow: var(--shadow-card);
  transition:
    transform var(--motion-standard) var(--motion-ease-out),
    box-shadow var(--motion-standard) var(--motion-ease-out),
    border-color var(--motion-standard) var(--motion-ease-out);
}

.petal-card:hover {
  transform: translateY(-0.3rem);
  box-shadow: var(--shadow-card-hover);
  border-color: color-mix(in oklab, var(--color-brand-primary) 22%, var(--color-line));
}



/* Number badge */
.petal-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 1.75rem;
  padding: 0 0.75rem;
  border-radius: var(--radius-pill);
  background: color-mix(in oklab, var(--color-brand-primary) 10%, var(--color-surface-raised));
  border: 1px solid color-mix(in oklab, var(--color-brand-primary) 16%, var(--color-line));
  color: var(--color-brand-primary);
  font-size: var(--text-caption);
  font-weight: 700;
  letter-spacing: var(--tracking-label);
}



/* Icon wrapper */
.petal-icon-wrap {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--spacing-feature-icon);
  height: var(--spacing-feature-icon);
  border-radius: var(--radius-card);
  border: 1px solid color-mix(in oklab, var(--color-line) 88%, transparent);
  background: var(--color-surface-raised);
  box-shadow: inset 0 1px 0 color-mix(in oklab, var(--color-surface) 80%, transparent);
}



/* Decorative glow blob on hover */
.petal-glow {
  position: absolute;
  inset: auto -3rem -4rem auto;
  width: 10rem;
  height: 10rem;
  border-radius: 50%;
  background: color-mix(in oklab, var(--color-brand-primary) 7%, transparent);
  opacity: 0;
  transform: scale(0.8);
  pointer-events: none;
  transition:
    opacity var(--motion-standard) var(--motion-ease-out),
    transform var(--motion-standard) var(--motion-ease-out);
}

.petal-card:hover .petal-glow {
  opacity: 1;
  transform: scale(1.1);
}



/* ── Quality panel ──────────────────────────────────────── */
.quality-panel {
  position: relative;
  border-radius: var(--radius-panel);
  overflow: hidden;
  border: 1px solid color-mix(in oklab, var(--color-line) 70%, transparent);
  background: var(--color-surface);
  box-shadow: var(--shadow-float);
  isolation: isolate;
}

.quality-image-shell {
  position: relative;
  min-height: clamp(18rem, 38vw, 28rem);
  overflow: hidden;
}

.quality-image-content {
  position: absolute;
  inset: 0;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(2rem, 6vw, 5rem);
  text-align: center;
}

/* Panel body */
.panel-body {
  position: relative;
  z-index: 2;
  width: 100%;
  padding: clamp(1rem, 3vw, var(--spacing-card));
}

.panel-heading {
  color: var(--color-surface);
  font-size: clamp(2.6rem, 7vw, 6.75rem);
  font-weight: 700;
  line-height: 1;
  letter-spacing: 0;
  text-wrap: balance;
  text-shadow: 0 0.25rem 2.5rem rgb(2 3 12 / 0.54);
}

/* Steps grid */
.panel-steps {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(0.75rem, 2vw, 1rem);
}

/* Single step card */
.panel-step {
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-card);
  min-height: 13rem;
  border: 1px solid color-mix(in oklab, var(--color-line) 86%, transparent);
  background: color-mix(in oklab, var(--color-surface-raised) 74%, var(--color-surface));
  padding: clamp(1rem, 2.4vw, 1.35rem);
  text-align: start;
  box-shadow: var(--shadow-card);
  transition:
    transform var(--motion-standard) var(--motion-ease-out),
    border-color var(--motion-standard) var(--motion-ease-out),
    box-shadow var(--motion-standard) var(--motion-ease-out);
}

.panel-step:hover {
  transform: translateY(-0.25rem);
  border-color: color-mix(in oklab, var(--color-brand-primary) 24%, var(--color-line));
  box-shadow: var(--shadow-card-hover);
}

/* Step number badge */
.step-num {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 2rem;
  height: 2rem;
  padding: 0 0.5rem;
  margin-bottom: 0.75rem;
  border-radius: var(--radius-pill);
  border: 1px solid color-mix(in oklab, var(--color-brand-primary) 16%, var(--color-line));
  background: color-mix(in oklab, var(--color-brand-primary) 10%, var(--color-surface));
  color: var(--color-brand-primary);
  font-size: var(--text-caption);
  font-weight: 700;
  letter-spacing: var(--tracking-label);
}

/* Step icon */
.step-icon {
  display: block;
  width: var(--spacing-icon-xl);
  height: var(--spacing-icon-xl);
  color: var(--color-brand-primary);
  margin-bottom: 0.75rem;
}

/* Step title */
.step-title {
  margin-bottom: 0.375rem;
  color: var(--color-ink);
  font-size: var(--text-title);
  font-weight: 700;
  line-height: var(--leading-heading);
}

/* Step description */
.step-desc {
  color: var(--color-ink-soft);
  font-size: var(--text-copy);
  line-height: var(--leading-copy);
}

/* ── Responsive ─────────────────────────────────────────── */
@media (max-width: 900px) {
  .panel-steps {
    grid-template-columns: 1fr;
  }

  .panel-heading {
    font-size: clamp(2.4rem, 12vw, 4rem);
  }

  .quality-image-shell {
    min-height: clamp(15rem, 58vw, 22rem);
  }
}

@media (max-width: 640px) {
  .petal-grid {
    grid-template-columns: 1fr;
  }
}
</style>
