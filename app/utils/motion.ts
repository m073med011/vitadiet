export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia(REDUCED_MOTION_QUERY).matches

/** Per-item AOS entrance delay for staggered lists. */
export const AOS_STAGGER_MS = 80
