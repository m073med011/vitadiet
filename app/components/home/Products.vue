<template>
  <section id="products" class="w-full py-section md:py-section-lg bg-surface">
    <div class="content-container">
      <BaseSectionHeader
        :heading="$t('homePage.products.heading')"
        :description="$t('homePage.products.description')"
      />
    </div>

    <HomeProductCarousel />

    <div class="content-container">
      <div class="mt-gutter-lg flex justify-center" data-aos="fade-up">
        <BaseButton :to="localePath('/products/')" variant="secondary">
          {{ $t('homePage.products.viewAll') }}
        </BaseButton>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const localePath = useLocalePath()
</script>
