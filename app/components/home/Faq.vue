<template>
  <section id="faq" class="w-full py-section bg-surface">
    <div class="max-w-copy mx-auto px-page sm:px-gutter md:px-page-lg">
      <BaseSectionHeader :heading="$t('homePage.faq.heading')" />

      <div class="flex flex-col gap-4">
        <div
          v-for="(item, index) in faqItems"
          :key="item.key"
          class="faq-item rounded-card border border-line/80 bg-surface-raised/60 shadow-card"
          :class="{ 'is-open': openItems.has(item.key) }"
          data-aos="fade-up"
          :data-aos-delay="index * AOS_STAGGER_MS"
        >
          <h3 class="m-0">
            <button
              :id="`faq-trigger-${item.key}`"
              type="button"
              class="flex min-h-11 w-full cursor-pointer items-center justify-between gap-page p-page text-start text-copy-lg font-bold leading-heading text-ink transition-colors hover:text-brand-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent rounded-card"
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
import { faqItems } from '~/data/faq'
import { AOS_STAGGER_MS } from '~/utils/motion'

const openItems = ref(new Set<string>())

function toggle(key: string) {
  const next = new Set(openItems.value)
  if (next.has(key)) {
    next.delete(key)
  } else {
    next.add(key)
  }
  openItems.value = next
}
</script>

<style scoped>
.faq-panel {
  display: grid;
  grid-template-rows: 0fr;
  overflow: hidden;
  transition: grid-template-rows var(--motion-page, 320ms)
    var(--motion-ease-out, cubic-bezier(0.16, 1, 0.3, 1));
}

.faq-item.is-open .faq-panel {
  grid-template-rows: 1fr;
}

.faq-panel-inner {
  min-height: 0;
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

@media (prefers-reduced-motion: reduce) {
  .faq-panel,
  .faq-panel-inner,
  .faq-chevron {
    transition-duration: 1ms;
  }
}
</style>
