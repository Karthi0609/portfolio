/**
 * KARTHIKEYAN S – PORTFOLIO INTERACTIVE ENGINE (Vanilla ES6+)
 * Features: Preloader, Desktop Custom Cursor, Canvas Ambient Network,
 * 3D Mouse Tilt & Spotlight, Typing Animation, Scroll Reveal, Counters,
 * Interactive Experience Timeline, Skill Inspector & Filter, Project Filtering
 * & Detail Modal, Contact Form Validation, Scroll-Spy & Back-to-Top Ring.
 */
'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initCustomCursor();
  initAmbientCanvas();
  initHeaderAndScrollSpy();
  initMobileDrawerNav();
  initTypingEffect();
  initScrollReveal();
  initCounters();
  init3DTiltAndSpotlight();
  initSkillInteractions();
  initExperienceTimeline();
  initProjectsFilterAndModal();
  initCertificateModal();
  initContactForm();
  initBackToTop();

  const yearEl = document.getElementById('currentYear');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
});

/* --------------------------------------------------------------------------
   1. Custom Preloader
   -------------------------------------------------------------------------- */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  const bar = document.getElementById('preloaderBar');
  if (!preloader) return;

  let progress = 0;
  const tick = setInterval(() => {
    progress = Math.min(progress + 22, 92);
    if (bar) bar.style.width = `${progress}%`;
  }, 60);

  const finish = () => {
    clearInterval(tick);
    if (bar) bar.style.width = '100%';
    setTimeout(() => {
      preloader.classList.add('is-hidden');
    }, 240);
  };

  if (document.readyState === 'complete') {
    finish();
  } else {
    window.addEventListener('load', finish, { once: true });
    setTimeout(finish, 1400); // Safety cap so preloader never blocks content
  }
}

/* --------------------------------------------------------------------------
   2. Custom Cursor (Desktop Fine Pointer Only)
   -------------------------------------------------------------------------- */
function initCustomCursor() {
  const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!isFinePointer || prefersReduced) return;

  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;

  document.body.classList.add('custom-cursor-enabled');

  let mouseX = -100;
  let mouseY = -100;
  let ringX = -100;
  let ringY = -100;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
  }, { passive: true });

  const renderRing = () => {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
    requestAnimationFrame(renderRing);
  };
  requestAnimationFrame(renderRing);

  const interactiveSelector = 'a, button, .skill-card, .project-card, input, textarea';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(interactiveSelector)) {
      ring.classList.add('is-hovering');
    }
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(interactiveSelector)) {
      ring.classList.remove('is-hovering');
    }
  });
}

/* --------------------------------------------------------------------------
   3. Lightweight Ambient Constellation Canvas
   -------------------------------------------------------------------------- */
function initAmbientCanvas() {
  const canvas = document.getElementById('bgCanvas');
  if (!canvas) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = 0;
  let height = 0;
  let nodes = [];
  const palette = ['rgba(255, 94, 26, 0.55)', 'rgba(0, 229, 255, 0.55)', 'rgba(139, 92, 246, 0.55)'];

  const resize = () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    const targetCount = width < 768 ? 22 : 42;
    nodes = Array.from({ length: targetCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.8 + 1.1,
      color: palette[Math.floor(Math.random() * palette.length)]
    }));
  };

  resize();
  window.addEventListener('resize', resize, { passive: true });

  const draw = () => {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      a.x += a.vx;
      a.y += a.vy;
      if (a.x < 0 || a.x > width) a.vx *= -1;
      if (a.y < 0 || a.y > height) a.vy *= -1;

      ctx.beginPath();
      ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
      ctx.fillStyle = a.color;
      ctx.fill();

      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 140) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(148, 163, 184, ${(1 - dist / 140) * 0.14})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  };
  requestAnimationFrame(draw);
}

/* --------------------------------------------------------------------------
   4. Sticky Header & Scroll-Spy Navigation
   -------------------------------------------------------------------------- */
