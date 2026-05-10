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

        <!-- Background image -->
        <BaseImage
          src="~/assets/images/medcal_factory.jpg"
          alt="Laboratory review for supplement quality"
          fill
          class="absolute inset-0 object-cover"
        />

        <!-- Overlay gradient -->
        <div class="" aria-hidden="true" />

        <!-- Content -->
        <div class="panel-body" dir="rtl" lang="ar">
          <div class="panel-intro">
            <h3 class="panel-heading">مراحل الجودة</h3>
          </div>

          <div class="panel-steps">
            <div
              v-for="(step, i) in qualitySteps"
              :key="step.title"
              class="panel-step"
            >
              <span class="step-num">{{ String(i + 1).padStart(2, '0') }}</span>
              <component :is="step.icon" class="step-icon" aria-hidden="true" />
              <h4 class="step-title">{{ step.title }}</h4>
              <p class="step-desc">{{ step.desc }}</p>
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
  { title: 'اختبار السلامة',   desc: 'ضمان أمان الاستخدام',       icon: ShieldCheckIcon },
  { title: 'اختبار النقاء',    desc: 'خلو المنتج من الشوائب',      icon: SparklesIcon },
  { title: 'الفحص المجهري',   desc: 'تحليل دقيق للفعالية',        icon: MicroscopeIcon },
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
  min-height: 24rem;
  border-radius: var(--radius-panel);
  overflow: hidden;
  border: 1px solid color-mix(in oklab, var(--color-line) 70%, transparent);
  box-shadow: var(--shadow-float);
  display: flex;
  align-items: flex-end;
  isolation: isolate;
}



/* Image overlay gradient */
.panel-overlay {
  position: absolute;
  inset: 0;
  z-index: 1;
  background:
    linear-gradient(
      100deg,
      color-mix(in oklab, var(--color-brand-dark) 96%, transparent) 0%,
      color-mix(in oklab, var(--color-brand-dark) 78%, transparent) 46%,
      transparent 100%
    ),
    radial-gradient(circle at 12% 20%, color-mix(in oklab, var(--color-brand-primary) 22%, transparent), transparent 16rem);
}

/* Panel body */
.panel-body {
  position: relative;
  z-index: 2;
  width: 100%;
  padding: var(--spacing-card);
}

/* Intro block */
.panel-intro {
  margin-bottom: var(--spacing-gutter);
  text-align: right;
}

.panel-eyebrow {
  display: inline-flex;
  align-items: center;
  height: 1.75rem;
  padding: 0 0.75rem;
  margin-bottom: 0.75rem;
  border-radius: var(--radius-pill);
  border: 1px solid color-mix(in oklab, var(--color-brand-accent) 32%, transparent);
  background: color-mix(in oklab, var(--color-brand-dark) 60%, transparent);
  color: var(--color-brand-accent);
  font-size: var(--text-caption);
  font-weight: 700;
  letter-spacing: var(--tracking-label);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.panel-heading {
  color: var(--color-on-primary);
  font-size: var(--text-heading-lg);
  font-weight: 700;
  line-height: var(--leading-heading);
  text-shadow: 0 2px 20px rgb(2 3 12 / 0.4);
}

/* Steps grid */
.panel-steps {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
}

/* Single step card */
.panel-step {
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-card);
  border: 1px solid rgb(251 252 255 / 0.22);
  background:
    linear-gradient(135deg, rgb(251 252 255 / 0.18), rgb(251 252 255 / 0.06) 50%, rgb(16 36 63 / 0.28));
  padding: 1.25rem;
  text-align: right;
  backdrop-filter: blur(24px) saturate(1.6);
  -webkit-backdrop-filter: blur(24px) saturate(1.6);
  box-shadow:
    inset 0 1px 0 rgb(251 252 255 / 0.28),
    0 16px 40px rgb(2 3 12 / 0.2);
  transition:
    transform var(--motion-standard) var(--motion-ease-out),
    border-color var(--motion-standard) var(--motion-ease-out),
    background var(--motion-standard) var(--motion-ease-out);
}

.panel-step:hover {
  transform: translateY(-0.25rem);
  border-color: rgb(251 252 255 / 0.36);
  background:
    linear-gradient(135deg, rgb(251 252 255 / 0.26), rgb(251 252 255 / 0.1) 50%, color-mix(in oklab, var(--color-brand-primary) 28%, transparent));
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
  border: 1px solid rgb(251 252 255 / 0.26);
  background:
    linear-gradient(180deg, rgb(251 252 255 / 0.2), rgb(251 252 255 / 0.06));
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  color: var(--color-brand-accent);
  font-size: var(--text-caption);
  font-weight: 700;
  letter-spacing: var(--tracking-label);
}

/* Step icon */
.step-icon {
  display: block;
  width: var(--spacing-icon-xl);
  height: var(--spacing-icon-xl);
  color: color-mix(in oklab, var(--color-on-primary) 70%, var(--color-brand-accent));
  margin-bottom: 0.75rem;
}

/* Step title */
.step-title {
  margin-bottom: 0.375rem;
  color: var(--color-on-primary);
  font-size: var(--text-title);
  font-weight: 700;
  line-height: var(--leading-heading);
}

/* Step description */
.step-desc {
  color: color-mix(in oklab, var(--color-on-primary) 72%, transparent);
  font-size: var(--text-copy);
  line-height: var(--leading-copy);
}

/* ── Responsive ─────────────────────────────────────────── */
@media (max-width: 900px) {
  .panel-steps {
    grid-template-columns: 1fr;
  }

  .panel-heading {
    font-size: var(--text-heading);
  }

  .quality-panel {
    min-height: auto;
  }
}

@media (max-width: 640px) {
  .petal-grid {
    grid-template-columns: 1fr;
  }
}
</style>
