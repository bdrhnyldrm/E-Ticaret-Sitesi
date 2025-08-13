// js/auth-guard.js
function getToken() { return localStorage.getItem('token'); }
function parseJwt(token) { try { return JSON.parse(atob(token.split('.')[1])); } catch { return null; } }

function isAuthenticatedLocal() {
  const t = getToken(); if (!t) return false;
  const p = parseJwt(t); if (!p) return false;
  if (p.exp && Date.now()/1000 >= p.exp) return false; // exp varsa kontrol et
  return true; // exp yoksa sadece local doğrulama: var sayıyoruz (sunucu pingi aşağıda)
}

// PROTECTED ping ile doğrula (asıl karar burada)
async function isAuthenticatedServer() {
  const token = getToken();
  if (!token) return false;
  try {
    const res = await fetch('http://localhost:8080/api/cart/my', {
      headers: { 'Authorization': `Bearer ${token}` },
      cache: 'no-store'
    });
    if (res.status === 401) return false;
    return res.ok;
  } catch {
    // sunucu yoksa local kontrol ile karar ver (istersen false da diyebilirsin)
    return isAuthenticatedLocal();
  }
}

function requireAuth() {
  // sayfa koruması için sadece local kontrol yeterli olabilir ama 401’i api.js’te yakalıyoruz
  if (!isAuthenticatedLocal()) {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
  }
}

// LOGIN sayfasında kullanılacak — async!
async function redirectIfAuthenticated() {
  const ok = await isAuthenticatedServer();
  if (ok) window.location.href = 'index.html';
}

function hasRole(role) {
  const p = parseJwt(getToken() || '') || {};
  const roles = p.roles || p.authorities || [];
  return Array.isArray(roles) && roles.includes(role);
}

function logout() {
  localStorage.removeItem('token');
  window.location.href = 'login.html';
}
