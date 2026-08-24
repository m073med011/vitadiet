<template>
  <nav data-aos="fade-up" data-aos-delay="100">
    <FooterColumnHeading :label="$t('navigation')" />
    <ul class="space-y-page mt-control-y-sm">
      <li
        v-for="(link, index) in footerNavItems"
        :key="link.labelKey"
        data-aos="fade-up"
        :data-aos-delay="index * AOS_STAGGER_MS"
      >
        <NuxtLink
          :to="navPath(link)"
          class="focus-ring relative inline-flex min-h-11 min-w-11 items-center rounded-control py-2 text-ink hover:text-brand-primary hover:translate-x-2 rtl:hover:-translate-x-2 transition-all duration-300 group"
        >
          <span
            class="absolute -left-3 rtl:-right-3 w-dot h-dot rounded-full bg-brand-primary opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300"
          />
          <span>{{ $t(link.labelKey) }}</span>
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { footerNavItems } from '~/data/navigation'
import { AOS_STAGGER_MS } from '~/utils/motion'

const { navPath } = useNavPath()
</script>
