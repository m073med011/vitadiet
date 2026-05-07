<template>
  <section id="products" class="section-solid section-loose">
    <div class="content-wrap">
      <div class="text-center copy-wrap mb-16" data-aos="fade-up">
        <h2 class="section-heading mb-4">{{ $t('homePage.products.heading') }}</h2>
        <p class="section-copy">{{ $t('homePage.products.description') }}</p>
      </div>

      <div class="product-dossier-grid">
        <NuxtLink
          v-for="(product, index) in products"
          :key="product.slug"
          :to="localePath(`/cat/${product.slug}`)"
          class="product-dossier-card group"
          data-aos="fade-up"
          :data-aos-delay="index * 100"
        >
          <div class="product-dossier-media">
            <BaseImage
              :src="product.image"
              :alt="$t(product.titleKey)"
              fill
              hover-zoom="quick"
            />
            <div class="product-dossier-overlay">
              <p>{{ $t(product.ingredientsKey) }}</p>
              <p>{{ $t(product.warningsKey) }}</p>
            </div>
          </div>
          <h3>{{ $t(product.titleKey) }}</h3>
        </NuxtLink>
      </div>

      
    </div>
  </section>
</template>

<script setup lang="ts">
import { FileDownIcon, PackageCheckIcon } from 'lucide-vue-next'
import { downloadItems, products, trustBoxPoints } from '~/data/home'

const localePath = useLocalePath()
</script>
