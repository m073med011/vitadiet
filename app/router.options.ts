import type { RouterConfig } from "@nuxt/schema";

const normalizePath = (path: string) => path.replace(/\/$/, "") || "/";

const getMotionBehavior = () => {
  if (typeof window === "undefined") {
    return "auto";
  }

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
};

const getHeaderOffset = () => {
  if (typeof document === "undefined") {
    return 96;
  }

  const headerHeight = document.querySelector<HTMLElement>(".site-header")?.offsetHeight ?? 72;

  return headerHeight + 18;
};

const scrollToSection = (hash: string) =>
  new Promise<ReturnType<NonNullable<RouterConfig["scrollBehavior"]>>>((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }

    window.setTimeout(() => {
      resolve({
        el: hash,
        top: getHeaderOffset(),
        behavior: getMotionBehavior(),
      });
    }, 80);
  });

export default <RouterConfig>{
  scrollBehavior(to, from, savedPosition) {
    const stripLocale = (name?: string | null | symbol) =>
      name?.toString().replace(/___[a-z]{2}(-[A-Z]{2})?$/, "") ?? "";

    if (savedPosition) {
      return savedPosition;
    }

    const toBase = stripLocale(to.name);
    const fromBase = stripLocale(from.name);
    const sameRoute = toBase === fromBase;
    const samePath = normalizePath(to.path) === normalizePath(from.path);

    // Same page, locale changed: preserve the visitor's reading position.
    if (sameRoute && !samePath) {
      return false;
    }

    if (to.hash) {
      return scrollToSection(to.hash);
    }

    // Page reload without an anchor: let the browser restore scroll position.
    if (!from.name) {
      return false;
    }

    // Header "Home" links should ease back to the top from an anchored section.
    if (sameRoute && samePath && from.hash && !to.hash) {
      return {
        top: 0,
        behavior: getMotionBehavior(),
      };
    }

    if (toBase === "index" && !to.hash) {
      return {
        top: 0,
        behavior: getMotionBehavior(),
      };
    }

    return {
      top: 0,
      behavior: getMotionBehavior(),
    };
  },
};
