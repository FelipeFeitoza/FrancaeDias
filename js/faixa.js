function pageKey(pathname) {
  const path = pathname.replace(/\/+$/, "") || "/";
  if (/\/index\.html$/i.test(path)) return path.replace(/\/index\.html$/i, "/") || "/";
  return path;
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

function navOffset() {
  const nav = document.getElementById("ftco-navbar");
  return (nav ? nav.getBoundingClientRect().height : 0) + 12;
}

function scrollToHash(hash, { force } = {}) {
  const id = decodeURIComponent(String(hash || "").replace(/^#/, ""));
  if (!id) return false;
  const target = document.getElementById(id);
  if (!target) return false;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const y =
    target.getBoundingClientRect().top +
    (window.pageYOffset || document.documentElement.scrollTop || 0) -
    navOffset();

  window.scrollTo({ top: Math.max(0, y), behavior: reduce ? "auto" : "smooth" });

  if (force || window.location.hash !== "#" + id) {
    history.replaceState(null, "", "#" + id);
  }
  return true;
}

function applyInitialHash() {
  if (!window.location.hash) return;
  const run = () => scrollToHash(window.location.hash, { force: true });
  run();
  window.requestAnimationFrame(run);
  window.setTimeout(run, 120);
  window.setTimeout(run, 450);
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
document.addEventListener("DOMContentLoaded", applyInitialHash);
window.addEventListener("pageshow", strikeGavel);
window.addEventListener("pageshow", applyInitialHash);
window.addEventListener("hashchange", () => scrollToHash(window.location.hash, { force: true }));

document.addEventListener("click", (event) => {
  if (event.defaultPrevented || event.button !== 0) return;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

  const link = event.target.closest && event.target.closest("a[href]");
  if (!link || link.target === "_blank" || link.hasAttribute("download")) return;

  let url;
  try {
    url = new URL(link.href, window.location.href);
  } catch {
    return;
  }

  if (url.origin !== window.location.origin) return;

  const sameDocument = pageKey(url.pathname) === pageKey(window.location.pathname);

  // Mesma página + âncora: rolar sem recarregar
  if (sameDocument && url.hash) {
    event.preventDefault();
    afterMenuClosed(() => scrollToHash(url.hash, { force: true }));
    return;
  }

  // Outra página: fecha o menu e deixa a navegação nativa (preserva #hash)
  if (!sameDocument && link.closest("#ftco-navbar")) {
    closeMobileNav();
  }
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
