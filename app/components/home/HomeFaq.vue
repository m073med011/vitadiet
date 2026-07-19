<template>
  <section id="faq" class="w-full py-section bg-surface">
    <div class="max-w-copy mx-auto px-page sm:px-gutter md:px-page-lg">
      <div class="text-center mb-rule-sm" data-aos="fade-up">
        <h2 class="text-heading md:text-heading-lg leading-heading font-bold text-ink uppercase tracking-label mb-page">
          {{ $t('homePage.faq.heading') }}
        </h2>
      </div>

      <div class="flex flex-col gap-page">
        <details
          v-for="(item, index) in faqItems"
          :key="item.key"
          class="faq-item group rounded-card border border-line/80 bg-surface-raised/60 shadow-card"
          data-aos="fade-up"
          :data-aos-delay="index * 80"
        >
          <summary class="flex cursor-pointer items-center justify-between gap-page p-page text-copy-lg font-bold leading-heading text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent">
            <span>{{ $t(item.questionKey) }}</span>
            <ChevronDownIcon
              class="h-icon-md w-icon-md shrink-0 text-brand-primary transition-transform duration-300 group-open:rotate-180"
              aria-hidden="true"
            />
          </summary>
          <p class="px-page pb-page text-copy leading-copy text-ink-soft">
            {{ $t(item.answerKey) }}
          </p>
        </details>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ChevronDownIcon } from 'lucide-vue-next'

const { t } = useI18n()

// FAQ copy lives in the locale files under homePage.faq.items.
const faqItems = [
  { key: 'consumer', questionKey: 'homePage.faq.items.consumer.question', answerKey: 'homePage.faq.items.consumer.answer' },
  { key: 'sfda', questionKey: 'homePage.faq.items.sfda.question', answerKey: 'homePage.faq.items.sfda.answer' },
  { key: 'files', questionKey: 'homePage.faq.items.files.question', answerKey: 'homePage.faq.items.files.answer' },
]

// FAQPage schema mirrors the visible content above (Google requires FAQ rich-result
// content to be visible on the page).
useSchemaOrg(
  faqItems.map((item) =>
    defineQuestion({
      name: () => t(item.questionKey),
      acceptedAnswer: () => t(item.answerKey),
    }),
  ),
)
</script>
