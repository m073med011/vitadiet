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
import { NuxtLink } from '#components'
import type { RouteLocationRaw } from 'vue-router'

const props = withDefaults(
  defineProps<{
    href?: string
    nativeType?: 'button' | 'submit' | 'reset'
    to?: string | RouteLocationRaw
    variant?: 'primary' | 'secondary' | 'icon' | 'none'
  }>(),
  {
    href: undefined,
    nativeType: 'button',
    to: undefined,
    variant: 'primary',
  },
)

const componentType = computed(() => {
  if (props.to) return NuxtLink
  if (props.href) return 'a'
  return 'button'
})

const isNativeButton = computed(() => componentType.value === 'button')

const computedClasses = computed(() => {
  if (props.variant === 'primary') {
    return 'focus-ring inline-flex min-h-10 min-w-10 items-center justify-center gap-1.5 px-3 py-2 sm:px-control-x-sm sm:py-2 text-small bg-brand-primary hover:bg-brand-dark text-surface font-semibold rounded-control transition-all duration-300 shadow-button hover:shadow-button-hover uppercase tracking-label whitespace-nowrap disabled:pointer-events-none disabled:opacity-60'
  }
  if (props.variant === 'secondary') {
    return 'focus-ring inline-flex min-h-10 min-w-10 items-center justify-center gap-1.5 px-3 py-2 sm:px-control-x-sm sm:py-2 bg-surface-raised hover:bg-brand-primary-soft text-ink hover:text-brand-primary border border-line hover:border-brand-primary/40 text-small font-semibold rounded-control transition-all duration-300 shadow-card hover:shadow-card-hover whitespace-nowrap disabled:pointer-events-none disabled:opacity-60'
  }
  if (props.variant === 'icon') {
    return 'focus-ring flex min-h-10 min-w-10 items-center justify-center p-2.5 rounded-pill hover:bg-brand-primary-soft hover:text-brand-primary transition-colors disabled:pointer-events-none disabled:opacity-60'
  }
  return ''
})
</script>
