<template>
  <section id="science" class="section-muted section-loose section-flower">
    <div class="content-wrap">
      <div class="cert-coverage-grid">
        <article class="cert-panel" data-aos="fade-right">
          <p class="text-caption font-bold tracking-label uppercase text-brand-accent mb-3">
            {{ $t('homePage.certificates.heading') }}
          </p>
          <h2 class="section-heading-display mb-4">{{ $t('homePage.certificates.description') }}</h2>
          <div class="cert-list">
            <div
              v-for="(item, index) in certificateKeys"
              :key="item"
              data-aos="fade-up"
              :data-aos-delay="index * 100"
            >
              <ShieldCheckIcon />
              <span>{{ $t(item) }}</span>
            </div>
          </div>
        </article>

        <article class="coverage-panel" data-aos="fade-left" data-aos-delay="150">
          <h2 class="section-heading mb-4">{{ $t('homePage.coverage.heading') }}</h2>
          <p class="section-copy mb-8">{{ $t('homePage.coverage.description') }}</p>
          <div class="coverage-map">
            <span
              v-for="(region, index) in coverageRegions"
              :key="region"
              data-aos="fade-up"
              :data-aos-delay="index * 100"
            >
              {{ $t(region) }}
            </span>
          </div>
        </article>
      </div>

      <div class="audience-grid">
        <article class="audience-panel" data-aos="fade-up">
          <h3>{{ $t('homePage.local.heading') }}</h3>
          <p>{{ $t('homePage.local.description') }}</p>
          <ul class="soft-check-list">
            <li
              v-for="(point, index) in localPointKeys"
              :key="point"
              data-aos="fade-up"
              :data-aos-delay="index * 100"
            >
              <CheckCircle2Icon />
              <span>{{ $t(point) }}</span>
            </li>
          </ul>
        </article>

        <article class="audience-panel audience-panel-dark" data-aos="fade-up" data-aos-delay="150">
          <h3>{{ $t('homePage.global.heading') }}</h3>
          <p>{{ $t('homePage.global.description') }}</p>
          <ul class="soft-check-list">
            <li
              v-for="(point, index) in globalPointKeys"
              :key="point"
              data-aos="fade-up"
              :data-aos-delay="index * 100"
            >
              <CheckCircle2Icon />
              <span>{{ $t(point) }}</span>
            </li>
          </ul>
        </article>
      </div>

      <article class="partners-panel" data-aos="fade-up">
        <div>
          <h3 class="section-heading-display mb-4">{{ $t('homePage.partners.heading') }}</h3>
          <p class="section-copy">{{ $t('homePage.partners.description') }}</p>
        </div>
        <div class="partner-type-grid">
          <span
            v-for="(partner, index) in partnerTypes"
            :key="partner"
            data-aos="fade-up"
            :data-aos-delay="index * 100"
          >
            {{ $t(partner) }}
          </span>
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
