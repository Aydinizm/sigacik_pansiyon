/* ════════════════════════════════════════════════════════════════
   MELTEM PANSİYON — Main Script
   ════════════════════════════════════════════════════════════════ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  /* ──────────────────────────── Navbar ──────────────────────────── */
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileClose = document.getElementById('mobileClose');

  function updateNav() {
    navbar.classList.toggle('scrolled', window.scrollY > 70);
  }
  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  /* ──────────────────────────── Mobile Menu ──────────────────────────── */
  function openMenu() {
    mobileMenu.classList.add('open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    hamburger.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    hamburger.classList.remove('active');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    mobileMenu.classList.contains('open') ? closeMenu() : openMenu();
  });
  mobileClose.addEventListener('click', closeMenu);

  document.querySelectorAll('.mobile-menu__link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) closeMenu();
  });

  /* ──────────────────────────── Scroll Reveal ──────────────────────────── */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -50px 0px' }
    );

    // Observe hero elements immediately (they're in view on load)
    document.querySelectorAll('.hero .reveal-up').forEach(el => {
      revealObserver.observe(el);
    });

    // Small delay before observing off-screen elements
    // (gives browser time to paint and calculate positions)
    requestAnimationFrame(() => {
      document.querySelectorAll(
        '.reveal-up:not(.hero .reveal-up), .reveal-left, .reveal-right'
      ).forEach(el => revealObserver.observe(el));
    });
  } else {
    // Skip animations for users who prefer reduced motion
    document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => {
      el.classList.add('visible');
    });
  }

  /* ──────────────────────────── Hero Image Ken Burns ──────────────────────────── */
  const heroImg = document.querySelector('.hero__img');
  if (heroImg) {
    const trigger = () => heroImg.classList.add('loaded');
    if (heroImg.complete && heroImg.naturalWidth) {
      trigger();
    } else {
      heroImg.addEventListener('load', trigger);
    }
  }

  /* ──────────────────────────── Hero Parallax ──────────────────────────── */
  if (!prefersReducedMotion && window.innerWidth > 768 && heroImg) {
    const heroSection = document.querySelector('.hero');
    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrolled = window.scrollY;
          if (scrolled < window.innerHeight) {
            heroImg.style.transform = `translateY(${scrolled * 0.28}px)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ──────────────────────────── Smooth Scroll ──────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();

      const navH = navbar.offsetHeight;
      const top  = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ──────────────────────────── Active Nav Link ──────────────────────────── */
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav__links a');

  const activeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(link => {
            const matches = link.getAttribute('href') === `#${id}`;
            link.classList.toggle('active', matches);
          });
        }
      });
    },
    { threshold: 0.45 }
  );

  sections.forEach(s => activeObserver.observe(s));

  /* ──────────────────────────── Contact Form ──────────────────────────── */
  const form        = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  const checkinEl   = document.getElementById('checkin');
  const checkoutEl  = document.getElementById('checkout');

  if (form) {
    // Set minimum selectable date to today
    const todayStr = new Date().toISOString().split('T')[0];
    if (checkinEl)  checkinEl.min  = todayStr;
    if (checkoutEl) checkoutEl.min = todayStr;

    checkinEl?.addEventListener('change', () => {
      if (!checkoutEl) return;
      checkoutEl.min = checkinEl.value;
      if (checkoutEl.value && checkoutEl.value <= checkinEl.value) {
        checkoutEl.value = '';
      }
    });

    // Inline validation — remove error style on input
    form.querySelectorAll('input, textarea').forEach(field => {
      field.addEventListener('input', () => field.classList.remove('error'), { passive: true });
    });

    form.addEventListener('submit', e => {
      e.preventDefault();

      const nameEl    = document.getElementById('name');
      const emailEl   = document.getElementById('email');
      const messageEl = document.getElementById('message');

      const name    = nameEl.value.trim();
      const email   = emailEl.value.trim();
      const message = messageEl.value.trim();

      let valid = true;

      if (!name)    { nameEl.classList.add('error');    valid = false; }
      if (!message) { messageEl.classList.add('error'); valid = false; }
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        emailEl.classList.add('error');
        valid = false;
      }

      if (!valid) {
        // Focus first errored field
        const firstError = form.querySelector('.error');
        firstError?.focus();
        return;
      }

      // Simulate async send
      const submitBtn  = form.querySelector('button[type="submit"]');
      const btnText    = submitBtn.querySelector('.btn__text');
      const originalText = btnText.textContent;

      submitBtn.disabled    = true;
      btnText.textContent   = 'Sending…';

      setTimeout(() => {
        form.reset();
        formSuccess.classList.add('show');
        btnText.textContent  = originalText;
        submitBtn.disabled   = false;

        // Auto-hide success message after 7s
        setTimeout(() => formSuccess.classList.remove('show'), 7000);
      }, 1300);
    });
  }

  /* ──────────────────────────── Gallery Lightbox (simple) ──────────────────────────── */
  const galleryItems = document.querySelectorAll('.gallery__item');

  // Create lightbox elements
  const lightbox = document.createElement('div');
  lightbox.className  = 'lightbox';
  lightbox.setAttribute('aria-modal', 'true');
  lightbox.setAttribute('role', 'dialog');
  lightbox.setAttribute('aria-label', 'Image lightbox');
  lightbox.innerHTML  = `
    <button class="lightbox__close" aria-label="Close lightbox">✕</button>
    <div class="lightbox__img-wrap">
      <img class="lightbox__img" src="" alt="">
    </div>
    <p class="lightbox__caption"></p>
  `;
  document.body.appendChild(lightbox);

  // Inject lightbox styles
  const lbStyle = document.createElement('style');
  lbStyle.textContent = `
    .lightbox {
      position: fixed; inset: 0; z-index: 2000;
      background: rgba(11,45,78,0.95);
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      opacity: 0; pointer-events: none;
      transition: opacity 0.35s ease;
      padding: 2rem;
    }
    .lightbox.open { opacity: 1; pointer-events: auto; }
    .lightbox__close {
      position: absolute; top: 1.5rem; right: 2rem;
      font-size: 1.5rem; color: rgba(255,255,255,0.55);
      cursor: pointer; transition: color 0.2s;
      background: none; border: none;
    }
    .lightbox__close:hover { color: #fff; }
    .lightbox__img-wrap {
      max-width: min(90vw, 960px);
      max-height: 78vh;
      overflow: hidden; border-radius: 4px;
      box-shadow: 0 30px 80px rgba(0,0,0,0.5);
    }
    .lightbox__img {
      width: 100%; height: 100%;
      object-fit: contain; display: block;
    }
    .lightbox__caption {
      margin-top: 1.2rem;
      font-size: 0.72rem; letter-spacing: 0.2em;
      text-transform: uppercase;
      color: rgba(255,255,255,0.45);
    }
  `;
  document.head.appendChild(lbStyle);

  const lbImg     = lightbox.querySelector('.lightbox__img');
  const lbCaption = lightbox.querySelector('.lightbox__caption');
  const lbClose   = lightbox.querySelector('.lightbox__close');

  function openLightbox(item) {
    const img     = item.querySelector('img');
    const caption = item.querySelector('.gallery__caption span');
    lbImg.src          = img.src;
    lbImg.alt          = img.alt;
    lbCaption.textContent = caption?.textContent ?? '';
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    lbImg.src = '';
  }

  galleryItems.forEach(item => {
    item.style.cursor = 'pointer';
    item.addEventListener('click', () => openLightbox(item));
  });

  lbClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
  });

  /* ──────────────────────────── Room card — keyboard accessible ──────────────────────────── */
  document.querySelectorAll('.room-card').forEach(card => {
    card.setAttribute('tabindex', '0');
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        card.querySelector('a')?.click();
      }
    });
  });

});
