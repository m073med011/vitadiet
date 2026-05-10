<template>
  <footer id="footer" class="relative bg-surface dark:bg-dark-surface pt-section pb-page-lg border-t border-line dark:border-dark-line overflow-hidden transition-colors duration-500">
    <div class="max-w-content mx-auto px-page sm:px-gutter md:px-page-lg relative z-10">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter-lg mb-rule-sm">

        <!-- Brand column -->
        <div class="space-y-gutter" data-aos="fade-up">
          <NuxtLink :to="localePath('/')">
            <BaseImage :src="logoImage" alt="Vitadiet Logo" loading="lazy" class="h-page-lg sm:h-product-lg w-auto object-contain " />
          </NuxtLink>
          <p class="text-ink dark:text-dark-ink leading-copy">{{ $t('footer.quote') }}</p>
          <div class="flex flex-wrap gap-control-y-sm">
            <span class="rounded-pill border border-line dark:border-dark-line px-page py-control-y-sm text-small font-semibold text-brand-primary dark:text-brand-accent bg-surface-raised dark:bg-dark-surface-raised">B2B</span>
            <span class="rounded-pill border border-line dark:border-dark-line px-page py-control-y-sm text-small font-semibold text-brand-primary dark:text-brand-accent bg-surface-raised dark:bg-dark-surface-raised">SFDA</span>
            <span class="rounded-pill border border-line dark:border-dark-line px-page py-control-y-sm text-small font-semibold text-brand-primary dark:text-brand-accent bg-surface-raised dark:bg-dark-surface-raised">EU</span>
          </div>
         
        </div>

        <!-- Quick Links column -->
        <nav data-aos="fade-up" data-aos-delay="100">
          <h3 class="text-copy-lg font-bold text-ink dark:text-dark-ink tracking-wide mb-gutter uppercase">{{ $t('navigation') || 'Quick Links' }}</h3>
          <ul class="space-y-page mt-control-y-sm">
            <li
              v-for="(link, index) in footerLinks"
              :key="link.labelKey"
              data-aos="fade-up"
              :data-aos-delay="index * 100"
            >
              <NuxtLink :to="sectionPath(link.hash)" class="inline-flex items-center text-ink dark:text-dark-ink hover:text-brand-primary dark:hover:text-brand-accent hover:translate-x-1 transition-all duration-300 group">
                <span class="w-dot h-dot rounded-full bg-brand-primary dark:bg-brand-accent mr-3 opacity-0 -ml-page group-hover:opacity-100 group-hover:ml-0 transition-all duration-300"></span>
                {{ $t(link.labelKey) }}
              </NuxtLink>
            </li>
          </ul>
        </nav>

        <!-- Contact column -->
        <div data-aos="fade-up" data-aos-delay="200">
          <h3 class="text-copy-lg font-bold text-ink dark:text-dark-ink tracking-wide mb-gutter uppercase">{{ $t('contact') || 'Contact Us' }}</h3>
          <div class="space-y-icon-md">
            <div class="flex items-start gap-page group" data-aos="fade-up" data-aos-delay="0">
              <div class="w-icon-2xl h-icon-2xl rounded-full bg-brand-primary/10 dark:bg-brand-accent/10 flex items-center justify-center shrink-0 group-hover:bg-brand-primary group-hover:text-on-primary dark:group-hover:bg-brand-accent dark:group-hover:text-on-accent transition-colors duration-300">
                <MapPinIcon class="w-icon-md h-icon-md text-brand-primary dark:text-brand-accent shrink-0 group-hover:text-current transition-colors" />
              </div>
              <span class="text-ink dark:text-dark-ink leading-copy whitespace-pre-line pt-control-y-sm">{{ $t('footer.contact.address') }}</span>
            </div>
            <div class="flex items-start gap-page group" data-aos="fade-up" data-aos-delay="100">
              <div class="w-icon-2xl h-icon-2xl rounded-full bg-brand-primary/10 dark:bg-brand-accent/10 flex items-center justify-center shrink-0 group-hover:bg-brand-primary group-hover:text-on-primary dark:group-hover:bg-brand-accent dark:group-hover:text-on-accent transition-colors duration-300">
                <PhoneIcon class="w-icon-md h-icon-md text-brand-primary dark:text-brand-accent shrink-0 group-hover:text-current transition-colors" />
              </div>
              <span class="text-ink dark:text-dark-ink leading-copy pt-control-y-sm">{{ $t('footer.contact.phone') }}</span>
            </div>
            <div class="flex items-start gap-page group" data-aos="fade-up" data-aos-delay="200">
              <div class="w-icon-2xl h-icon-2xl rounded-full bg-brand-primary/10 dark:bg-brand-accent/10 flex items-center justify-center shrink-0 group-hover:bg-brand-primary group-hover:text-on-primary dark:group-hover:bg-brand-accent dark:group-hover:text-on-accent transition-colors duration-300">
                <MailIcon class="w-icon-md h-icon-md text-brand-primary dark:text-brand-accent shrink-0 group-hover:text-current transition-colors" />
              </div>
              <span class="text-ink dark:text-dark-ink leading-copy pt-control-y-sm">{{ $t('footer.contact.email') }}</span>
            </div>
          </div>
        </div>

        <!-- Newsletter column -->
        <div data-aos="fade-up" data-aos-delay="300">
          <h3 class="text-copy-lg font-bold text-ink dark:text-dark-ink tracking-wide mb-gutter uppercase">{{ $t('newsletter') || 'Stay Updated' }}</h3>
           <div class="flex items-center gap-page pt-card">
            <a href="#" class="w-icon-2xl h-icon-2xl rounded-pill border border-line dark:border-dark-line bg-surface dark:bg-dark-surface-raised flex items-center justify-center text-ink-soft dark:text-dark-ink-soft hover:bg-brand-primary hover:text-on-primary dark:hover:bg-brand-accent dark:hover:text-on-accent hover:-translate-y-1 hover:shadow-card dark:hover:shadow-glow-accent transition-all duration-300" aria-label="LinkedIn">
              <LinkedinIcon class="w-icon-sm h-icon-sm" />
            </a>
            <a href="#" class="w-icon-2xl h-icon-2xl rounded-pill border border-line dark:border-dark-line bg-surface dark:bg-dark-surface-raised flex items-center justify-center text-ink-soft dark:text-dark-ink-soft hover:bg-brand-primary hover:text-on-primary dark:hover:bg-brand-accent dark:hover:text-on-accent hover:-translate-y-1 hover:shadow-card dark:hover:shadow-glow-accent transition-all duration-300" aria-label="Twitter">
              <TwitterIcon class="w-icon-sm h-icon-sm" />
            </a>
            <a href="#" class="w-icon-2xl h-icon-2xl rounded-pill border border-line dark:border-dark-line bg-surface dark:bg-dark-surface-raised flex items-center justify-center text-ink-soft dark:text-dark-ink-soft hover:bg-brand-primary hover:text-on-primary dark:hover:bg-brand-accent dark:hover:text-on-accent hover:-translate-y-1 hover:shadow-card dark:hover:shadow-glow-accent transition-all duration-300" aria-label="Instagram">
              <InstagramIcon class="w-icon-sm h-icon-sm" />
            </a>
          </div>
        </div>

      </div>

      <!-- Bottom bar -->
      <div
        class="pt-card border-t border-line dark:border-dark-line flex justify-center items-center"
        data-aos="fade-up"
      >
        <a href="https://do.com.sa/" target="_blank" rel="noopener noreferrer" class="text-ink-soft dark:text-dark-ink-soft text-small flex flex-wrap items-center justify-center gap-1 hover:text-brand-primary dark:hover:text-brand-accent transition-colors">
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
import logoImage from '~/assets/images/logo.svg'
import doGif from '~/assets/images/footer/blackDo.gif'
import { MailIcon, MapPinIcon, PhoneIcon, LinkedinIcon, TwitterIcon, InstagramIcon, ArrowRightIcon } from 'lucide-vue-next'

const { t } = useI18n()
const localePath = useLocalePath()
const { sectionPath } = useSectionPath()

const footerLinks = [
  { labelKey: 'footer.links.bestSeller', hash: '#about' },
  { labelKey: 'footer.links.skinProducts', hash: '#science' },
  { labelKey: 'footer.links.beautyProducts', hash: '#products' },
  { labelKey: 'footer.links.trackOrder', hash: '#products' },
  { labelKey: 'footer.links.aboutUs', hash: '#contact' },
]
</script>
