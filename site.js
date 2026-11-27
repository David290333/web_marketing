(function () {
  'use strict';

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Sekce s vlastní čistou adresou (vyžaduje rewrite pravidla na Renderu)
  var PATHS = { 'sluzby': 'sluzby', 'kurzy': 'kurzy', 'o-mne': 'o-mne', 'recenze': 'recenze', 'kontakt': 'kontakt' };

  function setUrl(url) {
    try { history.replaceState(null, '', url); } catch (e) { /* např. náhled ze souboru */ }
  }

  // ----- Animace při posunu -----
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('visible'); io.unobserve(en.target); }
      });
    }, { threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('visible'); });
  }

  // ----- Mobilní menu -----
  var menuButton = document.getElementById('mobileNavToggle');
  var menuLinks = document.getElementById('siteNavLinks');
  function closeMenu() {
    menuLinks.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.textContent = 'Menu';
  }
  menuButton.addEventListener('click', function () {
    var open = menuLinks.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.textContent = open ? 'Zavřít' : 'Menu';
  });
  menuLinks.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeMenu); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });

  // ----- Odkazy na sekce: plynulý posun + čistá adresa (/kurzy místo /#kurzy) -----
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute('href').slice(1);
    var el = id && document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
    if (id === 'uvod') setUrl('/');
    else if (PATHS[id]) setUrl('/' + PATHS[id]);
    else setUrl(location.pathname);
  });

  // Otevření přímo na /kurzy, /kontakt apod.
  window.addEventListener('load', function () {
    var path = location.pathname.replace(/^\/|\/$/g, '');
    var el = PATHS[path] && document.getElementById(path);
    if (el) setTimeout(function () { el.scrollIntoView({ behavior: 'auto' }); }, 150);
  });

  // ----- Ukázková hodina (YouTube se načte až po kliknutí) -----
  var play = document.getElementById('playSampleVideo');
  play.addEventListener('click', function () {
    var iframe = document.createElement('iframe');
    iframe.src = 'https://www.youtube-nocookie.com/embed/wYDfKPVHcLI?autoplay=1';
    iframe.title = 'Ukázková hodina kurzu Social Media Manager';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.allowFullscreen = true;
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    document.getElementById('sampleVideo').replaceChildren(iframe);
  });

  // ----- Potvrzení po odeslání formuláře (formsubmit přesměruje zpět s ?odeslano) -----
  if (/[?&]odeslano/.test(location.search)) {
    var toast = document.getElementById('toast');
    toast.hidden = false;
    setUrl(location.pathname);
    setTimeout(function () { toast.hidden = true; }, 9000);
  }
})();
