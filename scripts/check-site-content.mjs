/**
 * Validation rules for the central site content source added in phase 3.
 *
 * Same job and same style as `check-product-catalog.mjs`, but for
 * `app/data/site-content.ts`: quality and accreditation copy, the legal documents linked
 * from the footer, and the partnership form option lists. Runs against the file as text
 * so it stays dependency-free and works before the Nuxt build.
 */
import { readFile } from 'node:fs/promises'
import process from 'node:process'

const CONTENT = 'app/data/site-content.ts'
const LEGAL_SLUGS_FILE = 'shared/legal.ts'
const BRAND = 'shared/brand.ts'

/** Claims that may never ship without documented VITADIET sign-off. */
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

/** The five topics the quality and accreditation page must cover. */
const REQUIRED_PILLARS = ['selection', 'manufacturing', 'compliance', 'review', 'transparency']

const failures = []
const fail = (message) => failures.push(message)

const content = await readFile(CONTENT, 'utf8')
const legalSource = await readFile(LEGAL_SLUGS_FILE, 'utf8')
const brand = await readFile(BRAND, 'utf8')

// --- Quality pillars: all five topics present ---
const pillarIds = [...content.matchAll(/^\s{4}id: '([a-z-]+)',$/gm)].map((match) => match[1])
for (const pillar of REQUIRED_PILLARS) {
  if (!pillarIds.includes(pillar)) fail(`quality pillar "${pillar}" is missing from ${CONTENT}`)
}

// --- Legal documents: every declared slug has a document, and the reverse ---
const declaredLegalSlugs = [...legalSource.matchAll(/^\s{2}'([a-z0-9-]+)',$/gm)].map((m) => m[1])
const documentSlugs = [...content.matchAll(/^\s{4}slug: '([a-z0-9-]+)',$/gm)].map((m) => m[1])

for (const slug of declaredLegalSlugs) {
  if (!documentSlugs.includes(slug)) {
    fail(`legal slug "${slug}" is declared in ${LEGAL_SLUGS_FILE} but has no document`)
  }
}
for (const slug of documentSlugs) {
  if (!declaredLegalSlugs.includes(slug)) {
    fail(`legal document "${slug}" is not declared in ${LEGAL_SLUGS_FILE}`)
  }
}

// --- One contact address across the site, form handler included ---
const contactEmail = brand.match(/email:\s*'([^']+)'/)?.[1]
if (!contactEmail) {
  fail(`could not read CONTACT.email from ${BRAND}`)
} else {
  const handler = await readFile('public/api/partner-lead.php', 'utf8')
  const recipient = handler.match(/const RECIPIENT = '([^']+)'/)?.[1]
  if (recipient !== contactEmail) {
    fail(
      `partnership form recipient "${recipient}" does not match CONTACT.email "${contactEmail}"; ` +
        'the phase brief requires a single approved B2B inbox',
    )
  }

  const otherInboxes = [...content.matchAll(/[a-z0-9._-]+@vitadiet\.sa/gi)]
    .map((match) => match[0].toLowerCase())
    .filter((address) => address !== contactEmail.toLowerCase())

  if (otherInboxes.length) {
    fail(`${CONTENT} names a second contact address: ${[...new Set(otherInboxes)].join(', ')}`)
  }
}

// --- No forbidden claim ships as approved copy ---
for (const claim of FORBIDDEN_CLAIMS) {
  if (content.includes(claim)) fail(`forbidden claim "${claim}" appears in ${CONTENT}`)
}

// --- Approval statuses are limited to the three known values ---
for (const match of content.matchAll(/status: '([a-z_]+)'/g)) {
  if (!['approved', 'pending_approval', 'rejected'].includes(match[1])) {
    fail(`unknown approval status "${match[1]}" in ${CONTENT}`)
  }
}

if (failures.length) {
  console.error(`\nSite content check failed with ${failures.length} violation(s):\n`)
  for (const failure of failures) console.error(`  - ${failure}`)
  console.error('')
  process.exit(1)
}

console.log(
  `Site content ok (${pillarIds.length} quality pillar(s), ${documentSlugs.length} legal ` +
    `document(s), single contact inbox ${contactEmail}).`,
)
