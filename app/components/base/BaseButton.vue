<template>
  <component
    :is="componentType"
    :to="to"
    :href="href"
    :type="isNativeButton ? nativeType : undefined"
    :class="computedClasses"
    v-bind="$attrs"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NuxtLink } from '#components'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value: string) => ['primary', 'secondary', 'icon', 'none'].includes(value),
  },
  to: { type: [String, Object], default: undefined },
  href: { type: String, default: undefined },
  nativeType: { type: String, default: 'button' },
})

const componentType = computed(() => {
  if (props.to) return NuxtLink
  if (props.href) return 'a'
  return 'button'
})

const isNativeButton = computed(() => componentType.value === 'button')

const computedClasses = computed(() => {
  if (props.variant === 'primary') {
    return 'inline-flex items-center justify-center gap-control-y-sm px-control-x py-control-y bg-brand-primary hover:bg-brand-dark text-surface font-semibold rounded-control transition-all duration-300 shadow-button hover:shadow-button-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent uppercase tracking-label whitespace-nowrap disabled:pointer-events-none disabled:opacity-60'
  }
  if (props.variant === 'secondary') {
    return 'inline-flex items-center justify-center gap-control-y-sm px-control-x py-control-y bg-surface-raised hover:bg-brand-primary-soft text-ink hover:text-brand-primary border border-line hover:border-brand-primary/40 text-copy font-semibold rounded-control transition-all duration-300 shadow-card hover:shadow-card-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent whitespace-nowrap disabled:pointer-events-none disabled:opacity-60'
  }
  if (props.variant === 'icon') {
    return 'flex items-center justify-center p-3 rounded-pill hover:bg-brand-primary-soft hover:text-brand-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent transition-colors disabled:pointer-events-none disabled:opacity-60'
  }
  return ''
})
</script>
