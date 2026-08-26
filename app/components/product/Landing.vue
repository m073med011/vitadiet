<template>
  <article :dir="pageDirection" class="bg-surface">
    <section class="border-b border-line bg-surface-raised">
      <div
        class="content-container grid gap-gutter-lg py-section-sm lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.76fr)] lg:items-center lg:py-section"
      >
        <div class="min-w-0" data-aos="fade-up">
          <nav
            class="mb-page flex items-center gap-2 text-small font-semibold text-ink-soft"
            :aria-label="$t('navigation')"
          >
            <NuxtLink :to="localePath('/')" class="hover:text-brand-primary">
              {{ $t('home') }}
            </NuxtLink>
            <ChevronRightIcon
              class="h-icon-sm w-icon-sm shrink-0 rtl:rotate-180"
              aria-hidden="true"
            />
            <NuxtLink :to="localePath('/products/')" class="hover:text-brand-primary">
              {{ $t('products') }}
            </NuxtLink>
          </nav>

          <p class="eyebrow-text">{{ product.englishName }}</p>
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
                hasPurchaseOptions
                  ? 'bg-brand-primary-soft text-brand-primary'
                  : 'bg-surface-muted text-ink-soft'
              "
            >
              {{ $t(availabilityKey) }}
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
              {{ $t('productPage.productInfoCta') }}
            </BaseButton>
          </div>
        </div>

        <div class="min-w-0" data-aos="fade-up" data-aos-delay="100">
          <div
            class="group/product-image relative mx-auto h-[18rem] max-w-sm overflow-hidden rounded-card bg-surface sm:h-[22rem] lg:h-[32rem]"
          >
            <BaseImage
              :src="activeImage.src"
              :alt="activeImageAlt"
              :width="activeImage.width"
              :height="activeImage.height"
              sizes="xs:90vw md:60vw xl:36vw"
              fill
              fit="contain"
              loading="eager"
              :class="heroImageClasses"
            />
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
      >
        <aside class="grid h-fit gap-page rounded-card border border-line bg-surface-raised p-card">
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

        <div class="grid gap-gutter">
          <section v-if="definition" class="grid gap-page">
            <h2 class="text-heading font-bold leading-heading text-ink">
              {{ $t('productPage.sections.definition') }}
            </h2>
            <p class="text-copy-lg leading-copy text-ink-soft">{{ definition }}</p>
          </section>

          <section v-if="usesPhase2Template && approvedBenefits.length" class="grid gap-page">
            <h2 class="text-heading font-bold leading-heading text-ink">
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

          <section v-if="usesPhase2Template && approvedIngredients.length" class="grid gap-page">
            <h2 class="text-heading font-bold leading-heading text-ink">
              {{ $t('productPage.sections.ingredients') }}
            </h2>
            <ul class="grid gap-control-y">
              <li
                v-for="ingredient in approvedIngredients"
                :key="localizeCopy(ingredient.name, locale)"
                class="grid gap-1 rounded-card border border-line bg-surface-raised px-page py-page sm:grid-cols-[minmax(0,1fr)_auto]"
              >
                <span class="font-semibold text-ink">{{
                  localizeCopy(ingredient.name, locale)
                }}</span>
                <span v-if="ingredient.amount" class="text-small text-ink-soft">{{
                  ingredient.amount
                }}</span>
              </li>
            </ul>
          </section>

          <section v-if="usesPhase2Template && usage.length" class="grid gap-page">
            <h2 class="text-heading font-bold leading-heading text-ink">
              {{ $t('productPage.sections.usage') }}
            </h2>
            <ul class="grid gap-control-y text-copy leading-copy text-ink-soft">
              <li v-for="item in usage" :key="item">{{ item }}</li>
            </ul>
          </section>

          <section v-if="usesPhase2Template && warnings.length" class="grid gap-page">
            <h2 class="text-heading font-bold leading-heading text-ink">
              {{ $t('productPage.sections.warnings') }}
            </h2>
            <ul class="grid gap-control-y text-copy leading-copy text-ink-soft">
              <li v-for="item in warnings" :key="item">{{ item }}</li>
            </ul>
          </section>

          <section v-if="usesPhase2Template && suitableFor.length" class="grid gap-page">
            <h2 class="text-heading font-bold leading-heading text-ink">
              {{ $t('productPage.sections.suitableFor') }}
            </h2>
            <ul class="grid gap-control-y text-copy leading-copy text-ink-soft">
              <li v-for="item in suitableFor" :key="item">{{ item }}</li>
            </ul>
          </section>

          <section
            v-if="usesPhase2Template && (manufacturerFacts.length || complianceFacts.length)"
            class="grid gap-page"
          >
            <h2 class="text-heading font-bold leading-heading text-ink">
              {{ $t('productPage.sections.manufacturing') }}
            </h2>
            <dl class="grid gap-page sm:grid-cols-2">
              <div
                v-for="fact in [...manufacturerFacts, ...complianceFacts]"
                :key="fact.label"
                class="rounded-card border border-line bg-surface-raised px-page py-page"
              >
                <dt class="text-caption font-bold uppercase tracking-label text-ink-subtle">
                  {{ fact.label }}
                </dt>
                <dd class="mt-1 text-copy font-semibold leading-copy text-ink">{{ fact.value }}</dd>
              </div>
            </dl>
          </section>

          <section id="where-to-buy" class="grid gap-page scroll-mt-28">
            <h2 class="text-heading font-bold leading-heading text-ink">
              {{ $t('productPage.sections.purchase') }}
            </h2>
            <ProductPurchaseOptions :product="product" />
          </section>

          <section v-if="usesPhase2Template && approvedFaqs.length" class="grid gap-page">
            <h2 class="text-heading font-bold leading-heading text-ink">
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

          <section v-if="usesPhase2Template && approvedReferences.length" class="grid gap-page">
            <h2 class="text-heading font-bold leading-heading text-ink">
              {{ $t('productPage.sections.references') }}
            </h2>
            <ul class="grid gap-control-y">
              <li v-for="reference in approvedReferences" :key="reference.label">
                <a
                  v-if="reference.url"
                  :href="reference.url"
                  class="font-semibold text-brand-primary underline-offset-4 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {{ reference.label }}
                </a>
                <span v-else class="text-copy text-ink-soft">{{ reference.label }}</span>
              </li>
            </ul>
          </section>

          <section v-if="usesPhase2Template && relatedProducts.length" class="grid gap-page">
            <h2 class="text-heading font-bold leading-heading text-ink">
              {{ $t('productPage.sections.related') }}
            </h2>
            <ul class="grid gap-page sm:grid-cols-2">
              <li v-for="related in relatedProducts" :key="related.slug">
                <NuxtLink
                  :to="productPath(related.slug)"
                  class="focus-ring flex h-full items-center gap-page rounded-card border border-line bg-surface-raised px-page py-page transition-colors hover:border-brand-primary hover:text-brand-primary"
                >
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

    <section class="border-y border-line bg-surface-raised py-section-sm">
      <div
        class="content-container grid gap-page md:grid-cols-[minmax(0,1fr)_auto] md:items-center"
      >
        <div>
          <p class="eyebrow-text">{{ $t('partnerSection.eyebrow') }}</p>
          <h2 class="mt-1 text-heading font-bold leading-heading text-ink">
            {{ $t('partnerSection.heading') }}
          </h2>
          <p class="mt-page max-w-copy text-copy leading-copy text-ink-soft">
            {{ $t('partnerSection.description') }}
          </p>
        </div>
        <BaseButton :href="`mailto:${CONTACT.email}`" variant="primary">
          <MailIcon class="h-icon-sm w-icon-sm" aria-hidden="true" />
          {{ $t('partnerSection.cta') }}
        </BaseButton>
      </div>
    </section>

    <ProductPurchaseModal
      :open="isPurchaseModalOpen"
      :product="product"
      @close="isPurchaseModalOpen = false"
    />
  </article>
