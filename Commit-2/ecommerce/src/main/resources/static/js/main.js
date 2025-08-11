function imgUrl(url) {
  if (!url) return '/img/default.jpg';
  if (url.startsWith('http')) return url;
  return url.startsWith('/') ? url : '/' + url;
}

document.addEventListener('DOMContentLoaded', async () => {
  const grid = document.getElementById('product-grid');

  try {
    // Backend'den ürünleri çek
    const products = await fetchProducts();

    if (!products || products.length === 0) {
      // Backend boşsa örnek ürünleri göster
      const sample = [
        { id: 101, name: 'Örnek Kulaklık', description: 'Bluetooth 5.0', price: 599, imageUrl: '/img/kulaklik.jpg' },
        { id: 102, name: 'Örnek Klavye', description: 'Mekanik, RGB', price: 1299, imageUrl: '/img/klavye.jpg' },
        { id: 103, name: 'Örnek Fare', description: 'Sessiz tıklama', price: 349, imageUrl: '/img/mouse1.jpg' },
        { id: 104, name: 'saat', description: 'rolex', price: 4500, imageUrl: '/img/saat.jpg' },
        { id: 105, name: 'Traş Makinesi', description: 'Su geçirmez', price: 2000, imageUrl: '/img/tras.jpg' },
        { id: 106, name: 'Playstation', description: '512 GB', price: 33000, imageUrl: '/img/playstation.jpg' },
        { id: 107, name: 'Masa', description: 'Tahta', price: 62000, imageUrl: '/img/masa.jpg' },
        { id: 108, name: 'Sandalye', description: 'Ağaç', price: 12000, imageUrl: '/img/sandalye.jpg' },
        { id: 109, name: 'Kahve Makinesi', description: '45 çeşit kahve', price: 50000, imageUrl: '/img/kahve makinesi.jpg' },
        { id: 110, name: 'Bilgisayar', description: 'RTX 4060', price: 85000, imageUrl: '/img/bilgisayar.jpg' },
      ];
      renderProducts(sample, grid, true);
      return;
    }

    renderProducts(products, grid, false);
  } catch (e) {
    console.error(e);
    showMessage('Ürünler yüklenemedi.', 'error');
  }
});

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
        await addToCart(p.id, 1);        // cart/add?productId=&quantity=
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
