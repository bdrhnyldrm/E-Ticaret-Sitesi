// ==============================
// API base
// ==============================
const API_BASE = 'http://localhost:8080/api';

// ==============================
// Debug flag (gerekirse true yap)
// ==============================
const __DEV_LOG_AUTH = false;

// ==============================
// Helpers
// ==============================
function getToken() {
  return localStorage.getItem('token');
}

function authHeaders(extra = {}) {
  const token = getToken();
  const headers = {
    ...(extra || {}),
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
  if (__DEV_LOG_AUTH) {
    console.log('Auth headers being sent:', headers);
  }
  return headers;
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
  const url = `${API_BASE}/products?ts=${Date.now()}`; // cache-bust
  const res = await fetch(url, { cache: 'no-store' });
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
    headers: authHeaders({ 'Content-Type': 'application/json', 'Accept': 'application/json' }),
    body: JSON.stringify({
      name: product.name,
      description: product.description,
      price: product.price,
      categoryId: product.categoryId,
      imageUrl: product.imageUrl
    })
  });
  if (!res.ok) throw new Error('Ürün eklenemedi');
}

async function updateProduct(id, product) {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: 'PUT',
    headers: authHeaders({ 'Content-Type': 'application/json', 'Accept': 'application/json' }),
    body: JSON.stringify({
      name: product.name,
      description: product.description,
      price: product.price,
      categoryId: product.categoryId,
      imageUrl: product.imageUrl
    })
  });
  if (!res.ok) throw new Error('Ürün güncellenemedi');
}

async function deleteProductById(id) {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: 'DELETE',
    headers: authHeaders({ 'Accept': 'application/json' })
  });
  if (!res.ok) throw new Error('Silinemedi');
}

// Kategoriye göre ürünler
async function fetchProductsByCategory(categoryName) {
  const url = `${API_BASE}/products/filter?category=${encodeURIComponent(categoryName)}&ts=${Date.now()}`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error('Filtreli ürünler alınamadı');
  const data = await res.json();
  return Array.isArray(data) ? data : (data ? [data] : []);
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
    headers: authHeaders({ 'Content-Type': 'application/json', 'Accept': 'application/json' }),
    body: JSON.stringify({ name })
  });
  if (!res.ok) throw new Error('Kategori eklenemedi');
}

async function deleteCategory(id) {
  const res = await fetch(`${API_BASE}/categories/${id}`, {
    method: 'DELETE',
    headers: authHeaders({ 'Accept': 'application/json' })
  });
  if (!res.ok) throw new Error('Kategori silinemedi');
}

// ==============================
// Cart & Order
// ==============================
async function addToCart(productId, quantity = 1) {
  // CartController: POST /api/cart/add?productId=&quantity=
  const url = new URL(`${API_BASE}/cart/add`);
  url.searchParams.set('productId', productId);
  url.searchParams.set('quantity', quantity);

  const res = await fetch(url, {
    method: 'POST',
    headers: authHeaders({ 'Accept': 'application/json' }),
  });
  if (!res.ok) throw new Error('Sepete eklenemedi');
  return await res.json(); // CartItem döner
}

async function fetchCart() {
  // CartController: GET /api/cart/my
  const res = await fetch(`${API_BASE}/cart/my`, {
    headers: authHeaders({ 'Accept': 'application/json' })
  });
  if (!res.ok) throw new Error('Sepet alınamadı');
  return await res.json(); // List<CartItem>
}

async function removeFromCart(cartItemId) {
  // CartController: DELETE /api/cart/remove/{id}
  const res = await fetch(`${API_BASE}/cart/remove/${cartItemId}`, {
    method: 'DELETE',
    headers: authHeaders({ 'Accept': 'application/json' })
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    console.error('removeFromCart failed:', res.status, res.statusText, text);
    throw new Error(`Silinemedi (${res.status} ${res.statusText}) ${text ? '– ' + text : ''}`);
  }
  // çoğu backend 204 No Content döndürür; gövde yoksa sorun değil
  return true;
}

async function placeOrder() {
  // CartController: POST /api/cart/checkout
  const res = await fetch(`${API_BASE}/cart/checkout`, {
    method: 'POST',
    headers: authHeaders({ 'Accept': 'application/json' })
  });
  if (!res.ok) throw new Error('Sipariş oluşturulamadı');
  return await res.json(); // Order döner
}

// ==============================
// Auth
// ==============================
async function login(email, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'text/plain' },
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
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ username, email, password })
  });
  if (!res.ok) throw new Error('Kayıt başarısız');
}
