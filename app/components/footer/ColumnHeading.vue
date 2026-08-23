<template>
  <h3 class="text-copy-lg font-bold text-ink tracking-wide mb-gutter uppercase">
    {{ label }}
  </h3>
</template>

<script setup lang="ts">
defineProps<{
  label: string
}>()
</script>
