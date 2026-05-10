import banner1 from '~/assets/images/Banners/photo_6046619856448196151_y.jpg';
import banner2 from '~/assets/images/Banners/photo_6046619856448196157_y.jpg';
import banner3 from '~/assets/images/Banners/photo_6046619856448196174_y.jpg';
import banner4 from '~/assets/images/Banners/photo_6046619856448196193_y.jpg';
import banner5 from '~/assets/images/Banners/photo_6046619856448196200_y.jpg';

import prodBecalme from '~/assets/images/Products/Becalme/photo_6046619856448196202_y.jpg';
import prodBestrong from '~/assets/images/Products/Bestrong/main.jpg';
import prodDplus from '~/assets/images/Products/Dplus/main.jpg';
import prodFemavit from '~/assets/images/Products/Femavit/main.jpg';
import prodGreen from '~/assets/images/Products/Green/main.jpg';
import prodSpasmail from '~/assets/images/Products/spasmail/main.jpg';
import prodVitagen from '~/assets/images/Products/vitagen/main.jpg';

export type HomeProduct = {
  titleKey: string;
  priceKey: string;
  slug: string;
  image: string;
  descriptionKey?: string;
  highlights?: string[];
};

export const heroImages = [
  { src: banner1, class: 'top-[12%] left-[4%] w-[10%] aspect-[3/4] hidden 2xl:block' },
  { src: banner2, class: 'top-[48%] left-[7%] w-[9%] aspect-square hidden xl:block' },
  { src: banner3, class: 'top-[8%] left-[18%] w-[11%] aspect-[4/5] hidden lg:block' },
  { src: banner4, class: 'top-[42%] left-[24%] w-[10%] aspect-square hidden md:block' },
  { src: banner5, class: 'top-[5%] left-[40%] w-[11%] aspect-[4/5] hidden sm:block' },
  { src: banner1, class: 'top-[19%] left-[55%] w-[12%] aspect-[3/4] max-sm:left-[10%] max-sm:top-[5%] max-sm:w-[35%]' },
  { src: banner2, class: 'top-[4%] left-[69%] w-[10%] aspect-[4/5] max-sm:left-[55%] max-sm:top-[20%] max-sm:w-[35%]' },
  { src: banner3, class: 'top-[31%] left-[80%] w-[10%] aspect-[4/5] hidden md:block' },
  { src: banner4, class: 'top-[51%] left-[88%] w-[8%] aspect-[4/5] hidden xl:block -rotate-6 shadow-2xl scale-110 z-10 border-[6px] border-white dark:border-gray-900 rounded-xl' },
];


export const whyPetals = [
  {
    titleKey: 'homePage.why.petals.science.title',
    descriptionKey: 'homePage.why.petals.science.description',
    icon: 'MicroscopeIcon',
  },
  {
    titleKey: 'homePage.why.petals.quality.title',
    descriptionKey: 'homePage.why.petals.quality.description',
    icon: 'SparklesIcon',
  },
  {
    titleKey: 'homePage.why.petals.sfda.title',
    descriptionKey: 'homePage.why.petals.sfda.description',
    icon: 'ShieldCheckIcon',
  },
  {
    titleKey: 'homePage.why.petals.transparency.title',
    descriptionKey: 'homePage.why.petals.transparency.description',
    icon: 'FileCheckIcon',
  },
  {
    titleKey: 'homePage.why.petals.distribution.title',
    descriptionKey: 'homePage.why.petals.distribution.description',
    icon: 'TruckIcon',
  },
  {
    titleKey: 'homePage.why.petals.safety.title',
    descriptionKey: 'homePage.why.petals.safety.description',
    icon: 'HeartPulseIcon',
  },
];

export const products: HomeProduct[] = [
  {
    titleKey: 'homePage.products.items.bestrong.title',
    priceKey: 'homePage.products.items.bestrong.price',
    slug: 'bestrong',
    image: prodBestrong,
  },
  {
    titleKey: 'homePage.products.items.becalme.title',
    priceKey: 'homePage.products.items.becalme.price',
    slug: 'becalme',
    image: prodBecalme,
  },
  {
    titleKey: 'homePage.products.items.vitagen.title',
    priceKey: 'homePage.products.items.vitagen.price',
    slug: 'vitagen',
    image: prodVitagen,
  },
  {
    titleKey: 'homePage.products.items.femavit.title',
    priceKey: 'homePage.products.items.femavit.price',
    slug: 'femavit',
    image: prodFemavit,
  },
  {
    titleKey: 'homePage.products.items.floradit.title',
    priceKey: 'homePage.products.items.floradit.price',
    slug: 'floradit',
    image: prodSpasmail,
  },
  {
    titleKey: 'homePage.products.items.greenPharmacy.title',
    priceKey: 'homePage.products.items.greenPharmacy.price',
    slug: 'green-pharmacy',
    image: prodGreen,
  },
  {
    titleKey: 'homePage.products.items.dplus.title',
    priceKey: 'homePage.products.items.dplus.price',
    descriptionKey: 'productDetails.dplus.description',
    highlights: [
      'productDetails.dplus.highlights.zinc',
      'productDetails.dplus.highlights.vitaminD',
      'productDetails.dplus.highlights.bComplex',
    ],
    slug: 'dplus',
    image: prodDplus,
  },
];
