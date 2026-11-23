/* =========================================================
   Football Kit Shop - script.js
   ※ 상품 · 분류 · 등급 데이터는 이 파일 맨 위 배열에 모여 있습니다.
   ========================================================= */

/* ---------- 1. 분류 ---------- */
const CATEGORIES = [
  { id: "uniform", name: "유니폼" },
  { id: "boots",   name: "축구화" },
  { id: "ball",    name: "축구공" },
  { id: "gear",    name: "축구 용품" }
];

/* ---------- 2. 상품 (예시 8개, 팀 이름·브랜드는 가상) ----------
   brand: 팀 또는 제조사, info: 시즌·규격 등 한 줄 정보, sizes: 고를 수 있는 옵션 */
const PRODUCTS = [
  { id: 1, name: "한강 FC 26/27 홈 유니폼", brand: "한강 FC", info: "26/27 시즌", category: "uniform",
    price: 109000, stock: 30, sizes: ["S", "M", "L", "XL", "XXL"], image: "img/product-1.jpg",
    desc: "로열블루와 네이비 세로 줄무늬의 26/27 시즌 홈 유니폼입니다. 땀이 빨리 마르는 기능성 원단, 레귤러 핏." },
  { id: 2, name: "노르드 시티 26/27 어웨이 유니폼", brand: "노르드 시티", info: "26/27 시즌", category: "uniform",
    price: 109000, stock: 25, sizes: ["S", "M", "L", "XL", "XXL"], image: "img/product-2.jpg",
    desc: "화이트 바탕에 네이비 사선 띠를 넣은 어웨이 유니폼입니다. 브이넥, 레귤러 핏." },
  { id: 3, name: "스프린트 FG 축구화 로열블루", brand: "KIT LAB", info: "천연잔디(FG)용", category: "boots",
    price: 189000, stock: 15, sizes: ["250", "260", "270", "280"], image: "img/product-3.jpg",
    desc: "가벼운 합성 갑피와 원뿔형 스터드로 빠른 방향 전환에 맞춘 스피드형 축구화입니다." },
  { id: 4, name: "컨트롤 AG 축구화 화이트", brand: "KIT LAB", info: "인조잔디(AG)용", category: "boots",
    price: 139000, stock: 18, sizes: ["250", "260", "270", "280"], image: "img/product-4.jpg",
    desc: "인조잔디에 맞춘 짧은 스터드와 부드러운 갑피로 볼 터치가 편한 컨트롤형 축구화입니다." },
  { id: 5, name: "매치 프로 축구공 5호", brand: "KIT LAB", info: "5호 · 시합용", category: "ball",
    price: 59000, stock: 40, sizes: ["5호"], image: "img/product-5.jpg",
    desc: "열 접합 방식의 32패널 시합용 축구공입니다. 성인 경기 규격 5호." },
  { id: 6, name: "풋살공 4호 옐로", brand: "KIT LAB", info: "4호 · 풋살용", category: "ball",
    price: 39000, stock: 35, sizes: ["4호"], image: "img/product-6.jpg",
    desc: "덜 튀도록 만든 풋살 전용 4호 공입니다. 실내·야외 풋살장 모두 사용할 수 있습니다." },
  { id: 7, name: "그립 프로 골키퍼 장갑", brand: "KIT LAB", info: "라텍스 손바닥", category: "gear",
    price: 69000, stock: 20, sizes: ["8", "9", "10"], image: "img/product-7.jpg",
    desc: "4mm 라텍스 손바닥과 손목 스트랩으로 공을 잡을 때 밀리지 않도록 만든 골키퍼 장갑입니다." },
  { id: 8, name: "라이트 정강이 보호대 (1쌍)", brand: "KIT LAB", info: "1쌍 · 경량", category: "gear",
    price: 29000, stock: 50, sizes: ["S", "M", "L"], image: "img/product-8.jpg",
    desc: "가볍고 단단한 쉘과 부드러운 안쪽 쿠션으로 정강이를 보호합니다. 2개 1세트." }
];

/* ---------- 3. 회원 등급 (4단계) ----------
   code : DB(shop_profiles.grade)에 저장되는 값 — WELCOME · SILVER · GOLD · VIP
   name : 화면에 보여 줄 내 쇼핑몰 등급 이름 (화면에서만 바꿔 보여 줌)
   등급과 포인트는 DB 가 관리하므로 화면에서는 읽기만 합니다. */
const GRADES = [
  { code: "WELCOME", name: "루키",   rate: 0.01, color: "#9DB0D6", desc: "가입 즉시 부여" },
  { code: "SILVER",  name: "프로",   rate: 0.03, color: "#6F8FFF", desc: "누적 구매 20만원 이상" },
  { code: "GOLD",    name: "스타",   rate: 0.05, color: "#F5C542", desc: "누적 구매 50만원 이상" },
  { code: "VIP",     name: "레전드", rate: 0.07, color: "#FF8A65", desc: "누적 구매 100만원 이상" }
];

/* ---------- 4. 쇼핑몰 설정 ---------- */
const SETTINGS = {
  signupPoint: 3000,      // 가입 축하 포인트
  minPointUse: 1000,      // 최소 사용 포인트
  freeShipping: 50000,    // 무료배송 기준
  shippingFee: 3000,      // 배송비
  slideTime: 6000         // 슬라이드 넘어가는 시간 (6초)
};


