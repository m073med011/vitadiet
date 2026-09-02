/**
 * Give Apache a static 404 document that has a body.
 *
 * `ErrorDocument 404 /404.html` in public/.htaccess points at a file nitro writes as an
 * empty SPA shell (`<div id="__nuxt"></div>`, `data-ssr="false"`). With JavaScript
 * enabled the client boots and renders `app/error.vue`; with it disabled the visitor gets
 * a blank white page, which fails the "JavaScript Disabled fallback" requirement.
 *
 * `app/pages/404.vue` is prerendered for that reason. This step copies its default-locale
 * render over 404.html, so the error document ships with its content in the markup.
 *
 * The stale pre-compressed twins are removed rather than rebuilt: Apache does not serve
 * them without content-negotiation rules the site's .htaccess deliberately does not have,
 * and leaving a `.gz` whose contents no longer match the `.html` is a trap.
 */
import { copyFile, rm, stat } from 'node:fs/promises'
import { join } from 'node:path'
import process from 'node:process'

const PUBLIC_DIR = '.output/public'
const SOURCE = join(PUBLIC_DIR, '404', 'index.html')
const TARGET = join(PUBLIC_DIR, '404.html')

/** Below this the file is a shell, not a rendered page - the bug this step exists to fix. */
const MIN_RENDERED_BYTES = 8000

let sourceSize
try {
  ;({ size: sourceSize } = await stat(SOURCE))
} catch {
  console.error(
    `Cannot build the static error document: ${SOURCE} was not generated.\n` +
      `Check that "/404" is still listed in nitro.prerender.routes and that ` +
      `app/pages/404.vue exists.`,
  )
  process.exit(1)
}

if (sourceSize < MIN_RENDERED_BYTES) {
  console.error(
    `${SOURCE} is only ${sourceSize} bytes, which means it was not server-rendered. ` +
      `Copying it would reintroduce the blank 404 page.`,
  )
  process.exit(1)
}

await copyFile(SOURCE, TARGET)

for (const stale of [`${TARGET}.gz`, `${TARGET}.br`]) {
  await rm(stale, { force: true })
}

console.log(`Static error document built: 404.html now carries ${sourceSize} bytes of markup.`)
