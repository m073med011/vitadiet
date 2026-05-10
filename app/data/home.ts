import banner1 from '~/assets/images/Banners/photo_6046619856448196151_y.jpg';
import banner2 from '~/assets/images/Banners/photo_6046619856448196157_y.jpg';
import banner3 from '~/assets/images/Banners/photo_6046619856448196174_y.jpg';
import banner4 from '~/assets/images/Banners/photo_6046619856448196193_y.jpg';
import banner5 from '~/assets/images/Banners/photo_6046619856448196200_y.jpg';

import prodBecalme from '~/assets/images/Products/Becalme/main.jpg';
import prodBestrong from '~/assets/images/Products/Bestrong/main.jpg';
import prodDplus from '~/assets/images/Products/Dplus/main.jpg';
import prodFemavit from '~/assets/images/Products/Femavit/main.jpg';
import prodGreen from '~/assets/images/Products/Green/main.jpg';
import prodSpasmail from '~/assets/images/Products/spasmail/main.jpg';
import prodVitagen from '~/assets/images/Products/vitagen/main.jpg';
import prodDplusSubMain from '~/assets/images/Products/Dplus/SubMain.jpg';
import prodFlowadite from '~/assets/images/Products/flowadite/main.jpg';
import prodSoluro from '~/assets/images/Products/soluro/main.jpg';
import prodBecalmeSubMain from '~/assets/images/Products/Becalme/SubMain.jpg';
import prodBestrongSubMain from '~/assets/images/Products/Bestrong/SubMain.png';
import prodFemavitSubMain from '~/assets/images/Products/Femavit/SubMain.jpg';
import prodVitagenSubMain from '~/assets/images/Products/vitagen/SubMain.jpg';

export type HomeProduct = {
  titleKey: string;
  priceKey: string;
  slug: string;
  image: string;
  gallery?: string[];
  buyLink?: string;
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
    gallery: [prodBestrongSubMain],
    buyLink: 'https://www.noon.com/saudi-ar/bestrong-30-capsules/Z0A78CE20D0670E8247E8Z/p/?o=b085f0baf8350ccc&shareId=55cbcdbc-fd96-4405-b8b4-a9e080dcd82b',
  },
  {
    titleKey: 'homePage.products.items.becalme.title',
    priceKey: 'homePage.products.items.becalme.price',
    slug: 'becalme',
    image: prodBecalme,
    gallery: [prodBecalmeSubMain],
    buyLink: 'https://www.noon.com/saudi-ar/becalme-30-capsules/Z452A1BEE5A19A8DA4747Z/p/?utm_source=C1000094L&utm_medium=referral&o=d460e066583a294c&shareId=2d3fedf9-3d8a-42d5-bb15-f75a87f3f67f',
  },
  {
    titleKey: 'homePage.products.items.vitagen.title',
    priceKey: 'homePage.products.items.vitagen.price',
    slug: 'vitagen',
    image: prodVitagen,
    gallery: [prodVitagenSubMain],
    buyLink: 'https://www.noon.com/saudi-ar/vitagen-30-capsules/Z22305437D29BF099F2E6Z/p/?utm_source=C1000094L&utm_medium=referral&o=c1d5a9304d019fac&shareId=69113b68-bce3-4c81-bd28-e3513e2d14ac',
  },
  {
    titleKey: 'homePage.products.items.femavit.title',
    priceKey: 'homePage.products.items.femavit.price',
    slug: 'femavit',
    image: prodFemavit,
    gallery: [prodFemavitSubMain],
    buyLink: 'https://www.noon.com/saudi-ar/femavit-plus-30-capsules/Z3058C2F313DDA75557DCZ/p/?o=f82fddebb7fe0f4c',
  },
  {
    titleKey: 'homePage.products.items.floradit.title',
    priceKey: 'homePage.products.items.floradit.price',
    slug: 'floradit',
    image: prodSpasmail,
    buyLink: 'https://www.noon.com/saudi-ar/floradiet-20-capsules/Z924896138C9EAB959880Z/p/?o=c2ffb29d5ff1618a',
  },
  {
    titleKey: 'homePage.products.items.greenPharmacy.title',
    priceKey: 'homePage.products.items.greenPharmacy.price',
    slug: 'green-pharmacy',
    image: prodGreen,
    buyLink: 'https://www.noon.com/saudi-ar/green-pharmacy-herbal-cleansing-gel/ZE1F26AF85CD2E72E8C09Z/p/?o=afbf327c818b3cdf&shareId=cdc8f2ed-b201-4dd6-a4b2-2e52558114e3',
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
    gallery: [prodDplusSubMain],
    buyLink: 'https://www.noon.com/saudi-ar/d-plus-60-tablets/Z3435D02D8C058A6CC517Z/p/?o=dbef8bf85bc52a1b',
  },
  {
    titleKey: 'homePage.products.items.soluro.title',
    priceKey: 'homePage.products.items.soluro.price',
    slug: 'soluro',
    image: prodSoluro,
  },
  {
    titleKey: 'homePage.products.items.flowadite.title',
    priceKey: 'homePage.products.items.flowadite.price',
    slug: 'flowadite',
    image: prodFlowadite,
  },
];
