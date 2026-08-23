<template>
  <BaseButton
    v-if="variant === 'desktop'"
    variant="icon"
    :to="switchLocalePath(targetLocale)"
    :title="$t('switch_lang')"
    :aria-label="$t('switch_lang')"
    :hreflang="targetLocale"
  >
    <LanguagesIcon class="w-6 h-6" />
    <span class="ms-2 text-small font-bold uppercase tracking-wide">{{ label }}</span>
  </BaseButton>

  <NuxtLink
    v-else
    :to="switchLocalePath(targetLocale)"
    :hreflang="targetLocale"
    :aria-label="$t('switch_lang')"
    class="flex flex-col items-center gap-2 py-3.5 px-3 rounded-xl bg-surface-muted border border-line text-ink hover:bg-brand-primary-soft hover:text-brand-primary transition-all duration-200"
    @click="$emit('switch')"
  >
    <LanguagesIcon class="w-6 h-6 text-brand-primary" />
    <span class="text-small font-bold">{{ label }}</span>
  </NuxtLink>
</template>

<script setup lang="ts">
import { LanguagesIcon } from 'lucide-vue-next'

const props = defineProps<{
  variant: 'desktop' | 'mobile'
}>()

defineEmits<{
  switch: []
}>()

const { locale } = useI18n()
const switchLocalePath = useSwitchLocalePath()

const targetLocale = computed(() => (locale.value === 'en' ? 'ar' : 'en'))
const label = computed(() => {
  if (props.variant === 'desktop') {
    return locale.value === 'en' ? 'عربي' : 'EN'
  }
  return locale.value === 'en' ? 'عربي' : 'English'
})
</script>
