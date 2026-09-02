<template>
  <main class="min-h-[calc(100svh_-_var(--anchor-offset))] bg-surface py-section">
    <div class="content-container text-center">
      <p class="text-caption font-bold uppercase tracking-label text-brand-primary">404</p>
      <h1 class="mt-page text-heading-lg font-bold leading-heading text-ink">
        {{ $t('error.title') }}
      </h1>
      <p class="mx-auto mt-page max-w-copy text-copy-lg leading-copy text-ink-soft">
        {{ $t('error.description') }}
      </p>
      <div class="mt-gutter flex flex-wrap justify-center gap-page">
        <BaseButton :to="localePath('/')" variant="primary">
          {{ $t('error.homeCta') }}
        </BaseButton>
        <BaseButton :to="localePath('/products/')" variant="secondary">
          {{ $t('products') }}
        </BaseButton>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
/**
 * Server-rendered twin of `app/error.vue`.
 *
 * Apache serves a single static file for `ErrorDocument 404`, and nitro's own 404.html is
 * an empty SPA shell - a visitor with JavaScript disabled got a blank white page. This
 * page is prerendered with its content in the markup, and `scripts/build-404.mjs` copies
 * the default-locale render over `.output/public/404.html` after the build.
 *
 * `error.vue` still handles in-app navigation errors; this exists so the *static* error
 * document has a body. Keep the two in step - they share the same i18n keys.
 */
const localePath = useLocalePath()

// Never indexable, on any host: it is an error document, not a page of the site.
useRobotsRule('noindex, nofollow')
</script>
