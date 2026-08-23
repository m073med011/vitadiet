<template>
  <NuxtLayout>
    <main class="min-h-[calc(100svh_-_var(--anchor-offset))] bg-surface py-section">
      <div class="content-container text-center">
        <p class="text-caption font-bold uppercase tracking-label text-brand-primary">
          {{ error.statusCode || 404 }}
        </p>
        <h1 class="mt-page text-heading-lg font-bold leading-heading text-ink">
          {{ $t('error.title') }}
        </h1>
        <p class="mx-auto mt-page max-w-copy text-copy-lg leading-copy text-ink-soft">
          {{ $t('error.description') }}
        </p>
        <div class="mt-gutter flex justify-center">
          <BaseButton :to="localePath('/')" @click="handleError">
            {{ $t('error.homeCta') }}
          </BaseButton>
        </div>
      </div>
    </main>
  </NuxtLayout>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps<{
  error: NuxtError
}>()

const localePath = useLocalePath()

const handleError = () => clearError({ redirect: localePath('/') })
</script>
