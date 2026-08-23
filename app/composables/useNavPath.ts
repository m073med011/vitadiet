import type { NavItem } from '~/types'

export const useNavPath = () => {
  const localePath = useLocalePath()

  const navPath = (item: Pick<NavItem, 'path' | 'hash'>) =>
    item.path ? localePath(item.path) : `${localePath('/')}${item.hash}`

  return { navPath }
}
