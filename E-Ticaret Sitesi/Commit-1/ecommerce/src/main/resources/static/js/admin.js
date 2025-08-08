document.addEventListener('DOMContentLoaded', async () => {
  await loadCategories();
  await loadProducts();

  const productForm = document.getElementById('product-form');
  productForm.addEventListener('submit', async e => {
    e.preventDefault();
    const id = document.getElementById('product-id').value;
    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;
    const price = document.getElementById('price').value;
    const categoryId = document.getElementById('category-select').value;

    try {
      if (id) {
        await updateProduct(id, { name, description, price, categoryId });
        showMessage("Ürün güncellendi!", "success");
      } else {
        await addProduct({ name, description, price, categoryId });
        showMessage("Ürün eklendi!", "success");
      }
      productForm.reset();
      await loadProducts();
    } catch {
      showMessage("Ürün eklenemedi/güncellenemedi", "error");
    }
  });

  const categoryForm = document.getElementById('category-form');
  categoryForm.addEventListener('submit', async e => {
    e.preventDefault();
    const name = document.getElementById('category-name').value;
    try {
      await addCategory(name);
      showMessage("Kategori eklendi!", "success");
      categoryForm.reset();
      await loadCategories();
    } catch {
      showMessage("Kategori eklenemedi", "error");
    }
  });
});

async function loadCategories() {
  const select = document.getElementById('category-select');
  const list = document.getElementById('category-list');
  select.innerHTML = '';
  list.innerHTML = '';

  try {
    const categories = await fetchCategories();
    categories.forEach(cat => {
      const option = document.createElement('option');
      option.value = cat.id;
      option.textContent = cat.name;
      select.appendChild(option);

      const li = document.createElement('li');
      li.textContent = cat.name;
      const btn = document.createElement('button');
      btn.textContent = 'Sil';
      btn.onclick = async () => {
        await deleteCategory(cat.id);
        showMessage("Kategori silindi!", "success");
        await loadCategories();
      };
      li.appendChild(btn);
      list.appendChild(li);
    });
  } catch {
    showMessage("Kategoriler yüklenemedi", "error");
  }
}

async function loadProducts() {
  const container = document.getElementById('admin-product-list');
  container.innerHTML = '';
  try {
    const products = await fetchProducts();
    products.forEach(p => {
      const div = document.createElement('div');
      div.className = 'product';
      div.innerHTML = `
        <h3>${p.name}</h3>
        <p>${p.description}</p>
        <p>${p.price} TL</p>
        <button onclick="editProduct(${p.id})">Düzenle</button>
        <button onclick="deleteProductById(${p.id}).then(loadProducts)">Sil</button>
      `;
      container.appendChild(div);
    });
  } catch {
    showMessage("Ürünler yüklenemedi", "error");
  }
}

async function editProduct(id) {
  try {
    const product = await fetchProductById(id);
    document.getElementById('product-id').value = product.id;
    document.getElementById('name').value = product.name;
    document.getElementById('description').value = product.description;
    document.getElementById('price').value = product.price;
    document.getElementById('category-select').value = product.category.id;
  } catch {
    showMessage("Ürün bilgisi alınamadı", "error");
  }
}
