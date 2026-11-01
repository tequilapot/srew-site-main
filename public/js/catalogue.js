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
    var menuToggle = document.querySelector(".navbar-toggler");
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && collapse.classList.contains("show")) {
        var collapseInstance = window.bootstrap && window.bootstrap.Collapse.getInstance(collapse);
        if (collapseInstance) {
          collapseInstance.hide();
        } else {
          collapse.classList.remove("show");
          document.body.classList.remove("cat-menu-open");
          if (menuToggle) menuToggle.setAttribute("aria-expanded", "false");
        }
        if (menuToggle) menuToggle.focus();
      }
    });
  }

  var search = document.getElementById("catalogueSearch");
  var searchStatus = document.getElementById("catalogueSearchStatus");
  var clearSearch = document.getElementById("catalogueSearchClear");
  var catalogue = document.getElementById("productCatalogue");

  if (search && searchStatus && clearSearch && catalogue) {
    var productEntries = Array.from(catalogue.querySelectorAll(".product-card")).map(function (card) {
      var column = card.parentElement;
      var imageText = Array.from(card.querySelectorAll("img[alt]")).map(function (image) {
        return image.alt;
      }).join(" ");

      return {
        column: column,
        text: (card.textContent + " " + imageText).toLowerCase().replace(/[–—]/g, "-")
      };
    });

    var categories = Array.from(catalogue.children)
      .filter(function (child) {
        return child.matches(".col-12[id]");
      })
      .map(function (heading) {
        var columns = [];
        var sibling = heading.nextElementSibling;

        while (sibling && !sibling.matches(".col-12[id]")) {
          if (sibling.querySelector(".product-card")) columns.push(sibling);
          sibling = sibling.nextElementSibling;
        }

        return { heading: heading, columns: columns };
      });

    var categoryLinks = Array.from(document.querySelectorAll(".cat-chips a[href^='#']"));

    function updateCatalogueSearch() {
      var query = search.value.trim().toLowerCase().replace(/[–—]/g, "-");
      var terms = query.split(/\s+/).filter(Boolean);
      var matchingCount = 0;

      productEntries.forEach(function (entry) {
        var matches = terms.every(function (term) {
          return entry.text.includes(term);
        });
        entry.column.classList.toggle("catalogue-search-hidden", !matches);
        if (matches) matchingCount += 1;
      });

      categories.forEach(function (category) {
        var hasMatch = category.columns.some(function (column) {
          return !column.classList.contains("catalogue-search-hidden");
        });
        category.heading.classList.toggle("catalogue-search-hidden", terms.length > 0 && !hasMatch);
      });

      categoryLinks.forEach(function (link) {
        var categoryId = link.getAttribute("href").slice(1);
        var heading = document.getElementById(categoryId);
        var listItem = link.closest("li");
        if (heading && listItem) {
          listItem.classList.toggle("catalogue-search-hidden", terms.length > 0 && heading.classList.contains("catalogue-search-hidden"));
        }
      });

      if (terms.length === 0) {
        searchStatus.textContent = "Showing all " + matchingCount + " products.";
      } else if (matchingCount === 0) {
        searchStatus.textContent = "No products match that search. Try another term.";
      } else {
        searchStatus.textContent = matchingCount + (matchingCount === 1 ? " product found." : " products found.");
      }

      clearSearch.hidden = search.value.length === 0;
    }

    search.addEventListener("input", updateCatalogueSearch);
    search.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && search.value) {
        search.value = "";
        updateCatalogueSearch();
      }
    });
    clearSearch.addEventListener("click", function () {
      search.value = "";
      updateCatalogueSearch();
      search.focus();
    });
    updateCatalogueSearch();
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