/* =========================================================
   브라우저 저장소 — 장바구니와 재고 계산용 판매 수량만 저장합니다.
   회원 정보 · 비밀번호 · 로그인 상태는 저장하지 않습니다 (Supabase Auth 가 관리).
   ========================================================= */
const LOCAL = {
  load(key, fallback) {
    try {
      const value = localStorage.getItem("fks_" + key);
      return value ? JSON.parse(value) : fallback;
    } catch (e) { return fallback; }
  },
  save(key, value) {
    try { localStorage.setItem("fks_" + key, JSON.stringify(value)); } catch (e) { /* 저장 불가 시 무시 */ }
  },
  getCart()        { return this.load("cart", []); },
  saveCart(cart)   { this.save("cart", cart); },
  getSold()        { return this.load("sold", {}); },     // 상품별 판매 수량 (재고 계산용)
  saveSold(sold)   { this.save("sold", sold); },
  /* 주문 내역은 다음 단계에서 shop_orders 로 옮기기 전까지 회원 id 별로 임시 보관 */
  getOrders(uid)        { return this.load("orders_" + uid, []); },
  saveOrders(uid, list) { this.save("orders_" + uid, list); }
};

/* 예전 버전이 브라우저에 남긴 회원 정보 · 로그인 기록 지우기 */
try { localStorage.removeItem("fks_users"); localStorage.removeItem("fks_session"); } catch (e) { /* 무시 */ }

let authUser = null;     // Supabase Auth 로그인 계정 (없으면 null)
let profile = null;      // shop_profiles 의 내 한 줄 (없으면 null)
let cart = LOCAL.getCart();
let sold = LOCAL.getSold();
let currentCategory = "all";
let searchWord = "";
let afterLogin = null;   // 로그인 후 이어서 할 일 (예: 결제)


/* =========================================================
   공통 함수
   ========================================================= */
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);
const won = (n) => n.toLocaleString("ko-KR") + "원";
const point = (n) => n.toLocaleString("ko-KR") + "P";
const escapeHTML = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const findProduct = (id) => PRODUCTS.find((p) => p.id === id);
const categoryName = (id) => (CATEGORIES.find((c) => c.id === id) || {}).name || "";
const twoDigit = (n) => String(n).padStart(2, "0");
function formatDate(time) {
  const d = new Date(time);
  return `${d.getFullYear()}.${twoDigit(d.getMonth() + 1)}.${twoDigit(d.getDate())} ${twoDigit(d.getHours())}:${twoDigit(d.getMinutes())}`;
}

function stockLeft(product) { return Math.max(0, product.stock - (sold[product.id] || 0)); }
function inCart(productId) { return cart.filter((c) => c.id === productId).reduce((sum, c) => sum + c.qty, 0); }

function currentUser() { return profile; }
function gradeByCode(code) { return GRADES.find((g) => g.code === code) || GRADES[0]; }
function myGrade() { return gradeByCode(profile ? profile.grade : "WELCOME"); }
function gradeBadge(g) { return `<span class="grade-badge" style="background:${g.color}">${g.name}</span>`; }

let toastTimer;
function showToast(message) {
  const t = $("#toast");
  t.textContent = message;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2500);
}

/* =========================================================
   모달 열기 / 닫기
   ========================================================= */
function openModal(id) {
  $("#" + id).classList.add("open");
  document.body.classList.add("no-scroll");
}
function closeModal(id) {
  $("#" + id).classList.remove("open");
  if (id === "authModal" && !profile) afterLogin = null;   // 로그인하지 않고 닫으면 '로그인 후 할 일' 취소
  if (!document.querySelector(".modal.open")) document.body.classList.remove("no-scroll");
}
document.addEventListener("click", (e) => {
  const closer = e.target.closest("[data-close]");
  if (closer) closeModal(closer.closest(".modal").id);
});
document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  const opened = document.querySelectorAll(".modal.open");
  if (opened.length) closeModal(opened[opened.length - 1].id);
});


/* =========================================================
   헤더 메뉴
   ========================================================= */
$("#menuBtn").addEventListener("click", () => {
  const open = $("#nav").classList.toggle("open");
  $("#menuBtn").setAttribute("aria-expanded", open);
});
$("#logoLink").addEventListener("click", (e) => {
  e.preventDefault();
  window.scrollTo({ top: 0 });
});
/* data-category 가 달린 링크: 분류를 바꾸고 상품 목록으로 이동 */
document.addEventListener("click", (e) => {
  const link = e.target.closest("[data-category]");
  if (!link) return;
  e.preventDefault();
  $("#nav").classList.remove("open");
  setCategory(link.dataset.category);
  $("#products").scrollIntoView();
});
$$('#nav a[href="#membership"]').forEach((a) => a.addEventListener("click", () => $("#nav").classList.remove("open")));


/* =========================================================
   메인 슬라이드 (4장, 6초마다 교차)
   ========================================================= */
const slides = $$(".slide");
let slideIndex = 0;
let slideTimer = null;

slides.forEach((_, i) => {
  const dot = document.createElement("button");
  dot.type = "button";
  dot.className = "hero-dot" + (i === 0 ? " active" : "");
  dot.setAttribute("aria-label", `${i + 1}번 슬라이드`);
  dot.innerHTML = "<span></span>";
  dot.addEventListener("click", () => { showSlide(i); restartSlide(); });
  $("#heroDots").appendChild(dot);
});

