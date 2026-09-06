import type { MaybeRefOrGetter, Ref, WatchSource } from 'vue'
import type { AsyncDataOptions, AsyncDataRequestStatus } from 'nuxt/app'
import type { FetchOptions } from 'ofetch'
import type { ApiCollection } from '#shared/api'

export type ApiMethod = 'get' | 'post' | 'put' | 'patch' | 'delete'

export type ApiQuery = Record<string, string | number | boolean | undefined | null>

/**
 * The parameter every Dashboard endpoint accepts. It is attached by the client rather
 * than by each caller, so no page can ship a request that silently returns the default
 * locale's copy.
 */
export const API_LOCALE_PARAM = 'lang'

/** Endpoints are written as `products` or `products/becalme`; a stray leading slash
 * would otherwise resolve against the host root and drop the `/api/v1` segment. */
const normalizeRoute = (route: string): string => route.replace(/^\/+/, '')

/**
 * The configured `$fetch` for the Dashboard API: base URL from runtime config, JSON
 * headers, and the current UI locale on every request.
 *
 * Use this for calls that are not page data - form submissions, and anything triggered
 * by a user action. For data a page renders, use `useApi()` instead so the request is
 * de-duplicated, resolved during SSR and serialised into the payload.
 */
export const useApiFetch = () => {
  const { locale } = useI18n()
  const { apiBaseUrl } = useRuntimeConfig().public

  return $fetch.create({
    baseURL: apiBaseUrl,
    headers: { accept: 'application/json' },
    onRequest({ options }) {
      // Spread last: an explicit `lang` from the caller still wins.
      options.query = { [API_LOCALE_PARAM]: locale.value, ...options.query }
    },
  })
}

export type ApiFetch = ReturnType<typeof useApiFetch>

/**
 * Drops the previous locale's response when a locale switch has started a new request.
 *
 * When an async-data key changes, Nuxt seeds the new key with the old key's value so a
 * changing key does not flash an empty state, then refetches
 * (`node_modules/nuxt/dist/app/composables/asyncData.js`, the `isKeyReactive` watcher).
 * Every key here ends in the locale, so that seed is the copy in the language the visitor
 * just left, and it stays on screen for the length of the request. That is the flash of
 * Arabic under an English header and back again.
 *
 * Only when the request actually went out. A prerendered payload - see
 * `app/plugins/locale-payload.client.ts` - resolves the new key synchronously and leaves
 * `status` at `success`; clearing that would throw away the right answer.
 *
 * The watcher is registered after `useAsyncData`'s own key watcher and shares its
 * `sync` flush, so it runs immediately afterwards, within the same tick as the switch:
 * the stale value is never painted.
 */
export const dropStaleLocaleData = <DataT>(
  asyncData: { data: Ref<DataT>; status: Ref<AsyncDataRequestStatus> },
  locale: WatchSource<string>,
  makeDefault?: () => unknown,
) => {
  if (import.meta.server) return

  watch(
    locale,
    () => {
      if (asyncData.status.value !== 'pending') return
      asyncData.data.value = makeDefault?.() as DataT
    },
    { flush: 'sync' },
  )
}

export type UseApiOptions<ResT, DataT = ResT> = AsyncDataOptions<ResT, DataT> & {
  /** Payload key. Defaults to method + route + locale, which is what makes two
   *  components asking for the same endpoint share one request. */
  key?: string
  query?: MaybeRefOrGetter<ApiQuery | undefined>
  body?: MaybeRefOrGetter<FetchOptions['body']>
  headers?: Record<string, string>
  /** Extra reactive sources that should trigger a refetch. The locale is always one. */
  watch?: WatchSource[] | false
}

/**
 * The single read path for Dashboard data.
 *
 *   const { data, status, error } = await useApi<ApiResource<ApiProduct>>('products/becalme')
 *   const { data } = await useApi<ApiResource<ApiProduct>>(() => `products/${slug.value}`)
 *
 * Only the route and (for anything but a read) the method are required: the base URL,
 * the `lang` parameter, the payload key and the locale watcher are all supplied here.
 * Callers must `await` it - without that the server renders the empty state and the
 * client then hydrates over different markup.
 *
 * A paginated list endpoint returns one page through here. To read all of them, pair
 * `useApiFetch()` with `fetchApiCollection()` below, as `useProductCatalog()` does.
 */
export function useApi<ResT, DataT = ResT>(
  route: MaybeRefOrGetter<string>,
  method: ApiMethod = 'get',
  options: UseApiOptions<ResT, DataT> = {},
) {
  const { locale } = useI18n()
  const apiFetch = useApiFetch()
  const { key, query, body, headers, watch, ...asyncDataOptions } = options

  /**
   * The cast undoes `$fetch`'s route-table lookup: it types a bare string request as an
   * internal Nitro route and returns that route's response type instead of `ResT`. These
   * routes are external, so the caller's generic is the only description of the body.
   */
  const request = () =>
    apiFetch<ResT>(normalizeRoute(toValue(route)), {
      method,
      query: toValue(query),
      body: toValue(body),
      headers,
    }) as Promise<ResT>

  // A getter, not a string. A route built from a route param changes without the
  // component remounting, and a key fixed at setup would then hand the next product the
  // previous one's payload.
  const resolvedKey = () => key ?? `api:${method}:${normalizeRoute(toValue(route))}:${locale.value}`

  const extraWatchSources = watch === false ? [] : (watch ?? [])

  const asyncData = useAsyncData<ResT, unknown, DataT>(resolvedKey, request, {
    // The locale is deliberately not watched: it is already part of the key, and a
    // changing key refetches on its own. Watching it too would only queue a second
    // trigger for the same switch.
    watch: extraWatchSources.length ? extraWatchSources : false,
    ...asyncDataOptions,
  } as AsyncDataOptions<ResT, DataT>)

  dropStaleLocaleData(asyncData, locale, asyncDataOptions.default)

  return asyncData
}

/**
 * A stop on the page walk below. Laravel's default `per_page` is 15, so a catalog of
 * sixteen products would otherwise silently render as fifteen - and a `links.next` that
 * never turned null would spin forever.
 */
const MAX_COLLECTION_PAGES = 25

/**
 * Every page of a paginated endpoint, flattened, followed through `links.next`.
 *
 * The `next` URL is absolute, and ofetch leaves an absolute request untouched by
 * `baseURL` while still applying the `lang` parameter from `useApiFetch()`, so each
 * page is requested in the locale the first one was.
 */
export const fetchApiCollection = async <Item>(
  apiFetch: ApiFetch,
  route: string,
  query?: ApiQuery,
): Promise<Item[]> => {
  const items: Item[] = []
  let next: string | null = normalizeRoute(route)

  for (let page = 0; next && page < MAX_COLLECTION_PAGES; page += 1) {
    const response = (await apiFetch<ApiCollection<Item>>(next, {
      // Caller-supplied filters belong to the first request; `links.next` already
      // carries them forward.
      query: page === 0 ? query : undefined,
    })) as ApiCollection<Item>

    items.push(...(response.data ?? []))
    next = response.links?.next ?? null
  }

  return items
}
