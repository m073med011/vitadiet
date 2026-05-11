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
          class="h-8 md:h-12 w-auto max-w-full object-contain transition-all duration-300 group-hover:scale-105"
        />
      </NuxtLink>

      <!-- Desktop nav -->
      <nav class="hidden md:flex items-center gap-6 lg:gap-10 text-small font-semibold tracking-nav text-ink-soft uppercase font-heading">
        <div
          v-for="(item, index) in navItems"
          :key="item.labelKey"
          class="animate-fade-in"
          :style="{ animationDelay: `${index * 100}ms` }"
        >
          <NuxtLink
            :to="sectionPath(item.hash)"
            class="nav-link relative py-2 hover:text-brand-primary transition-colors duration-300"
            :class="{ 'nav-link-active text-brand-primary': isActiveNavItem(item.hash) }"
          >
            {{ $t(item.labelKey) }}
          </NuxtLink>
        </div>
      </nav>

      <!-- Action group -->
      <div class="flex items-center gap-3 sm:gap-6">
        <div class="flex items-center space-x-3 rtl:space-x-reverse text-ink-soft hidden md:flex">
          <BaseButton variant="icon" @click="toggleLanguage" :title="$t('switch_lang')" aria-label="Switch Language">
            <LanguagesIcon class="w-6 h-6" />
            <span class="ms-2 text-small font-bold uppercase tracking-wide">{{ locale === 'en' ? 'عربي' : 'EN' }}</span>
          </BaseButton>
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

  <!-- Mobile overlay -->
  <Transition name="fade-overlay">
    <div
      v-if="isMobileMenuOpen"
      class="fixed inset-0 bg-ink/60 z-[60] md:hidden backdrop-blur-sm pointer-events-auto"
      @click="isMobileMenuOpen = false"
    ></div>
  </Transition>

  <!-- Mobile sidebar -->
  <Transition :name="locale === 'ar' ? 'slide-right' : 'slide-left'">
    <aside
      v-if="isMobileMenuOpen"
      class="fixed top-0 bottom-0 z-[70] w-[85vw] max-w-[320px] sm:max-w-none sm:w-80 h-[100dvh] flex flex-col md:hidden overflow-hidden bg-surface shadow-[4px_0_60px_rgba(27,56,97,0.18)] border-e border-line pointer-events-auto"
      :class="locale === 'ar' ? 'right-0' : 'left-0'"
    >
      <!-- Sidebar header -->
      <div class="relative z-10 flex items-center justify-between px-6 py-5 border-b border-line">
        <NuxtLink :to="localePath('/')" class="flex items-center shrink-0" @click="isMobileMenuOpen = false">
          <BaseImage :src="logoImage" alt="Vitadiet Logo" loading="eager" class="h-8 sm:h-10 w-auto object-contain" />
        </NuxtLink>
        <button
          @click="isMobileMenuOpen = false"
          class="w-10 h-10 flex items-center justify-center rounded-xl text-ink-soft bg-surface-muted hover:bg-brand-primary-soft hover:text-brand-primary border border-line transition-all duration-200"
          aria-label="Close menu"
        >
          <XIcon class="w-6 h-6" />
        </button>
      </div>

      <!-- Sidebar nav links -->
      <nav class="flex-1 overflow-y-auto px-4 sm:px-6 pt-6 pb-6">
        <div class="flex flex-col gap-2">
          <NuxtLink
            v-for="(item, index) in navItems"
            :key="item.labelKey"
            :to="sectionPath(item.hash)"
            class="sidebar-nav-link group flex items-center gap-4 px-4 py-3.5 rounded-xl text-ink hover:bg-brand-primary-soft hover:text-brand-primary border border-transparent hover:border-brand-primary/15 transition-all duration-200"
            :class="{ 'sidebar-nav-link-active': isActiveNavItem(item.hash) }"
            :style="{ transitionDelay: `${index * 35}ms` }"
            @click="isMobileMenuOpen = false"
          >
            <component :is="item.icon" class="w-6 h-6 shrink-0" />
            <span class="font-semibold text-copy font-heading">{{ $t(item.labelKey) }}</span>
            <ChevronRightIcon class="w-5 h-5 ms-auto opacity-40 rtl:rotate-180 transition-transform group-hover:opacity-100 group-hover:translate-x-0.5" />
          </NuxtLink>
        </div>
      </nav>

      <!-- Sidebar footer actions -->
      <div class="relative z-10 px-6 py-6 border-t border-line">
        <p class="text-caption font-bold tracking-label uppercase text-ink-subtle mb-4">{{ $t('preferences') }}</p>
        <div class="grid grid-cols-2 gap-4">
          <button
            @click="toggleLanguage"
            class="flex flex-col items-center gap-2 py-3.5 px-3 rounded-xl bg-surface-muted border border-line text-ink hover:bg-brand-primary-soft hover:text-brand-primary transition-all duration-200"
          >
            <LanguagesIcon class="w-6 h-6 text-brand-primary" />
            <span class="text-small font-bold">{{ locale === 'en' ? 'عربي' : 'English' }}</span>
          </button>
        </div>
      </div>
    </aside>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import logoImage from '~/assets/images/logo.svg'
