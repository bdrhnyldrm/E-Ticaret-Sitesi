document.addEventListener('DOMContentLoaded', async () => {
  const cartItemsDiv = document.getElementById('cart-items');
  const cartTotalDiv = document.getElementById('cart-total'); // <div id="cart-total">

  const token = localStorage.getItem('token');
  if (!token) {
    cartItemsDiv.innerHTML = '<p>Sepeti görmek için giriş yapmalısınız.</p>';
    if (cartTotalDiv) cartTotalDiv.textContent = '';
    return;
  }

  try {
    const cartItems = await fetchCart();

    if (!cartItems || cartItems.length === 0) {
      cartItemsDiv.innerHTML = '<p>Sepetiniz boş.</p>';
      if (cartTotalDiv) cartTotalDiv.textContent = '';
      return;
    }

    let totalPrice = 0;
    cartItemsDiv.innerHTML = '';

    cartItems.forEach(item => {
      const unit = Number(item.product.price);
      const qty  = Number(item.quantity);
      const itemTotal = unit * qty;
      totalPrice += itemTotal;

      const div = document.createElement('div');
      div.className = 'product';
      div.innerHTML = `
        <h3>${item.product.name}</h3>
        <p>Birim Fiyat: ${unit} TL</p>
        <p>Adet: ${qty}</p>
        <p><strong>Toplam: ${itemTotal} TL</strong></p>
        <button data-cart-id="${item.id}">Sil</button>
      `;
      const delBtn = div.querySelector('button');
      delBtn.addEventListener('click', async () => {
        try {
          await removeFromCart(item.id); // <-- CartItem.id ile
          alert('Ürün sepetten çıkarıldı.');
          location.reload();
        } catch {
          alert('Ürün çıkarılamadı.');
        }
      });

      cartItemsDiv.appendChild(div);
    });

    if (cartTotalDiv) {
      cartTotalDiv.textContent = `Sepet Toplamı: ${totalPrice} TL`;
    }

    const placeBtn = document.getElementById('place-order-btn');
    if (placeBtn) {
      placeBtn.addEventListener('click', async () => {
        try {
          await placeOrder();
          alert('Siparişiniz oluşturuldu!');
          location.reload();
        } catch (e) {
          alert('Sipariş oluşturulamadı.');
        }
      });
    }
  } catch (err) {
    cartItemsDiv.innerHTML = '<p>Sepet yüklenemedi.</p>';
    console.error(err);
  }
});
