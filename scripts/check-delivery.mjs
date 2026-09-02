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
  /** The static error document and the route it is built from are never indexable. */
  const isErrorDocument = fileName === '404.html' || /^(?:en\/)?404\/index\.html$/.test(fileName)

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

  // The sitemap shells are prerendered by the module and cannot be removed, so the rule
  // is that they must at least be unindexable rather than simply exempt from the check.
  if (isGeneratedSitemapShell) {
    const isRedirectStub = /<meta\s+http-equiv="refresh"/i.test(html)
    if (!isRedirectStub && !robots?.includes('noindex')) {
      failures.push(
        `${fileName}: sitemap shell must be noindex, found ${JSON.stringify(robots)} - check the ` +
          `routeRules entry for it in nuxt.config.ts`,
      )
    }
    continue
  }

  // Checked before the environment split: an error document is unindexable on every host,
  // and it carries its own page-level rule rather than the site-wide directive.
  if (isErrorDocument) {
    if (!robots?.includes('noindex')) {
      failures.push(
        `${fileName}: the error document must be noindex, found ${JSON.stringify(robots)}`,
      )
    }
  } else if (deploymentEnvironment === 'development') {
    if (robots !== NO_INDEX) {
      failures.push(`${fileName}: robots must be "${NO_INDEX}", found ${JSON.stringify(robots)}`)
    }
    if (googlebot !== NO_INDEX) {
      failures.push(
        `${fileName}: googlebot must be "${NO_INDEX}", found ${JSON.stringify(googlebot)}`,
      )
    }
  } else {
    if (!robots || robots.includes('noindex')) {
      failures.push(
        `production ${fileName}: robots must remain indexable, found ${JSON.stringify(robots)}`,
      )
    }
    if (googlebot?.includes('noindex')) {
      failures.push(`production ${fileName}: googlebot unexpectedly contains noindex`)
    }
  }
}

/*
 * The static error document must carry its content in the markup. Nitro's own 404.html is
 * an empty SPA shell, so a visitor with JavaScript disabled saw a blank page; scripts/
 * build-404.mjs replaces it with the prerendered /404 render. Assert the replacement
 * actually happened rather than trusting the build order.
 */
try {
  const errorDocument = await readFile(join(PUBLIC_DIR, '404.html'), 'utf8')
  if (!/<h1[\s>]/i.test(errorDocument)) {
    failures.push(
      '404.html has no <h1>: it is still the empty SPA shell, so a visitor with JavaScript ' +
        'disabled would get a blank page. Run scripts/build-404.mjs after the build.',
    )
  }
} catch {
  failures.push('404.html is missing; ErrorDocument 404 in public/.htaccess would have no target')
}

/*
 * The Apache contract.
 *
 * A previous revision only checked that the file mentioned X-Robots-Tag somewhere. That
 * passed a rewritten .htaccess that had lost every redirect and applied the noindex
 * header unconditionally - a build that would have de-indexed production and 404'd every
 * withdrawn and legacy URL. Presence of a string is not the contract; each clause is.
 */
const htaccess = await readFile('public/.htaccess', 'utf8')

/** Comments are documentation, not directives, and must never satisfy a clause. */
const htaccessDirectives = htaccess
  .split('\n')
  .filter((line) => !line.trimStart().startsWith('#'))
  .join('\n')

const REQUIRED_HTACCESS_CLAUSES = [
  {
    // Without the env= guard the header applies to www.vitadiet.sa too, and Google drops
    // the whole site regardless of what the <meta name="robots"> tags say.
    pattern: new RegExp(
      `^\\s*Header\\s+set\\s+X-Robots-Tag\\s+"${NO_INDEX}"\\s+env=noindex_non_production\\s*$`,
      'm',
    ),
    description: `host-conditional X-Robots-Tag "${NO_INDEX}" (must carry env=noindex_non_production)`,
  },
  {
    pattern: /^\s*SetEnvIfNoCase\s+Host\s+.*noindex_non_production\s*$/m,
    description: 'SetEnvIfNoCase Host rule that sets noindex_non_production off production hosts',
  },
  {
    pattern: /<FilesMatch\s+"\^partner-lead\\\.php\$">/,
    description: 'FilesMatch block for partner-lead.php',
  },
  {
    pattern: /Cache-Control\s+"no-store"/,
    description: 'Cache-Control "no-store" on the partnership form handler',
  },
  { pattern: /^\s*ErrorDocument\s+404\s+\/404\.html\s*$/m, description: 'ErrorDocument 404' },
  { pattern: /^\s*RewriteEngine\s+On\s*$/m, description: 'RewriteEngine On' },
  {
    pattern: /RewriteRule\s+\^\(\?:ar\/\)\?en\/product\/\(\?:floradit\|flowadite\)/,
    description: '301 for the withdrawn /en/product/floradit and /flowadite URLs',
  },
  {
    pattern: /RewriteRule\s+\^\(\?:ar\/\)\?product\/\(\?:floradit\|flowadite\)/,
    description: '301 for the withdrawn /product/floradit and /flowadite URLs',
  },
  { pattern: /RewriteRule\s+\^ar\/\?\$/, description: '301 for the legacy /ar/ root' },
  { pattern: /RewriteRule\s+\^ar\/\(\.\+\)\$/, description: '301 for legacy /ar/* URLs' },
  {
    pattern: /RewriteCond\s+%\{REQUEST_FILENAME\}\s+-d/,
    description: 'trailing-slash 301 for directory requests',
  },
  {
    pattern: /RewriteCond\s+%\{HTTP_HOST\}\s+\^vitadiet\\\.sa\$/,
    description: 'bare-domain to www 301',
  },
  { pattern: /RewriteCond\s+%\{HTTPS\}\s+!=on/, description: 'force-HTTPS 301' },
]

for (const clause of REQUIRED_HTACCESS_CLAUSES) {
  if (!clause.pattern.test(htaccessDirectives)) {
    failures.push(`public/.htaccess is missing its ${clause.description}`)
  }
}

/*
 * An unguarded noindex header would override every page's indexable meta tag on
 * production. It is legitimate in exactly one place: the <FilesMatch> block around
 * partner-lead.php, which is a transport and must never be indexed on any host. Depth is
 * tracked rather than pattern-matching the line, so the exemption cannot be borrowed by a
 * header that merely looks similar.
 */
let filesMatchDepth = 0
for (const line of htaccessDirectives.split('\n')) {
  if (/<FilesMatch\b/i.test(line)) filesMatchDepth++
  else if (/<\/FilesMatch>/i.test(line)) filesMatchDepth--

  const isNoIndexHeader = /Header\s+(?:always\s+)?set\s+X-Robots-Tag\s+"noindex/i.test(line)
  const isGuarded = /env=noindex_non_production/.test(line)
  if (isNoIndexHeader && !isGuarded && filesMatchDepth === 0) {
    failures.push(
      `public/.htaccess sets X-Robots-Tag with no env= guard outside a FilesMatch block, ` +
        `which would de-index production: ${line.trim()}`,
    )
  }
}

// The uploaded file is the one in .output/public, so a stale or hand-edited copy there is
// what production would actually get.
try {
  const shipped = await readFile(join(PUBLIC_DIR, '.htaccess'), 'utf8')
  if (shipped.replace(/\r\n/g, '\n') !== htaccess.replace(/\r\n/g, '\n')) {
    failures.push(
      `${PUBLIC_DIR}/.htaccess differs from public/.htaccess - the deployed rules are not the reviewed ones`,
    )
  }
} catch {
  failures.push(`${PUBLIC_DIR}/.htaccess is missing; Apache would lose every redirect`)
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
