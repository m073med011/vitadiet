export interface HeroBanner {
  /** Desktop tier (sm_). */
  src: string
  /** Mobile tier (xs_) used by the marquee. */
  srcMobile: string
  /** Whether this banner appears in the mobile marquee. */
  showOnMobile: boolean
  /** Absolute-position utilities for the desktop scatter layout. */
  class: string
}

export const heroBanners: HeroBanner[] = [
  {
    src: '/images/banners/sm_vitadiet-b2b-certified-medical-supplements.webp',
    srcMobile: '/images/banners/xs_vitadiet-b2b-certified-medical-supplements.webp',
    showOnMobile: true,
    class: 'top-[12%] left-[4%] w-[10%] aspect-[3/4] hidden 2xl:block',
  },
  {
    src: '/images/banners/sm_vitadiet-immune-system-defense-capsules.webp',
    srcMobile: '/images/banners/xs_vitadiet-immune-system-defense-capsules.webp',
    showOnMobile: false,
    class: 'top-[48%] left-[7%] w-[9%] aspect-square hidden xl:block',
  },
  {
    src: '/images/banners/sm_vitadiet-beauty-and-collagen-nutrition.webp',
    srcMobile: '/images/banners/xs_vitadiet-beauty-and-collagen-nutrition.webp',
    showOnMobile: true,
    class: 'top-[8%] left-[18%] w-[11%] aspect-[4/5] hidden lg:block',
  },
  {
    src: '/images/banners/sm_vitadiet-womens-daily-wellness-support.webp',
    srcMobile: '/images/banners/xs_vitadiet-womens-daily-wellness-support.webp',
    showOnMobile: false,
    class: 'top-[42%] left-[24%] w-[10%] aspect-square hidden md:block',
  },
  {
    src: '/images/banners/sm_vitadiet-premium-health-supplements-collection.webp',
    srcMobile: '/images/banners/xs_vitadiet-premium-health-supplements-collection.webp',
    showOnMobile: false,
    class: 'top-[5%] left-[40%] w-[11%] aspect-[4/5] hidden sm:block',
  },
  {
    src: '/images/banners/sm_vitadiet-stress-relief-and-calm-supplements.webp',
    srcMobile: '/images/banners/xs_vitadiet-stress-relief-and-calm-supplements.webp',
    showOnMobile: true,
    class:
      'top-[19%] left-[55%] w-[12%] aspect-[3/4] max-sm:left-[10%] max-sm:top-[5%] max-sm:w-[35%]',
  },
  {
    src: '/images/banners/sm_vitadiet-herbal-digestive-health-formula.webp',
    srcMobile: '/images/banners/xs_vitadiet-herbal-digestive-health-formula.webp',
    showOnMobile: false,
    class:
      'top-[4%] left-[69%] w-[10%] aspect-[4/5] max-sm:left-[55%] max-sm:top-[20%] max-sm:w-[35%]',
  },
  {
    src: '/images/banners/sm_vitadiet-saudi-fda-approved-vitamins.webp',
    srcMobile: '/images/banners/xs_vitadiet-saudi-fda-approved-vitamins.webp',
    showOnMobile: true,
    class: 'top-[31%] left-[80%] w-[10%] aspect-[4/5] hidden md:block',
  },
  {
    src: '/images/banners/sm_vitadiet-natural-energy-boost-vitamins.webp',
    srcMobile: '/images/banners/xs_vitadiet-natural-energy-boost-vitamins.webp',
    showOnMobile: false,
    class:
      'top-[51%] left-[88%] w-[8%] aspect-[4/5] hidden xl:block -rotate-6 shadow-2xl scale-110 z-10 border-[6px] border-white rounded-xl',
  },
]
