export const CONTACT = {
  phone: '+966508178161',
  whatsappUrl: 'https://wa.me/966508178161',
  email: 'acc@vitadiet.sa',
  vatId: '302135132900003',
  address: {
    streetAddress:
      'Palestine Street, Al Hamra District, Palestine Commercial Center, First Floor, Office No. 12',
    addressLocality: 'Jeddah',
    addressCountry: 'SA',
  },
} as const

/**
 * Canonical social profiles. Single source for footer links AND Organization.sameAs.
 *
 * These are written in the form the platform itself serves, so a click is one request
 * and not a redirect chain. LinkedIn, Instagram, and Snapchat all normalise a handle to
 * lower case and 301 anything else, which is why the capitalised spellings were replaced.
 */
export const SOCIAL_URLS = {
  linkedin: 'https://www.linkedin.com/company/vitadiet/',
  instagram: 'https://www.instagram.com/vitadiet.sa/',
  tiktok: 'https://www.tiktok.com/@vitadiet.sa',
  x: 'https://x.com/Vitadiet_sa',
  snapchat: 'https://www.snapchat.com/add/vitadiet',
} as const

export const ASSETS = {
  logo: '/images/vitadiet-official-logo.svg',
  ogImage: '/images/vitadiet-social-share-preview.png',
  catalog: '/vitadiet-catalog.pdf',
} as const

export const OG_IMAGE_SIZE = { width: 1080, height: 356 } as const

/**
 * Must stay in sync with --color-brand-primary in app/assets/css/_tokens.css.
 * A <meta> tag cannot read a CSS custom property.
 */
export const THEME_COLOR = '#1a7039'
