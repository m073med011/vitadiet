<template>
  <section id="faq" class="w-full py-section bg-surface">
    <div class="max-w-copy mx-auto px-page sm:px-gutter md:px-page-lg">
      <div class="text-center mb-rule-sm">
        <h2 class="text-heading md:text-heading-lg leading-heading font-bold text-ink uppercase tracking-label mb-page">
          {{ $t('homePage.faq.heading') }}
        </h2>
      </div>

      <div class="flex flex-col gap-4">
        <div
          v-for="(item, index) in faqItems"
          :key="item.key"
          class="faq-item rounded-card border border-line/80 bg-surface-raised/60 shadow-card"
          :class="{ 'is-open': openItems.has(item.key) }"
          data-aos="fade-up"
          :data-aos-delay="index * 80"
        >
          <h3 class="m-0">
            <button
              :id="`faq-trigger-${item.key}`"
              type="button"
              class="flex w-full cursor-pointer items-center justify-between gap-page p-page text-start text-copy-lg font-bold leading-heading text-ink transition-colors hover:text-brand-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent rounded-card"
              :aria-expanded="openItems.has(item.key)"
              :aria-controls="`faq-panel-${item.key}`"
              @click="toggle(item.key)"
            >
              <span>{{ $t(item.questionKey) }}</span>
              <ChevronDownIcon
                class="faq-chevron h-icon-md w-icon-md shrink-0 text-brand-primary transition-transform duration-300"
                aria-hidden="true"
              />
            </button>
          </h3>
          <div
            :id="`faq-panel-${item.key}`"
            role="region"
            :aria-labelledby="`faq-trigger-${item.key}`"
            class="faq-panel"
          >
            <div class="faq-panel-inner">
              <p class="px-page pb-page text-copy leading-copy text-ink-soft">
                {{ $t(item.answerKey) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ChevronDownIcon } from 'lucide-vue-next'
import { faqItems } from '~/data/home'

const { t } = useI18n()

// Tracks which panels are expanded. A Set allows multiple open at once; swap for a
// single ref if you'd rather have exclusive (one-at-a-time) accordion behaviour.
const openItems = ref(new Set<string>())

function toggle(key: string) {
  // Reassign so the reactive ref re-renders (mutating a Set in place doesn't trigger it).
  const next = new Set(openItems.value)
  next.has(key) ? next.delete(key) : next.add(key)
  openItems.value = next
}

// FAQPage schema mirrors the visible content above (Google requires FAQ rich-result
// content to be visible on the page).
//
// defineQuestion only attaches each Question to WebPage.mainEntity when the page's
// WebPage node is typed FAQPage (see @unhead/schema-org questionResolver). Without
// this the Questions render but stay orphaned in the @graph and earn no rich result,
// so we widen the (home) WebPage @type to include FAQPage.
useSchemaOrg([
  defineWebPage({ '@type': ['WebPage', 'FAQPage'] }),
  ...faqItems.map((item) =>
    defineQuestion({
      name: () => t(item.questionKey),
      acceptedAnswer: () => t(item.answerKey),
    }),
  ),
])
</script>

<style scoped>
/* Smooth expand/collapse without measuring heights in JS: animate the panel from
   grid-template-rows 0fr → 1fr. The inner wrapper needs min-height:0 + overflow
   hidden so the content can be clipped while it grows. */
.faq-panel {
  max-height: 0;
  overflow: hidden;
  transition: max-height var(--motion-page, 320ms) var(--motion-ease-out, cubic-bezier(0.16, 1, 0.3, 1));
}

.faq-item.is-open .faq-panel {
  max-height: 32rem;
}

.faq-panel-inner {
  /* Fade + slight lift the copy in as it reveals, tied to the same easing. */
  opacity: 0;
  transform: translateY(-0.25rem);
  transition:
    opacity var(--motion-page, 320ms) var(--motion-ease-out, cubic-bezier(0.16, 1, 0.3, 1)),
    transform var(--motion-page, 320ms) var(--motion-ease-out, cubic-bezier(0.16, 1, 0.3, 1));
}

.faq-item.is-open .faq-panel-inner {
  opacity: 1;
  transform: translateY(0);
}

.faq-item.is-open .faq-chevron {
  transform: rotate(180deg);
}

html[dir='rtl'] .faq-trigger {
  text-align: right;
}

@media (prefers-reduced-motion: reduce) {
  .faq-panel,
  .faq-panel-inner,
  .faq-chevron {
    transition-duration: 1ms;
  }
}
</style>
