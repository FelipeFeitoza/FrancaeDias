function pageKey(pathname) {
  return pathname.replace(/\/index\.html$/i, "/");
}

function closeMobileNav() {
  const menu = document.getElementById("ftco-nav");
  if (!menu || !menu.classList.contains("show")) return false;
  const toggler = document.querySelector("[data-bs-target='#ftco-nav']");
  if (window.bootstrap && window.bootstrap.Collapse) {
    window.bootstrap.Collapse.getOrCreateInstance(menu, { toggle: false }).hide();
  } else {
    menu.classList.remove("show");
  }
  if (toggler) toggler.setAttribute("aria-expanded", "false");
  return true;
}

function afterMenuClosed(done) {
  const menu = document.getElementById("ftco-nav");
  const wasOpen = closeMobileNav();
  if (!wasOpen) {
    done();
    return;
  }
  let finished = false;
  const run = () => {
    if (finished) return;
    finished = true;
    done();
  };
  if (menu) menu.addEventListener("hidden.bs.collapse", run, { once: true });
  window.setTimeout(run, 400);
}

function scrollToHash(hash) {
  const id = decodeURIComponent(String(hash || "").replace(/^#/, ""));
  if (!id) return;
  const target = document.getElementById(id);
  if (!target) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  if (window.location.hash !== "#" + id) {
    history.pushState(null, "", "#" + id);
  }
}

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

  const link = event.target.closest("a[href]");
  if (!link || link.target === "_blank" || link.hasAttribute("download")) return;

  let url;
  try {
    url = new URL(link.href, window.location.href);
  } catch {
    return;
  }

  const inMenu = Boolean(link.closest("#ftco-navbar"));
  const sameDocument =
    url.origin === window.location.origin &&
    pageKey(url.pathname) === pageKey(window.location.pathname);

  if (sameDocument && url.hash) {
    event.preventDefault();
    afterMenuClosed(() => scrollToHash(url.hash));
    return;
  }

  if (inMenu) closeMobileNav();

  if (url.origin !== window.location.origin) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (typeof document.startViewTransition === "function") return;

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
