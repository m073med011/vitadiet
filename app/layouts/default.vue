<template>
  <div
    class="min-h-screen flex flex-col max-w-shell mx-auto w-full shadow-shell relative bg-surface text-ink"
  >
    <!-- First thing in the tab order on every page: a keyboard visitor should not have to
         walk the whole header before reaching the content. -->
    <a class="skip-link" href="#main-content">{{ $t('a11y.skipToContent') }}</a>

    <AppHeader />

    <main id="main-content" class="grow" tabindex="-1">
      <slot />
    </main>

    <AppFooter />
  </div>
</template>
