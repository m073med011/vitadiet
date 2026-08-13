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




const siteUrl = useSiteConfig().url;



const siteOrigin = new URL("/", siteUrl).toString();
const websiteId = `${siteOrigin}#website`;
const organizationId = `${siteOrigin}#organization`;
const logoId = `${siteOrigin}#logo`;
const ogImageUrl = computed(() => new URL(ogImage, siteUrl).toString());
const logoUrl = computed(() => new URL(logo, siteUrl).toString());
const canonicalUrl = computed(() => new URL(route.fullPath, siteUrl).toString());
const schemaLanguage = computed<string>(() =>
  locale.value === "ar" ? "ar-SA" : "en-US"
);




const i18nHead = useLocaleHead();





const withNormalizedHref = <T extends { href?: string }>(links: T[]): T[] =>
  links.map((link) =>
    link.href?.startsWith("http") ? { ...link, href: new URL(link.href).toString() } : link
  );

useHead(() => ({
  htmlAttrs: i18nHead.value.htmlAttrs ?? {},
  link: [
    ...withNormalizedHref(i18nHead.value.link ?? []),
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
    { name: "google-site-verification", content: "iotPSwEweLS3-TklF4CVgoZPYtYdqepjZysk6zfoK34" },
    
    
    
    { name: "twitter:card", content: "summary_large_image" }
  ]
});

useSchemaOrg([
  defineOrganization({
    '@id': organizationId,
    name: 'Vitadiet',
    description: () => t('description'),
    logo: { '@id': logoId },
    url: siteOrigin,
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
  defineImage({
    '@id': logoId,
    url: () => logoUrl.value,
    contentUrl: () => logoUrl.value,
    caption: 'Vitadiet',
    inLanguage: schemaLanguage,
  }),
  defineWebSite({
    '@id': websiteId,
    url: siteOrigin,
    name: "Vitadiet",
    description: () => t("description"),
    inLanguage: schemaLanguage,
    publisher: { '@id': organizationId },
  }),
  defineWebPage<{ inLanguage: string }>({
    '@id': () => `${canonicalUrl.value}#webpage`,
    inLanguage: schemaLanguage,
    isPartOf: { '@id': websiteId },
    about: { '@id': organizationId },
    primaryImageOfPage: { '@id': logoId },
  }),
]);
</script>
