<template>
  <section id="contact" class="section-solid section-loose overflow-hidden">
    <div class="content-wrap">
      <div class="start-contact-grid">
        <article class="start-panel" data-aos="fade-right">
          <h2 class="section-heading mb-8">{{ $t('homePage.steps.heading') }}</h2>
          <div class="start-steps">
            <div
              v-for="(step, index) in partnerSteps"
              :key="step"
              data-aos="fade-up"
              :data-aos-delay="index * 100"
            >
              <span>{{ index + 1 }}</span>
              <p>{{ $t(step) }}</p>
            </div>
          </div>
        </article>

        <article class="contact-panel" data-aos="fade-left" data-aos-delay="150">
          <h2 class="section-heading-display mb-4">{{ $t('homePage.contactSection.heading') }}</h2>
          <p class="section-copy mb-10">{{ $t('homePage.contactSection.description') }}</p>

          <form @submit.prevent="submitInquiry" class="flex flex-col sm:flex-row gap-4 max-w-form">
            <div class="relative flex-grow group">
              <input
                type="email"
                v-model="email"
                :placeholder="$t('homePage.contactSection.placeholder')"
                required
                class="line-input"
              />
              <div class="line-input-accent"></div>
            </div>

            <BaseButton native-type="submit" variant="primary">
              {{ $t('homePage.contactSection.submit') }}
            </BaseButton>
          </form>

          <p class="privacy-note">
            <ShieldCheckIcon class="w-icon-sm h-icon-sm text-brand-accent" />
            {{ $t('homePage.contactSection.privacy') }}
          </p>
        </article>
      </div>

      <div class="faq-panel" data-aos="fade-up">
        <h2 class="section-heading mb-8">{{ $t('homePage.faq.heading') }}</h2>
        <details
          v-for="(faq, index) in faqItems"
          :key="faq.questionKey"
          class="faq-item"
          data-aos="fade-up"
          :data-aos-delay="index * 100"
        >
          <summary>{{ $t(faq.questionKey) }}</summary>
          <p>{{ $t(faq.answerKey) }}</p>
        </details>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ShieldCheckIcon } from 'lucide-vue-next'
import { faqItems, partnerSteps } from '~/data/home'

const { t } = useI18n()
const email = ref('')

const submitInquiry = () => {
  if (email.value) {
    alert(`${t('homePage.contactSection.submittedMessage')} ${email.value}`)
    email.value = ''
  }
}
</script>
