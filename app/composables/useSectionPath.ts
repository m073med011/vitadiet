/**
 * Composable that builds a localized path with an optional hash anchor.
 * Eliminates the duplicated `sectionPath` helper found across components.
 */
export const useSectionPath = () => {
  const localePath = useLocalePath()
  const sectionPath = (hash: string) => `${localePath('/')}${hash}`
  return { sectionPath }
}
