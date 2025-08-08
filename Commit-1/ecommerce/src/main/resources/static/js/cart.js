document.addEventListener('DOMContentLoaded', async () => {
  const cartItemsDiv = document.getElementById('cart-items');
  const token = localStorage.getItem('token');

  if (!token) {
    cartItemsDiv.innerHTML = '<p>Sepeti görmek için giriş yapmalısınız.</p>';
    return;
  }

  try {
    const cartItems = await fetchCart();

    if (cartItems.length === 0) {
      cartItemsDiv.innerHTML = '<p>Sepetiniz boş.</p>';
      return;
    }

    cartItemsDiv.innerHTML = '';
    cartItems.forEach(item => {
      const div = document.createElement('div');
      div.className = 'product';
      div.innerHTML = `
        <h3>${item.product.name}</h3>
        <p>Fiyat: ${item.product.price} TL</p>
        <p>Adet: ${item.quantity}</p>
        <button onclick="removeItem(${item.product.id})">Sil</button>
      `;
      cartItemsDiv.appendChild(div);
    });

    document.getElementById('place-order-btn').addEventListener('click', async () => {
      try {
        await placeOrder();
        alert('Siparişiniz oluşturuldu!');
        location.reload();
      } catch (e) {
        alert('Sipariş oluşturulamadı.');
      }
    });

  } catch (err) {
    cartItemsDiv.innerHTML = '<p>Sepet yüklenemedi.</p>';
    console.error(err);
  }
});

async function removeItem(productId) {
  try {
    await removeFromCart(productId);
    alert('Ürün sepetten çıkarıldı.');
    location.reload();
  } catch (err) {
    alert('Ürün çıkarılamadı.');
  }
}