function showSlide(i) {
  slides[slideIndex].classList.remove("active");
  slideIndex = (i + slides.length) % slides.length;
  slides[slideIndex].classList.add("active");
  $$(".hero-dot").forEach((d, n) => d.classList.toggle("active", n === slideIndex));
}
function restartSlide() {
  clearInterval(slideTimer);
  slideTimer = setInterval(() => showSlide(slideIndex + 1), SETTINGS.slideTime);
}
$("#nextSlide").addEventListener("click", () => { showSlide(slideIndex + 1); restartSlide(); });
$("#prevSlide").addEventListener("click", () => { showSlide(slideIndex - 1); restartSlide(); });
restartSlide();


/* =========================================================
   상품 목록 · 검색 · 분류 필터
   ========================================================= */
function renderFilters() {
  const list = [{ id: "all", name: "전체" }, ...CATEGORIES];
  $("#filters").innerHTML = list.map((c) =>
    `<button type="button" class="filter-btn${c.id === currentCategory ? " active" : ""}" data-filter="${c.id}" aria-pressed="${c.id === currentCategory}">${c.name}</button>`
  ).join("");
}
$("#filters").addEventListener("click", (e) => {
  const btn = e.target.closest("[data-filter]");
  if (btn) setCategory(btn.dataset.filter);
});

function setCategory(id) {
  currentCategory = id;
  $("#listTitle").textContent = id === "all" ? "전체 상품" : categoryName(id);
  $$("#nav a[data-category]").forEach((a) => a.classList.toggle("active", a.dataset.category === id));
  renderFilters();
  renderProducts();
}

function renderProducts() {
  const word = searchWord.toLowerCase();
  const list = PRODUCTS.filter((p) => {
    const matchCategory = currentCategory === "all" || p.category === currentCategory;
    const text = (p.name + p.brand + p.info + categoryName(p.category)).toLowerCase();
    return matchCategory && (!word || text.includes(word));
  });

  const grade = myGrade();
  $("#productGrid").innerHTML = list.length ? list.map((p) => {
    const soldOut = stockLeft(p) === 0;
    return `<article class="card">
      <button type="button" class="card-img" data-detail="${p.id}" aria-label="${escapeHTML(p.name)} 상세 보기">
        <img src="${p.image}" alt="${escapeHTML(p.name)}" loading="lazy">
        <span class="tag ${p.category}">${categoryName(p.category)}</span>
        ${soldOut ? '<span class="sold-out">SOLD OUT</span>' : ""}
      </button>
      <div class="card-body">
        <p class="card-team">${escapeHTML(p.brand)} · ${escapeHTML(p.info)}</p>
        <h3 class="card-name">${escapeHTML(p.name)}</h3>
        <p class="price">${won(p.price)}</p>
        <p class="point-info">${grade.name} ${Math.round(grade.rate * 100)}% 적립 · ${point(Math.floor(p.price * grade.rate))}</p>
        <div class="btn-wrap"><button type="button" class="btn btn-outline btn-sm btn-block" data-detail="${p.id}" ${soldOut ? "disabled" : ""}>${soldOut ? "품절" : "상세 보기"}</button></div>
      </div>
    </article>`;
  }).join("") : `<p class="empty">'${escapeHTML(searchWord)}'에 맞는 상품이 없습니다.</p>`;

  $("#resultInfo").textContent = `${list.length}개 상품${searchWord ? ` · '${searchWord}' 검색 결과` : ""}`;
}
$("#productGrid").addEventListener("click", (e) => {
  const btn = e.target.closest("[data-detail]");
  if (btn && !btn.disabled) openDetail(Number(btn.dataset.detail));
});

$("#searchForm").addEventListener("submit", (e) => {
  e.preventDefault();
  searchWord = $("#searchInput").value.trim();
  renderProducts();
});
$("#searchInput").addEventListener("input", (e) => {
  searchWord = e.target.value.trim();
  renderProducts();
});


/* =========================================================
   상품 상세
   ========================================================= */
let detail = { id: null, size: null, qty: 1 };

function openDetail(id) {
  const p = findProduct(id);
  detail = { id, size: p.sizes.length === 1 ? p.sizes[0] : null, qty: 1 };
  renderDetail();
  openModal("productModal");
}

