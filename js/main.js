let carrinho = [];
let tipoEntrega = 'entrega';
let modalProduto = null;
let modalIndex = 0;
let filtroAtivo = 'todos';

const WHATSAPP = CONFIG.WHATSAPP;
const FRETE = CONFIG.FRETE;

function $(id) { return document.getElementById(id); }
function qs(s) { return document.querySelector(s); }
function qsa(s) { return document.querySelectorAll(s); }

function formatPreco(v) { return 'R$ ' + v.toFixed(2).replace('.', ','); }

// ====== PAGE NAVIGATION ======
function showHome() {
  $('page-home').style.display = 'block';
  $('page-catalog').classList.remove('active');
  $('page-admin').classList.remove('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showCatalog(filtro) {
  if (filtro) filtroAtivo = filtro;
  $('page-home').style.display = 'none';
  $('page-catalog').classList.add('active');
  $('page-admin').classList.remove('active');
  document.body.classList.remove('admin-ativo');
  mostrarCarrinho();
  pararTodosCarrosseis();
  renderCatalog();
  const btnAdmin = document.querySelector('.catalog-admin-back');
  if (btnAdmin) btnAdmin.style.display = sessionStorage.getItem('adminLogado') ? 'flex' : 'none';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ====== HEADER SCROLL ======
window.addEventListener('scroll', () => {
  $('siteHeader').classList.toggle('scrolled', window.scrollY > 60);
});

// ====== MOBILE NAV ======
function openMobileNav() {
  $('mobileNav').classList.add('open');
  $('mobileOverlay').classList.add('open');
}
function closeMobileNav() {
  $('mobileNav')?.classList.remove('open');
  $('mobileOverlay')?.classList.remove('open');
}

// ====== CARD CAROUSEL ======
const carrosseisAtivos = new Map();

function pararTodosCarrosseis() {
  carrosseisAtivos.forEach((timer) => clearInterval(timer));
  carrosseisAtivos.clear();
}

function iniciarCarrossel(cardEl, imagens) {
  const timer = setInterval(() => {
    if (cardEl.dataset.carrosselPausado === 'true') return;
    const dots = cardEl.querySelectorAll('.prod-card-carousel-dot');
    const imgs = cardEl.querySelectorAll('.prod-card-carousel-img');
    if (!imgs.length) return;
    let atual = parseInt(cardEl.dataset.carrosselIndex || '0', 10);
    const prox = (atual + 1) % imgs.length;
    imgs[atual].classList.remove('active');
    imgs[prox].classList.add('active');
    dots[atual]?.classList.remove('active');
    dots[prox]?.classList.add('active');
    cardEl.dataset.carrosselIndex = prox;
  }, 4000);

  cardEl.addEventListener('mouseenter', () => { cardEl.dataset.carrosselPausado = 'true'; }, { passive: true });
  cardEl.addEventListener('mouseleave', () => { cardEl.dataset.carrosselPausado = 'false'; }, { passive: true });

  // swipe
  let startX = 0;
  cardEl.addEventListener('touchstart', (e) => {
    startX = e.changedTouches[0].screenX;
  }, { passive: true });
  cardEl.addEventListener('touchend', (e) => {
    const delta = startX - e.changedTouches[0].screenX;
    const imgs = cardEl.querySelectorAll('.prod-card-carousel-img');
    const dots = cardEl.querySelectorAll('.prod-card-carousel-dot');
    if (!imgs.length) return;
    let atual = parseInt(cardEl.dataset.carrosselIndex || '0', 10);
    let prox;
    if (Math.abs(delta) > 40) {
      prox = delta > 0 ? (atual + 1) % imgs.length : (atual - 1 + imgs.length) % imgs.length;
      imgs[atual].classList.remove('active');
      imgs[prox].classList.add('active');
      dots[atual]?.classList.remove('active');
      dots[prox]?.classList.add('active');
      cardEl.dataset.carrosselIndex = prox;
    }
  }, { passive: true });

  carrosseisAtivos.set(cardEl.dataset.cardId, timer);
}

function irFotoCard(cardEl, i) {
  const imgs = cardEl.querySelectorAll('.prod-card-carousel-img');
  const dots = cardEl.querySelectorAll('.prod-card-carousel-dot');
  if (!imgs.length) return;
  imgs.forEach(el => el.classList.remove('active'));
  imgs[i].classList.add('active');
  dots.forEach(el => el.classList.remove('active'));
  dots[i].classList.add('active');
  cardEl.dataset.carrosselIndex = i;
}
function pularFotoCard(cardEl, delta) {
  const imgs = cardEl.querySelectorAll('.prod-card-carousel-img');
  const dots = cardEl.querySelectorAll('.prod-card-carousel-dot');
  if (!imgs.length) return;
  let atual = parseInt(cardEl.dataset.carrosselIndex || '0', 10);
  const prox = (atual + delta + imgs.length) % imgs.length;
  imgs[atual].classList.remove('active');
  imgs[prox].classList.add('active');
  dots[atual]?.classList.remove('active');
  dots[prox]?.classList.add('active');
  cardEl.dataset.carrosselIndex = prox;
}

// ====== FEATURED + CATALOG ======
function renderFeatured() {
  const g = $('featuredGrid');
  if (!g) return;
  const ativos = produtos.filter(p => p.disponivel);
  const dest = ativos.filter(p => p.destaque).length >= 6
    ? ativos.filter(p => p.destaque).slice(0, 6)
    : ativos.slice(0, 6);
  g.innerHTML = dest.map(p => cardHTML(p)).join('');
  dest.forEach(p => {
    const el = document.querySelector(`.prod-card[data-card-id="${p.id}"]`);
    if (el) iniciarCarrossel(el, p.imagens);
  });
}

function cardHTML(p) {
  const imgs = p.imagens.length ? p.imagens : ['https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&h=400&q=80'];
  const imgsHTML = imgs.map((src, i) =>
    `<img class="prod-card-carousel-img${i === 0 ? ' active' : ''}" src="${src}" alt="${p.nome}" loading="lazy">`
  ).join('');
  const dotsHTML = imgs.map((_, i) =>
    `<button class="prod-card-carousel-dot${i === 0 ? ' active' : ''}" onclick="event.stopPropagation();irFotoCard(this.closest('.prod-card'), ${i})"></button>`
  ).join('');

  return `<div class="prod-card" data-card-id="${p.id}" data-carrossel-index="0" data-carrossel-pausado="false">
    <div class="prod-card-carousel" onclick="event.stopPropagation();abrirModal('${p.id}')">
      <div class="prod-card-carousel-inner">
        ${imgsHTML}
      </div>
      <div class="prod-card-carousel-dots">${dotsHTML}</div>
    </div>
    <div class="prod-card-body">
      <div class="prod-card-cat">${p.categoria}</div>
      <div class="prod-card-nome">${p.nome}</div>
      <div class="prod-card-desc">${p.descricao || ''}</div>
      <div class="prod-card-preco">${formatPreco(p.preco)}</div>
      <div class="prod-card-qtd">
        <button onclick="event.stopPropagation();mudarQtd(this, -1)">−</button>
        <span class="qtd-value">1</span>
        <button onclick="event.stopPropagation();mudarQtd(this, 1)">+</button>
      </div>
      <button class="prod-card-add" onclick="event.stopPropagation();addCarrinhoCard(this, '${p.id}')">Adicionar</button>
    </div>
  </div>`;
}

function mudarQtd(btn, delta) {
  const span = btn.parentElement.querySelector('.qtd-value');
  if (!span) return;
  let val = parseInt(span.textContent, 10) || 1;
  val = Math.max(1, val + delta);
  span.textContent = val;
}

function addCarrinhoCard(btn, id) {
  const qtdSpan = btn.parentElement.querySelector('.qtd-value');
  const qtd = qtdSpan ? parseInt(qtdSpan.textContent, 10) || 1 : 1;
  addCarrinho(Number(id), qtd);
  qtdSpan.textContent = 1;
}

// ====== CATALOG ======
function renderCatalog() {
  const g = $('catalogGrid');
  const f = $('catalogFilters');
  if (!g) return;

  const ativos = produtos.filter(p => p.disponivel);

  const cats = ['todos', ...new Set(ativos.map(p => p.categoria))];
  if (f) {
    f.innerHTML = cats.map(c =>
      `<button class="filter-btn${c === filtroAtivo ? ' active' : ''}" data-cat="${c}" onclick="filtrarCatalogo('${c}')">
        ${c === 'todos' ? 'Todas' : c.charAt(0).toUpperCase() + c.slice(1)}
      </button>`
    ).join('');
  }

  const visiveis = filtroAtivo === 'todos'
    ? ativos
    : ativos.filter(p => p.categoria === filtroAtivo);

  g.innerHTML = visiveis.map(p => cardHTML(p)).join('');
  visiveis.forEach(p => {
    const el = document.querySelector(`.catalog-grid .prod-card[data-card-id="${p.id}"]`);
    if (el) iniciarCarrossel(el, p.imagens);
  });
}

function filtrarCatalogo(cat) {
  filtroAtivo = cat;
  if ($('page-catalog').classList.contains('active')) {
    pararTodosCarrosseis();
    renderCatalog();
  } else {
    showCatalog();
  }
}

// ====== PRODUCT MODAL ======
function abrirModal(id) {
  id = Number(id);
  const p = produtos.find(x => x.id === id);
  if (!p) return;
  modalProduto = p;
  modalIndex = 0;

  $('modalCat').textContent = p.categoria.toUpperCase();
  $('modalNome').textContent = p.nome;
  $('modalPreco').textContent = formatPreco(p.preco);
  $('modalDesc').textContent = p.descricao || 'Produto selecionado com todo carinho para você.';
  $('modalBtn').onclick = () => { addCarrinho(p.id); };

  renderCarrossel(p);
  $('modalOverlay').classList.add('open');
  $('productModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  $('modalOverlay').classList.remove('open');
  $('productModal').classList.remove('open');
  document.body.style.overflow = '';
}

function renderCarrossel(p) {
  const imgs = p.imagens.length ? p.imagens : ['https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&h=400&q=80'];
  $('modalCarousel').innerHTML = imgs.map((src, i) =>
    `<img class="modal-carousel-img${i === 0 ? ' active' : ''}" src="${src}" alt="${p.nome}">`
  ).join('');
  $('modalThumbs').innerHTML = imgs.map((_, i) =>
    `<button class="modal-thumb-dot${i === 0 ? ' active' : ''}" onclick="irFotoModal(${i})"></button>`
  ).join('');
  modalIndex = 0;
}

function modalPrev() {
  if (!modalProduto) return;
  modalIndex = (modalIndex - 1 + modalProduto.imagens.length) % modalProduto.imagens.length;
  atualizarModalImg(modalProduto.imagens);
}
function modalNext() {
  if (!modalProduto) return;
  modalIndex = (modalIndex + 1) % modalProduto.imagens.length;
  atualizarModalImg(modalProduto.imagens);
}
function irFotoModal(i) {
  if (!modalProduto) return;
  modalIndex = i;
  atualizarModalImg(modalProduto.imagens);
}
function atualizarModalImg(imgs) {
  qsa('.modal-carousel-img').forEach((el, i) => el.classList.toggle('active', i === modalIndex));
  qsa('.modal-thumb-dot').forEach((el, i) => el.classList.toggle('active', i === modalIndex));
}

// keyboard nav
document.addEventListener('keydown', e => {
  if ($('productModal').classList.contains('open')) {
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowLeft') modalPrev();
    if (e.key === 'ArrowRight') modalNext();
  }
  if ($('cartDrawer').classList.contains('open') && e.key === 'Escape') closeCart();
});

// ====== CART ======
function addCarrinho(id, qtd) {
  id = Number(id);
  qtd = qtd || 1;
  const p = produtos.find(x => x.id === id);
  if (!p) return;
  const exist = carrinho.find(c => c.id === id);
  if (exist) { exist.qtd += qtd; }
  else { carrinho.push({ ...p, qtd }); }
  atualizarCarrinho();
  closeModal();
  animarCarrinho();
  mostrarNotificacao(p.nome);
}

function mostrarNotificacao(nomeProduto) {
  let toast = $('cartToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'cartToast';
    toast.className = 'cart-toast';
    document.body.appendChild(toast);
  }
  toast.textContent = '✓ ' + nomeProduto + ' adicionado ao carrinho';
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 2500);
}

function removerCarrinho(id) {
  id = Number(id);
  carrinho = carrinho.filter(c => c.id !== id);
  atualizarCarrinho();
}

function limparCarrinho() {
  carrinho = [];
  atualizarCarrinho();
}

function alterarQtd(id, delta) {
  id = Number(id);
  const item = carrinho.find(c => c.id === id);
  if (!item) return;
  item.qtd = Math.max(1, item.qtd + delta);
  atualizarCarrinho();
}

function totalCarrinho() {
  const sub = carrinho.reduce((acc, c) => acc + c.preco * c.qtd, 0);
  return carrinho.length ? sub + (tipoEntrega === 'entrega' ? FRETE : 0) : 0;
}

function atualizarCarrinho() {
  const qtd = carrinho.reduce((a, c) => a + c.qtd, 0);
  const c1 = $('cartCount');
  const c2 = $('mobileCartCount');
  if (c1) c1.textContent = qtd;
  if (c2) c2.textContent = qtd;

  const items = $('cartItems');
  const total = $('cartTotal');
  const subtotal = $('cartSubtotal');
  const freteLine = $('cartFrete');
  if (!items) return;

  if (!carrinho.length) {
    items.innerHTML = '<div class="cart-empty">Seu carrinho está vazio</div>';
    if (subtotal) subtotal.textContent = 'R$ 0,00';
    if (total) total.textContent = 'R$ 0,00';
    if (freteLine) freteLine.style.display = 'none';
    return;
  }

  items.innerHTML = carrinho.map(c => {
    const sub = c.preco * c.qtd;
    return `<div class="cart-item">
      <img class="cart-item-img" src="${c.imagens[0]}" alt="${c.nome}">
      <div class="cart-item-info">
        <div class="cart-item-nome">${c.nome}</div>
        <div class="cart-item-preco">${formatPreco(c.preco)}</div>
        <div class="cart-item-subtotal">${c.qtd} × ${formatPreco(c.preco)} = ${formatPreco(sub)}</div>
        <div class="cart-item-qtd">
          <button onclick="alterarQtd('${c.id}',-1)">−</button>
          <span>${c.qtd}</span>
          <button onclick="alterarQtd('${c.id}',1)">+</button>
        </div>
      </div>
      <button class="cart-item-remove" onclick="removerCarrinho('${c.id}')">✕</button>
    </div>`;
  }).join('');

  const entregaRadios = document.querySelector('input[name="tipoEntrega"]:checked');
  if (entregaRadios) tipoEntrega = entregaRadios.value;

  const enderecoEl = $('cartEndereco');
  if (enderecoEl) enderecoEl.style.display = tipoEntrega === 'entrega' ? 'block' : 'none';

  if (freteLine) freteLine.style.display = tipoEntrega === 'entrega' ? 'flex' : 'none';
  if (subtotal) subtotal.textContent = formatPreco(totalCarrinho() - (tipoEntrega === 'entrega' ? FRETE : 0));
  if (total) total.textContent = formatPreco(totalCarrinho());
}

function animarCarrinho() {
  const c1 = $('cartCount');
  const c2 = $('mobileCartCount');
  [c1, c2].forEach(el => {
    if (!el) return;
    el.parentElement.classList.add('cart-bounce');
    setTimeout(() => el.parentElement.classList.remove('cart-bounce'), 600);
  });
}

function openCart() {
  $('cartOverlay').classList.add('open');
  $('cartDrawer').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  $('cartOverlay').classList.remove('open');
  $('cartDrawer').classList.remove('open');
  document.body.style.overflow = '';
}

function finalizarPedido() {
  if (!carrinho.length) return;
  const endereco = $('cartEndereco')?.value.trim();
  const entregaTexto = tipoEntrega === 'entrega' ? '🚚 Entrega' : '📍 Retirar no local';
  let msg = '🛍️ *NOVO PEDIDO*\n\n';
  msg += `${entregaTexto}\n`;
  if (tipoEntrega === 'entrega') {
    if (!endereco) { mostrarNotificacao('Informe seu endereço para entrega'); return; }
    msg += `Endereço: ${endereco}\n`;
  }
  msg += '\nProdutos:\n';
  [...carrinho].forEach(c => {
    msg += `• ${c.nome} — ${c.qtd}x ${formatPreco(c.preco)}\n`;
  });
  msg += `\nTotal: ${formatPreco(totalCarrinho())}\n\n`;
  msg += 'Aguardo o envio da chave Pix para pagamento. Obrigado!';
  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, '_blank');
}

// ====== ADMIN ======
const ADMIN_HASH = CONFIG.ADMIN_HASH;

let adminTentativas = 0;
const ADMIN_MAX_TENTATIVAS = CONFIG.ADMIN_MAX_TENTATIVAS;
const ADMIN_BLOCO_MS = CONFIG.ADMIN_BLOCO_MS;
let adminBloqueadoAte = 0;
let adminTimerInterval = null;

function logAdmin(tipo, detalhes) {
  const agora = new Date().toISOString();
  const entrada = `[${agora}] ADMIN Login: ${tipo}`;
  if (detalhes) console.warn(`${entrada} — ${detalhes}`);
  else console.log(entrada);
}

function sanitizar(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

function escaparParaHTML(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

async function hashSHA256(texto) {
  const encoder = new TextEncoder();
  const data = encoder.encode(texto);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function iniciarTimerBloqueio(err, btn) {
  if (adminTimerInterval) clearInterval(adminTimerInterval);
  adminTimerInterval = setInterval(() => {
    const restante = Math.ceil((adminBloqueadoAte - Date.now()) / 1000);
    if (restante <= 0) {
      clearInterval(adminTimerInterval);
      adminTimerInterval = null;
      err.style.display = 'none';
      btn.disabled = false;
      btn.textContent = 'Entrar';
      logAdmin('desbloqueado');
      return;
    }
    err.textContent = `Bloqueado. Aguarde ${restante}s...`;
    btn.disabled = true;
    btn.textContent = `Aguarde ${restante}s`;
  }, 1000);
}

async function loginAdmin() {
  const pass = $('adminPass');
  const err = $('adminError');
  const btn = $('adminLoginBtn');

  const agora = Date.now();
  if (agora < adminBloqueadoAte) {
    const segundos = Math.ceil((adminBloqueadoAte - agora) / 1000);
    err.textContent = `Bloqueado. Aguarde ${segundos}s...`;
    err.style.display = 'block';
    return;
  }

  if (!pass.value.trim()) {
    err.textContent = 'Informe a senha';
    err.style.display = 'block';
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Verificando...';

  const hash = await hashSHA256(pass.value);

  if (hash === ADMIN_HASH) {
    adminTentativas = 0;
    $('adminLogin').style.display = 'none';
    $('adminPanel').style.display = 'block';
    err.style.display = 'none';
    logAdmin('sucesso');
    sessionStorage.setItem('adminLogado', 'true');
    renderAdmin();
  } else {
    adminTentativas++;
    logAdmin('falha', `Tentativa ${adminTentativas}/${ADMIN_MAX_TENTATIVAS}`);

    if (adminTentativas >= ADMIN_MAX_TENTATIVAS) {
      adminBloqueadoAte = Date.now() + ADMIN_BLOCO_MS;
      adminTentativas = 0;
      logAdmin('bloqueado', `Bloqueado por ${ADMIN_BLOCO_MS / 1000}s`);
      err.style.display = 'block';
      iniciarTimerBloqueio(err, btn);
      pass.value = '';
      return;
    } else {
      err.textContent = `Senha incorreta (${adminTentativas}/${ADMIN_MAX_TENTATIVAS})`;
    }
    err.style.display = 'block';
    pass.value = '';
    pass.focus();
  }

  btn.disabled = false;
  btn.textContent = 'Entrar';
}

function logoutAdmin() {
  $('adminLogin').style.display = 'block';
  $('adminPanel').style.display = 'none';
  $('adminPass').value = '';
  $('adminError').style.display = 'none';
  sessionStorage.removeItem('adminLogado');
  const btn = document.querySelector('.catalog-admin-back');
  if (btn) btn.style.display = 'none';
}

function renderAdmin() {
  const g = $('adminGrid');
  if (!g) return;
  g.innerHTML = carregarProdutos().map(prod => `
    <div class="admin-card">
      <img src="${escaparParaHTML(prod.imagens[0])}" alt="${escaparParaHTML(prod.nome)}">
      <div class="admin-card-info">
        <h4>${escaparParaHTML(prod.nome)}</h4>
        <span>${escaparParaHTML(prod.categoria)}</span>
      </div>
      <input type="number" step="0.01" value="${typeof prod.preco === 'number' ? prod.preco.toFixed(2) : '0.00'}" data-id="${prod.id}" class="admin-input-preco">
      <button class="admin-btn admin-btn-toggle" onclick="toggleStatus('${prod.id}')">${prod.disponivel ? 'Esgotar' : 'Disponível'}</button>
      <button class="admin-btn admin-btn-images" onclick="editarImagens('${prod.id}')">Imagens</button>
      <span class="admin-status ${prod.disponivel ? 'disp' : 'indisp'}">${prod.disponivel ? 'Ativo' : 'Inativo'}</span>
    </div>`).join('');
}

function toggleStatus(id) {
  id = Number(id);
  if (isNaN(id)) return;
  const p = produtos.find(x => x.id === id);
  if (p) { p.disponivel = !p.disponivel; salvarLocal(); renderAdmin(); }
}

function editarImagens(id) {
  id = Number(id);
  if (isNaN(id)) return;
  const p = produtos.find(x => x.id === id);
  if (!p) return;

  let modal = $('adminImageModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'adminImageModal';
    modal.className = 'admin-image-modal';
    modal.innerHTML = `
      <div class="admin-image-modal-overlay" onclick="fecharModalImagens()"></div>
      <div class="admin-image-modal-content">
        <div class="admin-image-modal-header">
          <h3>Editar Imagens</h3>
          <button onclick="fecharModalImagens()">✕</button>
        </div>
        <div class="admin-image-modal-body">
          <div id="adminImageGrid" class="admin-image-grid"></div>
          <label class="admin-image-add-btn">
            + Adicionar Imagem
            <input type="file" id="adminImageInput" accept="image/*" multiple style="display:none" onchange="adicionarImagensArquivo(this)">
          </label>
        </div>
        <div class="admin-image-modal-footer">
          <button class="btn btn-outline" onclick="fecharModalImagens()">Cancelar</button>
          <button class="btn btn-primary" onclick="salvarImagensProduto()">Salvar</button>
        </div>
      </div>`;
    document.body.appendChild(modal);
  }

  window._editandoImagensId = id;
  window._imagensEditando = [...p.imagens];
  renderizarGridImagens();
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function renderizarGridImagens() {
  const grid = $('adminImageGrid');
  if (!grid) return;
  grid.innerHTML = window._imagensEditando.map((src, i) => `
    <div class="admin-image-item">
      <img src="${src}" alt="Imagem ${i + 1}">
      <button class="admin-image-remove" onclick="removerImagemEditando(${i})">✕</button>
    </div>`).join('');
}

function adicionarImagensArquivo(input) {
  const files = Array.from(input.files);
  files.forEach(file => {
    const reader = new FileReader();
    reader.onload = (e) => {
      window._imagensEditando.push(e.target.result);
      renderizarGridImagens();
    };
    reader.readAsDataURL(file);
  });
  input.value = '';
}

function removerImagemEditando(index) {
  window._imagensEditando.splice(index, 1);
  renderizarGridImagens();
}

function fecharModalImagens() {
  const modal = $('adminImageModal');
  if (modal) modal.classList.remove('open');
  document.body.style.overflow = '';
  window._editandoImagensId = null;
  window._imagensEditando = null;
}

function salvarImagensProduto() {
  const id = window._editandoImagensId;
  if (id == null) return;
  const p = produtos.find(x => x.id === id);
  if (!p) return;
  p.imagens = window._imagensEditando.length ? window._imagensEditando : ['https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&h=400&q=80'];
  salvarLocal();
  renderAdmin();
  fecharModalImagens();
}

function salvarAdmin() {
  qsa('.admin-input-preco').forEach(inp => {
    const id = Number(inp.dataset.id);
    if (isNaN(id)) return;
    const p = produtos.find(x => x.id === id);
    if (p) {
      const val = parseFloat(inp.value);
      p.preco = isNaN(val) || val < 0 ? p.preco : val;
    }
  });
  salvarLocal();
  renderAdmin();
  pararTodosCarrosseis();
  renderCatalog();
  renderFeatured();
  alert('Alterações salvas!');
}

function salvarLocal() {
  localStorage.setItem('emb_produtos', JSON.stringify(produtos));
}

function carregarProdutos() {
  if (!localStorage.getItem('emb_produtos')) {
    produtos.length = 0;
    const padrao = typeof PRODUTOS_PADRAO !== 'undefined' ? PRODUTOS_PADRAO : [];
    produtos.push(...JSON.parse(JSON.stringify(padrao)));
    localStorage.setItem('emb_produtos', JSON.stringify(produtos));
    return produtos;
  }
  try {
    const parsed = JSON.parse(localStorage.getItem('emb_produtos'));
    produtos.length = 0;
    produtos.push(...parsed);
  } catch(e) {
    const padrao = typeof PRODUTOS_PADRAO !== 'undefined' ? PRODUTOS_PADRAO : [];
    produtos.push(...JSON.parse(JSON.stringify(padrao)));
  }
  return produtos;
}

// ====== HASH ROUTER ======
let carrinhoArmazenado = null;

function esconderCarrinho() {
  const overlay = $('cartOverlay');
  const drawer = $('cartDrawer');
  const linkDesktop = document.querySelector('.cart-link');
  const linkMobile = document.querySelector('.mobile-nav a[onclick*="openCart"]');
  if (overlay) { carrinhoArmazenado = { overlay, overlayNext: overlay.nextSibling, drawer, drawerNext: drawer.nextSibling, linkDesktop, linkDesktopNext: linkDesktop?.nextSibling, linkMobile, linkMobileNext: linkMobile?.nextSibling }; overlay.remove(); drawer.remove(); linkDesktop?.remove(); linkMobile?.remove(); }
}

function mostrarCarrinho() {
  if (!carrinhoArmazenado) return;
  const { overlay, overlayNext, drawer, drawerNext, linkDesktop, linkDesktopNext, linkMobile, linkMobileNext } = carrinhoArmazenado;
  if (overlayNext?.parentNode) overlayNext.parentNode.insertBefore(overlay, overlayNext); else document.body.appendChild(overlay);
  if (drawerNext?.parentNode) drawerNext.parentNode.insertBefore(drawer, drawerNext); else document.body.appendChild(drawer);
  const headerNav = document.querySelector('.header-nav');
  if (linkDesktop && headerNav) { if (linkDesktopNext?.parentNode === headerNav) headerNav.insertBefore(linkDesktop, linkDesktopNext); else headerNav.appendChild(linkDesktop); }
  const mobileNav = document.querySelector('.mobile-nav');
  if (linkMobile && mobileNav) { if (linkMobileNext?.parentNode === mobileNav) mobileNav.insertBefore(linkMobile, linkMobileNext); else mobileNav.appendChild(linkMobile); }
  carrinhoArmazenado = null;
}

function rotearHash() {
  const hash = location.hash.slice(1) || 'home';
  if (hash === 'admin') {
    $('page-home').style.display = 'none';
    $('page-catalog').classList.remove('active');
    $('page-admin').classList.add('active');
    document.body.classList.add('admin-ativo');
    esconderCarrinho();
  } else {
    document.body.classList.remove('admin-ativo');
    mostrarCarrinho();
    if (hash === 'catalog') {
      showCatalog();
    } else {
      showHome();
    }
  }
}
window.addEventListener('hashchange', rotearHash);

// ====== INIT ======
document.addEventListener('DOMContentLoaded', () => {
  carregarProdutos();
  renderFeatured();
  renderCatalog();
  atualizarCarrinho();
  $('mobileToggle')?.addEventListener('click', openMobileNav);
  rotearHash();
});
