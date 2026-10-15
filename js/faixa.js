document.addEventListener("DOMContentLoaded", () => {
  if (typeof window.Swiper !== "function") return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.querySelectorAll(".area-banner .swiper").forEach((el) => {
    if (el.swiper) return;
    const root = el.closest(".area-banner");
    new window.Swiper(el, {
      loop: true,
      speed: reduceMotion ? 0 : 700,
      autoplay: reduceMotion
        ? false
        : { delay: 5000, disableOnInteraction: false },
      navigation: {
        prevEl: root.querySelector(".area-banner__prev"),
        nextEl: root.querySelector(".area-banner__next"),
      },
      pagination: {
        el: root.querySelector(".area-banner__dots"),
        clickable: true,
      },
    });
  });
});
