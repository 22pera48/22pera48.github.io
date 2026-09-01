/* ==========================================================================
   Ariel Perazzo — CV / Portfolio
   JavaScript propio (reemplaza AOS, Typed.js, Isotope, GLightbox y Bootstrap JS)
   ========================================================================== */
document.addEventListener('DOMContentLoaded', function () {
 
  /* ---------- Header: sombra al hacer scroll ---------- */
  var header = document.getElementById('header');
  function onScrollHeader() {
    if (window.scrollY > 10) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  }
  onScrollHeader();
  window.addEventListener('scroll', onScrollHeader);
 
  /* ---------- Menú mobile ---------- */
  var navmenu = document.getElementById('navmenu');
  var navToggle = document.querySelector('.mobile-nav-toggle');
  if (navToggle) {
    navToggle.addEventListener('click', function () {
      navmenu.classList.toggle('nav-open');
      navToggle.classList.toggle('bi-list');
      navToggle.classList.toggle('bi-x');
    });
  }
 
  /* Cerrar el menú mobile al navegar a un ancla */
  document.querySelectorAll('.nav-link[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function () {
      navmenu.classList.remove('nav-open');
    });
  });
 
  /* ---------- Dropdowns del menú (click, sirve para desktop y mobile) ---------- */
  document.querySelectorAll('.nav-list li.has-dropdown > a').forEach(function (toggleLink) {
    toggleLink.addEventListener('click', function (e) {
      var parentLi = toggleLink.parentElement;
      var isTopLevel = parentLi.parentElement.classList.contains('nav-list');
      // En desktop (>992px) el top-level abre por hover via CSS; solo interceptamos
      // el click para evitar navegar a "#" y para manejar submenús anidados.
      e.preventDefault();
      var alreadyOpen = parentLi.classList.contains('open');
      // Cerrar hermanos en el mismo nivel
      var siblings = Array.prototype.slice.call(parentLi.parentElement.children);
      siblings.forEach(function (sib) { if (sib !== parentLi) sib.classList.remove('open'); });
      parentLi.classList.toggle('open', !alreadyOpen);
    });
  });
 
  /* Cerrar dropdowns al hacer click afuera */
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.nav-list')) {
      document.querySelectorAll('.nav-list li.open').forEach(function (li) {
        li.classList.remove('open');
      });
    }
  });
 
  /* ---------- Scroll reveal (reemplaza AOS) ---------- */
  var revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0, rootMargin: '0px 0px -5% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
    // Red de seguridad: si algo impide que el observer dispare (viewport atípico,
    // elemento gigante, etc.), no dejar contenido invisible para siempre.
    setTimeout(function () {
      revealEls.forEach(function (el) { el.classList.add('in-view'); });
    }, 4000);
  } else {
    revealEls.forEach(function (el) { el.classList.add('in-view'); });
  }
 
  /* ---------- Barras de habilidades animadas ---------- */
  document.querySelectorAll('.skill-item').forEach(function (item) {
    var fill = item.querySelector('.skill-bar-fill');
    if (fill) fill.style.setProperty('--target-width', fill.getAttribute('data-value') + '%');
  });
  var skillsBlock = document.querySelector('.skills-content');
  if (skillsBlock && 'IntersectionObserver' in window) {
    var skillsIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          skillsIo.unobserve(entry.target);
        }
      });
    }, { threshold: 0 });
    document.querySelectorAll('.skill-item').forEach(function (el) { skillsIo.observe(el); });
  } else {
    document.querySelectorAll('.skill-item').forEach(function (el) { el.classList.add('in-view'); });
  }
 
  /* ---------- Texto tipeando (reemplaza Typed.js) ---------- */
  var typedEl = document.querySelector('.typed');
  if (typedEl) {
    var items = (typedEl.getAttribute('data-typed-items') || '').split(',').map(function (s) { return s.trim(); }).filter(Boolean);
    var itemIndex = 0, charIndex = 0, deleting = false;
 
    function tick() {
      var current = items[itemIndex] || '';
      if (!deleting) {
        charIndex++;
        typedEl.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
          deleting = true;
          setTimeout(tick, 1400);
          return;
        }
      } else {
        charIndex--;
        typedEl.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          itemIndex = (itemIndex + 1) % items.length;
        }
      }
      setTimeout(tick, deleting ? 35 : 65);
    }
    if (items.length) tick();
  }
 
  /* ---------- Filtro de portafolio (reemplaza Isotope) ---------- */
  document.querySelectorAll('.portfolio-filters').forEach(function (filterList) {
    var grid = filterList.closest('.portfolio-layout').querySelector('.portfolio-grid');
    filterList.querySelectorAll('li[data-filter]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterList.querySelectorAll('li').forEach(function (b) { b.classList.remove('filter-active'); });
        btn.classList.add('filter-active');
        var filter = btn.getAttribute('data-filter');
        grid.querySelectorAll('.portfolio-item').forEach(function (item) {
          var show = filter === '*' || item.classList.contains(filter.replace('.', ''));
          item.classList.toggle('is-hidden', !show);
        });
      });
    });
  });
 
  /* ---------- Lightbox simple (reemplaza GLightbox) ---------- */
  var overlay = document.createElement('div');
  overlay.className = 'lightbox-overlay';
  overlay.innerHTML = '<button class="lightbox-close" aria-label="Cerrar">&times;</button><img src="" alt="">';
  document.body.appendChild(overlay);
  var overlayImg = overlay.querySelector('img');
 
  function openLightbox(src, alt) {
    overlayImg.src = src;
    overlayImg.alt = alt || '';
    overlay.classList.add('open');
  }
  function closeLightbox() {
    overlay.classList.remove('open');
    overlayImg.src = '';
  }
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay || e.target.classList.contains('lightbox-close')) closeLightbox();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeLightbox();
  });
  document.querySelectorAll('.preview-link').forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      var item = link.closest('.portfolio-item');
      var img = item ? item.querySelector('img') : null;
      openLightbox(link.getAttribute('href'), img ? img.alt : '');
    });
  });
 
  /* ---------- FAQ acordeón ---------- */
  document.querySelectorAll('.faq-item').forEach(function (item) {
    item.addEventListener('click', function () {
      var wasActive = item.classList.contains('faq-active');
      document.querySelectorAll('.faq-item').forEach(function (i) { i.classList.remove('faq-active'); });
      if (!wasActive) item.classList.add('faq-active');
    });
  });
 
  /* ---------- Botón volver arriba ---------- */
  var scrollTopBtn = document.getElementById('scroll-top');
  function onScrollTopBtn() {
    if (window.scrollY > 400) scrollTopBtn.classList.add('visible');
    else scrollTopBtn.classList.remove('visible');
  }
  onScrollTopBtn();
  window.addEventListener('scroll', onScrollTopBtn);
  scrollTopBtn.addEventListener('click', function (e) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
 
  /* ---------- Formulario de contacto ---------- */
  var form = document.getElementById('contact-form');
  if (form) {
    var statusBox = form.querySelector('.form-status');
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      statusBox.classList.remove('is-error');
      statusBox.classList.add('is-loading');
      var data = new FormData(form);
 
      fetch(form.action, {
        method: form.method,
        body: data,
        headers: { 'Accept': 'application/json' }
      }).then(function (response) {
        statusBox.classList.remove('is-loading');
        if (response.ok) {
          form.style.display = 'none';
          document.getElementById('thank-you-message').style.display = 'block';
        } else {
          statusBox.classList.add('is-error');
        }
      }).catch(function () {
        statusBox.classList.remove('is-loading');
        statusBox.classList.add('is-error');
      });
    });
  }
 
});