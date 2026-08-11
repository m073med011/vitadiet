<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const ogImage = "/images/vitadiet-social-share-preview.png";
const logo = "/images/vitadiet-official-logo.svg";

const { t, locale } = useI18n();
const route = useRoute();

// Absolute URLs must be built from the configured site origin, NOT useRequestURL():
// during static prerender there is no real request host, so useRequestURL() resolves
// to http://localhost and leaks that into canonical/og:url/schema URLs.
const siteUrl = useSiteConfig().url;
const ogImageUrl = computed(() => new URL(ogImage, siteUrl).toString());
const logoUrl = computed(() => new URL(logo, siteUrl).toString());
const canonicalUrl = computed(() => new URL(route.fullPath, siteUrl).toString());

// i18n SEO head: emits per-locale canonical + hreflang alternates (incl. x-default),
// the html lang/dir attributes, and og:locale[:alternate]. Without this the en/ar
// versions don't reference each other and risk being treated as duplicate content.
const i18nHead = useLocaleHead();

useHead(() => ({
  htmlAttrs: i18nHead.value.htmlAttrs ?? {},
  link: [
    ...(i18nHead.value.link ?? []),
    { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
    { rel: "icon", type: "image/svg+xml", href: logoUrl.value },
    { rel: "apple-touch-icon", href: logoUrl.value },
  ],
  meta: i18nHead.value.meta ?? [],
}));

useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - ${t('appName')}` : t('appName');
  },
  meta: [
    { name: "description", content: () => t("description") },
    { property: "og:title", content: () => t("seoTitle") },
    { property: "og:description", content: () => t("description") },
    { property: "og:image", content: () => ogImageUrl.value },
    { property: "og:image:type", content: "image/png" },
    { property: "og:image:width", content: "1080" },
    { property: "og:image:height", content: "356" },
    { property: "og:image:alt", content: () => t("seoTitle") },
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: () => t("appName") },
    { property: "og:url", content: () => canonicalUrl.value },
    { name: "theme-color", content: "#1a7039" },
    // Only twitter:card is global. twitter:title/description/image are intentionally
    // omitted so X/Twitter falls back to the per-page og:* tags — otherwise every
    // product share would inherit the homepage title/description/image.
    { name: "twitter:card", content: "summary_large_image" }
  ]
});

useSchemaOrg([
  defineOrganization({
    '@id': `${siteUrl}#identity`,
    name: 'Vitadiet',
    description: () => t('description'),
    logo: () => logoUrl.value,
    url: siteUrl,
    sameAs: [
      'https://www.linkedin.com/company/Vitadiet',
      'https://www.instagram.com/Vitadiet.sa',
      'https://www.tiktok.com/@vitadiet.sa',
      'https://x.com/Vitadiet_sa',
      'https://www.snapchat.com/add/Vitadiet',
    ],
    address: { '@type': 'PostalAddress', streetAddress: 'Palestine Street, Al Hamra District, Palestine Commercial Center, First Floor, Office No. 12', addressLocality: 'Jeddah', addressCountry: 'SA' },
    telephone: '+966508178161', email: 'acc@vitadiet.sa', vatID: '302135132900003',
  }),
  defineWebSite({
    name: "Vitadiet",
    description: () => t("description"),
  }),
  defineWebPage({
    inLanguage: () => locale.value === 'ar' ? 'ar-SA' : 'en-US',
  }),
]);
</script>
