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
        id: 'xspec-website',
        title: 'Xspec Technology Website',
        type: 'Website',
        category: 'code',
        year: '2026',
        image: 'assets/images/portfolio/xspectechnology.png',
        imageAlt: 'Xspec Technology website screenshot',
        summary: 'Company website for industrial technology, training, and support services across Southeast Asia.',
        stack: ['PHP', 'CMS Migration', 'Responsive Web'],
        links: [{ label: 'Visit Site', href: 'https://xspectechnology.com' }],
        detail: {
          role: 'IT Intern - Fullstack Developer',
          scope: 'WordPress-to-native PHP website migration',
          overview: 'Xspec Technology is a Malaysian industrial technology company covering inspection equipment, security technology, healthcare systems, laboratory solutions, and training services.',
          highlights: [
            'Migrated the public website away from WordPress into a custom native PHP codebase.',
            'Structured industry, brand, product, news, and contact pages for clearer browsing.',
            'Reduced plugin dependency while keeping the site responsive and easier to maintain.',
          ],
          outcome: 'A faster, more controlled company profile and product-discovery site for public visitors, clients, and internal marketing updates.',
        },
      },
      {
        id: 'xspec-qr-generator',
        title: 'Xspec QR Generator',
        type: 'Web Tool',
        category: 'code',
        year: '2026',
        image: 'assets/images/portfolio/qr-generator.png',
        imageAlt: 'Xspec QR Generator marketing tool screenshot',
        summary: 'Client-side QR generator for marketing links with XSpec logo preview and PNG/SVG export options.',
        stack: ['JavaScript', 'QR Generator', 'Marketing Tool'],
        links: [],
        detail: {
          role: 'Frontend Developer',
          scope: 'Marketing QR asset generator',
          overview: 'A browser-based QR generator made for marketing needs, allowing the team to create campaign QR codes from URLs or text and export ready-to-use assets quickly.',
          highlights: [
            'Built instant QR preview with an optional XSpec logo overlay for branded campaign materials.',
            'Added PNG and SVG download options for both logo and no-logo versions so assets can be used across print and digital channels.',
            'Kept the tool client-side so QR generation can run quickly without storing submitted marketing links on a backend.',
          ],
          outcome: 'A reusable internal marketing utility that helps the team produce consistent branded QR assets without manual design work.',
        },
      },
      {
        id: 'guepedia-platform',
        title: 'Guepedia Publishing Platform',
        type: 'Web Platform',
        category: 'code',
        year: '2025',
        image: 'assets/images/portfolio/guepedia.png',
        imageAlt: 'Guepedia website screenshot',
        summary: 'Publishing and book-commerce platform for authors to publish books and readers to discover titles.',
        stack: ['React', 'Vue', 'Node.js'],
        links: [{ label: 'Visit Site', href: 'https://guepedia.com' }],
        detail: {
          role: 'Fullstack Developer',
          scope: 'Production website, marketplace UI, and internal publishing workflows',
          overview: 'Guepedia is a publishing platform that helps authors send manuscripts, manage publishing packages, promote books, and sell printed or digital titles to readers.',
          highlights: [
            'Built and maintained React/Vue interfaces for public pages, book discovery, and dashboard workflows.',
            'Delivered feature updates, bug fixes, and performance maintenance across production systems.',
            'Supported author and publisher flows from manuscript submission through storefront presentation.',
          ],
          outcome: 'A more usable publishing platform experience for authors, readers, and the internal team managing book operations.',
        },
      },
      {
        id: 'qrcbn-website',
        title: 'QRCBN Website',
        type: 'Website',
        category: 'code',
        year: '2025',
        image: 'assets/images/portfolio/qrcbn.png',
        imageAlt: 'QRCBN website screenshot',
        summary: 'Landing website introducing the QRCBN Market App and QR-linked digital book discovery experience.',
        stack: ['Landing Page', 'Product UI', 'Responsive Web'],
        links: [{ label: 'Visit Site', href: 'https://qrcbn.com' }],
        detail: {
          role: 'Web Developer',
          scope: 'Product landing page and reader entry point',
          overview: 'QRCBN.com introduces the QRCBN Market App, explains the app value proposition, and gives readers a QR/ID-based path into digital-book access.',
          highlights: [
            'Presented app positioning, benefits, flow, and contact sections in a focused landing experience.',
            'Used a mobile-app-first visual direction so the website supports the Android product.',
            'Kept the page direct and scannable for publishers, readers, and visitors coming from promotions.',
          ],
          outcome: 'A clear product website that supports the separate QRCBN mobile app instead of mixing the two portfolio entries together.',
        },
      },
      {
        id: 'qrcbn-mobile-app',
        title: 'QRCBN Market Mobile App',
        type: 'Mobile App',
        category: 'mobile',
        year: '2025',
        image: 'assets/images/portfolio/qrcbn-playstore.png',
        imageAlt: 'QRCBN Market Google Play listing screenshot',
        summary: 'Published Android app for browsing, buying, reading, and saving digital books from multiple publishers.',
        stack: ['Flutter', 'Android', 'Google Play'],
        links: [{ label: 'Google Play', href: 'https://play.google.com/store/apps/details?id=com.MediaGroup.QrcbnMarket&hl=en' }],
        detail: {
          role: 'Mobile App Developer',
          scope: 'Published Android app experience',
          overview: 'QRCBN Market is the mobile app side of the QRCBN ecosystem, focused on helping users discover, buy, read, and save digital books from participating publishers.',
          highlights: [
            'Built mobile-first reading and discovery flows for digital-book users.',
            'Prepared the project for a public Google Play listing with store screenshots and app metadata.',
            'Supported publisher-to-reader access through QRCBN IDs and QR-linked book discovery.',
          ],
          outcome: 'A real shipped mobile product with a public Google Play presence, separated from the QRCBN website card.',
        },
      },
      {
        id: 'employee-attendance',
        title: 'Employee Attendance System',
        type: 'Web App',
        category: 'code',
        year: '2026',
        image: 'assets/images/portfolio/employee-attendance.png',
        imageAlt: 'Employee attendance system screenshot',
        summary: 'Native PHP attendance system for tracking daily employee clock-in data, leave cases, remarks, and monthly records.',
        stack: ['Native PHP', 'MySQL', 'Attendance'],
        links: [],
        detail: {
          role: 'Fullstack Developer',
          scope: 'Internal attendance management web app',
          overview: 'A browser-based employee attendance tool built with native PHP for recording daily schedules, clock-in/out data, lunch breaks, leave cases, remarks, public holidays, and monthly attendance results.',
          highlights: [
            'Built a tabular attendance workflow that lets admins edit employee rows directly from the browser.',
            'Added month and date controls, weekday/holiday state, employee actions, work rules, and save-all behavior.',
            'Structured the interface for daily input plus result summaries so HR can review attendance records faster.',
          ],
          outcome: 'A practical internal operations tool that replaces manual attendance tracking with a clearer PHP-based workflow.',
        },
      },
      {
        id: 'tigac-web-design',
        title: 'TIGAC Web Design',
        type: 'UI/UX',
        category: 'uiux',
        year: '2024',
        image: 'assets/images/portfolio/tigac-landing-page.png',
        imageAlt: 'TIGAC landing page web design screenshot',
        gallery: [
          { label: 'Landing Page', src: 'assets/images/portfolio/tigac-landing-page.png', alt: 'TIGAC landing page web design screenshot' },
          { label: 'Product Home', src: 'assets/images/portfolio/tigac-product-home.png', alt: 'TIGAC product home web design screenshot' },
          { label: 'Product Detail', src: 'assets/images/portfolio/tigac-product-detail.png', alt: 'TIGAC product detail web design screenshot' },
          { label: 'Program Page', src: 'assets/images/portfolio/tigac-program.png', alt: 'TIGAC program page web design screenshot' },
          { label: 'Contact Page', src: 'assets/images/portfolio/tigac-contact.png', alt: 'TIGAC contact page web design screenshot' },
        ],
        summary: 'Figma web-design concept for a product-focused TIGAC website with multi-screen gallery preview.',
        stack: ['Figma', 'Web Design', 'UI/UX Flow'],
        links: [{ label: 'Figma Design', href: 'https://www.figma.com/design/lo4rFA1GzdS4YRXYNugkkw/Untitled?node-id=0-1&t=sa1b68AP6Ahp48BU-1' }],
        detail: {
          role: 'UI/UX Designer',
          scope: 'Figma website concept and multi-page design export',
          overview: 'A web-design concept for TIGAC with page flows covering landing, product discovery, product detail, programs, partnership, FAQ, and contact screens.',
          highlights: [
            'Designed a polished landing page direction with product navigation and clear visual hierarchy.',
            'Prepared multiple page exports from Figma so the website concept can be reviewed screen by screen.',
            'Balanced brand presence, product storytelling, and conversion points such as shop/contact actions.',
          ],
          outcome: 'A professional UI/UX portfolio piece backed by the source Figma design link and gallery screenshots.',
          assets: [
            { label: 'Landing Page PDF', href: 'tigacid/Landing Page.pdf', download: true },
            { label: 'Product Home PDF', href: 'tigacid/Product Home.pdf', download: true },
            { label: 'Product Detail PDF', href: 'tigacid/Product Detail.pdf', download: true },
            { label: 'Program PDF', href: 'tigacid/Program.pdf', download: true },
            { label: 'Contact PDF', href: 'tigacid/Contact Us.pdf', download: true },
          ],
        },
      },
    ];
  
    const showcaseGrid = document.getElementById('showcaseGrid');
    const escapeHtml = (value = '') => String(value).replace(/[&<>"']/g, (char) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    }[char]));
    const isExternalLink = (href = '') => /^https?:\/\//.test(href);
    const isDownloadLink = (link) => link.download || /\.pdf($|[?#])/i.test(link.href || '');
    const linkAttributes = (link) => {
      const attrs = [`href="${escapeHtml(link.href)}"`];
      if (isExternalLink(link.href)) attrs.push('target="_blank"', 'rel="noopener"');
      if (isDownloadLink(link)) attrs.push('download');
      return attrs.join(' ');
    };
    const thumbMarkup = (category, image, imageAlt = '') => {
      if (image) return `<img class="case-image" src="${escapeHtml(image)}" alt="${escapeHtml(imageAlt)}">`;
      if (category === 'mobile') return '<div class="phone-preview"></div>';
      if (category === 'uiux') return '<div class="wire-card"></div>';
      return '<div class="mock-browser-top"><span class="mock-dot"></span><span class="mock-dot"></span><span class="mock-dot"></span></div><div class="mock-screen"><span class="mock-line short"></span><span class="mock-line mid"></span><div class="mock-grid"><span class="mock-tile"></span><span class="mock-tile"></span></div></div>';
    };
    const renderCaseLinks = (links = []) => links.map(link => `<a class="case-link" ${linkAttributes(link)}>${escapeHtml(link.label)}</a>`).join('');
    const caseModal = document.createElement('div');
    caseModal.className = 'case-modal';
    caseModal.setAttribute('aria-hidden', 'true');
    document.body.appendChild(caseModal);
    let activeGallery = [];
    let activeGalleryIndex = 0;

    const caseGallery = (item) => {
      const gallery = Array.isArray(item.gallery) && item.gallery.length
        ? item.gallery
        : (item.image ? [{ label: 'Screenshot', src: item.image, alt: item.imageAlt || item.title }] : []);

      return gallery.filter(entry => entry?.src).slice(0, 5);
    };

    const renderCaseGallery = (item, gallery) => {
      if (!gallery.length) {
        return `<div class="case-modal-image case-modal-fallback ${escapeHtml(item.category)}">${thumbMarkup(item.category, item.image, item.imageAlt)}</div>`;
      }

      const first = gallery[0];
      const controls = gallery.length > 1 ? `
        <div class="case-gallery-controls" aria-label="Project screenshots">
          <button class="case-gallery-nav" type="button" data-gallery-prev aria-label="Previous screenshot">&#8249;</button>
          <span class="case-gallery-counter" data-gallery-counter>1 / ${gallery.length}</span>
          <button class="case-gallery-nav" type="button" data-gallery-next aria-label="Next screenshot">&#8250;</button>
        </div>
      ` : '';

      return `
        <figure class="case-gallery" data-case-gallery>
          <div class="case-gallery-frame">
            <img class="case-modal-image" data-gallery-image src="${escapeHtml(first.src)}" alt="${escapeHtml(first.alt || first.label || item.title)}">
          </div>
          <figcaption class="case-gallery-caption" data-gallery-caption>${escapeHtml(first.label || item.title)}</figcaption>
          ${controls}
        </figure>
      `;
    };

    const updateCaseGallery = (index) => {
      if (!activeGallery.length) return;
      activeGalleryIndex = (index + activeGallery.length) % activeGallery.length;
      const current = activeGallery[activeGalleryIndex];
      const image = caseModal.querySelector('[data-gallery-image]');
      const counter = caseModal.querySelector('[data-gallery-counter]');
      const caption = caseModal.querySelector('[data-gallery-caption]');

      if (image) {
        image.src = current.src;
        image.alt = current.alt || current.label || 'Project screenshot';
      }
      if (counter) counter.textContent = `${activeGalleryIndex + 1} / ${activeGallery.length}`;
      if (caption) caption.textContent = current.label || '';
    };

    const closeCaseDetail = () => {
      caseModal.classList.remove('open');
      caseModal.setAttribute('aria-hidden', 'true');
      caseModal.innerHTML = '';
      document.body.classList.remove('modal-open');
      activeGallery = [];
      activeGalleryIndex = 0;
    };

    const openCaseDetail = (caseId) => {
      const item = portfolioCases.find(project => project.id === caseId);
      if (!item || !item.detail) return;

      const detail = item.detail;
      const highlights = (detail.highlights || []).map(point => `<li>${escapeHtml(point)}</li>`).join('');
      const assets = (detail.assets || []).map(asset => `<a class="case-link" ${linkAttributes(asset)}>${escapeHtml(asset.label)}</a>`).join('');
      const detailLinks = renderCaseLinks(item.links);
      const gallery = caseGallery(item);
      const imageMarkup = renderCaseGallery(item, gallery);

      caseModal.innerHTML = `
        <div class="case-modal-backdrop" data-case-close></div>
        <section class="case-modal-panel" role="dialog" aria-modal="true" aria-labelledby="case-modal-title">
          <button class="case-modal-close" type="button" data-case-close aria-label="Close project detail">&times;</button>
          <div class="case-modal-visual">${imageMarkup}</div>
          <div class="case-modal-content">
            <div class="case-meta"><span>${escapeHtml(item.type)}</span><span>${escapeHtml(item.year)}</span></div>
            <h3 id="case-modal-title">${escapeHtml(item.title)}</h3>
            <p class="case-modal-summary">${escapeHtml(item.summary)}</p>
            <div class="case-detail-grid">
              <div>
                <span>Role</span>
                <strong>${escapeHtml(detail.role)}</strong>
              </div>
              <div>
                <span>Scope</span>
                <strong>${escapeHtml(detail.scope)}</strong>
              </div>
            </div>
            <p>${escapeHtml(detail.overview)}</p>
            <ul class="case-detail-list">${highlights}</ul>
            <p class="case-modal-outcome">${escapeHtml(detail.outcome)}</p>
            <div class="chips">${item.stack.map(label => `<span class="chip plain">${escapeHtml(label)}</span>`).join('')}</div>
            <div class="case-links">${detailLinks}${assets}</div>
          </div>
        </section>
      `;
      activeGallery = gallery;
      activeGalleryIndex = 0;
      caseModal.classList.add('open');
      caseModal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('modal-open');
      caseModal.querySelector('.case-modal-close')?.focus();
    };

    const renderShowcase = (filter = 'all') => {
      const cases = filter === 'all' ? portfolioCases : portfolioCases.filter(item => item.category === filter);
      showcaseGrid.innerHTML = cases.map(item => `
      <article class="case-card reveal" data-category="${item.category}" data-tilt>
        <div class="case-thumb ${item.category}">${thumbMarkup(item.category, item.image, item.imageAlt)}</div>
          <div class="case-meta"><span>${escapeHtml(item.type)}</span><span>${escapeHtml(item.year)}</span></div>
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.summary)}</p>
          <div class="chips">${item.stack.map(label => `<span class="chip plain">${escapeHtml(label)}</span>`).join('')}</div>
          <div class="case-links">${renderCaseLinks(item.links)}<button class="case-link case-detail-button" type="button" data-case-detail="${escapeHtml(item.id)}">Details</button></div>
        </article>
      `).join('');
    };
    renderShowcase();
    attachHoverTargets();

    showcaseGrid.addEventListener('click', (event) => {
      const detailButton = event.target.closest('[data-case-detail]');
      if (!detailButton) return;
      openCaseDetail(detailButton.dataset.caseDetail);
    });

    caseModal.addEventListener('click', (event) => {
      if (event.target.closest('[data-gallery-prev]')) {
        updateCaseGallery(activeGalleryIndex - 1);
        return;
      }
      if (event.target.closest('[data-gallery-next]')) {
        updateCaseGallery(activeGalleryIndex + 1);
        return;
      }
      if (event.target.closest('[data-case-close]')) closeCaseDetail();
    });

    document.addEventListener('keydown', (event) => {
      if (!caseModal.classList.contains('open')) return;
      if (event.key === 'Escape') {
        closeCaseDetail();
        return;
      }
      if (activeGallery.length <= 1) return;
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        updateCaseGallery(activeGalleryIndex - 1);
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        updateCaseGallery(activeGalleryIndex + 1);
      }
    });
  
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
