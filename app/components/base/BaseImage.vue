<template>
  <img
    v-bind="$attrs"
    :src="src"
    :alt="alt"
    :loading="loading"
    :decoding="decoding"
    :fetchpriority="fetchPriority"
    :sizes="sizes"
    :class="imageClasses"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';

defineOptions({
  inheritAttrs: false
});

type ImageFit = 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
type HoverZoom = 'none' | 'soft' | 'strong' | 'quick';

const props = withDefaults(defineProps<{
  src: string;
  alt?: string;
  loading?: 'lazy' | 'eager';
  fill?: boolean;
  fit?: ImageFit;
  hoverZoom?: HoverZoom;
  sizes?: string;
  decoding?: 'sync' | 'async' | 'auto';
}>(), {
  alt: '',
  loading: 'lazy',
  fill: false,
  fit: 'cover',
  hoverZoom: 'none',
  sizes: undefined,
  decoding: 'async',
});

const fetchPriority = computed(() => (props.loading === 'eager' ? 'high' : 'auto'))

const fitClasses: Record<ImageFit, string> = {
  cover: 'object-cover',
  contain: 'object-contain',
  fill: 'object-fill',
  none: 'object-none',
  'scale-down': 'object-scale-down',
};

const hoverZoomClasses: Record<HoverZoom, string> = {
  none: '',
  soft: 'transition-transform duration-700 ease-in-out group-hover:scale-105',
  strong: 'transition-transform duration-700 ease-in-out group-hover:scale-110',
  quick: 'transition-transform duration-500 ease-in-out group-hover:scale-110',
};

const imageClasses = computed(() => [
  props.fill && 'absolute inset-0 w-full h-full',
  (props.fill || props.fit !== 'cover') && fitClasses[props.fit],
  hoverZoomClasses[props.hoverZoom],
]);
</script>
