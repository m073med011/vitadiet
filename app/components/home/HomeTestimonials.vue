<template>
  <section id="science" class="section-muted section-loose section-flower">
    <div class="content-wrap">
      <div class="cert-coverage-grid">
        <article class="cert-panel">
          <p class="text-caption font-bold tracking-label uppercase text-brand-accent mb-3">
            {{ $t('homePage.certificates.heading') }}
          </p>
          <h2 class="section-heading-display mb-4">{{ $t('homePage.certificates.description') }}</h2>
          <div class="cert-list">
            <div v-for="item in certificateKeys" :key="item">
              <ShieldCheckIcon />
              <span>{{ $t(item) }}</span>
            </div>
          </div>
        </article>

        <article class="coverage-panel">
          <h2 class="section-heading mb-4">{{ $t('homePage.coverage.heading') }}</h2>
          <p class="section-copy mb-8">{{ $t('homePage.coverage.description') }}</p>
          <div class="coverage-map">
            <span v-for="region in coverageRegions" :key="region">{{ $t(region) }}</span>
          </div>
        </article>
      </div>

      <div class="audience-grid">
        <article class="audience-panel">
          <h3>{{ $t('homePage.local.heading') }}</h3>
          <p>{{ $t('homePage.local.description') }}</p>
          <ul class="soft-check-list">
            <li v-for="point in localPointKeys" :key="point">
              <CheckCircle2Icon />
              <span>{{ $t(point) }}</span>
            </li>
          </ul>
        </article>

        <article class="audience-panel audience-panel-dark">
          <h3>{{ $t('homePage.global.heading') }}</h3>
          <p>{{ $t('homePage.global.description') }}</p>
          <ul class="soft-check-list">
            <li v-for="point in globalPointKeys" :key="point">
              <CheckCircle2Icon />
              <span>{{ $t(point) }}</span>
            </li>
          </ul>
        </article>
      </div>

      <article class="partners-panel">
        <div>
          <h3 class="section-heading-display mb-4">{{ $t('homePage.partners.heading') }}</h3>
          <p class="section-copy">{{ $t('homePage.partners.description') }}</p>
        </div>
        <div class="partner-type-grid">
          <span v-for="partner in partnerTypes" :key="partner">{{ $t(partner) }}</span>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { CheckCircle2Icon, ShieldCheckIcon } from 'lucide-vue-next'
import {
  certificateKeys,
  coverageRegions,
  globalPointKeys,
  localPointKeys,
  partnerTypes,
} from '~/data/home'
</script>
