<template>
  <div 
    class="top-0 z-50 w-full flex justify-center transition-all duration-500 ease-in-out pointer-events-none"
    :class="[
      route.meta.headerSticky !== false ? 'sticky' : 'relative',
      isScrolled && route.meta.headerSticky !== false ? 'md:pt-6 md:px-6' : ''
    ]"
  >
    <header
      class="backdrop-blur transition-all duration-500 ease-in-out text-ink flex flex-row flex-nowrap items-center justify-between w-full pointer-events-auto animate-fade-in"
      :class="[
        isScrolled 
          ? 'max-w-7xl bg-surface/95 shadow-[0_16px_40px_rgb(29,43,91,0.16)] rounded-none md:rounded-3xl py-3 px-6 md:px-8 border-b md:border border-line/30' 
          : 'max-w-full bg-surface/95 border-b border-line py-3 md:py-5 px-6 md:px-10 rounded-none border-x-transparent border-t-transparent border-l-transparent border-r-transparent'
      ]"
    >
      <NuxtLink :to="localePath('/')" class="flex items-center relative z-10 group shrink-0" aria-label="Vitadiet home">
        <BaseImage
          :src="logoImage"
          alt="Vitadiet Logo"
          loading="eager"
          :width="1000"
          :height="333"
          class="h-8 md:h-12 w-auto max-w-full object-contain transition-all duration-300 group-hover:scale-105"
        />
      </NuxtLink>

      <HeaderDesktopNav :nav-items="navItems" :is-active="isActiveNavItem" />

      
      <div class="flex items-center gap-3 sm:gap-6">
        <div class="flex items-center space-x-3 rtl:space-x-reverse text-ink-soft hidden md:flex">
          <HeaderLangSwitcher variant="desktop" />
        </div>

        <button
          class="md:hidden p-1 -mr-1 rtl:-ml-1 text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent hover:text-brand-primary transition-colors relative group pointer-events-auto"
          aria-label="Open menu"
          @click="isMobileMenuOpen = true"
        >
          <span class="absolute inset-0 rounded-xl bg-brand-primary-soft opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
          <MenuIcon class="w-8 h-8 relative z-10" />
        </button>
      </div>
    </header>
  </div>

  <HeaderMobileSidebar
    :is-open="isMobileMenuOpen"
    :nav-items="navItems"
    :is-active="isActiveNavItem"
    @close="isMobileMenuOpen = false"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { MenuIcon } from 'lucide-vue-next'
import { navItems } from '~/data/navigation'
import { normalizePath } from '~/utils/path'
import type { NavItem } from '~/types'

const logoImage = '/images/vitadiet-official-logo.svg'

const localePath = useLocalePath()
const route = useRoute()

const isMobileMenuOpen = ref(false)

const { isScrolled, handleScroll } = useScrollState()
const { activeHash, scheduleActiveSectionUpdate } = useActiveSection(navItems)



watch(isScrolled, () => {
  scheduleActiveSectionUpdate()
})

const isActiveNavItem = (item: NavItem) => {
  if (item.path) {
    return normalizePath(route.path) === normalizePath(localePath(item.path))
  }

  const homePath = normalizePath(localePath('/'))
  if (normalizePath(route.path) !== homePath) return false
  return item.hash === activeHash.value
}
</script>
