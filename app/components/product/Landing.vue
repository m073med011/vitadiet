<template>
  <article :dir="pageDirection" class="bg-surface">
    <section class="border-b border-line bg-surface-raised">
      <div
        class="content-container grid gap-gutter-lg py-section-sm lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.76fr)] lg:items-center lg:py-section"
      >
        <div class="min-w-0" data-aos="fade-up">
          <!-- Same component the other pages use, so the crumbs match the Breadcrumb
               JSON-LD emitted by useProductSchema and every crumb keeps a 44px target. -->
          <BaseBreadcrumb class="mb-page" :items="breadcrumbItems" />

          <p v-if="tagline" class="eyebrow-text">{{ tagline }}</p>
          <h1
            class="mt-control-y max-w-3xl text-heading-lg font-bold leading-heading text-ink lg:text-display"
          >
            {{ productTitle }}
          </h1>
          <p v-if="heroCopy" class="mt-page max-w-copy text-copy-lg leading-copy text-ink-soft">
            {{ heroCopy }}
          </p>

          <ul v-if="heroBenefits.length" class="mt-page grid gap-control-y">
            <li
              v-for="benefit in heroBenefits"
              :key="benefit"
              class="flex items-start gap-control-y text-copy font-semibold leading-copy text-ink"
            >
              <CheckCircleIcon
                class="mt-1 h-icon-sm w-icon-sm shrink-0 text-brand-primary"
                aria-hidden="true"
              />
              <span>{{ benefit }}</span>
            </li>
          </ul>

          <div class="mt-gutter flex flex-wrap items-center gap-page">
            <ProductPriceBadge
              v-if="hasApprovedPrice(product.price)"
              :price="product.price"
              size="lg"
            />
            <span
              class="badge-pill"
              :class="
                isAvailable
                  ? 'bg-brand-primary-soft text-brand-primary'
                  : 'bg-surface-muted text-ink-soft'
              "
            >
              {{ availabilityLabel }}
            </span>
          </div>

          <div class="mt-gutter flex flex-wrap gap-page">
            <BaseButton
              v-if="hasPurchaseOptions"
              native-type="button"
              variant="primary"
              @click="isPurchaseModalOpen = true"
            >
              <ShoppingBagIcon class="h-icon-sm w-icon-sm" aria-hidden="true" />
              {{ $t('purchase.cta') }}
            </BaseButton>
            <!-- Plain in-page anchor: routing to the current path would make NuxtLink
                 add aria-current="page", which misannounces a jump link. -->
            <BaseButton href="#product-information" variant="secondary">
              <InfoIcon class="h-icon-sm w-icon-sm" aria-hidden="true" />
              {{ isAvailable ? $t('productPage.productInfoCta') : $t('productPage.comingSoon') }}
            </BaseButton>
          </div>
        </div>

        <div class="min-w-0" data-aos="fade-up" data-aos-delay="100">
          <div
            class="group/product-image relative mx-auto h-[18rem] max-w-sm overflow-hidden rounded-card bg-surface sm:h-[22rem] lg:h-[32rem]"
          >
            <!-- Every gallery image is rendered here, not just the selected one. The
                 prerenderer only emits the resized variants it can see in the markup, so
                 swapping `src` on a single tag left the hero-sized variants of the other
                 images ungenerated and they 404'd on the static build. Hidden images keep
                 loading="lazy", so they cost nothing until the visitor picks one. -->
            <div
              v-for="(image, index) in product.images"
              v-show="image.src === activeImage.src"
              :key="image.src"
              class="absolute inset-0"
            >
              <BaseImage
                :src="image.src"
                :alt="getProductImageAlt(image, locale)"
                :width="image.width"
                :height="image.height"
                sizes="xs:90vw md:60vw xl:36vw"
                fill
                fit="contain"
                :loading="index === 0 ? 'eager' : 'lazy'"
                :class="heroImageClasses"
              />
            </div>
          </div>

          <div v-if="product.images.length > 1" class="mt-page flex justify-center gap-control-y">
            <button
              v-for="image in product.images"
              :key="image.src"
              type="button"
              class="focus-ring relative h-action w-action overflow-hidden rounded-card border bg-surface"
              :class="activeImage.src === image.src ? 'border-brand-primary' : 'border-line'"
              :aria-label="getProductImageAlt(image, locale)"
              :aria-pressed="activeImage.src === image.src"
              @click="selectedImageSrc = image.src"
            >
              <BaseImage
                :src="image.src"
                alt=""
                :width="image.width"
                :height="image.height"
                fill
                fit="cover"
                :class="thumbnailImageClasses"
                aria-hidden="true"
              />
            </button>
          </div>
        </div>
      </div>
    </section>

    <section id="product-information" class="section-block">
      <div
        class="content-container grid gap-gutter-lg lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1fr)]"
        :dir="detailLayoutDirection"
      >
        <!-- Pinned while the long detail column scrolls past it. Only from lg up: below
             that the columns stack, so sticking would trap the panel over the content. -->
        <aside
          v-if="identityFacts.length"
          :dir="pageDirection"
          class="grid h-fit gap-page rounded-card border border-line bg-surface-raised p-card lg:sticky lg:top-28"
        >
          <h2 class="text-title font-bold text-ink">{{ $t('productPage.sections.identity') }}</h2>
          <dl class="grid gap-page">
            <div v-for="fact in identityFacts" :key="fact.label" class="grid gap-1">
              <dt class="text-caption font-bold uppercase tracking-label text-ink-subtle">
                {{ fact.label }}
              </dt>
              <dd class="text-copy font-semibold leading-copy text-ink">
                {{ fact.value }}
              </dd>
            </div>
          </dl>
        </aside>

        <div :dir="pageDirection" class="product-detail-sections grid">
          <section v-if="definition" class="product-detail-section grid gap-page">
            <h2 class="product-detail-section__heading">
              {{ $t('productPage.sections.definition') }}
            </h2>
            <p class="text-copy-lg leading-copy text-ink-soft">{{ definition }}</p>
          </section>

          <section v-if="approvedBenefits.length" class="product-detail-section grid gap-page">
            <h2 class="product-detail-section__heading">
              {{ $t('productPage.sections.benefits') }}
            </h2>
            <ul class="grid gap-page sm:grid-cols-2">
              <li
                v-for="benefit in approvedBenefits"
                :key="benefit"
                class="rounded-card border border-line bg-surface-raised px-page py-page text-copy font-semibold leading-copy text-ink"
              >
                {{ benefit }}
              </li>
            </ul>
          </section>

          <section v-if="usage.length" class="product-detail-section grid gap-page">
            <h2 class="product-detail-section__heading">
              {{ $t('productPage.sections.usage') }}
            </h2>
            <ul class="grid gap-control-y text-copy leading-copy text-ink-soft">
              <li v-for="item in usage" :key="item">{{ item }}</li>
            </ul>
          </section>

          <section v-if="warnings.length" class="product-detail-section grid gap-page">
            <h2 class="product-detail-section__heading">
              {{ $t('productPage.sections.warnings') }}
            </h2>
            <ul class="grid gap-control-y text-copy leading-copy text-ink-soft">
              <li v-for="item in warnings" :key="item">{{ item }}</li>
            </ul>
          </section>

          <section v-if="suitableFor.length" class="product-detail-section grid gap-page">
            <h2 class="product-detail-section__heading">
              {{ $t('productPage.sections.suitableFor') }}
            </h2>
            <ul class="grid gap-control-y text-copy leading-copy text-ink-soft">
              <li v-for="item in suitableFor" :key="item">{{ item }}</li>
            </ul>
          </section>

          <!-- Always rendered, unlike the sections above it: the disclaimer and the
               quality route must be reachable from every product page, including one the
               Dashboard has filled in only sparsely. -->
          <section class="product-detail-section grid gap-page">
            <h2 class="product-detail-section__heading">
              {{ $t('productPage.sections.transparency') }}
            </h2>
            <p class="text-copy leading-copy text-ink-soft">
              {{ $t('productPage.transparencyNote') }}
            </p>
            <div class="flex flex-wrap gap-page">
              <BaseButton :to="localePath('/quality/')" variant="secondary">
                {{ $t('qualityPage.cta') }}
              </BaseButton>
              <BaseButton :to="localePath('/legal/medical-disclaimer/')" variant="secondary">
                {{ $t('legal.medicalDisclaimer') }}
              </BaseButton>
            </div>
          </section>

          <section id="where-to-buy" class="product-detail-section grid gap-page scroll-mt-28">
            <h2 class="product-detail-section__heading">
              {{ $t('productPage.sections.purchase') }}
            </h2>
            <ProductPurchaseOptions :product="product" />
          </section>

          <section v-if="approvedFaqs.length" class="product-detail-section grid gap-page">
            <h2 class="product-detail-section__heading">
              {{ $t('productPage.sections.faq') }}
            </h2>
            <div class="grid gap-page">
              <details
                v-for="faq in approvedFaqs"
                :key="faq.question"
                class="rounded-card border border-line bg-surface-raised px-page py-page"
              >
                <summary class="cursor-pointer text-copy font-bold text-ink">
                  {{ faq.question }}
                </summary>
                <p class="mt-page text-copy leading-copy text-ink-soft">{{ faq.answer }}</p>
              </details>
            </div>
          </section>

          <section v-if="relatedProducts.length" class="product-detail-section grid gap-page">
            <h2 class="product-detail-section__heading">
              {{ $t('productPage.sections.related') }}
            </h2>
            <ul class="grid gap-page sm:grid-cols-2">
              <li v-for="related in relatedProducts" :key="related.slug">
                <NuxtLink
                  :to="productPath(related.slug)"
                  class="focus-ring flex h-full items-center gap-page rounded-card border border-line bg-surface-raised px-page py-page transition-colors hover:border-brand-primary hover:text-brand-primary"
                >
                  <span
                    class="relative h-action w-action shrink-0 overflow-hidden rounded-card bg-surface"
                  >
                    <BaseImage
                      :src="getPrimaryImage(related).src"
                      alt=""
                      :width="getPrimaryImage(related).width"
                      :height="getPrimaryImage(related).height"
                      sizes="48px"
                      fill
                      fit="contain"
                      aria-hidden="true"
                    />
                  </span>
                  <span class="font-semibold leading-tight">{{
                    getProductTitle(related, locale)
                  }}</span>
                </NuxtLink>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </section>

    <PartnerCta />

    <ProductPurchaseModal
      :open="isPurchaseModalOpen"
      :product="product"
      @close="isPurchaseModalOpen = false"
    />
  </article>
