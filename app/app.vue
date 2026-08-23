<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ASSETS, CONTACT, SOCIAL_URLS, THEME_COLOR } from '#shared/brand'
import {
  BCP47_BY_LOCALE,
  BRAND_NAME_LATIN,
  SCHEMA_ID,
  SITE_ORIGIN,
  type AppLocale,
} from '#shared/site'

const { t, locale } = useI18n()
const { absoluteSiteUrl, canonicalUrl, withNormalizedHref } = useSiteUrls()

const logoUrl = computed(() => absoluteSiteUrl(ASSETS.logo))
const schemaLanguage = computed<string>(() => BCP47_BY_LOCALE[locale.value as AppLocale])

const i18nHead = useLocaleHead()

useHead(() => ({
  htmlAttrs: i18nHead.value.htmlAttrs ?? {},
  link: [
    ...withNormalizedHref(i18nHead.value.link ?? []),
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    { rel: 'icon', type: 'image/svg+xml', href: logoUrl.value },
    { rel: 'apple-touch-icon', href: logoUrl.value },
  ],
  meta: i18nHead.value.meta ?? [],
}))

useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - ${t('appName')}` : t('appName')
  },
  meta: [
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: () => t('appName') },
    { property: 'og:url', content: () => canonicalUrl.value },
    { name: 'theme-color', content: THEME_COLOR },
    { name: 'google-site-verification', content: 'iotPSwEweLS3-TklF4CVgoZPYtYdqepjZysk6zfoK34' },

    { name: 'twitter:card', content: 'summary_large_image' },
  ],
})

useSchemaOrg([
  defineOrganization({
    '@id': SCHEMA_ID.organization,
    name: BRAND_NAME_LATIN,
    description: () => t('description'),
    logo: { '@id': SCHEMA_ID.logo },
    url: SITE_ORIGIN,
    sameAs: Object.values(SOCIAL_URLS),
    address: {
      '@type': 'PostalAddress',
      ...CONTACT.address,
    },
    telephone: CONTACT.phone,
    email: CONTACT.email,
    vatID: CONTACT.vatId,
  }),
  defineImage({
    '@id': SCHEMA_ID.logo,
    url: () => logoUrl.value,
    contentUrl: () => logoUrl.value,
    caption: BRAND_NAME_LATIN,
    inLanguage: schemaLanguage,
  }),
  defineWebSite({
    '@id': SCHEMA_ID.website,
    url: SITE_ORIGIN,
    name: BRAND_NAME_LATIN,
    description: () => t('description'),
    inLanguage: schemaLanguage,
    publisher: { '@id': SCHEMA_ID.organization },
  }),
  defineWebPage<{ inLanguage: string }>({
    '@id': () => `${canonicalUrl.value}#webpage`,
    inLanguage: schemaLanguage,
    isPartOf: { '@id': SCHEMA_ID.website },
    about: { '@id': SCHEMA_ID.organization },
    primaryImageOfPage: { '@id': SCHEMA_ID.logo },
  }),
])
</script>
