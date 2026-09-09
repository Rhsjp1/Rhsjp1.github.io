/**
 * RHS AI Solutions — Interactive Features
 * Vanilla JS, no dependencies
 */
(function () {
  'use strict';

  // Mark Tailwind as loaded (disables CSS fallback)
  if (window.tailwind) {
    document.documentElement.classList.add('tw');
  }

  // ============================================
  // Smooth scroll for anchor links
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ============================================
  // Intersection Observer for scroll animations
  // ============================================
  var observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe service cards and about section cards
  document.querySelectorAll('#services .group, #about .bg-gray-900').forEach(function (el, i) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease ' + (i * 0.05) + 's, transform 0.5s ease ' + (i * 0.05) + 's';
    observer.observe(el);
  });

  // ============================================
  // Counter animation for hero stats
  // ============================================
  function animateCounter(el, target, duration) {
    var start = 0;
    var startTime = null;
    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var current = Math.floor(progress * (target - start) + start);
      el.textContent = current + (el.dataset.suffix || '');
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }
    requestAnimationFrame(step);
  }

  var statsObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var num = entry.target.querySelector('.text-2xl');
        if (num && !num.dataset.animated) {
          num.dataset.animated = 'true';
          var text = num.textContent;
          var suffix = text.replace(/[0-9]/g, '');
          var value = parseInt(text, 10);
          num.dataset.suffix = suffix;
          animateCounter(num, value, 1500);
        }
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('#hero-stats > div').forEach(function (el) {
    statsObserver.observe(el);
  });

  // ============================================
  // Console branding
  // ============================================
  console.log(
    '%c Right Hand Services by JP ',
    'background: #D97706; color: #111827; font-weight: bold; padding: 4px 8px; border-radius: 4px;'
  );
  console.log('%c Property Intelligence & Regenerative Landscaping', 'color: #9ca3af;');

})();
