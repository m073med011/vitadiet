import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  css: ['~/assets/css/main.css'],

  vite: {
    build: {
      assetsInlineLimit: 0,
    },
    plugins: [tailwindcss()],
    vue: {
      template: {
        transformAssetUrls: {
          BaseImage: ['src'],
        },
      },
    },
    optimizeDeps: {
      include: [
        '@vue/devtools-core',
        '@vue/devtools-kit',
        '@unhead/schema-org/vue',
        'lucide-vue-next',
      ],
    },
  },

  modules: ['@nuxtjs/i18n', '@nuxt/image', '@nuxt/fonts', '@nuxtjs/seo'],

  site: {
    url: 'https://www.vitadiet.sa',
    trailingSlash: true,
    name: 'Vitadiet',
    description: 'Certified supplement portfolio for B2B distribution',
    defaultLocale: 'ar',
  },

  schemaOrg: {
    // The site has one canonical WebSite entity, shared by both locales.
    // Locale-aware defaults create /en/#website and translationOfWork nodes.
    defaults: false,
  },

  sitemap: {
    sources: ['/api/__sitemap__/urls'],
  },

  robots: {
    sitemap: '/sitemap_index.xml',
  },

  image: {
    format: ['webp'],
    quality: 80,
    provider: 'none',
  },

  nitro: {
    compressPublicAssets: true,
    prerender: {
      crawlLinks: true,
      failOnError: true,
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
        '/en',
        '/en/products',
        '/en/product/bestrong',
        '/en/product/becalme',
        '/en/product/vitagen',
        '/en/product/femavit',
        '/en/product/floradit',
        '/en/product/green-pharmacy',
        '/en/product/dplus',
        '/en/product/soluro',
        '/en/product/flowadite',
      ],
    },
  },

  experimental: {},

  routeRules: {
    '/_nuxt/**': { headers: { 'Cache-Control': 'public, max-age=31536000, immutable' } },
    '/_fonts/**': { headers: { 'Cache-Control': 'public, max-age=31536000, immutable' } },
    '/images/**': { headers: { 'Cache-Control': 'public, max-age=31536000, immutable' } },
    '/sitemap.xml': { robots: false, sitemap: false },
    '/en/sitemap.xml': { robots: false, sitemap: false },
  },

  i18n: {
    baseUrl: 'https://www.vitadiet.sa',
    locales: [
      {
        code: 'en',
        iso: 'en-US',
        name: 'English',
        dir: 'ltr',
        file: 'en.json',
      },
      {
        code: 'ar',
        iso: 'ar-SA',
        name: 'العربية',
        dir: 'rtl',
        file: 'ar.json',
      },
    ],
    restructureDir: '.',
    langDir: 'app/locales',
    defaultLocale: 'ar',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: false,

    trailingSlash: true,
  },
})