function initHeaderAndScrollSpy() {
  const header = document.getElementById('siteHeader');
  const navLinks = document.querySelectorAll('#desktopNav .nav-link');
  const sections = document.querySelectorAll('main section[id]');

  const onScroll = () => {
    const scrollY = window.scrollY;
    if (header) {
      header.classList.toggle('is-scrolled', scrollY > 30);
    }

    let currentId = 'hero';
    sections.forEach((sec) => {
      const top = sec.offsetTop - 130;
      if (scrollY >= top) {
        currentId = sec.id;
      }
    });

    navLinks.forEach((link) => {
      const href = link.getAttribute('href');
      link.classList.toggle('active', href === `#${currentId}`);
    });
  };

  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* --------------------------------------------------------------------------
   4b. Mobile Drawer Navigation (Close Offcanvas Before Scrolling)
   -------------------------------------------------------------------------- */
function initMobileDrawerNav() {
  const drawerEl = document.getElementById('mobileNavDrawer');
  const headerEl = document.getElementById('siteHeader');
  const links = document.querySelectorAll('#mobileNavDrawer .mobile-nav-link');
  if (!drawerEl || !links.length) return;

  links.forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || !href.startsWith('#')) return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const scrollToTarget = () => {
        if (document.activeElement && document.activeElement.classList.contains('mobile-menu-toggle')) {
          document.activeElement.blur();
        }
        const offset = (headerEl ? headerEl.offsetHeight : 72) + 12;
        const top = Math.max(0, target.getBoundingClientRect().top + window.scrollY - offset);
        window.scrollTo({ top, behavior: 'smooth' });
      };

      if (typeof bootstrap !== 'undefined') {
        const instance = bootstrap.Offcanvas.getOrCreateInstance(drawerEl);
        drawerEl.addEventListener('hidden.bs.offcanvas', () => {
          setTimeout(scrollToTarget, 60);
        }, { once: true });
        instance.hide();
      } else {
        scrollToTarget();
      }
    });
  });
}

/* --------------------------------------------------------------------------
   5. Hero Typing Animation
   -------------------------------------------------------------------------- */
function initTypingEffect() {
  const target = document.getElementById('typingText');
  if (!target) return;

  const phrases = [
    'Spring Boot & Java 8 Services',
    'Scalable REST APIs & MySQL',
    'Hibernate / JPA Persistence',
    'Authentication & Linux Deployment',
    'AI & n8n Workflow Automation'
  ];

  let phraseIdx = 0;
  let charIdx = 0;
  let isDeleting = false;

  const tick = () => {
    const current = phrases[phraseIdx];
    if (isDeleting) {
      charIdx--;
      target.textContent = current.slice(0, charIdx);
    } else {
      charIdx++;
      target.textContent = current.slice(0, charIdx);
    }

    let delay = isDeleting ? 34 : 62;
    if (!isDeleting && charIdx === current.length) {
      delay = 1650;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      delay = 340;
    }
    setTimeout(tick, delay);
  };
  tick();
}

/* --------------------------------------------------------------------------
   6. Scroll Reveal Animations (IntersectionObserver)
   -------------------------------------------------------------------------- */
function initScrollReveal() {
  const els = document.querySelectorAll('.reveal-up');
  if (!els.length) return;

  if (!('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('is-revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const delay = Number(entry.target.dataset.delay || 0);
        setTimeout(() => entry.target.classList.add('is-revealed'), delay);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });

  els.forEach((el) => observer.observe(el));
}

/* --------------------------------------------------------------------------
   7. Animated Counters (Verified Statistics Only)
   -------------------------------------------------------------------------- */
function initCounters() {
  const counters = document.querySelectorAll('.counter');
  if (!counters.length) return;

  const animateCounter = (el) => {
    const target = parseInt(el.dataset.target || '0', 10);
    const duration = 900;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = String(Math.round(eased * target));
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = String(target);
      }
    };
    requestAnimationFrame(step);
  };

  if (!('IntersectionObserver' in window)) {
    counters.forEach(animateCounter);
    return;
  }

  const obs = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  counters.forEach((c) => obs.observe(c));
}