</template>

<script setup lang="ts">
import { CheckCircleIcon, InfoIcon, ShoppingBagIcon } from 'lucide-vue-next'
import type { Product } from '~/types'
import {
  getApprovedCopies,
  getApprovedFaqs,
  getProductAvailabilityLabel,
  getProductDescription,
  getProductImageAlt,
  getProductTitle,
  getPrimaryImage,
  hasApprovedPrice,
  hasBuyablePurchaseOptions,
  isProductAvailable,
  localizeApprovedCopy,
  localizeCopy,
} from '~/services/product-catalog'

const props = defineProps<{
  product: Product
}>()

const { locale, t } = useI18n()
const localePath = useLocalePath()
const { productPath } = useProductPath()

const isRtl = computed(() => locale.value === 'ar')
const pageDirection = computed(() => (isRtl.value ? 'rtl' : 'ltr'))
const detailLayoutDirection = computed(() => (isRtl.value ? 'ltr' : 'rtl'))
const isPurchaseModalOpen = ref(false)
const selectedImageSrc = ref(getPrimaryImage(props.product).src)

watch(
  () => props.product.slug,
  () => {
    selectedImageSrc.value = getPrimaryImage(props.product).src
    isPurchaseModalOpen.value = false
  },
)

const productTitle = computed(() => getProductTitle(props.product, locale.value))

