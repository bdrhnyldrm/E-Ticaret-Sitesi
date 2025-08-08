document.addEventListener('DOMContentLoaded', async () => {
  const grid = document.getElementById('product-grid');

  try {
    // Backend'den ürünleri çek
    const products = await fetchProducts();

    if (!products || products.length === 0) {
      // Backend boşsa örnek ürünleri göster
      const sample = [
        { id: 101, name: 'Örnek Kulaklık', description: 'Bluetooth 5.0', price: 599 },
        { id: 102, name: 'Örnek Klavye', description: 'Mekanik, RGB', price: 1299 },
        { id: 103, name: 'Örnek Fare', description: 'Sessiz tıklama', price: 349 },
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

function renderProducts(products, container, isSample) {
  container.innerHTML = '';
  products.forEach(p => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div>
        <h3>${p.name}</h3>
        <p>${p.description ?? ''}</p>
        <div class="price">${p.price} TL</div>
      </div>
      <div class="actions">
        <button data-id="${p.id}" ${isSample ? 'disabled' : ''}>Sepete Ekle</button>
      </div>
    `;
    const btn = card.querySelector('button');
    btn.addEventListener('click', async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        showMessage('Sepete eklemek için lütfen giriş yapınız.', 'error');
        window.location.href = 'login.html';
        return;
      }
      btn.disabled = true;
      btn.textContent = 'Ekleniyor...';
      try {
        await addToCart(p.id);
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