/* --------------------------------------------------------------------------
   8. Subtle Mouse-Based 3D Tilt & Card Spotlight
   -------------------------------------------------------------------------- */
function init3DTiltAndSpotlight() {
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!canHover || reduced) return;

  const cards = document.querySelectorAll('.tilt-card');
  cards.forEach((card) => {
    const maxTilt = Number(card.dataset.tiltMax || 8);

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const pctX = x / rect.width;
      const pctY = y / rect.height;

      const rotateY = (pctX - 0.5) * maxTilt * 2;
      const rotateX = (0.5 - pctY) * maxTilt * 2;

      card.style.setProperty('--mx', `${x}px`);
      card.style.setProperty('--my', `${y}px`);
      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* --------------------------------------------------------------------------
   9. Interactive Skill Filtering & Skill Inspector
   -------------------------------------------------------------------------- */
function initSkillInteractions() {
  const filterBtns = document.querySelectorAll('[data-skill-filter]');
  const cards = document.querySelectorAll('#skillsGrid .skill-card');
  const inspectorTitle = document.getElementById('inspectorTitle');
  const inspectorDesc = document.getElementById('inspectorDesc');

  const skillDetails = {
    'Java 8': 'Core object-oriented backend engineering using Streams, Lambdas, Collections, and exception handling.',
    'Spring Boot': 'Rapid production-grade REST service creation, dependency injection, auto-configuration, and layered architecture.',
    'Spring MVC': 'Structured controller routing, request validation, and clean separation between web and service layers.',
    'Hibernate / JPA': 'Entity relationship mapping, JPQL queries, transaction management, and relational persistence.',
    'REST APIs': 'Clean JSON API contract design, HTTP status semantics, authentication integration, and payload validation.',
    'MySQL': 'Normalized relational schema modeling, joins, indexing, and transactional data integrity.',
    'SQL': 'Structured query authoring, aggregations, constraints, and database debugging.',
    'JavaScript': 'Interactive DOM behavior, asynchronous API calls, form validation, and UI micro-interactions.',
    'HTML5': 'Accessible semantic document structure and SEO-friendly markup.',
    'CSS3': 'Modern Flexbox/Grid layouts, glassmorphism, custom properties, and CSS 3D animations.',
    'Bootstrap 5': 'Responsive grid orchestration, accessible modals, offcanvas drawers, and utility styling.',
    'Git': 'Branching workflows, pull requests, conflict resolution, and clean commit history.',
    'Maven': 'Dependency management, multi-module builds, and repeatable Java packaging.',
    'Postman': 'Endpoint testing, environment collections, auth headers, and API contract verification.',
    'JIRA': 'Sprint tracking, issue lifecycle collaboration, and agile delivery alignment.',
    'Linux': 'Server navigation, application deployment, process inspection, and production log diagnostics.',
    'PuTTY': 'Secure SSH remote access to Linux deployment environments.',
    'Cursor': 'AI-assisted refactoring, rapid code exploration, and accelerated feature delivery.',
    'Claude Code': 'Agentic CLI-assisted debugging, architecture review, and structured implementation.',
    'Google Antigravity': 'Agentic development workflows for end-to-end engineering velocity.',
    'n8n': 'Visual workflow automation connecting APIs, webhooks, and notification pipelines.',
    'Generative AI Fundamentals': 'Prompt design, LLM workflow integration, and AI-augmented automation systems.'
  };

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.skillFilter;

      cards.forEach((card) => {
        const match = cat === 'all' || card.dataset.category === cat;
        card.classList.toggle('is-hidden', !match);
      });
    });
  });

  const inspectCard = (card) => {
    cards.forEach((c) => c.classList.remove('is-active'));
    card.classList.add('is-active');
    const name = card.querySelector('.skill-name')?.textContent?.trim() || '';
    if (inspectorTitle) inspectorTitle.textContent = name;
    if (inspectorDesc) {
      inspectorDesc.textContent = skillDetails[name] || 'Core technology applied in production backend engineering.';
    }
  };

  cards.forEach((card) => {
    card.addEventListener('mouseenter', () => inspectCard(card));
    card.addEventListener('click', () => inspectCard(card));
    card.addEventListener('focus', () => inspectCard(card));
  });
}

