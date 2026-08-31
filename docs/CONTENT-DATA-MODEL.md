# نموذج البيانات المركزي - المرحلة 3

هذه الوثيقة تشرح **أين توجد البيانات المتغيرة، وكيف تُقرأ، وكيف تُحدَّث**، وهي أحد شروط
إغلاق المرحلة. القاعدة الأساسية واحدة:

> لا يوجد أي نص متغير أو رابط أو سعر أو خيار قائمة مكتوباً داخل مكوّن واجهة (Hardcode).
> كل شيء يأتي من ملف بيانات مركزي، ويُقرأ عبر طبقة خدمة (Service Layer).

---

## 1. خريطة المصادر

| المحتوى                                                  | ملف البيانات المركزي             | طبقة القراءة                      |
| -------------------------------------------------------- | -------------------------------- | --------------------------------- |
| المنتجات، الأسعار، روابط الشراء، صور المنتجات            | `app/data/product-catalog.ts`    | `app/services/product-catalog.ts` |
| الجودة والاعتماد، الوثائق القانونية، قوائم نموذج الشراكة | `app/data/site-content.ts`       | `app/services/site-content.ts`    |
| روابط الهيدر والفوتر                                     | `app/data/navigation.ts`         | `app/composables/useNavPath.ts`   |
| الأسئلة الشائعة في الصفحة الرئيسية                       | `app/data/faq.ts`                | مفاتيح i18n                       |
| روابط التواصل الاجتماعي وبيانات الشركة                   | `shared/brand.ts`                | استيراد مباشر                     |
| معرّفات المنتجات (Slugs)                                 | `shared/products.ts`             | —                                 |
| معرّفات الصفحات القانونية (Slugs)                        | `shared/legal.ts`                | —                                 |
| نصوص الواجهة الثابتة (أزرار، عناوين، رسائل)              | `app/locales/ar.json` و`en.json` | `$t()`                            |

`shared/products.ts` و`shared/legal.ts` موجودان في `shared/` لأن `nuxt.config.ts` يحتاجهما
لتوليد الصفحات مسبقاً (Prerender)، ولا يستطيع الاستيراد من `app/`.

---

## 2. طبقة الخدمة والربط المستقبلي مع Dashboard

كل صفحة تقرأ عبر `useAsyncData`، أي أنها **تتعامل أصلاً مع حالتي Loading وError**. هذا
مقصود: عندما يصبح المصدر API حقيقياً، لن تحتاج الصفحات إلى أي تعديل.

الدوال التي يجب استبدال جسمها فقط عند ربط Dashboard:

```ts
// app/services/product-catalog.ts
getProducts(): Promise<HomeProduct[]>
getProductBySlug(slug: string): Promise<HomeProduct | undefined>

// app/services/site-content.ts
getQualityPillars(): Promise<QualityPillar[]>
getLegalDocuments(): Promise<LegalDocument[]>
getLegalDocumentBySlug(slug: string): Promise<LegalDocument | undefined>
getPartnerFormOptions(): Promise<PartnerFormOptions>
```

استبدال `await import(...)` بـ`$fetch('/api/...')` كافٍ، بشرط أن يعيد الـAPI نفس الشكل
المعرَّف في `app/types/index.ts`. **لا تتغير أي صفحة، ولا أي مكوّن، ولا أي رابط.**

بقية دوال الخدمة (`localizeApprovedCopy`، `getBuyablePurchaseOptions`، `localizeLegalSections`،
…) تبقى طبقة Adapter تطبق قاعدة الاعتماد والتعريب قبل العرض.

---

## 3. حالات الاعتماد

كل نص قابل للتغيير يحمل `status`:

- `approved`: يظهر للزائر.
- `pending_approval`: موجود في ملف البيانات ولا يظهر.
- `rejected`: لا يظهر ويحتاج إعادة كتابة.

خطوة النشر الواحدة: استبدل النص ثم غيّر `status` إلى `approved`. لا حاجة لأي تعديل في
الصفحات أو المكونات.

العبارات المحظورة بدون اعتماد رسمي موثق: يعالج، يمنع المرض، يضمن النتيجة، بديل عن العلاج،
نتائج مؤكدة، آمن للجميع، لا يسبب آثاراً جانبية. الفحوص الآلية ترفض البناء عند وجودها.

---

## 4. محتوى المرحلة 3 بالتفصيل