function renderDetail() {
  const p = findProduct(detail.id);
  const canAdd = stockLeft(p) - inCart(p.id);       // 장바구니에 담긴 수량을 뺀 남은 재고
  const grade = myGrade();
  const total = p.price * detail.qty;

  $("#detailTitle").textContent = "상품 상세";
  $("#detailBody").innerHTML = `<div class="detail">
    <div class="detail-img"><img src="${p.image}" alt="${escapeHTML(p.name)}"></div>
    <div class="detail-info">
      <span class="tag ${p.category}" style="position:static;align-self:flex-start">${categoryName(p.category)}</span>
      <h3>${escapeHTML(p.name)}</h3>
      <p class="price">${won(p.price)}</p>
      <p class="desc">${escapeHTML(p.desc)}</p>
      <table class="spec"><tbody>
        <tr><th>브랜드</th><td>${escapeHTML(p.brand)}</td></tr>
        <tr><th>정보</th><td>${escapeHTML(p.info)}</td></tr>
        <tr><th>재고</th><td>${stockLeft(p)}개</td></tr>
      </tbody></table>
      <div>
        <p style="font-size:13px;font-weight:700;margin-bottom:6px">${p.category === "boots" ? "사이즈 (mm)" : "사이즈"}</p>
        <div class="sizes">${p.sizes.map((s) => `<button type="button" class="size-btn${detail.size === s ? " active" : ""}" data-size="${s}" aria-pressed="${detail.size === s}">${s}</button>`).join("")}</div>
      </div>
      <div style="display:flex;align-items:center;gap:12px">
        <span style="font-size:13px;font-weight:700">수량</span>
        <div class="qty">
          <button type="button" data-step="-1" aria-label="수량 줄이기" ${detail.qty <= 1 ? "disabled" : ""}>−</button>
          <span>${detail.qty}</span>
          <button type="button" data-step="1" aria-label="수량 늘리기" ${detail.qty >= canAdd ? "disabled" : ""}>+</button>
        </div>
      </div>
      <div class="total-box">
        <span>합계<br><small class="point-info">${grade.name} 등급 ${point(Math.floor(total * grade.rate))} 적립 예정</small></span>
        <strong>${won(total)}</strong>
      </div>
      <div class="btn-row">
        <button type="button" class="btn btn-outline" id="addCartBtn" ${canAdd <= 0 ? "disabled" : ""}>장바구니 담기</button>
        <button type="button" class="btn btn-primary" id="buyNowBtn" ${canAdd <= 0 ? "disabled" : ""}>바로 구매</button>
      </div>
      ${canAdd <= 0 ? '<p class="error">남은 재고를 모두 장바구니에 담았습니다.</p>' : ""}
    </div>
  </div>`;

  $$("#detailBody .size-btn").forEach((b) => b.addEventListener("click", () => { detail.size = b.dataset.size; renderDetail(); }));
  $$("#detailBody [data-step]").forEach((b) => b.addEventListener("click", () => {
    detail.qty = Math.min(Math.max(1, detail.qty + Number(b.dataset.step)), canAdd);
    renderDetail();
  }));
  const add = $("#addCartBtn"), buy = $("#buyNowBtn");
  if (add) add.addEventListener("click", () => { if (addToCart()) { closeModal("productModal"); openCart(); } });
  if (buy) buy.addEventListener("click", () => { if (addToCart()) { closeModal("productModal"); startCheckout(); } });
}


/* =========================================================
   장바구니 (수량 바꾸기 · 삭제 · 합계)
   ========================================================= */
function saveCart() {
  LOCAL.saveCart(cart);
  $("#cartCount").textContent = cart.reduce((sum, c) => sum + c.qty, 0);
}

function addToCart() {
  const p = findProduct(detail.id);
  if (!detail.size) { showToast("사이즈를 선택해 주세요."); return false; }
  if (inCart(p.id) + detail.qty > stockLeft(p)) { showToast("재고가 부족합니다."); return false; }
  const line = cart.find((c) => c.id === p.id && c.size === detail.size);
  if (line) line.qty += detail.qty;
  else cart.push({ id: p.id, size: detail.size, qty: detail.qty });
  saveCart();
  showToast(`${p.name}을(를) 장바구니에 담았습니다.`);
  return true;
}

function cartSummary(usePoint = 0) {
  const lines = cart.map((c) => ({ ...c, product: findProduct(c.id) })).filter((l) => l.product);
  const subtotal = lines.reduce((sum, l) => sum + l.product.price * l.qty, 0);
  const shipping = subtotal === 0 || subtotal >= SETTINGS.freeShipping ? 0 : SETTINGS.shippingFee;
  const total = subtotal - usePoint + shipping;
  return { lines, subtotal, shipping, total };
}

function openCart() { renderCart(); openModal("cartModal"); }
$("#cartBtn").addEventListener("click", openCart);

function renderCart() {
  const { lines, subtotal, shipping, total } = cartSummary();
  if (!lines.length) {
    $("#cartBody").innerHTML = `<p class="empty">장바구니가 비어 있습니다.</p>
      <button type="button" class="btn btn-primary btn-block" style="margin-top:14px" data-close data-category="all">상품 보러 가기</button>`;
    return;
  }
  const grade = myGrade();
  $("#cartBody").innerHTML = lines.map((l, i) => {
    const maxQty = stockLeft(l.product) - (inCart(l.id) - l.qty);
    return `<div class="cart-item">
      <img src="${l.product.image}" alt="">
      <div>
        <h3>${escapeHTML(l.product.name)}</h3>
        <p class="opt">사이즈 ${l.size} · ${won(l.product.price)}</p>
        <div class="qty">
          <button type="button" data-index="${i}" data-change="-1" aria-label="수량 줄이기" ${l.qty <= 1 ? "disabled" : ""}>−</button>
          <span>${l.qty}</span>
          <button type="button" data-index="${i}" data-change="1" aria-label="수량 늘리기" ${l.qty >= maxQty ? "disabled" : ""}>+</button>
        </div>
      </div>
      <div class="cart-right">
        <strong>${won(l.product.price * l.qty)}</strong>
        <button type="button" class="del-btn" data-remove="${i}">삭제</button>
      </div>
    </div>`;
  }).join("") + `
    <div style="margin-top:14px">
      <div class="sum-row"><span>상품 합계</span><b>${won(subtotal)}</b></div>
      <div class="sum-row"><span>배송비</span><b>${shipping ? won(shipping) : "무료"}</b></div>
      <div class="sum-row"><span>${grade.name} 등급 적립 예정</span><b class="plus">${point(Math.floor(subtotal * grade.rate))}</b></div>
      <div class="sum-row total"><span>결제 예정 금액</span><b>${won(total)}</b></div>
      ${shipping ? `<p style="font-size:13px;color:var(--gray)">${won(SETTINGS.freeShipping - subtotal)} 더 담으면 무료배송</p>` : ""}
      <button type="button" class="btn btn-primary btn-block" id="goCheckout" style="margin-top:12px">주문하기</button>
    </div>`;
  $("#goCheckout").addEventListener("click", () => { closeModal("cartModal"); startCheckout(); });
}

