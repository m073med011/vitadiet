import tailwindcss from '@tailwindcss/vite'
import { BRAND_NAME_LATIN, SITE_URL } from './shared/site'
import { LEGAL_SLUGS } from './shared/legal'
import { PRODUCT_SLUGS } from './shared/products'

const paths = [
  '/',
  '/products',
  '/quality',
  '/partners',
  ...PRODUCT_SLUGS.map((slug) => `/product/${slug}`),
  ...LEGAL_SLUGS.map((slug) => `/legal/${slug}`),
]
const deploymentEnvironment = process.env.VITADIET_DEPLOY_ENV ?? 'production'
if (!['development', 'production'].includes(deploymentEnvironment)) {
  throw new Error(
    `VITADIET_DEPLOY_ENV must be "development" or "production", received "${deploymentEnvironment}".`,
  )
}
const isDevelopmentDeployment = deploymentEnvironment === 'development'
const noIndexDirective = 'noindex, nofollow, noarchive'

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      meta: isDevelopmentDeployment ? [{ name: 'googlebot', content: noIndexDirective }] : [],
    },
  },

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

  runtimeConfig: {
    public: {
      /**
       * Where the partnership form POSTs its JSON. Not hardcoded in the component so the
       * enquiry can be re-pointed at a CRM webhook later without a code change - set
       * NUXT_PUBLIC_PARTNER_FORM_ENDPOINT at build time.
       *
       * The default is the mail handler shipped in `public/api/partner-lead.php`, which
       * is what the current Apache/cPanel hosting can execute. See docs/PARTNER-FORM.md.
       */
      partnerFormEndpoint: '/api/partner-lead.php',
    },
  },

  site: {
    url: SITE_URL,
    indexable: !isDevelopmentDeployment,
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
    robotsDisabledValue: noIndexDirective,
  },

  image: {
    format: ['webp'],
    // `quality` is deliberately left at the encoder default (80 for webp). Setting it
    // adds a second modifier, which puts a literal "&" in every generated path
    // (/_ipx/q_80&s_288x393/...) - legal in a URL, but a common source of breakage on
    // Apache/cPanel hosting and in FTP/zip deploys. One modifier keeps paths plain.
    //
    // No explicit provider: the module serves images through the ipx runtime handler in
    // dev and switches to prerendered files for `nuxt generate`. Pinning 'ipxStatic'
    // here 404s every image in dev, because that provider has no runtime handler.
    // The screens/densities pair is what produces real resized variants instead of the
    // single full-resolution file that `provider: 'none'` used to emit.
    densities: [1, 2],
    screens: {
      xs: 320,
      sm: 480,
      md: 640,
      lg: 768,
      xl: 1024,
      xxl: 1280,
    },
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
