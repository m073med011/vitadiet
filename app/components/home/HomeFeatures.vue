<template>
  <section id="why" class="w-full py-section bg-surface-raised/50 section-decor overflow-hidden">
    <div class="content-container">

      <!-- Section header -->
      <div class="text-center max-w-copy mx-auto mb-rule-sm" data-aos="fade-up">
        <h2 class="text-heading md:text-heading-lg leading-heading font-bold text-brand-primary uppercase tracking-label mb-page">
          {{ $t('homePage.why.heading') }}
        </h2>
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
          <component :is="iconMap[petal.icon]" class="petal-icon" aria-hidden="true" />
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
          <NuxtImg
            src="/images/vitadiet-certified-manufacturing-facility.webp"
            :alt="$t('homePage.quality.imageAlt')"
            width="1200"
            height="600"
            sizes="100vw"
            class="absolute inset-0 w-full h-full object-cover"
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
import { whyPetals, petalIconMap as iconMap, qualitySteps } from '~/data/home'
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
  grid-template-columns: 1fr;
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
  background: color-mix(in oklab, var(--color-surface-raised) 74%, var(--color-surface));
  padding: var(--spacing-card);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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



/* Petal icon */
.petal-icon {
  display: block;
  width: 2rem;
  height: 2rem;
  color: var(--color-brand-primary);
  margin-bottom: 1.25rem;
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
  padding: clamp(1.5rem, 3vw, 2rem);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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

.step-icon {
  display: block;
  width: 2rem;
  height: 2rem;
  color: var(--color-brand-primary);
  margin-bottom: 1.25rem;
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

@media (min-width: 640px) {
  .petal-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 900px) {
  .petal-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (min-width: 1100px) {
  .petal-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .petal-card:nth-last-child(2):nth-child(4n + 1) {
    grid-column-start: 2;
  }
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