$("#cartBody").addEventListener("click", (e) => {
  const change = e.target.closest("[data-change]");
  const remove = e.target.closest("[data-remove]");
  if (change && !change.disabled) {
    cart[Number(change.dataset.index)].qty += Number(change.dataset.change);
    saveCart(); renderCart();
  }
  if (remove) {
    cart.splice(Number(remove.dataset.remove), 1);
    saveCart(); renderCart();
    showToast("상품을 삭제했습니다.");
  }
});


/* =========================================================
   회원가입 · 로그인 · 로그아웃 (Supabase Auth)
   ========================================================= */

/* Supabase 오류 문구를 한글 안내문으로 바꾸기 */
function koreanAuthError(error) {
  const msg = ((error && error.message) || "").toLowerCase();
  if (msg.includes("already registered") || msg.includes("already been registered")) return "이미 가입된 이메일입니다. 로그인해 주세요.";
  if (msg.includes("invalid login credentials")) return "이메일 또는 비밀번호가 올바르지 않습니다.";
  if (msg.includes("email not confirmed")) return "이메일 인증이 끝나지 않았습니다. 받은 메일의 인증 링크를 눌러 주세요.";
  if (msg.includes("password") && (msg.includes("at least") || msg.includes("6"))) return "비밀번호는 6자 이상이어야 합니다.";
  if (msg.includes("unable to validate email") || msg.includes("invalid format") || msg.includes("email address") && msg.includes("invalid")) return "이메일 형식을 확인해 주세요.";
  if (msg.includes("rate limit")) return "잠시 후 다시 시도해 주세요. (요청이 너무 많습니다)";
  if (msg.includes("failed to fetch") || msg.includes("network")) return "서버에 연결할 수 없습니다. 인터넷 연결을 확인해 주세요.";
  if (msg.includes("signups not allowed") || msg.includes("signup is disabled")) return "지금은 회원가입을 받을 수 없습니다.";
  return "처리 중 오류가 났습니다. 잠시 후 다시 시도해 주세요." + (error && error.message ? ` (${error.message})` : "");
}

function dbReady(errorBox) {
  if (db) return true;
  const msg = "데이터베이스에 연결되지 않았습니다. 잠시 후 새로 고침해 주세요.";
  if (errorBox) $(errorBox).textContent = msg; else showToast(msg);
  return false;
}

/* shop_profiles 에서 내 한 줄 읽기 */
async function loadProfile() {
  if (!authUser) { profile = null; return; }
  const { data, error } = await db
    .from("shop_profiles")
    .select("id, email, name, phone, grade, points, role, created_at")
    .eq("id", authUser.id)
    .single();
  if (error) {
    console.error("회원 정보 읽기 실패:", error.message);
    // 표를 못 읽어도 로그인 상태는 보여 줄 수 있게 계정 정보로 채움
    const meta = authUser.user_metadata || {};
    profile = { id: authUser.id, email: authUser.email, name: meta.name || authUser.email, phone: meta.phone || "",
                grade: "WELCOME", points: 0, role: "member", created_at: authUser.created_at, _fallback: true };
    return;
  }
  profile = data;
}

/* 페이지가 열릴 때 로그인 상태 확인 */
async function initAuth() {
  if (!db) { refreshUser(); return; }
  const { data, error } = await db.auth.getSession();
  if (error) console.error("로그인 상태 확인 실패:", error.message);
  authUser = data && data.session ? data.session.user : null;
  await loadProfile();
  refreshUser();
  // 다른 탭에서 로그인 · 로그아웃해도 맞춰지도록
  db.auth.onAuthStateChange((event, session) => {
    if (event === "SIGNED_OUT" || (event === "SIGNED_IN" && (!authUser || authUser.id !== session.user.id))) {
      setTimeout(async () => {
        authUser = session ? session.user : null;
        await loadProfile();
        refreshUser();
      }, 0);
    }
  });
}

function openAuth(tab) { switchAuthTab(tab); openModal("authModal"); }
function switchAuthTab(tab) {
  $$(".auth-tab").forEach((t) => t.classList.toggle("active", t.dataset.tab === tab));
  $("#loginForm").hidden = tab !== "login";
  $("#signupForm").hidden = tab !== "signup";
  $("#authTitle").textContent = tab === "login" ? "로그인" : "회원가입";
  $("#loginError").textContent = "";
  $("#signupError").textContent = "";
}
$$(".auth-tab").forEach((t) => t.addEventListener("click", () => switchAuthTab(t.dataset.tab)));

