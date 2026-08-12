import { ref, onMounted, onUnmounted } from 'vue'

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
