import { REDUCED_MOTION_QUERY } from '~/utils/motion'

export function useReducedMotion() {
  const prefersReducedMotion = ref(false)
  let query: MediaQueryList | undefined

  function syncPreference(event?: MediaQueryListEvent) {
    prefersReducedMotion.value = event ? event.matches : Boolean(query?.matches)
  }

  onMounted(() => {
    query = window.matchMedia(REDUCED_MOTION_QUERY)
    syncPreference()
    query.addEventListener('change', syncPreference)
  })

  onUnmounted(() => {
    query?.removeEventListener('change', syncPreference)
  })

  return { prefersReducedMotion }
}
