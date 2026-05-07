<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
import ogImage from "~/assets/images/ogimage.png";

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
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:image", content: () => ogImageUrl.value }
  ]
});
</script>
