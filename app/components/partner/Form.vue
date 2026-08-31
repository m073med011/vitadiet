<template>
  <div class="mx-auto w-full max-w-3xl">
    <!-- SUCCESS -->
    <div v-if="status === 'success'" class="grid gap-page" data-testid="partner-form-success">
      <div ref="successPanel" class="alert alert--success" tabindex="-1" role="status">
        <CheckCircle2Icon
          class="mt-0.5 h-icon-lg w-icon-lg shrink-0 text-success"
          aria-hidden="true"
        />
        <div>
          <h2 class="text-title font-bold text-ink">{{ $t('partnerForm.success.title') }}</h2>
          <p class="mt-1 text-copy leading-copy text-ink-soft">
            {{ $t('partnerForm.success.description', { email: contactEmail }) }}
          </p>
        </div>
      </div>
      <div class="flex flex-wrap gap-page">
        <BaseButton native-type="button" variant="secondary" @click="resetForm">
          {{ $t('partnerForm.success.again') }}
        </BaseButton>
        <BaseButton :to="localePath('/products/')" variant="primary">
          {{ $t('qualityPage.productsCta') }}
        </BaseButton>
      </div>
    </div>

    <!-- DEFAULT / VALIDATION / LOADING / ERROR -->
    <form v-else novalidate class="grid gap-gutter" @submit.prevent="onSubmit">
      <!--
        Without JavaScript the fetch below cannot run, so the page must still tell the
        visitor how to reach the team. This is the JS-disabled fallback for the form.

        The content is a single text interpolation, and the styling hangs off the
        <noscript> element itself. With scripting enabled the browser keeps a <noscript>
        element's contents as one raw text node rather than parsing it, so any element
        nested in here would be markup on the server and text on the client - which is
        exactly the hydration mismatch this shape avoids. The class deliberately sets no
        `display`, so the user-agent rule that hides <noscript> while scripting is on
        still wins.
      -->
      <noscript class="noscript-notice">{{
        $t('partnerForm.noscript', { email: contactEmail })
      }}</noscript>

      <!-- Error summary: focused after a failed submit so a screen reader and a keyboard
           visitor both land on the reason instead of hunting for red borders. -->
      <div
        v-if="showErrorSummary"
        ref="errorSummary"
        class="alert alert--error"
        role="alert"
        tabindex="-1"
      >
        <AlertCircleIcon
          class="mt-0.5 h-icon-md w-icon-md shrink-0 text-danger"
          aria-hidden="true"
        />
        <div>
          <h2 class="text-copy font-bold text-ink">
            {{ $t('partnerForm.errors.summaryTitle', { count: errorCount }) }}
          </h2>
          <ul class="mt-1 grid gap-1">
            <li v-for="field in erroredFields" :key="field">
              <a
                :href="`#${controlId(field)}`"
                class="focus-ring inline-flex min-h-11 items-center rounded-control font-semibold text-danger underline underline-offset-4"
                @click.prevent="focusField(field)"
              >
                {{ $t(`partnerForm.fields.${field}.label`) }} -
                {{ $t(`partnerForm.errors.${errors[field]}`) }}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div v-if="status === 'server_error'" class="alert alert--error" role="alert">
        <AlertCircleIcon
          class="mt-0.5 h-icon-md w-icon-md shrink-0 text-danger"
          aria-hidden="true"
        />
        <div>
          <h2 class="text-copy font-bold text-ink">{{ $t('partnerForm.serverError.title') }}</h2>
          <p class="mt-1 text-small leading-copy text-ink-soft">
            {{ $t('partnerForm.serverError.description', { email: contactEmail }) }}
          </p>
        </div>
      </div>

      <div v-if="status === 'network_error'" class="alert alert--error" role="alert">
        <WifiOffIcon class="mt-0.5 h-icon-md w-icon-md shrink-0 text-danger" aria-hidden="true" />
        <div>
          <h2 class="text-copy font-bold text-ink">{{ $t('partnerForm.networkError.title') }}</h2>
          <p class="mt-1 text-small leading-copy text-ink-soft">
            {{ $t('partnerForm.networkError.description', { email: contactEmail }) }}
          </p>
        </div>
      </div>

      <div class="grid gap-page sm:grid-cols-2">
        <PartnerFormField
          v-model="lead.name"
          field="name"
          autocomplete="name"
          :error="errors.name"
        />
        <PartnerFormField
          v-model="lead.facilityName"
          field="facilityName"
          autocomplete="organization"
          :error="errors.facilityName"
        />
        <PartnerFormField
          v-model="lead.facilityType"
          field="facilityType"
          control="select"
          :options="facilityTypeOptions"
          :error="errors.facilityType"
        />
        <PartnerFormField
          v-model="lead.city"
          field="city"
          autocomplete="address-level2"
          :error="errors.city"
        />
        <PartnerFormField
          v-model="lead.email"
          field="email"
          type="email"
          autocomplete="email"
          dir="ltr"
          :error="errors.email"
        />
        <PartnerFormField
          v-model="lead.phone"
          field="phone"
          type="tel"
          autocomplete="tel"
          dir="ltr"
          :error="errors.phone"
        />
        <PartnerFormField
          v-model="lead.partnershipType"
          field="partnershipType"
          control="select"
          class="sm:col-span-2"
          :options="partnershipTypeOptions"
          :error="errors.partnershipType"
        />
      </div>

      <fieldset class="grid gap-page rounded-card border border-line bg-surface-raised p-page">
        <legend class="field-label px-1">
          {{ $t('partnerForm.fields.interestedProducts.label') }}
          <span class="text-ink-soft">({{ $t('partnerForm.optional') }})</span>
        </legend>
        <p class="field-hint mt-0">{{ $t('partnerForm.fields.interestedProducts.hint') }}</p>
        <div class="grid gap-1 sm:grid-cols-2">
          <label v-for="product in interestProducts" :key="product.slug" class="choice-row">
            <input
              v-model="lead.interestedProducts"
              type="checkbox"
              :value="product.slug"
              class="choice-box"
            />
            <span>{{ product.title }}</span>
          </label>
        </div>
      </fieldset>

      <PartnerFormField
        v-model="lead.message"
        field="message"
        control="textarea"
        :maxlength="MESSAGE_MAX_LENGTH"
        :error="errors.message"
      />

      <div>
        <label class="choice-row" :for="controlId('consent')">
          <input
            :id="controlId('consent')"
            ref="consentInput"
            v-model="lead.consent"
            type="checkbox"
            class="choice-box"
            :aria-invalid="Boolean(errors.consent)"
            :aria-describedby="errors.consent ? `${controlId('consent')}-error` : undefined"
          />
          <span class="text-copy leading-copy text-ink">
            {{ $t('partnerForm.fields.consent.label') }}
            <NuxtLink
              :to="localePath('/legal/privacy-policy/')"
              class="focus-ring font-semibold text-brand-primary underline underline-offset-4"
            >
              {{ $t('legal.privacyPolicy') }}
            </NuxtLink>
            <span class="field-required" aria-hidden="true">*</span>
          </span>
        </label>
        <p v-if="errors.consent" :id="`${controlId('consent')}-error`" class="field-error">
          <AlertCircleIcon class="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span>{{ $t(`partnerForm.errors.${errors.consent}`) }}</span>
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-page">
        <!-- Disabled while in flight AND guarded in the handler: a double click, a double
             Enter, and a resubmitted form all have to land on the same single request. -->
        <BaseButton
          native-type="submit"
          variant="primary"
          :disabled="isSubmitting"
          :aria-busy="isSubmitting"
        >
          <Loader2Icon
            v-if="isSubmitting"
            class="h-icon-sm w-icon-sm animate-spin"
            aria-hidden="true"
          />
          <SendIcon v-else class="h-icon-sm w-icon-sm" aria-hidden="true" />
          {{ isSubmitting ? $t('partnerForm.submitting') : $t('partnerForm.submit') }}
        </BaseButton>
        <p class="text-small text-ink-soft">
          {{ $t('partnerForm.requiredNote') }}
        </p>
      </div>

      <!-- Politely announced status for assistive technology; the visible states above
           carry the same information for everyone else. -->
      <p class="sr-only" role="status" aria-live="polite">{{ liveStatusMessage }}</p>
    </form>
  </div>
