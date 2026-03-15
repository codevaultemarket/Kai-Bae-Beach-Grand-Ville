/* ================================================
   KAI BAE BEACH GRAND VILLE — script.js
   ================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- 1. NAVBAR: scroll effect + mobile toggle ---- */
  const navbar   = document.getElementById('navbar');
  const navLinks = document.getElementById('navLinks');
  const navToggle = document.getElementById('navToggle');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });

  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    navToggle.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  // Close mobile menu when a link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Close mobile menu on outside click
  document.addEventListener('click', (e) => {
    if (navLinks.classList.contains('open') && !navbar.contains(e.target)) {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  /* ---- 2. SMOOTH SCROLL for anchor links ---- */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = navbar.offsetHeight + 10;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ---- 3. INTERSECTION OBSERVER: room cards ---- */
  const roomCards = document.querySelectorAll('.room-card[data-aos]');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, i * 120);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    roomCards.forEach(card => observer.observe(card));
  } else {
    roomCards.forEach(card => card.classList.add('visible'));
  }

  /* ---- 4. GALLERY LIGHTBOX ---- */
  const lightbox     = document.getElementById('lightbox');
  const lightboxImg  = document.getElementById('lightboxImg');
  const lightboxCap  = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
  let currentIndex = 0;

  function openLightbox(index) {
    currentIndex = index;
    const item = galleryItems[index];
    const img = item.querySelector('img');
    const cap = item.querySelector('.gallery-overlay span');
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCap.textContent = cap ? cap.textContent : '';
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    lightboxImg.src = '';
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
    openLightbox(currentIndex);
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % galleryItems.length;
    openLightbox(currentIndex);
  }

  galleryItems.forEach((item, i) => {
    item.addEventListener('click', () => openLightbox(i));
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', (e) => { e.stopPropagation(); showPrev(); });
  lightboxNext.addEventListener('click', (e) => { e.stopPropagation(); showNext(); });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowLeft')  showPrev();
    if (e.key === 'ArrowRight') showNext();
  });

  /* ---- 5. BOOKING FORM ---- */
  const form = document.getElementById('bookingForm');
  const formSuccess = document.getElementById('formSuccess');

  // Set min date to today for date inputs
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('fcheckin').min = today;
  document.getElementById('fcheckout').min = today;

  document.getElementById('fcheckin').addEventListener('change', (e) => {
    document.getElementById('fcheckout').min = e.target.value;
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Basic validation
    const name    = form.querySelector('[name="name"]').value.trim();
    const email   = form.querySelector('[name="email"]').value.trim();
    const checkin = form.querySelector('[name="checkin"]').value;
    const checkout = form.querySelector('[name="checkout"]').value;
    const guests  = form.querySelector('[name="guests"]').value;
    const room    = form.querySelector('[name="room"]').value;

    if (!name || !email || !checkin || !checkout || !guests || !room) {
      showFormError('Please fill in all required fields.');
      return;
    }

    if (!isValidEmail(email)) {
      showFormError('Please enter a valid email address.');
      return;
    }

    if (new Date(checkout) <= new Date(checkin)) {
      showFormError('Check-out date must be after check-in date.');
      return;
    }

    // Simulate sending (no backend)
    const btnText   = form.querySelector('.btn-text');
    const btnLoader = form.querySelector('.btn-loader');
    const submitBtn = form.querySelector('.btn-submit');

    btnText.style.display  = 'none';
    btnLoader.style.display = 'inline';
    submitBtn.disabled = true;

    setTimeout(() => {
      form.style.display = 'none';
      formSuccess.style.display = 'block';
      formSuccess.style.animation = 'fadeIn .5s ease';
    }, 1600);
  });

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showFormError(msg) {
    let err = form.querySelector('.form-error');
    if (!err) {
      err = document.createElement('p');
      err.className = 'form-error';
      err.style.cssText = 'color:#e53e3e;font-size:.85rem;margin-bottom:.5rem;padding:.6rem 1rem;background:#fff5f5;border-radius:6px;border-left:3px solid #e53e3e;';
      form.insertBefore(err, form.querySelector('.btn-submit'));
    }
    err.textContent = msg;
    err.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    setTimeout(() => err.remove(), 5000);
  }

  /* ---- 6. ACTIVE NAV LINK on scroll ---- */
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navAnchors.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(sec => sectionObserver.observe(sec));

  /* ---- 7. Add CSS for active nav state ---- */
  const style = document.createElement('style');
  style.textContent = `.nav-links a.active { color: var(--sand-l) !important; }`;
  document.head.appendChild(style);

  /* ---- 8. Lazy fade-in for facility cards on scroll ---- */
  const facilityCards = document.querySelectorAll('.facility-card');
  if ('IntersectionObserver' in window) {
    facilityCards.forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      card.style.transition = 'opacity .5s ease, transform .5s ease';
    });
    const facObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, (Array.from(facilityCards).indexOf(entry.target) % 4) * 80);
          facObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    facilityCards.forEach(card => facObserver.observe(card));
  }

  /* ---- 9. Review cards entrance ---- */
  const reviewCards = document.querySelectorAll('.review-card');
  if ('IntersectionObserver' in window) {
    reviewCards.forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(24px)';
      card.style.transition = 'opacity .55s ease, transform .55s ease';
    });
    const revObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const i = Array.from(reviewCards).indexOf(entry.target);
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, i * 100);
          revObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    reviewCards.forEach(card => revObserver.observe(card));
  }

  /* ---- 10. Gallery entrance ---- */
  const galleryImgs = document.querySelectorAll('.gallery-item');
  if ('IntersectionObserver' in window) {
    galleryImgs.forEach(item => {
      item.style.opacity = '0';
      item.style.transform = 'scale(0.95)';
      item.style.transition = 'opacity .5s ease, transform .5s ease';
    });
    const galObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const i = Array.from(galleryImgs).indexOf(entry.target);
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'scale(1)';
          }, (i % 4) * 80);
          galObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    galleryImgs.forEach(item => galObserver.observe(item));
  }

  /* ---- 11. Touch swipe for lightbox ---- */
  let touchStartX = 0;
  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  });
  lightbox.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) {
      dx < 0 ? showNext() : showPrev();
    }
  });

  console.log('✦ Kai Bae Beach Grand Ville website loaded successfully.');
});
