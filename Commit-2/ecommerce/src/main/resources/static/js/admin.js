// admin.js — kategori seçimi düzeltildi + sağlamlaştırıldı

document.addEventListener('DOMContentLoaded', async () => {
  await loadCategories();
  await loadProducts();

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
      showMessage('Form elemanları bulunamadı', 'error'); return;
    }

    const id          = (idEl?.value || '').trim();
    const name        = (nameEl.value || '').trim();
    const description = (descEl?.value || '').trim();
    const price       = parseFloat(priceEl.value);
    const categoryId  = Number(catEl.value);        // backend’in beklediği sayı
    const imageUrl    = (imgEl?.value || '').trim();

    if (!name || Number.isNaN(price) || !Number.isFinite(price) || !categoryId) {
      showMessage('Lütfen ad, fiyat ve kategori alanlarını doldurun', 'error');
      return;
    }

    const payload = { name, description, price, categoryId, imageUrl: imageUrl || undefined };

    try {
      if (id) {
        await updateProduct(id, payload);
        showMessage('Ürün güncellendi!', 'success');
      } else {
        await addProduct(payload);
        showMessage('Ürün eklendi!', 'success');
      }
      productForm.reset();
      if (idEl) idEl.value = '';
      await loadProducts();
    } catch (err) {
      console.error('Ürün işlemi hatası:', err);
      showMessage(err?.message || 'Ürün işlemi başarısız', 'error');
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

  // mevcut seçimi koru
  const prevValue = select.value;
  select.innerHTML = '';
  list.innerHTML   = '';

  // placeholder ekle
  const ph = document.createElement('option');
  ph.value = '';
  ph.textContent = 'Kategori seçin';
  ph.disabled = true;
  ph.selected = true;
  select.appendChild(ph);

  try {
    const categories = await fetchCategories();
    console.log('categories response:', categories);
    if (!Array.isArray(categories)) throw new Error('Beklenmeyen kategori formatı (dizi değil)');

    categories.forEach(cat => {
      if (!cat?.id || !cat?.name) { console.warn('Geçersiz kategori verisi:', cat); return; }

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
        } catch (err) {
          console.error('Kategori silme hatası:', err);
          showMessage('Kategori silinemedi', 'error');
        }
      };

      li.appendChild(btn);
      list.appendChild(li);
    });

    // önceden bir seçim varsa ve hâlâ mevcutsa geri yükle
    if (prevValue && [...select.options].some(o => o.value === String(prevValue))) {
      select.value = String(prevValue);
    }
  } catch (e) {
    console.error('Kategori yüklenirken hata:', e);
    showMessage('Kategoriler yüklenemedi', 'error');
  }
}

async function loadProducts() {
  const container = document.getElementById('product-list')?.querySelector('tbody');
  if (!container) { console.error('product-list tbody bulunamadı'); return; }
  container.innerHTML = '';

  try {
    const products = await fetchProducts();
    if (!Array.isArray(products)) throw new Error('Beklenmeyen ürün formatı');

    products.forEach(p => {
      if (!p?.id || !p?.name) { console.warn('Geçersiz ürün verisi:', p); return; }
      const tr = document.createElement('tr');
      const div = document.createElement('div');
      div.innerHTML = `
        <img src="${p.imageUrl || '/img/default.jpg'}" alt="${p.name}"
             style="width:120px;height:80px;object-fit:cover;border-radius:6px;margin-bottom:8px;">
        <h3>${p.name}</h3>
        <p>${p.description || ''}</p>
        <p>${p.price} TL</p>
        <button onclick="editProduct(${p.id})">Düzenle</button>
        <button onclick="deleteProductById(${p.id}).then(loadProducts)">Sil</button>
      `;
      tr.appendChild(div);
      container.appendChild(tr);
    });
  } catch (err) {
    console.error('Ürün yükleme hatası:', err);
    showMessage('Ürünler yüklenemedi', 'error');
  }
}

async function editProduct(id) {
  if (!id) { console.error('Geçersiz ürün ID'); return; }

  try {
    const product = await fetchProductById(id);
    if (!product?.id) throw new Error('Geçersiz ürün verisi');

    const elements = {
      id: document.getElementById('product-id'),
      name: document.getElementById('name'),
      description: document.getElementById('description'),
      price: document.getElementById('price'),
      category: document.getElementById('category-select'),
      imageUrl: document.getElementById('imageUrl'),
      preview: document.getElementById('image-preview')
    };
    if (!Object.values(elements).every(el => el)) throw new Error('Form elementleri bulunamadı');

    elements.id.value = product.id;
    elements.name.value = product.name;
    elements.description.value = product.description || '';
    elements.price.value = product.price;
    elements.category.value = String(product.category?.id ?? '');
    elements.imageUrl.value = product.imageUrl || '';

    if (elements.preview) {
      if (product.imageUrl) {
        elements.preview.src = product.imageUrl;
        elements.preview.style.display = 'block';
      } else {
        elements.preview.style.display = 'none';
      }
    }
  } catch (err) {
    console.error('Ürün düzenleme hatası:', err);
    showMessage('Ürün bilgisi alınamadı', 'error');
  }
}

// onclick için global
window.editProduct = editProduct;
