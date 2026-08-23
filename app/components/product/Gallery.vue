<template>
  <div
    :class="[
      layout === 'horizontal'
        ? 'mt-gutter-lg flex w-full shrink-0 justify-center gap-page overflow-x-auto pb-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden lg:hidden'
        : 'hidden shrink-0 flex-col items-center justify-center gap-page lg:col-start-2 lg:row-start-1 lg:flex',
    ]"
    :aria-label="$t('products')"
  >
    <button
      v-for="(img, index) in images"
      :key="img"
      type="button"
      :aria-pressed="activeImage === img"
      :aria-label="`${productTitle} ${index + 1}`"
      class="relative shrink-0 overflow-hidden rounded-pill border-2 bg-surface-raised transition-all duration-300 ease-[var(--motion-ease-out)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent motion-reduce:translate-y-0 motion-reduce:scale-100 motion-reduce:transition-none"
      :class="[
        layout === 'horizontal' ? 'h-action w-action sm:h-avatar sm:w-avatar' : 'h-avatar w-avatar',
        activeImage === img
          ? 'border-brand-primary opacity-100 shadow-float -translate-y-0.5 scale-105'
          : 'border-line/80 opacity-75 hover:border-brand-primary/50 hover:opacity-100 hover:-translate-y-0.5 hover:scale-105',
      ]"
      @click="$emit('select', img)"
    >
      <BaseImage class="block" :src="img" alt="" fill fit="cover" />
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  images: string[]
  activeImage: string
  productTitle: string
  layout: 'horizontal' | 'vertical'
}>()

defineEmits<{
  select: [image: string]
}>()
</script>
