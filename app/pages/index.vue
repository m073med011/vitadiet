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


useSeoMeta({
  title: () => t('seoTitle'),
  description: () => t('description'),
  ogTitle: () => t('seoTitle'),
  ogDescription: () => t('description'),
})
</script>
