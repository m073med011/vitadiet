export const useSectionPath = () => {
  const localePath = useLocalePath()
  const sectionPath = (hash: string) => `${localePath('/')}${hash}`
  return { sectionPath }
}
