<template>
  <section id="products" class="section-solid section-loose">
    <div class="content-wrap">
      <div class="text-center copy-wrap mb-16">
        <h2 class="section-heading mb-4">{{ $t('homePage.products.heading') }}</h2>
        <p class="section-copy">{{ $t('homePage.products.description') }}</p>
      </div>

      <div class="product-dossier-grid">
        <NuxtLink
          v-for="product in products"
          :key="product.slug"
          :to="localePath(`/cat/${product.slug}`)"
          class="product-dossier-card group"
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

      <div class="trust-download-grid">
        <article class="trust-box-panel">
          <h3 class="section-heading-display mb-4">{{ $t('homePage.trustBox.heading') }}</h3>
          <p class="section-copy mb-8">{{ $t('homePage.trustBox.description') }}</p>
          <ul class="soft-check-list">
            <li v-for="point in trustBoxPoints" :key="point">
              <PackageCheckIcon />
              <span>{{ $t(point) }}</span>
            </li>
          </ul>
        </article>

        <article class="download-panel">
          <h3 class="section-heading-display mb-4">{{ $t('homePage.downloads.heading') }}</h3>
          <p class="section-copy mb-8">{{ $t('homePage.downloads.description') }}</p>
          <div class="download-grid">
            <button v-for="item in downloadItems" :key="item" type="button" class="download-tile">
              <FileDownIcon />
              <span>{{ $t(item) }}</span>
            </button>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { FileDownIcon, PackageCheckIcon } from 'lucide-vue-next'
import { downloadItems, products, trustBoxPoints } from '~/data/home'

const localePath = useLocalePath()
</script>
