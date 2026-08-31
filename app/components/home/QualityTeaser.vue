<template>
  <section id="quality" class="section-block--tinted">
    <div class="content-container">
      <BaseSectionHeader
        :heading="$t('qualityPage.heading')"
        :description="$t('qualityPage.teaserDescription')"
      />

      <!-- Loading and error branches are rendered, not assumed: the same source will be
           a Dashboard API later, and the section must degrade instead of disappearing. -->
      <p
        v-if="isLoading"
        class="alert alert--notice justify-center"
        role="status"
        aria-live="polite"
      >
        {{ $t('qualityPage.loading') }}
      </p>

      <p v-else-if="hasFailed" class="alert alert--error" role="alert">
        <AlertCircleIcon
          class="mt-0.5 h-icon-md w-icon-md shrink-0 text-danger"
          aria-hidden="true"
        />
        <span>{{ $t('qualityPage.error') }}</span>
      </p>

      <ol v-else class="quality-teaser-grid">
        <li
          v-for="(pillar, index) in pillars"
          :key="pillar.id"
          class="quality-teaser-card"
          data-aos="fade-up"
          :data-aos-delay="index * AOS_STAGGER_MS"
        >
          <span class="quality-teaser-step" aria-hidden="true">{{ index + 1 }}</span>
          <QualityPillarIcon :icon-key="pillar.iconKey" class="quality-teaser-icon" />
          <h3 class="text-title font-bold leading-heading text-ink">{{ pillar.title }}</h3>
          <p class="mt-control-y-sm text-copy leading-copy text-ink-soft">
            {{ pillar.description }}
          </p>
        </li>
      </ol>

      <div class="mt-gutter-lg grid gap-page text-center">
        <div class="flex justify-center">
          <BaseButton :to="localePath('/quality/')" variant="primary">
            {{ $t('qualityPage.cta') }}
            <ArrowRightIcon
              class="h-icon-sm w-icon-sm shrink-0 rtl:rotate-180"
              aria-hidden="true"
            />
          </BaseButton>
        </div>
        <p class="mx-auto max-w-copy text-small leading-copy text-ink-soft">
          {{ $t('qualityPage.documentedOnly') }}
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { AlertCircleIcon, ArrowRightIcon } from 'lucide-vue-next'
import { AOS_STAGGER_MS } from '~/utils/motion'

const localePath = useLocalePath()
const { pillars, hasFailed, isLoading } = await useQualityPillars()
</script>

<style scoped>
.quality-teaser-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  list-style: none;
  padding: 0;
  margin: 0;
  counter-reset: quality;
}

.quality-teaser-card {
  position: relative;
  border-radius: var(--radius-card);
  border: 1px solid color-mix(in oklab, var(--color-line) 80%, transparent);
  background: var(--color-surface);
  padding: var(--spacing-card);
  box-shadow: var(--shadow-card);
}

.quality-teaser-step {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 2rem;
  height: 2rem;
  margin-bottom: 0.75rem;
  border-radius: var(--radius-pill);
  background: var(--color-brand-primary);
  color: var(--color-on-primary);
  font-size: var(--text-small);
  font-weight: 700;
}

.quality-teaser-icon {
  display: block;
  width: 1.75rem;
  height: 1.75rem;
  margin-bottom: 0.75rem;
  color: var(--color-brand-primary);
}

@media (min-width: 640px) {
  .quality-teaser-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1100px) {
  .quality-teaser-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>
