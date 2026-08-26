import {
  AwardIcon,
  HandshakeIcon,
  HomeIcon,
  InfoIcon,
  MapPinIcon,
  PackageIcon,
} from 'lucide-vue-next'
import type { NavItem } from '~/types'

export const navItems: NavItem[] = [
  { labelKey: 'products', hash: '', path: '/products/', icon: PackageIcon },
  { labelKey: 'services', hash: '#why', icon: AwardIcon },
  { labelKey: 'about', hash: '#who-we-are', icon: InfoIcon },
  { labelKey: 'findProducts', hash: '#where-to-buy', icon: MapPinIcon },
]

export const partnerNavItem: NavItem = {
  labelKey: 'partners',
  hash: '#partners',
  icon: HandshakeIcon,
}

export const footerNavItems: NavItem[] = [
  { labelKey: 'home', hash: '', icon: HomeIcon },
  ...navItems,
  partnerNavItem,
]
