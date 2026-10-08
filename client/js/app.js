const state = {
  token: localStorage.getItem('token') || '',
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  cart: JSON.parse(localStorage.getItem('cart') || '[]')
};

const productGrid = document.getElementById('productGrid');
const adminProducts = document.getElementById('adminProducts');
const cartPanel = document.getElementById('cartPanel');
const ordersPanel = document.getElementById('ordersPanel');
const authLink = document.getElementById('authLink');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const productForm = document.getElementById('productForm');
const loginMessage = document.getElementById('loginMessage');
const registerMessage = document.getElementById('registerMessage');
const productMessage = document.getElementById('productMessage');
const search = document.getElementById('search');
const categoryFilter = document.getElementById('categoryFilter');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const backToTop = document.querySelector('.back-to-top');
let products = [];

async function fetchJson(url, options = {}) {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...(state.token ? { Authorization: `Bearer ${state.token}` } : {}) },
    ...options
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Erro na requisição');
  return data;
}

function updateAuthUI() {
  if (state.user) {
    authLink.textContent = `Olá, ${state.user.name}`;
  } else {
    authLink.textContent = 'Entrar';
  }
}

function showMessage(element, text, isError = false) {
  element.textContent = text;
  element.style.color = isError ? '#ff7b7b' : '#d2a94b';
}

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(state.cart));
}

function renderCart() {
  if (!state.cart.length) {
    cartPanel.innerHTML = '<h3>Carrinho</h3><p>Carrinho vazio.</p>';
    return;
  }

  const total = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cartPanel.innerHTML = `
    <h3>Carrinho</h3>
    ${state.cart.map((item) => `<div class="card" style="margin-bottom:0.7rem"><strong>${item.name}</strong> — ${item.quantity}x R$ ${Number(item.price).toFixed(2)}</div>`).join('')}
    <p><strong>Total:</strong> R$ ${total.toFixed(2)}</p>
    <button class="btn btn-gold" id="checkoutBtn">Finalizar pedido</button>
  `;
  document.getElementById('checkoutBtn')?.addEventListener('click', checkout);
}

async function checkout() {
  if (!state.user) {
    alert('Faça login para finalizar o pedido.');
    return;
  }

  try {
    const data = await fetchJson('/api/orders', { method: 'POST', body: JSON.stringify({ items: state.cart.map((item) => ({ productId: item.productId, quantity: item.quantity })) }) });
    state.cart = [];
    saveCart();
    renderCart();
    loadOrders();
    alert(data.message || 'Pedido realizado com sucesso');
  } catch (error) {
    alert(error.message);
  }
}

async function loadOrders() {
  if (!state.user) {
    ordersPanel.innerHTML = '<p>Faça login para ver seus pedidos.</p>';
    return;
  }
  try {
    const orders = await fetchJson('/api/orders');
    ordersPanel.innerHTML = `
      <h3>Pedidos</h3>
      ${orders.map((order) => `<div class="card" style="margin-bottom:0.7rem"><strong>#${order.id}</strong> — ${order.status} — R$ ${Number(order.valor_total).toFixed(2)}</div>`).join('')}
    `;
  } catch (error) {
    ordersPanel.innerHTML = `<p>${error.message}</p>`;
  }
}

async function populateCategoryFilter() {
  const categories = [...new Set(products.map((product) => product.category))];
  categoryFilter.innerHTML = '<option value="all">Todas</option>';
  categories.forEach((category) => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

async function loadProducts() {
  products = await fetchJson('/api/products');
  populateCategoryFilter();
  const term = search.value.toLowerCase();
  const category = categoryFilter.value;
  const filtered = products.filter((p) => {
    const matchesTerm = p.name.toLowerCase().includes(term) || p.category.toLowerCase().includes(term);
    const matchesCategory = category === 'all' || p.category === category;
    return matchesTerm && matchesCategory;
  });

  renderProducts(filtered, productGrid);
  renderProducts(filtered, adminProducts);
}

function renderProducts(products, target) {
  target.innerHTML = '';
  products.forEach((product) => {
    const card = document.createElement('article');
    card.className = 'card product-card';
    card.innerHTML = `
      <img src="${product.image || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'}" alt="${product.name}" />
      <h3>${product.name}</h3>
      <p>${product.description}</p>
      <div><strong>R$ ${Number(product.price).toFixed(2)}</strong></div>
      <small>Categoria: ${product.category}</small>
      <small>Estoque: ${product.stock}</small>
      <button class="btn btn-dark" data-product-id="${product.id}" data-name="${product.name}" data-price="${product.price}">Adicionar ao carrinho</button>
    `;
    target.appendChild(card);
  });

  target.querySelectorAll('button[data-product-id]').forEach((button) => {
    button.addEventListener('click', () => {
      const item = {
        productId: Number(button.dataset.productId),
        name: button.dataset.name,
        price: Number(button.dataset.price),
        quantity: 1
      };
      const existing = state.cart.find((entry) => entry.productId === item.productId);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.cart.push(item);
      }
      saveCart();
      renderCart();
      showMessage(loginMessage, 'Produto adicionado ao carrinho');
    });
  });
}

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(loginForm);
  try {
    const data = await fetchJson('/api/auth/login', { method: 'POST', body: JSON.stringify({ email: formData.get('email'), password: formData.get('password') }) });
    state.token = data.token;
    state.user = data.user;
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    updateAuthUI();
    renderCart();
    loadOrders();
    loginMessage.textContent = 'Login realizado com sucesso';
  } catch (error) {
    loginMessage.textContent = error.message;
  }
});

registerForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(registerForm);
  try {
    const data = await fetchJson('/api/auth/register', { method: 'POST', body: JSON.stringify({ name: formData.get('name'), email: formData.get('email'), password: formData.get('password') }) });
    state.token = data.token;
    state.user = data.user;
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    updateAuthUI();
    renderCart();
    loadOrders();
    registerMessage.textContent = 'Cadastro realizado';
  } catch (error) {
    registerMessage.textContent = error.message;
  }
});

productForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(productForm);
  const payload = new FormData();
  payload.append('name', formData.get('name'));
  payload.append('description', formData.get('description'));
  payload.append('category', formData.get('category'));
  payload.append('price', formData.get('price'));
  payload.append('stock', formData.get('stock'));
  if (formData.get('image')) payload.append('image', formData.get('image'));

  try {
    const response = await fetch('/api/products', {
      method: 'POST',
      headers: { Authorization: `Bearer ${state.token}` },
      body: payload
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Erro ao salvar');
    productMessage.textContent = 'Produto salvo com sucesso';
    productForm.reset();
    loadProducts();
  } catch (error) {
    productMessage.textContent = error.message;
  }
});

search.addEventListener('input', loadProducts);
categoryFilter.addEventListener('change', loadProducts);

menuToggle?.addEventListener('click', () => {
  navLinks.classList.toggle('active');
  const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!expanded));
});

window.addEventListener('scroll', () => {
  backToTop.classList.toggle('visible', window.scrollY > 600);
});

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

updateAuthUI();
renderCart();
loadOrders();
loadProducts();
