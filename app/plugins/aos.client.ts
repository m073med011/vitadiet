import AOS from "aos";

export default defineNuxtPlugin((nuxtApp) => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const refreshAos = () => {
    if (prefersReducedMotion.matches) {
      return;
    }

    window.requestAnimationFrame(() => {
      AOS.refreshHard();
    });
  };

  nuxtApp.hook("app:mounted", () => {
    if (prefersReducedMotion.matches) {
      return;
    }

    AOS.init({
      anchorPlacement: "top-bottom",
      duration: 650,
      easing: "ease-out-cubic",
      offset: 72,
      once: false,
      mirror: true,
    });
  });

  nuxtApp.hook("page:finish", refreshAos);
});
