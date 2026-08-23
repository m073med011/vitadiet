export const SITE_URL = 'https://www.vitadiet.sa'
export const SITE_ORIGIN = `${SITE_URL}/`

/**
 * Latin legal/brand name used in JSON-LD and site.name.
 * NOT $t('appName') - the Arabic display name is localized copy.
 */
export const BRAND_NAME_LATIN = 'Vitadiet'

export const BCP47_BY_LOCALE = { ar: 'ar-SA', en: 'en-US' } as const
export type AppLocale = keyof typeof BCP47_BY_LOCALE

export const SCHEMA_ID = {
  organization: `${SITE_ORIGIN}#organization`,
  website: `${SITE_ORIGIN}#website`,
  logo: `${SITE_ORIGIN}#logo`,
} as const

export const absoluteUrl = (path: string, origin: string = SITE_URL): string =>
  new URL(path, origin).toString()
