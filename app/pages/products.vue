<template>
  <div class="pt-24 pb-12 min-h-screen">
    <div class="content-wrap">
      <h1 class="text-4xl font-bold text-center mb-8" data-aos="fade-up">{{ $t('productPage.heading') }}</h1>
      <p class="section-copy text-center max-w-copy mx-auto mb-8" data-aos="fade-up" data-aos-delay="100">
        {{ $t('productPage.description') }}
      </p>
      <div class="text-center" data-aos="fade-up" data-aos-delay="200">
        <BaseButton href="mailto:b2b@Vitadiet.sa" variant="primary">
          {{ $t('productPage.cta') }}
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>