/* 메뉴 버튼: 로그인 중이면 「이름 님 · 로그아웃」, 아니면 「로그인 · 회원가입」 */
function onUserClick(e) { if (e) e.preventDefault(); $("#nav").classList.remove("open"); profile ? openMyPage("orders") : openAuth("login"); }
function onAuthClick(e) { if (e) e.preventDefault(); $("#nav").classList.remove("open"); profile ? logout() : openAuth("signup"); }
$("#userBtn").addEventListener("click", onUserClick);
$("#authBtn").addEventListener("click", onAuthClick);
$("#navUser").addEventListener("click", onUserClick);
$("#navAuth").addEventListener("click", onAuthClick);
$("#joinBtn").addEventListener("click", () => (profile ? openMyPage("info") : openAuth("signup")));

function setBusy(form, busy, text) {
  const btn = form.querySelector('button[type="submit"]');
  if (!btn.dataset.label) btn.dataset.label = btn.textContent;
  btn.disabled = busy;
  btn.textContent = busy ? text : btn.dataset.label;
}

$("#signupForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const name = $("#signupName").value.trim();
  const email = $("#signupEmail").value.trim().toLowerCase();
  const pw = $("#signupPw").value;
  const phone = $("#signupPhone").value.trim();
  const error = (msg) => { $("#signupError").textContent = msg; };
  error("");

  if (!name) return error("이름을 입력해 주세요.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return error("이메일 형식을 확인해 주세요.");
  if (pw.length < 6) return error("비밀번호는 6자 이상이어야 합니다.");
  if (pw !== $("#signupPw2").value) return error("비밀번호 확인이 일치하지 않습니다.");
  if (!/^01[0-9]-?\d{3,4}-?\d{4}$/.test(phone)) return error("휴대폰 번호를 확인해 주세요.");
  if (!$("#signupAgree").checked) return error("필수 약관에 동의해 주세요.");
  if (!dbReady("#signupError")) return;

  setBusy(form, true, "가입 중...");
  const { data, error: err } = await db.auth.signUp({
    email,
    password: pw,
    options: { data: { name, phone } }     // DB 가 shop_profiles 한 줄을 만들 때 쓰는 이름 · 연락처
  });
  setBusy(form, false);

  if (err) return error(koreanAuthError(err));
  // 이메일 확인이 켜져 있을 때 이미 있는 이메일은 오류 대신 빈 계정이 돌아옴
  if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
    return error("이미 가입된 이메일입니다. 로그인해 주세요.");
  }
  form.reset();
  if (!data.session) {
    closeModal("authModal");
    showToast("가입 신청이 완료되었습니다. 메일의 인증 링크를 누른 뒤 로그인해 주세요.");
    return;
  }
  authUser = data.user;
  await loadProfile();
  showToast(`가입을 환영합니다! ${point(profile ? profile.points : SETTINGS.signupPoint)}가 지급되었습니다.`);
  afterSignIn();
});

$("#loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const email = $("#loginEmail").value.trim().toLowerCase();
  const pw = $("#loginPw").value;
  $("#loginError").textContent = "";
  if (!email || !pw) { $("#loginError").textContent = "이메일과 비밀번호를 입력해 주세요."; return; }
  if (!dbReady("#loginError")) return;

  setBusy(form, true, "로그인 중...");
  const { data, error } = await db.auth.signInWithPassword({ email, password: pw });
  setBusy(form, false);
  if (error) { $("#loginError").textContent = koreanAuthError(error); return; }

  form.reset();
  authUser = data.user;
  await loadProfile();
  showToast(`${profile ? profile.name : ""} 님, 반갑습니다.`);
  afterSignIn();
});

function afterSignIn() {
  closeModal("authModal");
  refreshUser();
  if (afterLogin) { const next = afterLogin; afterLogin = null; next(); }
}

async function logout() {
  if (db) {
    const { error } = await db.auth.signOut();
    if (error) { showToast(koreanAuthError(error)); return; }
  }
  authUser = null;
  profile = null;
  closeModal("myModal");
  refreshUser();
  showToast("로그아웃되었습니다.");
}

function refreshUser() {
  const name = profile ? `${escapeHTML(profile.name || profile.email)} 님` : "로그인";
  $("#userLabel").innerHTML = profile ? `${name} ${gradeBadge(myGrade())}` : name;
  $("#authLabel").textContent = profile ? "로그아웃" : "회원가입";
  $("#navUser").textContent = profile ? `${profile.name || profile.email} 님 (마이페이지)` : "로그인";
  $("#navAuth").textContent = profile ? "로그아웃" : "회원가입";
  renderProducts();
}


/* =========================================================
   체험 결제 (실제 결제 없이 주문 내역만 남김)
   ※ 다음 단계에서 주문을 shop_orders · shop_order_items 에 저장합니다.
     포인트 차감 · 적립과 등급 변경은 DB 가 맡으므로 이번 단계에서는 화면에서 바꾸지 않습니다.
   ========================================================= */
function startCheckout() {
  if (!cart.length) { showToast("장바구니가 비어 있습니다."); return; }
  if (!profile) {
    afterLogin = startCheckout;
    openAuth("login");
    showToast("주문하려면 로그인해 주세요.");
    return;
  }
  renderCheckout();
  openModal("checkoutModal");
}

