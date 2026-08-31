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
      <div class="flex flex-col gap-page sm:flex-row md:justify-end">
        <!-- Routes to the partnership form, never to a bare mailto: a mail client is not
             installed on most phones and the enquiry would be lost silently. The email
             address is still offered on the form page for anyone who prefers it. -->
        <BaseButton :to="localePath('/partners/')" variant="primary">
          <HandshakeIcon class="h-icon-sm w-icon-sm" aria-hidden="true" />
          {{ $t('partnerSection.cta') }}
        </BaseButton>
        <BaseButton :href="ASSETS.catalog" :download="$t('catalog.filename')" variant="secondary">
          <FileDownIcon class="h-icon-sm w-icon-sm" aria-hidden="true" />
          {{ $t('partnerSection.catalog') }}
        </BaseButton>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { FileDownIcon, HandshakeIcon } from 'lucide-vue-next'
import { ASSETS } from '#shared/brand'

const localePath = useLocalePath()

// Callers position this block with a plain `class` on the tag; Vue merges it onto the
// <section> root. HomePartners is deliberately NOT this component: same two actions, but
// it is the full-width homepage section that closes the consumer journey.
</script>
