import { LEGAL_SLUGS } from '#shared/legal'
import type { ProductSlug } from '#shared/products'
import type {
  ApprovedCopy,
  LegalDocument,
  LegalDocumentSlug,
  LocalizedCopy,
  PartnerFormOption,
  PartnerFormOptions,
  QualityPillar,
} from '~/types'

/**
 * Central source for the non-product site content added in phase 3: quality and
 * accreditation, the legal documents linked from the footer, and the option lists the
 * partnership form renders.
 *
 * Nothing in this file may be duplicated inside a component. Components read it through
 * `app/services/site-content.ts`, so replacing the source with a Dashboard API later is
 * a change to two function bodies and nothing else. See docs/CONTENT-DATA-MODEL.md.
 */

/** Date the copy in this file was last reviewed by the Vitadiet content owner. */
export const CONTENT_REVIEW_DATE = '2026-08-31'

const text = (en: string, ar: string): LocalizedCopy => ({ ar, en })

const approved = (en: string, ar: string): ApprovedCopy => ({
  status: 'approved',
  text: text(en, ar),
})

/* -------------------------------------------------------------------------- *
 * Quality and accreditation
 *
 * Process descriptions only. No certificate number, registration number, audit
 * result, or health claim may be added here without a document from Vitadiet;
 * those belong in the product catalog's `compliance` facts, with their own
 * approval status.
 * -------------------------------------------------------------------------- */

export const qualityPillars: QualityPillar[] = [
  {
    id: 'selection',
    iconKey: 'clipboard-check',
    title: approved('How we select products', 'منهج اختيار المنتجات'),
    description: approved(
      'Every product is assessed before it enters the catalog: the formula, the ingredient list, the intended everyday use, and how well it fits the Saudi market.',
      'يخضع كل منتج للتقييم قبل إدراجه في الكتالوج، من حيث التركيبة وقائمة المكونات وسياق الاستخدام اليومي ومدى ملاءمته للسوق السعودي.',
    ),
    points: [
      approved(
        'We review the published evidence behind the ingredients before agreeing to represent a product.',
        'نراجع الأدلة المنشورة الخاصة بالمكونات قبل الموافقة على تمثيل المنتج.',
      ),
      approved(
        'We prefer suppliers who can hand over complete product documentation.',
        'نفضل الموردين القادرين على تسليم وثائق المنتج كاملة.',
      ),
      approved(
        'A product that cannot be documented is not published on this website.',
        'المنتج الذي لا يمكن توثيقه لا يُنشر على هذا الموقع.',
      ),
    ],
  },
  {
    id: 'manufacturing',
    iconKey: 'factory',
    title: approved('Manufacturing quality', 'جودة التصنيع'),
    description: approved(
      'Our products are manufactured by selected European facilities that work to documented quality systems, and the manufacturer is named on the product page once Vitadiet confirms it.',
      'تُصنَّع منتجاتنا لدى منشآت أوروبية مختارة تعمل وفق أنظمة جودة موثقة، ويُذكر اسم المصنع في صفحة المنتج بعد تأكيده من فيتادايت.',
    ),
    points: [
      approved(
        'Country of manufacture and manufacturer name are published per product, not as a general statement.',
        'يُنشر بلد التصنيع واسم المصنع لكل منتج على حدة، وليس كعبارة عامة.',
      ),
      approved(
        'Batch and packaging details stay with the physical package, which remains the reference.',
        'تبقى تفاصيل التشغيلة والعبوة على العبوة نفسها، وهي المرجع.',
      ),
    ],
  },
  {
    id: 'compliance',
    iconKey: 'shield-check',
    title: approved('Registration and compliance', 'التسجيل والامتثال'),
    description: approved(
      'Products follow the official registration route required in Saudi Arabia before they are placed on the market. Registration details appear on a product page only after Vitadiet confirms them.',
      'تمر المنتجات بمسار التسجيل الرسمي المطلوب في المملكة قبل طرحها في السوق. ولا تظهر بيانات التسجيل في صفحة المنتج إلا بعد تأكيدها من فيتادايت.',
    ),
    points: [
      approved(
        'We do not publish a registration number that has not been supplied to us in writing.',
        'لا ننشر أي رقم تسجيل لم يُسلَّم إلينا كتابيا.',
      ),
      approved(
        'Compliance information is shown per product, with its own review date.',
        'تُعرض معلومات الامتثال لكل منتج مع تاريخ مراجعته الخاص.',
      ),
    ],
  },
  {
    id: 'review',
    iconKey: 'file-search',
    title: approved('How we review information', 'مراجعة المعلومات'),
    description: approved(
      'Health-related wording is not written by the website team. It is supplied by Vitadiet, marked as approved in a single content source, and only then published.',
      'لا يكتب فريق الموقع أي نص صحي. يُسلَّم النص من فيتادايت، ويوضع في مصدر محتوى واحد بحالة معتمد، ثم يُنشر بعد ذلك فقط.',
    ),
    points: [
      approved(
        'Copy that is still awaiting approval stays in the data source and is hidden from visitors.',
        'النص الذي ما زال ينتظر الاعتماد يبقى في مصدر البيانات ولا يظهر للزائر.',
      ),
      approved(
        'Each product page carries the date its information was last reviewed.',
        'تحمل كل صفحة منتج تاريخ آخر مراجعة لمعلوماتها.',
      ),
    ],
  },
  {
    id: 'transparency',
    iconKey: 'eye',
    title: approved('Transparent ingredients and warnings', 'الشفافية في المكونات والتحذيرات'),
    description: approved(
      'Ingredients, usage instructions, and warnings are shown on the product page in the same place, so nothing important sits behind an extra click.',
      'تُعرض المكونات وطريقة الاستخدام والتحذيرات في صفحة المنتج وفي المكان نفسه، حتى لا تختفي معلومة مهمة خلف نقرة إضافية.',
    ),
    points: [
      approved(
        'A dietary supplement does not replace a varied, balanced diet and a healthy lifestyle.',
        'المكمل الغذائي لا يغني عن نظام غذائي متنوع ومتوازن ونمط حياة صحي.',
      ),
      approved(
        'Consult your physician or pharmacist before use if you are pregnant, breastfeeding, taking medication, or managing a medical condition.',
        'استشر الطبيب أو الصيدلي قبل الاستخدام في حال الحمل أو الرضاعة أو تناول أدوية أو وجود حالة صحية.',
      ),
      approved(
        'The printed package label is always the reference for dose and composition.',
        'ملصق العبوة المطبوع هو المرجع دائما للجرعة والتركيبة.',
      ),
    ],
  },
]

