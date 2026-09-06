<template>
  <section id="where-to-buy" class="section-block">
    <div class="content-container">
      <BaseSectionHeader
        :heading="$t('findProductsSection.heading')"
        :description="$t('findProductsSection.description')"
      />

      <div v-if="isLoading" class="grid gap-gutter lg:grid-cols-[1fr_0.8fr]">
        <p class="sr-only" aria-live="polite">{{ $t('productPage.search.loading') }}</p>

        <!-- Both panels stand in, and each row keeps the real row's 4rem minimum height,
             so the section holds its size across the wait. -->
        <div
          v-for="panel in SKELETON_PANELS"
          :key="panel.rows"
          :class="['panel-card', panel.raised && 'bg-surface-raised']"
          aria-hidden="true"
        >
          <div class="skeleton-line mb-page h-5 w-1/2" />
          <div :class="['grid gap-page', panel.columns]">
            <div
              v-for="row in panel.rows"
              :key="row"
              class="flex min-h-16 items-center gap-page rounded-card border border-line bg-surface px-page py-page"
            >
              <div class="skeleton-block h-action w-action shrink-0" />
              <div class="skeleton-line w-2/3" />
            </div>
          </div>
        </div>
      </div>

      <div v-else class="grid gap-gutter lg:grid-cols-[1fr_0.8fr]">
        <!-- Each panel is a claim about a set of products, so an empty one is withheld
             rather than rendered as a heading with nothing under it. -->
        <div v-if="availableProducts.length" class="panel-card bg-surface-raised">
          <h3 class="mb-page text-title font-bold text-ink">
            {{ $t('findProductsSection.availableHeading') }}
          </h3>
          <div class="grid gap-page sm:grid-cols-2">
            <a
              v-for="product in availableProducts"
              :key="product.slug"
              :href="`${productPath(product.slug)}#where-to-buy`"
              class="focus-ring flex min-h-16 items-center gap-page rounded-card border border-line bg-surface px-page py-page text-ink transition-colors hover:border-brand-primary hover:text-brand-primary"
            >
              <span
                class="relative h-action w-action shrink-0 overflow-hidden rounded-card bg-surface-raised"
              >
                <BaseImage
                  :src="getPrimaryImage(product).src"
                  alt=""
                  :width="getPrimaryImage(product).width"
                  :height="getPrimaryImage(product).height"
                  sizes="48px"
                  fill
                  fit="contain"
                  aria-hidden="true"
                />
              </span>
              <span class="text-small font-bold leading-tight">{{
                getProductTitle(product, locale)
              }}</span>
            </a>
          </div>
        </div>

        <div v-if="comingSoonProducts.length" class="panel-card">
          <h3 class="mb-page text-title font-bold text-ink">
            {{ $t('findProductsSection.soonHeading') }}
          </h3>
          <ul class="grid gap-control-y">
            <li
              v-for="product in comingSoonProducts"
              :key="product.slug"
              class="flex items-center gap-page rounded-card border border-line bg-surface-raised px-page py-page text-small font-semibold text-ink-soft"
            >
              <!-- Greyed to match the not-yet-buyable treatment used on the product cards. -->
              <span class="relative h-action w-action shrink-0 overflow-hidden rounded-card">
                <BaseImage
                  :src="getPrimaryImage(product).src"
                  alt=""
                  :width="getPrimaryImage(product).width"
                  :height="getPrimaryImage(product).height"
                  sizes="48px"
                  fill
                  fit="contain"
                  class="grayscale"
                  aria-hidden="true"
                />
              </span>
              <span class="min-w-0">{{ getProductTitle(product, locale) }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { getPrimaryImage, getProductTitle, isProductAvailable } from '~/services/product-catalog'

const { locale } = useI18n()
const { productPath } = useProductPath()

/**
 * The shape of the two panels while the catalog is in flight: the "available" grid is two
 * columns from `sm` up, the "coming soon" list is one. The row counts are a plausible
 * split rather than the previous response's - on a locale switch that split describes a
 * catalog that is about to be replaced.
 */
const SKELETON_PANELS = [
  { columns: 'sm:grid-cols-2', raised: true, rows: 4 },
  { columns: '', raised: false, rows: 3 },
]

const { data: catalog, status } = await useProductCatalog()

// Both panels are withheld when their list is empty, and a locale switch empties the
// catalog for the length of the refetch - so without placeholders the whole section
// vanishes and the page below it jumps up. See `dropStaleLocaleData()`.
const isLoading = computed(() => status.value === 'pending')

// Split on the availability the Dashboard states, not on whether a purchase platform can
// be linked to: the list endpoint sends no purchase links, so that reading would file
// every product under "coming soon".
const availableProducts = computed(() => catalog.value.filter(isProductAvailable))
const comingSoonProducts = computed(() =>
  catalog.value.filter((product) => !isProductAvailable(product)),
)
</script>
