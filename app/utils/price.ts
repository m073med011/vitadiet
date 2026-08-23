export function isNumericPrice(translatedPrice: string): boolean {
  return /\d/.test(translatedPrice)
}

export function parseOfferPrice(translatedPrice: string): string | null {
  const normalized = translatedPrice.replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))
  return /\d/.test(normalized) ? normalized.replace(/[^\d.]/g, '') : null
}
