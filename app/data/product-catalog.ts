import type { ProductSlug } from '#shared/products'
import type {
  ApprovedCopy,
  LocalizedCopy,
  ProductCatalogItem,
  ProductPurchaseOption,
} from '~/types'

const REVIEW_DATE = '2026-08-26'
const PRICE_VALID_UNTIL = '2027-08-26'
const IMAGE_SIZE = { width: 668, height: 911 } as const

const text = (en: string, ar: string): LocalizedCopy => ({ ar, en })

const approved = (en: string, ar: string): ApprovedCopy => ({
  status: 'approved',
  text: text(en, ar),
})

const productImage = (
  folder: string,
  file: string,
  altEn: string,
  altAr: string,
  role: 'front' | 'details' = 'front',
) => ({
  alt: text(altEn, altAr),
  height: IMAGE_SIZE.height,
  role,
  src: `/images/products/${folder}/${file}.webp`,
  width: IMAGE_SIZE.width,
})

const noonOption = (
  productSlug: ProductSlug,
  url: string,
  availability: ProductPurchaseOption['availability'] = 'in_stock',
): ProductPurchaseOption => ({
  availability,
  id: 'noon',
  logoText: 'noon',
  name: text('Noon', 'نون'),
  productSlug,
  updatedAt: REVIEW_DATE,
  url,
})

const officialPrice = (amount: number): ProductCatalogItem['price'] => ({
  amount,
  currency: 'SAR',
  status: 'approved',
  updatedAt: REVIEW_DATE,
  validUntil: PRICE_VALID_UNTIL,
})

const purchaseFaq = (productNameEn: string, productNameAr: string): ProductCatalogItem['faqs'] => [
  {
    question: approved(`Where can I buy ${productNameEn}?`, `أين يمكن شراء ${productNameAr}؟`),
    answer: approved(
      'Use the purchase options on this page. Available links open the verified product page in a new tab.',
      'استخدم أماكن الشراء في هذه الصفحة. الروابط المتاحة تفتح صفحة المنتج نفسها في تبويب جديد.',
    ),
  },
  {
    question: approved('Does the price change by platform?', 'هل يختلف السعر بين منصات البيع؟'),
    answer: approved(
      'Vitadiet displays one official price when it is approved; platform availability is shown separately.',
      'تعرض فيتادايت سعرا رسميا موحدا عند اعتماده، وتظهر حالة التوفر لكل منصة بشكل منفصل.',
    ),
  },
]

const catalogReference: ProductCatalogItem['references'] = [
  {
    label: text('Vitadiet product catalog', 'كتالوج منتجات فيتادايت'),
    status: 'approved',
    url: '/vitadiet-catalog.pdf',
  },
]

