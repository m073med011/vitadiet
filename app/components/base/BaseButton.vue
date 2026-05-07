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
import { computed } from 'vue';
import { NuxtLink } from '#components';

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value: string) => ['primary', 'secondary', 'icon', 'none'].includes(value),
  },
  to: {
    type: [String, Object],
    default: undefined,
  },
  href: {
    type: String,
    default: undefined,
  },
  nativeType: {
    type: String,
    default: 'button',
  },
});

const componentType = computed(() => {
  if (props.to) {
    return NuxtLink;
  }
  if (props.href) {
    return 'a';
  }
  return 'button';
});

const isNativeButton = computed(() => {
  return componentType.value === 'button';
});

const computedClasses = computed(() => {
  if (props.variant === 'primary') return 'primary-button';
  if (props.variant === 'secondary') return 'secondary-button';
  if (props.variant === 'icon') return 'icon-action';
  return '';
});
</script>
