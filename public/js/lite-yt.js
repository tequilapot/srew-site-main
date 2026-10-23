/* Lite YouTube embeds: show the thumbnail, load the player only on click. */
(function () {
  function play(box) {
    var id = box.getAttribute("data-id");
    if (!id || box.classList.contains("is-playing")) return;
    var f = document.createElement("iframe");
    f.src = "https://www.youtube-nocookie.com/embed/" + id + "?autoplay=1&rel=0&modestbranding=1";
    f.title = box.getAttribute("data-title") || "YouTube video";
    f.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    f.allowFullscreen = true;
    f.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
    box.innerHTML = "";
    box.appendChild(f);
    box.classList.add("is-playing");
  }
  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest(".lite-yt");
    if (b) { e.preventDefault(); play(b); }
  });
})();
