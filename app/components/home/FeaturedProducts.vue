<template>
  <!-- Nothing to feature is a valid answer from the Dashboard, and a heading over an
       empty grid is not. The whole section stands down instead - but only once the read
       has settled, or a locale switch would tear the section out of the page and put it
       back a moment later. -->
  <section v-if="isLoading || cards.length" id="featured-products" class="section-block">
    <div class="content-container">
      <BaseSectionHeader
        :heading="$t('featuredProducts.heading')"
        :description="$t('featuredProducts.description')"
      />

      <p v-if="isLoading" class="sr-only" aria-live="polite">
        {{ $t('productPage.search.loading') }}
      </p>

      <!-- The placeholder grid mirrors the real one: one tall card beside a column of
           short ones, both built from the same `featured-card` box, so the strip holds
           its height while the two reads land. -->
      <div v-if="isLoading" class="grid gap-gutter lg:grid-cols-[1.1fr_0.9fr]" aria-hidden="true">
        <article class="featured-card featured-card--main">
          <div class="skeleton featured-image featured-image--main rounded-none" />
          <div class="flex flex-1 flex-col gap-page p-card">
            <div class="skeleton-line h-5 w-3/5" />
            <div class="grid gap-control-y-sm">
              <div class="skeleton-line w-full" />
              <div class="skeleton-line w-4/5" />
            </div>
            <div class="skeleton-block h-16 w-full" />
          </div>
        </article>

        <div class="grid gap-gutter sm:grid-cols-2 lg:grid-cols-1">
          <article
            v-for="index in SKELETON_SECONDARY_COUNT"
            :key="index"
            class="featured-card featured-card--secondary"
          >
            <div class="skeleton featured-image rounded-none" />
            <div class="flex flex-1 flex-col gap-control-y p-page">
              <div class="skeleton-line h-4 w-2/3" />
              <div class="skeleton-line w-full" />
              <div class="skeleton-line w-1/2" />
            </div>
          </article>
        </div>
      </div>

      <div v-else class="grid gap-gutter lg:grid-cols-[1.1fr_0.9fr]">
        <article v-if="mainCard" class="featured-card featured-card--main">
          <div class="featured-image featured-image--main">
            <BaseImage
              :src="mainCard.imageSrc"
              :alt="mainCard.imageAlt"
              fill
              class="object-contain"
            />
          </div>

          <div class="flex flex-1 flex-col gap-page p-card">
            <div>
              <h3 class="panel-heading">
                {{ mainCard.title }}
              </h3>
              <p class="mt-control-y text-copy-lg leading-copy text-ink-soft">
                {{ mainCard.intro }}
              </p>
            </div>
            <p
              class="rounded-card border border-line bg-surface-raised px-page py-page text-copy font-semibold leading-copy text-ink"
            >
              {{ mainCard.benefit }}
            </p>
            <div
              v-if="mainCard.product"
              class="featured-actions mt-auto grid gap-page sm:grid-cols-2"
            >
              <BaseButton :to="productPath(mainCard.product.slug)" variant="secondary">
                <InfoIcon class="h-icon-sm w-icon-sm" aria-hidden="true" />
                {{ $t('featuredProducts.learnMore') }}
                <span class="sr-only"> - {{ mainCard.title }}</span>
              </BaseButton>
              <BaseButton
                v-if="isProductAvailable(mainCard.product)"
                :to="`${productPath(mainCard.product.slug)}#where-to-buy`"
                variant="primary"
              >
                <ShoppingBagIcon class="h-icon-sm w-icon-sm" aria-hidden="true" />
                {{ $t('featuredProducts.whereBuy') }}
              </BaseButton>
            </div>
          </div>
        </article>

        <div class="grid gap-gutter sm:grid-cols-2 lg:grid-cols-1">
          <article
            v-for="card in secondaryCards"
            :key="card.id"
            class="featured-card featured-card--secondary"
          >
            <div class="featured-image">
              <BaseImage :src="card.imageSrc" :alt="card.imageAlt" fill class="object-contain" />
            </div>
            <div class="flex flex-1 flex-col gap-control-y p-page">
              <h3 class="text-title font-bold leading-heading text-ink">
                {{ card.title }}
              </h3>
              <p class="text-copy leading-copy text-ink-soft">
                {{ card.intro }}
              </p>
              <p class="text-small font-semibold leading-copy text-brand-accent">
                {{ card.benefit }}
              </p>
              <div
                v-if="card.product"
                class="featured-actions mt-auto grid gap-control-y sm:grid-cols-2"
              >
                <BaseButton :to="productPath(card.product.slug)" variant="secondary">
                  {{ $t('featuredProducts.learnMore') }}
                  <span class="sr-only"> - {{ card.title }}</span>
                </BaseButton>
                <BaseButton
                  v-if="isProductAvailable(card.product)"
                  :to="`${productPath(card.product.slug)}#where-to-buy`"
                  variant="primary"
                >
                  {{ $t('featuredProducts.whereBuy') }}
                </BaseButton>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { InfoIcon, ShoppingBagIcon } from 'lucide-vue-next'