</template>

<script setup lang="ts">
import {
  AlertCircleIcon,
  CheckCircle2Icon,
  Loader2Icon,
  SendIcon,
  WifiOffIcon,
} from 'lucide-vue-next'
import { CONTACT } from '#shared/brand'
import { PARTNER_FORM_ID } from '~/composables/usePartnerFormId'
import type { PartnerFormOptions, PartnerSubmissionStatus } from '~/types'
import {
  MESSAGE_MAX_LENGTH,
  FIELD_ORDER,
  createEmptyLead,
  hasErrors,
  submitPartnerLead,
  validatePartnerLead,
} from '~/services/partner-lead'
import type { PartnerLeadErrors, PartnerLeadField } from '~/services/partner-lead'
import { getProductTitle } from '~/services/product-catalog'
import { localizeOptions } from '~/services/site-content'

const props = defineProps<{
  options: PartnerFormOptions
}>()

const { locale, t } = useI18n()
const localePath = useLocalePath()
const route = useRoute()
const { absoluteSiteUrl } = useSiteUrls()
const endpoint = useRuntimeConfig().public.partnerFormEndpoint

const contactEmail = CONTACT.email
const formId = useId()
provide(PARTNER_FORM_ID, formId)
const controlId = (field: PartnerLeadField) => `${formId}-${field}`

