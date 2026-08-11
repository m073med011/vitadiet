import {
  HomeIcon,
  InfoIcon,
  PackageIcon,
  PhoneIcon,
  SparklesIcon,
} from 'lucide-vue-next'
import type { NavItem } from '~/types'

/**
 * Primary navigation items. Used by:
 * - Desktop nav bar (AppHeader → DesktopNav)
 * - Mobile sidebar   (AppHeader → MobileSidebar)
 * - Footer quick-links column (AppFooter → FooterLinks)
 *
 * The `icon` field is only rendered in the mobile sidebar; the footer
 * and desktop nav ignore it.
 */
export const navItems: NavItem[] = [
  { labelKey: 'home', hash: '', icon: HomeIcon },
  { labelKey: 'about', hash: '#who-we-are', icon: InfoIcon },
  { labelKey: 'services', hash: '#why', icon: SparklesIcon },
  { labelKey: 'products', hash: '', path: '/products/', icon: PackageIcon },
  { labelKey: 'contact', hash: '#footer', icon: PhoneIcon },
]