/* -------------------------------------------------------------------------- *
 * Partnership form option lists
 * -------------------------------------------------------------------------- */

const facilityTypes: PartnerFormOption[] = [
  { id: 'pharmacy', label: text('Pharmacy', 'صيدلية') },
  { id: 'pharmacy-chain', label: text('Pharmacy chain', 'سلسلة صيدليات') },
  { id: 'distributor', label: text('Distributor', 'موزع') },
  { id: 'wholesaler', label: text('Wholesaler', 'تاجر جملة') },
  { id: 'retail', label: text('Retail store', 'متجر تجزئة') },
  { id: 'online-store', label: text('Online store', 'متجر إلكتروني') },
  { id: 'clinic', label: text('Clinic or medical centre', 'عيادة أو مركز طبي') },
  { id: 'other', label: text('Other', 'جهة أخرى') },
]

const partnershipTypes: PartnerFormOption[] = [
  { id: 'supply', label: text('Product supply', 'توريد منتجات') },
  { id: 'distribution', label: text('Distribution', 'توزيع') },
  { id: 'exclusive-region', label: text('Regional exclusivity', 'حصرية إقليمية') },
  { id: 'online-listing', label: text('Online marketplace listing', 'إدراج في متجر إلكتروني') },
  { id: 'information', label: text('Product information request', 'طلب معلومات عن المنتجات') },
]

/**
 * Products offered as "products of interest" checkboxes. Kept as slugs so the labels
 * come from the product catalog and can never drift from the product pages.
 */
const interestProductSlugs: ProductSlug[] = [
  'becalme',
  'femavit',
  'vitagen',
  'bestrong',
  'dplus',
  'green-pharmacy',
  'soluro',
]

export const partnerFormOptions: PartnerFormOptions = {
  facilityTypes,
  partnershipTypes,
  productSlugs: interestProductSlugs,
}

/* -------------------------------------------------------------------------- *
 * Legal documents linked from the footer
 * -------------------------------------------------------------------------- */

const legalSection = (
  id: string,
  headingEn: string,
  headingAr: string,
  body: [string, string][],
) => ({
  id,
  heading: approved(headingEn, headingAr),
  body: body.map(([en, ar]) => approved(en, ar)),
})

