/**
 * Regression guard for the Schema.org graph emitted into prerendered HTML.
 *
 * Run after `nuxt build` or `nuxt generate`:
 *   node scripts/check-schema-org.mjs
 */
import { readFile, readdir } from 'node:fs/promises'
import { join, relative } from 'node:path'

const PUBLIC_DIR = process.argv[2] || '.output/public'

const SITE_ROOT = 'https://www.vitadiet.sa/'
const WEBSITE_ID = `${SITE_ROOT}#website`
const ORGANIZATION_ID = `${SITE_ROOT}#organization`
const LOGO_ID = `${SITE_ROOT}#logo`

const HTML_EXTENSION = '.html'
const SCRIPT_RE = /<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi
const JSON_LD_TYPE_RE =
  /\btype\s*=\s*(?:"application\/ld\+json"|'application\/ld\+json'|application\/ld\+json(?:\s|$))/i

const failures = []

const fail = (file, message) => {
  failures.push(`${relative(PUBLIC_DIR, file).replaceAll('\\', '/')}: ${message}`)
}

const collectHtmlFiles = async (dir) => {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = await Promise.all(
    entries.map((entry) => {
      const path = join(dir, entry.name)
      if (entry.isDirectory()) return collectHtmlFiles(path)
      return entry.isFile() && entry.name.endsWith(HTML_EXTENSION) ? [path] : []
    }),
  )
  return files.flat()
}

const hasType = (node, type) => {
  const types = Array.isArray(node?.['@type']) ? node['@type'] : [node?.['@type']]
  return types.includes(type)
}

const isReferenceTo = (value, id) =>
  Boolean(value && !Array.isArray(value) && typeof value === 'object' && value['@id'] === id)

const collectGraphs = (value, graphs = []) => {
  if (Array.isArray(value)) {
    for (const item of value) collectGraphs(item, graphs)
    return graphs
  }

  if (!value || typeof value !== 'object') return graphs

  if (Array.isArray(value['@graph'])) graphs.push(value['@graph'])
  for (const [key, child] of Object.entries(value)) {
    if (key !== '@graph') collectGraphs(child, graphs)
  }
  return graphs
}

const inspectForbiddenValues = (file, value, location = '$') => {
  if (typeof value === 'string') {
    if (value.includes('/en/#website')) {
      fail(file, `${location} contains the locale-specific Website ID ${JSON.stringify(value)}`)
    }
    if (value.includes('#identity')) {
      fail(file, `${location} contains the retired #identity ID ${JSON.stringify(value)}`)
    }
    if (value.endsWith('#website') && value !== WEBSITE_ID) {
      fail(file, `${location} references a non-canonical Website ID ${JSON.stringify(value)}`)
    }
    return
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) => inspectForbiddenValues(file, item, `${location}[${index}]`))
    return
  }

  if (!value || typeof value !== 'object') return

  for (const [key, child] of Object.entries(value)) {
    if (key === 'translationOfWork' || key === 'workTranslation') {
      fail(file, `${location}.${key} must not be emitted`)
    }
    inspectForbiddenValues(file, child, `${location}.${key}`)
  }
}

const assertSingleRootNode = (file, nodes, type, id) => {
  const typedNodes = nodes.filter((node) => hasType(node, type))
  if (typedNodes.length !== 1) {
    fail(file, `expected exactly one ${type} node, found ${typedNodes.length}`)
    return null
  }

  if (typedNodes[0]['@id'] !== id) {
    fail(file, `${type}.@id must be ${id}, found ${JSON.stringify(typedNodes[0]['@id'])}`)
  }

  const nodesAtId = nodes.filter((node) => node?.['@id'] === id)
  if (nodesAtId.length !== 1) {
    fail(file, `expected exactly one graph node at ${id}, found ${nodesAtId.length}`)
  }

  return typedNodes[0]
}

let schemaPageCount = 0
let graphCount = 0
let nodeCount = 0
let productCount = 0

let htmlFiles
try {
  htmlFiles = await collectHtmlFiles(PUBLIC_DIR)
} catch {
  console.error(`Schema.org output directory not found: ${PUBLIC_DIR}. Run the build first.`)
  process.exit(1)
}

const htmlCount = htmlFiles.length

