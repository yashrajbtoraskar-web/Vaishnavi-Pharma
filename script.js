/* ===================================================
   Vaishnavi Pharma — Main JavaScript
   Handles: Cart, Search, Toast, Interactions
   =================================================== */

// ── Medicine Data ──────────────────────────────────
const MEDICINES = [
  { id: 1,  name: "Paracetamol 500mg",       category: "Tablets",    price: 25,  original: 30,  emoji: "💊", desc: "Relieves mild to moderate pain and reduces fever. Safe for adults & children.", badge: "OTC" },
  { id: 2,  name: "Amoxicillin 250mg",        category: "Capsules",   price: 85,  original: 100, emoji: "💉", desc: "Broad-spectrum antibiotic for bacterial infections. Prescription required.", badge: "Rx" },
  { id: 3,  name: "Cetirizine 10mg",          category: "Tablets",    price: 40,  original: null,emoji: "💊", desc: "Antihistamine for allergy symptoms: sneezing, runny nose, itchy eyes.", badge: "OTC" },
  { id: 4,  name: "Cough Syrup 100ml",        category: "Syrups",     price: 95,  original: 110, emoji: "🍶", desc: "Soothes throat irritation and suppresses dry or productive cough.", badge: "OTC" },
  { id: 5,  name: "Vitamin C 1000mg",         category: "Vitamins",   price: 199, original: 250, emoji: "🍊", desc: "Boosts immunity, antioxidant protection, and supports collagen synthesis.", badge: "SALE" },
  { id: 6,  name: "Metformin 500mg",          category: "Tablets",    price: 55,  original: null,emoji: "💊", desc: "Used to treat type 2 diabetes by controlling blood sugar levels.", badge: "Rx" },
  { id: 7,  name: "Omeprazole 20mg",          category: "Capsules",   price: 72,  original: 85,  emoji: "💊", desc: "Reduces stomach acid for heartburn, acid reflux, and peptic ulcers.", badge: "OTC" },
  { id: 8,  name: "Ibuprofen 400mg",          category: "Tablets",    price: 35,  original: null,emoji: "💊", desc: "NSAID for pain, inflammation, and fever reduction. Take with food.", badge: "OTC" },
  { id: 9,  name: "Calcium + D3 Tablets",     category: "Vitamins",   price: 175, original: 220, emoji: "🦴", desc: "Supports bone health, muscle function and prevents calcium deficiency.", badge: "SALE" },
  { id: 10, name: "Azithromycin 500mg",       category: "Capsules",   price: 120, original: 140, emoji: "💉", desc: "Antibiotic for respiratory and skin infections. 3-day or 5-day course.", badge: "Rx" },
  { id: 11, name: "Oral Rehydration Salt",    category: "Syrups",     price: 18,  original: null,emoji: "🧂", desc: "Rapidly replenishes fluids and electrolytes lost due to diarrhoea or vomiting.", badge: "OTC" },
  { id: 12, name: "Multivitamin Gummies",     category: "Vitamins",   price: 299, original: 350, emoji: "🍬", desc: "Delicious daily vitamins with A, B, C, D & E for kids and adults.", badge: "SALE" },
  { id: 13, name: "Antacid Suspension",       category: "Syrups",     price: 65,  original: null,emoji: "🍶", desc: "Fast relief from acidity, indigestion, and stomach bloating after meals.", badge: "OTC" },
  { id: 14, name: "Levocetirizine 5mg",       category: "Tablets",    price: 48,  original: 60,  emoji: "💊", desc: "Next-gen antihistamine for allergic rhinitis and chronic urticaria.", badge: "OTC" },
  { id: 15, name: "Bandage & Gauze Kit",      category: "First Aid",  price: 89,  original: 100, emoji: "🩹", desc: "Sterile wound dressing kit with gauze, adhesive bandages and antiseptic.", badge: "OTC" },
  { id: 16, name: "Thermometer Digital",      category: "Devices",    price: 249, original: 299, emoji: "🌡️", desc: "Accurate oral/underarm digital thermometer with fever alert beep.", badge: "OTC" },
];

