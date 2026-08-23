export function useScrollState(threshold = 20) {
  const isScrolled = ref(false)
  let scrollFrame: number | undefined

  function updateScrolledState() {
    const nextIsScrolled = window.scrollY > threshold
    if (isScrolled.value !== nextIsScrolled) {
      isScrolled.value = nextIsScrolled
    }
    scrollFrame = undefined
  }

  function handleScroll() {
    if (scrollFrame) return
    scrollFrame = window.requestAnimationFrame(updateScrolledState)
  }

  onMounted(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
    if (scrollFrame) {
      window.cancelAnimationFrame(scrollFrame)
    }
  })

  return { isScrolled, handleScroll }
}
