<template>
  <section class="py-16 md:py-24 bg-white dark:bg-gray-950 overflow-hidden" id="who-we-are">
    <div class="container mx-auto px-4">
      
      <!-- Header -->
      <div class="text-center max-w-3xl mx-auto mb-16 md:mb-24" data-aos="fade-up">
        <h2 class="text-2xl md:text-4xl font-bold text-[#1e3a8a] dark:text-blue-400 mb-4 md:mb-6 leading-tight">
          {{ $t('homePage.whoWeAre.heading') }}
        </h2>
        <p class="text-base md:text-xl text-gray-600 dark:text-gray-300">
          {{ $t('homePage.whoWeAre.description') }}
        </p>
      </div>

      <!-- Flower Diagram -->
      <div class="relative w-full max-w-[320px] sm:max-w-[400px] md:max-w-[550px] lg:max-w-[650px] aspect-square mx-auto mb-16 md:mb-24" data-aos="zoom-in" data-aos-delay="200">
        
        <!-- Petals -->
        <div 
          v-for="petal in petalsData" 
          :key="petal.key"
          class="absolute top-1/2 left-1/2 w-[36%] h-[48%] origin-bottom transition-transform duration-500 hover:scale-105 group"
          :style="{
            marginLeft: '-18%',
            marginTop: '-48%',
            transform: `rotate(${petal.angle}deg)`
          }"
        >
          <!-- Petal Shape (SVG) -->
          <svg 
            class="w-full h-full text-[#eef4ff] dark:text-[#172a5a] stroke-[#c3d4f8] dark:stroke-[#2e4a8c] transition-colors duration-300 group-hover:text-[#e0ecff] dark:group-hover:text-[#1e3a8a]" 
            viewBox="0 0 100 200" 
            fill="currentColor" 
            preserveAspectRatio="none"
          >
            <path 
              d="M 50,200 C -20,100 -20,0 50,0 C 120,0 120,100 50,200 Z" 
              stroke-width="1.5" 
              vector-effect="non-scaling-stroke"
            />
          </svg>

          <!-- Text inside petal -->
          <div 
            class="absolute w-[140%] left-1/2 flex items-center justify-center pointer-events-none"
            :style="{
              top: '40%',
              transform: `translate(-50%, -50%) rotate(${-petal.angle}deg)`
            }"
          >
            <span class="text-center text-[11px] sm:text-[13px] md:text-base font-bold text-[#1e3a8a] dark:text-blue-100 leading-snug whitespace-pre-line px-1">
              {{ $t(`homePage.whoWeAre.petals.${petal.key}`) }}
            </span>
          </div>
        </div>

        <!-- Center Dot -->
        <div class="absolute top-1/2 left-1/2 w-4 h-4 md:w-6 md:h-6 -mt-2 -ml-2 md:-mt-3 md:-ml-3 bg-[#1e3a8a] dark:bg-blue-300 rounded-full z-10 shadow-lg ring-4 ring-white dark:ring-gray-950"></div>
      </div>

      <!-- Footer Text -->
      <div class="text-center max-w-4xl mx-auto" data-aos="fade-up" data-aos-delay="400">
        <p class="text-gray-700 dark:text-gray-300 text-sm md:text-lg font-medium leading-relaxed whitespace-pre-line">
          {{ $t('homePage.whoWeAre.footerText') }}
        </p>
      </div>

    </div>
  </section>
</template>

<script setup lang="ts">
// Angles mapping based on the image layout
const petalsData = [
  { key: 'science', angle: -30 }, // Top Left
  { key: 'sfda', angle: 30 }, // Top Right
  { key: 'distribution', angle: 90 }, // Right
  { key: 'quality', angle: 150 }, // Bottom Right
  { key: 'safety', angle: -150 }, // Bottom Left
  { key: 'transparency', angle: -90 }, // Left
];
</script>
