import { ref, onMounted, onBeforeUnmount } from 'vue'

export interface UseMarqueeOptions {
    autoSpeed?: number
}

export function useMarquee(options: UseMarqueeOptions = {}) {
  const AUTO_SPEED = options.autoSpeed ?? 0.5

  const viewport = ref<HTMLElement | null>(null)
  const track = ref<HTMLElement | null>(null)
  const paused = ref(false)

  let offset = 0          
  let manualTarget = 0    
  let rafId = 0
  let isRtl = false
  let prefersReducedMotion = false
  let reducedMotionQuery: MediaQueryList | undefined
  let directionObserver: MutationObserver | undefined

  let lastTouchX = 0
  let isDragging = false
  let touchStartY = 0

  function loopWidth(): number {
    if (!track.value) return 0

    const cards = track.value.children
    const cloneIndex = cards.length / 2
    const firstCard = cards.item(0) as HTMLElement | null
    const firstClone = Number.isInteger(cloneIndex)
      ? cards.item(cloneIndex) as HTMLElement | null
      : null

    if (firstCard && firstClone) {
      const width = Math.abs(firstClone.offsetLeft - firstCard.offsetLeft)
      if (width > 0) return width
    }

    return track.value.scrollWidth / 2
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

  function cardStep(): number {
    const cards = track.value?.querySelectorAll<HTMLElement>('.product-card')
    const firstCard = cards?.item(0)
    const secondCard = cards?.item(1)

    if (firstCard && secondCard) {
      return Math.abs(secondCard.offsetLeft - firstCard.offsetLeft)
    }

    return firstCard?.offsetWidth ?? 300
  }

  function nudge(direction: number) {
    const distance = direction * cardStep()

    if (prefersReducedMotion) {
      offset += distance
      manualTarget = 0
      applyTransform()
      return
    }

    manualTarget += distance
  }

  function ensureVisible(element: HTMLElement) {
    if (!viewport.value || !track.value || !track.value.contains(element)) return

    const viewportRect = viewport.value.getBoundingClientRect()
    const elementRect = element.getBoundingClientRect()

    if (elementRect.left >= viewportRect.left && elementRect.right <= viewportRect.right) {
      return
    }

    const sign = isRtl ? 1 : -1
    const untransformedLeft = elementRect.left - (sign * offset)
    const centeredLeft = viewportRect.left + ((viewportRect.width - elementRect.width) / 2)
    const maximumOffset = Math.max(0, loopWidth() - 1)

    offset = Math.min(Math.max((centeredLeft - untransformedLeft) / sign, 0), maximumOffset)
    manualTarget = 0
    applyTransform()
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
      if (diffY > Math.abs(diffX)) return 
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

  function syncReducedMotion(event?: MediaQueryListEvent) {
    prefersReducedMotion = event ? event.matches : Boolean(reducedMotionQuery?.matches)
    if (prefersReducedMotion) manualTarget = 0
  }

  function syncDirection() {
    const nextIsRtl = getComputedStyle(document.documentElement).direction === 'rtl'
    if (nextIsRtl === isRtl) return

    isRtl = nextIsRtl
    offset = 0
    manualTarget = 0
    applyTransform()
  }

  onMounted(() => {
    isRtl = getComputedStyle(document.documentElement).direction === 'rtl'
    reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    syncReducedMotion()
    reducedMotionQuery.addEventListener('change', syncReducedMotion)

    directionObserver = new MutationObserver(syncDirection)
    directionObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['dir'],
    })

    rafId = requestAnimationFrame(tick)
  })

  onBeforeUnmount(() => {
    cancelAnimationFrame(rafId)
    reducedMotionQuery?.removeEventListener('change', syncReducedMotion)
    directionObserver?.disconnect()
  })

  return {
    viewport,
    track,
    paused,
    nudge,
    ensureVisible,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  }
}
