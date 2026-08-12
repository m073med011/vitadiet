const banner1 = '/images/Banners/sm_vitadiet-b2b-certified-medical-supplements.webp';
const banner9  = '/images/Banners/sm_vitadiet-natural-energy-boost-vitamins.webp';
const banner8 = '/images/Banners/sm_vitadiet-saudi-fda-approved-vitamins.webp';
const banner3 = '/images/Banners/sm_vitadiet-beauty-and-collagen-nutrition.webp';
const banner7 = '/images/Banners/sm_vitadiet-herbal-digestive-health-formula.webp';
const banner2 = '/images/Banners/sm_vitadiet-immune-system-defense-capsules.webp';
const banner5 = '/images/Banners/sm_vitadiet-premium-health-supplements-collection.webp';
const banner6 = '/images/Banners/sm_vitadiet-stress-relief-and-calm-supplements.webp';
const banner4 = '/images/Banners/sm_vitadiet-womens-daily-wellness-support.webp';

const prodBecalme = '/images/Products/Becalme/becalme-supplement-front-view.webp';
const prodBestrong = '/images/Products/Bestrong/bestrong-supplement-front-view.webp';
const prodDplus = '/images/Products/Dplus/dplus-supplement-front-view.webp';
const prodFemavit = '/images/Products/Femavit/femavit-supplement-front-view.webp';
const prodGreen = '/images/Products/Green/green-pharmacy-supplement-front-view.webp';
const prodSpasmail = '/images/Products/spasmail/floradit-spasmail-supplement-front-view.webp';
const prodVitagen = '/images/Products/vitagen/vitagen-supplement-front-view.webp';
const prodDplusSubMain = '/images/Products/Dplus/dplus-supplement-details.webp';
const prodFlowadite = '/images/Products/flowadite/flowadite-supplement-front-view.webp';
const prodSoluro = '/images/Products/soluro/soluro-supplement-front-view.webp';
const prodBecalmeSubMain = '/images/Products/Becalme/becalme-supplement-details.webp';
const prodBestrongSubMain = '/images/Products/Bestrong/bestrong-supplement-details.webp';
const prodFemavitSubMain = '/images/Products/Femavit/femavit-supplement-details.webp';
const prodVitagenSubMain = '/images/Products/vitagen/vitagen-supplement-details.webp';

import type { HomeProduct } from '~/types'
import type { Component } from 'vue'
import {
  FileCheckIcon,
  HeartPulseIcon,
  MicroscopeIcon,
  ShieldCheckIcon,
  SparklesIcon,
  TruckIcon,
} from 'lucide-vue-next'


export type { HomeProduct }

export const heroSection = {
  images: [
    { src: banner1, class: 'top-[12%] left-[4%] w-[10%] aspect-[3/4] hidden 2xl:block' },
    { src: banner2, class: 'top-[48%] left-[7%] w-[9%] aspect-square hidden xl:block' },
    { src: banner3, class: 'top-[8%] left-[18%] w-[11%] aspect-[4/5] hidden lg:block' },
    { src: banner4, class: 'top-[42%] left-[24%] w-[10%] aspect-square hidden md:block' },
    { src: banner5, class: 'top-[5%] left-[40%] w-[11%] aspect-[4/5] hidden sm:block' },
    { src: banner6, class: 'top-[19%] left-[55%] w-[12%] aspect-[3/4] max-sm:left-[10%] max-sm:top-[5%] max-sm:w-[35%]' },
    { src: banner7, class: 'top-[4%] left-[69%] w-[10%] aspect-[4/5] max-sm:left-[55%] max-sm:top-[20%] max-sm:w-[35%]' },
    { src: banner8, class: 'top-[31%] left-[80%] w-[10%] aspect-[4/5] hidden md:block' },
    { src: banner9, class: 'top-[51%] left-[88%] w-[8%] aspect-[4/5] hidden xl:block -rotate-6 shadow-2xl scale-110 z-10 border-[6px] border-white rounded-xl' },
  ],
};


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

export const petalIconMap: Record<string, Component> = {
  FileCheckIcon,
  HeartPulseIcon,
  MicroscopeIcon,
  ShieldCheckIcon,
  SparklesIcon,
  TruckIcon,
}

