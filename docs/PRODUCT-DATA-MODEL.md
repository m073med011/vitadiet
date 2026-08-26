# نموذج بيانات المنتجات - المرحلة 2

مصدر بيانات المنتجات المركزي موجود في:

```text
app/data/product-catalog.ts
```

وتتم قراءة البيانات عبر طبقة وسيطة في:

```text
app/services/product-catalog.ts
```

الصفحات والمكونات لا تقرأ الأسعار أو روابط الشراء أو نصوص المنتج مباشرة من الواجهة، بل تمر عبر هذه الطبقة حتى يمكن ربط API أو Dashboard لاحقا بدون تغيير روابط صفحات المنتجات.

## الحقول الأساسية

- `slug`: معرف ثابت للرابط مثل `/product/becalme/`.
- `title`, `arabicName`, `englishName`: أسماء المنتج بالعربية والإنجليزية.
- `seo.title`, `seo.description`: عنوان ووصف SEO مع حالة اعتماد.
- `listingDescription`: وصف مختصر لبطاقات وقائمة المنتجات.
- `positioning`, `definition`, `benefits`, `ingredients`, `usage`, `warnings`, `suitableFor`: أقسام اختيارية، ولا تظهر إلا إذا كانت حالتها `approved`.
- `price`: السعر الرسمي الموحد، ويظهر فقط عند `status: 'approved'`.
- `purchaseOptions`: منصات الشراء، حالة التوفر، ورابط المنتج نفسه.
- `images`: مسار الصورة، أبعادها، وAlt Text مختلف لكل صورة.
- `faqs`, `references`, `relatedSlugs`, `lastReviewed`: حقول اختيارية لقالب صفحة المنتج.
- `templateVersion`: المنتجات الثلاثة في هذه المرحلة تستخدم `phase-2`، وباقي المنتجات تبقى `legacy` إلى حين اعتمادها لاحقا.

## حالات الاعتماد

كل نص قابل للتغيير يستخدم واحدة من القيم التالية:

- `approved`: مسموح عرضه.
- `pending_approval`: موجود في ملف البيانات لكنه لا يظهر للمستهلك.
- `rejected`: لا يظهر ويحتاج إعادة كتابة.

لا تضف claim صحي إلى الواجهة إلا بعد وضعه في ملف البيانات بحالة `approved`. العبارات المحظورة بدون اعتماد رسمي تشمل: يعالج، يمنع المرض، يضمن النتيجة، بديل عن العلاج، نتائج مؤكدة، آمن للجميع، لا يسبب آثارا جانبية.

## طريقة التحديث

1. حدّث المنتج في `app/data/product-catalog.ts`.
2. استخدم نفس `slug` ولا تغير URL بدون Redirect 301 معتمد.
3. ضع السعر الرسمي في `price.amount` ولا تضف أسعارا مختلفة حسب المنصة.
4. أضف حالة التوفر لكل منصة داخل `purchaseOptions`.
5. تأكد أن `purchaseOptions[].productSlug` يطابق المنتج نفسه قبل ظهور زر الشراء.
6. أضف أبعاد الصور وAlt Text وصفي لكل صورة مهمة.
7. شغّل الفحوص قبل التسليم:

```bash
npm run lint
npm run typecheck
npm run generate
```

## الربط المستقبلي مع Dashboard

عند بناء Dashboard، يمكن استبدال `app/data/product-catalog.ts` بمصدر API يعيد نفس شكل `ProductCatalogItem`. يجب إبقاء `app/services/product-catalog.ts` كطبقة adapter للتحقق من الاعتماد، الأسعار الموحدة، وروابط الشراء قبل عرضها.
