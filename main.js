/* ============================================================
   STARQ — MAIN.JS
   Zero dependências externas
   ============================================================ */

(function () {
  'use strict';

  /* ============================================================
     1. CURSOR CUSTOMIZADO — ANEL COM LERP
     ============================================================ */
  const cursorRing = document.getElementById('cursor-ring');
  const isTouch = window.matchMedia('(pointer: coarse)').matches;

  if (!isTouch && cursorRing) {
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;
    const LERP = 0.12;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    const interactiveSelectors = 'a, button, .btn, .faq-question, .pain-card, .volume-card, .bonus-card, .testimonial-card';

    document.querySelectorAll(interactiveSelectors).forEach(el => {
      el.addEventListener('mouseenter', () => cursorRing.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => cursorRing.classList.remove('cursor-hover'));
    });

    function animateCursor() {
      ringX += (mouseX - ringX) * LERP;
      ringY += (mouseY - ringY) * LERP;
      cursorRing.style.left = ringX + 'px';
      cursorRing.style.top = ringY + 'px';
      requestAnimationFrame(animateCursor);
    }

    animateCursor();
  }

  /* ============================================================
     2. SCROLL PROGRESS BAR
     ============================================================ */
  const scrollBar = document.getElementById('scroll-progress');

  if (scrollBar) {
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      scrollBar.style.width = progress + '%';
    }, { passive: true });
  }

  /* ============================================================
     3. SCROLL REVEAL — INTERSECTIONOBSERVER
     ============================================================ */
  const revealEls = document.querySelectorAll('.reveal');

  if (revealEls.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach((el, index) => {
      el.style.transitionDelay = (index % 4) * 0.08 + 's';
      revealObserver.observe(el);
    });
  }

  /* ============================================================
     4. HERO CANVAS — PARTÍCULAS DOURADAS
     ============================================================ */
  const canvas = document.getElementById('hero-canvas');

  if (canvas) {
    const ctx = canvas.getContext('2d');
    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    const PARTICLE_COUNT = isMobile ? 40 : 100;
    const CONNECTION_DIST = isMobile ? 80 : 140;
    let W, H;
    let particles = [];
    let animId;

    function resize() {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    }

    window.addEventListener('resize', () => {
      resize();
      initParticles();
    });

    function random(min, max) {
      return Math.random() * (max - min) + min;
    }

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x = random(0, W);
        this.y = random(0, H);
        this.vx = random(-0.3, 0.3);
        this.vy = random(-0.3, 0.3);
        this.r = random(1, 2.5);
        this.alpha = random(0.3, 0.65);
        this.alphaDir = random(0.002, 0.006) * (Math.random() > 0.5 ? 1 : -1);
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.alpha += this.alphaDir;
        if (this.alpha > 0.65 || this.alpha < 0.2) this.alphaDir *= -1;
        if (this.x < -10) this.x = W + 10;
        if (this.x > W + 10) this.x = -10;
        if (this.y < -10) this.y = H + 10;
        if (this.y > H + 10) this.y = -10;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201,168,76,${this.alpha})`;
        ctx.fill();
      }
    }

    function initParticles() {
      particles = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
      }
    }

    function drawConnections() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECTION_DIST) {
            const alpha = (1 - dist / CONNECTION_DIST) * 0.15;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(201,168,76,${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    }

    function loop() {
      ctx.clearRect(0, 0, W, H);
      drawConnections();
      particles.forEach(p => { p.update(); p.draw(); });
      animId = requestAnimationFrame(loop);
    }

    resize();
    initParticles();
    loop();

    /* Pausa animação quando hero sai da viewport para performance */
    const heroObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (!animId) loop();
        } else {
          cancelAnimationFrame(animId);
          animId = null;
        }
      });
    }, { threshold: 0 });

    heroObserver.observe(canvas);
  }

  /* ============================================================
     5. PARALLAX NOS NÚMEROS ROMANOS (desktop only)
     ============================================================ */
  if (!isTouch && window.innerWidth >= 1024) {
    const parallaxEls = document.querySelectorAll('.volume-numeral');

    window.addEventListener('scroll', () => {
      parallaxEls.forEach(el => {
        const rect = el.closest('.volume-card').getBoundingClientRect();
        const viewH = window.innerHeight;
        const progress = (viewH - rect.top) / (viewH + rect.height);
        const offset = (progress - 0.5) * 40;
        el.style.transform = `translateY(calc(-50% + ${offset}px))`;
      });
    }, { passive: true });
  }

  /* ============================================================
     6. FAQ ACCORDION
     ============================================================ */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    btn.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';

      /* Fechar todos os outros */
      faqItems.forEach(other => {
        if (other !== item) {
          other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
          other.querySelector('.faq-answer').style.maxHeight = '0';
        }
      });

      if (isOpen) {
        btn.setAttribute('aria-expanded', 'false');
        answer.style.maxHeight = '0';
      } else {
        btn.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  /* ============================================================
     7. SMOOTH SCROLL PARA LINKS ÂNCORA
     ============================================================ */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ============================================================
     8. DELEGAÇÃO DE EVENTOS PARA CURSOR EM NOVOS ELEMENTOS
     ============================================================ */
  if (!isTouch && cursorRing) {
    document.addEventListener('mouseover', (e) => {
      const el = e.target.closest('a, button, .btn');
      if (el) {
        cursorRing.classList.add('cursor-hover');
      }
    });

    document.addEventListener('mouseout', (e) => {
      const el = e.target.closest('a, button, .btn');
      if (el) {
        cursorRing.classList.remove('cursor-hover');
      }
    });
  }

})();