export const legalDocuments: LegalDocument[] = [
  {
    slug: 'privacy-policy',
    title: text('Privacy Policy', 'سياسة الخصوصية'),
    lastReviewed: CONTENT_REVIEW_DATE,
    intro: approved(
      'This policy explains what personal data this website collects, why it is collected, and how it is handled.',
      'توضح هذه السياسة البيانات الشخصية التي يجمعها هذا الموقع، وسبب جمعها، وكيفية التعامل معها.',
    ),
    seoDescription: approved(
      'How Vitadiet collects, uses, and protects the personal data submitted through vitadiet.sa.',
      'كيف تجمع فيتادايت البيانات الشخصية المرسلة عبر موقع vitadiet.sa وتستخدمها وتحميها.',
    ),
    sections: [
      legalSection('collected', 'Data we collect', 'البيانات التي نجمعها', [
        [
          'This website does not require an account and does not sell online. The only personal data it collects is what you type into the partnership form: your name, business name, business type, city, email address, phone number, the partnership type you are interested in, the products you are interested in, and your message.',
          'لا يتطلب هذا الموقع إنشاء حساب ولا يبيع إلكترونيا. البيانات الشخصية الوحيدة التي يجمعها هي ما تكتبه في نموذج الشراكة: الاسم، واسم المنشأة، ونوع المنشأة، والمدينة، والبريد الإلكتروني، ورقم الهاتف، ونوع الشراكة، والمنتجات محل الاهتمام، ونص رسالتك.',
        ],
        [
          'Sending the form is optional. If you would rather not use it, you can contact the team directly by email or phone.',
          'إرسال النموذج اختياري. وإذا كنت تفضل عدم استخدامه، يمكنك التواصل مع الفريق مباشرة عبر البريد الإلكتروني أو الهاتف.',
        ],
      ]),
      legalSection('purpose', 'Why we use it', 'لماذا نستخدمها', [
        [
          'Partnership enquiries are used to answer you and to assess the business request. They are not used for consumer advertising and are not sold or rented to any third party.',
          'تُستخدم طلبات الشراكة للرد عليك ودراسة الطلب التجاري فقط. ولا تُستخدم في الإعلانات الموجهة للمستهلك، ولا تُباع أو تُؤجَّر لأي طرف ثالث.',
        ],
        [
          'We do not ask for and do not want health information about you or anyone else through this website. Please do not include it in your message.',
          'نحن لا نطلب أي معلومات صحية عنك أو عن غيرك عبر هذا الموقع ولا نرغب في تلقيها. يرجى عدم تضمينها في رسالتك.',
        ],
      ]),
      legalSection('retention', 'Storage and retention', 'التخزين ومدة الاحتفاظ', [
        [
          'Enquiries are received at the single business address acc@vitadiet.sa and are kept for as long as the business relationship or the enquiry requires, then deleted.',
          'تُستقبل الطلبات على عنوان أعمال واحد هو acc@vitadiet.sa، ويُحتفظ بها طوال المدة التي تتطلبها العلاقة التجارية أو الطلب، ثم تُحذف.',
        ],
        [
          'Access is limited to the Vitadiet team members who handle partnership enquiries.',
          'الوصول محصور بأعضاء فريق فيتادايت المسؤولين عن طلبات الشراكة.',
        ],
      ]),
      legalSection('rights', 'Your rights', 'حقوقك', [
        [
          'You may ask what data we hold about you, ask us to correct it, or ask us to delete it. Write to acc@vitadiet.sa and we will respond to your request.',
          'يمكنك السؤال عن البيانات التي نحتفظ بها عنك، أو طلب تصحيحها، أو طلب حذفها. راسلنا على acc@vitadiet.sa وسنرد على طلبك.',
        ],
      ]),
      legalSection('third-parties', 'External links', 'الروابط الخارجية', [
        [
          'Buying links on this website open marketplaces operated by other companies. Once you leave vitadiet.sa, the privacy policy of that marketplace applies, not this one.',
          'تفتح روابط الشراء في هذا الموقع منصات تديرها شركات أخرى. وبمجرد مغادرتك موقع vitadiet.sa تسري سياسة خصوصية تلك المنصة وليس هذه السياسة.',
        ],
      ]),
    ],
  },
  {
    slug: 'terms-of-use',
    title: text('Terms of Use', 'شروط الاستخدام'),
    lastReviewed: CONTENT_REVIEW_DATE,
    intro: approved(
      'These terms describe how this website may be used, and what its content is and is not intended to do.',
      'توضح هذه الشروط كيفية استخدام هذا الموقع، وما الذي يهدف إليه محتواه وما لا يهدف إليه.',
    ),
    seoDescription: approved(
      'The terms that apply to using the Vitadiet website, its product information, and its external buying links.',
      'الشروط التي تحكم استخدام موقع فيتادايت ومعلومات المنتجات وروابط الشراء الخارجية.',
    ),
    sections: [
      legalSection('purpose', 'Purpose of this website', 'الغرض من الموقع', [
        [
          'This website presents the Vitadiet product catalog and directs visitors to the places where those products can be bought. No sale is concluded on this website and no payment is taken on it.',
          'يعرض هذا الموقع كتالوج منتجات فيتادايت ويوجّه الزائر إلى أماكن شرائها. ولا تتم أي عملية بيع على هذا الموقع ولا يُستقبل عليه أي دفع.',
        ],
      ]),
      legalSection('content', 'Product information', 'معلومات المنتجات', [
        [
          'We publish product information that has been supplied and approved by Vitadiet. Where information is still awaiting approval, it is withheld rather than guessed at.',
          'ننشر معلومات المنتجات التي سُلِّمت واعتُمدت من فيتادايت. وعندما تكون معلومة ما بانتظار الاعتماد، تُحجب ولا تُستنتج.',
        ],
        [
          'The printed label on the package is the reference for composition, dose, and storage. If the website and the package differ, follow the package and tell us.',
          'ملصق العبوة المطبوع هو المرجع للتركيبة والجرعة والتخزين. وإذا اختلف الموقع عن العبوة فاتبع العبوة وأبلغنا.',
        ],
      ]),
      legalSection('prices', 'Prices and availability', 'الأسعار والتوفر', [
        [
          'Where a price is shown it is the official Vitadiet price for that product at the review date on the page. The final price and the availability at any marketplace are set by that marketplace.',
          'عند عرض سعر فهو السعر الرسمي لفيتادايت للمنتج في تاريخ المراجعة المذكور في الصفحة. أما السعر النهائي وحالة التوفر في أي منصة بيع فتحددهما تلك المنصة.',
        ],
      ]),
      legalSection('external', 'External marketplaces', 'منصات البيع الخارجية', [
        [
          'Buying links open external websites in a new tab. Vitadiet does not operate those websites and is not responsible for their content, their pricing, or their delivery terms.',
          'تفتح روابط الشراء مواقع خارجية في تبويب جديد. ولا تدير فيتادايت تلك المواقع ولا تتحمل مسؤولية محتواها أو أسعارها أو شروط التوصيل فيها.',
        ],
      ]),
      legalSection('ip', 'Trademarks and content', 'العلامات التجارية والمحتوى', [
        [
          'The Vitadiet name, logo, product names, text, and images on this website belong to Vitadiet or to its partners and may not be reused commercially without written permission.',
          'اسم فيتادايت وشعارها وأسماء المنتجات والنصوص والصور في هذا الموقع ملك لفيتادايت أو لشركائها، ولا يجوز إعادة استخدامها تجاريا دون إذن كتابي.',
        ],
      ]),
      legalSection('changes', 'Changes', 'التعديلات', [
        [
          'The catalog, the prices, and these terms may be updated. The review date shown on each page tells you which version you are reading.',
          'قد يُحدَّث الكتالوج والأسعار وهذه الشروط. ويوضح تاريخ المراجعة الظاهر في كل صفحة أي نسخة تقرأ.',
        ],
      ]),
    ],
  },
  {
    slug: 'cookies-policy',
    title: text('Cookies Policy', 'سياسة ملفات الارتباط'),
    lastReviewed: CONTENT_REVIEW_DATE,
    intro: approved(
      'This page states exactly what this website stores in your browser.',
      'توضح هذه الصفحة بدقة ما الذي يخزنه هذا الموقع في متصفحك.',
    ),
    seoDescription: approved(
      'What the Vitadiet website stores in your browser, and why it uses no advertising or tracking cookies.',
      'ما الذي يخزنه موقع فيتادايت في متصفحك، ولماذا لا يستخدم ملفات ارتباط إعلانية أو تتبعية.',
    ),
    sections: [
      legalSection('current', 'What we use today', 'ما نستخدمه اليوم', [
        [
          'This website is a static site. It sets no advertising cookies, no tracking cookies, and no profiling cookies, and it does not build a visitor profile.',
          'هذا الموقع ثابت. لا يضع ملفات ارتباط إعلانية ولا تتبعية ولا ملفات لبناء ملف تعريفي، ولا ينشئ ملفا تعريفيا للزائر.',
        ],
        [
          'Your language choice is expressed in the address you are on: Arabic is served from the main address and English from an address that starts with /en. No cookie is needed to remember it.',
          'يظهر اختيارك للغة في العنوان نفسه: تُقدَّم العربية من العنوان الرئيسي وتُقدَّم الإنجليزية من عنوان يبدأ بـ /en. ولا حاجة لأي ملف ارتباط لتذكّر ذلك.',
        ],
        [
          'Your browser may cache pages, images, and fonts to make the site load faster. That is normal browser caching and you can clear it from your browser settings at any time.',
          'قد يخزّن متصفحك الصفحات والصور والخطوط مؤقتا لتسريع التحميل. وهذا تخزين مؤقت اعتيادي في المتصفح ويمكنك مسحه من إعدادات المتصفح في أي وقت.',
        ],
      ]),
      legalSection('third-party', 'Other websites', 'المواقع الأخرى', [
        [
          'When you follow a buying link or a social media link you leave this website. The cookie policy of the website you land on applies there, and it is usually different from this one.',
          'عند اتباع رابط شراء أو رابط تواصل اجتماعي فأنت تغادر هذا الموقع. وتسري هناك سياسة ملفات الارتباط الخاصة بالموقع الذي تصل إليه، وهي غالبا مختلفة عن هذه السياسة.',
        ],
      ]),
      legalSection('future', 'If this changes', 'إذا تغير هذا', [
        [
          'If analytics or marketing tools are added later, this page will be updated first, and consent will be requested before any such cookie is set.',
          'إذا أُضيفت لاحقا أدوات تحليلات أو تسويق، فسيتم تحديث هذه الصفحة أولا وطلب الموافقة قبل وضع أي ملف ارتباط من هذا النوع.',
        ],
      ]),
    ],
  },
  {
    slug: 'medical-disclaimer',
    title: text('Medical Disclaimer', 'إخلاء المسؤولية الطبية'),
    lastReviewed: CONTENT_REVIEW_DATE,
    intro: approved(
      'Please read this before acting on anything you find on this website.',
      'يرجى قراءة ما يلي قبل اتخاذ أي إجراء بناء على ما تجده في هذا الموقع.',
    ),
    seoDescription: approved(
      'Vitadiet product information is general information about dietary supplements and is not medical advice.',
      'معلومات منتجات فيتادايت هي معلومات عامة عن المكملات الغذائية وليست استشارة طبية.',
    ),
    sections: [
      legalSection('not-advice', 'This is not medical advice', 'هذا ليس استشارة طبية', [
        [
          'The content on this website is general information about dietary supplements. It is not a medical consultation, not a diagnosis, and not a treatment plan, and it does not replace advice from your physician or pharmacist.',
          'محتوى هذا الموقع معلومات عامة عن المكملات الغذائية. وهو ليس استشارة طبية ولا تشخيصا ولا خطة علاجية، ولا يغني عن استشارة الطبيب أو الصيدلي.',
        ],
        [
          'A dietary supplement does not replace a varied, balanced diet and a healthy lifestyle.',
          'المكمل الغذائي لا يغني عن نظام غذائي متنوع ومتوازن ونمط حياة صحي.',
        ],
      ]),
      legalSection('before-use', 'Before you use a product', 'قبل استخدام أي منتج', [
        [
          'Talk to your physician or pharmacist first if you are pregnant, breastfeeding, taking any medication, living with a medical condition, or buying for a child.',
          'استشر الطبيب أو الصيدلي أولا في حال الحمل أو الرضاعة أو تناول أي دواء أو وجود حالة صحية أو الشراء لطفل.',
        ],
        [
          'Follow the dose printed on the package and do not exceed the stated daily dose.',
          'اتبع الجرعة المدونة على العبوة ولا تتجاوز الجرعة اليومية المذكورة.',
        ],
        [
          'Stop use and seek medical advice if any unwanted reaction occurs.',
          'أوقف الاستخدام واستشر الطبيب عند ظهور أي أثر غير مرغوب.',
        ],
      ]),
      legalSection('emergency', 'In an emergency', 'في الحالات الطارئة', [
        [
          'If you think you are having a medical emergency, contact emergency services or go to the nearest hospital. Do not wait for a reply from this website.',
          'إذا كنت تعتقد أنك تواجه حالة طارئة، فاتصل بخدمات الطوارئ أو توجه إلى أقرب مستشفى. ولا تنتظر ردا من هذا الموقع.',
        ],
      ]),
    ],
  },
]

// Fails at import time rather than as a 404 discovered after deployment: the routes
// prerendered from LEGAL_SLUGS and the documents rendered into them are one set.
const seenLegalSlugs = new Set<LegalDocumentSlug>()
for (const document of legalDocuments) {
  if (seenLegalSlugs.has(document.slug)) {
    throw new Error(`Duplicate legal document slug: ${document.slug}`)
  }
  seenLegalSlugs.add(document.slug)
}

for (const slug of LEGAL_SLUGS) {
  if (!seenLegalSlugs.has(slug)) {
    throw new Error(`Missing legal document for slug: ${slug}`)
  }
}
