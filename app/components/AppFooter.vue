<template>
  <footer id="footer" class="relative bg-surface pt-section pb-page-lg border-t border-line overflow-hidden">
    <div class="max-w-content mx-auto px-page sm:px-gutter md:px-page-lg relative z-10">

      <!-- Main grid: 1 col mobile → 2 col tablet → 4 col desktop -->
      <div class="footer-grid mb-rule-sm">

        <!-- Col 1 — Brand -->
        <div class="space-y-gutter" data-aos="fade-up">
          <NuxtLink :to="localePath('/')" aria-label="Vitadiet home">
            <BaseImage :src="logoImage" alt="Vitadiet Logo" loading="lazy" class="h-page-lg sm:h-product-lg w-auto object-contain" />
          </NuxtLink>
          <p class="text-ink leading-copy">{{ $t('footer.quote') }}</p>
          <div class="flex flex-wrap items-center gap-control-y-sm pt-control-y-sm">
            <a
              v-for="link in socialLinks"
              :key="link.label"
              :href="link.href"
              target="_blank" rel="noopener noreferrer"
              :aria-label="link.label"
              class="social-btn"
            >
              <component
                :is="link.icon"
                v-if="link.icon"
                class="w-icon-sm h-icon-sm"
                aria-hidden="true"
              />
              <svg
                v-else-if="link.path"
                class="w-icon-sm h-icon-sm"
                :viewBox="link.viewBox || '0 0 24 24'"
                aria-hidden="true"
              >
                <path 
                  fill="currentColor" 
                  :stroke="link.stroke || 'none'" 
                  :stroke-width="link.strokeWidth || 0" 
                  :stroke-linejoin="link.strokeLinejoin" 
                  :d="link.path" 
                />
              </svg>
            </a>
          </div>
        </div>

        <!-- Col 2 — Quick Links -->
        <nav data-aos="fade-up" data-aos-delay="100">
          <h3 class="text-copy-lg font-bold text-ink tracking-wide mb-gutter uppercase">
            {{ $t('navigation') || 'Quick Links' }}
          </h3>
          <ul class="space-y-page mt-control-y-sm">
            <li
              v-for="(link, index) in footerLinks"
              :key="link.labelKey"
              data-aos="fade-up"
              :data-aos-delay="index * 80"
            >
              <NuxtLink
                :to="sectionPath(link.hash)"
                class="relative inline-flex items-center text-ink hover:text-brand-primary hover:translate-x-2 rtl:hover:-translate-x-2 transition-all duration-300 group"
              >
                <span class="absolute -left-3 rtl:-right-3 w-dot h-dot rounded-full bg-brand-primary opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300"></span>
                <span>{{ $t(link.labelKey) }}</span>
              </NuxtLink>
            </li>
          </ul>
        </nav>

        <!-- Cols 3-4 — Contact (spans 2 cols on lg, full width on md) -->
        <div class="footer-contact-col" data-aos="fade-up" data-aos-delay="200">
          <h3 class="text-copy-lg font-bold text-ink tracking-wide mb-gutter uppercase">
            {{ $t('contact') || 'Contact Us' }}
          </h3>
          <div class="space-y-icon-md">

            <div class="flex items-start gap-page group">
              <div class="contact-icon-wrap">
                <MapPinIcon class="w-icon-sm h-icon-sm transition-colors" />
              </div>
              <span class="text-ink leading-copy whitespace-pre-line pt-control-y-sm group-hover:text-brand-primary transition-colors">{{ $t('footer.contact.address') }}</span>
            </div>

            <a href="https://wa.me/966508178161" target="_blank" rel="noopener noreferrer" class="flex items-start gap-page group">
              <div class="contact-icon-wrap">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-icon-sm h-icon-sm transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9l-5.05 .9" />
                  <path d="M9 10a.5.5 0 0 0 1 0v-1a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
                </svg>
              </div>
              <span class="text-ink leading-copy whitespace-pre-line pt-control-y-sm transition-colors group-hover:text-brand-primary" dir="ltr">{{ $t('footer.contact.phone') }}</span>
            </a>

            <div class="flex items-start gap-page group">
              <div class="contact-icon-wrap">
                <MailIcon class="w-icon-sm h-icon-sm transition-colors" />
              </div>
              <span class="text-ink leading-copy pt-control-y-sm group-hover:text-brand-primary transition-colors">{{ $t('footer.contact.email') }}</span>
            </div>

            <div class="flex items-start gap-page group">
              <div class="contact-icon-wrap">
                <BarcodeIcon class="w-icon-sm h-icon-sm transition-colors" />
              </div>
              <span class="text-ink leading-copy pt-control-y-sm group-hover:text-brand-primary transition-colors">{{ $t('footer.contact.vat') }}</span>
            </div>

          </div>
        </div>

      </div><!-- /footer-grid -->

      <!-- Bottom bar -->
      <div
        class="pt-card border-t border-line flex flex-wrap justify-center items-center gap-1 text-center"
        data-aos="fade-up"
      >
        <a
          href="https://do.com.sa/"
          target="_blank" rel="noopener noreferrer"
          class="text-ink-soft text-small flex flex-wrap items-center justify-center gap-1 hover:text-brand-primary transition-colors"
        >
          <span>{{ $t('footer.copyright') }}</span>
          <span>&copy;</span>
          <span>{{ new Date().getFullYear() }}</span>
          <span class="mx-1">—</span>
          <span>{{ $t('footer.developedBy') }}</span>
          <img :src="doGif" alt="Digital Order" class="h-4 w-auto inline-block ml-1" />
        </a>
      </div>

    </div>
  </footer>
