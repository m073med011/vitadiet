import { ref, onMounted, onUnmounted } from 'vue'

/**
 * Reactive wrapper around `prefers-reduced-motion: reduce`.
 * Auto-subscribes on mount and cleans up on unmount.
 *
 * Used by HomeProducts (marquee), ProductLanding (image rotation),
 * router.options (scroll behavior), and aos.client (reveal animations).
 */
export function useReducedMotion() {
  const prefersReducedMotion = ref(false)
  let query: MediaQueryList | undefined

  function syncPreference(event?: MediaQueryListEvent) {
    prefersReducedMotion.value = event ? event.matches : Boolean(query?.matches)
  }

  onMounted(() => {
    query = window.matchMedia('(prefers-reduced-motion: reduce)')
    syncPreference()
    query.addEventListener('change', syncPreference)
  })

  onUnmounted(() => {
    query?.removeEventListener('change', syncPreference)
  })

  return { prefersReducedMotion }
}
