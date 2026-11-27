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

  // ----- Adresa v prohlížeči se mění podle toho, kde na stránce jsem -----
  // [id elementu, adresa]; ukázková hodina patří ke kurzům, FAQ k recenzím
  var SPY = [
    ['uvod', '/'], ['sluzby', '/sluzby'], ['kurzy', '/kurzy'], ['ukazka-hodiny', '/kurzy'],
    ['o-mne', '/o-mne'], ['recenze', '/recenze'], ['faq', '/recenze'], ['kontakt', '/kontakt']
  ].map(function (p) { return { el: document.getElementById(p[0]), url: p[1] }; })
   .filter(function (p) { return p.el; });
  var spyTicking = false;

  function spyUpdate() {
    spyTicking = false;
    var url = SPY[0].url;
    var atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
    if (atBottom) {
      url = SPY[SPY.length - 1].url;
    } else {
      for (var i = 0; i < SPY.length; i++) {
        if (SPY[i].el.getBoundingClientRect().top <= 160) url = SPY[i].url; else break;
      }
    }
    if (location.pathname !== url) setUrl(url);
  }
  window.addEventListener('scroll', function () {
    if (!spyTicking) { spyTicking = true; window.requestAnimationFrame(spyUpdate); }
  }, { passive: true });

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

  // ----- Odesílání formulářů bez opuštění stránky (formsubmit AJAX) -----
  var toast = document.getElementById('toast');
  var toastTimer;
  function showToast(text, ms) {
    toast.textContent = text;
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.hidden = true; }, ms || 8000);
  }

  document.querySelectorAll('form[data-ajax]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      if (!window.fetch || !window.FormData) return; // starý prohlížeč: běžné odeslání
      e.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      var label = btn.textContent;
      var fd = new FormData(form);
      if (fd.get('_honey')) { form.reset(); return; } // robot
      fd.set('_captcha', 'false');
      fd.delete('_next');
      btn.disabled = true;
      btn.textContent = 'Odesílám…';

      var ctrl = window.AbortController ? new AbortController() : null;
      var timer = setTimeout(function () { if (ctrl) ctrl.abort(); }, 20000);

      fetch('https://formsubmit.co/ajax/info@smmarketing.cz', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: fd,
        signal: ctrl ? ctrl.signal : undefined
      }).then(function (r) { return r.json().catch(function () { return {}; }); })
        .then(function (d) {
          if (d && (d.success === 'true' || d.success === true)) {
            form.reset();
            showToast('Děkuji, zpráva byla odeslána. Brzy se vám ozvu.');
          } else {
            throw new Error((d && d.message) || 'fail');
          }
        })
        .catch(function () {
          showToast('Odeslání se nepovedlo. Napište mi prosím na info@smmarketing.cz nebo zavolejte na +420 775 377 054.', 12000);
        })
        .then(function () {
          clearTimeout(timer);
          btn.disabled = false;
          btn.textContent = label;
        });
    });
  });

  // ----- Potvrzení po klasickém odeslání (záložní varianta, formsubmit přesměruje s ?odeslano) -----
  if (/[?&]odeslano/.test(location.search)) {
    showToast('Děkuji, zpráva byla odeslána. Brzy se vám ozvu.', 9000);
    setUrl(location.pathname);
  }
})();