const lead = reactive(createEmptyLead())
const errors = ref<PartnerLeadErrors>({})
const status = ref<PartnerSubmissionStatus>('idle')
const hasSubmitted = ref(false)

const errorSummary = ref<HTMLElement | null>(null)
const successPanel = ref<HTMLElement | null>(null)
const consentInput = ref<HTMLInputElement | null>(null)

const isSubmitting = computed(() => status.value === 'submitting')
// Listed in field order, not object-key order, so the summary reads top to bottom the
// same way the form does.
const erroredFields = computed(() => FIELD_ORDER.filter((field) => errors.value[field]))
const errorCount = computed(() => erroredFields.value.length)
const showErrorSummary = computed(() => hasSubmitted.value && errorCount.value > 0)

const facilityTypeOptions = computed(() =>
  localizeOptions(props.options.facilityTypes, locale.value),
)
const partnershipTypeOptions = computed(() =>
  localizeOptions(props.options.partnershipTypes, locale.value),
)

const { data: catalog } = await useProductCatalog()

/** Checkbox labels come from the catalog, so they can never drift from the product pages. */
const interestProducts = computed(() =>
  props.options.productSlugs.flatMap((slug) => {
    const product = catalog.value.find((candidate) => candidate.slug === slug)
    return product ? [{ slug, title: getProductTitle(product, locale.value) }] : []
  }),
)

const liveStatusMessage = computed(() => {
  if (status.value === 'submitting') return t('partnerForm.submitting')
  if (status.value === 'server_error') return t('partnerForm.serverError.title')
  if (status.value === 'network_error') return t('partnerForm.networkError.title')
  if (showErrorSummary.value)
    return t('partnerForm.errors.summaryTitle', { count: errorCount.value })
  return ''
})

function focusField(field: PartnerLeadField) {
  if (field === 'consent') {
    consentInput.value?.focus()
    return
  }
  document.getElementById(controlId(field))?.focus()
}

// Re-validate as the visitor corrects a field, but only after the first submit attempt.
// Validating a field the visitor has not reached yet turns a blank form red on arrival.
watch(
  () => ({ ...lead }),
  () => {
    if (!hasSubmitted.value) return
    errors.value = validatePartnerLead(lead)
  },
  { deep: true },
)

function resetForm() {
  Object.assign(lead, createEmptyLead())
  errors.value = {}
  status.value = 'idle'
  hasSubmitted.value = false
}

async function onSubmit() {
  // Double-submit guard. The disabled button covers the pointer; this covers a repeated
  // Enter keypress and any submit that arrives while the request is still open.
  if (isSubmitting.value) return

  hasSubmitted.value = true
  errors.value = validatePartnerLead(lead)

  if (hasErrors(errors.value)) {
    status.value = 'idle'
    await nextTick()
    errorSummary.value?.focus()
    return
  }

  status.value = 'submitting'

  const outcome = await submitPartnerLead(endpoint, {
    ...lead,
    interestedProducts: [...lead.interestedProducts],
    locale: locale.value,
    sourceUrl: absoluteSiteUrl(route.fullPath),
  })

  status.value = outcome === 'success' ? 'success' : outcome

  await nextTick()
  if (outcome === 'success') successPanel.value?.focus()
}
</script>