/* --------------------------------------------------------------------------
   10. Interactive Experience Timeline
   -------------------------------------------------------------------------- */
function initExperienceTimeline() {
  const experiences = [
    {
      period: 'May 2026 – Present',
      role: 'Software Developer',
      company: 'Techsphere Consultancy Services',
      companyUrl: 'https://techsphereconsultancy.com/',
      companyLabel: 'techsphereconsultancy.com',
      step: '01 / 03',
      progress: '33%',
      summary: 'Developing and maintaining scalable backend services and RESTful APIs using Java and Spring Boot, ensuring clean data persistence, secure access controls, and production stability.',
      highlights: [
        'Designing modular Spring Boot backend services and clean REST API endpoints.',
        'Managing relational persistence with Hibernate/JPA and MySQL.',
        'Implementing authentication, authorization, and third-party API integrations.',
        'Supporting Linux server deployments and API verification via Postman & Git workflows.'
      ],
      tags: ['Java 8', 'Spring Boot', 'REST APIs', 'MySQL', 'Hibernate/JPA', 'Linux']
    },
    {
      period: 'November 2025 – May 2026',
      role: 'Software Developer',
      company: 'Effitrix Systems Pvt. Ltd.',
      step: '02 / 03',
      progress: '68%',
      summary: 'Engineered Java backend modules, relational database schemas, and authenticated API workflows, collaborating across agile sprints to deliver reliable business features.',
      highlights: [
        'Built and enhanced Java & Spring Boot services powering core application workflows.',
        'Implemented authentication and role-based authorization rules for protected APIs.',
        'Integrated external APIs and validated endpoints thoroughly using Postman.',
        'Collaborated via Git and JIRA while deploying updates to Linux environments via PuTTY.'
      ],
      tags: ['Java 8', 'Spring Boot', 'Spring MVC', 'MySQL', 'Postman', 'JIRA', 'PuTTY']
    },
    {
      period: 'December 2024 – October 2025',
      role: 'Java Developer',
      company: 'Inovatrik Technologies',
      step: '03 / 03',
      progress: '100%',
      summary: 'Started professional backend engineering journey delivering Java 8 services, Hibernate/JPA data models, MySQL queries, and REST APIs for web platforms.',
      highlights: [
        'Developed backend controllers, service logic, and repository layers in Java & Spring Boot.',
        'Configured Hibernate/JPA entities and optimized MySQL queries for structured workflows.',
        'Built responsive frontend views when needed using HTML5, CSS3, Bootstrap 5, and JavaScript.',
        'Maintained versioned codebases with Git and Maven build lifecycles.'
      ],
      tags: ['Java 8', 'Spring Boot', 'Hibernate/JPA', 'MySQL', 'SQL', 'Maven', 'Git']
    }
  ];

  const nodes = document.querySelectorAll('#timelineNav .timeline-node');
  const progressBar = document.getElementById('timelineProgress');
  const periodBadge = document.getElementById('expPeriodBadge');
  const roleTitle = document.getElementById('expRoleTitle');
  const companyName = document.getElementById('expCompanyName');
  const companyLink = document.getElementById('expCompanyLink');
  const stepIndex = document.getElementById('expStepIndex');
  const summaryEl = document.getElementById('expSummary');
  const highlightsEl = document.getElementById('expHighlights');
  const tagsEl = document.getElementById('expTags');
  const prevBtn = document.getElementById('expPrevBtn');
  const nextBtn = document.getElementById('expNextBtn');

  if (!nodes.length) return;
  let activeIndex = 0;

  const renderExperience = (idx) => {
    activeIndex = idx;
    const item = experiences[idx];

    nodes.forEach((n, i) => {
      const isActive = i === idx;
      n.classList.toggle('active', isActive);
      n.setAttribute('aria-selected', String(isActive));
    });

    if (progressBar) progressBar.style.height = item.progress;
    if (periodBadge) periodBadge.textContent = item.period;
    if (roleTitle) roleTitle.textContent = item.role;
    if (companyName) companyName.textContent = item.company;
    if (companyLink) {
      if (item.companyUrl) {
        companyLink.href = item.companyUrl;
        companyLink.querySelector('span').textContent = item.companyLabel || item.companyUrl;
        companyLink.classList.remove('d-none');
        companyLink.classList.add('d-inline-flex');
      } else {
        companyLink.classList.add('d-none');
        companyLink.classList.remove('d-inline-flex');
      }
    }
    if (stepIndex) stepIndex.textContent = item.step;
    if (summaryEl) summaryEl.textContent = item.summary;

    if (highlightsEl) {
      highlightsEl.innerHTML = item.highlights
        .map((h) => `<li><i class="bi bi-check2-circle text-accent-cyan"></i><span>${h}</span></li>`)
        .join('');
    }

    if (tagsEl) {
      tagsEl.innerHTML = item.tags.map((t) => `<span class="tech-tag">${t}</span>`).join('');
    }

    if (prevBtn) prevBtn.disabled = idx === 0;
    if (nextBtn) nextBtn.disabled = idx === experiences.length - 1;
  };

  nodes.forEach((node) => {
    node.addEventListener('click', () => {
      const idx = parseInt(node.dataset.expIndex || '0', 10);
      renderExperience(idx);
    });
  });

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (activeIndex > 0) renderExperience(activeIndex - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (activeIndex < experiences.length - 1) renderExperience(activeIndex + 1);
    });
  }

  renderExperience(0);
}

