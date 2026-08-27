/**
 * Validation rules for the central product data source (بند 6).
 *
 * Runs against app/data/product-catalog.ts as text, so it stays dependency-free and
 * works before the Nuxt build. When the catalog is later served by an API, point this
 * at the API response instead - the rules themselves do not change.
 */
import { readFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'

const CATALOG = 'app/data/product-catalog.ts'
const SLUGS = 'shared/products.ts'
const PHASE_2_SLUGS = ['becalme', 'femavit', 'vitagen']

/** Claims that may never ship without documented VITADIET sign-off (بند 6). */
const FORBIDDEN_CLAIMS = [
  'يعالج',
  'يمنع المرض',
  'يضمن النتيجة',
  'بديل عن العلاج',
  'نتائج مؤكدة',
  'آمن للجميع',
  'لا يسبب آثارا جانبية',
  'لا يسبب آثاراً جانبية',
]

const failures = []
const fail = (message) => failures.push(message)

const catalog = await readFile(CATALOG, 'utf8')
const slugSource = await readFile(SLUGS, 'utf8')

// --- Every declared slug has a catalog entry, and every entry has a declared slug ---
const declaredSlugs = [...slugSource.matchAll(/^\s*'([a-z0-9-]+)',$/gm)].map((m) => m[1])
const catalogSlugs = [...catalog.matchAll(/^\s{4}slug: '([a-z0-9-]+)',$/gm)].map((m) => m[1])

for (const slug of declaredSlugs) {
  if (!catalogSlugs.includes(slug))
    fail(`slug "${slug}" is declared in ${SLUGS} but has no catalog entry`)
}
for (const slug of catalogSlugs) {
  if (!declaredSlugs.includes(slug)) fail(`catalog entry "${slug}" is not declared in ${SLUGS}`)
}
const duplicateSlugs = catalogSlugs.filter((slug, i) => catalogSlugs.indexOf(slug) !== i)
if (duplicateSlugs.length)
  fail(`duplicate catalog slugs: ${[...new Set(duplicateSlugs)].join(', ')}`)

// --- Referenced image and logo files exist on disk (no broken links, بند 12) ---
const imageCalls = [
  ...catalog.matchAll(/productImage\(\s*'([^']+)',\s*'([^']+)',\s*'([^']*)',\s*'([^']*)'/g),
]
if (imageCalls.length === 0) fail('no productImage() entries found - check the catalog format')

const altTexts = new Map()
for (const [, folder, file, altEn, altAr] of imageCalls) {
  const path = `public/images/products/${folder}/${file}.webp`
  if (!existsSync(path)) fail(`missing image file: ${path}`)

  for (const [lang, alt] of [
    ['en', altEn],
    ['ar', altAr],
  ]) {
    if (!alt.trim()) {
      fail(`${path}: empty ${lang} alt text`)
      continue
    }
    const key = `${folder}:${lang}:${alt}`
    if (altTexts.has(key)) fail(`${path}: ${lang} alt text duplicates another image in "${folder}"`)
    altTexts.set(key, path)
  }
}

for (const [, src] of catalog.matchAll(/src: '(\/images\/platforms\/[^']+)'/g)) {
  if (!existsSync(`public${src}`)) fail(`missing platform logo file: public${src}`)
}

for (const [, url] of catalog.matchAll(/url: '(\/[^']+\.pdf)'/g)) {
  if (!existsSync(`public${url}`)) fail(`missing local asset: public${url}`)
}

if (/references:\s*catalogProductFiles/.test(catalog)) {
  fail('product catalog files must use productFiles, not scientific references')
}

if (/references:\s*\[[\s\S]*?vitadiet-catalog\.pdf/.test(catalog)) {
  fail('vitadiet-catalog.pdf is a product file, not a scientific reference')
}

// --- Purchase options point at their own product (بند 9) ---
const noonCalls = [...catalog.matchAll(/noonOption\(\s*'([a-z0-9-]+)',\s*'([^']+)'/g)]
for (const [, slug, url] of noonCalls) {
  if (!declaredSlugs.includes(slug)) fail(`purchase option references unknown slug "${slug}"`)
  if (!url.startsWith('https://')) fail(`purchase URL for "${slug}" must be https: ${url}`)
  if (/localhost|127\.0\.0\.1/.test(url)) fail(`purchase URL for "${slug}" points at a dev host`)
}

// --- No forbidden claim ships as approved copy (بند 6) ---
// approved(...) and text(...) inside an approved block are consumer-visible; pending(...)
// rows are withheld by the service layer, so they are allowed to hold draft wording.
for (const [, body] of catalog.matchAll(/\bapproved\(([^)]*)\)/g)) {
  for (const claim of FORBIDDEN_CLAIMS) {
    if (body.includes(claim)) fail(`forbidden claim "${claim}" appears in approved copy`)
  }
}

// --- The three phase-2 products carry every template section (بند 5) ---
// Sections that phase2Sections supplies to every phase-2 product...
const SHARED_SECTIONS = [
  'benefits',
  'compliance',
  'ingredients',
  'manufacturer',
  'suitableFor',
  'usage',
  'warnings',
]
// ...and sections each product must author for itself.
const PER_PRODUCT_SECTIONS = ['definition', 'faqs', 'packSize', 'positioning', 'seo']

const sharedBlock = catalog.match(/const phase2Sections = \{([\s\S]*?)\n\} satisfies/)
if (!sharedBlock) {
  fail('could not find the phase2Sections declaration')
} else {
  for (const field of SHARED_SECTIONS) {
    if (!new RegExp(`^\\s{2}${field}:`, 'm').test(sharedBlock[1])) {
      fail(`phase2Sections is missing the "${field}" section`)
    }
  }
}

const entries = catalog.split(/\n {2}\{\n/).slice(1)
for (const slug of PHASE_2_SLUGS) {
  const entry = entries.find((block) => block.includes(`slug: '${slug}',`))
  if (!entry) {
    fail(`phase-2 product "${slug}" has no catalog entry`)
    continue
  }
  if (!entry.includes("templateVersion: 'phase-2'")) {
    fail(`"${slug}" must use templateVersion: 'phase-2'`)
  }
  if (!entry.includes('...phase2Sections')) {
    fail(`phase-2 product "${slug}" must spread ...phase2Sections`)
  }
  for (const field of PER_PRODUCT_SECTIONS) {
    if (!new RegExp(`^\\s{4}${field}:`, 'm').test(entry)) {
      fail(`phase-2 product "${slug}" is missing the "${field}" section`)
    }
  }
}

if (failures.length > 0) {
  console.error(`Product catalog check failed with ${failures.length} violation(s):`)
  failures.forEach((failure) => console.error(`  - ${failure}`))
  process.exit(1)
}

console.log(
  `Product catalog check passed: ${catalogSlugs.length} product(s), ${imageCalls.length} image(s), ` +
    `${noonCalls.length} purchase option(s), no forbidden claims in approved copy.`,
)