for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8')
  const parsedJsonLd = []

  for (const match of html.matchAll(SCRIPT_RE)) {
    const [, attributes, source] = match
    if (!JSON_LD_TYPE_RE.test(attributes)) continue

    try {
      parsedJsonLd.push(JSON.parse(source))
    } catch (error) {
      fail(file, `contains invalid JSON-LD: ${error.message}`)
    }
  }

  const graphs = parsedJsonLd.flatMap((value) => collectGraphs(value))
  if (graphs.length === 0) continue

  schemaPageCount += 1
  graphCount += graphs.length
  parsedJsonLd.forEach((value, index) => inspectForbiddenValues(file, value, `$jsonLd[${index}]`))

  const nodes = graphs.flat()
  nodeCount += nodes.length

  for (const [index, node] of nodes.entries()) {
    if (!node || Array.isArray(node) || typeof node !== 'object') {
      fail(file, `@graph[${index}] is not a Schema.org node object`)
    }
  }

  const objectNodes = nodes.filter(
    (node) => node && !Array.isArray(node) && typeof node === 'object',
  )
  const website = assertSingleRootNode(file, objectNodes, 'WebSite', WEBSITE_ID)
  const organization = assertSingleRootNode(file, objectNodes, 'Organization', ORGANIZATION_ID)

  if (website && !isReferenceTo(website.publisher, ORGANIZATION_ID)) {
    fail(file, `WebSite.publisher must reference ${ORGANIZATION_ID}`)
  }

  const webPages = objectNodes.filter((node) => hasType(node, 'WebPage'))
  if (webPages.length === 0) fail(file, 'expected at least one WebPage node')
  for (const webPage of webPages) {
    const label = `WebPage ${webPage['@id'] || '(without @id)'}`
    if (!isReferenceTo(webPage.isPartOf, WEBSITE_ID)) {
      fail(file, `${label}.isPartOf must reference ${WEBSITE_ID}`)
    }
    if (!isReferenceTo(webPage.about, ORGANIZATION_ID)) {
      fail(file, `${label}.about must reference ${ORGANIZATION_ID}`)
    }
  }

  if (organization) {
    if (!isReferenceTo(organization.logo, LOGO_ID)) {
      fail(file, `Organization.logo must reference ${LOGO_ID}`)
    }
    if (typeof organization.email !== 'string' || organization.email.trim() === '') {
      fail(file, 'Organization.email must be a non-empty string')
    }
    if (typeof organization.telephone !== 'string' || organization.telephone.trim() === '') {
      fail(file, 'Organization.telephone must be a non-empty string')
    }
    if (
      !organization.address ||
      Array.isArray(organization.address) ||
      typeof organization.address !== 'object'
    ) {
      fail(file, 'Organization.address must be an object')
    }
  }

  const logoNodes = objectNodes.filter((node) => node['@id'] === LOGO_ID)
  if (logoNodes.length !== 1) {
    fail(file, `expected exactly one Logo node at ${LOGO_ID}, found ${logoNodes.length}`)
  } else {
    const logo = logoNodes[0]
    if (!hasType(logo, 'ImageObject')) fail(file, `Logo node ${LOGO_ID} must be an ImageObject`)
    if (!logo.url && !logo.contentUrl)
      fail(file, `Logo node ${LOGO_ID} must have url or contentUrl`)
  }

  const products = objectNodes.filter((node) => hasType(node, 'Product'))
  productCount += products.length
  for (const product of products) {
    if (!isReferenceTo(product.brand, ORGANIZATION_ID)) {
      fail(
        file,
        `Product ${product['@id'] || '(without @id)'}.brand must reference ${ORGANIZATION_ID}`,
      )
    }
  }
}

if (htmlCount === 0) failures.push(`${PUBLIC_DIR}: no generated HTML files found`)
if (schemaPageCount === 0)
  failures.push(`${PUBLIC_DIR}: no generated HTML containing a Schema.org @graph found`)
if (productCount === 0)
  failures.push(`${PUBLIC_DIR}: no Product nodes found; Product.brand was not exercised`)

if (failures.length > 0) {
  console.error(`\nSchema.org regression check failed with ${failures.length} violation(s):\n`)
  failures.forEach((failure) => console.error(`  - ${failure}`))
  console.error('')
  process.exit(1)
}

console.log(
  `Schema.org regression check passed for ${schemaPageCount} page(s), ${graphCount} graph(s), ` +
    `${nodeCount} node(s), and ${productCount} Product node(s).`,
)
