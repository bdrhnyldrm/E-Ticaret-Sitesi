// admin.js — yalnızca kategori ve ürün ekleme; ürün listesi çizilmez

document.addEventListener('DOMContentLoaded', async () => {
  await loadCategories();

  const productForm = document.getElementById('product-form');
  if (!productForm) {
    console.error('product-form bulunamadı');
    return;
  }

  productForm.addEventListener('submit', async e => {
    e.preventDefault();

    const idEl   = document.getElementById('product-id');
    const nameEl = document.getElementById('name');
    const descEl = document.getElementById('description');
    const priceEl= document.getElementById('price');
    const catEl  = document.getElementById('category-select');
    const imgEl  = document.getElementById('imageUrl');

    if (!nameEl || !priceEl || !catEl) {
      showMessage('Form elemanları bulunamadı', 'error');
      return;
    }

    const id          = (idEl?.value || '').trim();
    const name        = (nameEl.value || '').trim();
    const description = (descEl?.value || '').trim();
    const price       = parseFloat(priceEl.value);
    const categoryId  = Number(catEl.value);
    const imageUrl    = (imgEl?.value || '').trim();

    if (!name || Number.isNaN(price) || !Number.isFinite(price) || !categoryId) {
      showMessage('Lütfen ad, fiyat ve kategori alanlarını doldurun', 'error');
      return;
    }

    const payload = { name, description, price, categoryId, imageUrl: imageUrl || undefined };

    try {
      // Sadece ekleme akışı istediğin için güncelleme desteğini kapatıyoruz.
      await addProduct(payload);
      showMessage('Ürün eklendi! Ana sayfada görünecektir.', 'success');

      productForm.reset();
      if (idEl) idEl.value = '';
      // DİKKAT: Artık admin’de ürün listesi yenilenmiyor.
      // İstersen burada index’e yönlendirebilirsin:
         window.location.href = 'index.html';
    } catch (err) {
      console.error('Ürün ekleme hatası:', err);
      showMessage(err?.message || 'Ürün eklenemedi', 'error');
    }
  });

  const categoryForm = document.getElementById('category-form');
  if (categoryForm) {
    categoryForm.addEventListener('submit', async e => {
      e.preventDefault();
      const name = (document.getElementById('category-name')?.value || '').trim();
      if (!name) { showMessage('Kategori adı boş olamaz', 'error'); return; }
      try {
        await addCategory(name);
        showMessage('Kategori eklendi!', 'success');
        categoryForm.reset();
        await loadCategories();
      } catch (err) {
        console.error('Kategori ekleme hatası:', err);
        showMessage('Kategori eklenemedi', 'error');
      }
    });
  }
});

async function loadCategories() {
  const select = document.getElementById('category-select');
  const list   = document.getElementById('category-list');
  if (!select || !list) { console.error('category-select veya category-list bulunamadı'); return; }

  const prevValue = select.value;
  select.innerHTML = '';
  list.innerHTML   = '';

  const ph = document.createElement('option');
  ph.value = '';
  ph.textContent = 'Kategori seçin';
  ph.disabled = true;
  ph.selected = true;
  select.appendChild(ph);

  try {
    const categories = await fetchCategories();
    if (!Array.isArray(categories)) throw new Error('Beklenmeyen kategori formatı');

    categories.forEach(cat => {
      if (!cat?.id || !cat?.name) return;

      const option = document.createElement('option');
      option.value = String(cat.id);
      option.textContent = cat.name;
      select.appendChild(option);

      const li = document.createElement('li');
      li.textContent = cat.name;

      const btn = document.createElement('button');
      btn.textContent = 'Sil';
      btn.onclick = async () => {
        try {
          await deleteCategory(cat.id);
          showMessage('Kategori silindi!', 'success');
          await loadCategories();
        } catch {
          showMessage('Kategori silinemedi', 'error');
        }
      };

      li.appendChild(btn);
      list.appendChild(li);
    });

    if (prevValue && [...select.options].some(o => o.value === String(prevValue))) {
      select.value = String(prevValue);
    }
  } catch (e) {
    console.error('Kategori yüklenirken hata:', e);
    showMessage('Kategoriler yüklenemedi', 'error');
  }
}
