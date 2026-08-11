<template>
  <div class="footer-contact-col" data-aos="fade-up" data-aos-delay="200">
    <h3 class="text-copy-lg font-bold text-ink tracking-wide mb-gutter uppercase">
      {{ $t('contact') || 'Contact Us' }}
    </h3>
    <div class="space-y-icon-md">

      <div class="flex items-start gap-page group">
        <div class="icon-circle">
          <MapPinIcon class="w-icon-sm h-icon-sm transition-colors" />
        </div>
        <span class="text-ink leading-copy whitespace-pre-line pt-control-y-sm group-hover:text-brand-primary transition-colors">{{ $t('footer.contact.address') }}</span>
      </div>

      <a href="https://wa.me/966508178161" target="_blank" rel="noopener noreferrer" class="flex items-start gap-page group">
        <div class="icon-circle">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-icon-sm h-icon-sm transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9l-5.05 .9" />
            <path d="M9 10a.5.5 0 0 0 1 0v-1a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
          </svg>
        </div>
        <span class="text-ink leading-copy whitespace-pre-line pt-control-y-sm transition-colors group-hover:text-brand-primary" dir="ltr">{{ $t('footer.contact.phone') }}</span>
      </a>

      <a :href="`mailto:${contactEmail}`" class="flex items-start gap-page group">
        <div class="icon-circle">
          <MailIcon class="w-icon-sm h-icon-sm transition-colors" />
        </div>
        <span class="text-ink leading-copy pt-control-y-sm group-hover:text-brand-primary transition-colors">{{ contactEmail }}</span>
      </a>

      <div class="flex items-start gap-page group">
        <div class="icon-circle">
          <BarcodeIcon class="w-icon-sm h-icon-sm transition-colors" />
        </div>
        <span class="text-ink leading-copy pt-control-y-sm group-hover:text-brand-primary transition-colors">{{ $t('footer.contact.vat') }}</span>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { MailIcon, MapPinIcon, BarcodeIcon } from 'lucide-vue-next'

const contactEmail = 'acc@vitadiet.sa'
</script>
