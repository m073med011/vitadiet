export const SITE_URL = 'https://www.vitadiet.sa'
export const SITE_ORIGIN = `${SITE_URL}/`

/**
 * Latin legal/brand name used in JSON-LD and site.name.
 * NOT $t('appName') - the Arabic display name is localized copy.
 */
export const BRAND_NAME_LATIN = 'Vitadiet'

export const BCP47_BY_LOCALE = { ar: 'ar-SA', en: 'en-US' } as const
export type AppLocale = keyof typeof BCP47_BY_LOCALE

/**
 * The i18n module types `locale` as a plain string, so every consumer indexing a
 * locale-keyed map used to cast. Narrowing happens here instead, with the same 'en'
 * fallback `localizeCopy` has always applied to an unrecognised locale.
 */
export const toAppLocale = (locale: string): AppLocale => (locale === 'ar' ? 'ar' : 'en')

export const SCHEMA_ID = {
  organization: `${SITE_ORIGIN}#organization`,
  website: `${SITE_ORIGIN}#website`,
  logo: `${SITE_ORIGIN}#logo`,
} as const
