(function () {
  function init() {
    const btn = document.querySelector(".back-to-top");
    if (!btn) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const threshold = 200;

    const sync = () => {
      const y =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0;
      btn.classList.toggle("is-visible", y > threshold);
    };

    btn.addEventListener("click", (event) => {
      event.preventDefault();
      window.scrollTo({ top: 0, left: 0, behavior: reduce ? "auto" : "smooth" });
    });

    window.addEventListener("scroll", sync, { passive: true });
    document.addEventListener("scroll", sync, { passive: true });
    sync();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
