export default defineNuxtPlugin((nuxtApp) => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
  let revealObserver: IntersectionObserver | undefined
  let refreshFrame: number | undefined

  function prepareRevealElement(element: HTMLElement) {
    if (element.dataset.aosReady === 'true') {
      return
    }

    element.dataset.aosReady = 'true'

    const delay = Number(element.dataset.aosDelay ?? 0)
    const duration = Number(element.dataset.aosDuration ?? 450)

    if (delay > 0) {
      element.style.transitionDelay = `${delay}ms`
    }

    element.style.transitionDuration = `${duration}ms`
  }

  function revealVisibleElements() {
    document.querySelectorAll<HTMLElement>('[data-aos]').forEach((element) => {
      prepareRevealElement(element)

      if (prefersReducedMotion.matches) {
        element.classList.add('aos-animate')
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
    revealObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue

        entry.target.classList.add('aos-animate')
        revealObserver?.unobserve(entry.target)
      }
    }, {
      rootMargin: '0px 0px -48px 0px',
      threshold: 0.01,
    })

    scheduleRevealRefresh()
  })

  nuxtApp.hook('page:finish', scheduleRevealRefresh)
})
