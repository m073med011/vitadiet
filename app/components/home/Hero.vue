<template>
  <section class="relative w-full overflow-hidden bg-surface pt-5">
    <div class="lotus-backdrop" aria-hidden="true" />

    <HomeHeroDesktopGallery />
    <HomeHeroMobileMarquee />

    <div class="relative z-20 px-page max-w-content mx-auto lg:-mt-section-lg">
      <div class="mx-auto max-w-[60rem] px-page py-gutter sm:px-card sm:py-card text-center">
        <span
          class="inline-flex items-center gap-control-y-sm py-control-y-sm px-icon-md rounded-pill bg-brand-primary-soft text-small font-semibold text-brand-primary mb-gutter border border-line"
        >
          <ShieldCheckIcon class="h-icon-sm w-icon-sm" aria-hidden="true" />
          {{ $t('homePage.hero.badge') }}
        </span>

        <h1
          class="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-normal text-ink mb-gutter leading-heading"
        >
          {{ $t('homePage.hero.heading') }}
        </h1>

        <p
          class="mt-gutter text-copy sm:text-copy-lg text-ink-soft max-w-copy mx-auto font-medium leading-copy"
        >
          {{ $t('homePage.hero.subheading') }}
        </p>

        <div
          class="mt-gutter grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-row items-stretch lg:items-center justify-center gap-page"
        >
          <BaseButton :to="localePath('/products/')" variant="primary">
            {{ $t('homePage.hero.primary') }}
            <ArrowRightIcon
              class="h-icon-md w-icon-md shrink-0 rtl:rotate-180"
              aria-hidden="true"
            />
          </BaseButton>
          <BaseButton :to="`${localePath('/')}#where-to-buy`" variant="secondary">
            {{ $t('homePage.hero.secondary') }}
          </BaseButton>
        </div>

        <ul
          class="mt-gutter flex flex-wrap items-center justify-center gap-control-y-sm text-small text-ink-soft"
        >
          <li
            v-for="item in trustItems"
            :key="item.labelKey"
            class="inline-flex items-center gap-control-y-sm rounded-pill border border-line bg-surface-raised px-page py-control-y-sm font-semibold"
          >
            <component
              :is="item.icon"
              class="h-icon-sm w-icon-sm text-brand-primary"
              aria-hidden="true"
            />
            {{ $t(item.labelKey) }}
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ArrowRightIcon, FileCheckIcon, ShieldCheckIcon, SparklesIcon } from 'lucide-vue-next'

const localePath = useLocalePath()

const trustItems = [
  { labelKey: 'homePage.stats.europeanQuality', icon: SparklesIcon },
  { labelKey: 'homePage.stats.scientificReview', icon: FileCheckIcon },
  { labelKey: 'homePage.stats.officialRequirements', icon: ShieldCheckIcon },
]
</script>

<style scoped>
.lotus-backdrop {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.55;
  background:
    radial-gradient(
      circle at 50% 20%,
      color-mix(in oklab, var(--color-brand-accent) 10%, transparent) 0 12rem,
      transparent 24rem
    ),
    linear-gradient(
      90deg,
      color-mix(in oklab, var(--color-brand-primary) 8%, transparent) 1px,
      transparent 1px
    ),
    linear-gradient(
      180deg,
      color-mix(in oklab, var(--color-brand-primary) 7%, transparent) 1px,
      transparent 1px
    );
  background-size:
    auto,
    9rem 9rem,
    9rem 9rem;
}
</style>