export const productCatalog: ProductCatalogItem[] = [
  {
    arabicName: 'بي سترونج مكمل غذائي 30 كبسولة',
    definition: approved(
      'BeStrong is a 30-capsule dietary supplement product in the Vitadiet catalog.',
      'بي سترونج منتج مكمل غذائي بعبوة 30 كبسولة ضمن كتالوج فيتادايت.',
    ),
    englishName: 'BeStrong Dietary Supplement 30 Capsules',
    images: [
      productImage(
        'bestrong',
        'bestrong-supplement-front-view',
        'BeStrong Dietary Supplement 30 Capsules - front package',
        'بي سترونج مكمل غذائي 30 كبسولة - واجهة العبوة',
      ),
      productImage(
        'bestrong',
        'bestrong-supplement-details',
        'BeStrong Dietary Supplement 30 Capsules - package details',
        'بي سترونج مكمل غذائي 30 كبسولة - تفاصيل العبوة',
        'details',
      ),
    ],
    lastReviewed: REVIEW_DATE,
    listingDescription: approved(
      'European dietary supplement from Vitadiet with official price and buying options shown when available.',
      'مكمل غذائي أوروبي من فيتادايت مع عرض السعر الرسمي وخيارات الشراء عند توفرها.',
    ),
    packSize: text('30 capsules', '30 كبسولة'),
    price: officialPrice(58),
    purchaseOptions: [
      noonOption(
        'bestrong',
        'https://www.noon.com/saudi-ar/bestrong-30-capsules/Z0A78CE20D0670E8247E8Z/p/?o=b085f0baf8350ccc&shareId=55cbcdbc-fd96-4405-b8b4-a9e080dcd82b',
      ),
    ],
    seo: {
      description: approved(
        'BeStrong dietary supplement from Vitadiet with official price, product information, and verified buying options.',
        'بي سترونج مكمل غذائي من فيتادايت مع السعر الرسمي ومعلومات المنتج وخيارات الشراء الموثقة.',
      ),
      title: approved('BeStrong Dietary Supplement 30 Capsules', 'بي سترونج مكمل غذائي 30 كبسولة'),
    },
    slug: 'bestrong',
    templateVersion: 'legacy',
    title: text('BeStrong Dietary Supplement 30 Capsules', 'بي سترونج مكمل غذائي 30 كبسولة'),
  },
  {
    arabicName: 'بي كالم مكمل غذائي 30 كبسولة',
    compliance: [
      {
        label: text('Registration and compliance', 'معلومات التسجيل والامتثال'),
        status: 'pending_approval',
        value: text(
          'Pending final publication approval from Vitadiet.',
          'قيد الاعتماد النهائي من فيتادايت قبل النشر.',
        ),
      },
    ],
    definition: approved(
      'BeCalme is a 30-capsule dietary supplement product in the Vitadiet catalog.',
      'بي كالم منتج مكمل غذائي بعبوة 30 كبسولة ضمن كتالوج فيتادايت.',
    ),
    englishName: 'BeCalme Dietary Supplement 30 Capsules',
    faqs: purchaseFaq('BeCalme', 'بي كالم'),
    images: [
      productImage(
        'becalme',
        'becalme-supplement-front-view',
        'BeCalme Dietary Supplement 30 Capsules - front package',
        'بي كالم مكمل غذائي 30 كبسولة - واجهة العبوة',
      ),
      productImage(
        'becalme',
        'becalme-supplement-details',
        'BeCalme Dietary Supplement 30 Capsules - package details',
        'بي كالم مكمل غذائي 30 كبسولة - تفاصيل العبوة',
        'details',
      ),
    ],
    lastReviewed: REVIEW_DATE,
    listingDescription: approved(
      'A Vitadiet European dietary supplement with official price and product-specific buying options.',
      'مكمل غذائي أوروبي من فيتادايت مع سعر رسمي وخيارات شراء خاصة بالمنتج.',
    ),
    packSize: text('30 capsules', '30 كبسولة'),
    positioning: approved(
      'Product information and purchase options for BeCalme from Vitadiet.',
      'معلومات المنتج وخيارات شراء بي كالم من فيتادايت.',
    ),
    price: officialPrice(78),
    purchaseOptions: [
      noonOption(
        'becalme',
        'https://www.noon.com/saudi-ar/becalme-30-capsules/Z452A1BEE5A19A8DA4747Z/p/?utm_source=C1000094L&utm_medium=referral&o=d460e066583a294c&shareId=2d3fedf9-3d8a-42d5-bb15-f75a87f3f67f',
      ),
    ],
    references: catalogReference,
    relatedSlugs: ['femavit', 'vitagen'],
    seo: {
      description: approved(
        'BeCalme dietary supplement from Vitadiet with official price, product information, and verified buying options.',
        'بي كالم مكمل غذائي من فيتادايت مع السعر الرسمي ومعلومات المنتج وخيارات الشراء الموثقة.',
      ),
      title: approved('BeCalme Dietary Supplement 30 Capsules', 'بي كالم مكمل غذائي 30 كبسولة'),
    },
    slug: 'becalme',
    templateVersion: 'phase-2',
    title: text('BeCalme Dietary Supplement 30 Capsules', 'بي كالم مكمل غذائي 30 كبسولة'),
  },
  {
    arabicName: 'فيتاجين مكمل غذائي 30 كبسولة',
    compliance: [
      {
        label: text('Registration and compliance', 'معلومات التسجيل والامتثال'),
        status: 'pending_approval',
        value: text(
          'Pending final publication approval from Vitadiet.',
          'قيد الاعتماد النهائي من فيتادايت قبل النشر.',
        ),
      },
    ],
    definition: approved(
      'Vitagen is a 30-capsule dietary supplement product in the Vitadiet catalog.',
      'فيتاجين منتج مكمل غذائي بعبوة 30 كبسولة ضمن كتالوج فيتادايت.',
    ),
    englishName: 'Vitagen Dietary Supplement 30 Capsules',
    faqs: purchaseFaq('Vitagen', 'فيتاجين'),
    images: [
      productImage(
        'vitagen',
        'vitagen-supplement-front-view',
        'Vitagen Dietary Supplement 30 Capsules - front package',
        'فيتاجين مكمل غذائي 30 كبسولة - واجهة العبوة',
      ),
      productImage(
        'vitagen',
        'vitagen-supplement-details',
        'Vitagen Dietary Supplement 30 Capsules - package details',
        'فيتاجين مكمل غذائي 30 كبسولة - تفاصيل العبوة',
        'details',
      ),
    ],
    lastReviewed: REVIEW_DATE,
    listingDescription: approved(
      'A Vitadiet European dietary supplement with official price and product-specific buying options.',
      'مكمل غذائي أوروبي من فيتادايت مع سعر رسمي وخيارات شراء خاصة بالمنتج.',
    ),
    packSize: text('30 capsules', '30 كبسولة'),
    positioning: approved(
      'Product information and purchase options for Vitagen from Vitadiet.',
      'معلومات المنتج وخيارات شراء فيتاجين من فيتادايت.',
    ),
    price: officialPrice(98),
    purchaseOptions: [
      noonOption(
        'vitagen',
        'https://www.noon.com/saudi-ar/vitagen-30-capsules/Z22305437D29BF099F2E6Z/p/?utm_source=C1000094L&utm_medium=referral&o=c1d5a9304d019fac&shareId=69113b68-bce3-4c81-bd28-e3513e2d14ac',
      ),
    ],
    references: catalogReference,
    relatedSlugs: ['becalme', 'femavit'],
    seo: {
      description: approved(
        'Vitagen dietary supplement from Vitadiet with official price, product information, and verified buying options.',
        'فيتاجين مكمل غذائي من فيتادايت مع السعر الرسمي ومعلومات المنتج وخيارات الشراء الموثقة.',
      ),
      title: approved('Vitagen Dietary Supplement 30 Capsules', 'فيتاجين مكمل غذائي 30 كبسولة'),
    },
    slug: 'vitagen',
    templateVersion: 'phase-2',
    title: text('Vitagen Dietary Supplement 30 Capsules', 'فيتاجين مكمل غذائي 30 كبسولة'),
  },
  {
    arabicName: 'فيمافيت بلس 30 كبسولة',
    compliance: [
      {
        label: text('Registration and compliance', 'معلومات التسجيل والامتثال'),
        status: 'pending_approval',
        value: text(
          'Pending final publication approval from Vitadiet.',
          'قيد الاعتماد النهائي من فيتادايت قبل النشر.',
        ),
      },
    ],
    definition: approved(
      'Femavit Plus is a 30-capsule dietary supplement product in the Vitadiet catalog.',
      'فيمافيت بلس منتج مكمل غذائي بعبوة 30 كبسولة ضمن كتالوج فيتادايت.',
    ),
    englishName: 'Femavit Plus 30 Capsules',
    faqs: purchaseFaq('Femavit Plus', 'فيمافيت بلس'),
    images: [
      productImage(
        'femavit',
        'femavit-supplement-front-view',
        'Femavit Plus 30 Capsules - front package',
        'فيمافيت بلس 30 كبسولة - واجهة العبوة',
      ),
      productImage(
        'femavit',
        'femavit-supplement-details',
        'Femavit Plus 30 Capsules - package details',
        'فيمافيت بلس 30 كبسولة - تفاصيل العبوة',
        'details',
      ),
    ],
    lastReviewed: REVIEW_DATE,
    listingDescription: approved(
      'A Vitadiet European supplement with official price and product-specific buying options.',
      'مكمل أوروبي من فيتادايت مع سعر رسمي وخيارات شراء خاصة بالمنتج.',
    ),
    packSize: text('30 capsules', '30 كبسولة'),
    positioning: approved(
      'Product information and purchase options for Femavit Plus from Vitadiet.',
      'معلومات المنتج وخيارات شراء فيمافيت بلس من فيتادايت.',
    ),
    price: officialPrice(110),
    purchaseOptions: [
      noonOption(
        'femavit',
        'https://www.noon.com/saudi-ar/femavit-plus-30-capsules/Z3058C2F313DDA75557DCZ/p/?o=f82fddebb7fe0f4c',
      ),
    ],
    references: catalogReference,
    relatedSlugs: ['becalme', 'vitagen'],
    seo: {
      description: approved(
        'Femavit Plus from Vitadiet with official price, product information, and verified buying options.',
        'فيمافيت بلس من فيتادايت مع السعر الرسمي ومعلومات المنتج وخيارات الشراء الموثقة.',
      ),
      title: approved('Femavit Plus 30 Capsules', 'فيمافيت بلس 30 كبسولة'),
    },
    slug: 'femavit',
    templateVersion: 'phase-2',
    title: text('Femavit Plus 30 Capsules', 'فيمافيت بلس 30 كبسولة'),
  },
  {
    arabicName: 'فلورادايت مكمل غذائي 20 كبسولة',
    definition: approved(
      'Floradiet is a 20-capsule dietary supplement product in the Vitadiet catalog.',
      'فلورادايت منتج مكمل غذائي بعبوة 20 كبسولة ضمن كتالوج فيتادايت.',
    ),
    englishName: 'Floradiet Dietary Supplement 20 Capsules',
    images: [
      productImage(
        'floradit',
        'floradit-supplement-front-view',
        'Floradiet Dietary Supplement 20 Capsules - front package',
        'فلورادايت مكمل غذائي 20 كبسولة - واجهة العبوة',
      ),
    ],
    lastReviewed: REVIEW_DATE,
    listingDescription: approved(
      'European dietary supplement from Vitadiet with official price and buying options shown when available.',
      'مكمل غذائي أوروبي من فيتادايت مع عرض السعر الرسمي وخيارات الشراء عند توفرها.',
    ),
    packSize: text('20 capsules', '20 كبسولة'),
    price: officialPrice(78),
    purchaseOptions: [
      noonOption(
        'floradit',
        'https://www.noon.com/saudi-ar/floradiet-20-capsules/Z924896138C9EAB959880Z/p/?o=c2ffb29d5ff1618a',
      ),
    ],
    seo: {
      description: approved(
        'Floradiet dietary supplement from Vitadiet with official price, product information, and verified buying options.',
        'فلورادايت مكمل غذائي من فيتادايت مع السعر الرسمي ومعلومات المنتج وخيارات الشراء الموثقة.',
      ),
      title: approved('Floradiet Dietary Supplement 20 Capsules', 'فلورادايت مكمل غذائي 20 كبسولة'),
    },
    slug: 'floradit',
    templateVersion: 'legacy',
    title: text('Floradiet Dietary Supplement 20 Capsules', 'فلورادايت مكمل غذائي 20 كبسولة'),
  },
  {
    arabicName: 'جرين فارماسي جل تنظيف عشبي',
    definition: approved(
      'Green Pharmacy Herbal Cleansing Gel is a Vitadiet catalog product.',
      'جرين فارماسي جل تنظيف عشبي منتج ضمن كتالوج فيتادايت.',
    ),
    englishName: 'Green Pharmacy Herbal Cleansing Gel',
    images: [
      productImage(
        'green-pharmacy',
        'green-pharmacy-supplement-front-view',
        'Green Pharmacy Herbal Cleansing Gel - front package',
        'جرين فارماسي جل تنظيف عشبي - واجهة العبوة',
      ),
    ],
    lastReviewed: REVIEW_DATE,
    listingDescription: approved(
      'Vitadiet catalog product with official price and buying options shown when available.',
      'منتج ضمن كتالوج فيتادايت مع عرض السعر الرسمي وخيارات الشراء عند توفرها.',
    ),
    packSize: text('Skin care pack', 'عبوة عناية بالبشرة'),
    price: officialPrice(50),
    purchaseOptions: [
      noonOption(
        'green-pharmacy',
        'https://www.noon.com/saudi-ar/green-pharmacy-herbal-cleansing-gel/ZE1F26AF85CD2E72E8C09Z/p/?o=afbf327c818b3cdf&shareId=cdc8f2ed-b201-4dd6-a4b2-2e52558114e3',
      ),
    ],
    seo: {
      description: approved(
        'Green Pharmacy Herbal Cleansing Gel from Vitadiet with official price, product information, and verified buying options.',
        'جرين فارماسي جل تنظيف عشبي من فيتادايت مع السعر الرسمي ومعلومات المنتج وخيارات الشراء الموثقة.',
      ),
      title: approved('Green Pharmacy Herbal Cleansing Gel', 'جرين فارماسي جل تنظيف عشبي'),
    },
    slug: 'green-pharmacy',
    templateVersion: 'legacy',
    title: text('Green Pharmacy Herbal Cleansing Gel', 'جرين فارماسي جل تنظيف عشبي'),
  },
  {
    arabicName: 'دي بلس زنك، د3، ب6، سي 60 قرص',
    definition: approved(
      'D-Plus is a 60-tablet dietary supplement product in the Vitadiet catalog.',
      'دي بلس منتج مكمل غذائي بعبوة 60 قرصا ضمن كتالوج فيتادايت.',
    ),
    englishName: 'D-Plus Zinc, D3, B6, C 60 Tablets',
    images: [
      productImage(
        'dplus',
        'dplus-supplement-front-view',
        'D-Plus Zinc, D3, B6, C 60 Tablets - front package',
        'دي بلس زنك، د3، ب6، سي 60 قرص - واجهة العبوة',
      ),
      productImage(
        'dplus',
        'dplus-supplement-details',
        'D-Plus Zinc, D3, B6, C 60 Tablets - package details',
        'دي بلس زنك، د3، ب6، سي 60 قرص - تفاصيل العبوة',
        'details',
      ),
    ],
    lastReviewed: REVIEW_DATE,
    listingDescription: approved(
      'European dietary supplement from Vitadiet with official price and buying options shown when available.',
      'مكمل غذائي أوروبي من فيتادايت مع عرض السعر الرسمي وخيارات الشراء عند توفرها.',
    ),
    packSize: text('60 tablets', '60 قرص'),
    price: officialPrice(48),
    purchaseOptions: [
      noonOption(
        'dplus',
        'https://www.noon.com/saudi-ar/d-plus-60-tablets/Z3435D02D8C058A6CC517Z/p/?o=dbef8bf85bc52a1b',
      ),
    ],
    seo: {
      description: approved(
        'D-Plus from Vitadiet with official price, product information, and verified buying options.',
        'دي بلس من فيتادايت مع السعر الرسمي ومعلومات المنتج وخيارات الشراء الموثقة.',
      ),
      title: approved('D-Plus Zinc, D3, B6, C 60 Tablets', 'دي بلس زنك، د3، ب6، سي 60 قرص'),
    },
    slug: 'dplus',
    templateVersion: 'legacy',
    title: text('D-Plus Zinc, D3, B6, C 60 Tablets', 'دي بلس زنك، د3، ب6، سي 60 قرص'),
  },
  {
    arabicName: 'سولورو مكمل غذائي',
    definition: approved(
      'Soluro is a dietary supplement product in the Vitadiet catalog.',
      'سولورو منتج مكمل غذائي ضمن كتالوج فيتادايت.',
    ),
    englishName: 'Soluro Dietary Supplement',
    images: [
      productImage(
        'soluro',
        'soluro-supplement-front-view',
        'Soluro Dietary Supplement - front package',
        'سولورو مكمل غذائي - واجهة العبوة',
      ),
    ],
    lastReviewed: REVIEW_DATE,
    listingDescription: approved(
      'Vitadiet product information will show price and buying options when approved.',
      'ستظهر معلومات السعر وخيارات الشراء لهذا المنتج من فيتادايت عند اعتمادها.',
    ),
    packSize: text('Coming soon', 'قريبا'),
    purchaseOptions: [],
    seo: {
      description: approved(
        'Soluro dietary supplement from Vitadiet. Price and buying options will be shown when approved.',
        'سولورو مكمل غذائي من فيتادايت. ستظهر معلومات السعر وخيارات الشراء عند اعتمادها.',
      ),
      title: approved('Soluro Dietary Supplement', 'سولورو مكمل غذائي'),
    },
    slug: 'soluro',
    templateVersion: 'legacy',
    title: text('Soluro Dietary Supplement', 'سولورو مكمل غذائي'),
  },
  {
    arabicName: 'فلوادايت مكمل غذائي',
    definition: approved(
      'Flowadite is a dietary supplement product in the Vitadiet catalog.',
      'فلوادايت منتج مكمل غذائي ضمن كتالوج فيتادايت.',
    ),
    englishName: 'Flowadite Dietary Supplement',
    images: [
      productImage(
        'flowadite',
        'flowadite-supplement-front-view',
        'Flowadite Dietary Supplement - front package',
        'فلوادايت مكمل غذائي - واجهة العبوة',
      ),
    ],
    lastReviewed: REVIEW_DATE,
    listingDescription: approved(
      'Vitadiet product information will show price and buying options when approved.',
      'ستظهر معلومات السعر وخيارات الشراء لهذا المنتج من فيتادايت عند اعتمادها.',
    ),
    packSize: text('Coming soon', 'قريبا'),
    purchaseOptions: [],
    seo: {
      description: approved(
        'Flowadite dietary supplement from Vitadiet. Price and buying options will be shown when approved.',
        'فلوادايت مكمل غذائي من فيتادايت. ستظهر معلومات السعر وخيارات الشراء عند اعتمادها.',
      ),
      title: approved('Flowadite Dietary Supplement', 'فلوادايت مكمل غذائي'),
    },
    slug: 'flowadite',
    templateVersion: 'legacy',
    title: text('Flowadite Dietary Supplement', 'فلوادايت مكمل غذائي'),
  },
]
