<template>
  <div class="app-shell">
    <AppHeader />

    <main class="flex-grow">
      <slot />
    </main>
    
    <AppFooter />
  </div>
</template>
