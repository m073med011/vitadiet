<template>
  <div class="bg-surface pt-section-sm pb-section">
    <div class="content-container">
      <BaseBreadcrumb :items="breadcrumbItems" />

      <header class="mx-auto mt-page max-w-copy text-center" data-aos="fade-up">
        <p class="eyebrow-pill mx-auto mb-page">{{ $t('partnerSection.eyebrow') }}</p>
        <h1 class="text-heading-lg font-bold leading-heading text-ink">
          {{ $t('partnerPage.heading') }}
        </h1>
        <p class="mt-page text-copy-lg leading-copy text-ink-soft">
          {{ $t('partnerPage.description') }}
        </p>
      </header>

      <!-- Direct contact routes stay visible next to the form. The form is the primary
           path, but a pharmacy that would rather phone should not have to fill it in. -->
      <div class="mt-gutter-lg grid gap-page sm:grid-cols-3">
        <a
          v-for="channel in directChannels"
          :key="channel.label"
          :href="channel.href"
          :target="channel.external ? '_blank' : undefined"
          :rel="channel.external ? 'noopener noreferrer' : undefined"
          class="focus-ring flex min-h-16 items-center gap-page rounded-card border border-line bg-surface-raised px-page py-page text-ink transition-colors hover:border-brand-primary hover:text-brand-primary"
        >
          <component
            :is="channel.icon"
            class="h-icon-lg w-icon-lg shrink-0 text-brand-primary"
            aria-hidden="true"
          />
          <span class="min-w-0">
            <span class="block text-caption font-bold uppercase tracking-label text-ink-subtle">
              {{ channel.label }}
            </span>
            <span class="block truncate text-small font-semibold" dir="ltr">{{
              channel.value
            }}</span>
          </span>
        </a>
      </div>

      <section class="mt-gutter-lg" :aria-labelledby="formHeadingId">
        <h2 :id="formHeadingId" class="mb-page text-heading font-bold leading-heading text-ink">
          {{ $t('partnerPage.formHeading') }}
        </h2>

        <p v-if="isLoading" class="alert alert--notice" role="status" aria-live="polite">
          {{ $t('partnerPage.loading') }}
        </p>

        <div v-else-if="!options" class="alert alert--error" role="alert">
          <AlertCircleIcon
            class="mt-0.5 h-icon-md w-icon-md shrink-0 text-danger"
            aria-hidden="true"
          />
          <p>{{ $t('partnerPage.error', { email: contactEmail }) }}</p>
        </div>

        <PartnerForm v-else :options="options" />
      </section>

      <section
        class="mt-gutter-lg grid gap-page rounded-card border border-line bg-surface-raised p-card"
      >
        <h2 class="text-title font-bold text-ink">{{ $t('partnerPage.filesHeading') }}</h2>
        <p class="text-copy leading-copy text-ink-soft">{{ $t('partnerPage.filesDescription') }}</p>
        <div class="flex flex-wrap gap-page">
          <BaseButton :href="ASSETS.catalog" :download="$t('catalog.filename')" variant="primary">
            <FileDownIcon class="h-icon-sm w-icon-sm" aria-hidden="true" />
            {{ $t('partnerSection.catalog') }}
          </BaseButton>
          <BaseButton :to="localePath('/quality/')" variant="secondary">
            {{ $t('qualityPage.cta') }}
          </BaseButton>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  AlertCircleIcon,
  FileDownIcon,
  MailIcon,
  MessageCircleIcon,
  PhoneIcon,
} from 'lucide-vue-next'
import { ASSETS, CONTACT } from '#shared/brand'
import { getPartnerFormOptions } from '~/services/site-content'

const { t } = useI18n()
const localePath = useLocalePath()
const { absoluteSiteUrl } = useSiteUrls()

const contactEmail = CONTACT.email
const formHeadingId = useId()

// Resolved through the service layer, so a Dashboard-managed option list can replace the
// source without touching this page. The pending and error branches are already rendered.
const { data: options, status } = await useAsyncData('partner-form-options', () =>
  getPartnerFormOptions(),
)
const isLoading = computed(() => status.value === 'pending')

const directChannels = computed(() => [
  {
    label: t('partnerPage.channels.email'),
    value: contactEmail,
    href: `mailto:${contactEmail}`,
    icon: MailIcon,
    external: false,
  },
  {
    label: t('partnerPage.channels.whatsapp'),
    value: CONTACT.phone,
    href: CONTACT.whatsappUrl,
    icon: MessageCircleIcon,
    external: true,
  },
  {
    label: t('partnerPage.channels.phone'),
    value: CONTACT.phone,
    href: `tel:${CONTACT.phone}`,
    icon: PhoneIcon,
    external: false,
  },
])

const breadcrumbItems = computed(() => [
  { label: t('home'), to: localePath('/') },
  { label: t('partners'), to: localePath('/partners/') },
])

useSchemaOrg([
  defineBreadcrumb({
    itemListElement: breadcrumbItems.value.map((item) => ({
      name: item.label,
      item: absoluteSiteUrl(item.to),
    })),
  }),
])

usePageSeo({
  title: () => t('partnerPage.heading'),
  description: () => t('partnerPage.description'),
})
</script>
