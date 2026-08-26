<template>
  <!-- Passthrough assets bypass the image pipeline entirely: a plain <img> straight from
       /public, with no provider involved. See PASSTHROUGH_* below for why. -->
  <img
    v-if="passthrough"
    v-bind="$attrs"
    :src="src"
    :alt="alt"
    :loading="loading"
    :decoding="decoding"
    :fetchpriority="fetchPriority"
    :width="resolvedWidth"
    :height="resolvedHeight"
    :class="imageClasses"
  >
  <NuxtImg
    v-else
    v-bind="$attrs"
    :src="src"
    :alt="alt"
    :sizes="sizes"
    :loading="loading"
    :decoding="decoding"
    :fetchpriority="fetchPriority"
    :width="resolvedWidth"
    :height="resolvedHeight"
    :class="imageClasses"
  />
</template>

<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
})

type ImageFit = 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'
type HoverZoom = 'none' | 'soft' | 'strong' | 'quick'

const props = withDefaults(
  defineProps<{
    src: string
    alt?: string
    loading?: 'lazy' | 'eager'
    fill?: boolean
    fit?: ImageFit
    hoverZoom?: HoverZoom
    sizes?: string
    decoding?: 'sync' | 'async' | 'auto'

    width?: number

    height?: number
  }>(),
  {
    alt: '',
    loading: 'lazy',
    fill: false,
    fit: 'cover',
    hoverZoom: 'none',
    sizes: undefined,
    decoding: 'async',
    width: undefined,
    height: undefined,
  },
)

/**
 * Assets the image pipeline must not re-encode:
 *
 * - SVG is resolution-independent, so a resize is a pointless copy of the same file.
 * - Animated WebP/GIF/APNG lose their animation: sharp reads only the first frame, and
 *   when that frame is blank (a fade-in) the output is a fully transparent image.
 *
 * These are served straight from /public instead.
 */
const PASSTHROUGH_EXTENSIONS = ['.svg', '.gif', '.apng']
const PASSTHROUGH_SOURCES = ['/images/do-distribution-logo-black.webp']

const passthrough = computed(
  () =>
    PASSTHROUGH_EXTENSIONS.some((extension) => props.src.toLowerCase().endsWith(extension)) ||
    PASSTHROUGH_SOURCES.includes(props.src),
)

const fetchPriority = computed(() => (props.loading === 'eager' ? 'high' : 'auto'))

const resolvedWidth = computed(() => {
  if (props.width !== undefined) return props.width
  return undefined
})

const resolvedHeight = computed(() => {
  if (props.height !== undefined) return props.height
  return undefined
})

const fitClasses: Record<ImageFit, string> = {
  cover: 'object-cover',
  contain: 'object-contain',
  fill: 'object-fill',
  none: 'object-none',
  'scale-down': 'object-scale-down',
}

const hoverZoomClasses: Record<HoverZoom, string> = {
  none: '',
  soft: 'transition-transform duration-700 ease-in-out group-hover:scale-105',
  strong: 'transition-transform duration-700 ease-in-out group-hover:scale-110',
  quick: 'transition-transform duration-500 ease-in-out group-hover:scale-110',
}

const imageClasses = computed(() => [
  props.fill && 'absolute inset-0 w-full h-full',
  (props.fill || props.fit !== 'cover') && fitClasses[props.fit],
  hoverZoomClasses[props.hoverZoom],
])
</script>
