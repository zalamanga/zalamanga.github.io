async function loadPartials() {
  const includes = [...document.querySelectorAll('[data-include]')];
  const version = '20260826-portfolio';

  for (const slot of includes) {
    const url = slot.dataset.include;
    const separator = url.includes('?') ? '&' : '?';
    const response = await fetch(`${url}${separator}v=${version}`);

    if (!response.ok) {
      throw new Error(`Failed to load ${url}`);
    }

    slot.outerHTML = await response.text();
  }

  window.__portfolioPartialsReady = true;
  document.dispatchEvent(new Event('portfolio:partials-ready'));
}

loadPartials().catch((error) => {
  console.error(error);
  document.body.insertAdjacentHTML('afterbegin', '<div style="padding:16px;color:#fff;background:#7c2d12;font-family:sans-serif">Section files could not load. Run this site from GitHub Pages or a local server.</div>');
});
