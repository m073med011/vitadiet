import { readFileSync } from 'node:fs'
import process from 'node:process'

const siteSource = readFileSync('shared/site.ts', 'utf8')
const siteUrl = siteSource.match(/export const SITE_URL = '([^']+)'/)?.[1]

if (!siteUrl) {
  console.error('Could not read SITE_URL from shared/site.ts')
  process.exit(1)
}

const checkedFiles = ['nuxt.config.ts', 'public/.htaccess', 'scripts/check-schema-org.mjs']
const failures = []

for (const file of checkedFiles) {
  const source = readFileSync(file, 'utf8')
  const urls = source.match(/https:\/\/[^'"()\s]+vitadiet\.sa\/?/g) ?? []

  for (const url of urls) {
    const normalized = url.replace(/\/$/, '')
    if (normalized !== siteUrl) {
      failures.push(`${file}: ${url}`)
    }
  }
}

if (failures.length) {
  console.error(`Vitadiet URL drift. Expected ${siteUrl}:`)
  for (const failure of failures) console.error(failure)
  process.exit(1)
}

console.log(`Site URL sync ok (${siteUrl}).`)
