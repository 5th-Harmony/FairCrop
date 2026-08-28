/**
 * FairCrop API Client
 * Handles all communication with the FastAPI backend (http://localhost:8001/api/v1)
 * Manages JWT token storage, auth headers, and graceful error handling.
 */

'use strict';

(function () {

  const BASE_URL   = 'http://localhost:8001/api/v1';
  const TOKEN_KEY  = 'fc_token';
  const USER_KEY   = 'fc_user';

  /* ── Token & Storage Helpers ────────────────────────────── */
  function getToken()       { return localStorage.getItem(TOKEN_KEY); }
  function setToken(t)      { localStorage.setItem(TOKEN_KEY, t); }
  function clearToken()     { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(USER_KEY); }
  function getUser()        { try { return JSON.parse(localStorage.getItem(USER_KEY)); } catch { return null; } }
  function setUser(u)       { localStorage.setItem(USER_KEY, JSON.stringify(u)); }
  function isLoggedIn()     { return !!getToken(); }

  function authHeaders() {
    const t = getToken();
    const headers = { 'Content-Type': 'application/json' };
    if (t) headers['Authorization'] = `Bearer ${t}`;
    return headers;
  }

  /* ── Core Fetch Wrapper ─────────────────────────────────── */
  async function request(method, path, body = null, signal = null) {
    const opts = {
      method,
      headers: authHeaders(),
      signal,
    };
    if (body) opts.body = JSON.stringify(body);

    try {
      const res = await fetch(`${BASE_URL}${path}`, opts);
      if (res.status === 401) {
        clearToken();
        window.dispatchEvent(new Event('fc:logout'));
      }
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: res.statusText }));
        let msg = err.detail || `HTTP ${res.status}`;
        if (Array.isArray(msg)) {
          msg = msg.map(m => m.msg || m.message || JSON.stringify(m)).join(', ');
        } else if (typeof msg === 'object') {
          msg = JSON.stringify(msg);
        }
        throw new Error(msg);
      }
      return await res.json();
    } catch (e) {
      if (e.name === 'AbortError') throw e;
      if (e.message && (e.message.includes('Failed to fetch') || e.message.includes('NetworkError') || e.message.includes('fetch'))) {
        const offline = new Error('Backend server is offline. Please run python backend/run.py');
        offline.offline = true;
        throw offline;
      }
      throw e;
    }
  }

  /* ── 1. Auth & Users Endpoints ──────────────────────────── */
  async function register(data) {
    return request('POST', '/auth/register', data);
  }

  async function login(username, password) {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: 'Login failed' }));
        let msg = err.detail || 'Login failed';
        if (Array.isArray(msg)) msg = msg.map(m => m.msg || JSON.stringify(m)).join(', ');
        throw new Error(msg);
      }
      const data = await res.json();
      setToken(data.access_token);
      setUser(data.user);
      window.dispatchEvent(new CustomEvent('fc:login', { detail: data.user }));
      return data;
    } catch (e) {
      if (e.message && (e.message.includes('Failed to fetch') || e.message.includes('NetworkError'))) {
        const offline = new Error('Backend server is offline. Start the server first.');
        offline.offline = true;
        throw offline;
      }
      throw e;
    }
  }

  async function me() {
    const user = await request('GET', '/auth/me');
    if (user) setUser(user);
    return user;
  }

  async function updateProfile(data) {
    const user = await request('PUT', '/users/me', data);
    if (user) setUser(user);
    return user;
  }

  async function getUsers({ role, verification_status, skip = 0, limit = 50 } = {}) {
    const p = new URLSearchParams({ skip, limit });
    if (role) p.set('role', role);
    if (verification_status) p.set('verification_status', verification_status);
    return request('GET', `/users/?${p}`);
  }

  async function verifyUser(userId, verification_status) {
    return request('PUT', `/auth/users/${userId}/verify`, { verification_status });
  }

  function logout() {
    clearToken();
    window.dispatchEvent(new Event('fc:logout'));
  }

  /* ── 2. Produce Management (Farmer / FPO) ───────────────── */
  async function createProduceLot(data) {
    return request('POST', '/produce/', data);
  }

  async function getMyProduceLots() {
    return request('GET', '/produce/my-lots');
  }

  async function getProduceLot(lotId) {
    return request('GET', `/produce/${lotId}`);
  }

  async function updateProduceLot(lotId, data) {
    return request('PUT', `/produce/${lotId}`, data);
  }

  /* ── 3. Marketplace & Smart Matchmaking ─────────────────── */
  async function getMarketplaceLots({ crop_name, state, district, min_quantity_kg, max_price_per_kg, grade, skip = 0, limit = 50 } = {}) {
    const p = new URLSearchParams({ skip, limit });
    if (crop_name)        p.set('crop_name', crop_name);
    if (state)            p.set('state', state);
    if (district)         p.set('district', district);
    if (min_quantity_kg)  p.set('min_quantity_kg', min_quantity_kg);
    if (max_price_per_kg) p.set('max_price_per_kg', max_price_per_kg);
    if (grade)            p.set('grade', grade);
    return request('GET', `/marketplace/lots?${p}`);
  }

  async function getMatchmaking({ crop_name, desired_min_qty, desired_max_price, preferred_grade, preferred_state }) {
    const p = new URLSearchParams({ crop_name });
    if (desired_min_qty)   p.set('desired_min_qty', desired_min_qty);
    if (desired_max_price) p.set('desired_max_price', desired_max_price);
    if (preferred_grade)   p.set('preferred_grade', preferred_grade);
    if (preferred_state)   p.set('preferred_state', preferred_state);
    return request('GET', `/marketplace/matchmaking?${p}`);
  }

  /* ── 4. Offers & Bids ────────────────────────────────────── */
  async function placeOffer(data) {
    return request('POST', '/marketplace/offers', data);
  }

  async function getIncomingOffers() {
    return request('GET', '/marketplace/offers/incoming');
  }

  async function getMyBids() {
    return request('GET', '/marketplace/offers/my-bids');
  }

  async function respondToOffer(offerId, { status, offered_price_per_kg, offered_quantity_kg }) {
    const payload = { status };
    if (offered_price_per_kg)  payload.offered_price_per_kg = offered_price_per_kg;
    if (offered_quantity_kg) payload.offered_quantity_kg = offered_quantity_kg;
    return request('PUT', `/marketplace/offers/${offerId}/respond`, payload);
  }

  /* ── 5. Transactions & Escrow ────────────────────────────── */
  async function getTransactions() {
    return request('GET', '/transactions/');
  }

  async function getTransaction(id) {
    return request('GET', `/transactions/${id}`);
  }

  async function updateTransactionStatus(id, { status, payment_reference }) {
    const payload = { status };
    if (payment_reference) payload.payment_reference = payment_reference;
    return request('PUT', `/transactions/${id}/status`, payload);
  }

  /* ── 6. Intelligence & Price Forecasting ─────────────────── */
  async function getStats() {
    return request('GET', '/intelligence/stats');
  }

  async function getLiveUpdates() {
    return request('GET', '/intelligence/live-updates');
  }

  async function getMandiPrices({ crop_name, state, district, mandi_name, skip = 0, limit = 50 } = {}) {
    const p = new URLSearchParams({ skip, limit });
    if (crop_name)  p.set('crop_name', crop_name);
    if (state)      p.set('state', state);
    if (district)   p.set('district', district);
    if (mandi_name) p.set('mandi_name', mandi_name);
    return request('GET', `/intelligence/mandi-prices?${p}`);
  }

  async function getForecast({ crop_name, state = 'Punjab', district = 'Ludhiana', mandi_name = 'Ludhiana Mandi' }) {
    const p = new URLSearchParams({ crop_name, state, district, mandi_name });
    return request('GET', `/intelligence/forecast?${p}`);
  }

  async function search(q, limit = 10) {
    const p = new URLSearchParams({ q, limit });
    return request('GET', `/intelligence/search?${p}`);
  }

  /* ── 7. Grievances & Disputes ────────────────────────────── */
  async function createGrievance({ transaction_id, category, title, description, evidence_images = [] }) {
    return request('POST', '/grievances/', {
      transaction_id,
      category,
      title,
      description,
      evidence_images,
    });
  }

  async function getGrievances() {
    return request('GET', '/grievances/');
  }

  async function resolveGrievance(id, { status, resolution_notes }) {
    return request('PUT', `/grievances/${id}/resolve`, { status, resolution_notes });
  }

  /* ── Health Check ───────────────────────────────────────── */
  async function ping() {
    try {
      const res = await fetch('http://localhost:8001/', { method: 'GET' });
      return res.ok;
    } catch {
      return false;
    }
  }

  /* ── Expose globally on window.FairCropAPI ────────────────── */
  window.FairCropAPI = {
    // Auth & Users
    register, login, logout, me, updateProfile, getUsers, verifyUser,
    getToken, setToken, clearToken, getUser, setUser, isLoggedIn,
    // Produce
    createProduceLot, getMyProduceLots, getProduceLot, updateProduceLot,
    // Marketplace & Matchmaking
    getMarketplaceLots, getMatchmaking,
    // Offers
    placeOffer, getIncomingOffers, getMyBids, respondToOffer,
    // Transactions
    getTransactions, getTransaction, updateTransactionStatus,
    // Intelligence
    getStats, getLiveUpdates, getMandiPrices, getForecast, search,
    // Grievances
    createGrievance, getGrievances, resolveGrievance,
    // Health
    ping,
  };

})();