</template>

<script setup lang="ts">
import type { Component } from 'vue'
import logoImage from '~/assets/images/vitadiet-official-logo.svg'
import doGif from '~/assets/images/footer/do-distribution-logo-black.gif'
import {
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  LinkedinIcon,
  InstagramIcon,
  BarcodeIcon,
} from 'lucide-vue-next'

const { t } = useI18n()
const localePath = useLocalePath()
const { sectionPath } = useSectionPath()

const footerLinks = [
  { labelKey: 'home',     hash: '' },
  { labelKey: 'about',    hash: '#who-we-are' },
  { labelKey: 'services', hash: '#why' },
  { labelKey: 'products', hash: '#products' },
  { labelKey: 'contact',  hash: '#footer' },
]

type SocialLink = {
  label: string
  href: string
  icon?: Component
  asset?: string
  path?: string
  viewBox?: string
  stroke?: string
  strokeWidth?: number
  strokeLinejoin?: 'round' | 'inherit' | 'miter' | 'bevel'
}

const socialLinks: SocialLink[] = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/Vitadiet',
    icon: LinkedinIcon,
  },
  {
    label: 'Snapchat',
    href: 'https://www.snapchat.com/add/Vitadiet',
    path: 'M233.962,33.724c62.857,0.021,115.216,52.351,115.292,115.36c0.018,14.758,0.473,28.348,1.306,40.867c0.514,7.724,6.938,13.448,14.305,13.448c1.085,0,2.19-0.124,3.3-0.384l19.691-4.616c0.838-0.197,1.679-0.291,2.51-0.291c5.001,0,9.606,3.417,10.729,8.478c1.587,7.152-2.42,14.378-9.35,16.808l-29.89,12.066c-7.546,3.046-11.599,11.259-9.474,19.115c23.98,88.654,90.959,79.434,90.959,90.984c0,14.504-50.485,16.552-55.046,21.114s-0.198,26.701-10.389,30.987c-1.921,0.808-4.65,1.089-7.979,1.089c-7.676,0-18.532-1.498-29.974-1.498c-9.925,0-20.291,1.127-29.404,5.337c-24.176,11.168-47.484,32.028-76.378,32.028s-52.202-20.86-76.378-32.028c-9.115-4.211-19.478-5.337-29.404-5.337c-11.441,0-22.299,1.498-29.974,1.498c-3.327,0-6.059-0.282-7.979-1.089c-10.191-4.286-5.828-26.425-10.389-30.987S25,360.062,25,345.558c0-11.551,66.979-2.331,90.959-90.984c2.125-7.855-1.928-16.068-9.475-19.115l-29.89-12.066c-6.931-2.43-10.938-9.656-9.35-16.808c1.123-5.062,5.728-8.479,10.729-8.478c0.83,0,1.672,0.094,2.51,0.291l19.691,4.616c1.11,0.26,2.215,0.384,3.3,0.384c7.366,0,13.791-5.725,14.305-13.448c0.833-12.519,1.289-26.109,1.307-40.867C119.162,86.075,171.104,33.746,233.962,33.724 M233.97,8.724h-0.009h-0.009C215.19,8.73,196.913,12.5,179.631,19.93c-16.589,7.131-31.519,17.299-44.375,30.222c-12.839,12.906-22.943,27.889-30.031,44.533c-7.37,17.307-11.118,35.599-11.141,54.368c-0.011,9.215-0.202,18.158-0.57,26.722l-7.326-1.718c-2.688-0.63-5.452-0.95-8.213-0.951c-7.973-0.001-15.838,2.694-22.146,7.588c-6.581,5.106-11.196,12.377-12.993,20.474c-4.277,19.273,6.365,38.73,24.807,45.572l21.937,8.855c-14.526,44.586-41.311,53.13-59.348,58.885c-4.786,1.527-8.92,2.846-12.856,4.799C1.693,327.063,0,340.25,0,345.558c0,10.167,4.812,19.445,13.551,26.124c4.351,3.326,9.741,6.07,16.477,8.389c9.181,3.161,19.824,5.167,28.474,6.775c0.418,3.205,1.031,6.648,2.064,10.118c4.289,14.411,13.34,20.864,20.178,23.739c6.488,2.729,13.192,3.044,17.67,3.044c4.38,0,9.01-0.343,13.912-0.706c5.259-0.39,10.697-0.792,16.062-0.792c8.314,0,14.503,0.992,18.92,3.032c6.065,2.802,12.497,6.58,19.307,10.579c18.958,11.134,40.445,23.754,67.555,23.754s48.596-12.62,67.554-23.754c6.81-4,13.242-7.777,19.308-10.579c4.417-2.041,10.606-3.032,18.92-3.032c5.365,0,10.803,0.403,16.061,0.792c4.902,0.363,9.532,0.706,13.912,0.706c4.478,0,11.181-0.315,17.67-3.044c6.838-2.875,15.889-9.328,20.178-23.739c1.033-3.47,1.647-6.913,2.064-10.118c8.65-1.609,19.294-3.614,28.474-6.775c6.737-2.319,12.126-5.063,16.477-8.389c8.738-6.679,13.551-15.957,13.551-26.124c0-5.308-1.693-18.495-17.378-26.278c-3.936-1.953-8.07-3.272-12.856-4.799c-18.037-5.754-44.822-14.299-59.348-58.885l21.936-8.855c18.442-6.842,29.085-26.3,24.808-45.573c-1.797-8.097-6.412-15.368-12.993-20.474c-6.308-4.893-14.171-7.588-22.142-7.588c-2.761,0-5.525,0.32-8.215,0.95l-7.327,1.718c-0.368-8.563-0.559-17.506-0.57-26.722c-0.023-18.784-3.801-37.094-11.23-54.424c-7.131-16.636-17.29-31.615-30.194-44.522c-12.903-12.906-27.875-23.063-44.498-30.188C271.017,12.497,252.727,8.731,233.97,8.724L233.97,8.724z',
    viewBox: '0 0 468.339 468.339',
    stroke: 'currentColor',
    strokeWidth: 15,
    strokeLinejoin: 'round'
  },
  {
    label: 'TikTok',
    href: 'https://www.tiktok.com/@vitadiet.sa?_r=1&_t=ZS-92qPWxittnb',
    path: 'M12.53.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07Z',
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/Vitadiet.sa',
    icon: InstagramIcon,
  },
  {
    label: 'X',
    href: 'https://x.com/Vitadiet_sa',
    path: 'M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.41l-5.8-7.58-6.64 7.58H.47l8.6-9.83L0 1.15h7.59l5.24 6.93 6.07-6.93Zm-1.29 19.49h2.04L6.49 3.24H4.3l13.31 17.4Z',
  },
]
</script>

