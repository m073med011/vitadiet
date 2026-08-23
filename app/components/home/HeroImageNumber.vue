<template>
  <span v-if="visible" class="hero-image-debug-number" aria-hidden="true">{{ index + 1 }}</span>
</template>

<script setup lang="ts">
defineProps<{ index: number }>()

const visible = import.meta.dev
</script>

<style scoped>
.hero-image-debug-number {
  position: absolute;
  top: 0.375rem;
  left: 0.375rem;
  z-index: 3;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.75rem;
  height: 1.75rem;
  padding-inline: 0.375rem;
  border: 1px solid color-mix(in oklab, var(--color-surface) 72%, var(--color-brand-primary));
  border-radius: 999px;
  background: color-mix(in oklab, var(--color-surface) 86%, var(--color-brand-primary));
  box-shadow: var(--shadow-card);
  color: var(--color-ink);
  font-size: 0.75rem;
  font-weight: 800;
  line-height: 1;
}
</style>
