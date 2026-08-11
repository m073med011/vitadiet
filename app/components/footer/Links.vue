<template>
  <nav data-aos="fade-up" data-aos-delay="100">
    <h3 class="text-copy-lg font-bold text-ink tracking-wide mb-gutter uppercase">
      {{ $t('navigation') || 'Quick Links' }}
    </h3>
    <ul class="space-y-page mt-control-y-sm">
      <li
        v-for="(link, index) in navItems"
        :key="link.labelKey"
        data-aos="fade-up"
        :data-aos-delay="index * 80"
      >
        <NuxtLink
          :to="link.path ? localePath(link.path) : sectionPath(link.hash)"
          class="relative inline-flex items-center text-ink hover:text-brand-primary hover:translate-x-2 rtl:hover:-translate-x-2 transition-all duration-300 group"
        >
          <span class="absolute -left-3 rtl:-right-3 w-dot h-dot rounded-full bg-brand-primary opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300"></span>
          <span>{{ $t(link.labelKey) }}</span>
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { navItems } from '~/data/navigation'

const localePath = useLocalePath()
const { sectionPath } = useSectionPath()
</script>