export const qualitySteps = [
  {
    titleKey: 'homePage.quality.items.safety.title',
    descriptionKey: 'homePage.quality.items.safety.description',
    icon: ShieldCheckIcon,
  },
  {
    titleKey: 'homePage.quality.items.purity.title',
    descriptionKey: 'homePage.quality.items.purity.description',
    icon: SparklesIcon,
  },
  {
    titleKey: 'homePage.quality.items.microscopic.title',
    descriptionKey: 'homePage.quality.items.microscopic.description',
    icon: MicroscopeIcon,
  },
]

export const faqItems = [
  { key: 'consumer', questionKey: 'homePage.faq.items.consumer.question', answerKey: 'homePage.faq.items.consumer.answer' },
  { key: 'sfda', questionKey: 'homePage.faq.items.sfda.question', answerKey: 'homePage.faq.items.sfda.answer' },
  { key: 'files', questionKey: 'homePage.faq.items.files.question', answerKey: 'homePage.faq.items.files.answer' },
]

export const aboutFeatures = [
  { key: 'science', angle: -90 },
  { key: 'sfda', angle: -30 },
  { key: 'distribution', angle: 30 },
  { key: 'quality', angle: 90 },
  { key: 'safety', angle: 150 },
  { key: 'transparency', angle: -150 },
]

export const products: HomeProduct[] = [
  {
    titleKey: 'homePage.products.items.bestrong.title',
    priceKey: 'homePage.products.items.bestrong.price',
    descriptionKey: 'productDetails.bestrong.description',
    slug: 'bestrong',
    image: prodBestrong,
    gallery: [prodBestrongSubMain],
    buyLink: 'https://www.noon.com/saudi-ar/bestrong-30-capsules/Z0A78CE20D0670E8247E8Z/p/?o=b085f0baf8350ccc&shareId=55cbcdbc-fd96-4405-b8b4-a9e080dcd82b',
  },
  {
    titleKey: 'homePage.products.items.becalme.title',
    priceKey: 'homePage.products.items.becalme.price',
    descriptionKey: 'productDetails.becalme.description',
    slug: 'becalme',
    image: prodBecalme,
    gallery: [prodBecalmeSubMain],
    buyLink: 'https://www.noon.com/saudi-ar/becalme-30-capsules/Z452A1BEE5A19A8DA4747Z/p/?utm_source=C1000094L&utm_medium=referral&o=d460e066583a294c&shareId=2d3fedf9-3d8a-42d5-bb15-f75a87f3f67f',
  },
  {
    titleKey: 'homePage.products.items.vitagen.title',
    priceKey: 'homePage.products.items.vitagen.price',
    descriptionKey: 'productDetails.vitagen.description',
    slug: 'vitagen',
    image: prodVitagen,
    gallery: [prodVitagenSubMain],
    buyLink: 'https://www.noon.com/saudi-ar/vitagen-30-capsules/Z22305437D29BF099F2E6Z/p/?utm_source=C1000094L&utm_medium=referral&o=c1d5a9304d019fac&shareId=69113b68-bce3-4c81-bd28-e3513e2d14ac',
  },
  {
    titleKey: 'homePage.products.items.femavit.title',
    priceKey: 'homePage.products.items.femavit.price',
    descriptionKey: 'productDetails.femavit.description',
    slug: 'femavit',
    image: prodFemavit,
    gallery: [prodFemavitSubMain],
    buyLink: 'https://www.noon.com/saudi-ar/femavit-plus-30-capsules/Z3058C2F313DDA75557DCZ/p/?o=f82fddebb7fe0f4c',
  },
  {
    titleKey: 'homePage.products.items.floradit.title',
    priceKey: 'homePage.products.items.floradit.price',
    descriptionKey: 'productDetails.floradit.description',
    slug: 'floradit',
    image: prodSpasmail,
    buyLink: 'https://www.noon.com/saudi-ar/floradiet-20-capsules/Z924896138C9EAB959880Z/p/?o=c2ffb29d5ff1618a',
  },
  {
    titleKey: 'homePage.products.items.greenPharmacy.title',
    priceKey: 'homePage.products.items.greenPharmacy.price',
    descriptionKey: 'productDetails.greenPharmacy.description',
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
    descriptionKey: 'productDetails.soluro.description',
    slug: 'soluro',
    image: prodSoluro,
  },
  {
    titleKey: 'homePage.products.items.flowadite.title',
    priceKey: 'homePage.products.items.flowadite.price',
    descriptionKey: 'productDetails.flowadite.description',
    slug: 'flowadite',
    image: prodFlowadite,
    
    
  },
];
