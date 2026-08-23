<template>
  <section id="why" class="w-full py-section bg-surface section-decor overflow-hidden">
    <div class="content-container">
      <BaseSectionHeader
        :heading="$t('homePage.why.heading')"
        :description="$t('homePage.why.description')"
        tone="primary"
      />

      <div class="petal-grid">
        <article
          v-for="(petal, index) in whyPetals"
          :key="petal.titleKey"
          class="petal-card"
          data-aos="fade-up"
          :data-aos-delay="index * AOS_STAGGER_MS"
        >
          <component :is="petal.icon" class="petal-icon" aria-hidden="true" />
          <h3 class="text-title font-bold text-ink mb-page leading-heading">
            {{ $t(petal.titleKey) }}
          </h3>
          <p class="text-copy leading-copy text-ink-soft">
            {{ $t(petal.descriptionKey) }}
          </p>

          <span class="petal-glow" aria-hidden="true" />
        </article>
      </div>

      <HomeQualityPanel />
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
import { AOS_STAGGER_MS } from '~/utils/motion'

const whyPetals = [
  {
    titleKey: 'homePage.why.petals.science.title',
    descriptionKey: 'homePage.why.petals.science.description',
    icon: MicroscopeIcon,
  },
  {
    titleKey: 'homePage.why.petals.quality.title',
    descriptionKey: 'homePage.why.petals.quality.description',
    icon: SparklesIcon,
  },
  {
    titleKey: 'homePage.why.petals.sfda.title',
    descriptionKey: 'homePage.why.petals.sfda.description',
    icon: ShieldCheckIcon,
  },
  {
    titleKey: 'homePage.why.petals.transparency.title',
    descriptionKey: 'homePage.why.petals.transparency.description',
    icon: FileCheckIcon,
  },
  {
    titleKey: 'homePage.why.petals.distribution.title',
    descriptionKey: 'homePage.why.petals.distribution.description',
    icon: TruckIcon,
  },
  {
    titleKey: 'homePage.why.petals.safety.title',
    descriptionKey: 'homePage.why.petals.safety.description',
    icon: HeartPulseIcon,
  },
]
</script>

<style scoped>
.section-decor {
  position: relative;
}
.section-decor::before {
  content: '';
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

.petal-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
}

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

.petal-icon {
  display: block;
  width: 2rem;
  height: 2rem;
  color: var(--color-brand-primary);
  margin-bottom: 1.25rem;
}

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

@media (max-width: 640px) {
  .petal-grid {
    grid-template-columns: 1fr;
  }
}
</style>
