<template>
  <article class="quality-panel" data-aos="fade-up" data-aos-delay="100">
    <div class="quality-image-shell">
      <NuxtImg
        src="/images/vitadiet-certified-manufacturing-facility.webp"
        :alt="$t('homePage.quality.imageAlt')"
        width="1200"
        height="600"
        loading="lazy"
        decoding="async"
        class="absolute inset-0 w-full h-full object-cover"
      />
      <div class="quality-image-content">
        <h3 class="panel-heading">{{ $t('homePage.quality.heading') }}</h3>
      </div>
    </div>

    <div class="panel-body">
      <div class="panel-steps">
        <div v-for="step in qualitySteps" :key="step.titleKey" class="panel-step">
          <component :is="step.icon" class="step-icon" aria-hidden="true" />
          <h4 class="step-title">{{ $t(step.titleKey) }}</h4>
          <p class="step-desc">{{ $t(step.descriptionKey) }}</p>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { MicroscopeIcon, ShieldCheckIcon, SparklesIcon } from 'lucide-vue-next'

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

.panel-steps {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(0.75rem, 2vw, 1rem);
}

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

.step-title {
  margin-bottom: 0.375rem;
  color: var(--color-ink);
  font-size: var(--text-title);
  font-weight: 700;
  line-height: var(--leading-heading);
}

.step-desc {
  color: var(--color-ink-soft);
  font-size: var(--text-copy);
  line-height: var(--leading-copy);
}

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
</style>
