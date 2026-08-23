<template>
  <Transition name="fade-overlay">
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-ink/60 z-[60] lg:hidden backdrop-blur-sm pointer-events-auto"
      @click="$emit('close')"
    />
  </Transition>

  <Transition :name="locale === 'ar' ? 'slide-right' : 'slide-left'">
    <aside
      v-if="isOpen"
      class="fixed top-0 bottom-0 z-[70] w-[85vw] max-w-[320px] sm:max-w-none sm:w-80 h-[100dvh] flex flex-col lg:hidden overflow-hidden bg-surface shadow-sidebar border-e border-line pointer-events-auto"
      :class="locale === 'ar' ? 'right-0' : 'left-0'"
    >
      <div class="relative z-10 flex items-center justify-between px-6 py-5 border-b border-line">
        <NuxtLink
          :to="localePath('/')"
          class="focus-ring flex min-h-11 items-center shrink-0 rounded-lg"
          @click="$emit('close')"
        >
          <BaseImage
            :src="logoImage"
            :alt="$t('a11y.logoAlt')"
            loading="eager"
            :width="1000"
            :height="333"
            class="h-8 sm:h-10 w-auto object-contain"
          />
        </NuxtLink>
        <button
          class="focus-ring w-11 h-11 flex items-center justify-center rounded-xl text-ink-soft bg-surface-muted hover:bg-brand-primary-soft hover:text-brand-primary border border-line transition-all duration-200"
          :aria-label="$t('a11y.closeMenu')"
          @click="$emit('close')"
        >
          <XIcon class="w-6 h-6" />
        </button>
      </div>

      <nav class="flex-1 overflow-y-auto px-4 sm:px-6 pt-6 pb-6">
        <div class="flex flex-col gap-2">
          <NuxtLink
            v-for="(item, index) in navItems"
            :key="item.labelKey"
            :to="navPath(item)"
            class="focus-ring sidebar-nav-link group flex min-h-11 items-center gap-4 px-4 py-3.5 rounded-xl text-ink hover:bg-brand-primary-soft hover:text-brand-primary border border-transparent hover:border-brand-primary/15 transition-all duration-200"
            :class="{ 'sidebar-nav-link-active': isActive(item) }"
            :style="{ transitionDelay: `${index * MOBILE_NAV_STAGGER_MS}ms` }"
            @click="$emit('close')"
          >
            <component :is="item.icon" class="w-6 h-6 shrink-0" />
            <span class="font-semibold text-copy font-heading">{{ $t(item.labelKey) }}</span>
            <ChevronRightIcon
              class="w-5 h-5 ms-auto opacity-40 rtl:rotate-180 transition-transform group-hover:opacity-100 group-hover:translate-x-0.5"
            />
          </NuxtLink>
        </div>
      </nav>

      <div class="relative z-10 px-6 py-6 border-t border-line">
        <BaseButton
          class="mb-4 w-full"
          :to="localePath('/products/')"
          variant="primary"
          @click="$emit('close')"
        >
          {{ $t('header.discoverProducts') }}
        </BaseButton>

        <p class="text-caption font-bold tracking-label uppercase text-ink-subtle mb-4">
          {{ $t('preferences') }}
        </p>
        <div class="grid grid-cols-2 gap-4">
          <HeaderLangSwitcher variant="mobile" @switch="$emit('close')" />
        </div>
      </div>
    </aside>
  </Transition>
</template>

<script setup lang="ts">
import { ChevronRightIcon, XIcon } from 'lucide-vue-next'
import { ASSETS } from '#shared/brand'
import type { NavItem } from '~/types'

const logoImage = ASSETS.logo
const MOBILE_NAV_STAGGER_MS = 35

defineProps<{
  isOpen: boolean
  navItems: NavItem[]
  isActive: (item: NavItem) => boolean
}>()

defineEmits<{
  close: []
}>()

const { locale } = useI18n()
const localePath = useLocalePath()
const { navPath } = useNavPath()
</script>

<style scoped>
.sidebar-nav-link-active {
  background: color-mix(in oklab, var(--color-brand-primary) 10%, transparent);
  border-color: color-mix(in oklab, var(--color-brand-primary) 18%, transparent);
  color: var(--color-brand-primary);
}

.fade-overlay-enter-active,
.fade-overlay-leave-active {
  transition: opacity 280ms ease;
}
.fade-overlay-enter-from,
.fade-overlay-leave-to {
  opacity: 0;
}

.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition:
    transform 320ms cubic-bezier(0.4, 0, 0.2, 1),
    opacity 320ms ease;
}
.slide-left-enter-from,
.slide-left-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}
.slide-right-enter-from,
.slide-right-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>
