import { ref, onMounted, onBeforeUnmount } from 'vue'

export interface UseMarqueeOptions {
  /** Pixels per frame for the ambient auto-scroll (default: 0.5) */
  autoSpeed?: number
}

/**
 * rAF-driven infinite marquee with touch-gesture support and RTL awareness.
 *
 * Extracted from HomeProducts to decouple the animation engine from the
 * product card rendering.
 *
 * The consumer must bind `viewport` and `track` template refs, and wire
 * the touch/pause event handlers to the viewport element.
 */
export function useMarquee(options: UseMarqueeOptions = {}) {
  const AUTO_SPEED = options.autoSpeed ?? 0.5

  const viewport = ref<HTMLElement | null>(null)
  const track = ref<HTMLElement | null>(null)
  const paused = ref(false)

  let offset = 0          // current translation in pixels (always >= 0)
  let manualTarget = 0    // extra distance queued by the arrow buttons
  let rafId = 0
  let isRtl = false
  let prefersReducedMotion = false

  let lastTouchX = 0
  let isDragging = false
  let touchStartY = 0

  function loopWidth(): number {
    // Half of the track = one full copy of the product list.
    return track.value ? track.value.scrollWidth / 2 : 0
  }

  function applyTransform() {
    if (!track.value) return
    const half = loopWidth()
    if (half > 0) {
      offset = ((offset % half) + half) % half
    }
    const sign = isRtl ? 1 : -1
    track.value.style.transform = `translate3d(${sign * offset}px, 0, 0)`
  }

  function tick() {
    // Ease through any queued arrow movement, then apply ambient drift.
    if (manualTarget !== 0) {
      const step = manualTarget * 0.12
      offset += step
      manualTarget -= step
      if (Math.abs(manualTarget) < 0.5) {
        offset += manualTarget
        manualTarget = 0
      }
    } else if (!paused.value && !prefersReducedMotion) {
      offset += AUTO_SPEED
    }
    applyTransform()
    rafId = requestAnimationFrame(tick)
  }

  /** Advance one card width in the given direction (1 = next, -1 = prev). */
  function nudge(direction: number) {
    const card = track.value?.querySelector<HTMLElement>('.product-card')
    const gap = 20 // matches the track gap
    const cardWidth = card ? card.offsetWidth + gap : 300
    manualTarget += direction * cardWidth
  }

  function handleTouchStart(e: TouchEvent) {
    paused.value = true
    const touch = e.changedTouches[0]
    if (!touch) return
    lastTouchX = touch.screenX
    touchStartY = touch.screenY
    isDragging = false
  }

  function handleTouchMove(e: TouchEvent) {
    if (!paused.value) return
    const touch = e.changedTouches[0]
    if (!touch) return
    const currentX = touch.screenX
    const currentY = touch.screenY
    const diffX = lastTouchX - currentX
    const diffY = Math.abs(touchStartY - currentY)

    if (!isDragging) {
      if (diffY > Math.abs(diffX)) return // User is scrolling vertically
      if (Math.abs(diffX) > 5) isDragging = true
    }

    if (isDragging) {
      lastTouchX = currentX
      const move = isRtl ? -diffX : diffX
      offset += move
      manualTarget = 0
    }
  }

  function handleTouchEnd(_e: TouchEvent) {
    paused.value = false
  }

  onMounted(() => {
    isRtl = getComputedStyle(document.documentElement).direction === 'rtl'
    prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    rafId = requestAnimationFrame(tick)
  })

  onBeforeUnmount(() => {
    cancelAnimationFrame(rafId)
  })

  return {
    viewport,
    track,
    paused,
    nudge,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  }
}
