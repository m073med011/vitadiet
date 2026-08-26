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
          <div
            class="grid min-h-14 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-page rounded-card border border-line bg-surface-raised px-page shadow-card"
          >
            <SearchIcon class="h-icon-md w-icon-md text-ink-soft" aria-hidden="true" />
            <input
              id="product-search"
              v-model="searchQuery"
              type="search"
              class="min-w-0 bg-transparent py-control-y text-copy text-ink outline-none placeholder:text-ink-subtle"
              :placeholder="$t('productPage.search.placeholder')"
            >
            <BaseButton
              v-if="searchQuery"
              native-type="button"
              variant="icon"
              :aria-label="$t('productPage.search.clear')"
              @click="clearSearch"
            >
              <XIcon class="h-icon-sm w-icon-sm" aria-hidden="true" />
            </BaseButton>
          </div>
          <p class="text-center text-small font-semibold text-ink-soft" aria-live="polite">
            {{ $t('productPage.search.results', { count: filteredProducts.length }) }}
          </p>
        </div>
      </section>

      <section class="mt-gutter-lg" :aria-label="$t('products')">
        <div
          v-if="isLoading"
          class="rounded-card border border-line bg-surface-raised px-page py-card text-center text-ink-soft"
        >
          {{ $t('productPage.search.loading') }}
        </div>

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
            <ProductCard
              :product="product"
              purchase-mode="modal"
              @show-purchase="openPurchaseModal"
            />
          </li>
        </ul>
      </section>
    </div>

    <section class="mt-section border-y border-line bg-surface-raised py-section-sm">
      <div
        class="content-container grid gap-page md:grid-cols-[minmax(0,1fr)_auto] md:items-center"
      >
        <div>
          <p class="eyebrow-text">{{ $t('partnerSection.eyebrow') }}</p>
          <h2 class="mt-1 text-heading font-bold leading-heading text-ink">
            {{ $t('partnerSection.heading') }}
          </h2>
          <p class="mt-page max-w-copy text-copy leading-copy text-ink-soft">
            {{ $t('partnerSection.description') }}
          </p>
        </div>
        <BaseButton :href="`mailto:${CONTACT.email}`" variant="primary">
          <MailIcon class="h-icon-sm w-icon-sm" aria-hidden="true" />
          {{ $t('partnerSection.cta') }}
        </BaseButton>
      </div>
    </section>

    <ProductPurchaseModal
      :open="Boolean(selectedProduct)"
      :product="selectedProduct"
      @close="selectedProduct = undefined"
    />
  </div>
</template>

<script setup lang="ts">
import { AlertCircleIcon, MailIcon, SearchIcon, SearchXIcon, XIcon } from 'lucide-vue-next'
import { CONTACT } from '#shared/brand'
import { products } from '~/data/products'
import type { HomeProduct } from '~/types'
import { getProductTitle, productMatchesSearch } from '~/services/product-catalog'

const { locale, t } = useI18n()
const { productPath } = useProductPath()
const { absoluteSiteUrl } = useSiteUrls()

const searchQuery = ref('')
const isLoading = ref(false)
const catalogError = ref<string | undefined>()
const selectedProduct = ref<HomeProduct | undefined>()

const filteredProducts = computed(() =>
  products.filter((product) => productMatchesSearch(product, searchQuery.value, locale.value)),
)

const clearSearch = () => {
  searchQuery.value = ''
}

const openPurchaseModal = (product: HomeProduct) => {
  selectedProduct.value = product
}

useSchemaOrg([
  defineItemList({
    itemListElement: products.map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: () => getProductTitle(product, locale.value),
      url: () => absoluteSiteUrl(productPath(product.slug)),
    })),
  }),
])

usePageSeo({
  title: () => t('productPage.heading'),
  description: () => t('productPage.description'),
})
</script>
