import tailwindcss from '@tailwindcss/vite'
import { BRAND_NAME_LATIN, SITE_URL } from './shared/site'
import { LEGAL_SLUGS } from './shared/legal'

/**
 * Routes whose paths this repository knows. `/product/<slug>/` is deliberately absent:
 * the catalog lives in the Dashboard, and `prerender.crawlLinks` discovers every product
 * page from the `/products/` index - which is itself rendered from the same API response
 * - in both locales. A slug list here could only ever be a second, staler copy of it.
 */
const paths = [
  '/',
  '/products',
  '/quality',
  '/partners',
  // Prerendered so `scripts/build-404.mjs` has a server-rendered page to copy over
  // nitro's empty 404.html shell. Kept out of the sitemap and marked noindex.
  '/404',
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
       * Root of the Vitadiet Dashboard REST API, including the version segment. Every
       * request made through `useApi()` resolves against it, so moving between the local
       * Laravel instance and the hosted dashboard is one env var at build time:
       * NUXT_PUBLIC_API_BASE_URL. A trailing slash is optional - the client joins paths.
       */
      apiBaseUrl: 'https://dashboard.vitadiet.sa/api/v1',

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
    // Prerendered routes are auto-discovered, so the error document and the sitemap
    // module's own shell routes are excluded explicitly rather than relying on their
    // noindex rules to keep them out.
    exclude: ['/404', '/en/404', '/sitemap.xml', '/en/sitemap.xml'],
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
    /**
     * Off deliberately. The site is uploaded to Apache/cPanel, which does not serve a
     * `.br`/`.gz` twin without content-negotiation rules that public/.htaccess does not
     * carry - so every twin was dead weight in the deploy (including a second and third
     * copy of the 3 MB catalog PDF, and `.htaccess.br`/`.htaccess.gz` copies of the
     * server config next to the file itself). Turn this back on if the site ever moves
     * to a Node/nitro host that reads them.
     */
    compressPublicAssets: false,
    prerender: {
      crawlLinks: true,
      failOnError: true,
      /**
       * The sitemap module registers `/sitemap.xml`, and the i18n prefix strategy turns
       * that into an `/en/sitemap.xml` app route too. The English one used to prerender
       * as a real, indexable HTML page with no <h1> and no content beyond the header and
       * footer - a thin page bots find by probing the conventional path. Nothing links to
       * it, so it is not generated at all; a request now falls through to the 404
       * document. The Arabic `/sitemap.xml` stays: it is the redirect stub to
       * /sitemap_index.xml that the conventional path is supposed to serve.
       */
      ignore: ['/en/sitemap.xml'],
      // `/404.html` is not listed: nitro renders it as an empty SPA shell. The real error
      // document is built from the prerendered `/404` route by scripts/build-404.mjs.
      routes: [...paths, ...paths.map((path) => (path === '/' ? '/en' : `/en${path}`))],
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
