// =============================
// Main Script — In Like Flynn LLC
// =============================


import './animations/leaves.js';

import './animations/modal.js';


/* =============================
   Fade-In Scroll Animations
============================= */
const fadeSections = document.querySelectorAll('.fade-section');

const observer = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // run once per section
      }
    });
  },
  {
    threshold: 0.2 // triggers when 20% of section is visible
  }
);

fadeSections.forEach(section => observer.observe(section));
