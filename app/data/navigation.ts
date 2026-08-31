import {
  AwardIcon,
  CookieIcon,
  FileTextIcon,
  HandshakeIcon,
  HeartPulseIcon,
  HelpCircleIcon,
  HomeIcon,
  InfoIcon,
  MailIcon,
  MapPinIcon,
  PackageIcon,
  ShieldCheckIcon,
} from 'lucide-vue-next'
import type { FooterLinkGroup, NavItem } from '~/types'

/**
 * Every link the header and footer render is declared here. Nothing constructs a route
 * inline in a template, so a URL change is a one-line edit in this file plus an approved
 * 301 in `public/.htaccess`.
 */

export const navItems: NavItem[] = [
  { labelKey: 'products', hash: '', path: '/products/', icon: PackageIcon },
  { labelKey: 'services', hash: '', path: '/quality/', icon: AwardIcon },
  { labelKey: 'about', hash: '#who-we-are', icon: InfoIcon },
  { labelKey: 'findProducts', hash: '#where-to-buy', icon: MapPinIcon },
]

/**
 * Footer columns. The consumer route comes first and the trade route sits at the end of
 * the same column, which is the separation the phase-2 brief asks for: B2B is present
 * and findable, but never mixed into the consumer journey above it.
 */
export const footerLinkGroups: FooterLinkGroup[] = [
  {
    labelKey: 'footer.groups.explore',
    items: [
      { labelKey: 'home', hash: '', path: '/', icon: HomeIcon },
      { labelKey: 'products', hash: '', path: '/products/', icon: PackageIcon },
      { labelKey: 'services', hash: '', path: '/quality/', icon: AwardIcon },
      { labelKey: 'findProducts', hash: '#where-to-buy', icon: MapPinIcon },
      { labelKey: 'about', hash: '#who-we-are', icon: InfoIcon },
      { labelKey: 'faq', hash: '#faq', icon: HelpCircleIcon },
      // Same-page anchor: the contact details sit in this footer on every route.
      { labelKey: 'contactUs', hash: '#contact', anchor: true, icon: MailIcon },
      { labelKey: 'partners', hash: '', path: '/partners/', icon: HandshakeIcon },
    ],
  },
  {
    labelKey: 'footer.groups.legal',
    items: [
      {
        labelKey: 'legal.privacyPolicy',
        hash: '',
        path: '/legal/privacy-policy/',
        icon: ShieldCheckIcon,
      },
      {
        labelKey: 'legal.termsOfUse',
        hash: '',
        path: '/legal/terms-of-use/',
        icon: FileTextIcon,
      },
      {
        labelKey: 'legal.cookiesPolicy',
        hash: '',
        path: '/legal/cookies-policy/',
        icon: CookieIcon,
      },
      {
        labelKey: 'legal.medicalDisclaimer',
        hash: '',
        path: '/legal/medical-disclaimer/',
        icon: HeartPulseIcon,
      },
    ],
  },
]
