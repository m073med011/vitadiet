/**
 * Strips a trailing slash from a path, defaulting bare `/` for empty results.
 * Shared between router.options.ts and AppHeader's active-link detection.
 */
export const normalizePath = (path: string): string =>
  path.replace(/\/$/, '') || '/'