import type { FeaturedProductView } from '~/services/product-api'
import { isProductAvailable } from '~/services/product-catalog'
import type { Product } from '~/types'

const { productPath } = useProductPath()

/**
 * Two independent reads, not one: the strip is its own Dashboard record (own title, own
 * two marketing lines, own image), and the catalog is only consulted to turn a card's
 * `slug` into a product page link and to answer whether that product is on sale.
 */
const { data: featured, status: featuredStatus } = await useFeaturedProducts()
const { data: catalog, status: catalogStatus } = await useProductCatalog()

/** The two short cards beside the tall one, matching the strip the Dashboard curates. */
const SKELETON_SECONDARY_COUNT = 2

// Either read still running means the cards cannot be assembled yet - the featured record
// supplies the copy, the catalog resolves its buttons.
const isLoading = computed(
  () => featuredStatus.value === 'pending' || catalogStatus.value === 'pending',
)

const productsBySlug = computed(
  () => new Map(catalog.value.map((product) => [product.slug, product])),
)

/**
 * A card whose `slug` matched, so its buttons can be rendered. The endpoint does not
 * send `slug` yet, so `product` is undefined on every card today and the cards render as
 * a display strip; nothing here needs to change when the field lands.
 */
type FeaturedCard = FeaturedProductView & { product?: Product }

// `?? []`: a pending or failed featured read is "nothing to feature", and the section
// below stands down rather than rendering its heading over a gap.
const cards = computed<FeaturedCard[]>(() =>
  (featured.value ?? []).map((card) => ({
    ...card,
    product: card.slug ? productsBySlug.value.get(card.slug) : undefined,
  })),
)

const mainCard = computed<FeaturedCard | undefined>(() => cards.value[0])
const secondaryCards = computed(() => cards.value.slice(1))
</script>

<style scoped>
.featured-card {
  display: flex;
  min-height: 100%;
  overflow: hidden;
  border: 1px solid var(--color-line);
  border-radius: var(--radius-card);
  background: var(--color-surface);
  box-shadow: var(--shadow-card);
}

.featured-card--main {
  flex-direction: column;
}

.featured-card--secondary {
  flex-direction: column;
}

.featured-image {
  position: relative;
  min-height: 13rem;
  background: color-mix(in oklab, var(--color-brand-primary) 7%, var(--color-surface-muted));
}

.featured-image--main {
  min-height: 20rem;
}

.featured-actions :deep(a),
.featured-actions :deep(button) {
  box-sizing: border-box;
  min-width: 0;
  width: 100%;
  text-align: center;
  white-space: normal;
}

@media (min-width: 768px) {
  .featured-card--main {
    min-height: 38rem;
  }

  .featured-image--main {
    min-height: 24rem;
  }
}

@media (min-width: 1024px) {
  .featured-card--secondary {
    flex-direction: row;
  }

  .featured-card--secondary .featured-image {
    width: 42%;
    min-height: 17rem;
  }
}
</style>
