<template>
  <section id="partners" class="w-full py-section bg-surface-raised/50">
    <div class="content-container">
      <div
        class="grid gap-gutter-lg rounded-card border border-line bg-surface p-card shadow-card lg:grid-cols-[1.1fr_0.9fr] lg:items-center"
        data-aos="fade-up"
      >
        <div>
          <p
            class="mb-page inline-flex w-fit rounded-pill bg-brand-primary-soft px-page py-control-y-sm text-caption font-bold uppercase tracking-label text-brand-primary"
          >
            {{ $t('partnerSection.eyebrow') }}
          </p>
          <h2 class="text-heading font-bold leading-heading text-ink md:text-heading-lg">
            {{ $t('partnerSection.heading') }}
          </h2>
          <p class="mt-page max-w-copy text-copy-lg leading-copy text-ink-soft">
            {{ $t('partnerSection.description') }}
          </p>
        </div>

        <div class="flex flex-col gap-page sm:flex-row lg:justify-end">
          <BaseButton :href="`mailto:${CONTACT.email}`" variant="primary">
            {{ $t('partnerSection.cta') }}
          </BaseButton>
          <BaseButton :href="ASSETS.catalog" :download="$t('catalog.filename')" variant="secondary">
            {{ $t('partnerSection.catalog') }}
          </BaseButton>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ASSETS, CONTACT } from '#shared/brand'
</script>