function renderCheckout() {
  const grade = myGrade();
  const s = cartSummary(0);
  const earn = Math.floor(s.subtotal * grade.rate);

  $("#checkoutTitle").textContent = "주문 / 체험 결제";
  $("#checkoutBody").innerHTML = `<form id="orderForm" novalidate><div class="checkout">
    <div>
      <div class="box">
        <h3>배송지</h3>
        <label for="orderName">받는 분</label><input id="orderName" value="${escapeHTML(profile.name)}">
        <label for="orderPhone">연락처</label><input id="orderPhone" type="tel" value="${escapeHTML(profile.phone)}">
        <label for="orderAddr">주소</label><input id="orderAddr" placeholder="도로명 주소와 상세 주소">
      </div>
      <div class="box">
        <h3>포인트 <small style="color:var(--gray);font-weight:400">(보유 ${point(profile.points)})</small></h3>
        <p style="font-size:13.5px;color:var(--gray)">포인트 사용은 주문을 DB 에 저장하는 다음 단계에서 열립니다.</p>
      </div>
      <div class="box">
        <h3>결제 수단 (체험)</h3>
        <div class="pay-options">
          <label><input type="radio" name="pay" value="카드" checked> 신용·체크카드</label>
          <label><input type="radio" name="pay" value="계좌이체"> 계좌이체</label>
          <label><input type="radio" name="pay" value="간편결제"> 간편결제</label>
          <label><input type="radio" name="pay" value="무통장입금"> 무통장입금</label>
        </div>
      </div>
    </div>
    <div class="summary">
      <h3 style="font-size:16px;margin-bottom:8px">주문 상품</h3>
      ${s.lines.map((l) => `<div class="sum-row"><span>${escapeHTML(l.product.name)} (${l.size}) × ${l.qty}</span><b>${won(l.product.price * l.qty)}</b></div>`).join("")}
      <div class="sum-row total" style="font-size:15px"><span>상품 합계</span><b style="font-size:15px;color:var(--text)">${won(s.subtotal)}</b></div>
      <div class="sum-row"><span>배송비</span><b>${s.shipping ? won(s.shipping) : "무료"}</b></div>
      <div class="sum-row total"><span>최종 결제 금액</span><b>${won(s.total)}</b></div>
      <div class="sum-row"><span>${gradeBadge(grade)} ${Math.round(grade.rate * 100)}% 적립 예정</span><b class="plus">+${point(earn)}</b></div>
      <p class="error" id="orderError"></p>
      <button type="submit" class="btn btn-accent btn-block">${won(s.total)} 체험 결제하기</button>
      <p style="font-size:12.5px;color:var(--gray);margin-top:8px;text-align:center">실제 결제는 되지 않고 주문 내역만 남습니다.</p>
    </div>
  </div></form>`;
  $("#orderForm").addEventListener("submit", (e) => { e.preventDefault(); placeOrder(); });
}

function placeOrder() {
  const name = $("#orderName").value.trim();
  const phone = $("#orderPhone").value.trim();
  const addr = $("#orderAddr").value.trim();
  if (!name || !phone || !addr) { $("#orderError").textContent = "배송지 정보를 모두 입력해 주세요."; return; }

  const s = cartSummary(0);
  for (const l of s.lines) {
    if (inCart(l.id) > stockLeft(l.product)) { $("#orderError").textContent = `${l.product.name} 재고가 부족합니다.`; return; }
  }

  const grade = myGrade();
  const now = Date.now();
  const d = new Date(now);
  const order = {
    orderNo: `FKS${d.getFullYear()}${twoDigit(d.getMonth() + 1)}${twoDigit(d.getDate())}-${String(now).slice(-5)}`,
    date: now,
    items: s.lines.map((l) => ({ id: l.id, name: l.product.name, size: l.size, qty: l.qty, price: l.product.price })),
    subtotal: s.subtotal, shipping: s.shipping, total: s.total,
    expectedPoint: Math.floor(s.subtotal * grade.rate),
    payMethod: document.querySelector('input[name="pay"]:checked').value,
    status: "주문 완료"
  };

  s.lines.forEach((l) => { sold[l.id] = (sold[l.id] || 0) + l.qty; });
  LOCAL.saveSold(sold);
  const orders = LOCAL.getOrders(profile.id);
  orders.unshift(order);
  LOCAL.saveOrders(profile.id, orders);
  cart = [];
  saveCart();
  renderProducts();

  $("#checkoutTitle").textContent = "주문 완료";
  $("#checkoutBody").innerHTML = `<div class="done">
      <div class="ok">✓</div>
      <h3>주문이 완료되었습니다</h3>
      <p>주문번호 ${order.orderNo}</p>
    </div>
    <div class="box" style="margin-top:18px">
      ${order.items.map((i) => `<div class="sum-row"><span>${escapeHTML(i.name)} (${i.size}) × ${i.qty}</span><b>${won(i.price * i.qty)}</b></div>`).join("")}
      <div class="sum-row total"><span>결제 금액</span><b>${won(order.total)}</b></div>
      <div class="sum-row"><span>적립 예정 포인트</span><b class="plus">+${point(order.expectedPoint)}</b></div>
    </div>
    <div class="btn-row" style="margin-top:16px">
      <button type="button" class="btn btn-outline" data-close>쇼핑 계속하기</button>
      <button type="button" class="btn btn-primary" id="viewOrders">주문 내역 보기</button>
    </div>`;
  $("#viewOrders").addEventListener("click", () => { closeModal("checkoutModal"); openMyPage("orders"); });
}


/* =========================================================
   마이페이지 (shop_profiles 에서 내 한 줄 읽기 · 이름과 연락처 수정)
   ========================================================= */
