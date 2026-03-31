// Navigation bar + Cmd+K search for learning notes
// Loaded by every page via <script src="../nav.js"></script> or <script src="nav.js"></script>

(function () {
  'use strict';

  // Resolve base path (are we in root or a subfolder?)
  const scripts = document.querySelectorAll('script[src$="nav.js"]');
  const scriptSrc = scripts[scripts.length - 1]?.getAttribute('src') || '';
  const isRoot = !scriptSrc.startsWith('..');
  const base = isRoot ? '' : '../';

  // Current page path relative to root
  const loc = window.location.pathname;
  const segments = loc.split('/').filter(Boolean);
  // Handle GitHub Pages subpath or local file://
  // We want something like "virt-03-cgroups/cgroup-fundamentals.html"
  let currentPath = '';
  if (segments.length >= 2) {
    currentPath = segments.slice(-2).join('/');
  } else if (segments.length === 1) {
    currentPath = segments[0];
  }

  let pages = [];
  let currentIndex = -1;

  // ─── Build top bar immediately (don't wait for JSON) ───
  const bar = document.createElement('div');
  bar.id = 'topnav';
  bar.innerHTML = `
    <a href="${base}index.html" class="topnav-home" title="Home">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    </a>
    <button class="topnav-btn topnav-prev" id="nav-prev" disabled title="Previous page">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="15 18 9 12 15 6"/>
      </svg>
      <span class="topnav-prev-label"></span>
    </button>
    <span class="topnav-title" id="nav-title"></span>
    <button class="topnav-btn topnav-next" id="nav-next" disabled title="Next page">
      <span class="topnav-next-label"></span>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="9 18 15 12 9 6"/>
      </svg>
    </button>
    <button class="topnav-search" id="nav-search" title="Search (Cmd+K)">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
      <span class="topnav-search-hint">
        <kbd>${navigator.platform.includes('Mac') ? '\u2318' : 'Ctrl'}</kbd><kbd>K</kbd>
      </span>
    </button>
  `;
  document.body.prepend(bar);

  // ─── Build search modal ───
  const modal = document.createElement('div');
  modal.id = 'search-modal';
  modal.innerHTML = `
    <div class="search-backdrop"></div>
    <div class="search-dialog">
      <input type="text" class="search-input" id="search-input" placeholder="Search pages..." autocomplete="off" spellcheck="false">
      <div class="search-results" id="search-results"></div>
      <div class="search-footer">
        <span><kbd>&uarr;</kbd><kbd>&darr;</kbd> navigate</span>
        <span><kbd>Enter</kbd> open</span>
        <span><kbd>Esc</kbd> close</span>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  // ─── Load pages manifest ───
  fetch(base + 'pages.json')
    .then(r => r.json())
    .then(data => {
      pages = data;
      currentIndex = pages.findIndex(p => currentPath.endsWith(p.path));
      setupNav();
    })
    .catch(() => { /* silently fail — nav buttons stay disabled */ });

  function setupNav() {
    const titleEl = document.getElementById('nav-title');
    const prevBtn = document.getElementById('nav-prev');
    const nextBtn = document.getElementById('nav-next');

    if (currentIndex >= 0) {
      titleEl.textContent = pages[currentIndex].topic;
    }

    if (currentIndex > 0) {
      prevBtn.disabled = false;
      prevBtn.querySelector('.topnav-prev-label').textContent = pages[currentIndex - 1].title;
      prevBtn.addEventListener('click', () => {
        window.location.href = base + pages[currentIndex - 1].path;
      });
    }

    if (currentIndex >= 0 && currentIndex < pages.length - 1) {
      nextBtn.disabled = false;
      nextBtn.querySelector('.topnav-next-label').textContent = pages[currentIndex + 1].title;
      nextBtn.addEventListener('click', () => {
        window.location.href = base + pages[currentIndex + 1].path;
      });
    }

    // Keyboard: left/right arrows for prev/next (when not in search)
    document.addEventListener('keydown', (e) => {
      if (modal.classList.contains('open')) return;
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowLeft' && currentIndex > 0) {
        window.location.href = base + pages[currentIndex - 1].path;
      }
      if (e.key === 'ArrowRight' && currentIndex < pages.length - 1) {
        window.location.href = base + pages[currentIndex + 1].path;
      }
    });
  }

  // ─── Search ───
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');
  let selectedIdx = 0;
  let filtered = [];

  function openSearch() {
    modal.classList.add('open');
    searchInput.value = '';
    searchInput.focus();
    renderResults('');
  }

  function closeSearch() {
    modal.classList.remove('open');
  }

  function renderResults(query) {
    const q = query.toLowerCase().trim();
    if (!q) {
      // Show all pages grouped by section
      filtered = pages;
    } else {
      filtered = pages.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.topic.toLowerCase().includes(q) ||
        p.section.toLowerCase().includes(q) ||
        p.path.toLowerCase().includes(q)
      );
    }
    selectedIdx = 0;

    if (filtered.length === 0) {
      searchResults.innerHTML = '<div class="search-empty">No results</div>';
      return;
    }

    let html = '';
    let lastSection = '';
    filtered.forEach((p, i) => {
      if (p.section !== lastSection) {
        lastSection = p.section;
        html += `<div class="search-section-label">${p.section}</div>`;
      }
      const active = i === selectedIdx ? ' active' : '';
      const isCurrent = currentPath.endsWith(p.path) ? ' current' : '';
      html += `<a href="${base}${p.path}" class="search-item${active}${isCurrent}" data-idx="${i}">
        <span class="search-item-title">${highlight(p.title, q)}</span>
        <span class="search-item-topic">${highlight(p.topic, q)}</span>
      </a>`;
    });
    searchResults.innerHTML = html;
    ensureVisible();
  }

  function highlight(text, q) {
    if (!q) return text;
    const idx = text.toLowerCase().indexOf(q);
    if (idx === -1) return text;
    return text.slice(0, idx) + '<mark>' + text.slice(idx, idx + q.length) + '</mark>' + text.slice(idx + q.length);
  }

  function ensureVisible() {
    const active = searchResults.querySelector('.search-item.active');
    if (active) active.scrollIntoView({ block: 'nearest' });
  }

  function updateSelection() {
    searchResults.querySelectorAll('.search-item').forEach((el, i) => {
      el.classList.toggle('active', parseInt(el.dataset.idx) === selectedIdx);
    });
    ensureVisible();
  }

  searchInput.addEventListener('input', () => renderResults(searchInput.value));

  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (selectedIdx < filtered.length - 1) { selectedIdx++; updateSelection(); }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (selectedIdx > 0) { selectedIdx--; updateSelection(); }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIdx]) {
        window.location.href = base + filtered[selectedIdx].path;
      }
    } else if (e.key === 'Escape') {
      closeSearch();
    }
  });

  // Click on result
  searchResults.addEventListener('click', (e) => {
    const item = e.target.closest('.search-item');
    if (item) {
      // Let the <a> href handle navigation
    }
  });

  // Mouse hover updates selection
  searchResults.addEventListener('mousemove', (e) => {
    const item = e.target.closest('.search-item');
    if (item) {
      selectedIdx = parseInt(item.dataset.idx);
      updateSelection();
    }
  });

  // Close on backdrop click
  modal.querySelector('.search-backdrop').addEventListener('click', closeSearch);

  // Open search button
  document.getElementById('nav-search').addEventListener('click', openSearch);

  // Cmd+K / Ctrl+K
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      if (modal.classList.contains('open')) {
        closeSearch();
      } else {
        openSearch();
      }
    }
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeSearch();
    }
  });

  // ─── Inject styles ───
  const style = document.createElement('style');
  style.textContent = `
    /* ─── Top nav bar ─── */
    #topnav {
      position: fixed;
      top: 0; left: 0; right: 0;
      z-index: 1000;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 0 16px;
      height: 48px;
      background: #0f0f1aee;
      backdrop-filter: blur(12px);
      border-bottom: 1px solid #2a2a4a;
      font-family: system-ui, sans-serif;
      font-size: 13px;
    }
    body { padding-top: 68px !important; }

    .topnav-home {
      color: #888;
      display: flex;
      align-items: center;
      padding: 6px;
      border-radius: 6px;
      transition: color 0.15s, background 0.15s;
      text-decoration: none;
    }
    .topnav-home:hover { color: #e94560; background: #e9456015; }

    .topnav-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      background: none;
      border: 1px solid #2a2a4a;
      border-radius: 6px;
      color: #888;
      padding: 5px 10px;
      cursor: pointer;
      font-size: 12px;
      font-family: inherit;
      transition: all 0.15s;
      max-width: 200px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .topnav-btn:hover:not(:disabled) { color: #e0e0e0; border-color: #555; background: #1a1a2e; }
    .topnav-btn:disabled { opacity: 0.3; cursor: default; }
    .topnav-prev-label, .topnav-next-label {
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 140px;
    }
    @media (max-width: 768px) {
      .topnav-prev-label, .topnav-next-label { display: none; }
    }

    .topnav-title {
      flex: 1;
      text-align: center;
      color: #666;
      font-size: 12px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .topnav-search {
      display: flex;
      align-items: center;
      gap: 8px;
      background: none;
      border: 1px solid #2a2a4a;
      border-radius: 6px;
      color: #888;
      padding: 5px 10px;
      cursor: pointer;
      font-family: inherit;
      font-size: 12px;
      transition: all 0.15s;
    }
    .topnav-search:hover { color: #e0e0e0; border-color: #555; background: #1a1a2e; }
    .topnav-search-hint {
      display: flex;
      gap: 2px;
    }
    .topnav-search-hint kbd {
      background: #1a1a2e;
      border: 1px solid #2a2a4a;
      border-radius: 3px;
      padding: 1px 5px;
      font-size: 11px;
      font-family: inherit;
      color: #666;
    }
    @media (max-width: 600px) {
      .topnav-search-hint { display: none; }
    }

    /* ─── Search modal ─── */
    #search-modal {
      display: none;
      position: fixed;
      inset: 0;
      z-index: 2000;
    }
    #search-modal.open { display: block; }

    .search-backdrop {
      position: absolute;
      inset: 0;
      background: #00000088;
      backdrop-filter: blur(4px);
    }

    .search-dialog {
      position: absolute;
      top: min(20%, 120px);
      left: 50%;
      transform: translateX(-50%);
      width: min(600px, calc(100vw - 32px));
      max-height: 70vh;
      background: #1a1a2e;
      border: 1px solid #2a2a4a;
      border-radius: 12px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      box-shadow: 0 20px 60px #00000088;
    }

    .search-input {
      width: 100%;
      padding: 16px 20px;
      background: transparent;
      border: none;
      border-bottom: 1px solid #2a2a4a;
      color: #e0e0e0;
      font-size: 16px;
      font-family: system-ui, sans-serif;
      outline: none;
    }
    .search-input::placeholder { color: #555; }

    .search-results {
      overflow-y: auto;
      max-height: calc(70vh - 110px);
      padding: 8px;
    }

    .search-section-label {
      padding: 8px 12px 4px;
      font-size: 11px;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #555;
    }

    .search-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 12px;
      border-radius: 8px;
      color: #e0e0e0;
      text-decoration: none;
      transition: background 0.1s;
      cursor: pointer;
    }
    .search-item.active { background: #2a2a4a; }
    .search-item.current .search-item-title::after {
      content: '(current)';
      margin-left: 8px;
      font-size: 11px;
      color: #555;
    }
    .search-item-title {
      font-size: 14px;
      font-weight: 500;
    }
    .search-item-topic {
      font-size: 12px;
      color: #666;
      white-space: nowrap;
      margin-left: 12px;
    }
    .search-item mark {
      background: #e9456040;
      color: #e94560;
      border-radius: 2px;
      padding: 0 1px;
    }
    .search-empty {
      text-align: center;
      padding: 40px 20px;
      color: #555;
      font-size: 14px;
    }

    .search-footer {
      display: flex;
      gap: 16px;
      padding: 10px 16px;
      border-top: 1px solid #2a2a4a;
      font-size: 12px;
      color: #555;
    }
    .search-footer kbd {
      background: #0f0f1a;
      border: 1px solid #2a2a4a;
      border-radius: 3px;
      padding: 1px 5px;
      font-size: 11px;
      font-family: inherit;
      color: #666;
      margin-right: 2px;
    }
  `;
  document.head.appendChild(style);
})();
