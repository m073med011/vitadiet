<template>
  <div class="bg-surface pt-section-sm pb-section">
    <div class="content-container">
      <BaseBreadcrumb :items="breadcrumbItems" />

      <header class="mx-auto mt-page max-w-copy text-center" data-aos="fade-up">
        <p class="eyebrow-pill mx-auto mb-page">{{ $t('qualityPage.eyebrow') }}</p>
        <h1 class="text-heading-lg font-bold leading-heading text-ink">
          {{ $t('qualityPage.heading') }}
        </h1>
        <p class="mt-page text-copy-lg leading-copy text-ink-soft">
          {{ $t('qualityPage.description') }}
        </p>
        <p class="mt-page text-small font-semibold leading-copy text-brand-primary">
          {{ $t('qualityPage.documentedOnly') }}
        </p>
      </header>

      <p
        v-if="isLoading"
        class="mt-gutter-lg alert alert--notice justify-center"
        role="status"
        aria-live="polite"
      >
        {{ $t('qualityPage.loading') }}
      </p>

      <p v-else-if="hasFailed" class="mt-gutter-lg alert alert--error" role="alert">
        <AlertCircleIcon
          class="mt-0.5 h-icon-md w-icon-md shrink-0 text-danger"
          aria-hidden="true"
        />
        <span>{{ $t('qualityPage.error') }}</span>
      </p>

      <div v-else class="mt-gutter-lg grid gap-gutter lg:grid-cols-[minmax(0,17rem)_minmax(0,1fr)]">
        <!-- In-page contents. Sticky only from lg up, where there is room beside the
             article; below that it stacks as a plain list of jump links. -->
        <nav
          class="h-fit rounded-card border border-line bg-surface-raised p-page lg:sticky lg:top-28"
          :aria-label="$t('qualityPage.contents')"
        >
          <h2 class="mb-page text-caption font-bold uppercase tracking-label text-ink-subtle">
            {{ $t('qualityPage.contents') }}
          </h2>
          <ol class="grid gap-1">
            <li v-for="(pillar, index) in pillars" :key="pillar.id">
              <a
                :href="`#${pillar.id}`"
                class="focus-ring flex min-h-11 items-center gap-2 rounded-control px-2 text-small font-semibold text-ink transition-colors hover:text-brand-primary"
              >
                <span class="text-ink-subtle">{{ index + 1 }}.</span>
                <span>{{ pillar.title }}</span>
              </a>
            </li>
          </ol>
        </nav>

        <div class="grid gap-gutter">
          <section
            v-for="(pillar, index) in pillars"
            :id="pillar.id"
            :key="pillar.id"
            class="quality-section scroll-mt-28"
            data-aos="fade-up"
          >
            <div class="flex items-start gap-page">
              <span class="quality-badge" aria-hidden="true">{{ index + 1 }}</span>
              <div class="min-w-0">
                <h2 class="text-heading font-bold leading-heading text-brand-primary">
                  {{ pillar.title }}
                </h2>
                <p class="mt-page text-copy-lg leading-copy text-ink-soft">
                  {{ pillar.description }}
                </p>
                <ul v-if="pillar.points.length" class="mt-page grid gap-control-y">
                  <li
                    v-for="point in pillar.points"
                    :key="point"
                    class="flex items-start gap-control-y text-copy leading-copy text-ink"
                  >
                    <CheckCircleIcon
                      class="mt-1 h-icon-sm w-icon-sm shrink-0 text-brand-primary"
                      aria-hidden="true"
                    />
                    <span>{{ point }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <aside class="alert alert--notice">
            <InfoIcon
              class="mt-0.5 h-icon-md w-icon-md shrink-0 text-brand-primary"
              aria-hidden="true"
            />
            <p>
              {{ $t('qualityPage.disclaimer') }}
              <NuxtLink
                :to="localePath('/legal/medical-disclaimer/')"
                class="focus-ring font-semibold text-brand-primary underline underline-offset-4"
              >
                {{ $t('legal.medicalDisclaimer') }}
              </NuxtLink>
            </p>
          </aside>

          <div class="flex flex-wrap gap-page">
            <BaseButton :to="localePath('/products/')" variant="primary">
              {{ $t('qualityPage.productsCta') }}
            </BaseButton>
            <BaseButton :to="localePath('/partners/')" variant="secondary">
              {{ $t('partnerSection.cta') }}
            </BaseButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AlertCircleIcon, CheckCircleIcon, InfoIcon } from 'lucide-vue-next'

const { t } = useI18n()
const localePath = useLocalePath()
const { absoluteSiteUrl } = useSiteUrls()
const { pillars, hasFailed, isLoading } = await useQualityPillars()

const breadcrumbItems = computed(() => [
  { label: t('home'), to: localePath('/') },
  { label: t('qualityPage.heading'), to: localePath('/quality/') },
])

useSchemaOrg([
  defineBreadcrumb({
    itemListElement: breadcrumbItems.value.map((item) => ({
      name: item.label,
      item: absoluteSiteUrl(item.to),
    })),
  }),
])

usePageSeo({
  title: () => t('qualityPage.heading'),
  description: () => t('qualityPage.description'),
})
</script>

<style scoped>
.quality-section {
  border-radius: var(--radius-card);
  border: 1px solid color-mix(in oklab, var(--color-line) 80%, transparent);
  background: var(--color-surface-raised);
  padding: var(--spacing-card);
  box-shadow: var(--shadow-card);
}

.quality-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 2.5rem;
  height: 2.5rem;
  flex-shrink: 0;
  border-radius: var(--radius-pill);
  background: var(--color-brand-primary);
  color: var(--color-on-primary);
  font-size: var(--text-copy);
  font-weight: 700;
}
</style>
