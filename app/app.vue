<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const { locale, setLocale, t } = useI18n();

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
    { property: "og:description", content: () => t("description") }
  ]
});
</script>
