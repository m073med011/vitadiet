<template>
  <header class="site-header sticky top-0 z-50" data-aos="fade-down" data-aos-duration="500">
    <NuxtLink :to="localePath('/')" class="flex items-center relative z-10 group shrink-0" aria-label="Vitadiet home">
      <BaseImage :src="logoImage" alt="Vitadiet Logo" loading="eager" class="site-logo group-hover:scale-105 transition-transform duration-300" />
    </NuxtLink>

    <nav class="site-nav">
      <NuxtLink
        v-for="(item, index) in navItems"
        :key="item.labelKey"
        :to="sectionPath(item.hash)"
        class="site-nav-link"
        data-aos="fade-down"
        :data-aos-delay="index * 100"
      >
        {{ $t(item.labelKey) }}
      </NuxtLink>
    </nav>

    <div class="flex items-center gap-2 sm:gap-4">
      <div class="site-action-group hidden md:flex">
        <BaseButton
          variant="icon"
          @click="toggleLanguage"
          :title="$t('switch_lang')"
          aria-label="Switch Language"
        >
          <LanguagesIcon class="icon-action-symbol" />
          <span class="ms-2 text-small font-bold uppercase tracking-wide">{{ locale === 'en' ? 'عربي' : 'EN' }}</span>
        </BaseButton>

        <BaseButton
          variant="icon"
          @click="toggleTheme"
          :title="$t('toggle_theme')"
          aria-label="Toggle Theme"
        >
          <component :is="colorMode.value === 'dark' ? SunIcon : MoonIcon" class="icon-action-symbol" />
        </BaseButton>
      </div>

      <BaseButton
        variant="none"
        class="mobile-menu-button relative group"
        aria-label="Open menu"
        @click="isMobileMenuOpen = true"
      >
        <span class="absolute inset-0 rounded-xl bg-brand-primary-soft dark:bg-dark-surface-glow opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
        <MenuIcon class="w-icon-2xl h-icon-2xl relative z-10" />
      </BaseButton>
    </div>

    <Transition name="fade-overlay">
      <div
        v-if="isMobileMenuOpen"
        class="fixed inset-0 bg-ink/60 dark:bg-black/75 z-40 md:hidden backdrop-blur-sm"
        @click="isMobileMenuOpen = false"
      ></div>
    </Transition>

    <Transition :name="locale === 'ar' ? 'slide-right' : 'slide-left'">
      <aside
        v-if="isMobileMenuOpen"
        class="sidebar-panel fixed top-0 bottom-0 z-50 w-[85vw] max-w-[320px] sm:max-w-none sm:w-80 h-[100dvh] flex flex-col md:hidden overflow-hidden bg-surface dark:bg-dark-surface-raised shadow-[4px_0_60px_rgba(27,56,97,0.18)] dark:shadow-[4px_0_80px_rgba(2,3,12,0.75)] border-e border-line dark:border-dark-line"
        :class="locale === 'ar' ? 'right-0' : 'left-0'"
      >
        <div class="sidebar-header relative z-10 flex items-center justify-between px-4 sm:px-5 py-4 border-b border-line dark:border-dark-line">
          <NuxtLink :to="localePath('/')" class="flex items-center gap-3 shrink-0 max-w-[70%]" @click="isMobileMenuOpen = false">
            <BaseImage :src="logoImage" alt="Vitadiet Logo" loading="eager" class="h-24 sm:h-30 w-auto object-contain invert dark:invert-0" />
          </NuxtLink>
          <BaseButton
            variant="none"
            @click="isMobileMenuOpen = false"
            class="sidebar-close-btn w-9 h-9 flex items-center justify-center rounded-xl text-ink-soft dark:text-dark-ink-soft bg-surface-muted dark:bg-dark-surface-muted hover:bg-brand-primary-soft dark:hover:bg-dark-surface-glow hover:text-brand-primary dark:hover:text-brand-accent border border-line dark:border-dark-line transition-all duration-200"
            aria-label="Close menu"
          >
            <XIcon class="w-5 h-5" />
          </BaseButton>
        </div>

        <nav class="flex-1 overflow-y-auto px-4 sm:px-5 pt-4 pb-6">
          <div class="flex flex-col gap-1">
            <NuxtLink
              v-for="(item, index) in navItems"
              :key="item.labelKey"
              :to="sectionPath(item.hash)"
              class="sidebar-nav-link group flex items-center gap-3 px-4 py-3.5 rounded-xl text-ink dark:text-dark-ink hover:bg-brand-primary-soft dark:hover:bg-dark-surface-glow hover:text-brand-primary dark:hover:text-brand-accent border border-transparent hover:border-brand-primary/15 dark:hover:border-brand-accent/20 transition-all duration-200"
              :style="{ transitionDelay: `${index * 35}ms` }"
              @click="isMobileMenuOpen = false"
            >
              <component :is="item.icon" class="w-icon-lg h-icon-lg shrink-0" />
              <span class="font-semibold text-copy">{{ $t(item.labelKey) }}</span>
              <ChevronRightIcon class="w-4 h-4 ms-auto opacity-40 rtl:rotate-180 transition-transform group-hover:opacity-100 group-hover:translate-x-0.5" />
            </NuxtLink>
          </div>
        </nav>

        <div class="sidebar-footer relative z-10 px-4 sm:px-5 py-5 border-t border-line dark:border-dark-line">
          <p class="text-caption font-bold tracking-label uppercase text-ink-subtle dark:text-dark-ink-subtle mb-3">{{ $t('preferences') }}</p>
          <div class="grid grid-cols-2 gap-3">
            <BaseButton
              variant="none"
              @click="toggleLanguage"
              class="sidebar-action-btn flex flex-col items-center gap-2 py-3.5 px-3 rounded-xl bg-surface-muted dark:bg-dark-surface-muted border border-line dark:border-dark-line text-ink dark:text-dark-ink hover:bg-brand-primary-soft dark:hover:bg-dark-surface-glow hover:text-brand-primary dark:hover:text-brand-accent transition-all duration-200"
            >
              <LanguagesIcon class="w-icon-lg h-icon-lg text-brand-primary dark:text-brand-accent" />
              <span class="text-small font-bold">{{ locale === 'en' ? 'عربي' : 'English' }}</span>
            </BaseButton>

            <BaseButton
              variant="none"
              @click="toggleTheme"
              class="sidebar-action-btn flex flex-col items-center gap-2 py-3.5 px-3 rounded-xl bg-surface-muted dark:bg-dark-surface-muted border border-line dark:border-dark-line text-ink dark:text-dark-ink hover:bg-brand-primary-soft dark:hover:bg-dark-surface-glow hover:text-brand-primary dark:hover:text-brand-accent transition-all duration-200"
            >
              <component :is="colorMode.value === 'dark' ? SunIcon : MoonIcon" class="w-icon-lg h-icon-lg text-brand-primary dark:text-brand-accent" />
              <span class="text-small font-bold">{{ colorMode.value === 'dark' ? $t('light_mode') : $t('dark_mode') }}</span>
            </BaseButton>
          </div>
        </div>
      </aside>
    </Transition>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import logoImage from '~/assets/images/logo.png'
import {
  BookOpenIcon,
  ChevronRightIcon,
  HomeIcon,
  InfoIcon,
  LanguagesIcon,
  MenuIcon,
  MoonIcon,
  PackageIcon,
  SparklesIcon,
  SunIcon,
  XIcon,
} from 'lucide-vue-next'

const { locale, setLocale } = useI18n()
const colorMode = useColorMode()
const localePath = useLocalePath()

const isMobileMenuOpen = ref(false)

const navItems = [
  { labelKey: 'home', hash: '', icon: HomeIcon },
  { labelKey: 'about', hash: '#about', icon: InfoIcon },
  { labelKey: 'services', hash: '#why', icon: SparklesIcon },
  { labelKey: 'products', hash: '#products', icon: PackageIcon },
  { labelKey: 'blog', hash: '#science', icon: BookOpenIcon },
  { labelKey: 'contact', hash: '#contact', icon: ChevronRightIcon },
]

const sectionPath = (hash: string) => `${localePath('/')}${hash}`

const toggleTheme = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

const toggleLanguage = () => {
  setLocale(locale.value === 'en' ? 'ar' : 'en')
}
</script>

<style scoped>
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
