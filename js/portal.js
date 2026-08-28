/**
 * FairCrop.in — Feature Portal & Application Controller
 * Smart India Hackathon 2026
 *
 * Implements complete role-based feature navigation, dashboards, produce management,
 * buyer marketplace, smart matchmaking, bidding & negotiation, escrow transactions,
 * market intelligence, 7-day ML forecasting, AI advisory, dispute center, admin verification.
 */

'use strict';

(function () {

  const api = window.FairCropAPI;

  // Active view state
  let currentView = 'dashboard';
  let activeLotModalId = null;
  let activeTxModalId = null;
  let activeDisputeModalId = null;

  /* ══════════════════════════════════════════════════════════════
     ROLE-BASED MENU CONFIGURATION (Grouped & Detailed)
  ══════════════════════════════════════════════════════════════ */
  const ROLE_MENUS = {
    FARMER: [
      {
        group: '🌾 Produce & Sales',
        items: [
          { id: 'dashboard',           label: 'Farmer Command Center',     sub: 'Live overview & stats',         icon: 'layout-dashboard' },
          { id: 'my-listings',         label: 'My Produce Listings',       sub: 'Active harvest inventory',      icon: 'package' },
          { id: 'add-produce',         label: 'Add Produce Batch',         sub: 'List new crop harvest',         icon: 'plus-circle' },
          { id: 'incoming-bids',       label: 'Incoming Buyer Bids',       sub: 'Review trade purchase offers',  icon: 'inbox' },
        ]
      },
      {
        group: '💳 Escrow & Settlements',
        items: [
          { id: 'transactions',        label: 'Escrow Transactions',       sub: 'Payment & settlement tracking', icon: 'credit-card' },
        ]
      },
      {
        group: '🤖 AI & Price Intelligence',
        items: [
          { id: 'market-intelligence', label: 'APMC Mandi Rates',          sub: 'Live arrival modal prices',     icon: 'trending-up' },
          { id: 'price-forecast',      label: '7-Day ML Forecast',         sub: 'Price prediction engine',       icon: 'sparkles' },
          { id: 'ai-advisory',         label: 'AI Hold/Sell Advisory',     sub: 'Optimal timing recommendation', icon: 'bot' },
        ]
      },
      {
        group: '🛡️ Support & Account',
        items: [
          { id: 'disputes',            label: 'Quality Dispute Center',    sub: 'File and track grievances',     icon: 'shield-alert' },
          { id: 'profile',             label: 'Farmer Profile & Settings', sub: 'Personal & warehouse details', icon: 'user' },
        ]
      }
    ],
    FPO: [
      {
        group: '👥 Collective Produce',
        items: [
          { id: 'dashboard',           label: 'FPO Command Center',        sub: 'Aggregated farmer overview',    icon: 'layout-dashboard' },
          { id: 'my-listings',         label: 'Member Produce Listings',   sub: 'Bulk collective lots',          icon: 'package' },
          { id: 'add-produce',         label: 'List Collective Lot',       sub: 'Add bulk harvested produce',   icon: 'plus-circle' },
          { id: 'incoming-bids',       label: 'Incoming Bulk Offers',      sub: 'Review institutional bids',     icon: 'inbox' },
        ]
      },
      {
        group: '💳 Escrow & Settlements',
        items: [
          { id: 'transactions',        label: 'Escrow Settlements',        sub: 'Multi-farmer disbursement',     icon: 'credit-card' },
        ]
      },
      {
        group: '🤖 AI & Intelligence',
        items: [
          { id: 'market-intelligence', label: 'APMC Mandi Rates',          sub: 'Real-time commodity prices',    icon: 'trending-up' },
          { id: 'price-forecast',      label: '7-Day ML Price Forecast',   sub: 'Predictive market analytics',   icon: 'sparkles' },
          { id: 'ai-advisory',         label: 'AI Hold/Sell Advisory',     sub: 'Sale timing recommendation',    icon: 'bot' },
          { id: 'disputes',            label: 'Trade Grievance Center',    sub: 'Quality dispute resolution',    icon: 'shield-alert' },
          { id: 'profile',             label: 'FPO Organization Profile',  sub: 'Registration & bank details',   icon: 'user' },
        ]
      }
    ],
    BUYER: [
      {
        group: '🛒 Procurement & Sourcing',
        items: [
          { id: 'dashboard',           label: 'Buyer Command Center',      sub: 'Procurement status & KPIs',     icon: 'layout-dashboard' },
          { id: 'marketplace',         label: 'Produce Marketplace',       sub: 'Direct farmer sourcing',        icon: 'store' },
          { id: 'smart-matches',       label: 'AI Smart Matchmaker',       sub: 'Compatibility scored lots',     icon: 'target' },
          { id: 'my-bids',             label: 'My Placed Trade Bids',      sub: 'Active purchase offers',        icon: 'send' },
        ]
      },
      {
        group: '💳 Escrow & Settlements',
        items: [
          { id: 'transactions',        label: 'Escrow Orders Tracker',     sub: 'Deposit, dispatch & release',   icon: 'credit-card' },
        ]
      },
      {
        group: '📈 Intelligence & Quality',
        items: [
          { id: 'market-intelligence', label: 'APMC Mandi Intelligence',   sub: 'Benchmarking price trends',     icon: 'trending-up' },
          { id: 'disputes',            label: 'Quality Dispute Center',    sub: 'Report defective deliveries',   icon: 'shield-alert' },
          { id: 'profile',             label: 'Enterprise Profile',        sub: 'GSTIN & business credentials',  icon: 'user' },
        ]
      }
    ],
    ADMIN: [
      {
        group: '🏛️ System Administration',
        items: [
          { id: 'dashboard',           label: 'Ministry Admin Overview',   sub: 'Platform metrics & stats',      icon: 'layout-dashboard' },
          { id: 'users',               label: 'User Directory & Roles',    sub: 'Manage farmers, buyers & FPOs', icon: 'users' },
          { id: 'verification',        label: 'Verification Queue',        sub: 'Approve buyer & FPO accounts',  icon: 'check-square' },
          { id: 'admin-produce',       label: 'All Produce Lots',          sub: 'Platform-wide harvest index',   icon: 'layers' },
        ]
      },
      {
        group: '⚖️ Escrow & Disputes',
        items: [
          { id: 'transactions',        label: 'Escrow Settlement Oversight', sub: 'All platform transactions',   icon: 'credit-card' },
          { id: 'disputes',            label: 'Dispute Resolution Center', sub: 'Review and settle grievances', icon: 'shield-alert' },
        ]
      },
      {
        group: '📈 National Intelligence',
        items: [
          { id: 'market-intelligence', label: 'APMC Mandi Intelligence',   sub: 'Pan-India mandi arrivals',      icon: 'trending-up' },
          { id: 'profile',             label: 'Admin Profile Settings',    sub: 'Account & security control',    icon: 'user' },
        ]
      }
    ],
    LOGISTICS: [
      {
        group: '🚚 Logistics Operations',
        items: [
          { id: 'dashboard',           label: 'Logistics Command Center',  sub: 'Active dispatches & routes',    icon: 'layout-dashboard' },
          { id: 'shipments',           label: 'Assigned Shipments',        sub: 'Pickup & delivery dispatch',    icon: 'truck' },
          { id: 'transactions',        label: 'Delivery Escrow Confirmations', sub: 'Confirm delivered lots',    icon: 'credit-card' },
          { id: 'profile',             label: 'Fleet & Driver Profile',    sub: 'Carrier registration info',     icon: 'user' },
        ]
      }
    ],
    GUEST: [
      {
        group: '🌐 Public Marketplace',
        items: [
          { id: 'marketplace',         label: 'Browse Produce Marketplace', sub: 'Explore available lots',       icon: 'store' },
          { id: 'market-intelligence', label: 'APMC Mandi Prices',          sub: 'Live 2,400+ mandi rates',       icon: 'trending-up' },
          { id: 'price-forecast',      label: '7-Day ML Price Forecast',    sub: 'ML price predictions',         icon: 'sparkles' },
        ]
      }
    ]
  };

  /* ── Preset Demo Credentials for Instant Role Switcher ── */
  const DEMO_USERS = {
    farmer:    { email: 'farmer@faircrop.in',    pass: 'farmer123',    name: 'Ramesh Singh (Farmer)' },
    buyer:     { email: 'buyer@faircrop.in',     pass: 'buyer123',     name: 'AgroCorp Ltd (Buyer)' },
    admin:     { email: 'admin@faircrop.in',     pass: 'admin123',     name: 'Ministry Admin' },
    fpo:       { email: 'fpo@faircrop.in',       pass: 'fpo123',       name: 'Kisan Vikas FPO' },
    logistics: { email: 'logistics@faircrop.in', pass: 'logistics123', name: 'Gati Kisan Logistics' },
  };

  /* ── Instant Role Switcher ── */
  async function switchDemoRole(roleKey) {
    const cred = DEMO_USERS[roleKey];
    if (!cred) return;
    try {
      window.showToast?.(`Switching to ${cred.name}… 🔄`);
      const data = await api.login(cred.email, cred.pass);
      renderFeatureMenu();
      if (typeof window.syncNav === 'function') {
        window.syncNav(data.user);
      }
      window.showToast?.(`Active mode: ${data.user.role} (${data.user.full_name.split(' ')[0]}) ✅`);
      openFeatureView('dashboard');
      closeDrawer();
    } catch (err) {
      window.showToast?.(`Could not switch role: ${err.message || 'Error'}`);
    }
  }

  /* ── SVG Icons dictionary ── */
  function getIcon(name) {
    const icons = {
      'layout-dashboard': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`,
      'package': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><line x1="16.5" y1="9.4" x2="7.55" y2="4.24"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>`,
      'plus-circle': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>`,
      'inbox': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>`,
      'credit-card': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>`,
      'trending-up': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>`,
      'sparkles': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3z"/></svg>`,
      'bot': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="16" x2="8" y2="16"/><line x1="16" y1="16" x2="16" y2="16"/></svg>`,
      'shield-alert': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
      'user': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
      'store': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7"/></svg>`,
      'target': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`,
      'send': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`,
      'truck': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>`,
      'users': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
      'check-square': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>`,
      'layers': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`,
    };
    return icons[name] || `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><circle cx="12" cy="12" r="8"/></svg>`;
  }

  /* ══════════════════════════════════════════════════════════════
     RENDER FEATURE MENU IN DRAWER
  ══════════════════════════════════════════════════════════════ */
  function renderFeatureMenu() {
    const drawer = document.getElementById('mobile-drawer');
    if (!drawer) return;

    const user = api.getUser();
    const role = user ? user.role : 'GUEST';
    const groups = ROLE_MENUS[role] || ROLE_MENUS.GUEST;
    const isPending = user && user.verification_status === 'PENDING';

    // 1. Role Switcher Strip (Top of drawer for easy instant role testing)
    const roleSwitcherHtml = `
      <div class="drawer-switcher-box">
        <div class="drawer-switcher-hdr">
          <span>Role Switcher (Simulator)</span>
          <span class="curr-role-tag role-${role.toLowerCase()}">${role}</span>
        </div>
        <div class="drawer-role-chips">
          <button type="button" class="d-role-chip ${role==='FARMER'?'active':''}" data-switch-role="farmer" title="Login as Farmer">🌱 Farmer</button>
          <button type="button" class="d-role-chip ${role==='BUYER'?'active':''}" data-switch-role="buyer" title="Login as Buyer">🏢 Buyer</button>
          <button type="button" class="d-role-chip ${role==='ADMIN'?'active':''}" data-switch-role="admin" title="Login as Admin">🏛️ Admin</button>
          <button type="button" class="d-role-chip ${role==='FPO'?'active':''}" data-switch-role="fpo" title="Login as FPO">👥 FPO</button>
          <button type="button" class="d-role-chip ${role==='LOGISTICS'?'active':''}" data-switch-role="logistics" title="Login as Logistics">🚚 Logistics</button>
        </div>
      </div>
    `;

    // 2. Active User Profile Card
    let userHeaderHtml = '';
    if (user) {
      userHeaderHtml = `
        <div class="drawer-user-card">
          <div class="drawer-user-avatar">${(user.full_name || user.role || 'U').charAt(0).toUpperCase()}</div>
          <div class="drawer-user-details">
            <div class="drawer-user-name">${user.full_name || 'User'}</div>
            <div class="drawer-user-sub">
              <span class="role-badge role-${role.toLowerCase()}">${role}</span>
              <span class="verif-badge verif-${user.verification_status.toLowerCase()}">${user.verification_status}</span>
            </div>
            <div class="drawer-user-loc">📍 ${user.district || ''}, ${user.state || 'India'}</div>
          </div>
        </div>
        ${isPending ? `<div class="drawer-pending-banner">⚠️ <strong>Verification Pending</strong><br>Account awaiting Admin verification.</div>` : ''}
      `;
    } else {
      userHeaderHtml = `
        <div class="drawer-guest-card">
          <div><strong>Welcome to FairCrop</strong></div>
          <div style="font-size:0.75rem;color:var(--text-lo);margin-top:2px;">Select a role above or sign in to access full features</div>
          <button class="drawer-signin-cta clickable" onclick="event.preventDefault();window.openAuthModal&&window.openAuthModal('login');">
            Sign In / Register Account
          </button>
        </div>
      `;
    }

    // 3. Grouped Role Features List
    let menuItemsHtml = groups.map(grp => `
      <div class="drawer-group-wrap">
        <span class="drawer-section">${grp.group}</span>
        <div class="drawer-feature-list">
          ${grp.items.map(item => `
            <a class="drawer-link clickable ${currentView === item.id ? 'active' : ''}" href="#" data-feature="${item.id}">
              <div class="d-link-icon">${getIcon(item.icon)}</div>
              <div class="d-link-text">
                <span class="d-link-title">${item.label}</span>
                <span class="d-link-sub">${item.sub}</span>
              </div>
            </a>
          `).join('')}
        </div>
      </div>
    `).join('');

    // 4. Bottom Actions
    let bottomActionsHtml = '';
    if (user) {
      bottomActionsHtml = `
        <div class="drawer-footer-actions">
          <button class="drawer-logout-btn clickable" id="drawer-logout-action">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Sign Out
          </button>
        </div>
      `;
    }

    drawer.innerHTML = `
      <div class="drawer-hdr">
        <span class="drawer-brand"><span>Fair</span><span>Crop</span></span>
        <button class="drawer-close clickable" id="drawer-close" aria-label="Close menu">&times;</button>
      </div>

      ${roleSwitcherHtml}
      ${userHeaderHtml}

      <div class="drawer-content-scroll">
        ${menuItemsHtml}

        <span class="drawer-section" style="margin-top:14px;">Quick Links</span>
        <a class="drawer-link clickable" href="#" id="drawer-home-link">
          <div class="d-link-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></div>
          <div class="d-link-text">
            <span class="d-link-title">Home Landing Page</span>
            <span class="d-link-sub">Return to public portal</span>
          </div>
        </a>
      </div>

      ${bottomActionsHtml}
    `;

    // Wire close button
    drawer.querySelector('#drawer-close')?.addEventListener('click', closeDrawer);

    // Wire home link
    drawer.querySelector('#drawer-home-link')?.addEventListener('click', e => {
      e.preventDefault();
      closeFeatureView();
      closeDrawer();
    });

    // Wire role switcher buttons
    drawer.querySelectorAll('[data-switch-role]').forEach(btn => {
      btn.addEventListener('click', () => {
        const rKey = btn.dataset.switchRole;
        switchDemoRole(rKey);
      });
    });

    // Wire feature navigation links
    drawer.querySelectorAll('[data-feature]').forEach(a => {
      a.addEventListener('click', e => {
        e.preventDefault();
        const feat = a.dataset.feature;
        openFeatureView(feat);
        closeDrawer();
      });
    });

    // Wire logout
    drawer.querySelector('#drawer-logout-action')?.addEventListener('click', () => {
      api.logout();
      closeDrawer();
      window.showToast?.('Logged out successfully.');
      closeFeatureView();
    });
  }

  function openDrawer() {
    renderFeatureMenu();
    const drawer = document.getElementById('mobile-drawer');
    const overlay = document.getElementById('drawer-overlay');
    const menuBtn = document.getElementById('menu-btn');
    if (drawer && overlay) {
      drawer.classList.add('open');
      overlay.classList.add('open');
      menuBtn?.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeDrawer() {
    const drawer = document.getElementById('mobile-drawer');
    const overlay = document.getElementById('drawer-overlay');
    const menuBtn = document.getElementById('menu-btn');
    if (drawer && overlay) {
      drawer.classList.remove('open');
      overlay.classList.remove('open');
      menuBtn?.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  }

  function toggleDrawer() {
    const drawer = document.getElementById('mobile-drawer');
    if (drawer && drawer.classList.contains('open')) {
      closeDrawer();
    } else {
      openDrawer();
    }
  }

  /* ══════════════════════════════════════════════════════════════
     PORTAL VIEW CONTAINER
  ══════════════════════════════════════════════════════════════ */
  function ensurePortalContainer() {
    let portal = document.getElementById('app-portal');
    if (!portal) {
      portal = document.createElement('div');
      portal.id = 'app-portal';
      portal.className = 'app-portal';
      // Insert after header
      const header = document.querySelector('.sticky-header');
      if (header && header.nextSibling) {
        header.parentNode.insertBefore(portal, header.nextSibling);
      } else {
        document.body.prepend(portal);
      }
    }
    return portal;
  }

  function openFeatureView(viewName) {
    const user = api.getUser();
    currentView = viewName;

    // Check authorization for protected routes
    const publicViews = ['marketplace', 'market-intelligence', 'price-forecast'];
    if (!user && !publicViews.includes(viewName)) {
      window.openAuthModal && window.openAuthModal('login');
      window.showToast?.('Please sign in to access this feature.');
      return;
    }

    const portal = ensurePortalContainer();
    const main = document.getElementById('main-content');
    if (main) main.style.display = 'none';
    portal.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });

    renderViewHeader(viewName);
    renderViewContent(viewName);
    renderFeatureMenu();
  }

  function closeFeatureView() {
    const portal = document.getElementById('app-portal');
    const main = document.getElementById('main-content');
    if (portal) portal.style.display = 'none';
    if (main) main.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    renderFeatureMenu();
  }

  /* ── View Header Bar ── */
  function renderViewHeader(viewName) {
    const portal = ensurePortalContainer();
    const user = api.getUser();
    const role = user ? user.role : 'GUEST';

    const titles = {
      'dashboard':           'Command Center & Dashboard',
      'my-listings':         'My Produce Listings',
      'add-produce':         'Add New Harvest Produce Lot',
      'incoming-bids':       'Incoming Buyer Trade Offers',
      'marketplace':         'Agricultural Produce Marketplace',
      'smart-matches':       'Smart Matchmaking & Compatibility',
      'my-bids':             'My Placed Trade Bids',
      'transactions':        'Escrow & Transaction Settlement Tracking',
      'market-intelligence': 'Real-Time APMC Mandi Price Intelligence',
      'price-forecast':      '7-Day ML Price Forecasting Engine',
      'ai-advisory':         'AI Hold / Sell Produce Advisory',
      'disputes':            'Grievance & Quality Dispute Center',
      'users':               'User Directory & Role Administration',
      'verification':        'Institutional Buyer & FPO Verification',
      'admin-produce':       'All Listed Agricultural Produce Lots',
      'shipments':           'Assigned Shipments & Dispatch Logistics',
      'profile':             'User Profile & Enterprise Settings',
    };

    const title = titles[viewName] || 'FairCrop Portal';
    const isPending = user && user.verification_status === 'PENDING';

    portal.innerHTML = `
      <div class="portal-hdr-bar">
        <div class="portal-hdr-left">
          <button class="portal-back-btn clickable" id="portal-back-btn" title="Back to landing page">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" width="16" height="16"><path d="m15 18-6-6 6-6"/></svg>
            <span>Back to Home</span>
          </button>
          <div class="portal-title-wrap">
            <h1 class="portal-title">${title}</h1>
            <div class="portal-breadcrumbs">
              <span>FairCrop</span> &rsaquo; <span>${role}</span> &rsaquo; <span class="bc-active">${title}</span>
            </div>
          </div>
        </div>
        <div class="portal-hdr-right">
          ${user ? `
            <div class="portal-user-chip">
              <div class="chip-avatar">${user.full_name.charAt(0)}</div>
              <div class="chip-info">
                <span class="chip-name">${user.full_name.split(' ')[0]}</span>
                <span class="chip-role">${role}</span>
              </div>
            </div>
          ` : `
            <button class="portal-login-chip clickable" onclick="window.openAuthModal('login')">Sign In</button>
          `}
          <button class="portal-menu-trigger clickable" id="portal-menu-toggle" title="Open feature menu">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            <span>Menu</span>
          </button>
        </div>
      </div>

      ${isPending ? `
        <div class="portal-alert-bar warning">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          <div><strong>Verification Pending:</strong> Your ${role} account registration is currently under review by Ministry Admins. You have full browsing & preview access.</div>
        </div>
      ` : ''}

      <!-- Quick Role Navigation Sub-bar -->
      <div class="portal-subnav" id="portal-subnav"></div>

      <!-- Main Portal Content View Area -->
      <div class="portal-body" id="portal-body">
        <div class="portal-spinner-wrap"><div class="auth-spinner" style="display:block;width:32px;height:32px;border-width:3px;"></div></div>
      </div>
    `;

    // Wire header events
    portal.querySelector('#portal-back-btn')?.addEventListener('click', closeFeatureView);
    portal.querySelector('#portal-menu-toggle')?.addEventListener('click', openDrawer);

    // Helper to get flat list of menu items
    function getFlatRoleMenuItems(r) {
      const grps = ROLE_MENUS[r] || ROLE_MENUS.GUEST;
      if (Array.isArray(grps) && grps.length > 0 && grps[0].items) {
        return grps.flatMap(g => g.items);
      }
      return grps || [];
    }

    // Render quick subnav tabs
    const subnav = portal.querySelector('#portal-subnav');
    const items = getFlatRoleMenuItems(role);
    if (subnav && items.length > 0) {
      subnav.innerHTML = items.map(it => `
        <button class="subnav-tab clickable ${it.id === viewName ? 'active' : ''}" data-subfeat="${it.id}">
          ${getIcon(it.icon)} <span>${it.label}</span>
        </button>
      `).join('');

      subnav.querySelectorAll('[data-subfeat]').forEach(btn => {
        btn.addEventListener('click', () => {
          openFeatureView(btn.dataset.subfeat);
        });
      });
    }

  }

  /* ══════════════════════════════════════════════════════════════
     VIEW ROUTING DISPATCHER
  ══════════════════════════════════════════════════════════════ */
  async function renderViewContent(viewName) {
    const body = document.getElementById('portal-body');
    if (!body) return;

    try {
      switch (viewName) {
        case 'dashboard':
          await renderDashboardView(body);
          break;
        case 'my-listings':
          await renderMyListingsView(body);
          break;
        case 'add-produce':
          renderAddProduceView(body);
          break;
        case 'marketplace':
          await renderMarketplaceView(body);
          break;
        case 'smart-matches':
          await renderSmartMatchesView(body);
          break;
        case 'incoming-bids':
          await renderIncomingBidsView(body);
          break;
        case 'my-bids':
          await renderMyBidsView(body);
          break;
        case 'transactions':
          await renderTransactionsView(body);
          break;
        case 'market-intelligence':
          await renderMarketIntelligenceView(body);
          break;
        case 'price-forecast':
          await renderPriceForecastView(body);
          break;
        case 'ai-advisory':
          await renderAIAdvisoryView(body);
          break;
        case 'disputes':
          await renderDisputesView(body);
          break;
        case 'users':
          await renderAdminUsersView(body);
          break;
        case 'verification':
          await renderAdminVerificationView(body);
          break;
        case 'admin-produce':
          await renderAdminProduceView(body);
          break;
        case 'shipments':
          await renderLogisticsShipmentsView(body);
          break;
        case 'profile':
          await renderProfileView(body);
          break;
        default:
          await renderDashboardView(body);
      }
    } catch (err) {
      body.innerHTML = `
        <div class="portal-error-card">
          <svg viewBox="0 0 24 24" fill="none" stroke="#f87171" stroke-width="2" width="40" height="40"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <h3>Failed to load ${viewName}</h3>
          <p>${err.offline ? 'The FairCrop backend server is offline. Please start it using python backend/run.py.' : (err.message || 'An unexpected error occurred.')}</p>
          <button class="portal-btn primary clickable" onclick="window.openFeatureView('${viewName}')">Retry</button>
        </div>
      `;
    }
  }

  /* ══════════════════════════════════════════════════════════════
     1. DASHBOARD VIEW (Role-Based)
  ══════════════════════════════════════════════════════════════ */
  async function renderDashboardView(container) {
    const user = api.getUser();
    const role = user ? user.role : 'GUEST';

    if (role === 'FARMER' || role === 'FPO') {
      const [lots, offers, txns, advisory] = await Promise.all([
        api.getMyProduceLots().catch(() => []),
        api.getIncomingOffers().catch(() => []),
        api.getTransactions().catch(() => []),
        api.getForecast({ crop_name: 'Wheat' }).catch(() => null)
      ]);

      const availableLots = lots.filter(l => l.status === 'AVAILABLE');
      const pendingBids = offers.filter(o => o.status === 'PENDING');
      const totalInventoryKg = lots.reduce((acc, l) => acc + (l.quantity_kg || 0), 0);

      container.innerHTML = `
        <div class="portal-grid-3">
          <div class="kpi-card clickable" onclick="window.openFeatureView('my-listings')">
            <div class="kpi-top">
              <span class="kpi-lbl">Active Produce Lots</span>
              <div class="kpi-icon">${getIcon('package')}</div>
            </div>
            <div class="kpi-val">${availableLots.length} <span class="kpi-sub">/ ${lots.length} total</span></div>
          </div>
          <div class="kpi-card clickable" onclick="window.openFeatureView('incoming-bids')">
            <div class="kpi-top">
              <span class="kpi-lbl">Incoming Bids</span>
              <div class="kpi-icon">${getIcon('inbox')}</div>
            </div>
            <div class="kpi-val">${pendingBids.length} <span class="kpi-sub">Pending Review</span></div>
          </div>
          <div class="kpi-card clickable" onclick="window.openFeatureView('transactions')">
            <div class="kpi-top">
              <span class="kpi-lbl">Active Transactions</span>
              <div class="kpi-icon">${getIcon('credit-card')}</div>
            </div>
            <div class="kpi-val">${txns.length} <span class="kpi-sub">In Settlement</span></div>
          </div>
        </div>

        ${advisory ? `
          <div class="advisory-card-widget ${advisory.recommended_sale_window.toLowerCase().includes('hold') ? 'hold' : 'sell'}" style="margin: 24px 0;">
            <div class="adv-badge">🤖 AI Advisory Recommendation</div>
            <div class="adv-headline">${advisory.recommended_sale_window}</div>
            <div class="adv-desc">${advisory.advice_summary}</div>
            <div class="adv-meta">
              <span>Benchmark Crop: <strong>${advisory.crop_name}</strong></span>
              <span>Current Mandi Price: <strong>₹${advisory.current_modal_price}/q</strong></span>
              <button class="portal-btn outline-sm clickable" onclick="window.openFeatureView('price-forecast')">View 7-Day Forecast &rarr;</button>
            </div>
          </div>
        ` : ''}

        <div class="portal-grid-2" style="margin-top:24px;">
          <!-- Quick Produce Section -->
          <div class="portal-box">
            <div class="portal-box-hdr">
              <h3>🌾 My Recent Produce</h3>
              <button class="portal-btn primary-sm clickable" onclick="window.openFeatureView('add-produce')">+ Add Produce</button>
            </div>
            ${lots.length === 0 ? `<div class="portal-empty">No produce listed yet. Click "+ Add Produce" to list your first harvest.</div>` : `
              <div class="portal-mini-list">
                ${lots.slice(0, 4).map(l => `
                  <div class="mini-row">
                    <div class="mini-col-left">
                      <strong>${l.crop_name} (${l.variety || 'Standard'})</strong>
                      <span class="mini-meta">${l.quantity_kg.toLocaleString()} kg &bull; ₹${l.price_per_kg_expected}/kg</span>
                    </div>
                    <span class="status-pill status-${l.status.toLowerCase()}">${l.status}</span>
                  </div>
                `).join('')}
              </div>
              <a href="#" class="portal-more-link clickable" onclick="event.preventDefault();window.openFeatureView('my-listings')">View all listings &rarr;</a>
            `}
          </div>

          <!-- Quick Incoming Bids Section -->
          <div class="portal-box">
            <div class="portal-box-hdr">
              <h3>📥 Recent Buyer Bids</h3>
              <button class="portal-btn outline-sm clickable" onclick="window.openFeatureView('incoming-bids')">View All</button>
            </div>
            ${offers.length === 0 ? `<div class="portal-empty">No buyer offers yet. Bids placed by institutional buyers will appear here.</div>` : `
              <div class="portal-mini-list">
                ${offers.slice(0, 4).map(o => `
                  <div class="mini-row">
                    <div class="mini-col-left">
                      <strong>${o.buyer?.company_name || o.buyer?.full_name || 'Buyer'}</strong>
                      <span class="mini-meta">${o.offered_quantity_kg.toLocaleString()} kg @ ₹${o.offered_price_per_kg}/kg &bull; Total: ₹${o.total_offer_value.toLocaleString()}</span>
                    </div>
                    <span class="status-pill status-${o.status.toLowerCase()}">${o.status}</span>
                  </div>
                `).join('')}
              </div>
            `}
          </div>
        </div>
      `;
    } else if (role === 'BUYER') {
      const [lots, myBids, txns, matches] = await Promise.all([
        api.getMarketplaceLots({ limit: 6 }).catch(() => []),
        api.getMyBids().catch(() => []),
        api.getTransactions().catch(() => []),
        api.getMatchmaking({ crop_name: 'Wheat' }).catch(() => [])
      ]);

      container.innerHTML = `
        <div class="portal-grid-3">
          <div class="kpi-card clickable" onclick="window.openFeatureView('marketplace')">
            <div class="kpi-top">
              <span class="kpi-lbl">Available Lots</span>
              <div class="kpi-icon">${getIcon('store')}</div>
            </div>
            <div class="kpi-val">${lots.length}+ <span class="kpi-sub">Crops Ready</span></div>
          </div>
          <div class="kpi-card clickable" onclick="window.openFeatureView('my-bids')">
            <div class="kpi-top">
              <span class="kpi-lbl">My Placed Bids</span>
              <div class="kpi-icon">${getIcon('send')}</div>
            </div>
            <div class="kpi-val">${myBids.length} <span class="kpi-sub">Active Offers</span></div>
          </div>
          <div class="kpi-card clickable" onclick="window.openFeatureView('transactions')">
            <div class="kpi-top">
              <span class="kpi-lbl">Settlements</span>
              <div class="kpi-icon">${getIcon('credit-card')}</div>
            </div>
            <div class="kpi-val">${txns.length} <span class="kpi-sub">Escrow Orders</span></div>
          </div>
        </div>

        <div class="portal-box" style="margin-top:20px;">
          <div class="portal-box-hdr">
            <h3>🎯 AI Smart Matches (Recommended for You)</h3>
            <button class="portal-btn primary-sm clickable" onclick="window.openFeatureView('smart-matches')">Explore Smart Matchmaker &rarr;</button>
          </div>
          ${matches.length === 0 ? `<div class="portal-empty">Search marketplace or refine parameters to generate smart matches.</div>` : `
            <div class="match-mini-grid">
              ${matches.slice(0, 3).map(m => `
                <div class="match-mini-card">
                  <div class="match-score-badge">${m.match_score_percentage}% MATCH</div>
                  <h4>${m.produce_lot.crop_name} (${m.produce_lot.variety || 'Grade A'})</h4>
                  <div class="match-mini-meta">
                    <span>${m.produce_lot.quantity_kg.toLocaleString()} kg</span> &bull; 
                    <span>₹${m.produce_lot.price_per_kg_expected}/kg</span>
                  </div>
                  <div class="match-mini-loc">📍 ${m.produce_lot.district}, ${m.produce_lot.state}</div>
                  <button class="portal-btn primary-xs clickable" onclick="window.openOfferModal(${m.produce_lot.id}, '${m.produce_lot.crop_name}', ${m.produce_lot.price_per_kg_expected}, ${m.produce_lot.quantity_kg})">Make Offer</button>
                </div>
              `).join('')}
            </div>
          `}
        </div>
      `;
    } else if (role === 'ADMIN') {
      const [users, lots, txns, disputes] = await Promise.all([
        api.getUsers().catch(() => []),
        api.getMyProduceLots().catch(() => []),
        api.getTransactions().catch(() => []),
        api.getGrievances().catch(() => [])
      ]);

      const pendingVerifs = users.filter(u => u.verification_status === 'PENDING');
      const openDisputes = disputes.filter(d => d.status === 'OPEN' || d.status === 'UNDER_REVIEW');

      container.innerHTML = `
        <div class="portal-grid-3">
          <div class="kpi-card clickable" onclick="window.openFeatureView('users')">
            <div class="kpi-top">
              <span class="kpi-lbl">Total Registered Users</span>
              <div class="kpi-icon">${getIcon('users')}</div>
            </div>
            <div class="kpi-val">${users.length} <span class="kpi-sub">Farmers & Buyers</span></div>
          </div>
          <div class="kpi-card clickable" onclick="window.openFeatureView('verification')">
            <div class="kpi-top">
              <span class="kpi-lbl">Pending Verification</span>
              <div class="kpi-icon">${getIcon('check-square')}</div>
            </div>
            <div class="kpi-val ${pendingVerifs.length > 0 ? 'text-warning' : ''}">${pendingVerifs.length} <span class="kpi-sub">Requires Approval</span></div>
          </div>
          <div class="kpi-card clickable" onclick="window.openFeatureView('disputes')">
            <div class="kpi-top">
              <span class="kpi-lbl">Open Disputes</span>
              <div class="kpi-icon">${getIcon('shield-alert')}</div>
            </div>
            <div class="kpi-val ${openDisputes.length > 0 ? 'text-danger' : ''}">${openDisputes.length} <span class="kpi-sub">Grievance Tickets</span></div>
          </div>
        </div>

        <div class="portal-grid-2" style="margin-top:20px;">
          <div class="portal-box">
            <div class="portal-box-hdr">
              <h3>⏳ Pending Verifications Queue</h3>
              <button class="portal-btn primary-sm clickable" onclick="window.openFeatureView('verification')">Review All</button>
            </div>
            ${pendingVerifs.length === 0 ? `<div class="portal-empty">All institutional buyer and FPO accounts are verified.</div>` : `
              <div class="portal-mini-list">
                ${pendingVerifs.slice(0, 4).map(u => `
                  <div class="mini-row">
                    <div class="mini-col-left">
                      <strong>${u.company_name || u.fpo_name || u.full_name} (${u.role})</strong>
                      <span class="mini-meta">GST: ${u.gstin_or_registration || 'N/A'} &bull; ${u.district}, ${u.state}</span>
                    </div>
                    <button class="portal-btn success-xs clickable" onclick="window.quickApproveUser(${u.id})">Approve</button>
                  </div>
                `).join('')}
              </div>
            `}
          </div>

          <div class="portal-box">
            <div class="portal-box-hdr">
              <h3>⚖️ Active Dispute Tickets</h3>
              <button class="portal-btn outline-sm clickable" onclick="window.openFeatureView('disputes')">Dispute Center</button>
            </div>
            ${openDisputes.length === 0 ? `<div class="portal-empty">No unresolved trade disputes.</div>` : `
              <div class="portal-mini-list">
                ${openDisputes.slice(0, 4).map(d => `
                  <div class="mini-row">
                    <div class="mini-col-left">
                      <strong>#TX-${d.transaction_id}: ${d.title}</strong>
                      <span class="mini-meta">Category: ${d.category} &bull; By: ${d.raised_by?.full_name || 'User'}</span>
                    </div>
                    <span class="status-pill status-${d.status.toLowerCase()}">${d.status}</span>
                  </div>
                `).join('')}
              </div>
            `}
          </div>
        </div>
      `;
    } else if (role === 'LOGISTICS') {
      const txns = await api.getTransactions().catch(() => []);
      container.innerHTML = `
        <div class="portal-grid-3">
          <div class="kpi-card">
            <div class="kpi-top"><span class="kpi-lbl">Assigned Shipments</span><div class="kpi-icon">${getIcon('truck')}</div></div>
            <div class="kpi-val">${txns.length}</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-top"><span class="kpi-lbl">In Transit</span><div class="kpi-icon">${getIcon('truck')}</div></div>
            <div class="kpi-val">${txns.filter(t => t.status === 'DISPATCHED').length}</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-top"><span class="kpi-lbl">Delivered Orders</span><div class="kpi-icon">${getIcon('check-square')}</div></div>
            <div class="kpi-val">${txns.filter(t => t.status === 'DELIVERED' || t.status === 'ESCROW_RELEASED').length}</div>
          </div>
        </div>
        <div class="portal-box" style="margin-top:20px;">
          <div class="portal-box-hdr"><h3>🚚 Recent Shipments</h3></div>
          ${txns.length === 0 ? `<div class="portal-empty">No active shipments assigned.</div>` : `
            <div class="portal-table-wrap">
              <table class="portal-table">
                <thead><tr><th>Txn #</th><th>Seller (Origin)</th><th>Buyer (Destination)</th><th>Status</th><th>Action</th></tr></thead>
                <tbody>
                  ${txns.map(t => `
                    <tr>
                      <td>#TX-${t.id}</td>
                      <td>${t.seller?.full_name || 'Farmer'}<br><small>${t.delivery_address}</small></td>
                      <td>${t.buyer?.full_name || 'Buyer'}</td>
                      <td><span class="status-pill status-${t.status.toLowerCase()}">${t.status}</span></td>
                      <td>
                        ${t.status === 'ESCROW_DEPOSITED' ? `<button class="portal-btn primary-xs clickable" onclick="window.updateTxStatus(${t.id}, 'DISPATCHED')">Mark Dispatched</button>` : ''}
                        ${t.status === 'DISPATCHED' ? `<button class="portal-btn success-xs clickable" onclick="window.updateTxStatus(${t.id}, 'DELIVERED')">Confirm Delivery</button>` : ''}
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          `}
        </div>
      `;
    } else {
      // Guest Dashboard
      container.innerHTML = `
        <div class="portal-guest-welcome">
          <h2>Welcome to FairCrop.in Marketplace</h2>
          <p>Browse live agricultural commodities, APMC prices, and predictive market forecasts.</p>
          <div class="portal-btns-row" style="margin-top:16px;">
            <button class="portal-btn primary clickable" onclick="window.openFeatureView('marketplace')">Explore Marketplace</button>
            <button class="portal-btn outline clickable" onclick="window.openFeatureView('market-intelligence')">Live Mandi Prices</button>
            <button class="portal-btn outline clickable" onclick="window.openAuthModal('register')">Register as Farmer / Buyer</button>
          </div>
        </div>
      `;
    }
  }

  /* ══════════════════════════════════════════════════════════════
     2. MY LISTINGS VIEW (Farmer / FPO)
  ══════════════════════════════════════════════════════════════ */
  async function renderMyListingsView(container) {
    const lots = await api.getMyProduceLots();

    container.innerHTML = `
      <div class="portal-section-header">
        <div>
          <h2>My Harvest Produce Listings</h2>
          <p class="portal-subtext">Manage, monitor, and update your agricultural produce batches</p>
        </div>
        <button class="portal-btn primary clickable" onclick="window.openFeatureView('add-produce')">
          + Add New Produce Batch
        </button>
      </div>

      ${lots.length === 0 ? `
        <div class="portal-empty-card">
          <div class="empty-icon">🌾</div>
          <h3>No Produce Lots Listed</h3>
          <p>You haven't listed any harvest produce lots yet. Start selling directly to institutional buyers at fair prices.</p>
          <button class="portal-btn primary clickable" onclick="window.openFeatureView('add-produce')">List Your First Produce Batch</button>
        </div>
      ` : `
        <div class="produce-grid">
          ${lots.map(lot => {
            const img = (lot.image_urls && lot.image_urls.length > 0)
              ? lot.image_urls[0]
              : 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&q=80';
            const totalValue = lot.quantity_kg * lot.price_per_kg_expected;
            return `
              <div class="produce-card">
                <div class="produce-card-img" style="background-image:url('${img}');">
                  <span class="produce-grade-badge">${lot.grade}</span>
                  <span class="status-pill status-${lot.status.toLowerCase()}">${lot.status}</span>
                </div>
                <div class="produce-card-body">
                  <div class="produce-card-title">${lot.crop_name} <span class="produce-variety">${lot.variety || ''}</span></div>
                  <div class="produce-price-row">
                    <span class="produce-price">₹${lot.price_per_kg_expected} <small>/ kg</small></span>
                    <span class="produce-total">₹${totalValue.toLocaleString()}</span>
                  </div>
                  <div class="produce-meta-list">
                    <div>📦 <strong>Quantity:</strong> ${lot.quantity_kg.toLocaleString()} kg</div>
                    <div>📍 <strong>Location:</strong> ${lot.district}, ${lot.state}</div>
                    <div>💧 <strong>Moisture:</strong> ${lot.moisture_percentage ? lot.moisture_percentage + '%' : 'Standard'}</div>
                    <div>📅 <strong>Harvest:</strong> ${lot.harvest_date ? new Date(lot.harvest_date).toLocaleDateString() : 'Recent'}</div>
                  </div>
                  <div class="produce-card-actions">
                    <button class="portal-btn outline-sm clickable" onclick="window.viewProduceDetails(${lot.id})">View Details</button>
                    ${lot.status === 'AVAILABLE' ? `<button class="portal-btn secondary-sm clickable" onclick="window.editProducePrompt(${lot.id}, ${lot.price_per_kg_expected}, ${lot.quantity_kg})">Edit Price/Qty</button>` : ''}
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `}
    `;
  }

  /* ══════════════════════════════════════════════════════════════
     3. ADD PRODUCE VIEW (Farmer / FPO)
  ══════════════════════════════════════════════════════════════ */
  function renderAddProduceView(container) {
    const user = api.getUser() || {};

    container.innerHTML = `
      <div class="portal-form-wrap">
        <div class="portal-section-header">
          <div>
            <h2>Add New Harvest Produce Batch</h2>
            <p class="portal-subtext">List your crop produce on the national marketplace with guaranteed price discovery</p>
          </div>
        </div>

        <form id="form-add-produce" class="portal-form" novalidate>
          <div class="form-row-2">
            <div class="form-field">
              <label for="ap-crop">Crop Name *</label>
              <input type="text" id="ap-crop" placeholder="e.g. Wheat, Basmati Rice, Tomato, Onion, Cotton" required>
            </div>
            <div class="form-field">
              <label for="ap-variety">Variety / Hybrid</label>
              <input type="text" id="ap-variety" placeholder="e.g. Sharbati, Pusa 1121, Hybrid Red">
            </div>
          </div>

          <div class="form-row-3">
            <div class="form-field">
              <label for="ap-qty">Quantity (in Kilograms) *</label>
              <input type="number" id="ap-qty" placeholder="5000" min="1" step="any" required>
            </div>
            <div class="form-field">
              <label for="ap-price">Expected Price (₹ per kg) *</label>
              <input type="number" id="ap-price" placeholder="24.5" min="1" step="any" required>
            </div>
            <div class="form-field">
              <label for="ap-grade">Quality Grade *</label>
              <select id="ap-grade" required>
                <option value="GRADE_A">Grade A (Benchmark Quality)</option>
                <option value="PREMIUM">Premium / Export Grade</option>
                <option value="ORGANIC">Certified Organic</option>
                <option value="GRADE_B">Grade B (Standard)</option>
                <option value="GRADE_C">Grade C (Fair)</option>
              </select>
            </div>
          </div>

          <div class="form-row-3">
            <div class="form-field">
              <label for="ap-moisture">Moisture Percentage (%)</label>
              <input type="number" id="ap-moisture" placeholder="11.5" min="0" max="100" step="0.1">
            </div>
            <div class="form-field">
              <label for="ap-harvest">Harvest Date *</label>
              <input type="date" id="ap-harvest" required value="${new Date().toISOString().split('T')[0]}">
            </div>
            <div class="form-field">
              <label for="ap-expiry">Expiry / Best Before Date</label>
              <input type="date" id="ap-expiry">
            </div>
          </div>

          <div class="form-field">
            <label for="ap-storage">Storage Location / Warehouse Vault *</label>
            <input type="text" id="ap-storage" placeholder="e.g. Ludhiana Central Warehouse Vault 4" required>
          </div>

          <div class="form-row-2">
            <div class="form-field">
              <label for="ap-state">State *</label>
              <input type="text" id="ap-state" placeholder="Punjab" required value="${user.state || ''}">
            </div>
            <div class="form-field">
              <label for="ap-district">District *</label>
              <input type="text" id="ap-district" placeholder="Ludhiana" required value="${user.district || ''}">
            </div>
          </div>

          <!-- Multi-Image Upload & URL Input -->
          <div class="form-field">
            <label>Produce Images (Upload files or enter image URLs)</label>
            <div class="img-upload-zone">
              <input type="file" id="ap-file-input" accept="image/*" multiple style="display:none;">
              <button type="button" class="portal-btn outline-sm clickable" onclick="document.getElementById('ap-file-input').click()">
                📷 Choose Images from Device
              </button>
              <span style="font-size:0.78rem;color:var(--text-lo);">or paste URL below:</span>
              <div class="img-url-row">
                <input type="url" id="ap-img-url-input" placeholder="https://images.unsplash.com/photo-...">
                <button type="button" class="portal-btn secondary-sm clickable" id="btn-add-img-url">Add URL</button>
              </div>
            </div>
            <div class="img-preview-grid" id="img-preview-grid"></div>
          </div>

          <!-- Total Valuation Box -->
          <div class="lot-valuation-box" id="lot-valuation-box">
            <span>Estimated Total Lot Value:</span>
            <strong id="ap-total-val">₹ 0.00</strong>
          </div>

          <div class="form-error" id="ap-error" aria-live="polite"></div>

          <div class="portal-btns-row" style="margin-top:16px;">
            <button type="submit" class="portal-btn primary-lg clickable" id="ap-submit">
              <span>List Produce Batch on Marketplace</span>
              <div class="auth-spinner" aria-hidden="true"></div>
            </button>
            <button type="button" class="portal-btn outline clickable" onclick="window.openFeatureView('my-listings')">Cancel</button>
          </div>
        </form>
      </div>
    `;

    // Image state list
    const imagesList = [];

    function updateImgPreviews() {
      const grid = document.getElementById('img-preview-grid');
      if (!grid) return;
      grid.innerHTML = imagesList.map((url, idx) => `
        <div class="img-thumb-wrap">
          <img src="${url}" alt="Preview ${idx + 1}" class="img-thumb">
          <button type="button" class="img-thumb-remove clickable" data-idx="${idx}">&times;</button>
        </div>
      `).join('');

      grid.querySelectorAll('.img-thumb-remove').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.dataset.idx);
          imagesList.splice(idx, 1);
          updateImgPreviews();
        });
      });
    }

    document.getElementById('btn-add-img-url')?.addEventListener('click', () => {
      const input = document.getElementById('ap-img-url-input');
      const val = input.value.trim();
      if (val) {
        imagesList.push(val);
        input.value = '';
        updateImgPreviews();
      }
    });

    document.getElementById('ap-file-input')?.addEventListener('change', e => {
      const files = Array.from(e.target.files);
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = ev => {
          imagesList.push(ev.target.result);
          updateImgPreviews();
        };
        reader.readAsDataURL(file);
      });
    });

    // Auto calculate valuation
    const qtyIn = document.getElementById('ap-qty');
    const priceIn = document.getElementById('ap-price');
    const totalDisplay = document.getElementById('ap-total-val');

    function calcVal() {
      const q = parseFloat(qtyIn.value) || 0;
      const p = parseFloat(priceIn.value) || 0;
      totalDisplay.textContent = `₹ ${(q * p).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
    }
    qtyIn?.addEventListener('input', calcVal);
    priceIn?.addEventListener('input', calcVal);

    // Form Submit
    document.getElementById('form-add-produce')?.addEventListener('submit', async e => {
      e.preventDefault();
      const errEl = document.getElementById('ap-error');
      errEl.textContent = '';
      const btn = document.getElementById('ap-submit');

      const crop_name = document.getElementById('ap-crop').value.trim();
      const variety = document.getElementById('ap-variety').value.trim() || null;
      const quantity_kg = parseFloat(document.getElementById('ap-qty').value);
      const price_per_kg_expected = parseFloat(document.getElementById('ap-price').value);
      const grade = document.getElementById('ap-grade').value;
      const moisture_percentage = parseFloat(document.getElementById('ap-moisture').value) || null;
      const harvest_date = document.getElementById('ap-harvest').value;
      const expiry_date = document.getElementById('ap-expiry').value || null;
      const storage_location = document.getElementById('ap-storage').value.trim();
      const state = document.getElementById('ap-state').value.trim();
      const district = document.getElementById('ap-district').value.trim();

      if (!crop_name || isNaN(quantity_kg) || isNaN(price_per_kg_expected) || !harvest_date || !storage_location || !state || !district) {
        errEl.textContent = 'Please fill in all mandatory fields marked with (*).';
        return;
      }

      btn.disabled = true;
      btn.classList.add('loading');

      try {
        const payload = {
          crop_name, variety, quantity_kg, price_per_kg_expected, grade,
          moisture_percentage,
          harvest_date: new Date(harvest_date).toISOString(),
          expiry_date: expiry_date ? new Date(expiry_date).toISOString() : null,
          storage_location, state, district,
          image_urls: imagesList.length > 0 ? imagesList : ['https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&q=80']
        };

        await api.createProduceLot(payload);
        window.showToast?.(`Produce batch for ${crop_name} listed successfully! 🎉`);
        window.openFeatureView('my-listings');
      } catch (err) {
        errEl.textContent = err.message || 'Failed to list produce batch.';
      } finally {
        btn.disabled = false;
        btn.classList.remove('loading');
      }
    });
  }

  /* ══════════════════════════════════════════════════════════════
     4. BUYER MARKETPLACE VIEW
  ══════════════════════════════════════════════════════════════ */
  async function renderMarketplaceView(container) {
    container.innerHTML = `
      <div class="portal-section-header">
        <div>
          <h2>Agricultural Produce Marketplace</h2>
          <p class="portal-subtext">Direct institutional sourcing from verified farmers and FPO collectives</p>
        </div>
      </div>

      <!-- Filters Toolbar -->
      <div class="marketplace-filter-card">
        <div class="filter-row">
          <div class="filter-fld flex-2">
            <label>Search Crop</label>
            <input type="search" id="mp-filter-crop" placeholder="Wheat, Rice, Tomato, Onion...">
          </div>
          <div class="filter-fld">
            <label>State</label>
            <input type="text" id="mp-filter-state" placeholder="e.g. Punjab, Haryana">
          </div>
          <div class="filter-fld">
            <label>Grade</label>
            <select id="mp-filter-grade">
              <option value="">All Grades</option>
              <option value="GRADE_A">Grade A</option>
              <option value="PREMIUM">Premium</option>
              <option value="ORGANIC">Organic</option>
              <option value="GRADE_B">Grade B</option>
            </select>
          </div>
          <div class="filter-fld">
            <label>Max ₹/kg</label>
            <input type="number" id="mp-filter-maxprice" placeholder="e.g. 30">
          </div>
          <div class="filter-btn-col">
            <button class="portal-btn primary clickable" id="btn-apply-filters">Apply Filters</button>
            <button class="portal-btn outline clickable" id="btn-reset-filters">Reset</button>
          </div>
        </div>
      </div>

      <!-- Results Grid -->
      <div id="marketplace-lots-container">
        <div class="portal-spinner-wrap"><div class="auth-spinner" style="display:block;width:32px;height:32px;"></div></div>
      </div>
    `;

    async function loadMarketplaceLots(params = {}) {
      const box = document.getElementById('marketplace-lots-container');
      if (!box) return;
      box.innerHTML = `<div class="portal-spinner-wrap"><div class="auth-spinner" style="display:block;width:32px;height:32px;"></div></div>`;

      try {
        const lots = await api.getMarketplaceLots(params);
        if (lots.length === 0) {
          box.innerHTML = `
            <div class="portal-empty-card">
              <div class="empty-icon">🔍</div>
              <h3>No Produce Lots Found</h3>
              <p>No matching lots available for the selected filters. Try searching for other commodities or clearing filters.</p>
            </div>
          `;
          return;
        }

        box.innerHTML = `
          <div class="produce-grid">
            ${lots.map(lot => {
              const img = (lot.image_urls && lot.image_urls.length > 0)
                ? lot.image_urls[0]
                : 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&q=80';
              const totalVal = lot.quantity_kg * lot.price_per_kg_expected;
              return `
                <div class="produce-card">
                  <div class="produce-card-img" style="background-image:url('${img}');">
                    <span class="produce-grade-badge">${lot.grade}</span>
                    <span class="status-pill status-${lot.status.toLowerCase()}">${lot.status}</span>
                  </div>
                  <div class="produce-card-body">
                    <div class="produce-card-title">${lot.crop_name} <span class="produce-variety">${lot.variety || ''}</span></div>
                    <div class="produce-price-row">
                      <span class="produce-price">₹${lot.price_per_kg_expected} <small>/ kg</small></span>
                      <span class="produce-total">₹${totalVal.toLocaleString()}</span>
                    </div>
                    <div class="produce-meta-list">
                      <div>📦 <strong>Quantity:</strong> ${lot.quantity_kg.toLocaleString()} kg</div>
                      <div>📍 <strong>Location:</strong> ${lot.district}, ${lot.state}</div>
                      <div>👨‍🌾 <strong>Seller:</strong> ${lot.farmer?.full_name || 'Verified Farmer'}</div>
                      <div>💧 <strong>Moisture:</strong> ${lot.moisture_percentage ? lot.moisture_percentage + '%' : 'Optimal'}</div>
                    </div>
                    <div class="produce-card-actions">
                      <button class="portal-btn outline-sm clickable" onclick="window.viewProduceDetails(${lot.id})">View Details</button>
                      <button class="portal-btn primary-sm clickable" onclick="window.openOfferModal(${lot.id}, '${lot.crop_name}', ${lot.price_per_kg_expected}, ${lot.quantity_kg})">Make Offer</button>
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        `;
      } catch (e) {
        box.innerHTML = `<div class="portal-error-card"><p>${e.message}</p></div>`;
      }
    }

    // Bind filters
    document.getElementById('btn-apply-filters')?.addEventListener('click', () => {
      const crop_name = document.getElementById('mp-filter-crop').value.trim();
      const state = document.getElementById('mp-filter-state').value.trim();
      const grade = document.getElementById('mp-filter-grade').value;
      const max_price_per_kg = parseFloat(document.getElementById('mp-filter-maxprice').value) || undefined;
      loadMarketplaceLots({ crop_name, state, grade, max_price_per_kg });
    });

    document.getElementById('btn-reset-filters')?.addEventListener('click', () => {
      document.getElementById('mp-filter-crop').value = '';
      document.getElementById('mp-filter-state').value = '';
      document.getElementById('mp-filter-grade').value = '';
      document.getElementById('mp-filter-maxprice').value = '';
      loadMarketplaceLots();
    });

    loadMarketplaceLots();
  }

  /* ══════════════════════════════════════════════════════════════
     5. SMART MATCHMAKING VIEW (Buyer)
  ══════════════════════════════════════════════════════════════ */
  async function renderSmartMatchesView(container) {
    container.innerHTML = `
      <div class="portal-section-header">
        <div>
          <h2>Smart Matchmaking Engine</h2>
          <p class="portal-subtext">Algorithmic matching based on crop relevance, quantity fulfillment, price savings, grade, and geographic proximity</p>
        </div>
      </div>

      <div class="marketplace-filter-card">
        <form id="form-smart-match" class="filter-row">
          <div class="filter-fld flex-2">
            <label>Required Crop *</label>
            <input type="text" id="sm-crop" placeholder="Wheat, Rice, Tomato, Onion..." required value="Wheat">
          </div>
          <div class="filter-fld">
            <label>Min Quantity (kg)</label>
            <input type="number" id="sm-qty" placeholder="e.g. 2000" value="2000">
          </div>
          <div class="filter-fld">
            <label>Max Budget (₹/kg)</label>
            <input type="number" id="sm-maxprice" placeholder="e.g. 25" value="26">
          </div>
          <div class="filter-fld">
            <label>Preferred State</label>
            <input type="text" id="sm-state" placeholder="e.g. Punjab">
          </div>
          <div class="filter-btn-col">
            <button type="submit" class="portal-btn primary clickable" id="btn-run-match">Find Matches</button>
          </div>
        </form>
      </div>

      <div id="smart-matches-results"></div>
    `;

    async function runMatching() {
      const crop_name = document.getElementById('sm-crop').value.trim();
      const desired_min_qty = parseFloat(document.getElementById('sm-qty').value) || undefined;
      const desired_max_price = parseFloat(document.getElementById('sm-maxprice').value) || undefined;
      const preferred_state = document.getElementById('sm-state').value.trim() || undefined;

      const resBox = document.getElementById('smart-matches-results');
      if (!resBox || !crop_name) return;

      resBox.innerHTML = `<div class="portal-spinner-wrap"><div class="auth-spinner" style="display:block;width:32px;height:32px;"></div></div>`;

      try {
        const matches = await api.getMatchmaking({ crop_name, desired_min_qty, desired_max_price, preferred_state });
        if (matches.length === 0) {
          resBox.innerHTML = `
            <div class="portal-empty-card">
              <div class="empty-icon">🎯</div>
              <h3>No Matches Found for "${crop_name}"</h3>
              <p>Try broadening your price or quantity constraints.</p>
            </div>
          `;
          return;
        }

        resBox.innerHTML = `
          <div class="matches-grid">
            ${matches.map(m => {
              const lot = m.produce_lot;
              const score = m.match_score_percentage;
              const scoreClass = score >= 85 ? 'high' : score >= 65 ? 'medium' : 'low';
              const img = (lot.image_urls && lot.image_urls.length > 0)
                ? lot.image_urls[0]
                : 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&q=80';
              return `
                <div class="match-card">
                  <div class="match-card-top">
                    <div class="match-score-pill ${scoreClass}">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="16" height="16"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                      <span>${score}% MATCH</span>
                    </div>
                    <span class="produce-grade-badge">${lot.grade}</span>
                  </div>
                  <div class="match-card-img" style="background-image:url('${img}');"></div>
                  <div class="match-card-body">
                    <h3>${lot.crop_name} (${lot.variety || 'Standard'})</h3>
                    <div class="match-price-row">
                      <span class="produce-price">₹${lot.price_per_kg_expected} / kg</span>
                      <span class="match-qty">${lot.quantity_kg.toLocaleString()} kg available</span>
                    </div>
                    <div class="match-reasons">
                      <span class="reason-tag">✅ Crop: ${lot.crop_name}</span>
                      <span class="reason-tag">📍 Location: ${lot.district}, ${lot.state}</span>
                      <span class="reason-tag">🌾 Grade: ${lot.grade}</span>
                    </div>
                    <div class="produce-card-actions" style="margin-top:12px;">
                      <button class="portal-btn outline-sm clickable" onclick="window.viewProduceDetails(${lot.id})">Details</button>
                      <button class="portal-btn primary-sm clickable" onclick="window.openOfferModal(${lot.id}, '${lot.crop_name}', ${lot.price_per_kg_expected}, ${lot.quantity_kg})">Make Trade Offer</button>
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        `;
      } catch (err) {
        resBox.innerHTML = `<div class="portal-error-card"><p>${err.message}</p></div>`;
      }
    }

    document.getElementById('form-smart-match')?.addEventListener('submit', e => {
      e.preventDefault();
      runMatching();
    });

    runMatching();
  }

  /* ══════════════════════════════════════════════════════════════
     6. INCOMING BIDS & MY BIDS VIEW
  ══════════════════════════════════════════════════════════════ */
  async function renderIncomingBidsView(container) {
    const offers = await api.getIncomingOffers();

    container.innerHTML = `
      <div class="portal-section-header">
        <div>
          <h2>Incoming Trade Bids & Offers</h2>
          <p class="portal-subtext">Review, accept, reject, or counter buyer purchase offers</p>
        </div>
      </div>

      ${offers.length === 0 ? `
        <div class="portal-empty-card">
          <div class="empty-icon">📥</div>
          <h3>No Incoming Offers Yet</h3>
          <p>When institutional buyers place purchase bids on your listed produce lots, they will appear here for your review.</p>
        </div>
      ` : `
        <div class="portal-table-wrap">
          <table class="portal-table">
            <thead>
              <tr>
                <th>Offer ID</th>
                <th>Buyer Entity</th>
                <th>Produce Batch</th>
                <th>Offered Price</th>
                <th>Offered Qty</th>
                <th>Total Value</th>
                <th>Message</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${offers.map(o => `
                <tr>
                  <td><strong>#BID-${o.id}</strong></td>
                  <td>
                    <strong>${o.buyer?.company_name || o.buyer?.full_name || 'Buyer'}</strong>
                    <br><small>📍 ${o.buyer?.district || ''}, ${o.buyer?.state || ''}</small>
                  </td>
                  <td>
                    <strong>${o.produce_lot?.crop_name || 'Produce'}</strong>
                    <br><small>${o.produce_lot?.variety || ''}</small>
                  </td>
                  <td><strong style="color:var(--saffron);">₹${o.offered_price_per_kg}/kg</strong></td>
                  <td>${o.offered_quantity_kg.toLocaleString()} kg</td>
                  <td><strong>₹${o.total_offer_value.toLocaleString()}</strong></td>
                  <td style="max-width:200px;font-size:0.78rem;">${o.message || '—'}</td>
                  <td><span class="status-pill status-${o.status.toLowerCase()}">${o.status}</span></td>
                  <td>
                    ${o.status === 'PENDING' ? `
                      <div class="btn-group-row">
                        <button class="portal-btn success-xs clickable" onclick="window.respondOffer(${o.id}, 'ACCEPTED')">Accept</button>
                        <button class="portal-btn danger-xs clickable" onclick="window.respondOffer(${o.id}, 'REJECTED')">Reject</button>
                      </div>
                    ` : `
                      <span style="font-size:0.75rem;color:var(--text-lo);">${o.status}</span>
                    `}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `}
    `;
  }

  async function renderMyBidsView(container) {
    const bids = await api.getMyBids();

    container.innerHTML = `
      <div class="portal-section-header">
        <div>
          <h2>My Submitted Trade Offers</h2>
          <p class="portal-subtext">Track status of purchase bids submitted to farmers and FPOs</p>
        </div>
        <button class="portal-btn primary clickable" onclick="window.openFeatureView('marketplace')">Explore Marketplace</button>
      </div>

      ${bids.length === 0 ? `
        <div class="portal-empty-card">
          <div class="empty-icon">📤</div>
          <h3>No Bids Placed</h3>
          <p>You haven't submitted any offers yet. Browse the marketplace and click "Make Offer" on produce lots.</p>
          <button class="portal-btn primary clickable" onclick="window.openFeatureView('marketplace')">Browse Produce Lots</button>
        </div>
      ` : `
        <div class="portal-table-wrap">
          <table class="portal-table">
            <thead>
              <tr>
                <th>Offer ID</th>
                <th>Produce Crop</th>
                <th>Farmer / Seller</th>
                <th>Your Bid (₹/kg)</th>
                <th>Quantity</th>
                <th>Total Value</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              ${bids.map(b => `
                <tr>
                  <td><strong>#BID-${b.id}</strong></td>
                  <td><strong>${b.produce_lot?.crop_name || 'Crop'}</strong></td>
                  <td>${b.produce_lot?.farmer?.full_name || 'Farmer'}</td>
                  <td><strong>₹${b.offered_price_per_kg}/kg</strong></td>
                  <td>${b.offered_quantity_kg.toLocaleString()} kg</td>
                  <td><strong>₹${b.total_offer_value.toLocaleString()}</strong></td>
                  <td><span class="status-pill status-${b.status.toLowerCase()}">${b.status}</span></td>
                  <td><small>${new Date(b.created_at).toLocaleDateString()}</small></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `}
    `;
  }

  /* ══════════════════════════════════════════════════════════════
     7. TRANSACTIONS & ESCROW VIEW
  ══════════════════════════════════════════════════════════════ */
  async function renderTransactionsView(container) {
    const txns = await api.getTransactions();
    const user = api.getUser() || {};
    const role = user.role || 'GUEST';

    container.innerHTML = `
      <div class="portal-section-header">
        <div>
          <h2>Escrow & Settlement Transactions</h2>
          <p class="portal-subtext">Secure multi-stage escrow payments and digital fulfillment tracking</p>
        </div>
      </div>

      ${txns.length === 0 ? `
        <div class="portal-empty-card">
          <div class="empty-icon">💳</div>
          <h3>No Transactions Found</h3>
          <p>Transactions are automatically generated when a farmer accepts a buyer trade offer.</p>
        </div>
      ` : `
        <div class="tx-cards-stack">
          ${txns.map(tx => {
            const isBuyer = tx.buyer_id === user.id;
            const isSeller = tx.seller_id === user.id;
            const isAdmin = role === 'ADMIN';

            // Timeline states order
            const steps = [
              { key: 'INITIATED',        label: 'Initiated' },
              { key: 'ESCROW_DEPOSITED', label: 'Escrow Deposited' },
              { key: 'DISPATCHED',       label: 'Dispatched' },
              { key: 'DELIVERED',        label: 'Delivered' },
              { key: 'ESCROW_RELEASED',  label: 'Escrow Released' },
            ];

            const currentIndex = steps.findIndex(s => s.key === tx.status);
            const isDisputed = tx.status === 'DISPUTED';
            const isCancelled = tx.status === 'CANCELLED';

            return `
              <div class="tx-card ${isDisputed ? 'disputed-card' : ''}">
                <div class="tx-card-hdr">
                  <div>
                    <span class="tx-id-badge">Transaction #TX-${tx.id}</span>
                    <span class="tx-date">${new Date(tx.created_at).toLocaleString()}</span>
                  </div>
                  <div>
                    <span class="status-pill status-${tx.status.toLowerCase()}">${tx.status}</span>
                  </div>
                </div>

                <!-- Visual Timeline -->
                <div class="tx-timeline">
                  ${steps.map((step, idx) => {
                    const isDone = currentIndex >= idx && !isCancelled && !isDisputed;
                    const isCur = currentIndex === idx && !isCancelled && !isDisputed;
                    return `
                      <div class="tl-node ${isDone ? 'done' : ''} ${isCur ? 'current' : ''}">
                        <div class="tl-circle">${isDone ? '✓' : (idx + 1)}</div>
                        <div class="tl-label">${step.label}</div>
                      </div>
                      ${idx < steps.length - 1 ? `<div class="tl-connector ${currentIndex > idx && !isCancelled && !isDisputed ? 'done' : ''}"></div>` : ''}
                    `;
                  }).join('')}
                </div>

                ${isDisputed ? `
                  <div class="tx-disputed-banner">
                    ⚠️ <strong>Transaction Disputed:</strong> A quality/delivery dispute ticket is currently under review by Ministry Admins.
                  </div>
                ` : ''}

                <!-- Transaction Details Grid -->
                <div class="tx-details-grid">
                  <div>
                    <span class="tx-lbl">Buyer Entity</span>
                    <strong>${tx.buyer?.company_name || tx.buyer?.full_name || 'Buyer'}</strong>
                  </div>
                  <div>
                    <span class="tx-lbl">Seller / Farmer</span>
                    <strong>${tx.seller?.full_name || 'Farmer'}</strong>
                  </div>
                  <div>
                    <span class="tx-lbl">Total Amount</span>
                    <strong style="color:var(--saffron);font-size:1.1rem;">₹${tx.total_amount.toLocaleString()}</strong>
                  </div>
                  <div>
                    <span class="tx-lbl">Escrow Amount</span>
                    <strong>₹${tx.escrow_amount.toLocaleString()}</strong>
                  </div>
                  <div>
                    <span class="tx-lbl">Payment Ref / UPI</span>
                    <code>${tx.payment_reference || 'Pending Deposit'}</code>
                  </div>
                  <div>
                    <span class="tx-lbl">Delivery / Warehouse</span>
                    <span>${tx.delivery_address}</span>
                  </div>
                </div>

                <!-- Action Controls Based on State & Role -->
                <div class="tx-card-actions">
                  ${(isBuyer || isAdmin) && tx.status === 'INITIATED' ? `
                    <button class="portal-btn primary-sm clickable" onclick="window.depositEscrowPrompt(${tx.id})">
                      🔒 Deposit Escrow (UPI / Bank)
                    </button>
                  ` : ''}

                  ${(isSeller || role === 'LOGISTICS' || isAdmin) && tx.status === 'ESCROW_DEPOSITED' ? `
                    <button class="portal-btn primary-sm clickable" onclick="window.updateTxStatus(${tx.id}, 'DISPATCHED')">
                      🚚 Mark Dispatched
                    </button>
                  ` : ''}

                  ${(isBuyer || role === 'LOGISTICS' || isAdmin) && tx.status === 'DISPATCHED' ? `
                    <button class="portal-btn success-sm clickable" onclick="window.updateTxStatus(${tx.id}, 'DELIVERED')">
                      📦 Confirm Delivery Received
                    </button>
                  ` : ''}

                  ${(isBuyer || isAdmin) && tx.status === 'DELIVERED' ? `
                    <button class="portal-btn success-sm clickable" onclick="window.updateTxStatus(${tx.id}, 'ESCROW_RELEASED')">
                      💸 Release Escrow Funds to Farmer
                    </button>
                  ` : ''}

                  ${!isDisputed && tx.status !== 'ESCROW_RELEASED' && tx.status !== 'CANCELLED' ? `
                    <button class="portal-btn danger-sm clickable" onclick="window.openFileDisputeModal(${tx.id})">
                      ⚠️ Raise Dispute Ticket
                    </button>
                  ` : ''}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `}
    `;
  }

  /* ══════════════════════════════════════════════════════════════
     8. MARKET INTELLIGENCE VIEW
  ══════════════════════════════════════════════════════════════ */
  async function renderMarketIntelligenceView(container) {
    container.innerHTML = `
      <div class="portal-section-header">
        <div>
          <h2>Real-Time APMC Mandi Price Intelligence</h2>
          <p class="portal-subtext">Live synchronized modal, minimum, and maximum arrival prices across 2,400+ mandis</p>
        </div>
        <button class="portal-btn primary clickable" onclick="window.openFeatureView('price-forecast')">
          🔮 View 7-Day ML Price Forecast
        </button>
      </div>

      <div class="marketplace-filter-card">
        <div class="filter-row">
          <div class="filter-fld flex-2">
            <label>Crop Name</label>
            <input type="search" id="mi-crop" placeholder="Wheat, Rice, Tomato, Onion, Cotton...">
          </div>
          <div class="filter-fld">
            <label>State</label>
            <input type="text" id="mi-state" placeholder="e.g. Punjab, Maharashtra">
          </div>
          <div class="filter-fld">
            <label>District</label>
            <input type="text" id="mi-district" placeholder="e.g. Ludhiana, Nashik">
          </div>
          <div class="filter-btn-col">
            <button class="portal-btn primary clickable" id="btn-mi-search">Search Prices</button>
            <button class="portal-btn outline clickable" id="btn-mi-reset">Reset</button>
          </div>
        </div>
      </div>

      <div id="mi-table-container">
        <div class="portal-spinner-wrap"><div class="auth-spinner" style="display:block;width:32px;height:32px;"></div></div>
      </div>
    `;

    async function loadPrices(params = {}) {
      const box = document.getElementById('mi-table-container');
      if (!box) return;
      box.innerHTML = `<div class="portal-spinner-wrap"><div class="auth-spinner" style="display:block;width:32px;height:32px;"></div></div>`;

      try {
        const prices = await api.getMandiPrices(params);
        if (prices.length === 0) {
          box.innerHTML = `<div class="portal-empty-card"><h3>No Price Records Found</h3></div>`;
          return;
        }

        box.innerHTML = `
          <div class="portal-table-wrap">
            <table class="portal-table">
              <thead>
                <tr>
                  <th>Commodity</th>
                  <th>State & District</th>
                  <th>APMC / Mandi</th>
                  <th>Min Price</th>
                  <th>Modal Price (Benchmark)</th>
                  <th>Max Price</th>
                  <th>Price Date</th>
                  <th>Source</th>
                </tr>
              </thead>
              <tbody>
                ${prices.map(p => `
                  <tr>
                    <td><strong>${p.crop_name}</strong><br><small>${p.variety || 'Standard'}</small></td>
                    <td>${p.district}, ${p.state}</td>
                    <td><strong>${p.mandi_name}</strong></td>
                    <td>₹${p.min_price.toLocaleString()}/q</td>
                    <td><strong style="color:var(--saffron);font-size:1.05rem;">₹${p.modal_price.toLocaleString()}/q</strong></td>
                    <td>₹${p.max_price.toLocaleString()}/q</td>
                    <td><small>${new Date(p.price_date).toLocaleDateString()}</small></td>
                    <td><span class="source-tag">${p.source}</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `;
      } catch (err) {
        box.innerHTML = `<div class="portal-error-card"><p>${err.message}</p></div>`;
      }
    }

    document.getElementById('btn-mi-search')?.addEventListener('click', () => {
      const crop_name = document.getElementById('mi-crop').value.trim();
      const state = document.getElementById('mi-state').value.trim();
      const district = document.getElementById('mi-district').value.trim();
      loadPrices({ crop_name, state, district });
    });

    document.getElementById('btn-mi-reset')?.addEventListener('click', () => {
      document.getElementById('mi-crop').value = '';
      document.getElementById('mi-state').value = '';
      document.getElementById('mi-district').value = '';
      loadPrices();
    });

    loadPrices();
  }

  /* ══════════════════════════════════════════════════════════════
     9. 7-DAY ML PRICE FORECAST & AI ADVISORY VIEW
  ══════════════════════════════════════════════════════════════ */
  async function renderPriceForecastView(container) {
    container.innerHTML = `
      <div class="portal-section-header">
        <div>
          <h2>7-Day ML Price Forecast & Prediction Engine</h2>
          <p class="portal-subtext">Predictive machine learning time-series models with confidence intervals & optimal sale timing</p>
        </div>
      </div>

      <div class="marketplace-filter-card">
        <form id="form-forecast" class="filter-row">
          <div class="filter-fld flex-2">
            <label>Select Commodity *</label>
            <select id="fc-crop">
              <option value="Wheat">Wheat</option>
              <option value="Basmati Rice">Basmati Rice</option>
              <option value="Tomato">Tomato</option>
              <option value="Onion">Onion</option>
              <option value="Potato">Potato</option>
              <option value="Cotton">Cotton</option>
              <option value="Soybean">Soybean</option>
              <option value="Maize">Maize</option>
              <option value="Mustard">Mustard</option>
            </select>
          </div>
          <div class="filter-fld">
            <label>State</label>
            <input type="text" id="fc-state" value="Punjab">
          </div>
          <div class="filter-fld">
            <label>District</label>
            <input type="text" id="fc-district" value="Ludhiana">
          </div>
          <div class="filter-btn-col">
            <button type="submit" class="portal-btn primary clickable">Run ML Forecast</button>
          </div>
        </form>
      </div>

      <div id="forecast-results-box">
        <div class="portal-spinner-wrap"><div class="auth-spinner" style="display:block;width:32px;height:32px;"></div></div>
      </div>
    `;

    async function loadForecastData() {
      const crop_name = document.getElementById('fc-crop').value;
      const state = document.getElementById('fc-state').value.trim() || 'Punjab';
      const district = document.getElementById('fc-district').value.trim() || 'Ludhiana';
      const mandi_name = `${district} Mandi`;

      const box = document.getElementById('forecast-results-box');
      if (!box) return;
      box.innerHTML = `<div class="portal-spinner-wrap"><div class="auth-spinner" style="display:block;width:32px;height:32px;"></div></div>`;

      try {
        const data = await api.getForecast({ crop_name, state, district, mandi_name });

        const pts = data.forecast_7d || [];
        const isHold = data.recommended_sale_window.toLowerCase().includes('hold');

        // Render SVG Line Chart with Confidence Interval Area
        const minP = Math.min(...pts.map(p => p.confidence_lower)) * 0.95;
        const maxP = Math.max(...pts.map(p => p.confidence_upper)) * 1.05;
        const range = maxP - minP || 1;

        const w = 700, h = 260, padX = 50, padY = 30;
        const chartW = w - padX * 2;
        const chartH = h - padY * 2;

        const getX = i => padX + (i / (pts.length - 1)) * chartW;
        const getY = v => h - padY - ((v - minP) / range) * chartH;

        // Path for predicted line
        const linePath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(p.predicted_modal_price)}`).join(' ');

        // Path for confidence area
        const upperPath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(p.confidence_upper)}`).join(' ');
        const lowerPath = pts.slice().reverse().map((p, i) => `L ${getX(pts.length - 1 - i)} ${getY(p.confidence_lower)}`).join(' ');
        const areaPath = `${upperPath} ${lowerPath} Z`;

        box.innerHTML = `
          <!-- AI Advisory Widget -->
          <div class="advisory-card-widget ${isHold ? 'hold' : 'sell'}" style="margin-bottom:20px;">
            <div class="adv-badge">🤖 AI Recommendation: ${isHold ? 'HOLD PRODUCE' : 'SELL IMMEDIATELY'}</div>
            <div class="adv-headline">${data.recommended_sale_window}</div>
            <div class="adv-desc">${data.advice_summary}</div>
            <div class="adv-meta">
              <span>Commodity: <strong>${data.crop_name}</strong></span>
              <span>Current Rate: <strong>₹${data.current_modal_price}/quintal</strong></span>
              <span>Mandi: <strong>${data.mandi_name}, ${data.state}</strong></span>
            </div>
          </div>

          <!-- Forecast Chart Box -->
          <div class="portal-box">
            <div class="portal-box-hdr">
              <h3>📈 7-Day Predicted Price Trajectory (₹/Quintal)</h3>
              <span style="font-size:0.75rem;color:var(--text-lo);">Shaded zone represents 95% confidence interval</span>
            </div>

            <div class="chart-container-svg">
              <svg viewBox="0 0 ${w} ${h}" class="forecast-svg">
                <!-- Grid Lines -->
                <line x1="${padX}" y1="${getY(minP)}" x2="${w - padX}" y2="${getY(minP)}" stroke="rgba(255,255,255,0.08)" stroke-dasharray="2 2"/>
                <line x1="${padX}" y1="${getY((minP + maxP) / 2)}" x2="${w - padX}" y2="${getY((minP + maxP) / 2)}" stroke="rgba(255,255,255,0.08)" stroke-dasharray="2 2"/>
                <line x1="${padX}" y1="${getY(maxP)}" x2="${w - padX}" y2="${getY(maxP)}" stroke="rgba(255,255,255,0.08)" stroke-dasharray="2 2"/>

                <!-- Confidence Interval Area -->
                <path d="${areaPath}" fill="rgba(255,107,0,0.15)"/>

                <!-- Predicted Line -->
                <path d="${linePath}" fill="none" stroke="#FF6B00" stroke-width="3.5" stroke-linecap="round"/>

                <!-- Data Points & Labels -->
                ${pts.map((p, i) => `
                  <circle cx="${getX(i)}" cy="${getY(p.predicted_modal_price)}" r="5" fill="#FF8C38" stroke="#fff" stroke-width="1.5"/>
                  <text x="${getX(i)}" y="${getY(p.predicted_modal_price) - 10}" fill="#fff" font-size="11" font-weight="700" text-anchor="middle">₹${Math.round(p.predicted_modal_price)}</text>
                  <text x="${getX(i)}" y="${h - 8}" fill="rgba(255,255,255,0.6)" font-size="10" text-anchor="middle">${p.date.split('-').slice(1).join('/')}</text>
                `).join('')}
              </svg>
            </div>

            <!-- Forecast Data Table -->
            <div class="portal-table-wrap" style="margin-top:20px;">
              <table class="portal-table">
                <thead>
                  <tr>
                    <th>Forecast Date</th>
                    <th>Predicted Modal Price</th>
                    <th>Lower Bound (95%)</th>
                    <th>Upper Bound (95%)</th>
                  </tr>
                </thead>
                <tbody>
                  ${pts.map(p => `
                    <tr>
                      <td><strong>📅 ${p.date}</strong></td>
                      <td><strong style="color:var(--saffron);">₹${p.predicted_modal_price.toFixed(2)}/q</strong></td>
                      <td>₹${p.confidence_lower.toFixed(2)}/q</td>
                      <td>₹${p.confidence_upper.toFixed(2)}/q</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        `;
      } catch (err) {
        box.innerHTML = `<div class="portal-error-card"><p>${err.message}</p></div>`;
      }
    }

    document.getElementById('form-forecast')?.addEventListener('submit', e => {
      e.preventDefault();
      loadForecastData();
    });

    loadForecastData();
  }

  async function renderAIAdvisoryView(container) {
    // Re-use forecast with advisory focus
    await renderPriceForecastView(container);
  }

  /* ══════════════════════════════════════════════════════════════
     10. GRIEVANCES & DISPUTE CENTER VIEW
  ══════════════════════════════════════════════════════════════ */
  async function renderDisputesView(container) {
    const disputes = await api.getGrievances();
    const user = api.getUser() || {};
    const isAdmin = user.role === 'ADMIN';

    container.innerHTML = `
      <div class="portal-section-header">
        <div>
          <h2>Grievance & Quality Dispute Center</h2>
          <p class="portal-subtext">File, track, and resolve product quality, quantity shortfall, or logistics delivery disputes</p>
        </div>
      </div>

      ${disputes.length === 0 ? `
        <div class="portal-empty-card">
          <div class="empty-icon">🛡️</div>
          <h3>No Active Dispute Tickets</h3>
          <p>Disputes can be raised directly on active escrow transactions when quality or quantity defects occur.</p>
        </div>
      ` : `
        <div class="disputes-list">
          ${disputes.map(d => `
            <div class="dispute-card">
              <div class="dispute-hdr">
                <div>
                  <span class="dispute-id">Dispute #DISP-${d.id} &bull; Linked Txn: #TX-${d.transaction_id}</span>
                  <h3 class="dispute-title">${d.title}</h3>
                </div>
                <span class="status-pill status-${d.status.toLowerCase()}">${d.status}</span>
              </div>

              <div class="dispute-body">
                <p><strong>Category:</strong> <span class="badge-cat">${d.category}</span></p>
                <p><strong>Raised By:</strong> ${d.raised_by?.full_name || 'User'} (${d.raised_by?.role || 'Party'})</p>
                <p style="margin-top:8px;">${d.description}</p>

                ${d.evidence_images && d.evidence_images.length > 0 ? `
                  <div class="evidence-gallery">
                    <span style="font-size:0.75rem;font-weight:700;display:block;margin-bottom:6px;">Evidence Attachments:</span>
                    <div class="evidence-imgs">
                      ${d.evidence_images.map(img => `<img src="${img}" alt="Evidence" class="evidence-thumb" onclick="window.open('${img}')">`).join('')}
                    </div>
                  </div>
                ` : ''}

                ${d.resolution_notes ? `
                  <div class="resolution-box">
                    <strong>Resolution Decision:</strong>
                    <p>${d.resolution_notes}</p>
                  </div>
                ` : ''}
              </div>

              ${isAdmin && d.status !== 'RESOLVED' && d.status !== 'CLOSED' ? `
                <div class="dispute-admin-action">
                  <button class="portal-btn primary-sm clickable" onclick="window.openResolveDisputeModal(${d.id})">
                    ⚖️ Resolve & Settle Dispute
                  </button>
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>
      `}
    `;
  }

  /* ══════════════════════════════════════════════════════════════
     11. ADMIN USERS & VERIFICATION VIEWS
  ══════════════════════════════════════════════════════════════ */
  async function renderAdminUsersView(container) {
    const users = await api.getUsers();

    container.innerHTML = `
      <div class="portal-section-header">
        <div>
          <h2>User Directory & Access Control</h2>
          <p class="portal-subtext">Manage registered farmers, FPOs, institutional buyers, and logistics providers</p>
        </div>
      </div>

      <div class="portal-table-wrap">
        <table class="portal-table">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Name / Organization</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>State / District</th>
              <th>Status</th>
              <th>Joined Date</th>
            </tr>
          </thead>
          <tbody>
            ${users.map(u => `
              <tr>
                <td>#USR-${u.id}</td>
                <td><strong>${u.full_name}</strong><br><small>${u.company_name || u.fpo_name || ''}</small></td>
                <td>${u.email}</td>
                <td>${u.phone_number}</td>
                <td><span class="role-badge role-${u.role.toLowerCase()}">${u.role}</span></td>
                <td>${u.district}, ${u.state}</td>
                <td><span class="verif-badge verif-${u.verification_status.toLowerCase()}">${u.verification_status}</span></td>
                <td><small>${new Date(u.created_at).toLocaleDateString()}</small></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  async function renderAdminVerificationView(container) {
    const users = await api.getUsers();
    const pendingUsers = users.filter(u => u.verification_status === 'PENDING');

    container.innerHTML = `
      <div class="portal-section-header">
        <div>
          <h2>Institutional Buyer & FPO Verification Queue</h2>
          <p class="portal-subtext">Review enterprise GSTIN credentials and verify onboarding applications</p>
        </div>
      </div>

      ${pendingUsers.length === 0 ? `
        <div class="portal-empty-card">
          <div class="empty-icon">✅</div>
          <h3>Verification Queue Clean</h3>
          <p>There are no pending buyer or FPO verification applications.</p>
        </div>
      ` : `
        <div class="verif-cards-list">
          ${pendingUsers.map(u => `
            <div class="verif-card">
              <div class="verif-card-hdr">
                <div>
                  <span class="role-badge role-${u.role.toLowerCase()}">${u.role}</span>
                  <h3>${u.company_name || u.fpo_name || u.full_name}</h3>
                </div>
                <span class="verif-badge verif-pending">PENDING</span>
              </div>
              <div class="verif-grid">
                <div><span>Contact Person:</span> <strong>${u.full_name}</strong></div>
                <div><span>Email:</span> <strong>${u.email}</strong></div>
                <div><span>Phone:</span> <strong>${u.phone_number}</strong></div>
                <div><span>GSTIN / Reg No:</span> <strong>${u.gstin_or_registration || 'Not Provided'}</strong></div>
                <div><span>Location:</span> <strong>${u.district}, ${u.state} (${u.pincode})</strong></div>
                <div><span>Applied Date:</span> <strong>${new Date(u.created_at).toLocaleString()}</strong></div>
              </div>
              <div class="verif-actions">
                <button class="portal-btn success clickable" onclick="window.adminVerifyAction(${u.id}, 'VERIFIED')">
                  ✅ Approve & Verify Account
                </button>
                <button class="portal-btn danger clickable" onclick="window.adminVerifyAction(${u.id}, 'REJECTED')">
                  ❌ Reject Application
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      `}
    `;
  }

  async function renderAdminProduceView(container) {
    const lots = await api.getMyProduceLots(); // Admin endpoint returns all lots

    container.innerHTML = `
      <div class="portal-section-header">
        <div>
          <h2>All Listed Agricultural Produce Lots</h2>
          <p class="portal-subtext">Platform-wide overview of all active and sold farmer harvest batches</p>
        </div>
      </div>

      <div class="portal-table-wrap">
        <table class="portal-table">
          <thead>
            <tr>
              <th>Lot #</th>
              <th>Crop & Variety</th>
              <th>Farmer / Seller</th>
              <th>Quantity</th>
              <th>Price/kg</th>
              <th>Grade</th>
              <th>Location</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${lots.map(l => `
              <tr>
                <td>#LOT-${l.id}</td>
                <td><strong>${l.crop_name}</strong><br><small>${l.variety || ''}</small></td>
                <td>${l.farmer?.full_name || 'Farmer #' + l.farmer_id}</td>
                <td>${l.quantity_kg.toLocaleString()} kg</td>
                <td><strong>₹${l.price_per_kg_expected}/kg</strong></td>
                <td><span class="produce-grade-badge">${l.grade}</span></td>
                <td>${l.district}, ${l.state}</td>
                <td><span class="status-pill status-${l.status.toLowerCase()}">${l.status}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  async function renderLogisticsShipmentsView(container) {
    await renderTransactionsView(container);
  }

  /* ══════════════════════════════════════════════════════════════
     12. USER PROFILE VIEW
  ══════════════════════════════════════════════════════════════ */
  async function renderProfileView(container) {
    const user = await api.me().catch(() => api.getUser());
    if (!user) return;

    container.innerHTML = `
      <div class="portal-form-wrap">
        <div class="portal-section-header">
          <div>
            <h2>User Profile & Enterprise Settings</h2>
            <p class="portal-subtext">Manage your personal credentials, contact points, and verified business information</p>
          </div>
        </div>

        <div class="profile-header-card">
          <div class="profile-avatar-big">${user.full_name.charAt(0)}</div>
          <div class="profile-hdr-info">
            <h2>${user.full_name}</h2>
            <div class="profile-badges-row">
              <span class="role-badge role-${user.role.toLowerCase()}">${user.role}</span>
              <span class="verif-badge verif-${user.verification_status.toLowerCase()}">${user.verification_status}</span>
            </div>
            <div style="font-size:0.8rem;color:var(--text-lo);margin-top:4px;">Account ID: #USR-${user.id} &bull; Member since ${new Date(user.created_at).toLocaleDateString()}</div>
          </div>
        </div>

        <form id="form-profile" class="portal-form" style="margin-top:20px;">
          <div class="form-row-2">
            <div class="form-field">
              <label for="pf-name">Full Name</label>
              <input type="text" id="pf-name" value="${user.full_name || ''}" required>
            </div>
            <div class="form-field">
              <label for="pf-phone">Phone Number</label>
              <input type="tel" id="pf-phone" value="${user.phone_number || ''}" required>
            </div>
          </div>

          <div class="form-row-2">
            <div class="form-field">
              <label>Email Address</label>
              <input type="email" value="${user.email}" disabled style="opacity:0.6;cursor:not-allowed;">
            </div>
            <div class="form-field">
              <label for="pf-pincode">Pincode</label>
              <input type="text" id="pf-pincode" value="${user.pincode || ''}" required>
            </div>
          </div>

          <div class="form-row-2">
            <div class="form-field">
              <label for="pf-state">State</label>
              <input type="text" id="pf-state" value="${user.state || ''}" required>
            </div>
            <div class="form-field">
              <label for="pf-district">District</label>
              <input type="text" id="pf-district" value="${user.district || ''}" required>
            </div>
          </div>

          ${user.role === 'FPO' ? `
            <div class="form-field">
              <label for="pf-fpo">FPO Organization Name</label>
              <input type="text" id="pf-fpo" value="${user.fpo_name || ''}">
            </div>
          ` : ''}

          ${user.role === 'BUYER' || user.role === 'LOGISTICS' ? `
            <div class="form-field">
              <label for="pf-company">Company / Enterprise Name</label>
              <input type="text" id="pf-company" value="${user.company_name || ''}">
            </div>
          ` : ''}

          <div class="form-error" id="pf-error" aria-live="polite"></div>

          <div class="portal-btns-row" style="margin-top:16px;">
            <button type="submit" class="portal-btn primary clickable" id="pf-submit">
              <span>Save Changes</span>
              <div class="auth-spinner" aria-hidden="true"></div>
            </button>
          </div>
        </form>
      </div>
    `;

    document.getElementById('form-profile')?.addEventListener('submit', async e => {
      e.preventDefault();
      const errEl = document.getElementById('pf-error');
      errEl.textContent = '';
      const btn = document.getElementById('pf-submit');

      const full_name = document.getElementById('pf-name').value.trim();
      const phone_number = document.getElementById('pf-phone').value.trim();
      const pincode = document.getElementById('pf-pincode').value.trim();
      const state = document.getElementById('pf-state').value.trim();
      const district = document.getElementById('pf-district').value.trim();
      const fpo_name = document.getElementById('pf-fpo')?.value.trim() || undefined;
      const company_name = document.getElementById('pf-company')?.value.trim() || undefined;

      btn.disabled = true;
      btn.classList.add('loading');

      try {
        await api.updateProfile({ full_name, phone_number, pincode, state, district, fpo_name, company_name });
        window.showToast?.('Profile updated successfully! ✅');
      } catch (err) {
        errEl.textContent = err.message || 'Failed to update profile.';
      } finally {
        btn.disabled = false;
        btn.classList.remove('loading');
      }
    });
  }

  /* ══════════════════════════════════════════════════════════════
     MODAL DIALOGS & ACTIONS
  ══════════════════════════════════════════════════════════════ */

  // 1. Make Offer Modal (Buyer)
  window.openOfferModal = function (produceId, cropName, expectedPrice, availableQty) {
    const user = api.getUser();
    if (!user) {
      window.openAuthModal && window.openAuthModal('login');
      window.showToast?.('Please sign in as a Buyer to place trade offers.');
      return;
    }

    const modal = document.createElement('div');
    modal.className = 'portal-modal-overlay';
    modal.id = 'modal-offer';
    modal.innerHTML = `
      <div class="portal-modal-box">
        <div class="portal-modal-hdr">
          <h3>Make Trade Offer for ${cropName}</h3>
          <button class="portal-modal-close clickable" onclick="document.getElementById('modal-offer').remove()">&times;</button>
        </div>
        <form id="form-place-offer" class="portal-form" style="margin-top:14px;">
          <div class="form-row-2">
            <div class="form-field">
              <label>Expected Rate</label>
              <input type="text" value="₹ ${expectedPrice} / kg" disabled style="opacity:0.6;">
            </div>
            <div class="form-field">
              <label>Available Quantity</label>
              <input type="text" value="${availableQty.toLocaleString()} kg" disabled style="opacity:0.6;">
            </div>
          </div>

          <div class="form-row-2">
            <div class="form-field">
              <label for="of-price">Your Offered Price (₹ per kg) *</label>
              <input type="number" id="of-price" value="${expectedPrice}" step="any" min="1" required>
            </div>
            <div class="form-field">
              <label for="of-qty">Offered Quantity (kg) *</label>
              <input type="number" id="of-qty" value="${availableQty}" max="${availableQty}" min="1" step="any" required>
            </div>
          </div>

          <div class="form-field">
            <label for="of-msg">Proposal Message</label>
            <textarea id="of-msg" placeholder="e.g. Interested in purchasing full harvest batch with immediate escrow deposit." rows="3"></textarea>
          </div>

          <div class="lot-valuation-box">
            <span>Total Offer Commitment:</span>
            <strong id="of-total-val">₹ ${(expectedPrice * availableQty).toLocaleString()}</strong>
          </div>

          <div class="form-error" id="of-error"></div>

          <div class="portal-btns-row" style="margin-top:14px;">
            <button type="submit" class="portal-btn primary clickable" id="btn-submit-offer">Submit Trade Bid</button>
            <button type="button" class="portal-btn outline clickable" onclick="document.getElementById('modal-offer').remove()">Cancel</button>
          </div>
        </form>
      </div>
    `;
    document.body.appendChild(modal);

    const priceIn = modal.querySelector('#of-price');
    const qtyIn = modal.querySelector('#of-qty');
    const totalDisp = modal.querySelector('#of-total-val');

    function updateOfferVal() {
      const p = parseFloat(priceIn.value) || 0;
      const q = parseFloat(qtyIn.value) || 0;
      totalDisp.textContent = `₹ ${(p * q).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
    }
    priceIn.addEventListener('input', updateOfferVal);
    qtyIn.addEventListener('input', updateOfferVal);

    modal.querySelector('#form-place-offer').addEventListener('submit', async e => {
      e.preventDefault();
      const errEl = modal.querySelector('#of-error');
      errEl.textContent = '';
      const offered_price_per_kg = parseFloat(priceIn.value);
      const offered_quantity_kg = parseFloat(qtyIn.value);
      const message = modal.querySelector('#of-msg').value.trim() || undefined;

      try {
        await api.placeOffer({ produce_lot_id: produceId, offered_price_per_kg, offered_quantity_kg, message });
        modal.remove();
        window.showToast?.('Trade bid submitted successfully! 🎉');
        window.openFeatureView('my-bids');
      } catch (err) {
        errEl.textContent = err.message || 'Failed to place offer.';
      }
    });
  };

  // 2. View Produce Details Modal
  window.viewProduceDetails = async function (lotId) {
    try {
      const lot = await api.getProduceLot(lotId);
      const modal = document.createElement('div');
      modal.className = 'portal-modal-overlay';
      modal.id = 'modal-produce-details';
      const img = (lot.image_urls && lot.image_urls.length > 0) ? lot.image_urls[0] : 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&q=80';

      modal.innerHTML = `
        <div class="portal-modal-box wide">
          <div class="portal-modal-hdr">
            <h3>${lot.crop_name} Produce Batch (#LOT-${lot.id})</h3>
            <button class="portal-modal-close clickable" onclick="document.getElementById('modal-produce-details').remove()">&times;</button>
          </div>
          <div class="produce-details-modal-body">
            <div class="pdm-left">
              <img src="${img}" alt="${lot.crop_name}" class="pdm-main-img">
              ${lot.image_urls && lot.image_urls.length > 1 ? `
                <div class="pdm-gallery">
                  ${lot.image_urls.map(im => `<img src="${im}" alt="Thumbnail" class="pdm-thumb" onclick="document.querySelector('.pdm-main-img').src='${im}'">`).join('')}
                </div>
              ` : ''}
            </div>
            <div class="pdm-right">
              <div style="display:flex;gap:8px;margin-bottom:10px;">
                <span class="produce-grade-badge">${lot.grade}</span>
                <span class="status-pill status-${lot.status.toLowerCase()}">${lot.status}</span>
              </div>
              <h2 style="margin-bottom:6px;">${lot.crop_name} <small style="font-weight:400;font-size:1rem;color:var(--text-lo);">${lot.variety || ''}</small></h2>
              <div class="pdm-price-tag">₹${lot.price_per_kg_expected} <small>/ kg</small> &bull; Total Value: ₹${(lot.quantity_kg * lot.price_per_kg_expected).toLocaleString()}</div>

              <div class="pdm-spec-grid">
                <div><span>Available Quantity:</span> <strong>${lot.quantity_kg.toLocaleString()} kg</strong></div>
                <div><span>Moisture Content:</span> <strong>${lot.moisture_percentage ? lot.moisture_percentage + '%' : 'Standard'}</strong></div>
                <div><span>Harvest Date:</span> <strong>${new Date(lot.harvest_date).toLocaleDateString()}</strong></div>
                <div><span>Expiry / Shelf Life:</span> <strong>${lot.expiry_date ? new Date(lot.expiry_date).toLocaleDateString() : 'N/A'}</strong></div>
                <div><span>Storage Warehouse:</span> <strong>${lot.storage_location}</strong></div>
                <div><span>Origin Mandi / Region:</span> <strong>${lot.district}, ${lot.state}</strong></div>
                <div><span>Farmer / Producer:</span> <strong>${lot.farmer?.full_name || 'Verified Farmer'}</strong></div>
                <div><span>Contact / Phone:</span> <strong>${lot.farmer?.phone_number || 'Protected'}</strong></div>
              </div>

              <div class="portal-btns-row" style="margin-top:20px;">
                ${lot.status === 'AVAILABLE' ? `
                  <button class="portal-btn primary clickable" onclick="document.getElementById('modal-produce-details').remove(); window.openOfferModal(${lot.id}, '${lot.crop_name}', ${lot.price_per_kg_expected}, ${lot.quantity_kg});">
                    Make Trade Offer
                  </button>
                ` : ''}
                <button class="portal-btn outline clickable" onclick="document.getElementById('modal-produce-details').remove()">Close</button>
              </div>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    } catch (e) {
      window.showToast?.(e.message || 'Failed to load produce details.');
    }
  };

  // 3. Respond to Offer (Accept / Reject)
  window.respondOffer = async function (offerId, status) {
    try {
      await api.respondToOffer(offerId, { status });
      window.showToast?.(`Offer #${offerId} ${status.toLowerCase()} successfully! 🎉`);
      if (status === 'ACCEPTED') {
        window.openFeatureView('transactions');
      } else {
        window.openFeatureView('incoming-bids');
      }
    } catch (e) {
      window.showToast?.(e.message || 'Failed to respond to offer.');
    }
  };

  // 4. Update Transaction Escrow Status
  window.updateTxStatus = async function (txId, status, paymentRef = null) {
    try {
      await api.updateTransactionStatus(txId, { status, payment_reference: paymentRef });
      window.showToast?.(`Transaction #TX-${txId} updated to ${status}! ✅`);
      window.openFeatureView('transactions');
    } catch (e) {
      window.showToast?.(e.message || 'Failed to update transaction status.');
    }
  };

  // 5. Deposit Escrow Prompt (Buyer)
  window.depositEscrowPrompt = function (txId) {
    const ref = prompt('Enter payment reference / UPI transaction ID for escrow deposit:', `UPI_REF_${Date.now().toString().slice(-6)}`);
    if (ref) {
      window.updateTxStatus(txId, 'ESCROW_DEPOSITED', ref);
    }
  };

  // 6. File Dispute Modal
  window.openFileDisputeModal = function (txId) {
    const modal = document.createElement('div');
    modal.className = 'portal-modal-overlay';
    modal.id = 'modal-dispute';
    modal.innerHTML = `
      <div class="portal-modal-box">
        <div class="portal-modal-hdr">
          <h3>File Dispute Ticket for Transaction #TX-${txId}</h3>
          <button class="portal-modal-close clickable" onclick="document.getElementById('modal-dispute').remove()">&times;</button>
        </div>
        <form id="form-raise-dispute" class="portal-form" style="margin-top:14px;">
          <div class="form-field">
            <label for="dp-cat">Dispute Category *</label>
            <select id="dp-cat" required>
              <option value="QUALITY_MISMATCH">Quality Mismatch (Moisture / Grade Defect)</option>
              <option value="QUANTITY_DEFICIT">Quantity Deficit / Weight Shortfall</option>
              <option value="DAMAGE">Transit Damage / Spoilage</option>
              <option value="LOGISTICS_DELAY">Severe Logistics & Delivery Delay</option>
              <option value="PAYMENT_DISPUTE">Escrow / Payment Discrepancy</option>
              <option value="OTHER">Other Grievance</option>
            </select>
          </div>

          <div class="form-field">
            <label for="dp-title">Dispute Title / Summary *</label>
            <input type="text" id="dp-title" placeholder="e.g. Moisture level exceeded 16% upon delivery batch inspection" required>
          </div>

          <div class="form-field">
            <label for="dp-desc">Detailed Description of Defect *</label>
            <textarea id="dp-desc" rows="4" placeholder="Provide complete evidence details and observations..." required></textarea>
          </div>

          <div class="form-field">
            <label for="dp-img">Evidence Image Link (Optional)</label>
            <input type="url" id="dp-img" placeholder="https://images.unsplash.com/photo-...">
          </div>

          <div class="form-error" id="dp-error"></div>

          <div class="portal-btns-row" style="margin-top:14px;">
            <button type="submit" class="portal-btn danger clickable">Submit Dispute to Ministry Admin</button>
            <button type="button" class="portal-btn outline clickable" onclick="document.getElementById('modal-dispute').remove()">Cancel</button>
          </div>
        </form>
      </div>
    `;
    document.body.appendChild(modal);

    modal.querySelector('#form-raise-dispute').addEventListener('submit', async e => {
      e.preventDefault();
      const category = modal.querySelector('#dp-cat').value;
      const title = modal.querySelector('#dp-title').value.trim();
      const description = modal.querySelector('#dp-desc').value.trim();
      const imgLink = modal.querySelector('#dp-img').value.trim();
      const evidence_images = imgLink ? [imgLink] : [];

      try {
        await api.createGrievance({ transaction_id: txId, category, title, description, evidence_images });
        modal.remove();
        window.showToast?.('Dispute ticket raised. Escrow frozen pending admin review! ⚠️');
        window.openFeatureView('disputes');
      } catch (err) {
        modal.querySelector('#dp-error').textContent = err.message || 'Failed to submit dispute.';
      }
    });
  };

  // 7. Resolve Dispute Modal (Admin)
  window.openResolveDisputeModal = function (disputeId) {
    const modal = document.createElement('div');
    modal.className = 'portal-modal-overlay';
    modal.id = 'modal-resolve';
    modal.innerHTML = `
      <div class="portal-modal-box">
        <div class="portal-modal-hdr">
          <h3>Resolve Dispute Ticket #DISP-${disputeId}</h3>
          <button class="portal-modal-close clickable" onclick="document.getElementById('modal-resolve').remove()">&times;</button>
        </div>
        <form id="form-resolve-dispute" class="portal-form" style="margin-top:14px;">
          <div class="form-field">
            <label for="rd-status">Resolution Decision *</label>
            <select id="rd-status" required>
              <option value="RESOLVED">Resolved (Escrow Settled)</option>
              <option value="CLOSED">Closed (Dispute Dismissed)</option>
            </select>
          </div>

          <div class="form-field">
            <label for="rd-notes">Resolution Notes & Findings *</label>
            <textarea id="rd-notes" rows="4" placeholder="Enter findings, inspection report notes, and final escrow decision..." required></textarea>
          </div>

          <div class="form-error" id="rd-error"></div>

          <div class="portal-btns-row" style="margin-top:14px;">
            <button type="submit" class="portal-btn primary clickable">Submit Official Resolution</button>
            <button type="button" class="portal-btn outline clickable" onclick="document.getElementById('modal-resolve').remove()">Cancel</button>
          </div>
        </form>
      </div>
    `;
    document.body.appendChild(modal);

    modal.querySelector('#form-resolve-dispute').addEventListener('submit', async e => {
      e.preventDefault();
      const status = modal.querySelector('#rd-status').value;
      const resolution_notes = modal.querySelector('#rd-notes').value.trim();

      try {
        await api.resolveGrievance(disputeId, { status, resolution_notes });
        modal.remove();
        window.showToast?.('Dispute resolved successfully! ✅');
        window.openFeatureView('disputes');
      } catch (err) {
        modal.querySelector('#rd-error').textContent = err.message || 'Failed to resolve dispute.';
      }
    });
  };

  // 8. Admin Verification Actions
  window.adminVerifyAction = async function (userId, status) {
    try {
      await api.verifyUser(userId, status);
      window.showToast?.(`User #${userId} marked as ${status}! ✅`);
      window.openFeatureView('verification');
    } catch (e) {
      window.showToast?.(e.message || 'Failed to update verification status.');
    }
  };

  window.quickApproveUser = async function (userId) {
    window.adminVerifyAction(userId, 'VERIFIED');
  };

  // 9. Edit Produce Quick Prompt
  window.editProducePrompt = async function (lotId, currentPrice, currentQty) {
    const newPrice = prompt(`Update price per kg for Lot #${lotId} (current: ₹${currentPrice}/kg):`, currentPrice);
    if (!newPrice) return;
    const p = parseFloat(newPrice);
    if (isNaN(p) || p <= 0) { alert('Invalid price'); return; }

    try {
      await api.updateProduceLot(lotId, { price_per_kg_expected: p });
      window.showToast?.('Produce price updated! ✅');
      window.openFeatureView('my-listings');
    } catch (e) {
      window.showToast?.(e.message || 'Failed to update produce.');
    }
  };

  /* ══════════════════════════════════════════════════════════════
     INIT PORTAL & HOOK TOP-RIGHT MENU
  ══════════════════════════════════════════════════════════════ */
  document.addEventListener('DOMContentLoaded', () => {
    // Inject Drawer Render Listener
    renderFeatureMenu();

    // Hook top-right user menu button (when logged in)
    const navUserMenu = document.getElementById('nav-user-menu');
    if (navUserMenu) {
      navUserMenu.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleDrawer();
      });
    }

    // Hook overlay click to close drawer
    document.getElementById('drawer-overlay')?.addEventListener('click', closeDrawer);

    // Escape key closes drawer
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeDrawer();
    });

    // Expose global methods
    window.openFeatureView = openFeatureView;
    window.closeFeatureView = closeFeatureView;
    window.renderFeatureMenu = renderFeatureMenu;
    window.openDrawer = openDrawer;
    window.closeDrawer = closeDrawer;
    window.toggleDrawer = toggleDrawer;
  });

})();
