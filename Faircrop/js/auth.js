/**
 * FairCrop Auth Modal & State Handler
 * Handles Login / Register / Role Switching / Demo Logins
 */

'use strict';

(function () {

  /* ─── Inject Modal HTML ─────────────────────────────────── */
  function injectModal() {
    if (document.getElementById('auth-modal')) return;

    const modal = document.createElement('div');
    modal.id = 'auth-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', 'FairCrop Sign In / Register');
    modal.innerHTML = `
      <div class="auth-backdrop" id="auth-backdrop"></div>
      <div class="auth-box">
        <!-- Header -->
        <div class="auth-hdr">
          <div class="auth-logo">
            <span class="nb-fai">Fai</span><span class="nb-rc">rC</span><span class="nb-rop">rop</span>
          </div>
          <button class="auth-close clickable" id="auth-close" aria-label="Close">&times;</button>
        </div>

        <!-- Quick Demo Switcher Strip for Testers / Judges -->
        <div class="auth-demo-strip">
          <span class="demo-label">Quick Demo Access:</span>
          <div class="demo-btns">
            <button type="button" class="demo-chip clickable" data-demo="farmer">🌱 Farmer</button>
            <button type="button" class="demo-chip clickable" data-demo="buyer">🏢 Buyer</button>
            <button type="button" class="demo-chip clickable" data-demo="fpo">👥 FPO</button>
            <button type="button" class="demo-chip clickable" data-demo="logistics">🚚 Logistics</button>
            <button type="button" class="demo-chip clickable" data-demo="admin">🏛️ Admin</button>
          </div>
        </div>

        <!-- Tabs -->
        <div class="auth-tabs">
          <button class="auth-tab active clickable" id="tab-login" data-tab="login">Sign In</button>
          <button class="auth-tab clickable" id="tab-reg" data-tab="register">Create Account</button>
        </div>

        <!-- Login Form -->
        <form class="auth-form active" id="form-login" autocomplete="on" novalidate>
          <div class="auth-field">
            <label for="l-username">Email or Phone Number</label>
            <input type="text" id="l-username" name="username" placeholder="farmer@faircrop.in or 9876543210" required autocomplete="username">
          </div>
          <div class="auth-field">
            <label for="l-password">Password</label>
            <div class="auth-pw-wrap">
              <input type="password" id="l-password" name="password" placeholder="••••••••" required autocomplete="current-password">
              <button type="button" class="auth-eye clickable" data-target="l-password" aria-label="Toggle password visibility">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              </button>
            </div>
          </div>
          <div class="auth-error" id="login-error" aria-live="polite"></div>
          <button type="submit" class="auth-submit clickable" id="login-submit">
            <span class="auth-submit-text">Sign In</span>
            <span class="auth-spinner" aria-hidden="true"></span>
          </button>
          <p class="auth-switch">New to FairCrop? <a href="#" id="sw-to-reg" class="clickable">Create free account</a></p>
        </form>

        <!-- Register Form -->
        <form class="auth-form" id="form-register" autocomplete="on" novalidate>
          <div class="auth-row-2">
            <div class="auth-field">
              <label for="r-name">Full Name / Entity Name *</label>
              <input type="text" id="r-name" placeholder="Ramesh Singh" required autocomplete="name">
            </div>
            <div class="auth-field">
              <label for="r-role">Role *</label>
              <select id="r-role" required>
                <option value="FARMER">Farmer / Kisaan (Auto-Verified)</option>
                <option value="FPO">FPO / Farmer Producer Org</option>
                <option value="BUYER">Institutional Buyer / Agribusiness</option>
                <option value="LOGISTICS">Logistics & Supply Chain</option>
                <option value="ADMIN">Ministry Administrator (Admin)</option>
              </select>
            </div>
          </div>

          <div class="auth-row-2">
            <div class="auth-field">
              <label for="r-email">Email Address *</label>
              <input type="email" id="r-email" placeholder="farmer@faircrop.in" required autocomplete="email">
            </div>
            <div class="auth-field">
              <label for="r-phone">Mobile Phone *</label>
              <input type="tel" id="r-phone" placeholder="9876543210" required autocomplete="tel" maxlength="10">
            </div>
          </div>

          <!-- Dynamic Role Fields -->
          <div id="dynamic-role-fields" style="display:none;" class="auth-dynamic-box">
            <div class="auth-row-2">
              <div class="auth-field" id="fld-fpo-name" style="display:none;">
                <label for="r-fpo-name">FPO Name</label>
                <input type="text" id="r-fpo-name" placeholder="Kisan Vikas Agro Producer Co.">
              </div>
              <div class="auth-field" id="fld-company-name" style="display:none;">
                <label for="r-company-name">Company / Entity Name</label>
                <input type="text" id="r-company-name" placeholder="AgroCorp Processing Ltd">
              </div>
              <div class="auth-field" id="fld-gstin" style="display:none;">
                <label for="r-gstin">GST / Registration No.</label>
                <input type="text" id="r-gstin" placeholder="06AAACA1234A1Z9">
              </div>
            </div>
          </div>

          <div class="auth-field">
            <label for="r-password">Create Password (Min 6 chars) *</label>
            <div class="auth-pw-wrap">
              <input type="password" id="r-password" placeholder="Create strong password" required autocomplete="new-password" minlength="6">
              <button type="button" class="auth-eye clickable" data-target="r-password" aria-label="Toggle password visibility">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              </button>
            </div>
          </div>

          <div class="auth-row-2">
            <div class="auth-field">
              <label for="r-state">State *</label>
              <input type="text" id="r-state" placeholder="Punjab" required>
            </div>
            <div class="auth-field">
              <label for="r-district">District *</label>
              <input type="text" id="r-district" placeholder="Ludhiana" required>
            </div>
          </div>

          <div class="auth-row-3">
            <div class="auth-field">
              <label for="r-subdistrict">Sub-District / Tehsil</label>
              <input type="text" id="r-subdistrict" placeholder="Ludhiana East">
            </div>
            <div class="auth-field">
              <label for="r-village">Village</label>
              <input type="text" id="r-village" placeholder="Gill">
            </div>
            <div class="auth-field">
              <label for="r-pincode">Pincode *</label>
              <input type="text" id="r-pincode" placeholder="141001" required maxlength="6" pattern="[0-9]{6}">
            </div>
          </div>

          <div class="auth-error" id="reg-error" aria-live="polite"></div>
          <button type="submit" class="auth-submit clickable" id="reg-submit">
            <span class="auth-submit-text">Register Account</span>
            <span class="auth-spinner" aria-hidden="true"></span>
          </button>
          <p class="auth-switch">Already registered? <a href="#" id="sw-to-login" class="clickable">Sign in</a></p>
        </form>

      </div><!-- /auth-box -->
    `;
    document.body.appendChild(modal);

    // Setup dynamic role change listener
    const roleSelect = document.getElementById('r-role');
    if (roleSelect) {
      roleSelect.addEventListener('change', () => updateRoleFields(roleSelect.value));
      updateRoleFields(roleSelect.value);
    }
  }

  function updateRoleFields(role) {
    const dynBox = document.getElementById('dynamic-role-fields');
    const fldFpo = document.getElementById('fld-fpo-name');
    const fldComp = document.getElementById('fld-company-name');
    const fldGst = document.getElementById('fld-gstin');

    if (!dynBox) return;

    if (role === 'FPO') {
      dynBox.style.display = 'block';
      if (fldFpo) fldFpo.style.display = 'flex';
      if (fldComp) fldComp.style.display = 'none';
      if (fldGst) fldGst.style.display = 'flex';
    } else if (role === 'BUYER' || role === 'LOGISTICS') {
      dynBox.style.display = 'block';
      if (fldFpo) fldFpo.style.display = 'none';
      if (fldComp) fldComp.style.display = 'flex';
      if (fldGst) fldGst.style.display = 'flex';
    } else {
      dynBox.style.display = 'none';
      if (fldFpo) fldFpo.style.display = 'none';
      if (fldComp) fldComp.style.display = 'none';
      if (fldGst) fldGst.style.display = 'none';
    }
  }

  /* ─── Inject Styles ─────────────────────────────────────── */
  function injectStyles() {
    if (document.getElementById('auth-styles')) return;
    const s = document.createElement('style');
    s.id = 'auth-styles';
    s.textContent = `
      #auth-modal { display:none; position:fixed; inset:0; z-index:99000; align-items:center; justify-content:center; }
      #auth-modal.open { display:flex; }
      .auth-backdrop { position:absolute; inset:0; background:rgba(0,0,0,0.76); backdrop-filter:blur(8px); }
      .auth-box {
        position:relative; z-index:1; width:min(540px,95vw);
        background:linear-gradient(145deg,rgba(15,17,28,0.98) 0%,rgba(20,24,40,0.99) 100%);
        border:1px solid rgba(255,255,255,0.12); border-radius:16px;
        padding:28px 32px 24px;
        box-shadow:0 32px 80px rgba(0,0,0,0.75), inset 0 1px 0 rgba(255,255,255,0.08);
        animation: authPop .28s cubic-bezier(.34,1.56,.64,1);
        max-height:92vh; overflow-y:auto;
      }
      @keyframes authPop { from{opacity:0;transform:scale(.92) translateY(16px)} to{opacity:1;transform:scale(1) translateY(0)} }
      [data-theme="light"] .auth-box {
        background:linear-gradient(145deg,#ffffff 0%,#f0f4f8 100%);
        border:1px solid rgba(0,0,0,0.1);
        box-shadow:0 24px 60px rgba(0,0,0,0.18);
      }
      .auth-hdr { display:flex; align-items:center; justify-content:space-between; margin-bottom:14px; }
      .auth-logo { font-family:'Source Sans 3',sans-serif; font-size:1.6rem; font-weight:900; letter-spacing:-1px; }
      .auth-logo .nb-fai { color:#FF6B00; }
      .auth-logo .nb-rc  { color:#FFFFFF; -webkit-text-stroke:0.8px rgba(0,0,0,0.6); }
      .auth-logo .nb-rop { color:#1FAD09; }
      [data-theme="light"] .auth-logo .nb-rc { -webkit-text-stroke:0.8px #334155; }
      .auth-close {
        background:rgba(255,255,255,0.08); border:none; color:rgba(255,255,255,0.7);
        width:30px; height:30px; border-radius:50%; font-size:1.2rem; line-height:1;
        display:flex; align-items:center; justify-content:center;
        transition:background .2s, color .2s;
      }
      .auth-close:hover { background:rgba(255,107,0,0.3); color:#fff; }
      [data-theme="light"] .auth-close { color:#334155; background:rgba(0,0,0,0.07); }

      /* Demo Chip Strip */
      .auth-demo-strip {
        background:rgba(255,107,0,0.08); border:1px dashed rgba(255,107,0,0.3);
        border-radius:8px; padding:8px 12px; margin-bottom:16px;
        display:flex; flex-direction:column; gap:6px;
      }
      .demo-label { font-size:0.7rem; font-weight:700; color:var(--saffron); text-transform:uppercase; letter-spacing:0.5px; }
      .demo-btns { display:flex; flex-wrap:wrap; gap:6px; }
      .demo-chip {
        background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.12);
        color:var(--text-hi); font-size:0.75rem; font-weight:600; padding:4px 8px; border-radius:4px;
        transition:background 0.18s, border-color 0.18s, transform 0.14s;
      }
      .demo-chip:hover {
        background:rgba(255,107,0,0.22); border-color:var(--saffron); color:#fff;
        transform:translateY(-1px);
      }
      [data-theme="light"] .demo-chip {
        background:#ffffff; border-color:rgba(0,0,0,0.12); color:#0f172a;
      }

      .auth-tabs { display:flex; gap:4px; background:rgba(255,255,255,0.06); border-radius:8px; padding:4px; margin-bottom:18px; }
      [data-theme="light"] .auth-tabs { background:rgba(0,0,0,0.06); }
      .auth-tab {
        flex:1; padding:8px; border:none; border-radius:6px; font-size:.85rem; font-weight:600;
        color:rgba(255,255,255,0.55); background:transparent; transition:background .2s, color .2s;
        font-family:'Inter',sans-serif;
      }
      [data-theme="light"] .auth-tab { color:rgba(0,0,0,0.4); }
      .auth-tab.active { background:rgba(255,107,0,0.88); color:#fff; box-shadow:0 2px 10px rgba(255,107,0,0.4); }
      [data-theme="light"] .auth-tab.active { background:#FF6B00; }

      .auth-form { display:none; flex-direction:column; gap:12px; }
      .auth-form.active { display:flex; }
      .auth-field { display:flex; flex-direction:column; gap:4px; }
      .auth-field label { font-size:.73rem; font-weight:600; color:rgba(255,255,255,0.6); letter-spacing:.3px; text-transform:uppercase; }
      [data-theme="light"] .auth-field label { color:#475569; }
      .auth-field input, .auth-field select {
        background:rgba(255,255,255,0.07); border:1px solid rgba(255,255,255,0.14);
        border-radius:6px; padding:9px 12px; color:#fff; font-size:.88rem;
        font-family:'Inter',sans-serif; outline:none; transition:border-color .2s, box-shadow .2s;
      }
      [data-theme="light"] .auth-field input, [data-theme="light"] .auth-field select {
        background:#f8fafc; border:1px solid rgba(0,0,0,0.12); color:#0f172a;
      }
      .auth-field input:focus, .auth-field select:focus { border-color:#FF6B00; box-shadow:0 0 0 3px rgba(255,107,0,0.18); }
      .auth-field input::placeholder { color:rgba(255,255,255,0.28); }
      [data-theme="light"] .auth-field input::placeholder { color:#94a3b8; }
      .auth-field select option { background:#1a1d2e; color:#fff; }
      [data-theme="light"] .auth-field select option { background:#fff; color:#0f172a; }

      .auth-row-2 { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
      .auth-row-3 { display:grid; grid-template-columns:1fr 1fr 1fr; gap:8px; }
      .auth-pw-wrap { position:relative; }
      .auth-pw-wrap input { width:100%; padding-right:38px; }
      .auth-eye { position:absolute; right:10px; top:50%; transform:translateY(-50%); background:none; border:none; color:rgba(255,255,255,0.4); transition:color .2s; padding:2px; }
      .auth-eye:hover { color:#FF6B00; }
      [data-theme="light"] .auth-eye { color:#94a3b8; }

      .auth-dynamic-box {
        background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.07);
        border-radius:6px; padding:10px; margin-top:2px;
      }

      .auth-submit {
        padding:11px; border:none; border-radius:7px; font-size:.92rem; font-weight:700;
        background:linear-gradient(135deg,#FF6B00,#FF9E45); color:#fff;
        box-shadow:0 4px 16px rgba(255,107,0,0.45); cursor:pointer;
        display:flex; align-items:center; justify-content:center; gap:10px;
        transition:transform .18s, box-shadow .18s; position:relative; margin-top:4px;
        font-family:'Inter',sans-serif;
      }
      .auth-submit:hover { transform:translateY(-1px); box-shadow:0 8px 22px rgba(255,107,0,0.55); }
      .auth-submit:disabled { opacity:.65; pointer-events:none; }
      .auth-spinner { width:15px; height:15px; border:2px solid rgba(255,255,255,0.3); border-top-color:#fff; border-radius:50%; animation:fcSpin .7s linear infinite; display:none; }
      .auth-submit.loading .auth-spinner { display:block; }
      .auth-submit.loading .auth-submit-text { opacity:.5; }
      @keyframes fcSpin { to { transform:rotate(360deg); } }
      .auth-error { min-height:18px; font-size:.78rem; color:#f87171; font-weight:500; text-align:center; }
      .auth-switch { text-align:center; font-size:.8rem; color:rgba(255,255,255,0.45); margin-top:2px; }
      [data-theme="light"] .auth-switch { color:#64748b; }
      .auth-switch a { color:#FF6B00; font-weight:600; text-decoration:none; }
      .auth-switch a:hover { text-decoration:underline; }

      @media (max-width: 540px) {
        .auth-row-2, .auth-row-3 { grid-template-columns:1fr; gap:10px; }
      }
    `;
    document.head.appendChild(s);
  }

  /* ─── Open / Close ──────────────────────────────────────── */
  function openModal(tab = 'login') {
    const m = document.getElementById('auth-modal');
    if (!m) return;
    m.classList.add('open');
    showTab(tab);
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    const m = document.getElementById('auth-modal');
    if (!m) return;
    m.classList.remove('open');
    document.body.style.overflow = '';
  }

  function showTab(tab) {
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
    document.getElementById('form-login')?.classList.toggle('active', tab === 'login');
    document.getElementById('form-register')?.classList.toggle('active', tab === 'register');
  }

  function setLoading(btn, on) {
    if (!btn) return;
    btn.disabled = on;
    btn.classList.toggle('loading', on);
  }

  function showError(id, msg) {
    const el = document.getElementById(id);
    if (el) el.textContent = msg;
  }

  /* ─── Nav Sync ──────────────────────────────────────────── */
  function syncNav(user) {
    const loginBtn  = document.getElementById('login-btn');
    const userMenu  = document.getElementById('nav-user-menu');
    const userName  = document.getElementById('nav-user-name');

    if (user) {
      if (loginBtn)  loginBtn.style.display  = 'none';
      if (userMenu)  userMenu.style.display  = 'flex';
      if (userName) {
        const shortName = user.full_name?.split(' ')[0] || user.role || 'User';
        const isPending = user.verification_status === 'PENDING';
        userName.innerHTML = `${shortName} <span class="nav-role-badge ${isPending ? 'pending' : ''}">${user.role}${isPending ? ' (Pending)' : ''}</span>`;
      }
    } else {
      if (loginBtn)  loginBtn.style.display  = '';
      if (userMenu)  userMenu.style.display  = 'none';
    }

    // Also update feature drawer if open
    window.renderFeatureMenu && window.renderFeatureMenu();
  }

  /* ─── Preset Demo Credentials ───────────────────────────── */
  const DEMO_CREDS = {
    farmer:    { user: 'farmer@faircrop.in',    pass: 'farmer123' },
    buyer:     { user: 'buyer@faircrop.in',     pass: 'buyer123' },
    fpo:       { user: 'fpo@faircrop.in',       pass: 'fpo123' },
    logistics: { user: 'logistics@faircrop.in', pass: 'logistics123' },
    admin:     { user: 'admin@faircrop.in',     pass: 'admin123' },
  };

  /* ─── Init ──────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    injectStyles();
    injectModal();

    const api = window.FairCropAPI;

    // Login button in nav
    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) loginBtn.addEventListener('click', () => openModal('login'));

    // Close triggers
    document.getElementById('auth-close')?.addEventListener('click', closeModal);
    document.getElementById('auth-backdrop')?.addEventListener('click', closeModal);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

    // Tab switching
    document.getElementById('tab-login')?.addEventListener('click', () => showTab('login'));
    document.getElementById('tab-reg')?.addEventListener('click', () => showTab('register'));
    document.getElementById('sw-to-reg')?.addEventListener('click', e => { e.preventDefault(); showTab('register'); });
    document.getElementById('sw-to-login')?.addEventListener('click', e => { e.preventDefault(); showTab('login'); });

    // Demo Chips
    document.querySelectorAll('.demo-chip').forEach(btn => {
      btn.addEventListener('click', async () => {
        const key = btn.dataset.demo;
        const cred = DEMO_CREDS[key];
        if (!cred) return;
        document.getElementById('l-username').value = cred.user;
        document.getElementById('l-password').value = cred.pass;
        showTab('login');
        // Auto trigger submit
        document.getElementById('login-submit')?.click();
      });
    });

    // Password eye toggles
    document.querySelectorAll('.auth-eye').forEach(btn => {
      btn.addEventListener('click', () => {
        const input = document.getElementById(btn.dataset.target);
        if (input) input.type = input.type === 'password' ? 'text' : 'password';
      });
    });

    // ── Login Submit ──
    document.getElementById('form-login')?.addEventListener('submit', async e => {
      e.preventDefault();
      showError('login-error', '');
      const btn = document.getElementById('login-submit');
      const username = document.getElementById('l-username').value.trim();
      const password = document.getElementById('l-password').value;
      if (!username || !password) { showError('login-error', 'Please fill in both username and password.'); return; }
      setLoading(btn, true);
      try {
        const data = await api.login(username, password);
        syncNav(data.user);
        closeModal();
        window.showToast?.(`Welcome, ${data.user?.full_name?.split(' ')[0] || data.user?.role}! 🌾`);
        // If an active app view is waiting, open dashboard or default view
        if (window.openFeatureView) {
          window.openFeatureView('dashboard');
        }
      } catch (err) {
        showError('login-error', err.offline
          ? '⚠️ Backend is offline. Start the server with: python backend/run.py'
          : err.message || 'Login failed. Check credentials.');
      } finally {
        setLoading(btn, false);
      }
    });

    // ── Register Submit ──
    document.getElementById('form-register')?.addEventListener('submit', async e => {
      e.preventDefault();
      showError('reg-error', '');
      const btn = document.getElementById('reg-submit');
      const full_name    = document.getElementById('r-name').value.trim();
      const role         = document.getElementById('r-role').value;
      const email        = document.getElementById('r-email').value.trim();
      const phone_number = document.getElementById('r-phone').value.trim();
      const password     = document.getElementById('r-password').value;
      const state        = document.getElementById('r-state').value.trim();
      const district     = document.getElementById('r-district').value.trim();
      const sub_district = document.getElementById('r-subdistrict')?.value.trim() || null;
      const village      = document.getElementById('r-village')?.value.trim() || null;
      const pincode      = document.getElementById('r-pincode').value.trim();

      const fpo_name     = document.getElementById('r-fpo-name')?.value.trim() || null;
      const company_name = document.getElementById('r-company-name')?.value.trim() || null;
      const gstin_or_registration = document.getElementById('r-gstin')?.value.trim() || null;

      if (!full_name || !email || !phone_number || !password || !state || !district || !pincode) {
        showError('reg-error', 'Please fill in all required fields.'); return;
      }
      if (password.length < 6) { showError('reg-error', 'Password must be at least 6 characters.'); return; }
      if (!/^\d{6}$/.test(pincode)) { showError('reg-error', 'Pincode must be 6 digits.'); return; }

      setLoading(btn, true);
      try {
        const payload = {
          full_name, email, phone_number, password, role,
          state, district, sub_district, village, pincode,
          fpo_name, company_name, gstin_or_registration
        };
        await api.register(payload);
        // Auto-login after registration
        const loginData = await api.login(email, password);
        syncNav(loginData.user);
        closeModal();
        window.showToast?.(`Account created successfully! Welcome, ${loginData.user?.full_name?.split(' ')[0]} 🎉`);
        if (window.openFeatureView) {
          window.openFeatureView('dashboard');
        }
      } catch (err) {
        showError('reg-error', err.offline
          ? '⚠️ Backend is offline. Start the server with: python backend/run.py'
          : err.message || 'Registration failed. Please verify all details.');
      } finally {
        setLoading(btn, false);
      }
    });

    // ── Logout Button ──
    document.getElementById('nav-logout-btn')?.addEventListener('click', () => {
      api.logout();
      window.showToast?.('Logged out successfully.');
      if (window.closeFeatureView) window.closeFeatureView();
    });

    // ── Listen for auth events ──
    window.addEventListener('fc:login',  e => syncNav(e.detail));
    window.addEventListener('fc:logout', () => syncNav(null));

    // ── Restore session on initial page load ──
    if (api.isLoggedIn()) {
      syncNav(api.getUser());
      api.me().then(u => { if (u) syncNav(u); }).catch(() => {});
    }

    // Expose openAuthModal globally
    window.openAuthModal = openModal;
  });

})();
