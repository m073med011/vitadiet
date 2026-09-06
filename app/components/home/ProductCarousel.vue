<template>
  <div
    class="product-list content-container"
    role="region"
    :aria-label="$t('homePage.products.carouselLabel')"
  >
    <template v-if="isLoading">
      <p class="sr-only" aria-live="polite">{{ $t('productPage.search.loading') }}</p>
      <ProductCardSkeleton v-for="index in SKELETON_CARD_COUNT" :key="index" />
    </template>

    <template v-else>
      <ProductCard v-for="product in products" :key="product.slug" :product="product" />
    </template>
  </div>
</template>

<script setup lang="ts">
/** One full row of the desktop grid; the mobile track scrolls past the rest. */
const SKELETON_CARD_COUNT = 4

const { data: products, status } = await useProductCatalog()

// Placeholders rather than an empty rail: a locale switch clears the catalog for the
// length of the refetch, and a strip that collapses to nothing pulls the page up under
// whoever is reading it.
const isLoading = computed(() => status.value === 'pending')
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
  flex: 0 0 min(75vw, 18rem);
  scroll-snap-align: start;
}

@media (min-width: 640px) {
  .product-list :deep(.product-card) {
    flex-basis: 17rem;
  }
}

@media (min-width: 900px) {
  .product-list {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    overflow: visible;
    padding-block: 0.75rem;
  }

  .product-list :deep(.product-card) {
    flex-basis: auto;
  }
}
</style>
