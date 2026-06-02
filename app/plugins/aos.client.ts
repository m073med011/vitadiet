import AOS from "aos";

export default defineNuxtPlugin((nuxtApp) => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let refreshFrame: number | undefined

  const refreshAos = () => {
    if (prefersReducedMotion.matches) {
      return;
    }

    if (refreshFrame) {
      window.cancelAnimationFrame(refreshFrame);
    }

    refreshFrame = window.requestAnimationFrame(() => {
      AOS.refresh();
      refreshFrame = undefined;
    });
  };

  nuxtApp.hook("app:mounted", () => {
    if (prefersReducedMotion.matches) {
      return;
    }

    AOS.init({
      anchorPlacement: "top-bottom",
      duration: 450,
      easing: "ease-out-cubic",
      offset: 48,
      once: true,
      mirror: false,
    });
  });

  nuxtApp.hook("page:finish", refreshAos);
});