/* --------------------------------------------------------------------------
   11. Project Filtering & Detail Modal
   -------------------------------------------------------------------------- */
function initProjectsFilterAndModal() {
  const filterBtns = document.querySelectorAll('[data-project-filter]');
  const items = document.querySelectorAll('#projectsGrid .project-item');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.projectFilter;

      items.forEach((item) => {
        const tags = (item.dataset.tags || '').split(' ');
        const match = filter === 'all' || tags.includes(filter);
        item.classList.toggle('is-hidden', !match);
      });
    });
  });

  const projectsData = {
    rydo: {
      title: 'RYDO – Second-Hand Bike Marketplace',
      status: 'IMPLEMENTED PROJECT',
      img: 'assets/images/rydo.jpg',
      desc: 'A backend-driven marketplace platform for buying and selling second-hand motorcycles. Built on a clean Spring Boot architecture with Hibernate/JPA entity modeling, MySQL relational persistence, and RESTful API endpoints.',
      heading: 'Implemented Capabilities',
      features: [
        'RESTful APIs for bike catalog listings, filtering, and marketplace workflows.',
        'Hibernate/JPA ORM entity design mapped to a normalized MySQL database.',
        'Structured Spring Boot service and controller layers for maintainable scaling.',
        'API contract verification and request/response testing with Postman.'
      ],
      tags: ['Java', 'Spring Boot', 'Hibernate/JPA', 'MySQL', 'REST APIs'],
      notice: ''
    },
    kirusa: {
      title: 'Kirusa Celebrity Booking Platform',
      status: 'IMPLEMENTED PROJECT',
      img: 'assets/images/kirusa.jpg',
      desc: 'A structured celebrity and talent booking backend system engineered with Java, Spring Boot, Hibernate, and MySQL to manage profiles, booking schedules, and transactional workflows.',
      heading: 'Implemented Capabilities',
      features: [
        'Spring Boot backend modules managing celebrity profiles and booking requests.',
        'Hibernate persistence layer ensuring relational consistency in MySQL.',
        'Role-aware booking status management and clean API data contracts.'
      ],
      tags: ['Java', 'Spring Boot', 'Hibernate', 'MySQL'],
      notice: ''
    },
    pensioner: {
      title: 'Pensioner Management System',
      status: 'IMPLEMENTED PROJECT',
      img: 'assets/images/pensioner.jpg',
      desc: 'A secure Java-based record management system built to handle pensioner data administration, authenticated user access, and automated email notifications.',
      heading: 'Implemented Capabilities',
      features: [
        'Structured relational database management for pensioner records.',
        'Authentication and authorization controls to safeguard sensitive records.',
        'Automated email notification workflows for status updates and alerts.'
      ],
      tags: ['Java', 'Database Management', 'Authentication', 'Email Notifications'],
      notice: ''
    },
    'xl-fashion': {
      title: 'XL Fashion Trends – Billing Management System',
      status: 'CORE FEATURES IMPLEMENTED • ONGOING ENHANCEMENTS',
      img: 'assets/images/xl-fashion.jpg',
      desc: 'Retail billing management system designed for apparel operations. Only core implemented billing features are presented as complete, while extended reporting and inventory modules remain ongoing work.',
      heading: 'Implemented vs. Ongoing Scope',
      features: [
        'Implemented: Core billing workflow, itemized invoice generation, and billing record persistence.',
        'Implemented: Customer billing lookup and structured relational database storage.',
        'Ongoing Work: Extended inventory synchronization and advanced reporting modules.'
      ],
      tags: ['Java', 'Spring Boot', 'MySQL', 'Billing Workflows'],
      notice: 'Transparency Note: Core billing and invoice generation features are implemented; extended stock and reporting modules are currently ongoing work.'
    },
    'ai-job-hunter': {
      title: 'AI Job Hunter – Job Application Automation',
      status: 'UNDER DEVELOPMENT',
      img: 'assets/images/ai-job-hunter.jpg',
      desc: 'An intelligent job-application automation project currently under active development, combining n8n workflow orchestration, REST API integrations, and Generative AI fundamentals.',
      heading: 'Current Development Scope',
      features: [
        'Under Development: Automated job discovery and pipeline tracking via n8n workflows.',
        'Under Development: Generative AI-assisted role matching and application tailoring.',
        'Under Development: Structured status tracking and notification triggers.'
      ],
      tags: ['n8n', 'Generative AI Fundamentals', 'REST APIs', 'Automation'],
      notice: 'Development Status: This project is currently under development and actively being iterated on.'
    }
  };

  const modalEl = document.getElementById('projectDetailModal');
  if (!modalEl || typeof bootstrap === 'undefined') return;
  const bsModal = new bootstrap.Modal(modalEl);

  const mTitle = document.getElementById('modalProjectTitle');
  const mStatus = document.getElementById('modalProjectStatus');
  const mImg = document.getElementById('modalProjectImg');
  const mDesc = document.getElementById('modalProjectDesc');
  const mHeading = document.getElementById('modalListHeading');
  const mFeatures = document.getElementById('modalProjectFeatures');
  const mTags = document.getElementById('modalProjectTags');
  const mNotice = document.getElementById('modalOngoingNotice');
  const mNoticeText = document.getElementById('modalOngoingText');

  document.querySelectorAll('.view-project-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.project;
      const data = projectsData[key];
      if (!data) return;

      if (mTitle) mTitle.textContent = data.title;
      if (mStatus) mStatus.textContent = data.status;
      if (mImg) {
        mImg.src = data.img;
        mImg.alt = `${data.title} preview`;
      }
      if (mDesc) mDesc.textContent = data.desc;
      if (mHeading) mHeading.textContent = data.heading;
      if (mFeatures) {
        mFeatures.innerHTML = data.features
          .map((f) => `<li><i class="bi bi-check2-circle text-accent-cyan"></i><span>${f}</span></li>`)
          .join('');
      }
      if (mTags) {
        mTags.innerHTML = data.tags.map((t) => `<span class="tech-tag">${t}</span>`).join('');
      }
      if (mNotice && mNoticeText) {
        if (data.notice) {
          mNoticeText.textContent = data.notice;
          mNotice.classList.remove('d-none');
        } else {
          mNotice.classList.add('d-none');
        }
      }

      bsModal.show();
    });
  });
}

