<template>
  <div class="bg-surface pt-section-sm pb-section">
    <div class="content-container">
      <BaseBreadcrumb :items="breadcrumbItems" />

      <article class="mx-auto mt-page max-w-copy">
        <header data-aos="fade-up">
          <h1 class="text-heading-lg font-bold leading-heading text-ink">{{ title }}</h1>
          <p v-if="intro" class="mt-page text-copy-lg leading-copy text-ink-soft">{{ intro }}</p>
          <p class="mt-page text-small text-ink-soft">
            {{ $t('legal.lastReviewed', { date: document.lastReviewed }) }}
          </p>
        </header>

        <div class="mt-gutter-lg grid gap-gutter">
          <section
            v-for="section in sections"
            :id="section.id"
            :key="section.id"
            class="scroll-mt-28 grid gap-page"
            data-aos="fade-up"
          >
            <h2 class="text-heading font-bold leading-heading text-brand-primary">
              {{ section.heading }}
            </h2>
            <p
              v-for="paragraph in section.body"
              :key="paragraph"
              class="text-copy leading-copy text-ink-soft"
            >
              {{ paragraph }}
            </p>
          </section>
        </div>

        <nav class="mt-gutter-lg border-t border-line pt-gutter" :aria-label="$t('legal.related')">
          <h2 class="mb-page text-caption font-bold uppercase tracking-label text-ink-subtle">
            {{ $t('legal.related') }}
          </h2>
          <ul class="flex flex-wrap gap-page">
            <li v-for="link in relatedLinks" :key="link.labelKey">
              <NuxtLink
                :to="localePath(link.path!)"
                class="focus-ring inline-flex min-h-11 items-center rounded-control border border-line bg-surface-raised px-page text-small font-semibold text-ink transition-colors hover:border-brand-primary hover:text-brand-primary"
              >
                {{ $t(link.labelKey) }}
              </NuxtLink>
            </li>
          </ul>
        </nav>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import { footerLinkGroups } from '~/data/navigation'
import {
  getLegalDocumentBySlug,
  getLegalTitle,
  localizeLegalSections,
} from '~/services/site-content'
import { localizeApprovedCopy } from '~/services/product-catalog'

const route = useRoute()
const { locale, t } = useI18n()
const localePath = useLocalePath()
const { absoluteSiteUrl } = useSiteUrls()

const slugValue = computed(() => {
  const value = route.params.slug
  return Array.isArray(value) ? (value[0] ?? '') : String(value)
})

const { data, error } = await useAsyncData(
  () => `legal:${slugValue.value}`,
  () => getLegalDocumentBySlug(slugValue.value),
  { watch: [slugValue] },
)

// A transport failure stays a 500; only a resolved-but-absent document is a 404. Raised
// here rather than inside the handler so the SEO composables below never dereference a
// document that was never found.
if (error.value) {
  throw error.value
}

const resolvedDocument = data.value
if (!resolvedDocument) {
  throw createError({ statusCode: 404, statusMessage: t('error.notFound'), fatal: true })
}

const document = computed(() => data.value ?? resolvedDocument)

const title = computed(() => getLegalTitle(document.value, locale.value))
const intro = computed(() => localizeApprovedCopy(document.value.intro, locale.value))
const sections = computed(() => localizeLegalSections(document.value.sections, locale.value))
const description = computed(
  () => localizeApprovedCopy(document.value.seoDescription, locale.value) ?? title.value,
)

const legalGroup = footerLinkGroups.find((group) => group.labelKey === 'footer.groups.legal')
const relatedLinks = computed(() =>
  (legalGroup?.items ?? []).filter((item) => item.path !== `/legal/${slugValue.value}/`),
)

const breadcrumbItems = computed(() => [
  { label: t('home'), to: localePath('/') },
  { label: title.value, to: localePath(`/legal/${slugValue.value}/`) },
])

useSchemaOrg([
  defineBreadcrumb({
    itemListElement: breadcrumbItems.value.map((item) => ({
      name: item.label,
      item: absoluteSiteUrl(item.to),
    })),
  }),
])

usePageSeo({
  title: () => title.value,
  description: () => description.value,
})
</script>
