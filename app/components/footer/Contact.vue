<template>
  <div class="footer-contact-col lg:col-span-2" data-aos="fade-up" data-aos-delay="200">
    <FooterColumnHeading :label="$t('contact')" />
    <div class="space-y-icon-md">
      <FooterContactRow :icon="MapPinIcon" pre-line>
        {{ $t('footer.contact.address') }}
      </FooterContactRow>

      <FooterContactRow :icon="MessageCircleIcon" :href="CONTACT.whatsappUrl" external dir="ltr">
        {{ CONTACT.phone }}
      </FooterContactRow>

      <FooterContactRow :icon="MailIcon" :href="`mailto:${contactEmail}`">
        {{ contactEmail }}
      </FooterContactRow>

      <FooterContactRow :icon="BarcodeIcon">
        {{ $t('footer.contact.vat') }}
      </FooterContactRow>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BarcodeIcon, MailIcon, MapPinIcon, MessageCircleIcon } from 'lucide-vue-next'
import { CONTACT } from '#shared/brand'

const contactEmail = CONTACT.email
</script>
