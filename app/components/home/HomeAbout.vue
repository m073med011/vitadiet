<template>
  <section id="about" class="section-muted section-flower relative overflow-hidden">
    <div class="content-wrap">
      <div class="about-vitadiet-grid">
        <div class="about-copy-panel" data-aos="fade-right">
          <span class="lotus-mark small" aria-hidden="true"></span>
          <h2 class="section-heading mb-6">{{ $t('homePage.about.heading') }}</h2>
          <p class="section-copy mb-6">{{ $t('homePage.about.description') }}</p>
          <p class="responsibility-note">{{ $t('homePage.about.responsibility') }}</p>
          <BaseButton href="mailto:partners@Vitadiet.sa" variant="primary" class="mt-8">
            {{ $t('homePage.about.cta') }}
          </BaseButton>
        </div>

        <div class="about-media-stack">
          <div class="media-panel aspect-media-wide overflow-hidden group" data-aos="fade-left" data-aos-delay="150">
            <BaseImage
              src="https://images.unsplash.com/photo-1596177583101-26b7dada4f5c?q=80&w=1400&auto=format&fit=crop"
              alt="Professional supplement distribution"
              fill
              hover-zoom="strong"
            />
          </div>
          <div class="vision-card" data-aos="fade-left" data-aos-delay="200">
            <h3>{{ $t('homePage.vision.visionTitle') }}</h3>
            <p>{{ $t('homePage.vision.visionText') }}</p>
          </div>
          <div class="vision-card" data-aos="fade-left" data-aos-delay="300">
            <h3>{{ $t('homePage.vision.missionTitle') }}</h3>
            <p>{{ $t('homePage.vision.missionText') }}</p>
          </div>
        </div>
      </div>

      <div class="values-strip" data-aos="fade-up">
        <h3>{{ $t('homePage.values.heading') }}</h3>
        <div>
          <span
            v-for="(value, index) in valueKeys"
            :key="value"
            data-aos="fade-up"
            :data-aos-delay="index * 100"
          >
            {{ $t(value) }}
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { valueKeys } from '~/data/home'
</script>
