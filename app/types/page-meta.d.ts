declare module '#app' {
  interface PageMeta {
    headerSticky?: boolean
  }
}

declare module 'vue-router' {
  interface RouteMeta {
    headerSticky?: boolean
  }
}

export {}
