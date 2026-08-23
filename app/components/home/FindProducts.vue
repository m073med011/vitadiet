<template>
  <section id="where-to-buy" class="w-full bg-surface py-section md:py-section-lg">
    <div class="content-container">
      <BaseSectionHeader
        :heading="$t('findProductsSection.heading')"
        :description="$t('findProductsSection.description')"
      />

      <div class="grid gap-gutter lg:grid-cols-[1fr_0.8fr]">
        <div class="rounded-card border border-line bg-surface-raised p-card shadow-card">
          <h3 class="mb-page text-title font-bold text-ink">
            {{ $t('findProductsSection.availableHeading') }}
          </h3>
          <div class="grid gap-page sm:grid-cols-2">
            <a
              v-for="product in availableProducts"
              :key="product.slug"
              :href="product.buyLink"
              target="_blank"
              rel="noopener noreferrer nofollow sponsored"
              class="flex min-h-16 items-center justify-between gap-page rounded-card border border-line bg-surface px-page py-page text-ink transition-colors hover:border-brand-primary hover:text-brand-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent"
            >
              <span class="text-small font-bold leading-tight">{{ $t(product.titleKey) }}</span>
              <ExternalLinkIcon class="h-icon-sm w-icon-sm shrink-0" aria-hidden="true" />
            </a>
          </div>
        </div>

        <div class="rounded-card border border-line bg-surface p-card shadow-card">
          <h3 class="mb-page text-title font-bold text-ink">
            {{ $t('findProductsSection.soonHeading') }}
          </h3>
          <ul class="grid gap-control-y">
            <li
              v-for="product in comingSoonProducts"
              :key="product.slug"
              class="rounded-card border border-line bg-surface-raised px-page py-page text-small font-semibold text-ink-soft"
            >
              {{ $t(product.titleKey) }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ExternalLinkIcon } from 'lucide-vue-next'
import { products } from '~/data/products'

const availableProducts = computed(() => products.filter((product) => product.buyLink))
const comingSoonProducts = computed(() => products.filter((product) => !product.buyLink))
</script>
