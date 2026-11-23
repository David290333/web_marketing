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
  
// Čisté adresy sekcí: /kurzy místo /#kurzy (ostatní sekce bez # v adrese)
(function () {
  const PATH_SECTIONS = ["kurzy"]; // sekce s vlastní adresou (vyžaduje rewrite na Renderu)

  function goTo(id, smooth) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: smooth ? "smooth" : "auto" });
  }

  document.addEventListener("click", function (e) {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const id = link.getAttribute("href").slice(1);
    const el = id && document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: "smooth" });
    const url = PATH_SECTIONS.includes(id) ? "/" + id : "/";
    history.replaceState(null, "", url + window.location.search);
  });

  window.addEventListener("load", function () {
    const id = window.location.pathname.replace(/^\/|\/$/g, "");
    if (PATH_SECTIONS.includes(id)) setTimeout(() => goTo(id, false), 100);
  });
})();
