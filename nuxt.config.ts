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

  modules: ["@nuxtjs/i18n", "@nuxt/image", "@nuxt/fonts", "@nuxtjs/seo"],

  site: {
    url: 'https://vitadiet.sa',
    name: 'Vitadiet',
    description: 'Certified supplement portfolio for B2B distribution',
    defaultLocale: 'en'
  },

  sitemap: {
    // Dynamic product routes are supplied by server/api/__sitemap__/urls.ts
    sources: ['/api/__sitemap__/urls'],
  },

  robots: {
    // Allow everything; expose the sitemap location.
    sitemap: '/sitemap.xml',
  },

  image: {
    format: ['webp'],
    quality: 80,
  },

  nitro: {
    compressPublicAssets: true,
    prerender: {
      crawlLinks: true,
      // Seed routes so the crawler reaches dynamic product pages in both locales.
      routes: [
        '/',
        '/products',
        '/product/bestrong',
        '/product/becalme',
        '/product/vitagen',
        '/product/femavit',
        '/product/floradit',
        '/product/green-pharmacy',
        '/product/dplus',
        '/product/soluro',
        '/product/flowadite',
      ],
    },
  },

  routeRules: {
    '/_nuxt/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    '/_fonts/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    '/images/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
  },


  i18n: {
    baseUrl: 'https://vitadiet.sa',
    locales: [
      {
        code: "en",
        iso: "en-US",
        name: "English",
        dir: "ltr",
        file: "en.json",
      },
      {
        code: "ar",
        iso: "ar-SA",
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
