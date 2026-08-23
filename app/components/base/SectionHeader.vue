<template>
  <div class="text-center max-w-copy mx-auto mb-rule-sm" data-aos="fade-up">
    <h2
      class="text-heading md:text-heading-lg leading-heading font-bold uppercase tracking-label mb-page"
      :class="tone === 'primary' ? 'text-brand-primary' : 'text-ink'"
    >
      {{ heading }}
    </h2>
    <p v-if="description" class="text-copy-lg leading-copy text-ink-soft">
      {{ description }}
    </p>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    description?: string
    heading: string
    tone?: 'ink' | 'primary'
  }>(),
  {
    description: undefined,
    tone: 'ink',
  },
)
</script>
