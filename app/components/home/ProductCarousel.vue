<template>
  <div
    class="product-list content-container"
    role="region"
    :aria-label="$t('homePage.products.carouselLabel')"
  >
    <ProductCard v-for="product in products" :key="product.slug" :product="product" />
  </div>
</template>

<script setup lang="ts">
import { products } from '~/data/products'
</script>

<style scoped>
.product-list {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding-block: 0.75rem 1rem;
  scroll-padding-inline: var(--spacing-page);
  scroll-snap-type: x proximity;
  -webkit-overflow-scrolling: touch;
}

.product-list :deep(.product-card) {
  flex: 0 0 min(82vw, 21rem);
  scroll-snap-align: start;
}

@media (min-width: 640px) {
  .product-list :deep(.product-card) {
    flex-basis: 20rem;
  }
}

@media (min-width: 900px) {
  .product-list {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    overflow: visible;
    padding-block: 0.75rem;
  }

  .product-list :deep(.product-card) {
    flex-basis: auto;
  }
}
</style>
