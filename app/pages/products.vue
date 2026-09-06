<template>
  <div class="min-h-screen bg-surface pt-section-sm pb-section">
    <div class="content-container">
      <header class="mx-auto max-w-copy text-center" data-aos="fade-up">
        <p class="eyebrow-pill mx-auto mb-page">
          {{ $t('productPage.eyebrow') }}
        </p>
        <h1 class="text-heading-lg font-bold leading-heading text-ink">
          {{ $t('productPage.heading') }}
        </h1>
        <p class="mt-page text-copy-lg leading-copy text-ink-soft">
          {{ $t('productPage.description') }}
        </p>
      </header>

      <section class="mt-gutter-lg" :aria-label="$t('productPage.search.label')">
        <div class="mx-auto grid max-w-3xl gap-page">
          <label class="sr-only" for="product-search">
            {{ $t('productPage.search.label') }}
          </label>
          <!-- The clear button's track is sized even while the button is absent, so the
               field does not jump sideways on the first keystroke. -->
          <div
            class="grid min-h-14 grid-cols-[auto_minmax(0,1fr)_2.75rem] items-center gap-page rounded-card border border-line bg-surface-raised px-page shadow-card"
          >
            <SearchIcon class="h-icon-md w-icon-md text-ink-soft" aria-hidden="true" />
            <input
              id="product-search"
              ref="searchInput"
              v-model="searchQuery"
              type="search"
              class="product-search__input min-w-0 appearance-none bg-transparent py-control-y text-copy text-ink outline-none placeholder:text-ink-subtle"
              :placeholder="$t('productPage.search.placeholder')"
            />
            <BaseButton
              v-if="searchQuery"
              native-type="button"
              variant="icon"
              class="h-11 w-11 shrink-0 text-ink-soft"
              :aria-label="$t('productPage.search.clear')"
              @click="clearSearch"
            >
              <XIcon class="h-icon-sm w-icon-sm" aria-hidden="true" />
            </BaseButton>
          </div>
          <!-- The one place the wait is announced. The placeholder grid below is
               `aria-hidden`, so without this a screen reader would hear the count drop to
               zero and nothing else. -->
          <p class="text-center text-small font-semibold text-ink-soft" aria-live="polite">
            {{
              isLoading
                ? $t('productPage.search.loading')
                : $t('productPage.search.results', { count: filteredProducts.length })
            }}
          </p>
        </div>
      </section>

      <section class="mt-gutter-lg" :aria-label="$t('products')">
        <!-- The same grid the cards use, so the placeholders give way to real cards in
             place instead of reflowing the page under the reader. -->
        <ul
          v-if="isLoading"
          class="grid grid-cols-1 gap-gutter sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          aria-hidden="true"
        >
          <li v-for="index in SKELETON_CARD_COUNT" :key="index">
            <ProductCardSkeleton />
          </li>
        </ul>

        <div
          v-else-if="catalogError"
          class="rounded-card border border-line bg-surface-raised px-page py-card text-center"
          role="alert"
        >
          <AlertCircleIcon class="mx-auto mb-page h-icon-xl w-icon-xl text-brand-primary" />
          <h2 class="text-title font-bold text-ink">{{ $t('productPage.search.errorTitle') }}</h2>
          <p class="mt-control-y text-copy leading-copy text-ink-soft">
            {{ $t('productPage.search.errorDescription') }}
          </p>
        </div>

        <div
          v-else-if="filteredProducts.length === 0"
          class="rounded-card border border-line bg-surface-raised px-page py-card text-center"
        >
          <SearchXIcon class="mx-auto mb-page h-icon-xl w-icon-xl text-brand-primary" />
          <h2 class="text-title font-bold text-ink">{{ $t('productPage.search.emptyTitle') }}</h2>
          <p class="mt-control-y text-copy leading-copy text-ink-soft">
            {{ $t('productPage.search.emptyDescription') }}
          </p>
        </div>

        <ul v-else class="grid grid-cols-1 gap-gutter sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <li v-for="product in filteredProducts" :key="product.slug" data-aos="fade-up">
            <ProductCard :product="product" />
          </li>
        </ul>
      </section>
    </div>

    <PartnerCta class="mt-section" />
  </div>
</template>

<script setup lang="ts">
import { AlertCircleIcon, SearchIcon, SearchXIcon, XIcon } from 'lucide-vue-next'
import { getProductTitle, productMatchesSearch } from '~/services/product-catalog'

const { locale, t } = useI18n()
const { productPath } = useProductPath()
const { absoluteSiteUrl } = useSiteUrls()

/**
 * Placeholder cards rendered while the catalog is in flight - roughly two rows on a
 * desktop grid. It only has to cover the wait, so it is a fixed count rather than the
 * previous response's length: on a locale switch that length is the count for a catalog
 * that is about to be replaced.
 */
const SKELETON_CARD_COUNT = 8

const searchQuery = ref('')
const searchInput = ref<HTMLInputElement | null>(null)

// Resolved during SSR, so the grid is in the prerendered markup; the loading and error
// branches below cover a client-side refetch and an unreachable Dashboard.
const { data: products, error: catalogError, status } = await useProductCatalog()

const isLoading = computed(() => status.value === 'pending')

const filteredProducts = computed(() =>
  products.value.filter((product) =>
    productMatchesSearch(product, searchQuery.value, locale.value),
  ),
)

const clearSearch = async () => {
  searchQuery.value = ''
  await nextTick()
  searchInput.value?.focus()
}

useSchemaOrg([
  defineItemList({
    itemListElement: () =>
      products.value.map((product, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: getProductTitle(product, locale.value),
        url: absoluteSiteUrl(productPath(product.slug)),
      })),
  }),
])

usePageSeo({
  title: () => t('productPage.heading'),
  description: () => t('productPage.description'),
})
</script>

<style scoped>
.product-search__input::-webkit-search-cancel-button,
.product-search__input::-webkit-search-decoration,
.product-search__input::-webkit-search-results-button,
.product-search__input::-webkit-search-results-decoration {
  display: none;
}
</style>
