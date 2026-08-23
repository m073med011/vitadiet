<template>
  <div
    class="pt-card border-t border-line flex flex-wrap justify-center items-center gap-1 text-center"
    data-aos="fade-up"
  >
    <a
      href="https://do.com.sa/"
      target="_blank"
      rel="noopener noreferrer"
      class="text-ink-soft text-small flex flex-wrap items-center justify-center gap-1 hover:text-brand-primary transition-colors"
    >
      <span>{{ $t('footer.copyright') }}</span>
      <span>&copy;</span>
      <span>{{ currentYear }}</span>
      <span class="mx-1">—</span>
      <span>{{ $t('footer.developedBy') }}</span>
      <NuxtImg
        src="/images/do-distribution-logo-black.webp"
        alt="Digital Order"
        width="56"
        height="28"
        class="h-4 w-auto inline-block ml-1"
      />
    </a>
  </div>
</template>

<script setup lang="ts">
const currentYear = useState('footer-current-year', () => new Date().getFullYear())
</script>
