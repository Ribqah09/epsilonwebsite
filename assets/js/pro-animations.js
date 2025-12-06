
/*! Pro Animations (JS)
 * Drop-in utilities for professional, accessible animations.
 * Usage:
 *   <link rel="stylesheet" href="pro-animations.css">
 *   <script src="pro-animations.js" defer></script>
*/
(function () {
  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function throttleRAF(fn) {
    let ticking = false;
    return function (...args) {
      if (!ticking) {
        requestAnimationFrame(() => {
          fn.apply(this, args);
          ticking = false;
        });
        ticking = true;
      }
    };
  }

  const ProAnimate = {
    init(options = {}) {
      this.options = Object.assign({
        once: true,
        root: null,
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.15,
        navSelector: '[data-nav]'
      }, options);

      if (!prefersReduced) {
        this._setupReveal();
        this._setupCounters();
        this._setupParallax();
      } else {
        // Ensure content visible when reduced motion
        document.querySelectorAll('.reveal').forEach(el => {
          el.classList.add('in-view');
        });
      }

      this._setupNavShrink();
      this._setupSmoothScroll();
      this._setupScrollProgress();
      this._setupLogoMarquee();
    },

    _setupReveal() {
      const els = document.querySelectorAll('.reveal');
      if (!els.length) return;

      const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const delay = el.getAttribute('data-delay');
            const stagger = el.getAttribute('data-stagger');
            if (stagger) {
              el.style.setProperty('--stagger', stagger);
            }
            if (delay) {
              el.style.transitionDelay = delay;
            }
            el.classList.add('in-view');
            if (this.options.once) io.unobserve(el);
          }
        });
      }, {
        root: this.options.root,
        rootMargin: this.options.rootMargin,
        threshold: this.options.threshold
      });

      els.forEach(el => io.observe(el));
    },

    _setupNavShrink() {
      const nav = document.querySelector(this.options?.navSelector || '[data-nav]');
      if (!nav) return;
      const onScroll = throttleRAF(() => {
        const y = window.scrollY || window.pageYOffset;
        if (y > 6) nav.classList.add('is-scrolled');
        else nav.classList.remove('is-scrolled');
      });
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
    },

    _setupSmoothScroll() {
      document.addEventListener('click', (e) => {
        const a = e.target.closest('a[href^="#"]');
        if (!a) return;
        const hash = a.getAttribute('href');
        const target = document.querySelector(hash);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' });
        history.pushState(null, '', hash);
      });
    },

    _setupCounters() {
      const els = document.querySelectorAll('[data-count-to]');
      if (!els.length) return;
      const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el = entry.target;
            if (el.__counting) return;
            el.__counting = true;
            const to = parseFloat(el.getAttribute('data-count-to')) || 0;
            const dur = parseInt(el.getAttribute('data-count-duration')) || 1200;
            const fmt = el.getAttribute('data-count-format') || 'integer'; // integer | float | currency
            const decimals = parseInt(el.getAttribute('data-count-decimals')) || 0;
            const start = performance.now();
            const from = parseFloat(el.textContent.replace(/[^0-9.-]/g,'')) || 0;

            function format(val) {
              if (fmt === 'currency') return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
              if (fmt === 'float') return val.toFixed(decimals);
              return Math.round(val).toString();
            }

            function tick(now) {
              const t = Math.min(1, (now - start) / dur);
              // easeOutCubic
              const eased = 1 - Math.pow(1 - t, 3);
              const val = from + (to - from) * eased;
              el.textContent = format(val);
              if (t < 1) requestAnimationFrame(tick);
            }
            requestAnimationFrame(tick);

            io.unobserve(el);
          }
        });
      }, { threshold: 0.4 });
      els.forEach(el => io.observe(el));
    },

    _setupParallax() {
      const els = document.querySelectorAll('[data-parallax]');
      if (!els.length) return;
      const onScroll = throttleRAF(() => {
        const vh = window.innerHeight;
        els.forEach(el => {
          const speed = parseFloat(el.getAttribute('data-parallax')) || 0.1; // 0.05 - 0.3 suggested
          const rect = el.getBoundingClientRect();
          const progress = Math.min(1, Math.max(0, (vh - rect.top) / (vh + rect.height)));
          const y = (progress - 0.5) * 2 * 20 * speed; // max ~20px shift
          el.style.transform = `translateY(${y.toFixed(2)}px)`;
        });
      });
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll);
    },

    _setupScrollProgress() {
      const bar = document.querySelector('#scroll-progress');
      if (!bar) return;
      const onScroll = throttleRAF(() => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        bar.style.width = percent + '%';
      });
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll);
    },

    _setupLogoMarquee() {
      // Duplicate marquee rows to create seamless loop for elements with [data-marquee]
      const rows = document.querySelectorAll('[data-marquee]');
      rows.forEach(row => {
        if (row.__marqueeInit) return;
        row.__marqueeInit = true;
        const speed = parseFloat(row.getAttribute('data-marquee')) || 30; // px/s
        const inner = document.createElement('div');
        inner.style.display = 'inline-flex';
        inner.style.gap = getComputedStyle(row).columnGap || '2rem';
        // Move children into inner twice
        const children = Array.from(row.children);
        children.forEach(ch => inner.appendChild(ch.cloneNode(true)));
        children.forEach(ch => inner.appendChild(ch.cloneNode(true)));
        row.innerHTML = '';
        row.style.overflow = 'hidden';
        row.appendChild(inner);

        let x = 0;
        let last = performance.now();
        function step(now) {
          const dt = (now - last) / 1000;
          last = now;
          x -= speed * dt;
          // reset when scrolled width/2
          const width = inner.scrollWidth / 2;
          if (Math.abs(x) >= width) x = 0;
          inner.style.transform = `translateX(${x}px)`;
          if (!prefersReduced) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    }
  };

  // expose globally
  window.ProAnimate = ProAnimate;

  // auto-init
  document.addEventListener('DOMContentLoaded', () => {
    ProAnimate.init();
  });
})();
