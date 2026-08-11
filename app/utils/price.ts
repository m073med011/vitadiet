/**
 * Returns true when the translated price string contains at least one
 * ASCII digit. Used to decide whether to show the SAR currency icon.
 */
export function isNumericPrice(translatedPrice: string): boolean {
  return /\d/.test(translatedPrice)
}

/**
 * Normalizes Arabic-Indic digits (٠–٩) to ASCII, strips non-numeric
 * characters, and returns a clean price string — or `null` when the
 * input contains no digits at all (e.g. "Coming Soon").
 */
export function parseOfferPrice(translatedPrice: string): string | null {
  const normalized = translatedPrice.replace(/[٠-٩]/g, (d) =>
    String(d.charCodeAt(0) - 0x0660),
  )
  return /\d/.test(normalized) ? normalized.replace(/[^\d.]/g, '') : null
}