const breadcrumbItems = computed(() => [
  { label: t('home'), to: localePath('/') },
  { label: t('productPage.heading'), to: localePath('/products/') },
  { label: productTitle.value, to: productPath(props.product.slug) },
])
/**
 * The subtitle, above the h1 rather than in the body: it is the product's one-line
 * tagline ("قوتك تبدأ من الداخل"), and `heroCopy` below already carries the description.
 */
const tagline = computed(() => localizeApprovedCopy(props.product.listingDescription, locale.value))
const definition = computed(() => localizeApprovedCopy(props.product.definition, locale.value))
const heroCopy = computed(
  () => definition.value ?? getProductDescription(props.product, locale.value),
)
const approvedBenefits = computed(() => getApprovedCopies(props.product.benefits, locale.value))
const heroBenefits = computed(() => approvedBenefits.value.slice(0, 3))
const usage = computed(() => getApprovedCopies(props.product.usage, locale.value))
const warnings = computed(() => getApprovedCopies(props.product.warnings, locale.value))
const suitableFor = computed(() => getApprovedCopies(props.product.suitableFor, locale.value))

/**
 * Two different questions, deliberately kept apart. `isAvailable` is what the Dashboard
 * says about the product and drives the badge, the greyscale treatment and the jump-link
 * wording; `hasPurchaseOptions` is whether there is a platform button to press, and drives
 * only the buy CTA. A product can be in stock while its purchase links are still empty.
 */
