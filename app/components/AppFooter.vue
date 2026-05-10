<template>
  <footer id="footer" class="relative bg-surface pt-section pb-page-lg border-t border-line overflow-hidden">
    <div class="max-w-content mx-auto px-page sm:px-gutter md:px-page-lg relative z-10">

      <!-- Main grid: 1 col mobile → 2 col tablet → 4 col desktop -->
      <div class="footer-grid mb-rule-sm">

        <!-- Col 1 — Brand -->
        <div class="space-y-gutter" data-aos="fade-up">
          <NuxtLink :to="localePath('/')">
            <BaseImage :src="logoImage" alt="Vitadiet Logo" loading="lazy" class="h-page-lg sm:h-product-lg w-auto object-contain" />
          </NuxtLink>
          <p class="text-ink leading-copy">{{ $t('footer.quote') }}</p>
          <div class="flex items-center gap-control-y-sm pt-control-y-sm">
            <a
              href="https://www.linkedin.com/company/vitadiet"
              target="_blank" rel="noopener noreferrer"
              aria-label="LinkedIn"
              class="social-btn"
            >
              <LinkedinIcon class="w-icon-sm h-icon-sm" />
            </a>
            <a
              href="https://twitter.com/vitadiet"
              target="_blank" rel="noopener noreferrer"
              aria-label="Twitter / X"
              class="social-btn"
            >
              <TwitterIcon class="w-icon-sm h-icon-sm" />
            </a>
            <a
              href="https://www.instagram.com/vitadiet"
              target="_blank" rel="noopener noreferrer"
              aria-label="Instagram"
              class="social-btn"
            >
              <InstagramIcon class="w-icon-sm h-icon-sm" />
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
                class="inline-flex items-center gap-2 text-ink hover:text-brand-primary hover:translate-x-1 transition-all duration-300 group"
              >
                <span class="w-dot h-dot shrink-0 rounded-full bg-brand-primary opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300"></span>
                {{ $t(link.labelKey) }}
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
              <div class="contact-icon-wrap group-hover:bg-brand-primary">
                <MapPinIcon class="w-icon-md h-icon-md text-brand-primary group-hover:text-on-primary transition-colors" />
              </div>
              <span class="text-ink leading-copy whitespace-pre-line pt-control-y-sm">{{ $t('footer.contact.address') }}</span>
            </div>

            <div class="flex items-start gap-page group">
              <div class="contact-icon-wrap group-hover:bg-brand-primary">
                <PhoneIcon class="w-icon-md h-icon-md text-brand-primary group-hover:text-on-primary transition-colors" />
              </div>
              <span class="text-ink leading-copy whitespace-pre-line pt-control-y-sm" dir="ltr">{{ $t('footer.contact.phone') }}</span>
            </div>

            <div class="flex items-start gap-page group">
              <div class="contact-icon-wrap group-hover:bg-brand-primary">
                <MailIcon class="w-icon-md h-icon-md text-brand-primary group-hover:text-on-primary transition-colors" />
              </div>
              <span class="text-ink leading-copy pt-control-y-sm">{{ $t('footer.contact.email') }}</span>
            </div>

            <div class="flex items-start gap-page group">
              <div class="contact-icon-wrap group-hover:bg-brand-primary">
                <ReceiptIcon class="w-icon-md h-icon-md text-brand-primary group-hover:text-on-primary transition-colors" />
              </div>
              <span class="text-ink leading-copy pt-control-y-sm">{{ $t('footer.contact.vat') }}</span>
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
import logoImage from '~/assets/images/logo.svg'
import doGif from '~/assets/images/footer/blackDo.gif'
import {
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  LinkedinIcon,
  TwitterIcon,
  InstagramIcon,
  ReceiptIcon,
} from 'lucide-vue-next'

const { t } = useI18n()
const localePath = useLocalePath()
const { sectionPath } = useSectionPath()

const footerLinks = [
  { labelKey: 'home',     hash: '' },
  { labelKey: 'services', hash: '#why' },
  { labelKey: 'products', hash: '#products' },
  { labelKey: 'contact',  hash: '#footer' },
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
  border-radius: 9999px;
  background: color-mix(in oklab, var(--color-brand-primary) 10%, transparent);
  flex-shrink: 0;
  transition: background-color 0.3s;
}


</style>
