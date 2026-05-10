<template>
  <section class="relative overflow-hidden bg-surface dark:bg-dark-surface pt-section-sm pb-section-lg">
    <div class="product-backdrop" aria-hidden="true"></div>

    <div class="relative z-10 max-w-content mx-auto px-page sm:px-gutter md:px-page-lg">
      <div class="grid items-center gap-gutter-lg lg:grid-cols-[1.05fr_0.95fr]">
        <div data-aos="fade-up">
          <p class="mb-page text-caption font-bold tracking-label uppercase text-brand-primary dark:text-brand-accent">
            {{ $t('categoryPage.eyebrow') }}
          </p>

          <h1 class="max-w-[42rem] text-heading md:text-display font-bold leading-heading text-ink dark:text-dark-ink">
            {{ $t(product.titleKey) }}
          </h1>

          <p class="mt-gutter max-w-copy text-copy-lg leading-copy text-ink-soft dark:text-dark-ink-soft">
            {{ description }}
          </p>

          <ul v-if="product.highlights?.length" class="mt-gutter grid gap-page sm:grid-cols-3">
            <li
              v-for="highlight in product.highlights"
              :key="highlight"
              class="flex items-start gap-control-y-sm rounded-card border border-line/80 dark:border-dark-line bg-surface-raised dark:bg-dark-surface-raised p-page text-small font-semibold leading-copy text-ink dark:text-dark-ink"
            >
              <CheckCircleIcon class="mt-1 h-icon-sm w-icon-sm shrink-0 text-brand-primary dark:text-brand-accent" aria-hidden="true" />
              <span>{{ $t(highlight) }}</span>
            </li>
          </ul>

          <div class="mt-gutter flex flex-col sm:flex-row gap-page">
            <BaseButton href="mailto:b2b@vitadiet.sa" variant="primary">
              {{ $t('categoryPage.cta') }}
              <ArrowRightIcon class="h-icon-md w-icon-md rtl:rotate-180" aria-hidden="true" />
            </BaseButton>
            <BaseButton :to="sectionPath('#products')" variant="secondary">
              {{ $t('products') }}
            </BaseButton>
          </div>
        </div>

        <div class="rounded-card border border-line dark:border-dark-line bg-surface-raised dark:bg-dark-surface-raised p-page shadow-float" data-aos="fade-up" data-aos-delay="150">
          <div class="relative aspect-[4/5] overflow-hidden rounded-card bg-surface-muted dark:bg-dark-surface-muted">
            <BaseImage :src="product.image" :alt="$t(product.titleKey)" fill />
            <div class="absolute inset-x-page bottom-page flex items-center justify-between gap-page rounded-card border border-line/70 bg-surface/95 p-page shadow-card backdrop-blur dark:border-dark-line dark:bg-dark-surface-raised/95">
              <span class="text-small font-bold text-ink-soft dark:text-dark-ink-soft">{{ $t('homePage.stats.b2bOnly') }}</span>
              <span class="rounded-pill bg-brand-primary px-page py-control-y-sm text-small font-bold text-surface dark:text-dark-ink">
                {{ $t(product.priceKey) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-gutter grid gap-page md:grid-cols-3" data-aos="fade-up" data-aos-delay="250">
        <article
          v-for="item in trustItems"
          :key="item.labelKey"
          class="rounded-card border border-line/80 dark:border-dark-line bg-surface dark:bg-dark-surface-raised p-page shadow-card"
        >
          <component :is="item.icon" class="mb-page h-icon-xl w-icon-xl text-brand-primary dark:text-brand-accent" aria-hidden="true" />
          <h2 class="text-copy font-bold text-ink dark:text-dark-ink">{{ $t(item.labelKey) }}</h2>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import {
  ArrowRightIcon,
  CheckCircleIcon,
  FileCheckIcon,
  HandshakeIcon,
  ShieldCheckIcon,
} from 'lucide-vue-next'
import type { HomeProduct } from '~/data/home'

const props = defineProps<{
  product: HomeProduct
}>()

const { t } = useI18n()
const { sectionPath } = useSectionPath()

const description = computed(() => (
  props.product.descriptionKey ? t(props.product.descriptionKey) : t('categoryPage.description')
))

const trustItems = [
  { labelKey: 'homePage.stats.b2bOnly', icon: HandshakeIcon },
  { labelKey: 'homePage.stats.scientificReview', icon: FileCheckIcon },
  { labelKey: 'homePage.stats.sfdaFocus', icon: ShieldCheckIcon },
]
</script>

<style scoped>
.product-backdrop {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(circle at 20% 10%, color-mix(in oklab, var(--color-brand-primary) 10%, transparent), transparent 18rem),
    linear-gradient(180deg, color-mix(in oklab, var(--color-brand-primary) 5%, transparent), transparent 22rem);
}
</style>
