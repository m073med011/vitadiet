export default defineNuxtPlugin((nuxtApp) => {
  
  
  
  
  if (import.meta.prerender) return

  
  
  
  
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
      document.documentElement.classList.add('aos-ready')
      scheduleRevealRefresh()
    }, 0)
  })

  
  
  nuxtApp.hook('page:finish', () => {
    if (isReady) scheduleRevealRefresh()
  })
})
