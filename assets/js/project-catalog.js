(function () {
  'use strict';

  const PAGE_SIZE = 12;
  const CATEGORIES = Object.freeze({
    web: 'Web',
    backend: 'Backend & APIs',
    java: 'Java',
    mobile: 'Android & Mobile',
    data: 'Data & SQL',
    tools: 'Tools',
  });

  function normalized(value) {
    return String(value).normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim().replace(/\s+/g, ' ');
  }

  function sourceUrl(repo, value) {
    if (typeof repo !== 'string' || !/^[a-zA-Z0-9][a-zA-Z0-9._-]{0,99}$/.test(repo) || typeof value !== 'string') {
      throw new Error('Invalid repository information.');
    }
    const expected = `https://github.com/zalamanga/${repo}`;
    if (value !== expected && value !== `${expected}/`) {
      throw new Error('Invalid repository URL.');
    }
    return expected;
  }

  function screenshotData(value, title) {
    if (!value || typeof value !== 'object' || typeof value.src !== 'string') return null;
    if (!/^assets\/images\/project-catalog\/[a-zA-Z0-9][a-zA-Z0-9._-]*\.(?:png|jpe?g|webp|avif|gif)$/i.test(value.src) || value.src.includes('..')) return null;
    const result = {
      src: value.src,
      alt: typeof value.alt === 'string' && value.alt.trim() ? value.alt.trim() : `${title} screenshot`,
      label: typeof value.label === 'string' ? value.label.trim() : '',
    };
    for (const dimension of ['width', 'height']) {
      if (Number.isInteger(value[dimension]) && value[dimension] > 0 && value[dimension] <= 20000) {
        result[dimension] = value[dimension];
      }
    }
    return result;
  }

  function catalogData(data) {
    if (!data || typeof data !== 'object' || Array.isArray(data) || typeof data.updatedAt !== 'string' || !Array.isArray(data.projects)) {
      throw new Error('Invalid project catalog.');
    }
    const repositories = new Set();
    return data.projects.map((item) => {
      if (!item || typeof item !== 'object' || Array.isArray(item) ||
          typeof item.title !== 'string' || !item.title.trim() ||
          typeof item.description !== 'string' || typeof item.kind !== 'string' ||
          !Object.prototype.hasOwnProperty.call(CATEGORIES, item.category) ||
          !Array.isArray(item.stack) || !item.stack.every((tag) => typeof tag === 'string') ||
          !Array.isArray(item.screenshots) || (item.note != null && typeof item.note !== 'string') ||
          (item.sourceRef !== undefined && (typeof item.sourceRef !== 'string' || !/^[a-fA-F0-9]{40}$/.test(item.sourceRef)))) {
        throw new Error('Invalid project entry.');
      }
      const url = sourceUrl(item.repo, item.url);
      const repositoryKey = item.repo.toLowerCase();
      if (repositories.has(repositoryKey)) throw new Error('Duplicate project entry.');
      repositories.add(repositoryKey);
      const project = {
        repo: item.repo,
        title: item.title.trim(),
        description: item.description.trim(),
        category: item.category,
        kind: item.kind.trim(),
        stack: [...new Set(item.stack.map((tag) => tag.trim()).filter(Boolean))],
        url,
        sourceRef: item.sourceRef ? item.sourceRef.toLowerCase() : '',
        note: item.note ? item.note.trim() : '',
      };
      project.screenshot = screenshotData(item.screenshots[0], project.title);
      project.searchText = normalized([project.repo, project.title, project.description, project.kind, ...project.stack].join(' '));
      return project;
    });
  }

  function element(tag, className, text) {
    const node = document.createElement(tag);
    node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function link(className, text, href, label) {
    const node = element('a', className, text);
    node.href = href;
    node.target = '_blank';
    node.rel = 'noopener noreferrer';
    node.setAttribute('aria-label', `${label || text} (opens in a new tab)`);
    return node;
  }

  function imageFallback(category) {
    const fallback = element('div', 'project-entry-image-fallback');
    fallback.append(element('p', 'project-entry-image-message', 'Screenshot not available'));
    fallback.append(element('span', 'project-entry-image-category', CATEGORIES[category]));
    return fallback;
  }

  function projectCard(project) {
    const article = element('article', 'project-entry');
    article.dataset.category = project.category;
    const media = element('figure', 'project-entry-media');
    const body = element('div', 'project-entry-body');
    const meta = element('div', 'project-entry-meta');
    meta.append(element('span', 'project-entry-category', CATEGORIES[project.category]));
    if (project.kind) meta.append(element('span', 'project-entry-kind', project.kind));
    const heading = element('h4', 'project-entry-title');
    const readmeUrl = project.sourceRef ? `${project.url}/tree/${project.sourceRef}#readme` : `${project.url}#readme`;
    const titleLink = link('project-entry-title-link', project.title, readmeUrl, `${project.title} on GitHub`);
    heading.append(titleLink);
    body.append(meta, heading, element('p', 'project-entry-repo', project.repo));
    if (project.description) body.append(element('p', 'project-entry-description', project.description));
    if (project.stack.length) {
      const stack = element('ul', 'project-entry-stack');
      stack.setAttribute('aria-label', 'Technology');
      for (const tag of project.stack) stack.append(element('li', 'project-entry-tag', tag));
      body.append(stack);
    }
    if (project.note) body.append(element('p', 'project-entry-note', project.note));
    const links = element('div', 'project-entry-links');
    const sourceLink = link('project-entry-link', 'View source', readmeUrl, `View source for ${project.title}`);
    links.append(sourceLink);
    if (project.screenshot) {
      const screenshot = project.screenshot;
      const screenshotLink = link('project-entry-link', 'View image', screenshot.src, `View full documentation image for ${project.title}`);
      links.append(screenshotLink);
      const image = element('img', 'project-entry-image');
      image.alt = screenshot.alt;
      image.loading = 'lazy';
      image.decoding = 'async';
      if (screenshot.width) image.width = screenshot.width;
      if (screenshot.height) image.height = screenshot.height;
      image.addEventListener('error', () => {
        media.replaceChildren(imageFallback(project.category));
        if (document.activeElement === screenshotLink) sourceLink.focus({ preventScroll: true });
        screenshotLink.hidden = true;
      }, { once: true });
      image.src = screenshot.src;
      media.append(image);
      if (screenshot.label) media.append(element('figcaption', 'project-entry-screenshot-label', screenshot.label));
    } else {
      media.append(imageFallback(project.category));
    }
    body.append(links);
    article.append(media, body);
    return { article, titleLink };
  }

  function initCatalog() {
    const root = document.getElementById('projectCatalog');
    if (!root || root.dataset.projectCatalogInitialized === 'true') return;
    const search = root.querySelector('#projectSearch');
    const category = root.querySelector('#projectCategory');
    const count = root.querySelector('#projectCount');
    const list = root.querySelector('#projectList');
    const state = root.querySelector('#projectState');
    const retry = root.querySelector('#projectRetry');
    const reset = root.querySelector('#projectReset');
    const more = root.querySelector('#projectMore');
    if (!search || !category || !count || !list || !state || !retry || !reset || !more) {
      console.error('Project catalog markup is incomplete.');
      return;
    }
    root.dataset.projectCatalogInitialized = 'true';
    search.setAttribute('aria-controls', 'projectList');
    category.setAttribute('aria-controls', 'projectList');
    let projects = [];
    let matches = [];
    let shown = 0;
    let requestId = 0;
    let controller = null;
    let ready = false;

    function setState(name, message) {
      root.dataset.state = name;
      root.setAttribute('aria-busy', name === 'loading' ? 'true' : 'false');
      state.textContent = message;
      state.hidden = !message;
    }

    function hasFilters() {
      return search.value.length > 0 || category.value !== 'all';
    }

    function updateCount() {
      const noun = matches.length === 1 ? 'project' : 'projects';
      count.textContent = shown < matches.length ? `Showing ${shown} of ${matches.length} ${noun}.` : `${matches.length} ${noun} found.`;
    }

    function appendPage(focusNewResults) {
      const page = matches.slice(shown, shown + PAGE_SIZE).map(projectCard);
      const fragment = document.createDocumentFragment();
      for (const item of page) fragment.append(item.article);
      list.append(fragment);
      shown += page.length;
      updateCount();
      const reachedEnd = shown >= matches.length;
      if (page.length && (focusNewResults || (reachedEnd && document.activeElement === more))) page[0].titleLink.focus();
      more.hidden = reachedEnd;
    }

    function applyFilters() {
      if (!ready) return;
      const query = normalized(search.value);
      const tokens = query ? query.split(' ') : [];
      const selected = Object.prototype.hasOwnProperty.call(CATEGORIES, category.value) ? category.value : 'all';
      matches = projects.filter((project) => (selected === 'all' || project.category === selected) && tokens.every((token) => project.searchText.includes(token)));
      shown = 0;
      list.replaceChildren();
      reset.disabled = !hasFilters();
      if (!matches.length) {
        more.hidden = true;
        updateCount();
        setState('empty', projects.length ? 'No projects match these filters. Try another project name, technology, or category.' : 'No public projects are listed yet.');
        return;
      }
      setState('ready', '');
      appendPage(false);
    }

    async function loadCatalog() {
      const currentRequest = ++requestId;
      if (controller) controller.abort();
      controller = new AbortController();
      const activeController = controller;
      const retryHadFocus = document.activeElement === retry;
      ready = false;
      projects = [];
      matches = [];
      shown = 0;
      list.replaceChildren();
      count.textContent = 'Loading projects...';
      search.disabled = true;
      category.disabled = true;
      reset.disabled = true;
      more.hidden = true;
      retry.disabled = true;
      retry.hidden = !retryHadFocus;
      setState('loading', 'Loading the project catalog.');
      const timeout = window.setTimeout(() => activeController.abort(), 15000);
      try {
        const response = await fetch('assets/data/projects.json', { cache: 'no-cache', signal: activeController.signal });
        if (!response.ok) throw new Error('Project catalog request failed.');
        const data = await response.json();
        if (currentRequest !== requestId) return;
        projects = catalogData(data);
        ready = true;
        search.disabled = false;
        category.disabled = false;
        if (retryHadFocus && document.activeElement === retry) search.focus({ preventScroll: true });
        retry.hidden = true;
        applyFilters();
      } catch (error) {
        if (currentRequest !== requestId) return;
        count.textContent = 'Project list unavailable.';
        setState('error', 'The project catalog could not be loaded. Please try again.');
        retry.hidden = false;
        retry.disabled = false;
        console.error('Project catalog could not be loaded.');
      } finally {
        window.clearTimeout(timeout);
      }
    }

    search.addEventListener('input', applyFilters);
    category.addEventListener('change', applyFilters);
    reset.addEventListener('click', (event) => {
      event.preventDefault();
      if (!ready) return;
      search.value = '';
      category.value = 'all';
      applyFilters();
      search.focus({ preventScroll: true });
    });
    more.addEventListener('click', (event) => {
      event.preventDefault();
      if (ready && shown < matches.length) appendPage(true);
    });
    retry.addEventListener('click', (event) => {
      event.preventDefault();
      loadCatalog();
    });
    const form = search.closest('form');
    if (form && root.contains(form)) form.addEventListener('submit', (event) => event.preventDefault());
    loadCatalog();
  }

  if (window.__portfolioPartialsReady) {
    initCatalog();
  } else {
    document.addEventListener('portfolio:partials-ready', initCatalog, { once: true });
  }
}());
