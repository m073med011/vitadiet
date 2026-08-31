import { getQualityPillars, localizeQualityPillar } from '~/services/site-content'
import type { LocalizedQualityPillar } from '~/services/site-content'

/**
 * The one quality-content read for the whole app. Every consumer shares the
 * `quality-pillars` key, so the list resolves once during prerender and is reused from
 * the payload on the client instead of being re-resolved per section.
 *
 * Callers must `await` it: without that the server would render the empty default and
 * the client would hydrate over different markup.
 *
 * Every other composable is called BEFORE the await. Only `<script setup>` restores the
 * Nuxt instance across a top-level await; inside a plain async function it is gone, and
 * a `useI18n()` placed after the await throws during prerender.
 */
export const useQualityPillars = async () => {
  const { locale } = useI18n()

  const {
    data,
    error,
    status: requestStatus,
  } = await useAsyncData('quality-pillars', () => getQualityPillars(), { default: () => [] })

  const pillars = computed<LocalizedQualityPillar[]>(() =>
    (data.value ?? []).map((pillar) => localizeQualityPillar(pillar, locale.value)),
  )

  const isLoading = computed(() => requestStatus.value === 'pending')
  // An empty list is a content failure too: the section has nothing to show and must say
  // so rather than render an empty grid.
  const hasFailed = computed(
    () => Boolean(error.value) || (!isLoading.value && pillars.value.length === 0),
  )

  return { hasFailed, isLoading, pillars }
}
