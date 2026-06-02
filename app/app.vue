<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const ogImage = "/images/vitadiet-social-share-preview.png";
const logo = "/images/vitadiet-official-logo.svg";

const { t } = useI18n();
const requestUrl = useRequestURL();
const ogImageUrl = computed(() => new URL(ogImage, requestUrl.origin).toString());
const logoUrl = computed(() => new URL(logo, requestUrl.origin).toString());

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
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: () => t("appName") },
    { property: "og:url", content: () => requestUrl.href },
    { name: "theme-color", content: "#1d2b5b" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: () => t("seoTitle") },
    { name: "twitter:description", content: () => t("description") },
    { name: "twitter:image", content: () => ogImageUrl.value }
  ]
});

useSchemaOrg([
  defineOrganization({
    name: "Vitadiet",
    description: () => t("description"),
    logo: () => logoUrl.value,
    url: "https://vitadiet.sa",
    sameAs: [
      "https://www.linkedin.com/company/Vitadiet",
      "https://www.instagram.com/Vitadiet.sa",
      "https://www.tiktok.com/@vitadiet.sa",
      "https://x.com/Vitadiet_sa",
      "https://www.snapchat.com/add/Vitadiet",
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: "Palestine Street, Al Hamra District, Palestine Commercial Center, First Floor, Office No. 12",
      addressLocality: "Jeddah",
      addressCountry: "SA",
    },
    telephone: "+966508178161",
    email: "acc@vitadiet.sa",
    vatID: "302135132900003",
  }),
  defineWebSite({
    name: "Vitadiet",
    description: () => t("description"),
  }),
]);
</script>
