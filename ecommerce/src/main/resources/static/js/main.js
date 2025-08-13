function imgUrl(url) {
  if (!url) return '/img/default.jpg';
  if (url.startsWith('http')) return url;
  return url.startsWith('/') ? url : '/' + url;
}

function displayUserEmail() {
  const userEmailElement = document.getElementById('userEmail');
  const email = localStorage.getItem('userEmail');
  if (email) {
    userEmailElement.textContent = email;
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  displayUserEmail();

  const grid = document.getElementById('product-grid');
  const filter = document.getElementById('category-filter');

  // Kategorileri yükle
  try {
    if (filter) {
      const cats = await fetchCategories();
      // Tümü seçeneği zaten var
      cats.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c.name;        // backend filter name bekliyor
        opt.textContent = c.name;
        filter.appendChild(opt);
      });

      filter.addEventListener('change', async () => {
        await loadAndRenderProducts(grid, filter.value);
      });
    }
  } catch (e) {
    console.warn('Kategori filtreleri yüklenemedi:', e);
  }

  // İlk yükleme: tüm ürünler
  await loadAndRenderProducts(grid, filter?.value || '');
});

async function loadAndRenderProducts(container, categoryName = '') {
  try {
    let products;
    if (categoryName) {
      products = await fetchProductsByCategory(categoryName);
      if (!products || products.length === 0) {
        showMessage(`“${categoryName}” kategorisinde ürün bulunamadı.`, 'error');
        container.innerHTML = '';
        return;
      }
      renderProducts(products, container, false);
      return;
    }

    // Tümü
    products = await fetchProducts();
    if (!products || products.length === 0) {
      const sample = [
        { id: 101, name: 'Örnek Kulaklık', description: 'Bluetooth 5.0', price: 599, imageUrl: '/img/kulaklik.jpg' },
        { id: 102, name: 'Örnek Klavye', description: 'Mekanik, RGB', price: 1299, imageUrl: '/img/klavye.jpg' },
        { id: 103, name: 'Örnek Fare', description: 'Sessiz tıklama', price: 349, imageUrl: '/img/mouse1.jpg' },
      ];
      renderProducts(sample, container, true);
      return;
    }
    renderProducts(products, container, false);
  } catch (e) {
    console.error(e);
    showMessage('Ürünler yüklenemedi.', 'error');
  }
}

function renderProducts(products, container, isSample = false) {
  container.innerHTML = '';
  products.forEach(p => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div>
        <img src="${imgUrl(p.imageUrl)}" alt="${p.name}"
             onerror="this.onerror=null;this.src='http://localhost:8080/img/default.jpg';"
             style="width:100%;height:160px;object-fit:cover;border-radius:8px;margin-bottom:8px;">
        <h3>${p.name}</h3>
        <p>${p.description ?? ''}</p>
        <div class="price">${p.price} TL</div>
      </div>
      <div class="actions">
        <button data-id="${p.id}">Sepete Ekle</button>
      </div>
    `;

    const btn = card.querySelector('button');
    btn.addEventListener('click', async () => {
      if (isSample) {
        showMessage('Örnek ürün sepete eklenemez.', 'error');
        return;
      }
      const token = localStorage.getItem('token');
      if (!token) {
        showMessage('Sepete eklemek için giriş yapınız.', 'error');
        window.location.href = 'login.html';
        return;
      }
      btn.disabled = true;
      btn.textContent = 'Ekleniyor...';
      try {
        await addToCart(p.id, 1);
        showMessage('Ürün sepete eklendi ✅', 'success');
        btn.textContent = 'Sepete Eklendi';
      } catch (err) {
        console.error(err);
        showMessage('Sepete eklenemedi.', 'error');
        btn.disabled = false;
        btn.textContent = 'Sepete Ekle';
      }
    });

    container.appendChild(card);
  });
}
