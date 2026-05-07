<template>
  <section class="hero-section-vitadiet">
    <div class="lotus-backdrop" aria-hidden="true"></div>

    <div class="hero-gallery">
      <div
        v-for="(img, index) in heroImages"
        :key="index"
        class="hero-gallery-card"
        :class="img.class"
        data-aos="zoom-in"
        data-aos-duration="700"
        :data-aos-delay="index * 100"
      >
        <BaseImage :src="img.src" alt="Certified supplement portfolio for B2B distribution" fill />
      </div>
    </div>

    <div class="hero-copy-vitadiet">
      <span class="hero-kicker" data-aos="fade-up" data-aos-delay="150">
        {{ $t('homePage.hero.badge') }}
      </span>

      <h1 class="hero-title-vitadiet" data-aos="fade-up" data-aos-delay="200">
        {{ $t('homePage.hero.heading') }}
      </h1>

      <p class="hero-lead-vitadiet" data-aos="fade-up" data-aos-delay="300">
        {{ $t('homePage.hero.subheading') }}
      </p>

      <div class="hero-actions-vitadiet" data-aos="fade-up" data-aos-delay="350">
        <BaseButton href="mailto:partners@Vitadiet.sa" variant="primary">
          {{ $t('homePage.hero.primary') }}
        </BaseButton>
        <BaseButton :to="sectionPath('#about')" variant="secondary">
          {{ $t('homePage.hero.secondary') }}
        </BaseButton>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { heroImages } from '~/data/home'

const localePath = useLocalePath()
const sectionPath = (hash: string) => `${localePath('/')}${hash}`
</script>
