<template>
  <section id="partners" class="section-block--tinted">
    <div class="content-container">
      <div
        class="panel-card grid gap-gutter-lg lg:grid-cols-[1.1fr_0.9fr] lg:items-center"
        data-aos="fade-up"
      >
        <div>
          <p class="eyebrow-pill mb-page">
            {{ $t('partnerSection.eyebrow') }}
          </p>
          <h2 class="panel-heading">
            {{ $t('partnerSection.heading') }}
          </h2>
          <p class="panel-copy">
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
