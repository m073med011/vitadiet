import tailwindcss from '@tailwindcss/vite'
import { BRAND_NAME_LATIN, SITE_URL } from './shared/site'
import { PRODUCT_SLUGS } from './shared/products'

const paths = ['/', '/products', ...PRODUCT_SLUGS.map((slug) => `/product/${slug}`)]

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  css: ['~/assets/css/main.css'],

  vite: {
    build: {
      assetsInlineLimit: 0,
    },
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: ['@unhead/schema-org/vue', 'lucide-vue-next'],
    },
  },

  modules: ['@nuxtjs/i18n', '@nuxt/image', '@nuxt/fonts', '@nuxtjs/seo', '@nuxt/eslint'],

  site: {
    url: SITE_URL,
    trailingSlash: true,
    name: BRAND_NAME_LATIN,
    description: 'European dietary supplements for everyday wellness in Saudi Arabia',
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
        ...paths,
        ...paths.map((path) => (path === '/' ? '/en' : `/en${path}`)),
        '/404.html',
      ],
    },
  },

  routeRules: {
    '/_nuxt/**': { headers: { 'Cache-Control': 'public, max-age=31536000, immutable' } },
    '/_fonts/**': { headers: { 'Cache-Control': 'public, max-age=31536000, immutable' } },
    '/images/**': { headers: { 'Cache-Control': 'public, max-age=31536000, immutable' } },
  },

  i18n: {
    baseUrl: SITE_URL,
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
