<template>
  <div>
    <HomeHero />
    <LazyHomeWhoWeAre />
    <LazyHomeFeatures />
    <LazyHomeProducts />
    <LazyHomeFaq />
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()

// titleTemplate in app.vue appends " - Vitadiet"; use a keyword-led, brand-free title.
useSeoMeta({
  title: () => t('seoTitle'),
  description: () => t('description'),
  ogTitle: () => t('seoTitle'),
  ogDescription: () => t('description'),
})
</script>
