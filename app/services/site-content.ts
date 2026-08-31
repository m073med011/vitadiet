import { toAppLocale } from '#shared/site'
import type {
  ApprovedCopy,
  LegalDocument,
  LegalSection,
  LocalizedCopy,
  PartnerFormOption,
  PartnerFormOptions,
  QualityPillar,
} from '~/types'
import { isApproved, localizeApprovedCopy, localizeCopy } from '~/services/product-catalog'

/**
 * Read layer for `app/data/site-content.ts`, mirroring `app/services/product-catalog.ts`.
 *
 * Pages call the async getters below through `useAsyncData`, so they already render the
 * pending and error branches a remote source would produce. Pointing them at a Dashboard
 * API later means replacing these three function bodies with `$fetch` - no page, no
 * component, and no URL changes.
 */

export const getQualityPillars = async (): Promise<QualityPillar[]> => {
  const { qualityPillars } = await import('~/data/site-content')
  return qualityPillars.filter((pillar) => isApproved(pillar.title.status))
}

export const getLegalDocuments = async (): Promise<LegalDocument[]> => {
  const { legalDocuments } = await import('~/data/site-content')
  return legalDocuments
}

export const getLegalDocumentBySlug = async (slug: string): Promise<LegalDocument | undefined> => {
  const documents = await getLegalDocuments()
  return documents.find((document) => document.slug === slug)
}

export const getPartnerFormOptions = async (): Promise<PartnerFormOptions> => {
  const { partnerFormOptions } = await import('~/data/site-content')
  return partnerFormOptions
}

/* ---------------------------------------------------------------------------- *
 * Localisation helpers. Components call these instead of indexing `.ar` / `.en`
 * themselves, so the approval gate is applied in exactly one place.
 * ---------------------------------------------------------------------------- */

export interface LocalizedQualityPillar {
  description: string
  iconKey: QualityPillar['iconKey']
  id: string
  points: string[]
  title: string
}

const localizeApprovedList = (items: ApprovedCopy[] | undefined, locale: string): string[] =>
  (items ?? [])
    .filter((item) => isApproved(item.status))
    .map((item) => localizeCopy(item.text, locale))

export const localizeQualityPillar = (
  pillar: QualityPillar,
  locale: string,
): LocalizedQualityPillar => ({
  description: localizeApprovedCopy(pillar.description, locale) ?? '',
  iconKey: pillar.iconKey,
  id: pillar.id,
  points: localizeApprovedList(pillar.points, locale),
  title: localizeApprovedCopy(pillar.title, locale) ?? '',
})

export interface LocalizedLegalSection {
  body: string[]
  heading: string
  id: string
}

/** A section ships only when its heading is approved; unapproved paragraphs drop out. */
export const localizeLegalSections = (
  sections: LegalSection[],
  locale: string,
): LocalizedLegalSection[] =>
  sections
    .filter((section) => isApproved(section.heading.status))
    .map((section) => ({
      body: localizeApprovedList(section.body, locale),
      heading: localizeCopy(section.heading.text, locale),
      id: section.id,
    }))
    .filter((section) => section.body.length > 0)

export const getLegalTitle = (document: LegalDocument, locale: string): string =>
  localizeCopy(document.title, locale)

export const localizeOptions = (
  options: PartnerFormOption[],
  locale: string,
): { id: string; label: string }[] =>
  options.map((option) => ({ id: option.id, label: localizeCopy(option.label, locale) }))

/** Narrow a submitted option id back to a known option, so nothing free-typed is emailed. */
export const findOptionLabel = (
  options: PartnerFormOption[],
  id: string,
  locale: string,
): string | undefined => {
  const option = options.find((candidate) => candidate.id === id)
  return option ? localizeCopy(option.label, locale) : undefined
}

export const localizeText = (copy: LocalizedCopy, locale: string): string =>
  copy[toAppLocale(locale)]
