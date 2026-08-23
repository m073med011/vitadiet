<template>
  <section
    class="w-full border-y border-line bg-surface-raised/70"
    :aria-label="$t('trustBar.ariaLabel')"
  >
    <div class="content-container py-page">
      <ul class="grid gap-page sm:grid-cols-2 lg:grid-cols-5">
        <li
          v-for="item in trustItems"
          :key="item.labelKey"
          class="flex min-h-14 items-center gap-page rounded-card border border-line bg-surface px-page py-control-y shadow-card"
        >
          <span
            class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-pill bg-brand-primary-soft text-brand-primary"
            aria-hidden="true"
          >
            <component :is="item.icon" class="h-icon-sm w-icon-sm" />
          </span>
          <span class="text-small font-bold leading-tight text-ink">
            {{ $t(item.labelKey) }}
          </span>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup lang="ts">
import {
  ClipboardCheckIcon,
  FileCheckIcon,
  InfoIcon,
  ShieldCheckIcon,
  SparklesIcon,
} from 'lucide-vue-next'

const trustItems = [
  { labelKey: 'homePage.stats.europeanQuality', icon: SparklesIcon },
  { labelKey: 'homePage.stats.scientificReview', icon: ClipboardCheckIcon },
  { labelKey: 'homePage.stats.officialRequirements', icon: ShieldCheckIcon },
  { labelKey: 'homePage.stats.clearConsumerInfo', icon: InfoIcon },
  { labelKey: 'homePage.stats.trustedPlatforms', icon: FileCheckIcon },
]
</script>