import {
  BookOpenIcon,
  ChevronRightIcon,
  HomeIcon,
  InfoIcon,
  LanguagesIcon,
  MenuIcon,
  PackageIcon,
  SparklesIcon,
  XIcon,
  PhoneIcon,
} from 'lucide-vue-next'

const { locale, setLocale } = useI18n()
const localePath = useLocalePath()
const route = useRoute()
const { sectionPath } = useSectionPath()

const isMobileMenuOpen = ref(false)
const isScrolled = ref(false)
const activeHash = ref(route.hash || '')

watch(() => route.hash, (newHash) => {
  activeHash.value = newHash || ''
})

const handleScroll = () => {
  const currentScroll = window.scrollY
  isScrolled.value = currentScroll > 20

  if (normalizePath(route.path) === homePath.value) {
    let current = '' // Default to home

    // Check if we're at the absolute bottom of the page
    const isAtBottom = Math.ceil(window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50

    // Check sections from bottom to top
    const sections = [...navItems].filter(item => item.hash).reverse()
    
    if (isAtBottom && sections.length > 0) {
      current = sections[0].hash
    } else {
      for (const item of sections) {
        try {
          const el = document.querySelector(item.hash)
          if (el) {
            const rect = el.getBoundingClientRect()
            // offset to activate section slightly before it hits the top
            if (rect.top <= 250) {
              current = item.hash
              break
            }
          }
        } catch (e) {
          // Ignore invalid selectors
        }
      }
    }
    
    if (activeHash.value !== current) {
      activeHash.value = current
    }
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const navItems = [
  { labelKey: 'home', hash: '', icon: HomeIcon },
  { labelKey: 'about', hash: '#who-we-are', icon: InfoIcon },
  { labelKey: 'services', hash: '#why', icon: SparklesIcon },
  { labelKey: 'products', hash: '#products', icon: PackageIcon },
  { labelKey: 'contact', hash: '#footer', icon: PhoneIcon },
]

const normalizePath = (path: string) => path.replace(/\/$/, '') || '/'
const homePath = computed(() => normalizePath(localePath('/')))

const isActiveNavItem = (hash: string) => {
  if (normalizePath(route.path) !== homePath.value) return false
  return hash === activeHash.value
}

const toggleLanguage = () => {
  setLocale(locale.value === 'en' ? 'ar' : 'en')
}
</script>

<style scoped>
/* Desktop nav underline indicator */
.nav-link::after {
  content: "";
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

/* Mobile sidebar active state */
.sidebar-nav-link-active {
  background: color-mix(in oklab, var(--color-brand-primary) 10%, transparent);
  border-color: color-mix(in oklab, var(--color-brand-primary) 18%, transparent);
  color: var(--color-brand-primary);
}



/* Slide transitions */
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
