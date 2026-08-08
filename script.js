// ============================================================
// Footer year
// ============================================================
document.getElementById('year').textContent = new Date().getFullYear();

// ============================================================
// Nav: scrolled state + mobile menu + active link highlighting
// ============================================================
const nav = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
const navLinkEls = document.querySelectorAll('[data-nav]');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 10);
  toggleBackToTop();
}, { passive: true });

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.classList.toggle('open', isOpen);
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

// Close mobile menu after a link is tapped
navLinkEls.forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// Active section highlighting via IntersectionObserver
const sections = document.querySelectorAll('main section[id]');
const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinkEls.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

sections.forEach(section => navObserver.observe(section));

// ============================================================
// Scroll reveal animations
// ============================================================
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      obs.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealEls.forEach(el => revealObserver.observe(el));

// ============================================================
// Hero typewriter effect (purely decorative, respects reduced motion)
// ============================================================
const typewriterEl = document.getElementById('typewriter');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const typewriterText = "Hariharan D | B.Sc IT Student | Coimbatore";

function typeWriter(el, text, speed = 45) {
  let i = 0;
  el.textContent = '';
  (function step() {
    if (i < text.length) {
      el.textContent += text.charAt(i);
      i++;
      setTimeout(step, speed);
    }
  })();
}

if (typewriterEl) {
  if (prefersReducedMotion) {
    typewriterEl.textContent = typewriterText;
  } else {
    // Start once the hero is visible
    setTimeout(() => typeWriter(typewriterEl, typewriterText), 500);
  }
}

// ============================================================
// Back to top button
// ============================================================
const backToTop = document.getElementById('backToTop');
function toggleBackToTop() {
  backToTop.classList.toggle('show', window.scrollY > 480);
}
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
});

// ============================================================
// Contact form validation (client-side only — see form note in HTML)
// ============================================================
const form = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

const validators = {
  name: (v) => v.trim().length >= 2 || 'Please enter your name.',
  email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || 'Please enter a valid email address.',
  subject: (v) => v.trim().length >= 3 || 'Please enter a subject.',
  message: (v) => v.trim().length >= 10 || 'Message should be at least 10 characters.'
};

function validateField(field) {
  const input = form.elements[field];
  const errorEl = document.getElementById(`err-${field}`);
  const result = validators[field](input.value);
  const row = input.closest('.form-row');

  if (result === true) {
    row.classList.remove('invalid');
    errorEl.textContent = '';
    return true;
  } else {
    row.classList.add('invalid');
    errorEl.textContent = result;
    return false;
  }
}

Object.keys(validators).forEach(field => {
  const input = form.elements[field];
  input.addEventListener('blur', () => validateField(field));
  input.addEventListener('input', () => {
    if (input.closest('.form-row').classList.contains('invalid')) {
      validateField(field);
    }
  });
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const allValid = Object.keys(validators)
    .map(validateField)
    .every(Boolean);

  if (!allValid) {
    formStatus.textContent = '';
    return;
  }

  // No backend is connected — see the note in the form.
  // Swap this block for a real fetch() call to your form service or API.
  formStatus.textContent = 'Thanks! This demo form validated your message, but a backend needs to be connected to actually send it.';
  form.reset();
});
