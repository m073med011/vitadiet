<template>
  <div>
    <HomeHero />
    <LazyHomeFeaturedProducts />
    <LazyHomeProducts />
    <LazyHomeFeatures />
    <LazyHomeQualityTeaser />
    <LazyHomeWhoWeAre />
    <LazyHomeFindProducts />
    <LazyHomeEducationTeaser />
    <LazyHomeFaq />
    <!-- Last section before the footer: the consumer journey above is complete, so the
         trade route can be offered without competing with it. -->
    <LazyHomePartners />
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
