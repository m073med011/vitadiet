<template>
  <component
    :is="href ? 'a' : 'div'"
    :href="href"
    :target="external ? '_blank' : undefined"
    :rel="external ? 'noopener noreferrer' : undefined"
    class="flex items-start gap-page group"
  >
    <div class="icon-circle">
      <component :is="icon" class="w-icon-sm h-icon-sm transition-colors" />
    </div>
    <span
      class="text-ink leading-copy pt-control-y-sm transition-colors group-hover:text-brand-primary"
      :class="{ 'whitespace-pre-line': preLine }"
      :dir="dir"
    >
      <slot />
    </span>
  </component>
</template>

<script setup lang="ts">
import type { Component } from 'vue'

defineProps<{
  dir?: 'ltr' | 'rtl'
  external?: boolean
  href?: string
  icon: Component
  preLine?: boolean
}>()
</script>
