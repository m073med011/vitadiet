import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },

  css: ["~/assets/css/main.css"],

  vite: {
    plugins: [tailwindcss()],
  },

  modules: ["@nuxtjs/color-mode", "@nuxtjs/i18n"],

  colorMode: {
    classSuffix: "", // This is important for Tailwind dark mode, it will just add 'dark' instead of 'dark-mode'
  },

  i18n: {
    locales: [
      {
        code: "en",
        name: "English",
        dir: "ltr",
        file: "en.json",
      },
      {
        code: "ar",
        name: "العربية",
        dir: "rtl",
        file: "ar.json",
      },
    ],
    lazy: true,
    langDir: "locales",
    defaultLocale: "en",
    strategy: "prefix_except_default",
  },
});