### 4.1 الجودة والاعتماد

`qualityPillars` داخل `app/data/site-content.ts`، وتغطي المحاور الخمسة المطلوبة:

| `id`            | المحور                          |
| --------------- | ------------------------------- |
| `selection`     | منهج اختيار المنتجات            |
| `manufacturing` | جودة التصنيع                    |
| `compliance`    | التسجيل والامتثال               |
| `review`        | مراجعة المعلومات                |
| `transparency`  | الشفافية في المكونات والتحذيرات |

كل محور يحتوي `title` و`description` و`points`، وكلها بحالة اعتماد.
`iconKey` نصّ وليس مكوّناً، حتى تبقى البيانات قابلة للنقل عبر API؛ الربط بين المفتاح
والأيقونة يتم في مكان واحد: `app/components/quality/PillarIcon.vue`.

**ممنوع** وضع رقم تسجيل أو رقم شهادة أو نتيجة تدقيق هنا. هذه بيانات لكل منتج على حدة،
ومكانها `compliance` داخل `app/data/product-catalog.ts` بحالة اعتماد مستقلة.

### 4.2 الوثائق القانونية

`legalDocuments` داخل `app/data/site-content.ts`، وتُعرض عبر `app/pages/legal/[slug].vue`:

| Slug                 | الصفحة                       |
| -------------------- | ---------------------------- |
| `privacy-policy`     | `/legal/privacy-policy/`     |
| `terms-of-use`       | `/legal/terms-of-use/`       |
| `cookies-policy`     | `/legal/cookies-policy/`     |
| `medical-disclaimer` | `/legal/medical-disclaimer/` |

Slug الصفحة هو URL منشور. حذفه أو تغييره يحتاج Redirect 301 معتمد في `public/.htaccess`،
تماماً كـSlug المنتج.

### 4.3 قوائم نموذج الشراكة

`partnerFormOptions` داخل `app/data/site-content.ts`:

- `facilityTypes`: أنواع المنشآت.
- `partnershipTypes`: أنواع الشراكة.
- `productSlugs`: المنتجات المعروضة كخيارات اهتمام. تُخزَّن كـSlugs فقط، وتأتي أسماؤها من
  كتالوج المنتجات، حتى لا تختلف عن أسماء صفحات المنتجات أبداً.

---

## 5. طريقة التحديث

1. عدّل الملف المركزي المناسب من الجدول في القسم 1.
2. لا تغيّر أي `slug` بدون Redirect 301 معتمد.
3. للنصوص الصحية: ضع النص المعتمد ثم غيّر `status` إلى `approved`.
4. لإضافة صفحة قانونية جديدة: أضف الـSlug في `shared/legal.ts` **و**الوثيقة في
   `app/data/site-content.ts`. الفحص يرفض البناء إذا نقص أحدهما.
5. شغّل الفحوص قبل التسليم:

```bash
npm run lint
npm run typecheck
npm run generate
```

---

## 6. الفحوص الآلية

تعمل تلقائياً داخل `npm run build` و`npm run generate`:

| الأمر                   | ما يفحصه                                                                       |
| ----------------------- | ------------------------------------------------------------------------------ |
| `npm run test:catalog`  | تكامل كتالوج المنتجات، الصور، Alt Text، روابط الشراء، العبارات المحظورة        |
| `npm run test:content`  | المحاور الخمسة للجودة، تطابق Slugs القانونية، وحدة بريد B2B، العبارات المحظورة |
| `npm run test:contrast` | تباين ألوان التصميم مقابل WCAG AA                                              |
| `npm run test:urls`     | عدم تسرب `localhost` إلى الملفات المنشورة                                      |
| `npm run test:schema`   | سلامة رسم Schema.org في الصفحات المولّدة                                       |
| `npm run test:i18n`     | تطابق مفاتيح العربية والإنجليزية وعدم وجود مفاتيح ميتة                         |
| `npm run test:site-url` | تطابق النطاق بين `shared/site.ts` و`nuxt.config.ts` و`.htaccess`               |
| `npm run test:delivery` | سياسة الفهرسة وأبعاد الصور المولّدة                                            |

`test:content` هو الذي يمنع عودة بريد ثانٍ للـB2B: يقارن `CONTACT.email` في
`shared/brand.ts` بمستقبِل الرسائل في `public/api/partner-lead.php` ويفشل عند اختلافهما.
