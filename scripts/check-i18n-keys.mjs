import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import process from 'node:process'

const ROOT = process.cwd()
const LOCALE_DIR = join(ROOT, 'app', 'locales')
const LOCALE_FILES = {
  ar: join(LOCALE_DIR, 'ar.json'),
  en: join(LOCALE_DIR, 'en.json'),
}
const SOURCE_ROOTS = ['app', 'server', 'shared', 'scripts']
const SOURCE_FILES = ['nuxt.config.ts']
const SOURCE_EXTENSIONS = new Set(['.vue', '.ts', '.mjs'])

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'))
}

function flatten(value, prefix = '', output = new Map()) {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    for (const [key, child] of Object.entries(value)) {
      flatten(child, prefix ? `${prefix}.${key}` : key, output)
    }
    return output
  }

  output.set(prefix, value)
  return output
}

function extensionOf(path) {
  const index = path.lastIndexOf('.')
  return index === -1 ? '' : path.slice(index)
}

function collectFiles(path, files = []) {
  if (!existsSync(path)) return files

  const stats = statSync(path)
  if (stats.isFile()) {
    if (SOURCE_EXTENSIONS.has(extensionOf(path))) files.push(path)
    return files
  }

  for (const entry of readdirSync(path)) {
    const childPath = join(path, entry)
    const rel = relative(ROOT, childPath).replaceAll('\\', '/')
    if (rel.startsWith('app/locales/') || rel.startsWith('.nuxt/') || rel.startsWith('.output/')) {
      continue
    }
    collectFiles(childPath, files)
  }

  return files
}

function isAllowedDynamicKey(key) {
  if (key.startsWith('homePage.whoWeAre.petals.')) return true
  // The partnership form builds these from the field name and the validation error key,
  // so the literal key never appears in a source file.
  if (key.startsWith('partnerForm.fields.')) return true
  if (key.startsWith('partnerForm.errors.')) return true
  return false
}

function difference(left, right) {
  return [...left].filter((key) => !right.has(key))
}

const localeEntries = Object.fromEntries(
  Object.entries(LOCALE_FILES).map(([locale, path]) => [locale, flatten(readJson(path))]),
)

const localeKeySets = Object.fromEntries(
  Object.entries(localeEntries).map(([locale, entries]) => [locale, new Set(entries.keys())]),
)

const missingInEn = difference(localeKeySets.ar, localeKeySets.en)
const missingInAr = difference(localeKeySets.en, localeKeySets.ar)

if (missingInEn.length || missingInAr.length) {
  console.error('Locale key sets differ.')
  for (const key of missingInEn) console.error(`missing in en: ${key}`)
  for (const key of missingInAr) console.error(`missing in ar: ${key}`)
  process.exit(1)
}

const sourceFiles = [
  ...SOURCE_ROOTS.flatMap((dir) => collectFiles(join(ROOT, dir))),
  ...SOURCE_FILES.map((file) => join(ROOT, file)).filter(existsSync),
]

const source = sourceFiles.map((file) => readFileSync(file, 'utf8')).join('\n')
const deadKeys = [...localeKeySets.ar]
  .filter((key) => !source.includes(key) && !isAllowedDynamicKey(key))
  .sort()

if (deadKeys.length) {
  console.error(`Dead i18n keys (${deadKeys.length}):`)
  for (const key of deadKeys) console.error(key)
  process.exit(1)
}

console.log(`i18n keys ok (${localeKeySets.ar.size} keys).`)
