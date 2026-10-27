(() => {
  'use strict';

  const filters = Array.from(document.querySelectorAll('.case-library-filter'));
  const cards = Array.from(document.querySelectorAll('.case-library-card'));
  const counter = document.getElementById('case-visible-count');
  const label = document.getElementById('case-active-label');
  const empty = document.getElementById('case-empty');
  const names = { all: 'All disciplines', branding: 'Branding', websites: 'Websites', product: 'Product' };

  function applyFilter(category, updateUrl = false) {
    const next = Object.prototype.hasOwnProperty.call(names, category) ? category : 'all';
    let count = 0;

    cards.forEach(card => {
      const matches = next === 'all' || card.dataset.categories.split(' ').includes(next);
      card.hidden = !matches;
      if (matches) count++;
    });

    filters.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === next)));
    if (counter) counter.textContent = String(count);
    if (label) label.textContent = names[next];
    if (empty) empty.hidden = count !== 0;

    if (updateUrl) {
      const url = new URL(window.location.href);
      if (next === 'all') url.searchParams.delete('category');
      else url.searchParams.set('category', next);
      history.pushState({ category: next }, '', url);
    }
  }

  filters.forEach(button => {
    button.addEventListener('click', () => applyFilter(button.dataset.filter, true));
  });

  window.addEventListener('popstate', () => {
    applyFilter(new URLSearchParams(window.location.search).get('category') || 'all');
  });

  applyFilter(new URLSearchParams(window.location.search).get('category') || 'all');
})();
