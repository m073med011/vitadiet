<template>
  <div class="space-y-gutter" data-aos="fade-up">
    <NuxtLink
      :to="localePath('/')"
      :aria-label="$t('a11y.homeLink')"
      class="focus-ring inline-flex min-h-11 min-w-11 items-center rounded-control"
    >
      <BaseImage
        :src="logoImage"
        :alt="$t('a11y.logoAlt')"
        loading="lazy"
        :width="1000"
        :height="333"
        class="h-page-lg sm:h-product-lg w-auto object-contain"
      />
    </NuxtLink>
    <p class="text-ink leading-copy">{{ $t('footer.quote') }}</p>
    <div class="flex flex-wrap items-center gap-control-y-sm pt-control-y-sm">
      <a
        v-for="link in socialLinks"
        :key="link.label"
        :href="link.href"
        target="_blank"
        rel="noopener noreferrer"
        :aria-label="link.label"
        class="focus-ring icon-circle"
      >
        <component
          :is="link.icon"
          v-if="link.icon"
          class="w-icon-sm h-icon-sm"
          aria-hidden="true"
        />
        <svg
          v-else-if="link.path"
          class="w-icon-sm h-icon-sm"
          :viewBox="link.viewBox || '0 0 24 24'"
          aria-hidden="true"
        >
          <path
            fill="currentColor"
            :stroke="link.stroke || 'none'"
            :stroke-width="link.strokeWidth || 0"
            :stroke-linejoin="link.strokeLinejoin"
            :d="link.path"
          />
        </svg>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ASSETS } from '#shared/brand'
import { socialLinks } from '~/data/social-links'

const logoImage = ASSETS.logo
const localePath = useLocalePath()
</script>
