<template>
  <section class="border-y border-line bg-surface-raised py-section-sm">
    <div class="content-container grid gap-page md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
      <div>
        <p class="eyebrow-text">{{ $t('partnerSection.eyebrow') }}</p>
        <h2 class="mt-1 text-heading font-bold leading-heading text-ink">
          {{ $t('partnerSection.heading') }}
        </h2>
        <p class="mt-page max-w-copy text-copy leading-copy text-ink-soft">
          {{ $t('partnerSection.description') }}
        </p>
      </div>
      <BaseButton :href="`mailto:${CONTACT.email}`" variant="primary">
        <MailIcon class="h-icon-sm w-icon-sm" aria-hidden="true" />
        {{ $t('partnerSection.cta') }}
      </BaseButton>
    </div>
  </section>
</template>

<script setup lang="ts">
import { MailIcon } from 'lucide-vue-next'
import { CONTACT } from '#shared/brand'

// Callers position this block with a plain `class` on the tag; Vue merges it onto the
// <section> root. HomePartners is deliberately NOT this component: same copy, but it
// adds a catalog download and sits inside a panel card.
</script>
