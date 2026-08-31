import type { NavItem } from '~/types'

export const useNavPath = () => {
  const localePath = useLocalePath()

  const navPath = (item: Pick<NavItem, 'path' | 'hash' | 'anchor'>) => {
    if (item.path) return localePath(item.path)
    // A same-page anchor must stay a bare fragment: prefixing it with the home path
    // would turn an in-page jump into a route change on every other page.
    if (item.anchor) return item.hash
    return `${localePath('/')}${item.hash}`
  }

  return { navPath }
}