// ── Cart Helpers ───────────────────────────────────
function getCart() {
  try {
    return JSON.parse(localStorage.getItem('vp_cart')) || [];
  } catch { return []; }
}

function saveCart(cart) {
  localStorage.setItem('vp_cart', JSON.stringify(cart));
  updateCartBadge();
}

function addToCart(id) {
  const med  = MEDICINES.find(m => m.id === id);
  if (!med) return;
  const cart = getCart();
  const idx  = cart.findIndex(i => i.id === id);
  if (idx > -1) {
    cart[idx].qty += 1;
  } else {
    cart.push({ ...med, qty: 1 });
  }
  saveCart(cart);
  showToast(`${med.name}`, 'Added to cart! 🛒');
  updateAddButton(id);
}

function removeFromCart(id) {
  const cart = getCart().filter(i => i.id !== id);
  saveCart(cart);
}

function updateQty(id, delta) {
  const cart = getCart();
  const idx  = cart.findIndex(i => i.id === id);
  if (idx === -1) return;
  cart[idx].qty = Math.max(1, cart[idx].qty + delta);
  saveCart(cart);
  renderCart();
}

function clearCart() {
  saveCart([]);
  renderCart();
}

// ── Cart Badge (shown in navbar) ───────────────────
function updateCartBadge() {
  const cart  = getCart();
  const total = cart.reduce((s, i) => s + i.qty, 0);
  document.querySelectorAll('.cart-badge').forEach(el => {
    el.textContent = total;
    el.style.display = total > 0 ? 'flex' : 'none';
  });
}

// ── Toast Notification ─────────────────────────────
function showToast(title, msg, type = 'success') {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    toast.innerHTML = `
      <span class="toast-icon">✅</span>
      <div class="toast-text">
        <div class="toast-title"></div>
        <div class="toast-msg"></div>
      </div>
      <button class="toast-close" onclick="hideToast()">✕</button>`;
    document.body.appendChild(toast);
  }
  toast.querySelector('.toast-title').textContent = title;
  toast.querySelector('.toast-msg').textContent   = msg;
  toast.querySelector('.toast-icon').textContent  = type === 'success' ? '✅' : 'ℹ️';
  toast.classList.add('show');
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(hideToast, 3200);
}

function hideToast() {
  const t = document.getElementById('toast');
  if (t) t.classList.remove('show');
}

// ── Update add button state ────────────────────────
function updateAddButton(id) {
  const btn = document.querySelector(`.btn-add[data-id="${id}"]`);
  if (!btn) return;
  const inCart = getCart().some(i => i.id === id);
  btn.classList.toggle('added', inCart);
  btn.innerHTML = inCart ? '✔ In Cart' : '+ Add';
}

function updateAllButtons() {
  document.querySelectorAll('.btn-add[data-id]').forEach(btn => {
    updateAddButton(Number(btn.dataset.id));
  });
}

