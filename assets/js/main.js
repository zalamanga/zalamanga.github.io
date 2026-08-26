function initPortfolio() {
  // ============ Smooth scroll (Lenis) ============
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
  
    gsap.registerPlugin(ScrollTrigger);
    lenis.on('scroll', ScrollTrigger.update);
  
    // ============ Custom cursor ============
    // Disabled for performance. Set this to true and uncomment the CSS block in
    // assets/css/styles.css if you want the animated cursor back.
    const CUSTOM_CURSOR_ENABLED = false;
    const cursor = document.getElementById('cursor');
    const cursorRing = document.getElementById('cursorRing');
    let mx = 0, my = 0, rx = 0, ry = 0;
  
    if (CUSTOM_CURSOR_ENABLED && window.matchMedia('(min-width: 901px)').matches) {
      window.addEventListener('mousemove', (e) => {
        mx = e.clientX; my = e.clientY;
        cursor.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
      });
      function ringFollow() {
        rx += (mx - rx) * 0.15;
        ry += (my - ry) * 0.15;
        cursorRing.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
        requestAnimationFrame(ringFollow);
      }
      ringFollow();
  
      attachHoverTargets();
    }
  
    function attachHoverTargets() {
      if (!CUSTOM_CURSOR_ENABLED) return;
      if (!window.matchMedia('(min-width: 901px)').matches) return;
      document.querySelectorAll('a, button, .skill-card, .tl-content, .edu-card, .case-card').forEach(el => {
        if (el.dataset.hoverBound) return;
        el.dataset.hoverBound = 'true';
        el.addEventListener('mouseenter', () => { cursor.classList.add('hover'); cursorRing.classList.add('hover'); });
        el.addEventListener('mouseleave', () => { cursor.classList.remove('hover'); cursorRing.classList.remove('hover'); });
      });
    }
  
    // ============ Marquee ============
    const techStack = [
      { name: 'Vue.js', icon: 'vuedotjs' },
      { name: 'React', icon: 'react' },
      { name: 'Laravel', icon: 'laravel' },
      { name: 'PHP', icon: 'php' },
      { name: 'Flutter', icon: 'flutter' },
      { name: 'Node.js', icon: 'nodedotjs' },
      { name: 'TypeScript', icon: 'typescript' },
      { name: 'MySQL', icon: 'mysql' },
      { name: 'Tailwind', icon: 'tailwindcss' },
      { name: 'Docker', icon: 'docker' },
      { name: 'Firebase', icon: 'firebase' },
      { name: 'Git', icon: 'git' },
      { name: 'GitHub', icon: 'github', invert: true },
      { name: 'Figma', icon: 'figma' },
      { name: 'Bootstrap', icon: 'bootstrap' },
    ];
    const track = document.getElementById('marqueeTrack');
    const buildItem = (t) => `<span class="marquee-item"><img src="https://cdn.simpleicons.org/${t.icon}" alt="" class="${t.invert ? 'invert-dark' : ''}"/>${t.name}</span>`;
    const buildGroup = () => `<div class="marquee-group">${techStack.map(buildItem).join('')}</div>`;
    track.innerHTML = Array.from({ length: 4 }, buildGroup).join('');

    let marqueeX = 0;
    let lastMarqueeTime = performance.now();
    let marqueeGroupWidth = track.querySelector('.marquee-group')?.offsetWidth || 1;
    const marqueeSpeed = 90;

    const measureMarquee = () => {
      marqueeGroupWidth = track.querySelector('.marquee-group')?.offsetWidth || 1;
    };

    window.addEventListener('resize', measureMarquee);
    window.addEventListener('load', measureMarquee);
    measureMarquee();

    function animateMarquee(time) {
      const delta = Math.min(time - lastMarqueeTime, 40);
      lastMarqueeTime = time;
      marqueeX = (marqueeX + (delta / 1000) * marqueeSpeed) % marqueeGroupWidth;
      track.style.transform = `translate3d(${-marqueeX}px, 0, 0)`;
      requestAnimationFrame(animateMarquee);
    }
    requestAnimationFrame(animateMarquee);
  
    // ============ Static showcase data ============
    const portfolioCases = [
      {
        title: 'Xspec Technology Website',
        type: 'Website',
        category: 'code',
        year: '2026',
        image: 'assets/images/portfolio/xspectechnology.png',
        imageAlt: 'Xspec Technology website screenshot',
        summary: 'Migrated the public company website from WordPress to custom native PHP with responsive industry, product, and contact pages.',
        stack: ['PHP', 'WordPress Migration', 'Responsive UI'],
        links: [{ label: 'Visit Site', href: 'https://xspectechnology.com' }, { label: 'Role', href: '#experience' }],
      },
      {
        title: 'Guepedia Publishing Platform',
        type: 'Web Platform',
        category: 'code',
        year: '2025',
        image: 'assets/images/portfolio/guepedia.png',
        imageAlt: 'Guepedia website screenshot',
        summary: 'Production publishing and book-commerce platform work across marketplace UI, dashboard flows, feature delivery, and performance maintenance.',
        stack: ['React', 'Vue', 'Node.js'],
        links: [{ label: 'Visit Site', href: 'https://guepedia.com' }, { label: 'Details', href: '#experience' }],
      },
      {
        title: 'QRCBN Market App',
        type: 'Mobile App',
        category: 'mobile',
        year: '2025',
        image: 'assets/images/portfolio/qrcbn.png',
        imageAlt: 'QRCBN Market mobile app preview',
        summary: 'Mobile-market app for publishers to sell digital books and help readers discover titles through QR-linked access.',
        stack: ['Flutter', 'Landing Page', 'UX Flow'],
        links: [{ label: 'Google Play', href: 'https://play.google.com/store/apps/details?id=com.MediaGroup.QrcbnMarket&hl=en' }, { label: 'App Story', href: '#experience' }],
      },
      {
        title: 'Marketplace Mobile Concept',
        type: 'Mobile App',
        category: 'mobile',
        year: '2026',
        summary: 'Mobile-first shopping flow with product discovery, checkout states, and reusable component patterns.',
        stack: ['Flutter', 'Figma', 'UX Flow'],
        links: [{ label: 'Preview', href: '#contact' }],
      },
      {
        title: 'Admin Dashboard UI Kit',
        type: 'UI/UX',
        category: 'uiux',
        year: '2026',
        summary: 'Dashboard screens for scanning stats, managing content, and presenting operational data clearly.',
        stack: ['Figma', 'Components', 'Prototype'],
        links: [{ label: 'Figma', href: '#contact' }],
      },
      {
        title: 'Portfolio Case Template',
        type: 'UI/UX',
        category: 'uiux',
        year: '2026',
        summary: 'Reusable case study layout for problem, role, process, result, tech stack, and final visuals.',
        stack: ['UX Writing', 'Layout', 'Design System'],
        links: [{ label: 'Use Template', href: '#contact' }],
      },
    ];
  
    const showcaseGrid = document.getElementById('showcaseGrid');
  const thumbMarkup = (category, image, imageAlt = '') => {
    if (image) return `<img class="case-image" src="${image}" alt="${imageAlt}">`;
    if (category === 'mobile') return '<div class="phone-preview"></div>';
    if (category === 'uiux') return '<div class="wire-card"></div>';
    return '<div class="mock-browser-top"><span class="mock-dot"></span><span class="mock-dot"></span><span class="mock-dot"></span></div><div class="mock-screen"><span class="mock-line short"></span><span class="mock-line mid"></span><div class="mock-grid"><span class="mock-tile"></span><span class="mock-tile"></span></div></div>';
    };
    const renderShowcase = (filter = 'all') => {
      const cases = filter === 'all' ? portfolioCases : portfolioCases.filter(item => item.category === filter);
      showcaseGrid.innerHTML = cases.map(item => `
      <article class="case-card reveal" data-category="${item.category}" data-tilt>
        <div class="case-thumb ${item.category}">${thumbMarkup(item.category, item.image, item.imageAlt)}</div>
          <div class="case-meta"><span>${item.type}</span><span>${item.year}</span></div>
          <h3>${item.title}</h3>
          <p>${item.summary}</p>
          <div class="chips">${item.stack.map(label => `<span class="chip plain">${label}</span>`).join('')}</div>
          <div class="case-links">${item.links.map(link => `<a class="case-link" href="${link.href}" ${link.href.startsWith('http') ? 'target="_blank" rel="noopener"' : ''}>${link.label}</a>`).join('')}</div>
        </article>
      `).join('');
    };
    renderShowcase();
    attachHoverTargets();
  
    document.querySelectorAll('.showcase-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.showcase-tab').forEach(item => item.classList.remove('active'));
        tab.classList.add('active');
        renderShowcase(tab.dataset.filter);
        gsap.fromTo('.case-card', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, ease: 'power3.out' });
        attachTilt();
        attachHoverTargets();
      });
    });
  
    // Set initial state for hero items so GSAP animates them in
    gsap.set('.hero .kicker, .hero-title, .hero-tagline, .hero-cta-row', { opacity: 0, y: 30 });
    gsap.set('.hero-photo-wrap', { opacity: 0, y: 30, scale: 0.95 });
  
    // ============ Hero entrance ============
    gsap.timeline({ defaults: { ease: 'expo.out' } })
      .to('.hero .kicker', { opacity: 1, y: 0, duration: 0.8 })
      .to('.hero-title', { opacity: 1, y: 0, duration: 1.1 }, '-=0.5')
      .to('.hero-tagline', { opacity: 1, y: 0, duration: 0.9 }, '-=0.7')
      .to('.hero-cta-row', { opacity: 1, y: 0, duration: 0.8 }, '-=0.6')
      .to('.hero-photo-wrap', { opacity: 1, y: 0, scale: 1, duration: 1.2 }, '-=0.9');
  
    // ============ Scroll reveals ============
    gsap.utils.toArray('.reveal').forEach((el) => {
      if (el.closest('.hero')) return; // hero handled separately
      gsap.fromTo(el,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' }
        }
      );
    });
  
    // ============ Stat counter ============
    document.querySelectorAll('.stat-num').forEach(el => {
      const target = parseInt(el.dataset.count, 10);
      ScrollTrigger.create({
        trigger: el,
        start: 'top 80%',
        onEnter: () => {
          const obj = { val: 0 };
          gsap.to(obj, {
            val: target, duration: 1.6, ease: 'power3.out',
            onUpdate: () => { el.textContent = Math.round(obj.val) + '+'; }
          });
        },
        once: true,
      });
    });
  
    // ============ Tilt cards ============
    function attachTilt() {
      document.querySelectorAll('[data-tilt]').forEach(card => {
        if (card.dataset.tiltBound) return;
        card.dataset.tiltBound = 'true';
        card.addEventListener('mousemove', (e) => {
          const r = card.getBoundingClientRect();
          const x = e.clientX - r.left;
          const y = e.clientY - r.top;
          const rotY = ((x / r.width) - 0.5) * 8;
          const rotX = -((y / r.height) - 0.5) * 8;
          card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
          card.style.setProperty('--mx', (x / r.width * 100) + '%');
          card.style.setProperty('--my', (y / r.height * 100) + '%');
        });
        card.addEventListener('mouseleave', () => {
          card.style.transform = '';
        });
      });
    }
    attachTilt();
  
    // ============ Hero photo subtle parallax ============
    if (window.matchMedia('(min-width: 901px)').matches) {
      window.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 20;
        const y = (e.clientY / window.innerHeight - 0.5) * 20;
        gsap.to('.hero-photo', { x, y, duration: 1.2, ease: 'power3.out' });
        gsap.to('.gradient-mesh', { x: -x * 0.5, y: -y * 0.5, duration: 1.5, ease: 'power3.out' });
      });
    }
  
    // ============ Year ============
    document.getElementById('year').textContent = new Date().getFullYear();
  
    // ============ Burger (mobile nav simple scroll) ============
    document.getElementById('burger')?.addEventListener('click', () => {
      document.querySelector('#about').scrollIntoView({ behavior: 'smooth' });
    });
}

if (window.__portfolioPartialsReady) {
  initPortfolio();
} else {
  document.addEventListener('portfolio:partials-ready', initPortfolio, { once: true });
}
