<template>
  <component :is="icon" aria-hidden="true" />
</template>

<script setup lang="ts">
import {
  ClipboardCheckIcon,
  EyeIcon,
  FactoryIcon,
  FileSearchIcon,
  ShieldCheckIcon,
} from 'lucide-vue-next'
import type { Component } from 'vue'
import type { QualityIconKey } from '~/types'

/**
 * The data source stores an icon key, not a component, so it stays serialisable and can
 * come from an API later. This is the single place that maps a key to a glyph.
 */
const ICONS: Record<QualityIconKey, Component> = {
  'clipboard-check': ClipboardCheckIcon,
  eye: EyeIcon,
  factory: FactoryIcon,
  'file-search': FileSearchIcon,
  'shield-check': ShieldCheckIcon,
}

const props = defineProps<{
  iconKey: QualityIconKey
}>()

const icon = computed(() => ICONS[props.iconKey] ?? ShieldCheckIcon)
</script>