<style scoped>
/* ─── Main footer grid ──────────────────────────────────────────
   Mobile  : 1 column  (default)
   Tablet  : 2 columns (md ≥ 768px)
   Desktop : 4 columns (lg ≥ 1024px) — Brand | Links | Contact×2
──────────────────────────────────────────────────────────────── */
.footer-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-gutter-lg, 2rem);
}

@media (min-width: 768px) {
  .footer-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  /* Contact fills the full row on tablet (2/2 cols) */
  .footer-contact-col {
    grid-column: span 2 / span 2;
  }
}

@media (min-width: 1024px) {
  .footer-grid {
    grid-template-columns: repeat(4, 1fr);
  }

  /* Contact spans cols 3-4 (2 of 4) — single row with Brand & Links */
  .footer-contact-col {
    grid-column: span 2 / span 2;
  }
}

/* ─── Social icon button ────────────────────────────────────── */
.social-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--size-icon-2xl, 2.5rem);
  height: var(--size-icon-2xl, 2.5rem);
  border-radius: var(--radius-pill, 9999px);
  border: 1px solid var(--color-line);
  background: var(--color-surface);
  color: var(--color-ink-soft);
  transition: all 0.3s;
}

.social-btn:hover {
  background: var(--color-brand-primary);
  color: var(--color-on-primary);
  transform: translateY(-0.25rem);
  box-shadow: var(--shadow-card);
}


/* ─── Contact icon wrapper ──────────────────────────────────── */
.contact-icon-wrap {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--size-icon-2xl, 2.5rem);
  height: var(--size-icon-2xl, 2.5rem);
  border-radius: var(--radius-pill, 9999px);
  border: 1px solid var(--color-line);
  background: var(--color-surface);
  color: var(--color-ink-soft);
  flex-shrink: 0;
  transition: all 0.3s;
}

.group:hover .contact-icon-wrap {
  background: var(--color-brand-primary);
  color: var(--color-on-primary);
  transform: translateY(-0.25rem);
  box-shadow: var(--shadow-card);
}


</style>