// ── Render Medicine Cards ──────────────────────────
function renderMedicines(list, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (list.length === 0) {
    container.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:60px 20px;color:var(--gray-400)">
        <div style="font-size:3rem;margin-bottom:12px">🔍</div>
        <h3 style="color:var(--gray-600);margin-bottom:6px">No medicines found</h3>
        <p>Try a different search term or category</p>
      </div>`;
    return;
  }

  const badgeClass = { 'Rx': 'rx', 'SALE': 'sale', 'OTC': '' };

  container.innerHTML = list.map(m => `
    <div class="medicine-card">
      <div class="med-img">
        <span style="font-size:3.2rem">${m.emoji}</span>
        <span class="med-badge ${badgeClass[m.badge] || ''}">${m.badge}</span>
      </div>
      <div class="med-body">
        <div class="med-category">${m.category}</div>
        <div class="med-name">${m.name}</div>
        <div class="med-desc">${m.desc}</div>
        <div class="med-footer">
          <div class="med-price">
            ₹${m.price}
            ${m.original ? `<span class="original">₹${m.original}</span>` : ''}
          </div>
          <button class="btn-add" data-id="${m.id}" onclick="addToCart(${m.id})">
            + Add
          </button>
        </div>
      </div>
    </div>`).join('');

  updateAllButtons();
}

// ── Render Cart ────────────────────────────────────
function renderCart() {
  const container = document.getElementById('cart-items');
  const emptyBox  = document.getElementById('cart-empty');
  const summaryEl = document.getElementById('cart-summary');
  if (!container) return;

  const cart = getCart();

  if (cart.length === 0) {
    container.innerHTML = '';
    if (emptyBox)  emptyBox.style.display = 'block';
    if (summaryEl) summaryEl.style.display = 'none';
    updateSummary(0, 0);
    return;
  }

  if (emptyBox)  emptyBox.style.display = 'none';
  if (summaryEl) summaryEl.style.display = 'block';

  container.innerHTML = cart.map(item => `
    <div class="cart-item" id="ci-${item.id}">
      <div class="cart-item-img">${item.emoji}</div>
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <p>${item.category} • ₹${item.price} each</p>
      </div>
      <div class="cart-item-controls">
        <button class="qty-btn" onclick="updateQty(${item.id}, -1)">−</button>
        <span class="qty-display">${item.qty}</span>
        <button class="qty-btn" onclick="updateQty(${item.id}, 1)">+</button>
      </div>
      <div class="cart-item-price">₹${item.price * item.qty}</div>
      <button class="remove-btn" onclick="removeItemFromCart(${item.id})" title="Remove">🗑️</button>
    </div>`).join('');

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const items    = cart.reduce((s, i) => s + i.qty, 0);
  updateSummary(subtotal, items);
}

function removeItemFromCart(id) {
  removeFromCart(id);
  renderCart();
  showToast('Removed', 'Item removed from cart', 'info');
}

function updateSummary(subtotal, items) {
  const delivery = subtotal > 500 ? 0 : 40;
  const discount = subtotal > 300 ? Math.round(subtotal * 0.05) : 0;
  const total    = subtotal + delivery - discount;
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set('sum-items',    `${items} item${items !== 1 ? 's' : ''}`);
  set('sum-subtotal', `₹${subtotal}`);
  set('sum-delivery', delivery === 0 ? 'FREE' : `₹${delivery}`);
  set('sum-discount', discount > 0 ? `-₹${discount}` : '₹0');
  set('sum-total',    `₹${total}`);
}

// ── Search Filter ──────────────────────────────────
function initSearch() {
  const input    = document.getElementById('med-search');
  const catSel   = document.getElementById('cat-filter');
  const countEl  = document.getElementById('results-count');

  function doFilter() {
    const q   = (input   ? input.value.toLowerCase()   : '');
    const cat = (catSel  ? catSel.value                : '');
    let result = MEDICINES.filter(m =>
      (!q   || m.name.toLowerCase().includes(q) || m.category.toLowerCase().includes(q) || m.desc.toLowerCase().includes(q)) &&
      (!cat || m.category === cat)
    );
    renderMedicines(result, 'medicines-grid');
    if (countEl) countEl.textContent = `Showing ${result.length} medicines`;
  }

  if (input)  input.addEventListener('input', doFilter);
  if (catSel) catSel.addEventListener('change', doFilter);

  // Hero search → redirect to medicines with query
  const heroInput = document.getElementById('hero-search');
  const heroBtn   = document.getElementById('hero-search-btn');
  if (heroBtn && heroInput) {
    heroBtn.addEventListener('click', () => {
      if (heroInput.value.trim())
        window.location.href = `medicines.html?q=${encodeURIComponent(heroInput.value.trim())}`;
      else
        window.location.href = 'medicines.html';
    });
    heroInput.addEventListener('keydown', e => { if (e.key === 'Enter') heroBtn.click(); });
  }

  // Quick links on hero
  document.querySelectorAll('.quick-link').forEach(btn => {
    btn.addEventListener('click', () => {
      window.location.href = `medicines.html?cat=${encodeURIComponent(btn.dataset.cat)}`;
    });
  });

  // On medicines page: read URL params
  const params = new URLSearchParams(window.location.search);
  if (params.has('q') && input) {
    input.value = params.get('q');
  }
  if (params.has('cat') && catSel) {
    catSel.value = params.get('cat');
  }
  if (input || catSel) doFilter();
}

// ── Prescription Upload ────────────────────────────
function initPrescription() {
  const zone    = document.getElementById('upload-zone');
  const input   = document.getElementById('rx-file');
  const preview = document.getElementById('file-preview');
  const fname   = document.getElementById('file-name');
  const rmBtn   = document.getElementById('remove-file');
  const form    = document.getElementById('rx-form');

  if (!zone) return;

  // Drag & drop effects
  ['dragenter','dragover'].forEach(ev => zone.addEventListener(ev, e => { e.preventDefault(); zone.classList.add('drag-over'); }));
  ['dragleave','drop'].forEach(ev =>   zone.addEventListener(ev, e => { e.preventDefault(); zone.classList.remove('drag-over'); }));
  zone.addEventListener('drop', e => {
    const file = e.dataTransfer.files[0];
    if (file) showFilePreview(file);
  });

  if (input) input.addEventListener('change', () => {
    if (input.files[0]) showFilePreview(input.files[0]);
  });

  function showFilePreview(file) {
    if (fname)   fname.textContent = `${file.name} (${(file.size/1024).toFixed(1)} KB)`;
    if (preview) preview.classList.add('show');
  }

  if (rmBtn) rmBtn.addEventListener('click', () => {
    if (input)   input.value = '';
    if (preview) preview.classList.remove('show');
  });

  if (form) form.addEventListener('submit', e => {
    e.preventDefault();
    showToast('Prescription submitted!', 'Our pharmacist will review it shortly. ✅');
    setTimeout(() => { form.reset(); if (preview) preview.classList.remove('show'); }, 500);
  });
}

// ── Contact Form ───────────────────────────────────
function initContact() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    showToast('Message sent!', "We'll get back to you within 24 hours.");
    form.reset();
  });
}

// ── Mobile Hamburger ───────────────────────────────
function initHamburger() {
  const btn = document.getElementById('hamburger');
  const nav = document.getElementById('mobile-nav');
  if (!btn || !nav) return;
  btn.addEventListener('click', () => {
    nav.classList.toggle('open');
  });
}

// ── Checkout Button ────────────────────────────────
function initCheckout() {
  const btn = document.getElementById('checkout-btn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const cart = getCart();
    if (cart.length === 0) {
      showToast('Cart is empty', 'Add some medicines first!', 'info');
      return;
    }
    showToast('Order placed! 🎉', 'Thank you. We will deliver soon!');
    saveCart([]);
    setTimeout(() => { renderCart(); }, 500);
  });
}

// ── Active Nav Link ────────────────────────────────
function setActiveNav() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === page);
  });
}

// ── Init on DOM ready ──────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
  setActiveNav();
  initHamburger();
  initSearch();
  initPrescription();
  initContact();
  initCheckout();

  // Home page featured medicines
  const featured = document.getElementById('featured-grid');
  if (featured) renderMedicines(MEDICINES.slice(0, 8), 'featured-grid');

  // Medicines page
  const medGrid = document.getElementById('medicines-grid');
  if (medGrid) renderMedicines(MEDICINES, 'medicines-grid');

  // Cart page
  renderCart();
});
