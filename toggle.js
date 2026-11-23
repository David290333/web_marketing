document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.querySelector(".nav-links");
  
    menuToggle.addEventListener("click", () => {
      navLinks.classList.toggle("show");
      menuToggle.classList.toggle("open");
    });
  
    navLinks.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("show");
        menuToggle.classList.remove("open");
      });
    });
  });
  
// Čisté adresy sekcí: /kurzy místo /#kurzy (vyžaduje rewrite pravidla na Renderu)
(function () {
  const PATHS = { about: "o-nas", services: "sluzby", kurzy: "kurzy", reference: "reference", contact: "kontakt" };
  const inEn = window.location.pathname.indexOf("/en") === 0;

  document.addEventListener("click", function (e) {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const id = link.getAttribute("href").slice(1);
    const el = id && document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: "smooth" });
    const url = inEn ? window.location.pathname : (PATHS[id] ? "/" + PATHS[id] : "/");
    history.replaceState(null, "", url + window.location.search);
  });

  window.addEventListener("load", function () {
    if (inEn) return;
    const path = window.location.pathname.replace(/^\/|\/$/g, "");
    const id = Object.keys(PATHS).find(k => PATHS[k] === path);
    const el = id && document.getElementById(id);
    if (el) setTimeout(() => el.scrollIntoView({ behavior: "auto" }), 100);
  });
})();
