<template>
  <!-- scroll-mt clears the sticky header when the footer "contact us" link jumps here. -->
  <div id="contact" class="footer-contact-col scroll-mt-28" data-aos="fade-up" data-aos-delay="200">
    <FooterColumnHeading :label="$t('contact')" />
    <div class="space-y-icon-md">
      <FooterContactRow :icon="Building2Icon">
        {{ $t('footer.contact.company') }}
      </FooterContactRow>

      <FooterContactRow :icon="MapPinIcon" pre-line>
        {{ $t('footer.contact.address') }}
      </FooterContactRow>

      <FooterContactRow :icon="MessageCircleIcon" :href="CONTACT.whatsappUrl" external dir="ltr">
        {{ CONTACT.phone }}
      </FooterContactRow>

      <!-- Single approved business address for every enquiry route on the site. -->
      <FooterContactRow :icon="MailIcon" :href="`mailto:${contactEmail}`" dir="ltr">
        {{ contactEmail }}
      </FooterContactRow>

      <FooterContactRow :icon="BarcodeIcon">
        {{ $t('footer.contact.vat') }}
      </FooterContactRow>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  BarcodeIcon,
  Building2Icon,
  MailIcon,
  MapPinIcon,
  MessageCircleIcon,
} from 'lucide-vue-next'
import { CONTACT } from '#shared/brand'

const contactEmail = CONTACT.email
</script>
