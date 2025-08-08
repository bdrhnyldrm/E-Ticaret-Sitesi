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
      <h2>${product.name}</h2>
      <p>${product.description || ''}</p>
      <strong>${product.price} TL</strong>
    `;

    addToCartBtn.addEventListener('click', async () => {
      try {
        await addToCart(productId);
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
