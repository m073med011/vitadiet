<template>
  <section id="featured-products" class="section-block">
    <div class="content-container">
      <BaseSectionHeader
        :heading="$t('featuredProducts.heading')"
        :description="$t('featuredProducts.description')"
      />

      <div class="grid gap-gutter lg:grid-cols-[1.1fr_0.9fr]">
        <article v-if="mainProduct && mainImage" class="featured-card featured-card--main">
          <div class="featured-image featured-image--main">
            <BaseImage
              :src="mainImage.src"
              :alt="getProductImageAlt(mainImage, locale)"
              :width="mainImage.width"
              :height="mainImage.height"
              fill
              class="object-contain"
            />
          </div>

          <div class="flex flex-1 flex-col gap-page p-card">
            <div>
              <h3 class="panel-heading">
                {{ getProductTitle(mainProduct, locale) }}
              </h3>
              <p class="mt-control-y text-copy-lg leading-copy text-ink-soft">
                {{ $t(mainProduct.introKey) }}
              </p>
            </div>
            <p
              class="rounded-card border border-line bg-surface-raised px-page py-page text-copy font-semibold leading-copy text-ink"
            >
              {{ $t(mainProduct.benefitKey) }}
            </p>
            <div class="featured-actions mt-auto grid gap-page sm:grid-cols-2">
              <BaseButton :to="productPath(mainProduct.slug)" variant="secondary">
                <InfoIcon class="h-icon-sm w-icon-sm" aria-hidden="true" />
                {{ $t('featuredProducts.learnMore') }}
                <span class="sr-only"> - {{ getProductTitle(mainProduct, locale) }}</span>
              </BaseButton>
              <BaseButton
                v-if="hasBuyablePurchaseOptions(mainProduct)"
                :to="`${productPath(mainProduct.slug)}#where-to-buy`"
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
            v-for="{ product, image } in secondaryCards"
            :key="product.slug"
            class="featured-card featured-card--secondary"
          >
            <div class="featured-image">
              <BaseImage
                :src="image.src"
                :alt="getProductImageAlt(image, locale)"
                :width="image.width"
                :height="image.height"
                fill
                class="object-contain"
              />
            </div>
            <div class="flex flex-1 flex-col gap-control-y p-page">
              <h3 class="text-title font-bold leading-heading text-ink">
                {{ getProductTitle(product, locale) }}
              </h3>
              <p class="text-copy leading-copy text-ink-soft">
                {{ $t(product.introKey) }}
              </p>
              <p class="text-small font-semibold leading-copy text-brand-accent">
                {{ $t(product.benefitKey) }}
              </p>
              <div class="featured-actions mt-auto grid gap-control-y sm:grid-cols-2">
                <BaseButton :to="productPath(product.slug)" variant="secondary">
                  {{ $t('featuredProducts.learnMore') }}
                  <span class="sr-only"> - {{ getProductTitle(product, locale) }}</span>
                </BaseButton>
                <BaseButton
                  v-if="hasBuyablePurchaseOptions(product)"
                  :to="`${productPath(product.slug)}#where-to-buy`"
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
import type { HomeProduct } from '~/types'
import type { ProductSlug } from '#shared/products'
import {
  getProductImageAlt,
  getProductTitle,
  getPrimaryImage,
  hasBuyablePurchaseOptions,
} from '~/services/product-catalog'

const { locale } = useI18n()
const { productPath } = useProductPath()

type FeaturedProduct = HomeProduct & {
  benefitKey: string
  introKey: string
}

type FeaturedItem = {
  benefitKey: string
  introKey: string
  slug: ProductSlug
}

const featuredItems: FeaturedItem[] = [
  {
    slug: 'becalme',
    introKey: 'featuredProducts.items.becalme.intro',
    benefitKey: 'featuredProducts.items.becalme.benefit',
  },
  {
    slug: 'femavit',
    introKey: 'featuredProducts.items.femavit.intro',
    benefitKey: 'featuredProducts.items.femavit.benefit',
  },
  {
    slug: 'vitagen',
    introKey: 'featuredProducts.items.vitagen.intro',
    benefitKey: 'featuredProducts.items.vitagen.benefit',
  },
]

const { data: catalog } = await useProductCatalog()

const featuredProducts = computed<FeaturedProduct[]>(() =>
  featuredItems.flatMap((item) => {
    const product = catalog.value.find((candidate) => candidate.slug === item.slug)
    if (!product) return []
    return [{ ...product, benefitKey: item.benefitKey, introKey: item.introKey }]
  }),
)

const mainProduct = computed<FeaturedProduct | undefined>(() => featuredProducts.value[0])
const mainImage = computed(() =>
  mainProduct.value ? getPrimaryImage(mainProduct.value) : undefined,
)
const secondaryCards = computed(() =>
  featuredProducts.value.slice(1).map((product) => ({ image: getPrimaryImage(product), product })),
)
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
