/**
 * Adopts a prerendered route's payload into `nuxtApp.static.data` when its link is
 * prefetched, instead of waiting for the navigation that consumes it.
 *
 * Why this exists: @nuxtjs/i18n flips `locale` from a global route middleware, and Nuxt
 * runs middleware (`router.beforeEach`) before the built-in `nuxt:payload` plugin's
 * `beforeResolve` hook fills `static.data` for the incoming route. Every `useApi()` key
 * carries the locale, so the instant the middleware flips it `useAsyncData` looks up the
 * new key, finds no cached value, and issues a live request - on a fully prerendered site
 * whose answer was already sitting in `/en/products/_payload.json`.
 *
 * NuxtLink prefetches on visibility and the language switcher lives in the header, so by
 * the time it is clicked the target payload has been adopted and the key switch resolves
 * from cache: no request, and no window in which the previous language can render.
 *
 * A no-op wherever `loadPayload()` returns nothing - `nuxt dev`, and any route that was
 * not prerendered. `useApi()` clears the carried-over data for those.
 */
export default defineNuxtPlugin({
  name: 'vitadiet:locale-payload',
  setup(nuxtApp) {
    nuxtApp.hooks.hook('link:prefetch', async (url) => {
      if (new URL(url, window.location.href).origin !== window.location.origin) return

      const payload = await loadPayload(url).catch(() => null)
      if (!payload?.data) return

      for (const key in payload.data) {
        // `??=`, not assignment: `nuxt:payload` tracks the keys it introduced so it can
        // purge them on the next navigation, and overwriting one it is holding would
        // swap data out from under the route currently on screen.
        nuxtApp.static.data[key] ??= payload.data[key]
      }
    })
  },
})
