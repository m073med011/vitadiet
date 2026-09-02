import type { PartnerLead } from '~/types'

/**
 * Validation and transport for the partnership enquiry, kept out of the form component
 * so the rules can be read (and later reused by a Dashboard or a real CRM) in one place.
 *
 * The transport is deliberately thin: one POST of JSON to a configurable endpoint. The
 * endpoint is a runtime config value, not a hardcoded URL, so moving from the bundled
 * mail handler to a CRM webhook is an environment change rather than a code change.
 */

export type PartnerLeadField = keyof PartnerLead

/** i18n key suffixes under `partnerForm.errors.*`. */
export type PartnerLeadErrorKey =
  'required' | 'email' | 'phone' | 'consent' | 'tooLong' | 'selectOne'

export type PartnerLeadErrors = Partial<Record<PartnerLeadField, PartnerLeadErrorKey>>

export const MESSAGE_MAX_LENGTH = 1200
const TEXT_MAX_LENGTH = 120

/**
 * Deliberately permissive: a stricter pattern rejects valid addresses far more often
 * than it catches typos, and the real check is whether the reply arrives.
 */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/**
 * Saudi and international dialling: digits, optional leading +, and the separators
 * people actually paste. Length is checked on the digits alone.
 */
const PHONE_ALLOWED = /^[+()\-\s\d]+$/

export const createEmptyLead = (): PartnerLead => ({
  city: '',
  consent: false,
  email: '',
  facilityName: '',
  facilityType: '',
  interestedProducts: [],
  message: '',
  name: '',
  partnershipType: '',
  phone: '',
})

const requiredText = (
  value: string,
  errors: PartnerLeadErrors,
  field: PartnerLeadField,
  maxLength = TEXT_MAX_LENGTH,
) => {
  const trimmed = value.trim()
  if (!trimmed) {
    errors[field] = 'required'
    return
  }
  if (trimmed.length > maxLength) errors[field] = 'tooLong'
}

export const validatePartnerLead = (lead: PartnerLead): PartnerLeadErrors => {
  const errors: PartnerLeadErrors = {}

  requiredText(lead.name, errors, 'name')
  requiredText(lead.facilityName, errors, 'facilityName')
  requiredText(lead.city, errors, 'city')

  if (!lead.facilityType) errors.facilityType = 'selectOne'
  if (!lead.partnershipType) errors.partnershipType = 'selectOne'

  const email = lead.email.trim()
  if (!email) {
    errors.email = 'required'
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = 'email'
  }

  const phone = lead.phone.trim()
  const phoneDigits = phone.replace(/\D/g, '')
  if (!phone) {
    errors.phone = 'required'
  } else if (!PHONE_ALLOWED.test(phone) || phoneDigits.length < 9 || phoneDigits.length > 15) {
    errors.phone = 'phone'
  }

  const message = lead.message.trim()
  if (!message) {
    errors.message = 'required'
  } else if (message.length > MESSAGE_MAX_LENGTH) {
    errors.message = 'tooLong'
  }

  if (!lead.consent) errors.consent = 'consent'

  return errors
}

export const hasErrors = (errors: PartnerLeadErrors): boolean => Object.keys(errors).length > 0

/** Canonical field order, used to list validation errors the way the form reads. */
export const FIELD_ORDER: PartnerLeadField[] = [
  'name',
  'facilityName',
  'facilityType',
  'city',
  'email',
  'phone',
  'partnershipType',
  'interestedProducts',
  'message',
  'consent',
]

export type PartnerLeadOutcome = 'success' | 'server_error' | 'network_error'

export interface PartnerLeadPayload extends PartnerLead {
  /** Locale the enquiry was written in, so the reply goes out in the same language. */
  locale: string
  /** Page the enquiry was sent from, for context in the received email. */
  sourceUrl: string
  /**
   * Honeypot. Hidden from sight, from assistive technology and from the tab order, so a
   * person leaves it empty and a bot that fills every input does not. The handler drops
   * any submission that carries a value.
   *
   * Transport-only: it is deliberately not part of `PartnerLead`, because it is not a
   * field of the enquiry and must never appear in validation or in the error summary.
   */
  website: string
}

/**
 * A `fetch` that rejects is a network problem (offline, DNS, CORS, blocked request); a
 * response that arrives with a non-2xx status, or with a body that is not the expected
 * JSON, is a server problem. The form shows a different message for each, because the
 * useful next step differs: retry versus email the team directly.
 */
export const submitPartnerLead = async (
  endpoint: string,
  payload: PartnerLeadPayload,
  signal?: AbortSignal,
): Promise<PartnerLeadOutcome> => {
  let response: Response

  try {
    response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
      signal,
    })
  } catch {
    return 'network_error'
  }

  if (!response.ok) return 'server_error'

  try {
    const body = (await response.json()) as { ok?: boolean }
    return body?.ok === true ? 'success' : 'server_error'
  } catch {
    // A 200 that is not JSON means the endpoint is misconfigured - most often a PHP
    // handler served as plain text because the module is disabled on the host.
    return 'server_error'
  }
}
