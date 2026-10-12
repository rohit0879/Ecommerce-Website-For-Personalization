document.addEventListener("DOMContentLoaded", function () {

  // Safe lookup: a missing element never crashes the script (it only logs a warning)
  const $ = (id) => {
    const el = document.getElementById(id);
    if (el) return el;
    console.warn("Missing element #" + id + " - index.html and script.js versions may not match.");
    return new Proxy({}, {
      get: (t, p) => (p === "classList" ? { add() {}, remove() {} } : p in t ? t[p] : function () {}),
      set: (t, p, v) => { t[p] = v; return true; }
    });
  };
  const fmt = (n) => "₹" + Number(n).toLocaleString("en-IN");
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) || d; } catch (e) { return d; } };

  /* =====================================================
     TOAST
  ===================================================== */
  let toastTimer;
  function toast(msg) {
    const t = $("toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 2200);
  }

  /* =====================================================
     CUSTOMER DETAILS (name, email, phone, address)
  ===================================================== */
  const fields = {
    name: $("customerName"), email: $("customerEmail"), phone: $("customerPhone"),
    address: $("customerAddress"), city: $("customerCity"),
    state: $("customerState"), pincode: $("customerPincode")
  };
  const customerMessage = $("customerMessage");
  let customer = load("customerDetails", null);

  // Restore saved details
  const savedEmail = localStorage.getItem("customerEmail");
  try {
    if (customer) {
      Object.keys(fields).forEach((k) => (fields[k].value = customer[k] || ""));
    } else if (savedEmail) {
      fields.email.value = savedEmail;
    }
  } catch (err) { console.warn("Could not restore saved details:", err); }

  function showMsg(text, ok) {
    customerMessage.textContent = text;
    customerMessage.className = ok ? "ok" : "err";
  }

  function readCustomer() {
    const c = {};
    Object.keys(fields).forEach((k) => (c[k] = fields[k].value.trim()));
    return c;
  }

  function validateCustomer(c) {
    Object.values(fields).forEach((f) => f.classList.remove("invalid"));
    const bad = (k, msg) => { fields[k].classList.add("invalid"); fields[k].focus(); showMsg(msg, false); return false; };
    if (!c.name) return bad("name", "Please enter your name.");
    if (!c.email) return bad("email", "Please enter your email.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.email)) return bad("email", "Please enter a valid email.");
    const digits = c.phone.replace(/\D/g, "").slice(-10);
    if (digits.length !== 10) return bad("phone", "Please enter a valid 10-digit phone number.");
    if (!c.address) return bad("address", "Please enter your street address.");
    if (!c.city) return bad("city", "Please enter your city.");
    if (!c.state) return bad("state", "Please enter your state.");
    if (!/^\d{6}$/.test(c.pincode)) return bad("pincode", "Please enter a valid 6-digit PIN code.");
    return true;
  }

  $("identifyCustomerBtn").addEventListener("click", function () {
    const c = readCustomer();
    if (!validateCustomer(c)) return;
    customer = c;
    localStorage.setItem("customerEmail", c.email);
    localStorage.setItem("customerDetails", JSON.stringify(c));
    showMsg("Customer identified successfully.", true);
    toast("Details saved ✓");
    // Sitemap listens to this and sends the Identity event to Data 360
    document.dispatchEvent(new CustomEvent("store:identify", { detail: c }));
  });

  function customerHtml(c) {
    return "<b>" + esc(c.name) + "</b><br>" + esc(c.email) + " · " + esc(c.phone) + "<br>" +
      esc(c.address) + ", " + esc(c.city) + ", " + esc(c.state) + " - " + esc(c.pincode);
  }

  /* =====================================================
     CART
  ===================================================== */
  let cart = load("cartItems", {});
  const cartCountEl = $("cartCount");
  const drawer = $("cartDrawer");
  const overlay = $("overlay");

  const cartTotal = () => Object.values(cart).reduce((s, i) => s + i.price * i.qty, 0);
  const cartQty = () => Object.values(cart).reduce((s, i) => s + i.qty, 0);

  function renderCart() {
    const items = Object.values(cart);
    cartCountEl.textContent = cartQty();
    $("cartTotal").textContent = fmt(cartTotal());
    $("checkoutBtn").disabled = !items.length;
    localStorage.setItem("cartItems", JSON.stringify(cart));

    $("cartItems").innerHTML = items.length
      ? items.map((i) =>
          '<div class="cart-item"><div class="ico">' + esc(i.icon) + '</div>' +
          '<div class="info"><b>' + esc(i.name) + '</b><small>' + fmt(i.price) + '</small>' +
          '<div class="qty"><button data-act="dec" data-id="' + esc(i.id) + '">−</button><span>' + i.qty +
          '</span><button data-act="inc" data-id="' + esc(i.id) + '">+</button></div></div>' +
          '<button class="rm" data-act="rm" data-id="' + esc(i.id) + '" aria-label="Remove">🗑</button></div>'
        ).join("")
      : '<div class="empty">🛒<br>Your cart is empty.<br>Kuch products add karo!</div>';
  }

  function openCart() { drawer.classList.add("open"); overlay.hidden = false; drawer.setAttribute("aria-hidden", "false"); }
  function closeCart() { drawer.classList.remove("open"); overlay.hidden = true; drawer.setAttribute("aria-hidden", "true"); }

  $("cartBtn").addEventListener("click", openCart);
  $("closeCart").addEventListener("click", closeCart);
  overlay.addEventListener("click", closeCart);

  $("cartItems").addEventListener("click", function (e) {
    const b = e.target.closest("button[data-act]");
    if (!b || !cart[b.dataset.id]) return;
    const item = cart[b.dataset.id];
    if (b.dataset.act === "inc") item.qty++;
    if (b.dataset.act === "dec") item.qty--;
    if (b.dataset.act === "rm" || item.qty < 1) delete cart[b.dataset.id];
    renderCart();
  });

  /* =====================================================
     PRODUCTS
  ===================================================== */
  const productCards = document.querySelectorAll(".product-card");

  productCards.forEach(function (card) {
    const d = card.dataset;

    card.querySelector(".view-product-btn").addEventListener("click", function () {
      toast("Viewing " + d.productName);
    });

    card.querySelector(".cart-button").addEventListener("click", function () {
      const id = d.productId;
      if (cart[id]) cart[id].qty++;
      else cart[id] = {
        id: id, sku: d.productSku, name: d.productName, price: Number(d.productPrice),
        category: d.productCategory, brand: d.productBrand, catalogId: d.catalogId,
        icon: card.querySelector(".product-image").textContent.trim(), qty: 1
      };
      renderCart();
      cartCountEl.classList.remove("bump");
      void cartCountEl.offsetWidth;
      cartCountEl.classList.add("bump");
      toast(d.productName + " added to cart");
    });
  });

  /* =====================================================
     SEARCH
  ===================================================== */
  const searchInput = $("searchInput");

  function performSearch() {
    const term = searchInput.value.trim().toLowerCase();
    let shown = 0;
    productCards.forEach(function (card) {
      const d = card.dataset;
      const match = d.productName.toLowerCase().includes(term) ||
        d.productSku.toLowerCase().includes(term) ||
        d.productCategory.toLowerCase().includes(term);
      card.style.display = match ? "" : "none";
      if (match) shown++;
    });
    $("noResults").hidden = shown > 0;
  }

  $("searchButton").addEventListener("click", performSearch);
  searchInput.addEventListener("keydown", function (e) { if (e.key === "Enter") performSearch(); });

  /* =====================================================
     CHECKOUT + PLACE ORDER
  ===================================================== */
  const checkoutModal = $("checkoutModal");
  const successModal = $("successModal");

  $("checkoutBtn").addEventListener("click", function () {
    if (!Object.keys(cart).length) return;
    closeCart();

    // Customer details must be saved first
    if (!customer) {
      toast("Pehle apni details save karo");
      $("customer").scrollIntoView();
      return;
    }

    $("checkoutSummary").innerHTML = Object.values(cart).map((i) =>
      '<div class="row"><span>' + esc(i.icon) + " " + esc(i.name) + " × " + i.qty + "</span><span>" +
      fmt(i.price * i.qty) + "</span></div>").join("") +
      '<div class="row total"><span>Total</span><strong>' + fmt(cartTotal()) + "</strong></div>";
    $("checkoutCustomer").innerHTML = customerHtml(customer);
    checkoutModal.hidden = false;
  });

  $("cancelCheckout").addEventListener("click", function () { checkoutModal.hidden = true; });

  $("placeOrderBtn").addEventListener("click", function () {
    const items = Object.values(cart);
    if (!items.length || !customer) return;

    const order = {
      id: "ORD-" + Date.now().toString(36).toUpperCase(),
      total: cartTotal(),
      currency: "INR",
      items: items,
      customer: customer,
      placedAt: new Date().toISOString()
    };

    // Keep order history locally
    const history = load("orders", []);
    history.push(order);
    localStorage.setItem("orders", JSON.stringify(history));

    // Sitemap listens to this and sends the Purchase event to Data 360
    document.dispatchEvent(new CustomEvent("store:order", { detail: order }));

    cart = {};
    renderCart();
    checkoutModal.hidden = true;

    $("orderIdText").textContent = order.id;
    $("successDetails").innerHTML =
      "<b>Items:</b> " + items.map((i) => esc(i.name) + " × " + i.qty).join(", ") +
      "<br><b>Total paid:</b> " + fmt(order.total) +
      "<br><b>Deliver to:</b> " + esc(customer.address) + ", " + esc(customer.city) + " - " + esc(customer.pincode) +
      "<br><b>Confirmation sent to:</b> " + esc(customer.email);
    successModal.hidden = false;
  });

  $("continueBtn").addEventListener("click", function () {
    successModal.hidden = true;
    $("products").scrollIntoView();
  });

  renderCart();
});
