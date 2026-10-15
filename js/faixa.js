function strikeGavel() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const gavel = document.querySelector(".navbar-brand .icon-gavel");
  if (!gavel) return;
  gavel.classList.remove("is-striking");
  void gavel.offsetWidth;
  gavel.classList.add("is-striking");
}

document.addEventListener("DOMContentLoaded", strikeGavel);
window.addEventListener("pageshow", strikeGavel);

document.addEventListener("click", (event) => {
  if (event.defaultPrevented || event.button !== 0) return;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (typeof document.startViewTransition === "function") return;

  const link = event.target.closest("a[href]");
  if (!link || link.target === "_blank" || link.hasAttribute("download")) return;

  let url;
  try {
    url = new URL(link.href, window.location.href);
  } catch {
    return;
  }

  if (url.origin !== window.location.origin) return;
  if (url.pathname === window.location.pathname && url.hash) return;

  event.preventDefault();
  document.documentElement.classList.add("is-leaving");
  window.setTimeout(() => {
    window.location.href = link.href;
  }, 180);
});

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
