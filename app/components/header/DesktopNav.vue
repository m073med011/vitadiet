<template>
  <nav
    class="hidden md:flex items-center gap-6 lg:gap-10 text-small font-semibold tracking-nav text-ink-soft uppercase font-heading"
  >
    <div
      v-for="(item, index) in navItems"
      :key="item.labelKey"
      class="animate-fade-in"
      :style="{ animationDelay: `${index * 100}ms` }"
    >
      <NuxtLink
        :to="item.path ? localePath(item.path) : sectionPath(item.hash)"
        class="nav-link relative py-2 hover:text-brand-primary transition-colors duration-300"
        :class="{ 'nav-link-active text-brand-primary': isActive(item) }"
      >
        {{ $t(item.labelKey) }}
      </NuxtLink>
    </div>
  </nav>
</template>

<script setup lang="ts">
import type { NavItem } from '~/types'

defineProps<{
  navItems: NavItem[]
  isActive: (item: NavItem) => boolean
}>()

const localePath = useLocalePath()
const { sectionPath } = useSectionPath()
</script>

<style scoped>
.nav-link::after {
  content: '';
  position: absolute;
  inset-inline: 0;
  bottom: 0;
  height: 2px;
  border-radius: var(--radius-pill);
  background: var(--color-brand-accent);
  opacity: 0;
  transform: scaleX(0.25);
  transition:
    opacity var(--motion-standard) var(--motion-ease-out),
    transform var(--motion-standard) var(--motion-ease-out);
}

.nav-link:hover::after,
.nav-link-active::after {
  opacity: 1;
  transform: scaleX(1);
}
</style>
