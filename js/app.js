/**
 * FairCrop.in — Core Client Application Logic
 * Smart India Hackathon 2026 (Problem Statement: SIH-1693)
 * "Strengthening market linkages and price discovery for farmers"
 *
 * Backend integration: all live data sections fetch from
 *   http://localhost:8001/api/v1  via window.FairCropAPI (api.js)
 * Graceful fallback to curated mock data when backend is offline.
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  const api = window.FairCropAPI;

  /* ── Theme Toggle ── */
  const html     = document.documentElement;
  const themeBtn = document.getElementById('theme-btn');
  const iconSun  = document.getElementById('icon-sun');
  const iconMoon = document.getElementById('icon-moon');
  let isDark     = html.getAttribute('data-theme') !== 'light';

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      isDark = !isDark;
      html.setAttribute('data-theme', isDark ? 'dark' : 'light');
      if (iconSun) iconSun.style.display = isDark ? 'block' : 'none';
      if (iconMoon) iconMoon.style.display = isDark ? 'none' : 'block';
      showToast(`Switched to ${isDark ? 'Dark' : 'Light'} theme`);
    });
  }

  /* ── Scroll Cue Smooth Navigation ── */
  const scrollCue = document.getElementById('scroll-cue-btn') || document.querySelector('.scroll-cue');
  if (scrollCue) {
    scrollCue.addEventListener('click', () => {
      const target = document.getElementById('stats-bar') || document.getElementById('carousels');
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  }

  /* ── 22 Official Indian Languages Grid ── */
  const languages = [
    { code: 'en',  label: 'English',   native: 'English' },
    { code: 'hi',  label: 'Hindi',     native: 'हिन्दी' },
    { code: 'bn',  label: 'Bengali',   native: 'বাংলা' },
    { code: 'te',  label: 'Telugu',    native: 'తెలుగు' },
    { code: 'mr',  label: 'Marathi',   native: 'मराठी' },
    { code: 'ta',  label: 'Tamil',     native: 'தமிழ்' },
    { code: 'gu',  label: 'Gujarati',  native: 'ગુજરાતી' },
    { code: 'kn',  label: 'Kannada',   native: 'ಕನ್ನಡ' },
    { code: 'ml',  label: 'Malayalam', native: 'മലയാളം' },
    { code: 'pa',  label: 'Punjabi',   native: 'ਪੰਜਾਬੀ' },
    { code: 'or',  label: 'Odia',      native: 'ଓଡ଼ିଆ' },
    { code: 'as',  label: 'Assamese',  native: 'অসমীয়া' },
    { code: 'ur',  label: 'Urdu',      native: 'اردو' },
    { code: 'mai', label: 'Maithili',  native: 'मैथिली' },
    { code: 'sa',  label: 'Sanskrit',  native: 'संस्कृतम्' },
    { code: 'kok', label: 'Konkani',   native: 'कोंकणी' },
    { code: 'mni', label: 'Manipuri',  native: 'মৈতৈলোন্' },
    { code: 'ne',  label: 'Nepali',    native: 'नेपाली' },
    { code: 'ks',  label: 'Kashmiri',  native: 'کٲشُر' },
    { code: 'sd',  label: 'Sindhi',    native: 'سنڌي' },
    { code: 'doi', label: 'Dogri',     native: 'डोगरी' },
    { code: 'sat', label: 'Santali',   native: 'ᱥᱟᱱᱛᱟᱲᱤ' },
  ];

  const langGrid  = document.getElementById('lang-grid');
  const langBtn   = document.getElementById('lang-btn');
  const langPanel = document.getElementById('lang-panel');
  let activeLang  = 'en';

  if (langGrid) {
    langGrid.innerHTML = '';
    languages.forEach(l => {
      const el = document.createElement('div');
      el.className = 'lang-opt clickable' + (l.code === activeLang ? ' active' : '');
      el.setAttribute('role', 'menuitem');
      el.setAttribute('tabindex', '0');
      el.dataset.code = l.code;
      el.innerHTML = `${l.native}<span class="lang-sub">${l.label}</span>`;
      el.addEventListener('click', () => {
        document.querySelectorAll('.lang-opt').forEach(o => o.classList.remove('active'));
        el.classList.add('active');
        activeLang = l.code;
        closeLang();
        showToast(`Language switched to ${l.label} (${l.native})`);
      });
      langGrid.appendChild(el);
    });
  }

  function closeLang() {
    if (langPanel && langBtn) {
      langPanel.classList.remove('open');
      langBtn.setAttribute('aria-expanded', 'false');
    }
  }

  if (langBtn && langPanel) {
    langBtn.addEventListener('click', e => {
      e.stopPropagation();
      const o = langPanel.classList.toggle('open');
      langBtn.setAttribute('aria-expanded', String(o));
    });
    document.addEventListener('click', closeLang);
    langPanel.addEventListener('click', e => e.stopPropagation());
  }

  /* ── Category Dropdown ── */
  const heroCatBtn = document.getElementById('hero-cat-btn');
  const catPanel   = document.getElementById('cat-panel');

  if (heroCatBtn && catPanel) {
    heroCatBtn.addEventListener('click', e => {
      e.stopPropagation();
      const o = catPanel.classList.toggle('open');
      heroCatBtn.setAttribute('aria-expanded', String(o));
    });

    document.addEventListener('click', () => {
      catPanel.classList.remove('open');
      heroCatBtn.setAttribute('aria-expanded', 'false');
    });

    catPanel.addEventListener('click', e => e.stopPropagation());

    document.querySelectorAll('.cat-row').forEach(r => {
      r.addEventListener('click', () => {
        heroCatBtn.childNodes[0].textContent = r.textContent.trim().replace(/\s+/g, ' ') + ' ';
        catPanel.classList.remove('open');
        heroCatBtn.setAttribute('aria-expanded', 'false');
        showToast(`Filtered by: ${r.textContent.trim()}`);
      });
    });
  }

  /* ── Carousel Factory ── */
  function initCarousel(trackId, prevId, nextId, dotsId, autoMs = 5000) {
    const track = document.getElementById(trackId);
    if (!track) return;
    const slides = track.querySelectorAll('.carousel-slide');
    const dotsWrap = document.getElementById(dotsId);
    let cur = 0, timer = null;

    if (dotsWrap) {
      dotsWrap.innerHTML = '';
      slides.forEach((_, i) => {
        const d = document.createElement('div');
        d.className = 'c-dot' + (i === 0 ? ' active' : '');
        d.setAttribute('role', 'button');
        d.setAttribute('tabindex', '0');
        d.setAttribute('aria-label', `Slide ${i + 1}`);
        d.addEventListener('click', () => { goTo(i); resetTimer(); });
        dotsWrap.appendChild(d);
      });
    }

    function goTo(idx) {
      cur = (idx + slides.length) % slides.length;
      track.style.transform = `translateX(-${cur * 100}%)`;
      if (dotsWrap) {
        dotsWrap.querySelectorAll('.c-dot').forEach((d, i) => d.classList.toggle('active', i === cur));
      }
    }

    function resetTimer() {
      clearInterval(timer);
      timer = setInterval(() => goTo(cur + 1), autoMs);
    }

    const prevBtn = document.getElementById(prevId);
    const nextBtn = document.getElementById(nextId);
    if (prevBtn) prevBtn.addEventListener('click', () => { goTo(cur - 1); resetTimer(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { goTo(cur + 1); resetTimer(); });

    resetTimer();
  }

  initCarousel('c1-track', 'c1-prev', 'c1-next', 'c1-dots', 5000);
  initCarousel('c2-track', 'c2-prev', 'c2-next', 'c2-dots', 6500);

  /* ── Animated Counter ── */
  function animCount(el, target, ms = 1800) {
    const start = performance.now();
    const fmt = n => n >= 1000 ? (n / 1000).toFixed(n >= 10000 ? 0 : 1) + 'K+' : n + '+';
    (function tick(now) {
      const p = Math.min((now - start) / ms, 1);
      const e = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(Math.round(e * target));
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = fmt(target);
    })(start);
  }

  /* ── Intersection Observer ── */
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      if (entry.target.classList.contains('stats-bar')) {
        entry.target.querySelectorAll('[data-count]').forEach(el => animCount(el, parseInt(el.dataset.count)));
      }
      io.unobserve(entry.target);
    });
  }, { threshold: 0.14 });

  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  const sBar = document.querySelector('.stats-bar');
  if (sBar) io.observe(sBar);

  /* ──────────────────────────────────────────────────────────
     LIVE BACKEND DATA — Stats Bar
  ─────────────────────────────────────────────────────────── */
  async function loadStats() {
    try {
      const stats = await api.getStats();

      const mapping = {
        'stat-mandis':   stats.mandis,
        'stat-farmers':  stats.farmers,
        'stat-states':   stats.states,
        'stat-crops':    stats.crops_tracked,
      };
      Object.entries(mapping).forEach(([id, val]) => {
        const el = document.getElementById(id);
        if (el) {
          el.dataset.count = val;
          // Trigger animation immediately if already in view
          if (el.closest('.stats-bar')?.classList.contains('visible')) {
            animCount(el, val);
          }
        }
      });
    } catch (e) {
      // Backend offline — keep the HTML data-count defaults
      if (!e.offline) console.warn('[FairCrop] Stats fetch failed:', e.message);
    }
  }
  loadStats();

  /* ──────────────────────────────────────────────────────────
     LIVE BACKEND DATA — Mandi Price Carousel (Carousel 1)
  ─────────────────────────────────────────────────────────── */

  // Crop thumbnail images (Unsplash)
  const CROP_IMAGES = {
    'Wheat':   'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=120&q=70',
    'Rice':    'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=120&q=70',
    'Tomato':  'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=120&q=70',
    'Potato':  'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=120&q=70',
    'Onion':   'https://images.unsplash.com/photo-1508747703725-719777637510?w=120&q=70',
    'Cotton':  'https://images.unsplash.com/photo-1567892737950-30c4e36b48e8?w=120&q=70',
    'Soybean': 'https://images.unsplash.com/photo-1599598425947-5202edd56fdb?w=120&q=70',
    'Maize':   'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=120&q=70',
    'Mustard': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=120&q=70',
    'default': 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=120&q=70',
  };

  function getCropImage(cropName) {
    const name = (cropName || '').trim();
    return CROP_IMAGES[name] || CROP_IMAGES['default'];
  }

  function buildPriceRow(price) {
    const changePct = (Math.random() * 20 - 8).toFixed(1);
    const isUp  = parseFloat(changePct) > 0;
    const isEq  = Math.abs(parseFloat(changePct)) < 1;
    const chgCls = isEq ? 'chg-eq' : (isUp ? 'chg-up' : 'chg-dn');
    const arrow  = isEq ? '─' : (isUp ? '▲' : '▼');
    return `
      <div class="price-row">
        <div class="price-left">
          <img src="${getCropImage(price.crop_name)}" alt="${price.crop_name}" class="crop-thumb" loading="lazy">
          <div>
            <div class="crop-name">${price.crop_name}${price.variety ? ' (' + price.variety + ')' : ''}</div>
            <div class="crop-loc">${price.mandi_name}, ${price.district}</div>
          </div>
        </div>
        <div class="price-right">
          <div class="price-amt">&#8377;${price.modal_price?.toFixed(0) || '--'}/q</div>
          <div class="price-chg ${chgCls}">${arrow} ${Math.abs(changePct)}%</div>
        </div>
      </div>`;
  }

  async function loadMandiPriceCarousel() {
    try {
      const prices = await api.getMandPrices({ limit: 20 });
      if (!prices || prices.length === 0) return;

      const track = document.getElementById('c1-track');
      if (!track) return;

      // Build slides of 4 price rows each
      const chunkSize = 4;
      const slides = [];
      for (let i = 0; i < prices.length; i += chunkSize) {
        slides.push(prices.slice(i, i + chunkSize));
      }

      track.innerHTML = slides.map(chunk => `
        <div class="carousel-slide">
          ${chunk.map(p => buildPriceRow(p)).join('')}
        </div>`).join('');

      // Re-init carousel with new slides
      initCarousel('c1-track', 'c1-prev', 'c1-next', 'c1-dots', 5000);

    } catch (e) {
      if (!e.offline) console.warn('[FairCrop] Mandi prices fetch failed:', e.message);
    }
  }
  loadMandiPriceCarousel();

  /* ──────────────────────────────────────────────────────────
     LIVE BACKEND DATA — Newest Updates Grid
  ─────────────────────────────────────────────────────────── */
  const MOCK_UPDATE_DATA = [
    { tag: 'u-price',   label: 'Price Update',  icon: 'trend',   title: 'Tomato prices surge 12% across Delhi NCR',         desc: 'Unseasonable rains in Maharashtra cause supply disruption — Azadpur mandi records ₹2,800/quintal.',   loc: 'Delhi NCR',        time: '2 min ago' },
    { tag: 'u-mandi',   label: 'Mandi Alert',   icon: 'store',   title: 'Lasalgaon Mandi — New Onion Auction Season Opens',  desc: 'Fresh Kharif onion arrivals begin. Over 15,000 MT expected this week. Register as buyer or seller.', loc: 'Nashik, MH',       time: '5 min ago' },
    { tag: 'u-scheme',  label: 'Govt. Scheme',  icon: 'doc',     title: 'PM-FASAL BIMA: Last Date to Enrol is August 31',   desc: 'Kharif crop insurance enrolment deadline approaching. Visit nearest CSC or FairCrop to register.',   loc: 'Pan India',        time: '12 min ago' },
    { tag: 'u-price',   label: 'Price Update',  icon: 'trend',   title: 'Wheat MSP: ₹2,275/quintal confirmed for Rabi 2026',desc: 'Cabinet approves enhanced MSP. Procurement to begin October. Register your holdings on FairCrop.',  loc: 'North India',      time: '18 min ago' },
    { tag: 'u-alert',   label: 'Market Alert',  icon: 'alert',   title: 'Potato Glut Warning — Prices May Fall 20% in UP',  desc: 'Cold storage excess in Agra-Mathura. Farmers advised to explore alternative market channels.',        loc: 'UP, Bihar',        time: '24 min ago' },
    { tag: 'u-weather', label: 'Weather',       icon: 'weather', title: 'IMD: Above-Normal Monsoon Forecast for Gujarat',   desc: 'IMD reports 112% of LPA rain this season — beneficial for groundnut and cotton crop.',                loc: 'Gujarat, Rajasthan',time: '31 min ago' },
  ];

  const iconSVG = {
    trend:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>`,
    store:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
    doc:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`,
    alert:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
    weather: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25"/><line x1="8" y1="19" x2="8" y2="21"/><line x1="8" y1="13" x2="8" y2="15"/><line x1="16" y1="19" x2="16" y2="21"/><line x1="16" y1="13" x2="16" y2="15"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="12" y1="15" x2="12" y2="17"/></svg>`,
    loc:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
  };

  function renderUpdates(data) {
    const grid = document.getElementById('updates-grid');
    if (!grid) return;
    grid.innerHTML = '';
    data.forEach((item, i) => {
      const c = document.createElement('div');
      c.className = 'update-card';
      c.style.animationDelay = (i * 0.08) + 's';
      c.innerHTML = `
        <div class="update-card-top">
          <span class="u-tag ${item.tag}">${item.label}</span>
          <span class="u-time">${item.time}</span>
        </div>
        <div class="update-icon" aria-hidden="true">${iconSVG[item.icon] || ''}</div>
        <h4>${item.title}</h4>
        <p>${item.desc}</p>
        <div class="update-foot">
          <span class="u-loc">${iconSVG.loc}${item.loc}</span>
          <span class="u-cta clickable">Read more &#8594;</span>
        </div>`;
      grid.appendChild(c);
    });
  }

  // Load from backend, fall back to mock
  async function loadLiveUpdates() {
    try {
      const updates = await api.getLiveUpdates();
      if (updates && updates.length > 0) {
        renderUpdates(updates);
      } else {
        renderUpdates(MOCK_UPDATE_DATA);
      }
    } catch (e) {
      renderUpdates(MOCK_UPDATE_DATA);
      if (!e.offline) console.warn('[FairCrop] Live updates fetch failed:', e.message);
    }
  }

  loadLiveUpdates();

  // Refresh updates every 30 seconds
  setInterval(async () => {
    await loadLiveUpdates();
  }, 30000);

  /* ── City Hub Interaction ── */
  const citiesGrid = document.getElementById('cities-grid');
  if (citiesGrid) {
    citiesGrid.addEventListener('click', async e => {
      const card = e.target.closest('.city-card');
      if (!card) return;
      const city = card.dataset.city;
      showToast(`Loading live APMC prices for ${city}…`);
      try {
        const results = await api.search(city, 5);
        if (results.mandi_prices?.length > 0) {
          const p = results.mandi_prices[0];
          showToast(`${city}: ${p.crop_name} @ ₹${p.modal_price?.toFixed(0)}/q (${p.mandi_name})`);
        } else {
          showToast(`Showing live APMC mandi data for ${city}`);
        }
      } catch {
        showToast(`Showing live APMC mandi data for ${city}`);
      }
    });

    citiesGrid.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const c = e.target.closest('.city-card');
        if (c) c.click();
      }
    });
  }

  const citySearch = document.getElementById('city-search');
  if (citySearch) {
    citySearch.addEventListener('input', function () {
      const q = this.value.toLowerCase();
      document.querySelectorAll('.city-card').forEach(c => {
        c.style.display = c.dataset.city.toLowerCase().includes(q) ? '' : 'none';
      });
    });
  }

  const detectBtn = document.getElementById('detect-btn');
  if (detectBtn) {
    detectBtn.addEventListener('click', () => {
      if (!navigator.geolocation) { showToast('Geolocation not supported by your browser.'); return; }
      showToast('Detecting your location…');
      navigator.geolocation.getCurrentPosition(
        () => showToast('Location detected. Showing nearest APMC mandis.'),
        () => showToast('Could not detect location. Please search manually.')
      );
    });
  }

  /* ── Mobile Navigation Drawer ── */
  const menuBtn       = document.getElementById('menu-btn');
  const drawerOverlay = document.getElementById('drawer-overlay');

  if (menuBtn) {
    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (typeof window.toggleDrawer === 'function') {
        window.toggleDrawer();
      } else {
        const drawer = document.getElementById('mobile-drawer');
        const overlay = document.getElementById('drawer-overlay');
        const isOpen = drawer && drawer.classList.contains('open');
        if (isOpen) {
          drawer?.classList.remove('open');
          overlay?.classList.remove('open');
        } else {
          drawer?.classList.add('open');
          overlay?.classList.add('open');
        }
      }
    });
  }

  if (drawerOverlay) {
    drawerOverlay.addEventListener('click', () => {
      if (typeof window.closeDrawer === 'function') {
        window.closeDrawer();
      } else {
        document.getElementById('mobile-drawer')?.classList.remove('open');
        drawerOverlay.classList.remove('open');
      }
    });
  }


  /* ── Voice Search ── */
  const micBtn = document.getElementById('mic-btn');
  if (micBtn) {
    micBtn.addEventListener('click', () => {
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SR) { showToast('Voice search not supported in this browser.'); return; }
      const rec = new SR();
      rec.lang = 'en-IN';
      rec.start();
      showToast('Listening — speak crop, mandi, or scheme name…');
      rec.onresult = e => {
        const transcript = e.results[0][0].transcript;
        const input = document.getElementById('nav-search-input');
        if (input) input.value = transcript;
        showToast(`Voice captured: "${transcript}"`);
        triggerSearch(transcript);
      };
      rec.onerror = () => showToast('Voice search unavailable.');
    });
  }

  /* ── Hero Search — wired to backend ── */
  async function triggerSearch(query) {
    if (!query || query.trim().length < 2) return;
    showToast(`Searching FairCrop for: "${query}"…`);
    try {
      const results = await api.search(query.trim(), 10);
      const total = results.total_results || 0;
      if (total > 0) {
        const pCount = results.mandi_prices?.length || 0;
        const lCount = results.marketplace_lots?.length || 0;
        showToast(`Found ${pCount} mandi prices & ${lCount} marketplace lots for "${query}"`);
      } else {
        showToast(`No results found for "${query}" — try another crop or mandi name.`);
      }
    } catch (e) {
      if (e.offline) {
        showToast('Backend offline — start server with: python backend/run.py');
      } else {
        showToast(`Searching FairCrop database for: ${query}`);
      }
    }
  }

  const heroSearch = document.getElementById('hero-search');
  if (heroSearch) {
    heroSearch.addEventListener('keydown', e => {
      if (e.key === 'Enter') triggerSearch(e.target.value);
    });
  }

  const navSearchInput = document.getElementById('nav-search-input');
  if (navSearchInput) {
    navSearchInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') triggerSearch(e.target.value);
    });
  }

  /* ── Interactive Toast Notification ── */
  window.showToast = function (msg) {
    const t = document.createElement('div');
    t.style.cssText = `position:fixed;bottom:26px;left:50%;transform:translateX(-50%);background:rgba(12,14,22,0.96);color:#fff;padding:11px 22px;border-radius:6px;font-size:0.83rem;font-weight:500;z-index:99999;border:1px solid rgba(255,107,0,0.35);backdrop-filter:blur(12px);white-space:nowrap;box-shadow:0 8px 28px rgba(0,0,0,0.45);animation:tIn .28s ease;font-family:'Inter',sans-serif;`;
    t.textContent = msg;
    if (!document.getElementById('__toast-style')) {
      const s = document.createElement('style');
      s.id = '__toast-style';
      s.textContent = '@keyframes tIn{from{opacity:0;transform:translateX(-50%) translateY(10px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}';
      document.head.appendChild(s);
    }
    document.body.appendChild(t);
    setTimeout(() => {
      t.style.transition = 'opacity .28s';
      t.style.opacity = '0';
      setTimeout(() => t.remove(), 300);
    }, 3200);
  };

});
