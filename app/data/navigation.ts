import { HomeIcon, InfoIcon, PackageIcon, PhoneIcon, SparklesIcon } from 'lucide-vue-next'
import type { NavItem } from '~/types'

export const navItems: NavItem[] = [
  { labelKey: 'home', hash: '', icon: HomeIcon },
  { labelKey: 'about', hash: '#who-we-are', icon: InfoIcon },
  { labelKey: 'services', hash: '#why', icon: SparklesIcon },
  { labelKey: 'products', hash: '', path: '/products/', icon: PackageIcon },
  { labelKey: 'contact', hash: '#footer', icon: PhoneIcon },
]
