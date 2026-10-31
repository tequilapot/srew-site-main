/* Catalogue motion: sticky-header assist, below-fold reveals, mobile menu state.
   Skips animation when the visitor prefers reduced motion. */
(function () {
  var root = document.documentElement;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!reduce) root.classList.add("cat-motion");

  var nav = document.querySelector(".navbar.fixed-top");
  if (nav) {
    var onScroll = function () {
      nav.classList.toggle("scrolled", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  var collapse = document.getElementById("navbarNav");
  if (collapse) {
    collapse.addEventListener("shown.bs.collapse", function () {
      document.body.classList.add("cat-menu-open");
    });
    collapse.addEventListener("hidden.bs.collapse", function () {
      document.body.classList.remove("cat-menu-open");
    });
  }

  if (reduce || !("IntersectionObserver" in window)) return;

  var nodes = document.querySelectorAll(
    "main section:not(:first-child), .product-card, .cat-tile, .rp-card, .el-card, .crawler-card, .faq-item"
  );
  var seen = new Set();
  nodes.forEach(function (el, i) {
    if (seen.has(el)) return;
    seen.add(el);
    el.classList.add("cat-reveal");
    el.style.setProperty("--cat-d", (i % 8) * 40 + "ms");
  });

  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        io.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
  );
  seen.forEach(function (el) {
    io.observe(el);
  });
})();