</template>

<script setup lang="ts">
import {
  CheckCircleIcon,
  ChevronRightIcon,
  InfoIcon,
  MailIcon,
  ShoppingBagIcon,
} from 'lucide-vue-next'
import { CONTACT } from '#shared/brand'
import { products } from '~/data/products'
import type { HomeProduct, ProductFact, ProductReference } from '~/types'
import {
  getApprovedCopies,
  getApprovedFacts,
  getApprovedIngredients,
  getProductAvailabilityLabelKey,
  getProductDescription,
  getProductImageAlt,
  getProductTitle,
  getPrimaryImage,
  hasApprovedPrice,
  hasBuyablePurchaseOptions,
  isApproved,
  localizeApprovedCopy,
  localizeCopy,
} from '~/services/product-catalog'

const props = defineProps<{
  product: HomeProduct
}>()

const { locale, t } = useI18n()
const localePath = useLocalePath()
const { productPath } = useProductPath()

const isRtl = computed(() => locale.value === 'ar')
const pageDirection = computed(() => (isRtl.value ? 'rtl' : 'ltr'))
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
const usesPhase2Template = computed(() => props.product.templateVersion === 'phase-2')
const definition = computed(() => localizeApprovedCopy(props.product.definition, locale.value))
const positioning = computed(() => localizeApprovedCopy(props.product.positioning, locale.value))
const heroCopy = computed(
  () => positioning.value ?? definition.value ?? getProductDescription(props.product, locale.value),
)
const approvedBenefits = computed(() => getApprovedCopies(props.product.benefits, locale.value))
const heroBenefits = computed(() => approvedBenefits.value.slice(0, 3))
const approvedIngredients = computed(() => getApprovedIngredients(props.product.ingredients))
const usage = computed(() => getApprovedCopies(props.product.usage, locale.value))
const warnings = computed(() => getApprovedCopies(props.product.warnings, locale.value))
const suitableFor = computed(() => getApprovedCopies(props.product.suitableFor, locale.value))
const hasPurchaseOptions = computed(() => hasBuyablePurchaseOptions(props.product))
const availabilityKey = computed(() => getProductAvailabilityLabelKey(props.product))
const heroImageClasses = computed(() => [
  'transition-[filter] duration-500',
  !hasPurchaseOptions.value && 'grayscale group-hover/product-image:grayscale-0',
])
const thumbnailImageClasses = computed(() => [
  'transition-[filter] duration-300',
  !hasPurchaseOptions.value && 'grayscale hover:grayscale-0',
])

