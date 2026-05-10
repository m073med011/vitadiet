<template>
  <div class="min-h-screen flex flex-col max-w-shell mx-auto w-full shadow-shell dark:shadow-shell-dark relative bg-surface dark:bg-dark-surface text-ink dark:text-dark-ink transition-colors duration-300">
    <AppHeader />

    <main class="flex-grow">
      <slot />
    </main>

    <AppFooter />
  </div>
</template>
