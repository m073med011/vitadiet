<template>
  <div
    class="min-h-screen flex flex-col max-w-shell mx-auto w-full shadow-shell relative bg-surface text-ink"
  >
    <AppHeader />

    <main class="grow">
      <slot />
    </main>

    <AppFooter />
  </div>
</template>
