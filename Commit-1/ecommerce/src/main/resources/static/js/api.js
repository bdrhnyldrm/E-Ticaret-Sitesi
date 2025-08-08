// ==============================
// API base
// ==============================
const API_BASE = 'http://localhost:8080/api';

// ==============================
// Helpers
// ==============================
function getToken() {
  return localStorage.getItem('token');
}

function authHeaders(extra = {}) {
  const token = getToken();
  return {
    ...(extra || {}),
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
}

function showMessage(text, type = 'success') {
  const msg = document.getElementById('message');
  if (!msg) return; // sayfada mesaj kutusu yoksa sessizce çık
  msg.textContent = text;
  msg.className = `message ${type}`;
  msg.style.display = 'block';
  setTimeout(() => { msg.style.display = 'none'; }, 3000);
}

// (İstersen diğer dosyalarda da kullanırsın)
function parseJwt(token) {
  try { return JSON.parse(atob(token.split('.')[1])); }
  catch { return null; }
}

// ==============================
// Products
// ==============================
async function fetchProducts() {
  const res = await fetch(`${API_BASE}/products`);
  if (!res.ok) throw new Error('Ürünler alınamadı');
  return await res.json();
}

async function fetchProductById(id) {
  const res = await fetch(`${API_BASE}/products/${id}`);
  if (!res.ok) throw new Error('Ürün alınamadı');
  return await res.json();
}

async function addProduct(product) {
  const res = await fetch(`${API_BASE}/products`, {
    method: 'POST',
    headers: authHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(product)
  });
  if (!res.ok) throw new Error('Ürün eklenemedi');
}

async function updateProduct(id, product) {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: 'PUT',
    headers: authHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(product)
  });
  if (!res.ok) throw new Error('Ürün güncellenemedi');
}

async function deleteProductById(id) {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: 'DELETE',
    headers: authHeaders()
  });
  if (!res.ok) throw new Error('Silinemedi');
}

// ==============================
// Categories
// ==============================
async function fetchCategories() {
  const res = await fetch(`${API_BASE}/categories`);
  if (!res.ok) throw new Error('Kategoriler alınamadı');
  return await res.json();
}

async function addCategory(name) {
  const res = await fetch(`${API_BASE}/categories`, {
    method: 'POST',
    headers: authHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ name })
  });
  if (!res.ok) throw new Error('Kategori eklenemedi');
}

async function deleteCategory(id) {
  const res = await fetch(`${API_BASE}/categories/${id}`, {
    method: 'DELETE',
    headers: authHeaders()
  });
  if (!res.ok) throw new Error('Kategori silinemedi');
}

// ==============================
// Cart & Order
// ==============================
async function addToCart(productId) {
  const res = await fetch(`${API_BASE}/cart/add`, {
    method: 'POST',
    headers: authHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ productId })
  });
  if (!res.ok) throw new Error('Sepete eklenemedi');
}

async function fetchCart() {
  const res = await fetch(`${API_BASE}/cart`, {
    headers: authHeaders()
  });
  if (!res.ok) throw new Error('Sepet alınamadı');
  return await res.json();
}

async function removeFromCart(productId) {
  const res = await fetch(`${API_BASE}/cart/remove/${productId}`, {
    method: 'DELETE',
    headers: authHeaders()
  });
  if (!res.ok) throw new Error('Silinemedi');
}

async function placeOrder() {
  const res = await fetch(`${API_BASE}/order`, {
    method: 'POST',
    headers: authHeaders()
  });
  if (!res.ok) throw new Error('Sipariş oluşturulamadı');
}

// ==============================
// Auth
// ==============================
async function login(email, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) throw new Error('Giriş başarısız');
  // Backend düz metin JWT döndürüyor
  const token = await res.text();
  return token;
}

// ⚠️ Backend RegisterRequest -> username, email, password bekliyor
async function register(username, email, password) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password })
  });
  if (!res.ok) throw new Error('Kayıt başarısız');
}
