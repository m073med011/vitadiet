<template>
  <section class="stats-section" data-aos="fade-up">
    <div class="content-wrap">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        <div
          v-for="(stat, index) in stats"
          :key="index"
          class="flex flex-col items-center justify-center space-y-2"
          data-aos="fade-up"
          :data-aos-delay="index * 100"
        >
          <h3 class="stat-value">{{ stat.value }}</h3>
          <p class="stat-label">{{ $t(stat.labelKey) }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { stats } from '~/data/home'
</script>