async function openMyPage(tab) {
  if (!profile) {
    afterLogin = () => openMyPage(tab);
    openAuth("login");
    showToast("로그인이 필요합니다.");
    return;
  }
  if (db && authUser) await loadProfile();   // 열 때마다 DB 에서 최신 값 읽기
  renderMyPage(tab);
  openModal("myModal");
}

function renderMyPage(tab) {
  if (!profile) return;
  const grade = myGrade();
  let content = "";

  if (tab === "orders") {
    const orders = LOCAL.getOrders(profile.id);
    content = orders.length ? orders.map((o) => `<div class="order-card">
      <header><span><b>${o.orderNo}</b> · ${formatDate(o.date)}</span><span class="status">${o.status}</span></header>
      ${o.items.map((i) => `<div class="sum-row"><span>${escapeHTML(i.name)} (${i.size}) × ${i.qty}</span><b>${won(i.price * i.qty)}</b></div>`).join("")}
      <div class="sum-row"><span>결제 (${o.payMethod})</span><b>${won(o.total)}</b></div>
      <div class="sum-row"><span>적립 예정</span><b class="plus">+${point(o.expectedPoint || 0)}</b></div>
    </div>`).join("") : '<p class="empty">아직 주문 내역이 없습니다.</p>';
  } else {
    content = `<form id="profileForm" novalidate>
      <label for="pfName">이름</label>
      <input id="pfName" value="${escapeHTML(profile.name)}" autocomplete="name">
      <label for="pfPhone">휴대폰 번호</label>
      <input id="pfPhone" type="tel" value="${escapeHTML(profile.phone)}" placeholder="010-0000-0000" autocomplete="tel">
      <table class="spec" style="margin-top:16px"><tbody>
        <tr><th>이메일</th><td>${escapeHTML(profile.email)}</td></tr>
        <tr><th>등급</th><td>${gradeBadge(grade)} 적립률 ${Math.round(grade.rate * 100)}%</td></tr>
        <tr><th>포인트</th><td>${point(profile.points)}</td></tr>
        <tr><th>가입일</th><td>${profile.created_at ? formatDate(profile.created_at) : "-"}</td></tr>
      </tbody></table>
      <p style="font-size:12.5px;color:var(--gray);margin-top:6px">등급과 포인트는 쇼핑몰(DB)이 관리하며 직접 바꿀 수 없습니다.</p>
      <p class="error" id="profileError"></p>
      <button type="submit" class="btn btn-primary btn-block">이름 · 연락처 저장</button>
    </form>
    <button type="button" class="btn btn-outline btn-block" id="logoutBtn" style="margin-top:10px">로그아웃</button>`;
  }

  $("#myBody").innerHTML = `
    <div class="my-card">
      <div style="flex:1;min-width:200px">
        <p>${gradeBadge(grade)} 등급 · 적립률 ${Math.round(grade.rate * 100)}%</p>
        <h3>${escapeHTML(profile.name)} 님</h3>
        <p>${escapeHTML(profile.email)}</p>
      </div>
      <div><p>보유 포인트</p><p class="my-point">${point(profile.points)}</p></div>
    </div>
    ${profile._fallback ? '<p class="error">회원 정보를 DB 에서 읽지 못해 일부 값이 비어 있을 수 있습니다.</p>' : ""}
    <div class="my-tabs" role="tablist">
      <button type="button" class="my-tab${tab === "orders" ? " active" : ""}" data-tab="orders">주문 내역</button>
      <button type="button" class="my-tab${tab !== "orders" ? " active" : ""}" data-tab="info">회원 정보</button>
    </div>
    ${content}`;

  $$("#myBody .my-tab").forEach((b) => b.addEventListener("click", () => renderMyPage(b.dataset.tab)));
  const out = $("#logoutBtn");
  if (out) out.addEventListener("click", logout);
  const pf = $("#profileForm");
  if (pf) pf.addEventListener("submit", saveProfile);
}

/* 이름 · 연락처만 shop_profiles 에 저장 (grade · points · role 은 보내지 않음) */
async function saveProfile(e) {
  e.preventDefault();
  const form = e.target;
  const name = $("#pfName").value.trim();
  const phone = $("#pfPhone").value.trim();
  const error = (msg) => { $("#profileError").textContent = msg; };
  if (!name) return error("이름을 입력해 주세요.");
  if (!/^01[0-9]-?\d{3,4}-?\d{4}$/.test(phone)) return error("휴대폰 번호를 확인해 주세요.");
  if (!dbReady("#profileError")) return;

  setBusy(form, true, "저장 중...");
  const { error: err } = await db
    .from("shop_profiles")
    .update({ name, phone })
    .eq("id", profile.id);
  setBusy(form, false);
  if (err) return error("저장하지 못했습니다. " + koreanAuthError(err));

  await loadProfile();
  refreshUser();
  renderMyPage("info");
  showToast("회원 정보를 저장했습니다.");
}


/* =========================================================
   등급 안내 · 첫 화면 그리기
   ========================================================= */
function renderGrades() {
  $("#gradeGrid").innerHTML = GRADES.map((g) => `<div class="grade-card" style="--gc:${g.color}">
    <p class="name">${g.name}</p>
    <p class="rate">${Math.round(g.rate * 100)}<small>% 적립</small></p>
    <p>${g.desc} · ${g.code}</p>
  </div>`).join("");
}

renderGrades();
renderFilters();
saveCart();
refreshUser();
initAuth();
