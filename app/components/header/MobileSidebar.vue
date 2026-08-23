<template>
  <Transition name="fade-overlay">
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-ink/60 z-[60] md:hidden backdrop-blur-sm pointer-events-auto"
      @click="$emit('close')"
    ></div>
  </Transition>

  <Transition :name="locale === 'ar' ? 'slide-right' : 'slide-left'">
    <aside
      v-if="isOpen"
      class="fixed top-0 bottom-0 z-[70] w-[85vw] max-w-[320px] sm:max-w-none sm:w-80 h-[100dvh] flex flex-col md:hidden overflow-hidden bg-surface shadow-[4px_0_60px_rgba(27,56,97,0.18)] border-e border-line pointer-events-auto"
      :class="locale === 'ar' ? 'right-0' : 'left-0'"
    >
      <div class="relative z-10 flex items-center justify-between px-6 py-5 border-b border-line">
        <NuxtLink :to="localePath('/')" class="flex items-center shrink-0" @click="$emit('close')">
          <BaseImage
            :src="logoImage"
            alt="Vitadiet Logo"
            loading="eager"
            :width="1000"
            :height="333"
            class="h-8 sm:h-10 w-auto object-contain"
          />
        </NuxtLink>
        <button
          @click="$emit('close')"
          class="w-10 h-10 flex items-center justify-center rounded-xl text-ink-soft bg-surface-muted hover:bg-brand-primary-soft hover:text-brand-primary border border-line transition-all duration-200"
          aria-label="Close menu"
        >
          <XIcon class="w-6 h-6" />
        </button>
      </div>

      <nav class="flex-1 overflow-y-auto px-4 sm:px-6 pt-6 pb-6">
        <div class="flex flex-col gap-2">
          <NuxtLink
            v-for="(item, index) in navItems"
            :key="item.labelKey"
            :to="item.path ? localePath(item.path) : sectionPath(item.hash)"
            class="sidebar-nav-link group flex items-center gap-4 px-4 py-3.5 rounded-xl text-ink hover:bg-brand-primary-soft hover:text-brand-primary border border-transparent hover:border-brand-primary/15 transition-all duration-200"
            :class="{ 'sidebar-nav-link-active': isActive(item) }"
            :style="{ transitionDelay: `${index * 35}ms` }"
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
import type { NavItem } from '~/types'

const logoImage = '/images/vitadiet-official-logo.svg'

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
const { sectionPath } = useSectionPath()
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
