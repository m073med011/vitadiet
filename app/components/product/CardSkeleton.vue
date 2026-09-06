<template>
  <!--
    A stand-in for `ProductCard`, not a generic box: the same border, radius, shadow,
    aspect-square media well and `p-3 sm:p-4` body, so the grid does not resize when the
    real cards arrive. `product-card` is carried too, because `ProductCarousel` sizes its
    track through `.product-list :deep(.product-card)`.

    Presentational only - the surrounding section owns the `role="status"` that announces
    the wait, so this is hidden from assistive technology rather than read out as a dozen
    empty articles.
  -->
  <div
    class="product-card flex h-full flex-col overflow-hidden rounded-card border border-line/80 bg-surface shadow-card"
    aria-hidden="true"
  >
    <div class="skeleton aspect-square w-full rounded-none" />

    <div class="flex flex-1 flex-col gap-1.5 p-3 sm:gap-2 sm:p-4">
      <div class="skeleton-line w-4/5" />
      <div class="skeleton-line w-3/5" />

      <div class="mt-1 grid gap-1.5">
        <div class="skeleton-line w-full" />
        <div class="skeleton-line w-11/12" />
        <div class="skeleton-line w-2/3" />
      </div>

      <div class="mt-auto grid gap-2 border-t border-line pt-2 sm:pt-3">
        <div class="flex items-center justify-center gap-1.5">
          <div class="skeleton h-6 w-20 rounded-pill" />
          <div class="skeleton h-6 w-16 rounded-pill" />
        </div>

        <!-- Two 44px bars: the card's own buttons carry `min-h-11`. -->
        <div class="skeleton-block h-11 w-full" />
        <div class="skeleton-block h-11 w-full" />
      </div>
    </div>
  </div>
</template>
