export function useSiteUrls() {
  const siteUrl = useSiteConfig().url
  const route = useRoute()

  const absoluteSiteUrl = (path: string) => new URL(path, siteUrl).toString()
  const canonicalUrl = computed(() => absoluteSiteUrl(route.fullPath))

  const withNormalizedHref = <T extends { href?: string }>(links: T[]): T[] =>
    links.map((link) =>
      link.href?.startsWith('http') ? { ...link, href: new URL(link.href).toString() } : link,
    )

  return {
    siteUrl,
    absoluteSiteUrl,
    canonicalUrl,
    withNormalizedHref,
  }
}
