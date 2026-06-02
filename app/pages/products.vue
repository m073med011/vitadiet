<template>
  <div class="pt-24 pb-12 min-h-screen">
    <div class="max-w-content mx-auto px-page sm:px-gutter md:px-page-lg">
      <h1 class="text-4xl font-bold text-center mb-8" data-aos="fade-up">{{ $t('productPage.heading') }}</h1>
      <p class="text-copy-lg leading-copy text-ink-soft text-center max-w-copy mx-auto mb-8" data-aos="fade-up" data-aos-delay="100">
        {{ $t('productPage.description') }}
      </p>
      <div class="text-center" data-aos="fade-up" data-aos-delay="200">
        <BaseButton href="mailto:b2b@vitadiet.sa" variant="primary">
          {{ $t('productPage.cta') }}
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()

// titleTemplate in app.vue appends " - Vitadiet"; keep this brand-free.
useSeoMeta({
  title: () => t('productPage.heading'),
  description: () => t('productPage.description'),
  ogTitle: () => t('productPage.heading'),
  ogDescription: () => t('productPage.description'),
})
</script>
