<template>
  <nav
    class="hidden lg:flex min-w-0 flex-1 items-center justify-center gap-3 text-small font-semibold tracking-nav text-ink-soft uppercase font-heading xl:gap-6"
  >
    <div
      v-for="(item, index) in navItems"
      :key="item.labelKey"
      class="animate-fade-in"
      :style="{ animationDelay: `${index * DESKTOP_NAV_STAGGER_MS}ms` }"
    >
      <NuxtLink
        :to="navPath(item)"
        class="focus-ring-lg nav-link relative inline-flex min-h-11 items-center whitespace-nowrap px-1 py-2 transition-colors duration-300 hover:text-brand-primary"
        :class="{ 'nav-link-active text-brand-primary': isActive(item) }"
      >
        {{ $t(item.labelKey) }}
      </NuxtLink>
    </div>
  </nav>
</template>

<script setup lang="ts">
import type { NavItem } from '~/types'

const DESKTOP_NAV_STAGGER_MS = 100

defineProps<{
  navItems: NavItem[]
  isActive: (item: NavItem) => boolean
}>()

const { navPath } = useNavPath()
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
