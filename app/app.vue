<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
import ogImage from "~/assets/images/vitadiet-social-share-preview.png";

const { locale, setLocale, t } = useI18n();
const requestUrl = useRequestURL();
const ogImageUrl = computed(() => new URL(ogImage, requestUrl.origin).toString());

useHead({
  htmlAttrs: {
    lang: computed(() => locale.value),
    dir: computed(() => (locale.value === "ar" ? "rtl" : "ltr")),
  },
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - ${t('appName')}` : t('appName');
  },
  meta: [
    { name: "description", content: () => t("description") },
    { property: "og:title", content: () => t("welcome") },
    { property: "og:description", content: () => t("description") },
    { property: "og:image", content: () => ogImageUrl.value },
    { property: "og:image:type", content: "image/png" },
    { property: "og:image:width", content: "1080" },
    { property: "og:image:height", content: "356" },
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: () => t("appName") },
    { property: "og:url", content: () => requestUrl.href },
    { property: "og:locale", content: () => (locale.value === "ar" ? "ar_SA" : "en_US") },
    { property: "og:locale:alternate", content: () => (locale.value === "ar" ? "en_US" : "ar_SA") },
    { name: "theme-color", content: "#1d2b5b" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: () => t("welcome") },
    { name: "twitter:description", content: () => t("description") },
    { name: "twitter:image", content: () => ogImageUrl.value }
  ]
});

useSchemaOrg([
  defineOrganization({
    name: "Vitadiet",
    description: () => t("description"),
    logo: "/favicon.ico",
    url: "https://vitadiet.sa",
    sameAs: [
      "https://www.linkedin.com/company/Vitadiet",
      "https://www.instagram.com/Vitadiet.sa",
      "https://www.tiktok.com/@vitadiet.sa",
      "https://x.com/Vitadiet_sa",
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: "Palestine Street, Al Hamra District, Palestine Commercial Center, First Floor, Office No. 12",
      addressLocality: "Jeddah",
      addressCountry: "SA",
    },
    telephone: "+966508178161",
    vatID: "302135132900003",
  }),
  defineWebSite({
    name: "Vitadiet",
    description: () => t("description"),
  }),
]);
</script>