const activeImage = computed(
  () =>
    props.product.images.find((image) => image.src === selectedImageSrc.value) ??
    getPrimaryImage(props.product),
)
const activeImageAlt = computed(() => getProductImageAlt(activeImage.value, locale.value))

const localizeFacts = (facts: ProductFact[]) =>
  facts.map((fact) => ({
    label: localizeCopy(fact.label, locale.value),
    value: localizeCopy(fact.value, locale.value),
  }))

const identityFacts = computed(() => [
  { label: t('productPage.details.arabicName'), value: props.product.arabicName },
  { label: t('productPage.details.englishName'), value: props.product.englishName },
  {
    label: t('productPage.details.packSize'),
    value: localizeCopy(props.product.packSize, locale.value),
  },
  ...(props.product.lastReviewed
    ? [{ label: t('productPage.details.lastReviewed'), value: props.product.lastReviewed }]
    : []),
])

const manufacturerFacts = computed(() =>
  localizeFacts(getApprovedFacts(props.product.manufacturer)),
)
const complianceFacts = computed(() => localizeFacts(getApprovedFacts(props.product.compliance)))

const approvedFaqs = computed(() =>
  (props.product.faqs ?? [])
    .filter((faq) => isApproved(faq.question.status) && isApproved(faq.answer.status))
    .map((faq) => ({
      answer: localizeCopy(faq.answer.text, locale.value),
      question: localizeCopy(faq.question.text, locale.value),
    })),
)

const approvedReferences = computed(() =>
  (props.product.references ?? [])
    .filter((reference) => isApproved(reference.status))
    .map((reference: ProductReference) => ({
      label: localizeCopy(reference.label, locale.value),
      url: reference.url,
    })),
)

const relatedProducts = computed(() =>
  (props.product.relatedSlugs ?? []).flatMap(
    (slug) => products.find((product) => product.slug === slug) ?? [],
  ),
)
</script>
