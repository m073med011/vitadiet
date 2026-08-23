<template>
  <div
    class="top-0 z-50 w-full flex justify-center transition-all duration-500 ease-in-out pointer-events-none"
    :class="[
      route.meta.headerSticky !== false ? 'sticky' : 'relative',
      isScrolled && route.meta.headerSticky !== false ? 'lg:px-6 lg:pt-6' : '',
    ]"
  >
    <header
      class="backdrop-blur transition-all duration-500 ease-in-out text-ink flex flex-row flex-nowrap items-center justify-between w-full pointer-events-auto animate-fade-in"
      :class="[
        isScrolled
          ? 'max-w-7xl bg-surface/95 shadow-float rounded-none lg:rounded-3xl px-page py-3 sm:px-gutter lg:border xl:px-8 border-b border-line/30'
          : 'max-w-full bg-surface/95 border-b border-line px-page py-3 sm:px-gutter lg:px-10 lg:py-5 rounded-none border-x-transparent border-t-transparent border-l-transparent border-r-transparent',
      ]"
    >
      <NuxtLink
        :to="localePath('/')"
        class="flex items-center relative z-10 group shrink-0"
        :aria-label="$t('a11y.homeLink')"
      >
        <BaseImage
          :src="logoImage"
          :alt="$t('a11y.logoAlt')"
          loading="eager"
          :width="1000"
          :height="333"
          class="h-8 w-auto max-w-[8rem] object-contain transition-all duration-300 group-hover:scale-105 sm:h-9 lg:h-11 xl:h-12"
        />
      </NuxtLink>

      <HeaderDesktopNav :nav-items="navItems" :is-active="isActiveNavItem" />

      <div class="flex items-center gap-2 sm:gap-4">
        <BaseButton class="hidden lg:inline-flex" :to="localePath('/products/')" variant="primary">
          {{ $t('header.discoverProducts') }}
        </BaseButton>

        <div class="hidden items-center text-ink-soft lg:flex">
          <HeaderLangSwitcher variant="desktop" />
        </div>

        <HeaderLangSwitcher class="lg:hidden" variant="desktop" />

        <button
          class="focus-ring relative -mr-1 flex min-h-11 min-w-11 items-center justify-center rounded-xl text-ink transition-colors hover:text-brand-primary group pointer-events-auto rtl:-ml-1 lg:hidden"
          :aria-label="$t('a11y.openMenu')"
          @click="isMobileMenuOpen = true"
        >
          <span
            class="absolute inset-0 rounded-xl bg-brand-primary-soft opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          />
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
import { MenuIcon } from 'lucide-vue-next'
import { ASSETS } from '#shared/brand'
import { navItems } from '~/data/navigation'
import { normalizePath } from '~/utils/path'
import type { NavItem } from '~/types'

const logoImage = ASSETS.logo

const localePath = useLocalePath()
const route = useRoute()

const isMobileMenuOpen = ref(false)

const { isScrolled } = useScrollState()
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
