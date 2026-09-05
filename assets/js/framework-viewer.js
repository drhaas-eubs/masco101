/* ============================================================
   MASCO101 · Framework Sheet Viewer
   Protected PDF rendering with page-anchored navigation
   © 2026 Dr. Hildegard Haas · EU Business School

   Usage:
     1. Load PDF.js (CDN) and this file on every unit page.
     2. Call FW.openPage(N) to open the modal at page N.
     3. Add data-fw-slug="..." to any thumbnail to make it clickable.
     4. The pill button uses class "fw-viewer-pill" + data-fw-slug
        or data-fw-page.
   ============================================================ */
(function () {
  'use strict';

  /* ----- Configuration ---------------------------------------- */
  const PDF_PATH = 'assets/pdf/framework-library.pdf';
  const PDFJS_VERSION = '3.11.174';
  const PDFJS_LIB = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/pdf.min.js`;
  const PDFJS_WORKER = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/pdf.worker.min.js`;

  /* ----- Page anchor mapping ---------------------------------- */
  /* Page formula: page = 10 + 5*(slibrary-1) + sheet
     (Cover=1, Master Index pp.2-9, "How to Use" p.10, sheets start p.11) */
  const FRAMEWORKS = [
    { slug: 'smart-goals',                     name: "SMART Goal Frame",                            unit: 1, slibrary:  1, sheet: 1 },
    { slug: 'kolb-cycle',                      name: "Kolb Experiential Learning Cycle",            unit: 1, slibrary:  1, sheet: 2 },
    { slug: 'blooms-taxonomy',                 name: "Bloom's Taxonomy (Revised)",                  unit: 1, slibrary:  1, sheet: 3 },
    { slug: 'dreyfus-model',                   name: "Dreyfus Skill Acquisition Model",             unit: 1, slibrary:  1, sheet: 4 },
    { slug: 'deliberate-practice',             name: "Deliberate Practice Loop",                    unit: 1, slibrary:  1, sheet: 5 },
    { slug: 'digcomp-wheel',                   name: "DigComp 2.2 Competence Wheel",                unit: 1, slibrary:  2, sheet: 1 },
    { slug: 'craap-test',                      name: "CRAAP Source Test",                           unit: 1, slibrary:  2, sheet: 2 },
    { slug: 'tam-model',                       name: "Technology Acceptance Model",                 unit: 1, slibrary:  2, sheet: 3 },
    { slug: 'automation-bias',                 name: "Automation Bias Curve",                       unit: 1, slibrary:  2, sheet: 4 },
    { slug: 'co-intelligence-rules',           name: "Co-Intelligence Working Rules",               unit: 1, slibrary:  2, sheet: 5 },
    { slug: 'personal-swot',                   name: "Personal SWOT Matrix",                        unit: 2, slibrary:  3, sheet: 1 },
    { slug: 'johari-window',                   name: "Johari Window",                               unit: 2, slibrary:  3, sheet: 2 },
    { slug: 'ikigai-venn',                     name: "Ikigai Purpose Venn",                         unit: 2, slibrary:  3, sheet: 3 },
    { slug: 'firm-foundation',                 name: "Firm Foundation: Vision, Mission, Values",    unit: 2, slibrary:  3, sheet: 4 },
    { slug: 'personal-energy-model',           name: "Personal Energy Model",                       unit: 2, slibrary:  3, sheet: 5 },
    { slug: 'mbti-dichotomies',                name: "MBTI Four Dichotomies",                       unit: 2, slibrary:  4, sheet: 1 },
    { slug: 'disc-quadrant',                   name: "DISC Behavioural Quadrant",                   unit: 2, slibrary:  4, sheet: 2 },
    { slug: 'big-five',                        name: "Big Five (OCEAN)",                            unit: 2, slibrary:  4, sheet: 3 },
    { slug: 'honey-mumford',                   name: "Honey & Mumford Learning Styles",             unit: 2, slibrary:  4, sheet: 4 },
    { slug: 'mindset-fork',                    name: "Growth vs. Fixed Mindset Fork",               unit: 2, slibrary:  4, sheet: 5 },
    { slug: 'scqa',                            name: "SCQA Structure",                              unit: 3, slibrary:  5, sheet: 1 },
    { slug: 'mece-issue-tree',                 name: "MECE Issue Tree",                             unit: 3, slibrary:  5, sheet: 2 },
    { slug: 'first-principles',                name: "First Principles Decomposition",              unit: 3, slibrary:  5, sheet: 3 },
    { slug: 'double-diamond',                  name: "Double Diamond",                              unit: 3, slibrary:  5, sheet: 4 },
    { slug: 'cynefin',                         name: "Cynefin Framework",                           unit: 3, slibrary:  5, sheet: 5 },
    { slug: 'system-1-2',                      name: "System 1 / System 2",                         unit: 3, slibrary:  6, sheet: 1 },
    { slug: 'confirmation-bias',               name: "Confirmation Bias Loop",                      unit: 3, slibrary:  6, sheet: 2 },
    { slug: 'anchoring',                       name: "Anchoring & Adjustment",                      unit: 3, slibrary:  6, sheet: 3 },
    { slug: 'ladder-of-inference',             name: "Ladder of Inference",                         unit: 3, slibrary:  6, sheet: 4 },
    { slug: 'dunning-kruger',                  name: "Dunning–Kruger Curve",                        unit: 3, slibrary:  6, sheet: 5 },
    { slug: 'brand-pyramid',                   name: "Brand Pyramid",                               unit: 4, slibrary:  7, sheet: 1 },
    { slug: 'brand-archetypes',                name: "Twelve Brand Archetypes",                     unit: 4, slibrary:  7, sheet: 2 },
    { slug: 'storybrand-sb7',                  name: "StoryBrand SB7 Framework",                    unit: 4, slibrary:  7, sheet: 3 },
    { slug: 'golden-circle',                   name: "Golden Circle",                               unit: 4, slibrary:  7, sheet: 4 },
    { slug: 'value-prop-canvas',               name: "Personal Value Proposition Canvas",           unit: 4, slibrary:  7, sheet: 5 },
    { slug: 'message-strategy-spectrum',       name: "Message Strategy Spectrum",                   unit: 4, slibrary:  8, sheet: 1 },
    { slug: 'elevator-pitch',                  name: "Problem → Insight → Recommendation",          unit: 4, slibrary:  8, sheet: 2 },
    { slug: 'assertion-evidence',              name: "Assertion–Evidence Slide Model",              unit: 4, slibrary:  8, sheet: 3 },
    { slug: 'mehrabian',                       name: "Mehrabian 7–38–55",                           unit: 4, slibrary:  8, sheet: 4 },
    { slug: 'anxiety-reappraisal',             name: "Anxiety Reappraisal",                         unit: 4, slibrary:  8, sheet: 5 },
    { slug: 'pyramid-principle',               name: "Pyramid Principle",                           unit: 5, slibrary:  9, sheet: 1 },
    { slug: 'distill-decompose',               name: "Distil → Decompose → Prioritise",             unit: 5, slibrary:  9, sheet: 2 },
    { slug: 'toulmin-model',                   name: "Toulmin Argument Model",                      unit: 5, slibrary:  9, sheet: 3 },
    { slug: 'bluf-structure',                  name: "BLUF Executive Structure",                    unit: 5, slibrary:  9, sheet: 4 },
    { slug: 'storyline-canvas',                name: "Storyline Canvas",                            unit: 5, slibrary:  9, sheet: 5 },
    { slug: 'shannon-weaver',                  name: "Shannon–Weaver Model",                        unit: 5, slibrary: 10, sheet: 1 },
    { slug: 'hofstede-dimensions',             name: "Hofstede Cultural Dimensions",                unit: 5, slibrary: 10, sheet: 2 },
    { slug: 'culture-map',                     name: "The Culture Map (Eight Scales)",              unit: 5, slibrary: 10, sheet: 3 },
    { slug: 'high-low-context',                name: "High- and Low-Context Communication",         unit: 5, slibrary: 10, sheet: 4 },
    { slug: 'stakeholder-matrix',              name: "Power–Interest Grid",                         unit: 5, slibrary: 10, sheet: 5 },
    { slug: 'project-lifecycle',               name: "Project Lifecycle",                           unit: 6, slibrary: 11, sheet: 1 },
    { slug: 'iron-triangle',                   name: "Iron Triangle",                               unit: 6, slibrary: 11, sheet: 2 },
    { slug: 'wbs',                             name: "Work Breakdown Structure",                    unit: 6, slibrary: 11, sheet: 3 },
    { slug: 'gantt-chart',                     name: "Gantt Chart",                                 unit: 6, slibrary: 11, sheet: 4 },
    { slug: 'critical-path',                   name: "Critical Path Method",                        unit: 6, slibrary: 11, sheet: 5 },
    { slug: 'agile-manifesto',                 name: "Agile Manifesto Values",                      unit: 6, slibrary: 12, sheet: 1 },
    { slug: 'scrum-cycle',                     name: "Scrum Sprint Cycle",                          unit: 6, slibrary: 12, sheet: 2 },
    { slug: 'stacey-matrix',                   name: "Stacey Matrix",                               unit: 6, slibrary: 12, sheet: 3 },
    { slug: 'risk-matrix',                     name: "Probability–Impact Risk Matrix",              unit: 6, slibrary: 12, sheet: 4 },
    { slug: 'earned-value',                    name: "Earned Value S-Curve",                        unit: 6, slibrary: 12, sheet: 5 },
    { slug: 'batna',                           name: "BATNA",                                       unit: 7, slibrary: 13, sheet: 1 },
    { slug: 'zopa',                            name: "Zone of Possible Agreement",                  unit: 7, slibrary: 13, sheet: 2 },
    { slug: 'principled-negotiation',          name: "Principled Negotiation",                      unit: 7, slibrary: 13, sheet: 3 },
    { slug: 'thomas-kilmann',                  name: "Dual Concerns Conflict Modes",                unit: 7, slibrary: 13, sheet: 4 },
    { slug: 'distributive-integrative',        name: "Distributive ↔ Integrative Spectrum",         unit: 7, slibrary: 13, sheet: 5 },
    { slug: 'cialdini-principles',             name: "Six Principles of Influence",                 unit: 7, slibrary: 14, sheet: 1 },
    { slug: 'french-raven',                    name: "French & Raven Power Bases",                  unit: 7, slibrary: 14, sheet: 2 },
    { slug: 'influence-currencies',            name: "Influence Currencies",                        unit: 7, slibrary: 14, sheet: 3 },
    { slug: 'tactical-empathy',                name: "Tactical Empathy",                            unit: 7, slibrary: 14, sheet: 4 },
    { slug: 'persuasion-manipulation',         name: "Persuasion ↔ Manipulation Line",              unit: 7, slibrary: 14, sheet: 5 },
    { slug: 'eisenhower-matrix',               name: "Eisenhower Matrix",                           unit: 8, slibrary: 15, sheet: 1 },
    { slug: 'okrs',                            name: "Objectives & Key Results",                    unit: 8, slibrary: 15, sheet: 2 },
    { slug: 'rule-of-3',                       name: "The Rule of 3",                               unit: 8, slibrary: 15, sheet: 3 },
    { slug: 'monday-vision',                   name: "Monday Vision, Daily Wins, Friday Reflection", unit: 8, slibrary: 15, sheet: 4 },
    { slug: 'pareto-principle',                name: "Pareto 80/20",                                unit: 8, slibrary: 15, sheet: 5 },
    { slug: 'prompt-anatomy',                  name: "Prompt Anatomy",                              unit: 8, slibrary: 16, sheet: 1 },
    { slug: 'human-in-the-loop',               name: "Delegate–Verify–Own Loop",                    unit: 8, slibrary: 16, sheet: 2 },
    { slug: 'automation-augmentation',         name: "Automation–Augmentation Spectrum",            unit: 8, slibrary: 16, sheet: 3 },
    { slug: 'jagged-frontier',                 name: "The Jagged Frontier",                         unit: 8, slibrary: 16, sheet: 4 },
    { slug: 'attribution-ladder',              name: "AI Attribution Ladder",                       unit: 8, slibrary: 16, sheet: 5 }
  ];

  /* Compute page anchors */
  FRAMEWORKS.forEach(fw => {
    fw.page = 10 + 5 * (fw.slibrary - 1) + fw.sheet;
  });

  /* Build lookup map by slug */
  const SLUG_TO_FW = {};
  FRAMEWORKS.forEach(fw => { SLUG_TO_FW[fw.slug] = fw; });

  /* Unit overview pages: jump to that unit's first sheet */
  const UNIT_PAGES = { 1: 11, 2: 21, 3: 31, 4: 41, 5: 51, 6: 61, 7: 71, 8: 81 };

  /* ----- Slibrary metadata (from Dr. Haas's actual unit files) - */
  const UNIT_TITLES = {
    1: 'Introduction to Tools for Success & Digital/AI Literacy',
    2: 'Know Yourself: Self-Assessment as a Strategic Tool',
    3: 'Think Better: Critical Thinking & Analytical Reasoning',
    4: 'Present & Position Yourself: Personal Branding & Presentation Skills',
    5: 'Communicate with Impact: Executive Presence & Business Communication',
    6: 'Deliver Results: Project Management Fundamentals',
    7: 'Negotiate & Influence: Getting What You Need Without Formal Authority',
    8: 'Work Smarter with AI: Productivity, Tools and Professional Judgment'
  };

  const SLIBRARIES = [
    { num:  1, unit: 1, title: 'Learning & Goal Architecture',        color: '#2563EB' },
    { num:  2, unit: 1, title: 'Digital & AI Literacy',               color: '#DC2626' },
    { num:  3, unit: 2, title: 'Self-Diagnosis',                      color: '#7C3AED' },
    { num:  4, unit: 2, title: 'Style & Preference Profiling',        color: '#DB2777' },
    { num:  5, unit: 3, title: 'Structured Problem-Solving',          color: '#BE123C' },
    { num:  6, unit: 3, title: 'Judgment & Bias',                     color: '#0F766E' },
    { num:  7, unit: 4, title: 'Personal Brand & Positioning',        color: '#C2410C' },
    { num:  8, unit: 4, title: 'Pitch & Delivery',                    color: '#D97706' },
    { num:  9, unit: 5, title: 'Argument Architecture',               color: '#0F766E' },
    { num: 10, unit: 5, title: 'Audience & Culture',                  color: '#0891B2' },
    { num: 11, unit: 6, title: 'Project Lifecycle & Planning',        color: '#2563EB' },
    { num: 12, unit: 6, title: 'Agile, Risk & Control',               color: '#059669' },
    { num: 13, unit: 7, title: 'Negotiation Architecture',            color: '#475569' },
    { num: 14, unit: 7, title: 'Influence Without Authority',         color: '#B45309' },
    { num: 15, unit: 8, title: 'Prioritisation & Energy',             color: '#1D4ED8' },
    { num: 16, unit: 8, title: 'AI Workflow & Judgment',              color: '#047857' }
  ];
  /* First page of each Slibrary in the PDF: page = 9 + 5*(num-1) */
  SLIBRARIES.forEach(s => { s.firstPage = 11 + 5 * (s.num - 1); });

  /* ----- State ----------------------------------------------- */
  let pdfDoc = null;
  let currentPage = 1;
  let totalPages = 90;
  let isRendering = false;
  let pdfjsReady = null; /* Promise */

  /* ----- DOM injection --------------------------------------- */
  function buildModalDOM() {
    if (document.getElementById('fw-viewer-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'fw-viewer-overlay';
    overlay.className = 'fw-viewer-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'fw-viewer-title');
    overlay.innerHTML = `
      <div class="fw-viewer-modal" id="fw-viewer-modal">
        <header class="fw-viewer-header">
          <div style="min-width:0; flex:1;">
            <h2 class="fw-viewer-title" id="fw-viewer-title">Framework Sheet</h2>
            <span class="fw-viewer-title-meta" id="fw-viewer-meta">MASCO101 · Framework Library</span>
          </div>
          <div class="fw-viewer-controls">
            <div class="fw-search-wrap" id="fw-search-wrap">
              <svg class="fw-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
              <input type="search" id="fw-search-input" class="fw-search-input" placeholder="Search PDF…" aria-label="Search PDF text" autocomplete="off">
              <span class="fw-search-status" id="fw-search-status"></span>
              <button type="button" class="fw-search-nav-btn" id="fw-search-prev" aria-label="Previous match" title="Previous match (Shift+Enter)" disabled>‹</button>
              <button type="button" class="fw-search-nav-btn" id="fw-search-next" aria-label="Next match" title="Next match (Enter)" disabled>›</button>
              <button type="button" class="fw-search-clear-btn" id="fw-search-clear" aria-label="Clear search" title="Clear">×</button>
            </div>
            <button type="button" class="fw-btn" id="fw-btn-prev" aria-label="Previous sheet" title="Previous (←)">‹</button>
            <span class="fw-page-indicator" id="fw-page-indicator">– / –</span>
            <button type="button" class="fw-btn" id="fw-btn-next" aria-label="Next sheet" title="Next (→)">›</button>
            <button type="button" class="fw-btn" id="fw-btn-zoom-out" aria-label="Zoom out" title="Zoom out (−)">−</button>
            <button type="button" class="fw-btn" id="fw-btn-zoom-in" aria-label="Zoom in" title="Zoom in (+)">+</button>
            <button type="button" class="fw-btn-close" id="fw-btn-close" aria-label="Close (Esc)" title="Close (Esc)">×</button>
          </div>
        </header>
        <div class="fw-viewer-body" id="fw-viewer-body">
          <div class="fw-loading" id="fw-loading">Loading framework library…</div>
          <div class="fw-canvas-wrap" id="fw-canvas-wrap" style="display:none;">
            <canvas class="fw-canvas" id="fw-canvas"></canvas>
            <div class="fw-highlight-layer" id="fw-highlight-layer" aria-hidden="true"></div>
          </div>
        </div>
        <footer class="fw-viewer-footer">
          <strong>MASCO101 · Framework Sheet Library</strong> · 16 Slibraries · 80 Reference Sheets · © 2026 Dr. Hildegard Haas · EU Business School · All rights reserved
        </footer>
      </div>
    `;
    document.body.appendChild(overlay);
  }

  /* ----- PDF.js loader --------------------------------------- */
  function loadPdfJs() {
    if (pdfjsReady) return pdfjsReady;
    pdfjsReady = new Promise((resolve, reject) => {
      if (window.pdfjsLib) { resolve(window.pdfjsLib); return; }
      const script = document.createElement('script');
      script.src = PDFJS_LIB;
      script.onload = () => {
        if (window.pdfjsLib) {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER;
          resolve(window.pdfjsLib);
        } else {
          reject(new Error('PDF.js failed to load'));
        }
      };
      script.onerror = () => reject(new Error('PDF.js failed to load'));
      document.head.appendChild(script);
    });
    return pdfjsReady;
  }

  /* ----- Rendering -------------------------------------------- */
  let zoomScale = 1.0;
  const ZOOM_MIN = 0.6;
  const ZOOM_MAX = 2.5;
  const ZOOM_STEP = 0.2;

  async function renderPage(pageNum) {
    if (!pdfDoc || isRendering) return;
    if (pageNum < 1 || pageNum > totalPages) return;
    isRendering = true;
    currentPage = pageNum;

    const loading = document.getElementById('fw-loading');
    const wrap    = document.getElementById('fw-canvas-wrap');
    const canvas  = document.getElementById('fw-canvas');
    const ctx     = canvas.getContext('2d');

    try {
      const page = await pdfDoc.getPage(pageNum);
      const containerWidth = document.getElementById('fw-viewer-body').clientWidth - 40;
      const baseViewport   = page.getViewport({ scale: 1.0 });
      const fitScale       = Math.min(containerWidth / baseViewport.width, 1.6);
      const dpr            = window.devicePixelRatio || 1;
      const viewport       = page.getViewport({ scale: fitScale * zoomScale });

      canvas.width  = Math.floor(viewport.width  * dpr);
      canvas.height = Math.floor(viewport.height * dpr);
      canvas.style.width  = Math.floor(viewport.width)  + 'px';
      canvas.style.height = Math.floor(viewport.height) + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      await page.render({ canvasContext: ctx, viewport }).promise;

      loading.style.display = 'none';
      wrap.style.display    = 'block';

      updateMeta(pageNum);
      updateNavButtons();
      /* Redraw search highlights for the newly rendered page */
      if (searchQuery) drawHighlights();
    } catch (err) {
      console.error('FW viewer render error:', err);
      loading.textContent = 'Could not load the framework sheet. Please try again.';
    } finally {
      isRendering = false;
    }
  }

  function updateMeta(pageNum) {
    const fw = FRAMEWORKS.find(f => f.page === pageNum);
    const titleEl = document.getElementById('fw-viewer-title');
    const metaEl  = document.getElementById('fw-viewer-meta');
    const indEl   = document.getElementById('fw-page-indicator');

    if (fw) {
      titleEl.textContent = fw.name;
      metaEl.textContent  = `Unit ${fw.unit} · Slibrary ${fw.slibrary} · Sheet ${fw.sheet} / 5`;
    } else if (pageNum === 1) {
      titleEl.textContent = 'Framework Sheet Library';
      metaEl.textContent  = 'MASCO101 · Master Index';
    } else if (pageNum >= 2 && pageNum <= 9) {
      const u = pageNum - 1;
      titleEl.textContent = `Master Index · Unit ${u}`;
      metaEl.textContent  = 'MASCO101 · Framework Library';
    } else if (pageNum === 10) {
      titleEl.textContent = 'How to Use This Library';
      metaEl.textContent  = 'MASCO101 · Framework Library';
    } else {
      titleEl.textContent = 'Framework Sheet';
      metaEl.textContent  = 'MASCO101 · Framework Library';
    }
    indEl.textContent = `${pageNum} / ${totalPages}`;
  }

  function updateNavButtons() {
    document.getElementById('fw-btn-prev').disabled = (currentPage <= 1);
    document.getElementById('fw-btn-next').disabled = (currentPage >= totalPages);
    document.getElementById('fw-btn-zoom-out').disabled = (zoomScale <= ZOOM_MIN + 0.01);
    document.getElementById('fw-btn-zoom-in').disabled  = (zoomScale >= ZOOM_MAX - 0.01);
  }

  /* ----- PDF text search ------------------------------------- */
  /* On-demand text indexing: extract page text via PDF.js getTextContent
     the first time the user searches, then cache. */
  const pageTextCache = new Map();   /* pageNum -> [{ str, transform, width, height, fontName }, ...] */
  let searchMatches   = [];          /* [{ pageNum, items: [{itemIdx, charStart, charEnd}], pageStr, pageMatchIdx }, ...]
                                        flattened: each match is one occurrence on one page */
  let currentMatchIdx = -1;
  let searchQuery     = '';
  let searchIndexing  = false;

  async function indexAllPages() {
    if (pageTextCache.size === totalPages) return;
    searchIndexing = true;
    setSearchStatus('Indexing…');
    /* Index in chunks so the UI stays responsive */
    for (let p = 1; p <= totalPages; p++) {
      if (pageTextCache.has(p)) continue;
      try {
        const page = await pdfDoc.getPage(p);
        const tc = await page.getTextContent();
        /* Build a contiguous text string for this page + map back to items */
        let pageStr = '';
        const itemRanges = [];
        for (let i = 0; i < tc.items.length; i++) {
          const it = tc.items[i];
          const start = pageStr.length;
          pageStr += it.str;
          itemRanges.push({ start, end: pageStr.length, item: it });
          /* Add a space between items if PDF.js indicates a hard break */
          if (it.hasEOL) pageStr += '\n';
          else pageStr += ' ';
        }
        pageTextCache.set(p, { pageStr, itemRanges });
      } catch (err) {
        console.warn('PDF index error on page', p, err);
        pageTextCache.set(p, { pageStr: '', itemRanges: [] });
      }
      /* Yield to browser every 16 pages */
      if (p % 16 === 0) await new Promise(r => setTimeout(r, 0));
    }
    searchIndexing = false;
  }

  function findAllMatches(query) {
    const matches = [];
    if (!query) return matches;
    const q = query.toLowerCase();
    for (let p = 1; p <= totalPages; p++) {
      const cache = pageTextCache.get(p);
      if (!cache || !cache.pageStr) continue;
      const lower = cache.pageStr.toLowerCase();
      let from = 0;
      while (true) {
        const idx = lower.indexOf(q, from);
        if (idx === -1) break;
        matches.push({ pageNum: p, charStart: idx, charEnd: idx + q.length });
        from = idx + q.length;
      }
    }
    return matches;
  }

  async function performSearch(query) {
    searchQuery = query.trim();
    if (!searchQuery) {
      searchMatches = [];
      currentMatchIdx = -1;
      setSearchStatus('');
      clearHighlights();
      updateSearchNavButtons();
      return;
    }
    if (!pdfDoc) return;
    if (!pageTextCache.size || pageTextCache.size < totalPages) {
      await indexAllPages();
    }
    searchMatches = findAllMatches(searchQuery);
    if (searchMatches.length === 0) {
      currentMatchIdx = -1;
      setSearchStatus('No matches');
      clearHighlights();
      updateSearchNavButtons();
      return;
    }
    /* Jump to first match's page */
    currentMatchIdx = 0;
    await jumpToMatch(0);
  }

  async function jumpToMatch(idx) {
    if (idx < 0 || idx >= searchMatches.length) return;
    currentMatchIdx = idx;
    const m = searchMatches[idx];
    setSearchStatus(`${idx + 1} of ${searchMatches.length}`);
    updateSearchNavButtons();
    if (currentPage !== m.pageNum) {
      await renderPage(m.pageNum);
      /* renderPage calls drawHighlights via the post-render hook below */
    } else {
      drawHighlights();
    }
  }

  function setSearchStatus(text) {
    const el = document.getElementById('fw-search-status');
    if (el) el.textContent = text;
  }

  function updateSearchNavButtons() {
    const prev = document.getElementById('fw-search-prev');
    const next = document.getElementById('fw-search-next');
    if (!prev || !next) return;
    const has = searchMatches.length > 0;
    prev.disabled = !has;
    next.disabled = !has;
  }

  function clearHighlights() {
    const layer = document.getElementById('fw-highlight-layer');
    if (layer) layer.innerHTML = '';
  }

  function drawHighlights() {
    const layer  = document.getElementById('fw-highlight-layer');
    const canvas = document.getElementById('fw-canvas');
    if (!layer || !canvas || !searchQuery) { clearHighlights(); return; }

    /* Match the highlight layer to canvas dimensions */
    layer.style.width  = canvas.style.width;
    layer.style.height = canvas.style.height;
    layer.innerHTML    = '';

    const cache = pageTextCache.get(currentPage);
    if (!cache) return;

    /* Get matches on the current page only */
    const pageMatchesGlobal = searchMatches
      .map((m, gi) => ({ ...m, gi }))
      .filter(m => m.pageNum === currentPage);
    if (pageMatchesGlobal.length === 0) return;

    /* For each match, find which text item(s) it overlaps and compute screen bbox */
    pdfDoc.getPage(currentPage).then(async page => {
      const baseViewport = page.getViewport({ scale: 1.0 });
      const containerWidth = document.getElementById('fw-viewer-body').clientWidth - 40;
      const fitScale = Math.min(containerWidth / baseViewport.width, 1.6);
      const viewport = page.getViewport({ scale: fitScale * zoomScale });

      pageMatchesGlobal.forEach(m => {
        for (const r of cache.itemRanges) {
          /* Check if this item intersects the match span */
          if (r.end <= m.charStart) continue;
          if (r.start >= m.charEnd) break;
          const item = r.item;
          if (!item.transform) continue;
          /* PDF.js transform: [scaleX, skewY, skewX, scaleY, x, y]
             where (x,y) is bottom-left of the text in PDF coords */
          const [a, b, c, d, e, f] = item.transform;
          const fontHeight = Math.hypot(c, d) || item.height || 12;
          const fontWidth  = Math.hypot(a, b) || 0;

          /* Compute the portion of the item that's matched */
          const overlapStart = Math.max(0, m.charStart - r.start);
          const overlapEnd   = Math.min(item.str.length, m.charEnd - r.start);
          if (overlapEnd <= overlapStart) continue;
          const fracStart = overlapStart / Math.max(1, item.str.length);
          const fracEnd   = overlapEnd   / Math.max(1, item.str.length);

          /* PDF coords → viewport coords */
          const pt1 = viewport.convertToViewportPoint(e + fracStart * (item.width || fontWidth), f);
          const pt2 = viewport.convertToViewportPoint(e + fracEnd   * (item.width || fontWidth), f);
          const left   = Math.min(pt1[0], pt2[0]);
          const right  = Math.max(pt1[0], pt2[0]);
          const top    = pt1[1] - fontHeight * fitScale * zoomScale;
          const width  = Math.max(2, right - left);
          const height = fontHeight * fitScale * zoomScale;

          const div = document.createElement('div');
          div.className = 'fw-highlight';
          if (m.gi === currentMatchIdx) div.classList.add('fw-highlight-current');
          div.style.left   = left   + 'px';
          div.style.top    = top    + 'px';
          div.style.width  = width  + 'px';
          div.style.height = height + 'px';
          layer.appendChild(div);
        }
      });
    });
  }

  /* ----- Open / close ---------------------------------------- */
  async function openPage(pageNum) {
    buildModalDOM();
    bindControlsOnce();
    const overlay = document.getElementById('fw-viewer-overlay');
    overlay.classList.add('fw-open');
    document.body.style.overflow = 'hidden';
    enableProtection();

    /* Reset to loading state */
    document.getElementById('fw-loading').style.display = 'block';
    document.getElementById('fw-loading').textContent = 'Loading framework library…';
    document.getElementById('fw-canvas-wrap').style.display = 'none';

    try {
      const pdfjsLib = await loadPdfJs();
      if (!pdfDoc) {
        const loadingTask = pdfjsLib.getDocument({
          url: PDF_PATH,
          /* Disable text/annotation extraction — we only render images */
          disableAutoFetch: false,
          disableStream: false
        });
        pdfDoc = await loadingTask.promise;
        totalPages = pdfDoc.numPages;
      }
      zoomScale = 1.0;
      await renderPage(pageNum || 1);
    } catch (err) {
      console.error('FW viewer open error:', err);
      document.getElementById('fw-loading').textContent =
        'The framework sheet library (assets/pdf/framework-library.pdf) is not on the server yet. Add the file to enable the full A4 reference sheets.';
    }
  }

  function close() {
    const overlay = document.getElementById('fw-viewer-overlay');
    if (overlay) overlay.classList.remove('fw-open');
    document.body.style.overflow = '';
    disableProtection();
    /* Reset search state so the next session starts clean */
    searchQuery = '';
    searchMatches = [];
    currentMatchIdx = -1;
    const si = document.getElementById('fw-search-input');
    if (si) si.value = '';
    setSearchStatus('');
    clearHighlights();
    updateSearchNavButtons();
  }

  function openSlug(slug) {
    const fw = SLUG_TO_FW[slug];
    if (fw) openPage(fw.page);
    else openPage(1);
  }

  function openUnit(unitNum) {
    const p = UNIT_PAGES[unitNum] || 1;
    openPage(p);
  }

  /* ----- Slibrary picker modal ------------------------------- */
  function buildPickerDOM() {
    if (document.getElementById('fw-picker-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'fw-picker-overlay';
    overlay.className = 'fw-picker-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'fw-picker-title');

    /* Group slibraries by unit */
    const byUnit = {};
    SLIBRARIES.forEach(s => {
      if (!byUnit[s.unit]) byUnit[s.unit] = [];
      byUnit[s.unit].push(s);
    });

    let unitsHTML = '';
    Object.keys(byUnit).sort().forEach(u => {
      const tilesHTML = byUnit[u].map(s => `
        <button type="button" class="fw-picker-tile"
                style="--tile-color:${s.color}"
                data-slibrary-page="${s.firstPage}"
                aria-label="Open Slibrary ${s.num}: ${s.title}">
          <span class="fw-picker-tile-num">Slibrary ${String(s.num).padStart(2,'0')}</span>
          <span class="fw-picker-tile-title">${s.title}</span>
          <span class="fw-picker-tile-meta">5 sheets · pp. ${s.firstPage}–${s.firstPage + 4}</span>
          <span class="fw-picker-tile-arrow">→</span>
        </button>`).join('');
      unitsHTML += `
        <section class="fw-picker-unit">
          <div class="fw-picker-unit-title"><strong>Unit ${u}</strong>${UNIT_TITLES[u] || ''}</div>
          <div class="fw-picker-grid">${tilesHTML}</div>
        </section>`;
    });

    overlay.innerHTML = `
      <div class="fw-picker-modal">
        <header class="fw-picker-header">
          <div>
            <h2 id="fw-picker-title">Framework Sheet Library</h2>
            <span class="sub">16 Slibraries · 80 Reference Sheets · select a Slibrary to open</span>
          </div>
          <button type="button" class="fw-picker-close" id="fw-picker-close-btn"
                  aria-label="Close (Esc)" title="Close (Esc)">×</button>
        </header>
        <div class="fw-picker-body">${unitsHTML}</div>
        <footer class="fw-picker-footer">
          <strong>MASCO101 · Framework Sheet Library</strong> · © 2026 Dr. Hildegard Haas · EU Business School
        </footer>
      </div>
    `;
    document.body.appendChild(overlay);

    /* Wire up tile clicks */
    overlay.querySelectorAll('.fw-picker-tile').forEach(btn => {
      btn.addEventListener('click', () => {
        const page = parseInt(btn.getAttribute('data-slibrary-page'), 10);
        closePicker();
        openPage(page);
      });
    });

    /* Close button */
    document.getElementById('fw-picker-close-btn').addEventListener('click', closePicker);

    /* Click outside modal closes */
    overlay.addEventListener('click', e => {
      if (e.target.id === 'fw-picker-overlay') closePicker();
    });
  }

  function openSlibraryPicker() {
    buildPickerDOM();
    const overlay = document.getElementById('fw-picker-overlay');
    overlay.classList.add('fw-open');
    document.body.style.overflow = 'hidden';
    /* Esc to close */
    document.addEventListener('keydown', onPickerKeydown, true);
  }

  function closePicker() {
    const overlay = document.getElementById('fw-picker-overlay');
    if (overlay) overlay.classList.remove('fw-open');
    /* Only restore body overflow if PDF viewer isn't open */
    const pdfOpen = document.getElementById('fw-viewer-overlay')?.classList.contains('fw-open');
    if (!pdfOpen) document.body.style.overflow = '';
    document.removeEventListener('keydown', onPickerKeydown, true);
  }

  function onPickerKeydown(e) {
    if (e.key === 'Escape') {
      e.preventDefault();
      closePicker();
    }
  }

  /* ----- Controls -------------------------------------------- */
  let controlsBound = false;
  function bindControlsOnce() {
    if (controlsBound) return;
    controlsBound = true;

    document.getElementById('fw-btn-close').addEventListener('click', close);
    document.getElementById('fw-viewer-overlay').addEventListener('click', e => {
      if (e.target.id === 'fw-viewer-overlay') close();
    });
    document.getElementById('fw-btn-prev').addEventListener('click', () => {
      if (currentPage > 1) renderPage(currentPage - 1);
    });
    document.getElementById('fw-btn-next').addEventListener('click', () => {
      if (currentPage < totalPages) renderPage(currentPage + 1);
    });
    document.getElementById('fw-btn-zoom-in').addEventListener('click', () => {
      zoomScale = Math.min(ZOOM_MAX, zoomScale + ZOOM_STEP);
      renderPage(currentPage);
    });
    document.getElementById('fw-btn-zoom-out').addEventListener('click', () => {
      zoomScale = Math.max(ZOOM_MIN, zoomScale - ZOOM_STEP);
      renderPage(currentPage);
    });

    /* ---- Search controls ---- */
    const searchInput = document.getElementById('fw-search-input');
    const searchPrev  = document.getElementById('fw-search-prev');
    const searchNext  = document.getElementById('fw-search-next');
    const searchClear = document.getElementById('fw-search-clear');
    let searchDebounce = null;

    if (searchInput) {
      searchInput.addEventListener('input', () => {
        clearTimeout(searchDebounce);
        searchDebounce = setTimeout(() => performSearch(searchInput.value), 220);
      });
      searchInput.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
          e.preventDefault();
          if (searchMatches.length === 0) return;
          if (e.shiftKey) {
            const next = (currentMatchIdx - 1 + searchMatches.length) % searchMatches.length;
            jumpToMatch(next);
          } else {
            const next = (currentMatchIdx + 1) % searchMatches.length;
            jumpToMatch(next);
          }
        } else if (e.key === 'Escape') {
          if (searchInput.value) {
            e.stopPropagation();
            searchInput.value = '';
            performSearch('');
          }
        }
      });
    }
    if (searchPrev) {
      searchPrev.addEventListener('click', () => {
        if (searchMatches.length === 0) return;
        const next = (currentMatchIdx - 1 + searchMatches.length) % searchMatches.length;
        jumpToMatch(next);
      });
    }
    if (searchNext) {
      searchNext.addEventListener('click', () => {
        if (searchMatches.length === 0) return;
        const next = (currentMatchIdx + 1) % searchMatches.length;
        jumpToMatch(next);
      });
    }
    if (searchClear) {
      searchClear.addEventListener('click', () => {
        if (searchInput) {
          searchInput.value = '';
          searchInput.focus();
        }
        performSearch('');
      });
    }
  }

  /* ----- Protection layer ------------------------------------ */
  /* These handlers are attached only while the modal is open
     so they don't interfere with the rest of the site. */
  function onContextMenu(e) {
    if (e.target.closest('#fw-viewer-overlay')) {
      e.preventDefault();
      return false;
    }
  }
  function onSelectStart(e) {
    if (e.target && e.target.id === 'fw-search-input') return; /* allow in search */
    if (e.target.closest('#fw-viewer-overlay')) {
      e.preventDefault();
      return false;
    }
  }
  function onCopy(e) {
    if (e.target && e.target.id === 'fw-search-input') return; /* allow in search */
    if (document.getElementById('fw-viewer-overlay')?.classList.contains('fw-open')) {
      e.preventDefault();
      e.clipboardData?.setData('text/plain', '');
    }
  }
  function onKeyDown(e) {
    const overlay = document.getElementById('fw-viewer-overlay');
    if (!overlay || !overlay.classList.contains('fw-open')) return;

    /* Allow normal keyboard interaction inside the search input */
    const inSearch = e.target && e.target.id === 'fw-search-input';

    /* Esc closes (unless search is active and clearing it) */
    if (e.key === 'Escape' && !inSearch) { close(); return; }

    /* Arrow keys navigate (skip when typing in search) */
    if (!inSearch && e.key === 'ArrowLeft' && currentPage > 1) {
      e.preventDefault();
      renderPage(currentPage - 1);
      return;
    }
    if (!inSearch && e.key === 'ArrowRight' && currentPage < totalPages) {
      e.preventDefault();
      renderPage(currentPage + 1);
      return;
    }

    /* Inside search input: allow normal typing & basic keys */
    if (inSearch) return;

    /* Block save / print / find / view-source / dev-tools shortcuts */
    const ck = e.ctrlKey || e.metaKey;
    if (ck && ['s','p','c','x','a','f','u','j'].includes(e.key.toLowerCase())) {
      /* Cmd+F → focus our search input instead of native find */
      if (e.key.toLowerCase() === 'f') {
        e.preventDefault();
        e.stopPropagation();
        const si = document.getElementById('fw-search-input');
        if (si) { si.focus(); si.select(); }
        return false;
      }
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
    if (e.key === 'F12' || (ck && e.shiftKey && ['i','c','j'].includes(e.key.toLowerCase()))) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  }
  function onDragStart(e) {
    if (e.target.closest('#fw-viewer-overlay')) {
      e.preventDefault();
      return false;
    }
  }
  function onBeforePrint() {
    document.body.classList.add('fw-printing-blocked');
    const overlay = document.getElementById('fw-viewer-overlay');
    if (overlay) overlay.style.display = 'none';
  }
  function onAfterPrint() {
    document.body.classList.remove('fw-printing-blocked');
    const overlay = document.getElementById('fw-viewer-overlay');
    if (overlay && overlay.classList.contains('fw-open')) overlay.style.display = '';
  }

  function enableProtection() {
    document.addEventListener('contextmenu', onContextMenu, true);
    document.addEventListener('selectstart',  onSelectStart, true);
    document.addEventListener('copy',         onCopy,        true);
    document.addEventListener('keydown',      onKeyDown,     true);
    document.addEventListener('dragstart',    onDragStart,   true);
    window.addEventListener('beforeprint',    onBeforePrint);
    window.addEventListener('afterprint',     onAfterPrint);
  }
  function disableProtection() {
    document.removeEventListener('contextmenu', onContextMenu, true);
    document.removeEventListener('selectstart',  onSelectStart, true);
    document.removeEventListener('copy',         onCopy,        true);
    document.removeEventListener('keydown',      onKeyDown,     true);
    document.removeEventListener('dragstart',    onDragStart,   true);
    window.removeEventListener('beforeprint',    onBeforePrint);
    window.removeEventListener('afterprint',     onAfterPrint);
  }

  /* ----- Auto-wire any element with [data-fw-slug] / [data-fw-page] / .fw-viewer-pill --- */
  function attachClickHandlers() {
    /* Pill buttons */
    document.querySelectorAll('.fw-viewer-pill').forEach(el => {
      if (el.dataset.fwBound) return;
      el.dataset.fwBound = '1';
      el.addEventListener('click', e => {
        e.preventDefault();
        const slug = el.getAttribute('data-fw-slug');
        const page = el.getAttribute('data-fw-page');
        const unit = el.getAttribute('data-fw-unit');
        if (slug)      openSlug(slug);
        else if (page) openPage(parseInt(page, 10));
        else if (unit) openUnit(parseInt(unit, 10));
        else           openPage(1);
      });
    });

    /* Framework thumbnails marked with data-fw-slug */
    document.querySelectorAll('[data-fw-slug]').forEach(el => {
      if (el.classList.contains('fw-viewer-pill')) return; /* already handled above */
      if (el.dataset.fwBound) return;
      el.dataset.fwBound = '1';
      el.classList.add('fw-clickable');
      el.setAttribute('tabindex', '0');
      el.setAttribute('role', 'button');
      const handler = e => {
        e.preventDefault();
        openSlug(el.getAttribute('data-fw-slug'));
      };
      el.addEventListener('click', handler);
      el.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handler(e); }
      });
    });

    /* Anchored thumbnails by direct page */
    document.querySelectorAll('[data-fw-page]').forEach(el => {
      if (el.classList.contains('fw-viewer-pill')) return;
      if (el.dataset.fwBound) return;
      el.dataset.fwBound = '1';
      el.classList.add('fw-clickable');
      el.setAttribute('tabindex', '0');
      el.setAttribute('role', 'button');
      const p = parseInt(el.getAttribute('data-fw-page'), 10);
      const handler = e => { e.preventDefault(); openPage(p); };
      el.addEventListener('click', handler);
      el.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handler(e); }
      });
    });
  }

  /* ----- Public API ------------------------------------------ */
  /* Namespace: window.FrameworkSheets (NOT window.FW — that name is
     already used by the existing per-unit framework data array). */
  window.FrameworkSheets = {
    openPage,
    openSlug,
    openUnit,
    openSlibraryPicker,
    close,
    closePicker,
    list: () => FRAMEWORKS.slice(),
    slibraries: () => SLIBRARIES.slice(),
    get: slug => SLUG_TO_FW[slug] || null
  };

  /* ----- Init on DOM ready ----------------------------------- */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attachClickHandlers);
  } else {
    attachClickHandlers();
  }
  /* Re-scan when content is added dynamically (best effort) */
  if (window.MutationObserver) {
    const mo = new MutationObserver(() => attachClickHandlers());
    mo.observe(document.documentElement, { childList: true, subtree: true });
  }
})();