const isAvailable = computed(() => isProductAvailable(props.product))
const hasPurchaseOptions = computed(() => hasBuyablePurchaseOptions(props.product))
const availabilityLabel = computed(() => getProductAvailabilityLabel(props.product, t))
const heroImageClasses = computed(() => [
  'transition-[filter] duration-500',
  !isAvailable.value && 'grayscale group-hover/product-image:grayscale-0',
])
const thumbnailImageClasses = computed(() => [
  'transition-[filter] duration-300',
  !isAvailable.value && 'grayscale hover:grayscale-0',
])

const activeImage = computed(
  () =>
    props.product.images.find((image) => image.src === selectedImageSrc.value) ??
    getPrimaryImage(props.product),
)

/**
 * The pinned panel, built from what the detail response actually carries. A stock count
 * of zero is a fact worth stating, so the row is guarded on the field being present
 * rather than on the number being truthy.
 */
const identityFacts = computed(() => [
  { label: t('productPage.details.availability'), value: availabilityLabel.value },
  ...(props.product.stockCount === undefined
    ? []
    : [
        {
          label: t('productPage.details.stock'),
          value: t('productPage.details.stockValue', { count: props.product.stockCount }),
        },
      ]),
])

const approvedFaqs = computed(() =>
  getApprovedFaqs(props.product).map((faq) => ({
    answer: localizeCopy(faq.answer.text, locale.value),
    question: localizeCopy(faq.question.text, locale.value),
  })),
)

// Sent inline by the detail endpoint as whole records, so the related strip costs no
// second request and cannot show a product the Dashboard has since unpublished.
const relatedProducts = computed(() => props.product.relatedProducts ?? [])
</script>

<style scoped>
.product-detail-sections {
  row-gap: var(--spacing-gutter);
}

.product-detail-section:not(:last-child) {
  padding-bottom: var(--spacing-gutter);
  border-bottom: 1px solid color-mix(in srgb, var(--color-brand-primary) 40%, transparent);
}

.product-detail-section__heading {
  width: fit-content;
  color: var(--color-brand-primary);
  font-size: var(--text-heading);
  font-weight: 700;
  line-height: var(--leading-heading);
}
</style>
