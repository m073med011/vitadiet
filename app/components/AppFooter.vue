<template>
  <footer id="footer" class="relative bg-surface pt-section pb-page-lg border-t border-line overflow-hidden">
    <div class="content-container relative z-10">

      
      <div class="footer-grid mb-rule-sm">
        
        <FooterBrand />

        
        <FooterLinks />

        
        <FooterContact />
      </div>

      
      <FooterBottom />

    </div>
  </footer>
</template>

<script setup lang="ts">
</script>

<style scoped>
.footer-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-gutter-lg, 2rem);
}

@media (min-width: 768px) {
  .footer-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .footer-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
