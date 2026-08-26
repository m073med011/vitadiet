import { readFile, readdir, stat } from 'node:fs/promises'
import { join, relative } from 'node:path'

const PUBLIC_DIR = '.output/public'
const IPX_DIR = join(PUBLIC_DIR, '_ipx')
const NO_INDEX = 'noindex, nofollow, noarchive'
/** Smallest edge any generated image variant may have before it is treated as broken. */
const MIN_RENDERED_EDGE = 16
/**
 * A resized raster below this many bytes carries no visible content. It is what the
 * pipeline emits when it re-encodes an animated image whose first frame is blank.
 */
const MIN_VARIANT_BYTES = 400
const deploymentEnvironment = process.env.VITADIET_DEPLOY_ENV ?? 'production'

if (!['development', 'production'].includes(deploymentEnvironment)) {
  console.error(`Unsupported VITADIET_DEPLOY_ENV: ${deploymentEnvironment}`)
  process.exit(1)
}

const collectHtmlFiles = async (dir) => {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = await Promise.all(
    entries.map((entry) => {
      const path = join(dir, entry.name)
      if (entry.isDirectory()) return collectHtmlFiles(path)
      return entry.isFile() && entry.name.endsWith('.html') ? [path] : []
    }),
  )
  return files.flat()
}

const getAttribute = (tag, name) => {
  const match = tag.match(new RegExp(`\\b${name}\\s*=\\s*(["'])(.*?)\\1`, 'i'))
  return match?.[2]
}

const getMetaContent = (html, name) => {
  for (const match of html.matchAll(/<meta\b[^>]*>/gi)) {
    if (getAttribute(match[0], 'name')?.toLowerCase() === name) {
      return getAttribute(match[0], 'content')
    }
  }
  return undefined
}

const failures = []
let htmlFiles = []

try {
  htmlFiles = await collectHtmlFiles(PUBLIC_DIR)
} catch {
  failures.push(`${PUBLIC_DIR} does not exist; generate the site before running this check`)
}

const collectFiles = async (dir) => {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = await Promise.all(
    entries.map((entry) => {
      const path = join(dir, entry.name)
      return entry.isDirectory() ? collectFiles(path) : [path]
    }),
  )
  return files.flat()
}

// Every generated raster must actually contain pixels. A near-empty file means the
// source was re-encoded into nothing - an animated image flattened to a blank first
// frame, for example - and the page renders an invisible gap instead of the asset.
let variantCount = 0
try {
  for (const file of await collectFiles(IPX_DIR)) {
    if (/\.(svg|br|gz)$/i.test(file)) continue
    variantCount++
    const { size } = await stat(file)
    if (size < MIN_VARIANT_BYTES) {
      failures.push(
        `${relative(PUBLIC_DIR, file).replaceAll('\\', '/')}: generated variant is only ${size} ` +
          `bytes, which renders blank - serve this source unprocessed instead`,
      )
    }
  }
} catch {
  // No _ipx directory means no generated variants to police.
}

for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8')
  const fileName = relative(PUBLIC_DIR, file).replaceAll('\\', '/')
  const robots = getMetaContent(html, 'robots')
  const googlebot = getMetaContent(html, 'googlebot')
  const isGeneratedSitemapShell = fileName.endsWith('sitemap.xml/index.html')

  for (const match of html.matchAll(/<img\b[^>]*>/gi)) {
    const width = getAttribute(match[0], 'width')
    const height = getAttribute(match[0], 'height')
    if (width === '1' || height === '1') {
      failures.push(`${fileName}: image uses ${width ?? 'unset'}x${height ?? 'unset'} dimensions`)
    }

    // A `sizes` value the image provider cannot parse silently degrades into a
    // near-empty render target (e.g. /_ipx/q_80&s_1x1/...), which still carries correct
    // width/height attributes. Catch the generated variant instead of trusting them.
    for (const [, w, h] of match[0].matchAll(/\/_ipx\/[^/"'\s]*s_(\d+)x(\d+)\//g)) {
      if (Number(w) < MIN_RENDERED_EDGE || Number(h) < MIN_RENDERED_EDGE) {
        failures.push(
          `${fileName}: generated image variant is ${w}x${h}, below the ${MIN_RENDERED_EDGE}px ` +
            `minimum - check that the "sizes" prop uses the provider's screen-key syntax`,
        )
      }
    }
  }

  if (isGeneratedSitemapShell) continue

  if (deploymentEnvironment === 'development') {
    if (robots !== NO_INDEX) {
      failures.push(`${fileName}: robots must be "${NO_INDEX}", found ${JSON.stringify(robots)}`)
    }
    if (googlebot !== NO_INDEX) {
      failures.push(
        `${fileName}: googlebot must be "${NO_INDEX}", found ${JSON.stringify(googlebot)}`,
      )
    }
  } else {
    const isErrorPage = fileName === '404.html'
    if (!isErrorPage && (!robots || robots.includes('noindex'))) {
      failures.push(
        `production ${fileName}: robots must remain indexable, found ${JSON.stringify(robots)}`,
      )
    }
    if (!isErrorPage && googlebot?.includes('noindex')) {
      failures.push(`production ${fileName}: googlebot unexpectedly contains noindex`)
    }
  }
}

const htaccess = await readFile('public/.htaccess', 'utf8')
if (!htaccess.includes(`X-Robots-Tag "${NO_INDEX}"`)) {
  failures.push(`public/.htaccess must emit X-Robots-Tag "${NO_INDEX}" on non-production hosts`)
}

if (htmlFiles.length === 0) failures.push('no generated HTML files found')

if (failures.length > 0) {
  console.error(`Delivery check failed with ${failures.length} violation(s):`)
  failures.forEach((failure) => console.error(`  - ${failure}`))
  process.exit(1)
}

console.log(
  `Delivery check passed for ${htmlFiles.length} ${deploymentEnvironment} HTML file(s) and ` +
    `${variantCount} generated image variant(s): robots policy, image dimensions, and ` +
    `variant payloads are valid.`,
)
