/**
 * WCAG AA contrast guard for the design tokens.
 *
 * Colour choices drift: a token gets nudged to look nicer on a hero and quietly drops a
 * caption below 4.5:1 somewhere else. This reads the real values out of
 * `app/assets/css/_tokens.css` and fails the build on any pair that stops meeting the
 * level it is used at, so a regression is caught before it ships rather than in an audit.
 *
 * Run on its own with: npm run test:contrast
 */
import { readFileSync } from 'node:fs'
import process from 'node:process'

const TOKENS_FILE = 'app/assets/css/_tokens.css'

const source = readFileSync(TOKENS_FILE, 'utf8')

/** Every `--color-*: #rrggbb;` declaration in the theme block. */
const tokens = new Map()
for (const match of source.matchAll(/--(color-[a-z0-9-]+):\s*(#[0-9a-fA-F]{6})\s*;/g)) {
  tokens.set(match[1], match[2].toLowerCase())
}

const channels = (hex) =>
  [1, 3, 5].map((index) => Number.parseInt(hex.slice(index, index + 2), 16) / 255)

const linearise = (channel) =>
  channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4

const luminance = (hex) => {
  const [r, g, b] = channels(hex).map(linearise)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

const contrast = (a, b) => {
  const [high, low] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (high + 0.05) / (low + 0.05)
}

/**
 * `level` is what the pair is actually used for:
 *   text  - body copy and small print, WCAG 1.4.3 AA, 4.5:1
 *   large - >=24px or >=19px bold headings, WCAG 1.4.3 AA, 3:1
 *   ui    - icons, control borders, and other non-text, WCAG 1.4.11, 3:1
 */
const MINIMUM = { text: 4.5, large: 3, ui: 3 }

const PAIRS = [
  ['color-ink', 'color-surface', 'text'],
  ['color-ink', 'color-surface-raised', 'text'],
  ['color-ink', 'color-surface-muted', 'text'],
  ['color-ink', 'color-brand-primary-soft', 'text'],
  ['color-ink', 'color-brand-accent-soft', 'text'],
  ['color-ink', 'color-danger-soft', 'text'],
  ['color-ink', 'color-success-soft', 'text'],
  ['color-ink-soft', 'color-surface', 'text'],
  ['color-ink-soft', 'color-surface-raised', 'text'],
  ['color-ink-soft', 'color-surface-muted', 'text'],
  ['color-ink-soft', 'color-brand-primary-soft', 'text'],
  // Small print and input placeholders.
  ['color-ink-subtle', 'color-surface', 'text'],
  ['color-ink-subtle', 'color-surface-raised', 'text'],
  ['color-brand-primary', 'color-surface', 'text'],
  ['color-brand-primary', 'color-surface-raised', 'text'],
  ['color-brand-primary', 'color-brand-primary-soft', 'text'],
  ['color-danger', 'color-surface', 'text'],
  ['color-danger', 'color-surface-raised', 'text'],
  ['color-danger', 'color-danger-soft', 'text'],
  ['color-success', 'color-surface', 'text'],
  ['color-success', 'color-success-soft', 'text'],
  // Button and badge fills.
  ['color-on-primary', 'color-brand-primary', 'text'],
  ['color-on-primary', 'color-brand-dark', 'text'],
  ['color-surface', 'color-brand-primary', 'text'],
  // Control borders and icon-only affordances.
  ['color-line-strong', 'color-surface', 'ui'],
  ['color-line-strong', 'color-surface-raised', 'ui'],
]

const failures = []
const missing = []

for (const [foreground, background, level] of PAIRS) {
  const foregroundValue = tokens.get(foreground)
  const backgroundValue = tokens.get(background)

  if (!foregroundValue || !backgroundValue) {
    missing.push(`${foreground} on ${background}`)
    continue
  }

  const ratio = contrast(foregroundValue, backgroundValue)
  if (ratio < MINIMUM[level]) {
    failures.push(
      `${foreground} (${foregroundValue}) on ${background} (${backgroundValue}): ` +
        `${ratio.toFixed(2)}:1, needs ${MINIMUM[level]}:1 for ${level}`,
    )
  }
}

if (missing.length) {
  console.error(`Unknown colour token in a contrast pair (check ${TOKENS_FILE}):`)
  for (const pair of missing) console.error(`  - ${pair}`)
  process.exit(1)
}

if (failures.length) {
  console.error(`\nWCAG AA contrast check failed with ${failures.length} violation(s):\n`)
  for (const failure of failures) console.error(`  - ${failure}`)
  console.error('')
  process.exit(1)
}

console.log(`Contrast ok (${PAIRS.length} token pairs meet WCAG AA).`)
