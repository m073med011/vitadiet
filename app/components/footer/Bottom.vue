<template>
  <div class="pt-card border-t border-line grid gap-page" data-aos="fade-up">
    <!-- Language lives in the footer as well as the header: it is the one preference a
         visitor may go looking for after reading to the bottom of a page. -->
    <div class="flex flex-wrap items-center justify-center gap-page">
      <p class="text-caption font-bold uppercase tracking-label text-ink-soft">
        {{ $t('footer.language') }}
      </p>
      <HeaderLangSwitcher variant="desktop" />
    </div>

    <div class="flex flex-wrap justify-center items-center gap-page text-center">
      <p class="flex min-h-11 items-center text-small text-ink-soft">
        <span>{{ $t('footer.copyright') }}</span>
        <span class="mx-1">&copy;</span>
        <span>{{ currentYear }}</span>
      </p>
      <a
        href="https://do.com.sa/"
        target="_blank"
        rel="noopener noreferrer"
        class="focus-ring flex min-h-11 min-w-11 flex-wrap items-center justify-center gap-1 rounded-control px-2 text-small text-ink-soft transition-colors hover:text-brand-primary"
      >
        <span>{{ $t('footer.developedBy') }}</span>
        <!-- Animated WebP: BaseImage serves it unprocessed, otherwise the resize keeps
             only the blank first frame of the fade-in. -->
        <BaseImage
          src="/images/do-distribution-logo-black.webp"
          alt="Digital Order"
          :width="100"
          :height="50"
          class="h-4 w-auto inline-block ml-1"
        />
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
const currentYear = useState('footer-current-year', () => new Date().getFullYear())
</script>
