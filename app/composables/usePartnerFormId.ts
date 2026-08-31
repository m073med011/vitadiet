import type { InjectionKey } from 'vue'

/**
 * The partnership form generates one id prefix and shares it with every field, so a
 * label's `for`, the control's `id`, and the error-summary anchor are guaranteed to
 * agree. Passing it through provide/inject keeps the form template free of id plumbing.
 */
export const PARTNER_FORM_ID: InjectionKey<string> = Symbol('partner-form-id')
