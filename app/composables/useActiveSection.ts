import { normalizePath } from '~/utils/path'
import type { NavItem } from '~/types'

export function useActiveSection(navItems: NavItem[]) {
  const route = useRoute()
  const localePath = useLocalePath()

  const activeHash = ref(route.hash || '')
  const sectionRatios = ref<Record<string, number>>({})
  let sectionObserver: IntersectionObserver | undefined
  let activeSectionFrame: number | undefined

  const homePath = computed(() => normalizePath(localePath('/')))

  watch(
    () => route.hash,
    (newHash) => {
      activeHash.value = newHash || ''
    },
  )

  function scheduleActiveSectionUpdate() {
    if (activeSectionFrame) return
    activeSectionFrame = window.requestAnimationFrame(() => {
      activeSectionFrame = undefined
      updateActiveSection()
    })
  }

  function updateActiveSection() {
    if (normalizePath(route.path) !== homePath.value) {
      activeHash.value = ''
      return
    }

    const sectionHashes = navItems.filter((item) => item.hash).map((item) => item.hash)
    if (sectionHashes.length === 0) {
      activeHash.value = ''
      return
    }

    if (window.scrollY < 120) {
      activeHash.value = ''
      return
    }

    // The observer band below (-18%/-58%) sits in the upper part of the viewport, which
    // the footer can never reach: at the bottom of the page scrolling stops, and unless
    // the footer is taller than ~58% of the viewport its top stays under the band. So
    // treat "scrolled to the bottom" as activating the bottom-most section, otherwise
    // the contact link is unreachable on desktop.
    const scrollBottom = window.scrollY + window.innerHeight
    if (scrollBottom >= document.documentElement.scrollHeight - 2) {
      const bottomMost = sectionHashes
        .map((hash) => {
          const el = document.querySelector<HTMLElement>(hash)
          return { hash, top: el ? el.getBoundingClientRect().top + window.scrollY : -1 }
        })
        .filter((item) => item.top >= 0)
        .sort((a, b) => b.top - a.top)[0]

      if (bottomMost) {
        activeHash.value = bottomMost.hash
        return
      }
    }

    const visibleSections = sectionHashes
      .map((hash) => ({ hash, ratio: sectionRatios.value[hash] ?? 0 }))
      .filter((item) => item.ratio > 0)
      .sort((a, b) => b.ratio - a.ratio)

    activeHash.value = visibleSections[0]?.hash ?? ''
  }

  function setupSectionObserver() {
    sectionObserver?.disconnect()
    sectionObserver = undefined
    sectionRatios.value = {}

    if (normalizePath(route.path) !== homePath.value) {
      activeHash.value = ''
      return
    }

    const sectionHashes = navItems.filter((item) => item.hash).map((item) => item.hash)
    if (sectionHashes.length === 0) return

    const elements = sectionHashes
      .map((hash) => document.querySelector<HTMLElement>(hash))
      .filter((el): el is HTMLElement => Boolean(el))

    if (elements.length === 0) return

    sectionObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id
          if (!id) continue
          sectionRatios.value[`#${id}`] = entry.isIntersecting ? entry.intersectionRatio : 0
        }
        scheduleActiveSectionUpdate()
      },
      {
        root: null,
        rootMargin: '-18% 0px -58% 0px',
        threshold: [0, 0.2, 0.4, 0.6, 0.8, 1],
      },
    )

    for (const el of elements) {
      sectionObserver.observe(el)
    }

    scheduleActiveSectionUpdate()
  }

  watch(
    () => route.path,
    async () => {
      await nextTick()
      setupSectionObserver()
    },
  )

  watch(
    () => route.fullPath,
    () => {
      scheduleActiveSectionUpdate()
    },
  )

  onMounted(() => {
    setupSectionObserver()
  })

  onUnmounted(() => {
    sectionObserver?.disconnect()
    if (activeSectionFrame) {
      window.cancelAnimationFrame(activeSectionFrame)
    }
  })

  return {
    activeHash,
    scheduleActiveSectionUpdate,
  }
}
