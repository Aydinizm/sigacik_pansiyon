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
      btnText.textContent   = 'Gönderiliyor…';

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
  lightbox.setAttribute('aria-label', 'Resim galerisi');
  lightbox.innerHTML  = `
    <button class="lightbox__close" aria-label="Galeriyi kapat">✕</button>
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

  /* ──────────────────────────── Language Switcher ──────────────────────────── */
  const translations = {
    tr: {
      // Nav
      'nav-about':   'Hakkımızda',
      'nav-rooms':   'Odalarımız',
      'nav-gallery': 'Galeri',
      'nav-contact': 'Rezervasyon Yap',
      // Mobile menu
      'mob-about':   'Hakkımızda',
      'mob-rooms':   'Odalarımız',
      'mob-gallery': 'Galeri',
      'mob-contact': 'İletişim & Rezervasyon',
      // Hero
      'hero-eyebrow':  'Sığacık · Cittaslow · Ege, Türkiye',
      'hero-subtitle': 'Ege rüzgârının huzur bulduğu yer.<br>Acelesiz ruhlar için yavaş bir sığınak.',
      'hero-btn1':     'Odalarımızı Keşfedin',
      'hero-btn2':     'Rezervasyon Yapın',
      'hero-scroll':   'Keşfet',
      // About
      'about-eyebrow': 'Hakkımızda',
      'about-title':   "Cittaslow'un<br><em>kalbinde huzur</em>",
      'about-lead':    "Türkiye'nin ilk <em>Cittaslow</em> (Sakin Şehir) unvanını taşıyan Sığacık'ın tarihi taş surlarının ardında, 1987'den bu yana Meltem Pansiyon; yorgun yolcuları, sanatçıları ve yavaş yaşamın güzelliğine inananları kucaklamaktadır.",
      'about-text':    "Aile işletmemiz, Ege'nin ritmiyle nefes alır: yabani kekik ve taze börek kokusuyla açılan sabahlar, körfezin koyu mavisiyle eriyip giden öğleden sonralar ve mum ışığı ile kadeh sesi eşliğinde sarıp sarmalayan akşamlar.",
      'about-quote':   '"Sığacık\'ta zamanın kendisi de yavaş yürümeyi öğrenmiş."',
      'about-f1':      '1987\'den beri aile işletmesi',
      'about-f2':      'Denize 100 metre mesafe',
      'about-f3':      'Organik kahvaltı dahil',
      'about-f4':      'Ücretsiz bisiklet kiralama',
      'about-badge':   'Kur.',
      // Rooms
      'rooms-eyebrow': 'Odalarımız',
      'rooms-title':   'Maviyle buluşacağınız<br><em>köşenizi bulun</em>',
      'rooms-desc':    'Her oda bir hikâye — özenle seçilmiş mobilyalar, el dokuması keten çarşaflar ve Ege\'yi tam anlamıyla çerçeveleyen bir pencere.',
      'r1-tag':  'Standart', 'r1-name': 'Taş Oda',
      'r1-desc': 'Badanalı duvarlar, terracotta karolar ve binlerce güzel düşe ev sahipliği yapmış dövme demir bir yatak.',
      'r1-f1':'Çift veya twin yatak','r1-f2':'Özel banyo','r1-f3':'Klima','r1-f4':'Ücretsiz Wi-Fi',
      'r1-from':'başlangıç','r1-night':'/ gece','r1-book':'Bu Odayı Rezerve Et','r1-res':'Rezerve Et',
      'r2-tag':  'Deniz Manzaralı', 'r2-name': 'Deniz Odası', 'r2-badge': 'En Çok Tercih Edilen',
      'r2-desc': 'Özel terasınızdan pırıl pırıl Ege\'ye uyanın. Tuzlu hava, sabah ışığı ve bir bardak çay eşliğinde.',
      'r2-f1':'Deniz manzaralı çift kişilik yatak','r2-f2':'Özel teras','r2-f3':'Yağmur duşlu banyo','r2-f4':'Mini buzdolabı & kettle',
      'r2-from':'başlangıç','r2-night':'/ gece','r2-book':'Bu Odayı Rezerve Et','r2-res':'Rezerve Et',
      'r3-tag':  'Bahçe Süiti', 'r3-name': 'Bahçe Süiti',
      'r3-desc': 'Özel yasemin bahçesine açılan zemin kat kaçamağı. Ferahlık, koku ve sonsuz bir sessizlik.',
      'r3-f1':'King yatak + oturma alanı','r3-f2':'Özel bahçe erişimi','r3-f3':'Açık hava duşu','r3-f4':'Aileler için ideal',
      'r3-from':'başlangıç','r3-night':'/ gece','r3-book':'Bu Odayı Rezerve Et','r3-res':'Rezerve Et',
      // Gallery
      'gal-eyebrow': 'Galerimiz',
      'gal-title':   'Mavi ve altın<br><em>anlardan kesitler</em>',
      'gal-c1':'Sığacık Limanı','gal-c2':'Ege Kahvaltısı','gal-c3':'Taş Avlu','gal-c4':'Köy Sokakları',
      'gal-c5':'Ege Suları','gal-c6':'Altın Saat','gal-c7':'Oda Detayları','gal-c8':'Zeytin Bahçeleri',
      // Contact
      'con-eyebrow': 'İletişim',
      'con-title':   'Gelin,<br><em>bir süre kalın.</em>',
      'con-intro':   "Bir sorunuz mu var, özel bir isteğiniz mi? Ya da bu sezon incirlerin olup olmadığını mı merak ediyorsunuz? Sizi burada görmekten mutluluk duyarız.",
      'con-addr-label':'Adres','con-phone-label':'Telefon','con-email-label':'E-posta',
      'con-ci-label':'Giriş / Çıkış','con-ci-val':'Giriş: 14:00 — Çıkış: 11:00',
      'form-title':'Bize mesaj gönderin',
      'f-name-lbl':'Ad Soyad','f-name-ph':'Adınız ve soyadınız',
      'f-email-lbl':'E-posta','f-email-ph':'ornek@eposta.com',
      'f-phone-lbl':'Telefon',
      'f-room-lbl':'Oda Tipi','f-room-ph':'Oda seçiniz…',
      'f-r1':'Taş Oda — Standart (€65/gece)','f-r2':'Deniz Odası — Deniz Manzaralı (€95/gece)','f-r3':'Bahçe Süiti (€120/gece)',
      'f-ci-lbl':'Giriş Tarihi','f-co-lbl':'Çıkış Tarihi',
      'f-msg-lbl':'Mesajınız','f-msg-ph':'Planlarınızı, özel isteklerinizi paylaşın ya da sadece merhaba deyin…',
      'f-submit':'Mesaj Gönder','f-note':'Genellikle birkaç saat içinde yanıt veririz. ☀',
      'f-success':'Mesajınız iletildi! En kısa sürede sizinle iletişime geçeceğiz.',
      // Footer
      'foot-about':'Hakkımızda','foot-rooms':'Odalarımız','foot-gallery':'Galeri','foot-contact':'İletişim',
      'foot-copy':"© 2026 Meltem Pansiyon. Sığacık'tan sevgiyle yapıldı.",
      'foot-city':'Sığacık · Seferihisar · İzmir, Türkiye',
    },
    en: {
      'nav-about':   'About',
      'nav-rooms':   'Rooms',
      'nav-gallery': 'Gallery',
      'nav-contact': 'Book Now',
      'mob-about':   'About',
      'mob-rooms':   'Rooms',
      'mob-gallery': 'Gallery',
      'mob-contact': 'Contact & Book',
      'hero-eyebrow':  'Sığacık · Cittaslow · Aegean Turkey',
      'hero-subtitle': 'Where the Aegean breeze finds its rest.<br>A slow place for unhurried souls.',
      'hero-btn1':     'Explore Rooms',
      'hero-btn2':     'Book Your Stay',
      'hero-scroll':   'Scroll',
      'about-eyebrow': 'About Us',
      'about-title':   'A haven in<br><em>Cittaslow</em>',
      'about-lead':    "Tucked behind ancient stone walls in the heart of Sığacık — Turkey's first <em>Cittaslow</em> (Slow City) — Meltem Pansiyon has sheltered wanderers, artists, and lovers of the unhurried life since 1987.",
      'about-text':    "Our family-run guesthouse breathes the rhythm of the Aegean: mornings scented with wild thyme and fresh börek, afternoons dissolving into the deep blue of the bay, evenings wrapped in the warm amber of candlelight and good rakı.",
      'about-quote':   '"In Sığacık, even time has learned to walk slowly."',
      'about-f1':'Family-run since 1987','about-f2':'100 m from the sea','about-f3':'Organic breakfast included','about-f4':'Free bicycle rental',
      'about-badge': 'Est.',
      'rooms-eyebrow': 'Our Rooms',
      'rooms-title':   'Find your<br><em>corner of blue</em>',
      'rooms-desc':    'Each room is a story — handpicked furnishings, hand-stitched linens, and a window that frames the Aegean just right.',
      'r1-tag':'Standard','r1-name':'Taş Oda',
      'r1-desc':'Whitewashed walls, terracotta tiles, and a wrought-iron bed that has held a thousand good dreams.',
      'r1-f1':'Double or twin beds','r1-f2':'En-suite bathroom','r1-f3':'Air conditioning','r1-f4':'Free Wi-Fi',
      'r1-from':'from','r1-night':'/ night','r1-book':'Book This Room','r1-res':'Reserve',
      'r2-tag':'Sea View','r2-name':'Deniz Odası','r2-badge':'Most Loved',
      'r2-desc':'Wake to the glittering Aegean from your private terrace. Salt air, morning light, and a cup of Turkish tea.',
      'r2-f1':'Queen bed with sea view','r2-f2':'Private terrace','r2-f3':'Rain shower en-suite','r2-f4':'Mini-fridge & kettle',
      'r2-from':'from','r2-night':'/ night','r2-book':'Book This Room','r2-res':'Reserve',
      'r3-tag':'Garden Suite','r3-name':'Bahçe Süiti',
      'r3-desc':'A ground-floor retreat opening onto a private jasmine garden. Space, scent, and absolute stillness.',
      'r3-f1':'King bed + lounge area','r3-f2':'Private garden access','r3-f3':'Outdoor shower','r3-f4':'Ideal for families',
      'r3-from':'from','r3-night':'/ night','r3-book':'Book This Room','r3-res':'Reserve',
      'gal-eyebrow':'Gallery',
      'gal-title':'Moments in<br><em>blue and gold</em>',
      'gal-c1':'Sığacık Harbour','gal-c2':'Aegean Breakfast','gal-c3':'Stone Courtyard','gal-c4':'Village Lanes',
      'gal-c5':'Aegean Waters','gal-c6':'Golden Hour','gal-c7':'Room Details','gal-c8':'Olive Groves',
      'con-eyebrow':'Contact',
      'con-title':'Come,<br><em>stay a while.</em>',
      'con-intro':'Whether you have a question, a special request, or simply want to know if the figs are ripe this season — we\'d love to hear from you.',
      'con-addr-label':'Address','con-phone-label':'Phone','con-email-label':'Email',
      'con-ci-label':'Check-in / Check-out','con-ci-val':'Check-in: 14:00 — Check-out: 11:00',
      'form-title':'Send us a message',
      'f-name-lbl':'Full Name','f-name-ph':'Your name',
      'f-email-lbl':'Email','f-email-ph':'your@email.com',
      'f-phone-lbl':'Phone',
      'f-room-lbl':'Room Type','f-room-ph':'Select a room…',
      'f-r1':'Taş Oda — Standard (€65/night)','f-r2':'Deniz Odası — Sea View (€95/night)','f-r3':'Bahçe Süiti — Garden Suite (€120/night)',
      'f-ci-lbl':'Check-in Date','f-co-lbl':'Check-out Date',
      'f-msg-lbl':'Message','f-msg-ph':'Tell us about your plans, any special requests, or simply say hello…',
      'f-submit':'Send Message','f-note':'We typically respond within a few hours. ☀',
      'f-success':'Your message has been sent! We\'ll be in touch very soon.',
      'foot-about':'About','foot-rooms':'Rooms','foot-gallery':'Gallery','foot-contact':'Contact',
      'foot-copy':'© 2026 Meltem Pansiyon. Made with love in Sığacık.',
      'foot-city':'Sığacık · Seferihisar · İzmir, Turkey',
    }
  };

  // Map translation keys to DOM elements
  function applyLang(lang) {
    const t = translations[lang];
    const set  = (sel, html)  => { const el = document.querySelector(sel); if (el) el.innerHTML = html; };
    const setTxt = (sel, txt) => { const el = document.querySelector(sel); if (el) el.textContent = txt; };
    const setAttr = (sel, attr, val) => { const el = document.querySelector(sel); if (el) el.setAttribute(attr, val); };
    const setAllTxt = (sel, txts) => {
      document.querySelectorAll(sel).forEach((el, i) => { if (txts[i] !== undefined) el.textContent = txts[i]; });
    };

    // Nav
    const navLinkEls = document.querySelectorAll('.nav__links a');
    if (navLinkEls[0]) navLinkEls[0].textContent = t['nav-about'];
    if (navLinkEls[1]) navLinkEls[1].textContent = t['nav-rooms'];
    if (navLinkEls[2]) navLinkEls[2].textContent = t['nav-gallery'];
    if (navLinkEls[3]) navLinkEls[3].textContent = t['nav-contact'];

    // Mobile menu
    const mobLinks = document.querySelectorAll('.mobile-menu__link');
    if (mobLinks[0]) mobLinks[0].textContent = t['mob-about'];
    if (mobLinks[1]) mobLinks[1].textContent = t['mob-rooms'];
    if (mobLinks[2]) mobLinks[2].textContent = t['mob-gallery'];
    if (mobLinks[3]) mobLinks[3].textContent = t['mob-contact'];

    // Hero
    setTxt('.hero__eyebrow', t['hero-eyebrow']);
    set('.hero__subtitle', t['hero-subtitle']);
    const heroBtns = document.querySelectorAll('.hero__actions .btn');
    if (heroBtns[0]) heroBtns[0].textContent = t['hero-btn1'];
    if (heroBtns[1]) heroBtns[1].textContent = t['hero-btn2'];
    setTxt('.hero__scroll span', t['hero-scroll']);

    // About
    setTxt('.about__content .section__eyebrow', t['about-eyebrow']);
    set('.about__content .section__title', t['about-title']);
    set('.about__lead', t['about-lead']);
    set('.about__text', t['about-text']);
    setTxt('.about__quote', t['about-quote']);
    const featureTexts = document.querySelectorAll('.about__feature');
    const fKeys = ['about-f1','about-f2','about-f3','about-f4'];
    featureTexts.forEach((el, i) => {
      const icon = el.querySelector('.about__feature-icon');
      if (icon) el.innerHTML = icon.outerHTML + ' ' + t[fKeys[i]];
    });
    setTxt('.about__badge span', t['about-badge']);

    // Rooms
    setTxt('.rooms .section__eyebrow', t['rooms-eyebrow']);
    set('.rooms .section__title', t['rooms-title']);
    setTxt('.rooms .section__desc', t['rooms-desc']);
    const cards = document.querySelectorAll('.room-card');
    [['r1','r2','r3']].flat().forEach((prefix, i) => {
      const card = cards[i]; if (!card) return;
      setTxt2(card, '.room-card__tag', t[prefix+'-tag']);
      setTxt2(card, '.room-card__name', t[prefix+'-name']);
      setTxt2(card, '.room-card__desc', t[prefix+'-desc']);
      const lis = card.querySelectorAll('.room-card__features li');
      ['f1','f2','f3','f4'].forEach((f, j) => { if (lis[j]) lis[j].textContent = t[prefix+'-'+f]; });
      const spans = card.querySelectorAll('.room-card__price span');
      if (spans[0]) spans[0].textContent = t[prefix+'-from'];
      if (spans[1]) spans[1].textContent = t[prefix+'-night'];
      const overlayBtn = card.querySelector('.room-card__hover-overlay .btn');
      if (overlayBtn) overlayBtn.textContent = t[prefix+'-book'];
      const resBtn = card.querySelector('.room-card__footer .btn--outline');
      if (resBtn) resBtn.textContent = t[prefix+'-res'];
    });
    const badge = document.querySelector('.room-card__badge');
    if (badge) badge.textContent = t['r2-badge'];

    // Gallery
    setTxt('.gallery .section__eyebrow', t['gal-eyebrow']);
    set('.gallery .section__title', t['gal-title']);
    document.querySelectorAll('.gallery__caption span').forEach((el, i) => {
      el.textContent = t['gal-c'+(i+1)] || el.textContent;
    });

    // Contact
    setTxt('.contact__info .section__eyebrow', t['con-eyebrow']);
    set('.contact__info .section__title', t['con-title']);
    setTxt('.contact__intro', t['con-intro']);
    const detailLabels = document.querySelectorAll('.contact__detail strong');
    if (detailLabels[0]) detailLabels[0].textContent = t['con-addr-label'];
    if (detailLabels[1]) detailLabels[1].textContent = t['con-phone-label'];
    if (detailLabels[2]) detailLabels[2].textContent = t['con-email-label'];
    if (detailLabels[3]) detailLabels[3].textContent = t['con-ci-label'];
    const ciValEl = document.querySelector('.contact__detail:last-of-type p');
    if (ciValEl) ciValEl.textContent = t['con-ci-val'];

    // Form
    setTxt('.contact__form-title', t['form-title']);
    setTxt('label[for="name"]', ''); // rebuild with required star
    const nameLbl = document.querySelector('label[for="name"]');
    if (nameLbl) { nameLbl.innerHTML = t['f-name-lbl'] + ' <span class="required">*</span>'; }
    setAttr('#name','placeholder', t['f-name-ph']);
    const emailLbl = document.querySelector('label[for="email"]');
    if (emailLbl) { emailLbl.innerHTML = t['f-email-lbl'] + ' <span class="required">*</span>'; }
    setAttr('#email','placeholder', t['f-email-ph']);
    setTxt('label[for="phone"]', t['f-phone-lbl']);
    setTxt('label[for="room"]', t['f-room-lbl']);
    const roomSel = document.getElementById('room');
    if (roomSel && roomSel.options[0]) {
      roomSel.options[0].text = t['f-room-ph'];
      if (roomSel.options[1]) roomSel.options[1].text = t['f-r1'];
      if (roomSel.options[2]) roomSel.options[2].text = t['f-r2'];
      if (roomSel.options[3]) roomSel.options[3].text = t['f-r3'];
    }
    setTxt('label[for="checkin"]', t['f-ci-lbl']);
    setTxt('label[for="checkout"]', t['f-co-lbl']);
    const msgLbl = document.querySelector('label[for="message"]');
    if (msgLbl) { msgLbl.innerHTML = t['f-msg-lbl'] + ' <span class="required">*</span>'; }
    setAttr('#message','placeholder', t['f-msg-ph']);
    const submitBtn2 = document.querySelector('.contact__form button[type="submit"] .btn__text');
    if (submitBtn2) submitBtn2.textContent = t['f-submit'];
    setTxt('.form__note', t['f-note']);
    const successEl = document.getElementById('formSuccess');
    if (successEl) {
      const svgEl = successEl.querySelector('svg');
      successEl.innerHTML = (svgEl ? svgEl.outerHTML : '') + ' ' + t['f-success'];
    }

    // Footer
    const footLinks = document.querySelectorAll('.footer__nav a');
    if (footLinks[0]) footLinks[0].textContent = t['foot-about'];
    if (footLinks[1]) footLinks[1].textContent = t['foot-rooms'];
    if (footLinks[2]) footLinks[2].textContent = t['foot-gallery'];
    if (footLinks[3]) footLinks[3].textContent = t['foot-contact'];
    setTxt('.footer__copy', t['foot-copy']);
    setTxt('.footer__brand p', t['foot-city']);

    // Update html lang attribute
    document.documentElement.lang = lang;

    // Persist preference
    localStorage.setItem('meltem-lang', lang);
  }

  function setTxt2(parent, sel, txt) {
    const el = parent.querySelector(sel);
    if (el) el.textContent = txt;
  }

  const langBtns = document.querySelectorAll('.lang-switch__btn');
  langBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const chosen = btn.dataset.lang;
      langBtns.forEach(b => {
        b.classList.toggle('lang-switch__btn--active', b.dataset.lang === chosen);
        b.setAttribute('aria-pressed', b.dataset.lang === chosen ? 'true' : 'false');
      });
      applyLang(chosen);
    });
  });

  // On load: use saved preference or default to TR
  const savedLang = localStorage.getItem('meltem-lang') || 'tr';
  if (savedLang === 'en') {
    langBtns.forEach(b => {
      b.classList.toggle('lang-switch__btn--active', b.dataset.lang === 'en');
      b.setAttribute('aria-pressed', b.dataset.lang === 'en' ? 'true' : 'false');
    });
    applyLang('en');
  }

});
