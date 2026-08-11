export default defineNuxtPlugin((nuxtApp) => {
  // Static generation renders the client bundle in a browser to capture HTML.
  // Do not mutate that captured DOM: Vue must receive the same markup for its
  // first client render, otherwise AOS classes/inline styles cause hydration
  // mismatches. The plugin still runs normally for real visitors.
  if (import.meta.prerender) return

  // Reveal state is an attribute, not a class: Vue rewrites the whole `className`
  // of any element carrying a dynamic :class binding, which would silently drop a
  // class we add here (leaving the element stuck at the base opacity:0). Vue never
  // patches attributes absent from the vnode, so this survives re-renders.
  const REVEAL_ATTR = 'data-aos-animate'

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
  let revealObserver: IntersectionObserver | undefined
  let refreshFrame: number | undefined
  let isReady = false

  function revealVisibleElements() {
    document.querySelectorAll<HTMLElement>('[data-aos]').forEach((element) => {
      if (element.hasAttribute(REVEAL_ATTR)) return

      if (prefersReducedMotion.matches) {
        element.setAttribute(REVEAL_ATTR, '')
        return
      }

      revealObserver?.observe(element)
    })
  }

  function scheduleRevealRefresh() {
    if (refreshFrame) {
      window.cancelAnimationFrame(refreshFrame)
    }

    refreshFrame = window.requestAnimationFrame(() => {
      revealVisibleElements()
      refreshFrame = undefined
    })
  }

  nuxtApp.hook('app:mounted', () => {
    // `app:mounted` can run while nested islands are still hydrating. Defer DOM
    // writes to the next task so AOS never changes a node Vue is comparing.
    window.setTimeout(() => {
      revealObserver = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue

          entry.target.setAttribute(REVEAL_ATTR, '')
          revealObserver?.unobserve(entry.target)
        }
      }, {
        rootMargin: '0px 0px -48px 0px',
        threshold: 0.01,
      })

      isReady = true
      scheduleRevealRefresh()
    }, 0)
  })

  // Initial `page:finish` can fire before hydration has finished. Until AOS is
  // initialized, do not write inline styles to rendered nodes.
  nuxtApp.hook('page:finish', () => {
    if (isReady) scheduleRevealRefresh()
  })
})
