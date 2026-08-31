<template>
  <div>
    <label class="field-label" :for="id">
      {{ $t(`partnerForm.fields.${field}.label`) }}
      <span class="field-required" aria-hidden="true">*</span>
      <span class="sr-only">{{ $t('partnerForm.requiredField') }}</span>
    </label>

    <select
      v-if="control === 'select'"
      :id="id"
      class="field-control"
      :class="{ 'field-control--invalid': error }"
      :value="modelValue"
      :aria-invalid="Boolean(error)"
      :aria-describedby="describedBy"
      @change="onInput"
    >
      <option value="">{{ $t('partnerForm.selectPlaceholder') }}</option>
      <option v-for="option in options" :key="option.id" :value="option.id">
        {{ option.label }}
      </option>
    </select>

    <textarea
      v-else-if="control === 'textarea'"
      :id="id"
      class="field-control min-h-[8rem]"
      :class="{ 'field-control--invalid': error }"
      :value="modelValue"
      :maxlength="maxlength"
      :placeholder="$t(`partnerForm.fields.${field}.placeholder`)"
      rows="5"
      :aria-invalid="Boolean(error)"
      :aria-describedby="describedBy"
      @input="onInput"
    />

    <input
      v-else
      :id="id"
      class="field-control"
      :class="{ 'field-control--invalid': error }"
      :type="type"
      :value="modelValue"
      :dir="dir"
      :autocomplete="autocomplete"
      :placeholder="$t(`partnerForm.fields.${field}.placeholder`)"
      :aria-invalid="Boolean(error)"
      :aria-describedby="describedBy"
      @input="onInput"
    />

    <span v-if="hint" :id="`${id}-hint`" class="field-hint">{{ hint }}</span>

    <!-- The error is text with an icon, never a red border on its own: colour alone is
         not a way to tell someone what went wrong. -->
    <p v-if="error" :id="`${id}-error`" class="field-error">
      <AlertCircleIcon class="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span>{{ $t(`partnerForm.errors.${error}`) }}</span>
    </p>
  </div>
</template>

<script setup lang="ts">
import { AlertCircleIcon } from 'lucide-vue-next'
import type { PartnerLeadErrorKey, PartnerLeadField } from '~/services/partner-lead'
import { PARTNER_FORM_ID } from '~/composables/usePartnerFormId'

const props = withDefaults(
  defineProps<{
    autocomplete?: string
    control?: 'input' | 'select' | 'textarea'
    dir?: 'ltr' | 'rtl'
    error?: PartnerLeadErrorKey
    field: PartnerLeadField
    maxlength?: number
    modelValue: string
    options?: { id: string; label: string }[]
    type?: string
  }>(),
  {
    autocomplete: undefined,
    control: 'input',
    dir: undefined,
    error: undefined,
    maxlength: undefined,
    options: () => [],
    type: 'text',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const { te, t } = useI18n()
const formId = inject(PARTNER_FORM_ID, 'partner-form')

const id = computed(() => `${formId}-${props.field}`)

// A hint is optional per field; only render (and only reference from aria-describedby)
// the ones the locale files actually define.
const hintKey = computed(() => `partnerForm.fields.${props.field}.hint`)
const hint = computed(() => (te(hintKey.value) ? t(hintKey.value) : ''))

const describedBy = computed(
  () =>
    [hint.value ? `${id.value}-hint` : '', props.error ? `${id.value}-error` : '']
      .filter(Boolean)
      .join(' ')
      .trim() || undefined,
)

const onInput = (event: Event) => {
  emit('update:modelValue', (event.target as HTMLInputElement | HTMLTextAreaElement).value)
}
</script>
