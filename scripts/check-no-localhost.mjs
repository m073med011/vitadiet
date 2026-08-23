/**
 * Build guard: fails the build when a dev-only host leaks into a published file.
 *
 * `useRequestURL()` resolves to http://localhost during static prerender, which
 * silently poisons canonical / og:url / hreflang / JSON-LD and sitemap <loc>
 * values. That is invisible locally and only shows up once Google indexes the
 * site, so it has to be caught before publishing rather than in review.
 *
 * Only crawler-visible text is scanned (.html/.xml/.json, plus the JSON-LD
 * inside HTML). The JS bundles are deliberately skipped: Nuxt's payload fetcher
 * legitimately contains `new URL(path, "http://localhost")` as a parse base.
 */
import { readFile, readdir } from 'node:fs/promises'
import { join, relative } from 'node:path'

const PUBLIC_DIR = '.output/public'
const SCANNED_EXTENSIONS = ['.html', '.xml', '.json']
const FORBIDDEN = /localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\]/gi
// Nuxt's diagnostic metadata records the local prerender origin, but is not
// crawler-visible page content or JSON-LD.
const IGNORED_FILES = new Set([join('__site-config__', 'debug.json')])

/** Every scannable file under `dir`, recursively. */
const collectFiles = async (dir) => {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = await Promise.all(
    entries.map((entry) => {
      const path = join(dir, entry.name)
      if (entry.isDirectory()) return collectFiles(path)
      const relativePath = relative(PUBLIC_DIR, path)
      return SCANNED_EXTENSIONS.some((ext) => entry.name.endsWith(ext)) &&
        !IGNORED_FILES.has(relativePath)
        ? [path]
        : []
    }),
  )
  return files.flat()
}

/** Line number + trimmed context for each forbidden match, for an actionable error. */
const findViolations = (content) => {
  const violations = []
  content.split('\n').forEach((line, index) => {
    for (const match of line.matchAll(FORBIDDEN)) {
      const start = Math.max(0, match.index - 60)
      violations.push({
        line: index + 1,
        match: match[0],
        context: line.slice(start, match.index + match[0].length + 60).trim(),
      })
    }
  })
  return violations
}

let files
try {
  files = await collectFiles(PUBLIC_DIR)
} catch {
  console.error(`✗ ${PUBLIC_DIR} not found — run the build before this check.`)
  process.exit(1)
}

if (files.length === 0) {
  console.error(`✗ No ${SCANNED_EXTENSIONS.join('/')} files in ${PUBLIC_DIR} — build looks empty.`)
  process.exit(1)
}

const failures = []
for (const file of files) {
  const violations = findViolations(await readFile(file, 'utf8'))
  if (violations.length > 0) failures.push({ file, violations })
}

if (failures.length > 0) {
  console.error(`\n✗ Dev host leaked into ${failures.length} published file(s):\n`)
  for (const { file, violations } of failures) {
    console.error(`  ${relative(process.cwd(), file)}`)
    for (const { line, match, context } of violations) {
      console.error(`    line ${line}: ${match} — …${context}…`)
    }
    console.error('')
  }
  console.error('Build absolute URLs from useSiteConfig().url, not useRequestURL().\n')
  process.exit(1)
}

console.log(`✓ No dev hosts in ${files.length} published file(s).`)
