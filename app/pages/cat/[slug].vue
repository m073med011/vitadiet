<template>
  <div class="pt-24 pb-12 min-h-screen">
    <div class="content-wrap">
      <p class="text-caption font-bold tracking-label uppercase text-brand-primary dark:text-brand-accent text-center mb-4">
        {{ $t('categoryPage.eyebrow') }}
      </p>
      <h1 class="text-4xl font-bold text-center mb-8">{{ categoryName }}</h1>
      <p class="section-copy text-center max-w-copy mx-auto mb-8">
        {{ $t('categoryPage.description') }}
      </p>
      <div class="text-center">
        <BaseButton href="mailto:b2b@Vitadiet.sa" variant="primary">
          {{ $t('categoryPage.cta') }}
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const slug = computed(() => route.params.slug)

const { t } = useI18n()

const categoryKeyBySlug: Record<string, string> = {
  'european-supplements': 'homePage.products.items.europeanSupplements.title',
  'vitamins-minerals': 'homePage.products.items.vitaminsMinerals.title',
  'herbal-formulas': 'homePage.products.items.herbalFormulas.title',
  'specialty-nutrition': 'homePage.products.items.specialtyNutrition.title',
  'pharmacy-ready-skus': 'homePage.products.items.pharmacySkus.title',
}

const categoryName = computed(() => {
  const slugValue = Array.isArray(slug.value) ? slug.value[0] : String(slug.value)
  return categoryKeyBySlug[slugValue] ? t(categoryKeyBySlug[slugValue]) : slugValue
})
</script>
