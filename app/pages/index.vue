<template>
  <div>
    <HomeHero />
    <LazyHomeFeaturedProducts />
    <LazyHomeProducts />
    <LazyHomeFeatures />
    <LazyHomeWhoWeAre />
    <LazyHomeFindProducts />
    <LazyHomeEducationTeaser />
    <LazyHomePartners />
    <LazyHomeFaq />
  </div>
</template>

<script setup lang="ts">
import { faqItems } from '~/data/faq'

const { t } = useI18n()

usePageSeo({
  title: () => t('seoTitle'),
  description: () => t('description'),
})

useSchemaOrg([
  defineWebPage({ '@type': ['WebPage', 'FAQPage'] }),
  ...faqItems.map((item) =>
    defineQuestion({
      name: () => t(item.questionKey),
      acceptedAnswer: () => t(item.answerKey),
    }),
  ),
])
</script>
