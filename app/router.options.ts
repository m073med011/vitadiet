import type { RouterConfig } from "@nuxt/schema";

export default <RouterConfig>{
  scrollBehavior(to, from, savedPosition) {
    const stripLocale = (name?: string | null | symbol) =>
      name?.toString().replace(/___[a-z]{2}(-[A-Z]{2})?$/, "") ?? "";

    // Back/forward — restore saved position
    if (savedPosition) {
      return savedPosition;
    }

    // Page reload — let browser restore scroll position
    if (!from.name) {
      return false;
    }

    const toBase = stripLocale(to.name);
    const fromBase = stripLocale(from.name);

    if (toBase === fromBase) {
      // Same page, locale changed — preserve scroll
      return false;
    }

    // Never scroll to top automatically
    return false;
  },
};