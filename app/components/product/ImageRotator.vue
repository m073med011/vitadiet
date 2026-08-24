<template>
  <div
    :dir="pageDirection"
    class="order-first flex flex-col items-center justify-center lg:col-start-1 lg:row-start-1"
    data-aos="fade-up"
  >
    <div
      class="flex h-[clamp(calc(var(--spacing-product-lg)_+_var(--spacing-rule-lg)_+_var(--spacing-product)_+_var(--spacing-page-lg)),58svh,calc(var(--spacing-hero)_-_var(--spacing-rule-lg)_+_var(--spacing-control-y-sm)))] min-h-[calc(var(--spacing-product-lg)_+_var(--spacing-rule-lg)_+_var(--spacing-product)_+_var(--spacing-page-lg))] w-full items-center justify-center md:h-hero md:min-h-product-lg lg:h-[min(var(--spacing-hero-lg),calc(100svh_-_var(--anchor-offset)_-_var(--spacing-gutter)))]"
    >
      <Transition
        mode="out-in"
        enter-active-class="transition-[opacity,transform] duration-[var(--motion-page)] ease-[var(--motion-ease-out)] motion-reduce:transition-none"
        leave-active-class="transition-[opacity,transform] duration-[var(--motion-page)] ease-[var(--motion-ease-out)] motion-reduce:transition-none"
        enter-from-class="translate-y-control-y-sm scale-[0.985] opacity-0 motion-reduce:translate-y-0 motion-reduce:scale-100"
        leave-to-class="translate-y-control-y-sm scale-[0.985] opacity-0 motion-reduce:translate-y-0 motion-reduce:scale-100"
      >
        <BaseImage
          :key="activeImage"
          class="block"
          :src="activeImage"
          :alt="alt"
          :width="668"
          :height="911"
          fill
          fit="contain"
          loading="eager"
        />
      </Transition>
    </div>

    <ProductGallery
      v-if="images.length > 1"
      layout="horizontal"
      :images="images"
      :active-image="activeImage"
      :product-title="alt"
      @select="selectImage"
    />
  </div>

  <ProductGallery
    v-if="images.length > 1"
    :dir="pageDirection"
    layout="vertical"
    :images="images"
    :active-image="activeImage"
    :product-title="alt"
    @select="selectImage"
  />
</template>

<script setup lang="ts">
const props = defineProps<{
  alt: string
  images: string[]
  pageDirection: 'ltr' | 'rtl'
}>()

const IMAGE_ROTATION_DELAY = 3500

let imageRotationTimer: ReturnType<typeof setInterval> | undefined

const { prefersReducedMotion } = useReducedMotion()
const activeImage = ref(props.images[0] ?? '')

function clearImageRotation() {
  if (!imageRotationTimer) {
    return
  }

  clearInterval(imageRotationTimer)
  imageRotationTimer = undefined
}

function rotateImage() {
  if (props.images.length < 2) {
    return
  }

  const currentIndex = props.images.indexOf(activeImage.value)
  const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % props.images.length

  activeImage.value = props.images[nextIndex] ?? props.images[0] ?? ''
}

function startImageRotation() {
  clearImageRotation()

  if (prefersReducedMotion.value || props.images.length < 2) {
    return
  }

  imageRotationTimer = setInterval(rotateImage, IMAGE_ROTATION_DELAY)
}

function selectImage(img: string) {
  activeImage.value = img
  startImageRotation()
}

watch(
  () => props.images,
  (images) => {
    activeImage.value = images[0] ?? ''
    startImageRotation()
  },
)

watch(prefersReducedMotion, startImageRotation)

onMounted(startImageRotation)

onBeforeUnmount(clearImageRotation)
</script>
