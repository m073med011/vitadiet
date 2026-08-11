<template>
  <footer id="footer" class="relative bg-surface pt-section pb-page-lg border-t border-line overflow-hidden">
    <div class="content-container relative z-10">

      <!-- Main grid: 1 col mobile → 2 col tablet → 4 col desktop -->
      <div class="footer-grid mb-rule-sm">
        <!-- Col 1 — Brand -->
        <FooterBrand />

        <!-- Col 2 — Quick Links -->
        <FooterLinks />

        <!-- Cols 3-4 — Contact (spans 2 cols on lg, full width on md) -->
        <FooterContact />
      </div>

      <!-- Bottom bar -->
      <FooterBottom />

    </div>
  </footer>
</template>

<script setup lang="ts">
</script>

<style scoped>
/* ─── Main footer grid ──────────────────────────────────────────
   Mobile  : 1 column  (default)
   Tablet  : 2 columns (md ≥ 768px)
   Desktop : 4 columns (lg ≥ 1024px) — Brand | Links | Contact×2
──────────────────────────────────────────────────────────────── */
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
