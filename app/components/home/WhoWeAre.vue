<template>
  <section class="py-16 md:py-24 lg:py-32 bg-surface dark:bg-dark-surface overflow-hidden" id="who-we-are">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
      
      <div class="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-8">
        
        <!-- Left Content -->
        <div class="w-full lg:w-5/12 space-y-8" data-aos="fade-right">
          <h2 class="text-5xl md:text-6xl lg:text-7xl font-medium text-brand-accent dark:text-dark-ink tracking-tight">
            {{ $t('appName') }}
          </h2>
          <p class="text-ink-soft dark:text-dark-ink-soft text-base md:text-lg lg:text-xl leading-relaxed whitespace-pre-line">
            {{ $t('homePage.whoWeAre.description') }}
          </p>
          <div class="pt-2">
            <NuxtLink to="#who-we-are" class="inline-flex items-center text-xl md:text-2xl font-medium text-brand-accent dark:text-dark-ink group hover:text-brand-primary dark:hover:text-brand-primary transition-colors">
              {{ $t('appName') }}
              <svg class="w-6 h-6 ms-3 rtl:rotate-180 transform transition-transform group-hover:translate-x-2 rtl:group-hover:-translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
              </svg>
            </NuxtLink>
          </div>
        </div>

        <!-- Right Diagram -->
        <div class="w-full lg:w-6/12 relative flex justify-center items-center py-12 lg:py-0" data-aos="fade-left" data-aos-delay="200">
          
          <!-- Orbit Container -->
          <div class="relative w-[85%] sm:w-[75%] lg:w-[70%] max-w-[480px] aspect-square mx-auto">
            <!-- Dashed Orbit -->
            <div class="absolute inset-0 rounded-full border border-dashed border-line dark:border-dark-line"></div>

            <!-- Center Circle -->
            <div class="absolute inset-0 m-auto w-[52%] h-[52%] rounded-full bg-brand-accent dark:bg-dark-ink flex flex-col items-center justify-center text-surface dark:text-ink shadow-shell dark:shadow-shell-dark z-10 p-4 lg:p-6 text-center transition-transform hover:scale-105 duration-500">
              <span class="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-wide mb-2 sm:mb-3">{{ $t('appName') }}</span>
              <span class="text-[9px] sm:text-[10px] lg:text-xs opacity-90 uppercase tracking-widest font-semibold px-2 leading-relaxed">
                {{ $t('homePage.whoWeAre.heading') }}
              </span>
            </div>

            <!-- Outer Circles -->
            <div 
              v-for="feature in featuresData" 
              :key="feature.key"
              class="absolute top-1/2 left-1/2 w-full h-0 pointer-events-none"
              :style="{
                transform: `translate(-50%, -50%) rotate(${feature.angle}deg)`
              }"
            >
              <div 
                class="absolute top-1/2 right-0 w-[36%] sm:w-[32%] lg:w-[30%] aspect-square rounded-full bg-surface-raised dark:bg-dark-surface-muted border border-brand-accent dark:border-brand-accent shadow-float dark:shadow-dark-soft flex flex-col items-center justify-center p-2 sm:p-3 lg:p-4 transition-all duration-500 hover:scale-110 hover:border-brand-primary dark:hover:border-brand-primary pointer-events-auto z-20 group"
                :style="{
                  transform: `translate(50%, -50%) rotate(${-feature.angle}deg)`
                }"
              >
                <span class="text-center text-[10px] sm:text-[11px] lg:text-sm font-semibold text-brand-accent dark:text-dark-ink leading-tight group-hover:text-brand-primary dark:group-hover:text-brand-primary transition-colors w-full break-words">
                  {{ $t(`homePage.whoWeAre.petals.${feature.key}`) }}
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>

      <!-- Footer Text -->
      <div class="mt-20 text-center max-w-4xl mx-auto" data-aos="fade-up" data-aos-delay="400">
        <p class="text-ink-subtle dark:text-dark-ink-subtle text-sm md:text-base font-medium leading-relaxed whitespace-pre-line">
          {{ $t('homePage.whoWeAre.footerText') }}
        </p>
      </div>

    </div>
  </section>
</template>

<script setup lang="ts">
// Angles mapping for the orbital layout (evenly spaced)
const featuresData = [
  { key: 'science', angle: -90 }, // Top
  { key: 'sfda', angle: -30 }, // Top Right
  { key: 'distribution', angle: 30 }, // Bottom Right
  { key: 'quality', angle: 90 }, // Bottom
  { key: 'safety', angle: 150 }, // Bottom Left
  { key: 'transparency', angle: -150 }, // Top Left
];
</script>
