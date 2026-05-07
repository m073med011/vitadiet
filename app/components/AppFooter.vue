<template>
  <footer class="footer-shell footer-vitadiet">
    <div class="content-wrap relative z-10">
      <div class="footer-grid-vitadiet">
        <div class="space-y-6" data-aos="fade-up">
          <NuxtLink :to="localePath('/')" class="">
            <BaseImage :src="logoImage" alt="Vitadiet Logo" loading="lazy" class="h-8 sm:h-32 w-auto object-contain invert dark:invert-0 " />
          </NuxtLink>
          <p class="footer-text">{{ $t('footer.quote') }}</p>
          <div class="footer-badges">
            <span>B2B</span>
            <span>SFDA</span>
            <span>EU</span>
          </div>
          <div class="flex items-center gap-3 pt-4">
            <a href="#" class="social-icon-btn" aria-label="LinkedIn">
              <LinkedinIcon class="w-5 h-5" />
            </a>
            <a href="#" class="social-icon-btn" aria-label="Twitter">
              <TwitterIcon class="w-5 h-5" />
            </a>
            <a href="#" class="social-icon-btn" aria-label="Instagram">
              <InstagramIcon class="w-5 h-5" />
            </a>
          </div>
        </div>

        <nav data-aos="fade-up" data-aos-delay="100">
          <h3 class="footer-heading">{{ $t('navigation') || 'Quick Links' }}</h3>
          <ul class="space-y-4 mt-2">
            <li
              v-for="(link, index) in footerLinks"
              :key="link.labelKey"
              data-aos="fade-up"
              :data-aos-delay="index * 100"
            >
              <NuxtLink :to="sectionPath(link.hash)" class="footer-link group">
                <span class="w-1.5 h-1.5 rounded-full bg-brand-primary dark:bg-brand-accent mr-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300"></span>
                {{ $t(link.labelKey) }}
              </NuxtLink>
            </li>
          </ul>
        </nav>

        <div data-aos="fade-up" data-aos-delay="200">
          <h3 class="footer-heading">{{ $t('contact') || 'Contact Us' }}</h3>
          <div class="space-y-5">
            <div class="footer-contact-row group" data-aos="fade-up" data-aos-delay="0">
              <div class="w-10 h-10 rounded-full bg-brand-primary/10 dark:bg-brand-accent/10 flex items-center justify-center shrink-0 group-hover:bg-brand-primary group-hover:text-on-primary dark:group-hover:bg-brand-accent dark:group-hover:text-on-accent transition-colors duration-300">
                <MapPinIcon class="footer-icon group-hover:text-current transition-colors" />
              </div>
              <span class="footer-text whitespace-pre-line pt-2">{{ $t('footer.contact.address') }}</span>
            </div>
            <div class="footer-contact-row group" data-aos="fade-up" data-aos-delay="100">
              <div class="w-10 h-10 rounded-full bg-brand-primary/10 dark:bg-brand-accent/10 flex items-center justify-center shrink-0 group-hover:bg-brand-primary group-hover:text-on-primary dark:group-hover:bg-brand-accent dark:group-hover:text-on-accent transition-colors duration-300">
                <PhoneIcon class="footer-icon group-hover:text-current transition-colors" />
              </div>
              <span class="footer-text pt-2">{{ $t('footer.contact.phone') }}</span>
            </div>
            <div class="footer-contact-row group" data-aos="fade-up" data-aos-delay="200">
              <div class="w-10 h-10 rounded-full bg-brand-primary/10 dark:bg-brand-accent/10 flex items-center justify-center shrink-0 group-hover:bg-brand-primary group-hover:text-on-primary dark:group-hover:bg-brand-accent dark:group-hover:text-on-accent transition-colors duration-300">
                <MailIcon class="footer-icon group-hover:text-current transition-colors" />
              </div>
              <span class="footer-text pt-2">{{ $t('footer.contact.email') }}</span>
            </div>
          </div>
        </div>

        <div data-aos="fade-up" data-aos-delay="300">
          <h3 class="footer-heading">{{ $t('newsletter') || 'Stay Updated' }}</h3>
          <p class="footer-text mb-6">{{ $t('footer.newsletter.text') }}</p>
          <form @submit.prevent="submitFooterInquiry" class="newsletter-input-group">
            <input
              type="email"
              v-model="footerEmail"
              :placeholder="$t('footer.newsletter.placeholder')"
              required
            />
            <button type="submit" class="bg-brand-primary hover:bg-brand-primary-hover text-on-primary dark:bg-brand-accent dark:hover:bg-brand-accent-hover dark:text-on-accent transition-colors flex items-center gap-2">
              {{ $t('footer.newsletter.join') }}
              <ArrowRightIcon class="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      <div
        class="pt-card border-t border-line dark:border-dark-line text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4"
        data-aos="fade-up"
      >
        <p class="text-ink-soft dark:text-dark-ink-soft text-small">
          &copy; {{ new Date().getFullYear() }} {{ $t('footer.copyright') }}
        </p>
        <div class="flex gap-4 text-small text-ink-soft dark:text-dark-ink-soft">
          <a href="#" class="hover:text-brand-accent transition-colors">{{ $t('footer.privacyPolicy') }}</a>
          <a href="#" class="hover:text-brand-accent transition-colors">{{ $t('footer.termsOfService') }}</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import logoImage from '~/assets/images/logo.png'
import { MailIcon, MapPinIcon, PhoneIcon, LinkedinIcon, TwitterIcon, InstagramIcon, ArrowRightIcon } from 'lucide-vue-next'

const { t } = useI18n()
const localePath = useLocalePath()
const footerEmail = ref('')

const footerLinks = [
  { labelKey: 'footer.links.bestSeller', hash: '#about' },
  { labelKey: 'footer.links.skinProducts', hash: '#science' },
  { labelKey: 'footer.links.beautyProducts', hash: '#products' },
  { labelKey: 'footer.links.trackOrder', hash: '#products' },
  { labelKey: 'footer.links.aboutUs', hash: '#contact' },
]

const sectionPath = (hash: string) => `${localePath('/')}${hash}`

const submitFooterInquiry = () => {
  if (footerEmail.value) {
    alert(`${t('footer.newsletter.joinedMessage')} ${footerEmail.value}`)
    footerEmail.value = ''
  }
}
</script>
