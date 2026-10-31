/* Client logos already on the site. Add a row to include another logo.
   industry is "To confirm" until the owner names each client's sector. */
window.SREW_CLIENTS = [
  {
    name: "NCC Urban",
    logo: "/images/clients/ncc-urban-infrastructure-logo.png",
    industry: "To confirm",
    featured: true,
    url: "https://nccurban.com/"
  },
  {
    name: "Balaji Builders",
    logo: "/images/clients/balaji-crushing-screening-logo.png",
    industry: "To confirm",
    featured: false,
    url: "https://www.balajiconstructionpune.com/"
  },
  {
    name: "Aparna Enterprises",
    logo: "/images/clients/aparna-enterprises-logo.png",
    industry: "To confirm",
    featured: false,
    url: "https://www.aparnaconstructions.com/"
  },
  {
    name: "Toshani Projects",
    logo: "/images/clients/toshani-projects-logo.png",
    industry: "To confirm",
    featured: false,
    url: "https://toshaniprojects.com/"
  },
  {
    name: "Patel Infrastructure",
    logo: "/images/clients/Patel-logo.png",
    industry: "To confirm",
    featured: false
  },
  {
    name: "SSREC",
    logo: "/images/clients/SSREC-logo.png",
    industry: "To confirm",
    featured: false
  },
  {
    name: "Glindco",
    logo: "/images/clients/glindco-logo.png",
    industry: "To confirm",
    featured: false
  },
  {
    name: "Magnatech",
    logo: "/images/clients/magnatech-logo.png",
    industry: "To confirm",
    featured: false
  },
  {
    name: "Markolines",
    logo: "/images/clients/markolines-registered-logo.png",
    industry: "To confirm",
    featured: false
  },
  {
    name: "Versan",
    logo: "/images/clients/versan-logo.png",
    industry: "To confirm",
    featured: false
  }
];

(function () {
  var grid = document.getElementById("clients-grid");
  var list = window.SREW_CLIENTS || [];
  if (!grid || !list.length) return;

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function card(client) {
    var inner =
      '<div class="client-logo"><img src="' + esc(client.logo) + '" alt="' + esc(client.name) + ' logo" width="220" height="72" loading="lazy" decoding="async"></div>' +
      '<p class="client-industry">' + esc(client.name) + "</p>";
    if (client.url) {
      return '<a class="client-card" href="' + esc(client.url) + '" target="_blank" rel="noopener noreferrer">' + inner + "</a>";
    }
    return '<div class="client-card">' + inner + "</div>";
  }

  grid.innerHTML = list.map(card).join("");
})();
