import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },

  css: ["aos/dist/aos.css", "~/assets/css/main.css"],

  vite: {
    plugins: [tailwindcss()],
    vue: {
      template: {
        transformAssetUrls: {
          BaseImage: ['src'],
        },
      },
    },
  },

  modules: ["@nuxtjs/i18n", "@nuxt/image", "@nuxt/fonts"],

  image: {
    format: ['webp'],
    quality: 80,
  },

  nitro: {
    compressPublicAssets: true,
  },

  routeRules: {
    '/_nuxt/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    '/_fonts/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    '/images/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
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
    restructureDir: ".",
    langDir: "app/locales",
    defaultLocale: "en",
    strategy: "prefix_except_default",
  },
});