/* --------------------------------------------------------------------------
   11b. Certificate Lightbox Modal
   -------------------------------------------------------------------------- */
function initCertificateModal() {
  const modalEl = document.getElementById('certificateModal');
  if (!modalEl || typeof bootstrap === 'undefined') return;

  const bsModal = new bootstrap.Modal(modalEl);
  const cImg = document.getElementById('certModalImg');
  const cTitle = document.getElementById('certModalTitle');
  const cIssuer = document.getElementById('certModalIssuer');
  const cMeta = document.getElementById('certModalMeta');

  document.querySelectorAll('.cert-trigger').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (cImg) {
        cImg.src = btn.dataset.certImg || '';
        cImg.alt = btn.dataset.certTitle || 'Certificate preview';
      }
      if (cTitle) cTitle.textContent = btn.dataset.certTitle || '';
      if (cIssuer) cIssuer.textContent = btn.dataset.certIssuer || '';
      if (cMeta) cMeta.textContent = btn.dataset.certMeta || '';
      bsModal.show();
    });
  });
}

/* --------------------------------------------------------------------------
   12. Contact Form Validation
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const feedback = document.getElementById('formFeedback');
  if (!form || !feedback) return;

  const nameInput = document.getElementById('contactName');
  const emailInput = document.getElementById('contactEmail');
  const subjectInput = document.getElementById('contactSubject');
  const messageInput = document.getElementById('contactMessage');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  const validateField = (input, isValid) => {
    input.classList.toggle('is-invalid', !isValid);
    input.classList.toggle('is-valid', isValid);
    return isValid;
  };

  [nameInput, emailInput, subjectInput, messageInput].forEach((input) => {
    if (!input) return;
    input.addEventListener('input', () => {
      if (input === emailInput) {
        validateField(input, emailRegex.test(input.value.trim()));
      } else {
        const minLen = Number(input.getAttribute('minlength') || 2);
        validateField(input, input.value.trim().length >= minLen);
      }
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const vName = validateField(nameInput, nameInput.value.trim().length >= 2);
    const vEmail = validateField(emailInput, emailRegex.test(emailInput.value.trim()));
    const vSubject = validateField(subjectInput, subjectInput.value.trim().length >= 3);
    const vMsg = validateField(messageInput, messageInput.value.trim().length >= 10);

    if (!vName || !vEmail || !vSubject || !vMsg) {
      feedback.classList.add('d-none');
      return;
    }

    const senderName = nameInput.value.trim();
    feedback.className = 'form-status-box form-status-success mt-4';
    feedback.innerHTML = `<i class="bi bi-check-circle-fill me-2"></i>Thank you, <strong>${escapeHtml(senderName)}</strong>! Your inquiry has been validated and prepared. You can also connect directly via LinkedIn or GitHub.`;

    form.reset();
    [nameInput, emailInput, subjectInput, messageInput].forEach((i) => {
      i.classList.remove('is-valid', 'is-invalid');
    });
  });
}

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, (ch) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[ch]));
}

/* --------------------------------------------------------------------------
   13. Back-to-Top Button with Scroll Progress Ring
   -------------------------------------------------------------------------- */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  const ring = document.getElementById('scrollProgressRing');
  if (!btn) return;

  const circumference = 2 * Math.PI * 20; // r=20 -> ~125.66

  const updateScroll = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;

    btn.classList.toggle('is-visible', scrollTop > 320);

    if (ring) {
      ring.style.strokeDashoffset = String(circumference * (1 - pct));
    }
  };

  window.addEventListener('scroll', updateScroll, { passive: true });
  updateScroll();

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
