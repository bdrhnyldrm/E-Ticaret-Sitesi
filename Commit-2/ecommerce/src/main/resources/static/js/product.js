document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get('id');
  const detailDiv = document.getElementById('product-detail');
  const addToCartBtn = document.getElementById('add-to-cart-btn');

  if (!productId) {
    detailDiv.innerHTML = '<p>Ürün bulunamadı.</p>';
    return;
  }

  try {
    const product = await fetchProductById(productId);

    detailDiv.innerHTML = `
      <img src="${product.imageUrl || '/img/kedi.jpg'}" alt="${product.name}"
           style="width:100%;max-width:520px;height:280px;object-fit:cover;border-radius:8px;margin-bottom:12px;">
      <h2>${product.name}</h2>
      <p>${product.description || ''}</p>
      <strong>${product.price} TL</strong>
    `;

    addToCartBtn.addEventListener('click', async () => {
      try {
        await addToCart(productId, 1); // quantity=1
        showMessage('Ürün sepete eklendi!', 'success');
      } catch (err) {
        showMessage('Sepete eklenemedi.', 'error');
        console.error(err);
      }
    });

  } catch (err) {
    detailDiv.innerHTML = '<p>Ürün detayı yüklenemedi.</p>';
    console.error(err);
  }
});
