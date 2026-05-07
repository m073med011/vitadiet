<template>
  <section id="why" class="section-solid section-flower">
    <div class="content-wrap">
      <div class="text-center copy-wrap mb-16" data-aos="fade-up">
        <h2 class="section-heading mb-6">{{ $t('homePage.why.heading') }}</h2>
        <p class="section-copy">{{ $t('homePage.why.description') }}</p>
      </div>

      <div class="petal-grid">
        <article
          v-for="(petal, index) in whyPetals"
          :key="petal.titleKey"
          class="petal-card"
          data-aos="fade-up"
          :data-aos-delay="index * 100"
        >
          <span class="petal-index">{{ String(index + 1).padStart(2, '0') }}</span>
          <component :is="iconMap[petal.icon]" class="petal-icon" />
          <h3 class="petal-title">{{ $t(petal.titleKey) }}</h3>
          <p class="petal-copy">{{ $t(petal.descriptionKey) }}</p>
        </article>
      </div>

      <div class="story-route-grid">
        <article class="story-panel" data-aos="fade-right">
          <span class="lotus-mark small" aria-hidden="true"></span>
          <h3 class="section-heading-display mb-4">{{ $t('homePage.nameStory.heading') }}</h3>
          <p class="section-copy">{{ $t('homePage.nameStory.description') }}</p>
        </article>

        <article class="route-panel" data-aos="fade-left" data-aos-delay="150">
          <h3 class="text-title font-bold text-ink dark:text-dark-ink mb-3">{{ $t('homePage.route.heading') }}</h3>
          <p class="text-ink-soft dark:text-dark-ink-soft mb-8">{{ $t('homePage.route.description') }}</p>
          <div class="route-steps">
            <div
              v-for="(step, index) in routeSteps"
              :key="step"
              class="route-step"
              data-aos="fade-up"
              :data-aos-delay="index * 100"
            >
              <span>{{ index + 1 }}</span>
              <p>{{ $t(step) }}</p>
            </div>
          </div>
        </article>
      </div>

      <article class="silent-lab-panel" data-aos="fade-up">
        <div>
          <p class="text-caption font-bold tracking-label uppercase text-brand-accent mb-3">
            {{ $t('blog') }}
          </p>
          <h3 class="section-heading-display mb-4">{{ $t('homePage.lab.heading') }}</h3>
          <p class="section-copy">{{ $t('homePage.lab.description') }}</p>
        </div>
        <BaseImage
          src="https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=1200&auto=format&fit=crop"
          alt="Laboratory review for supplement quality"
          fill
          class="silent-lab-image"
        />
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import {
  FileCheckIcon,
  HeartPulseIcon,
  MicroscopeIcon,
  ShieldCheckIcon,
  SparklesIcon,
  TruckIcon,
} from 'lucide-vue-next'
import { routeSteps, whyPetals } from '~/data/home'

const iconMap = {
  FileCheckIcon,
  HeartPulseIcon,
  MicroscopeIcon,
  ShieldCheckIcon,
  SparklesIcon,
  TruckIcon,
}
</script>
