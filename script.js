const PAYSTACK_PUBLIC_KEY = "pk_test_b8caca04e47c14d7e98e5ef05e5ac86d5e4e15aa";
// local government areas
const lgaData = {
  Lagos: {
    Ikeja: 1500,
    "Lagos Island": 2000,
    Surulere: 1800,
    Lekki: 2500,
    Alimosho: 2000,
    Mushin: 1700,
    Oshodi: 1600,
    Badagry: 3000,
    Epe: 3500,
    Ikorodu: 3000,
  },
  Abuja: {
    "Abuja Municipal": 2500,
    Bwari: 3000,
    Gwagwalada: 3500,
    Kuje: 3500,
    Kwali: 4000,
    Abaji: 4000,
  },
  Rivers: {
    "Port Harcourt": 3000,
    "Obio-Akpor": 3200,
    Eleme: 3500,
    Ikwerre: 3500,
    Etche: 4000,
    Oyigbo: 3800,
    Tai: 4000,
  },
  Kano: {
    "Kano Municipal": 3500,
    Fagge: 3500,
    Dala: 3800,
    Gwale: 3800,
    Tarauni: 4000,
    Nassarawa: 4000,
    Ungogo: 4000,
  },
  Oyo: {
    "Ibadan North": 2000,
    "Ibadan South": 2000,
    Ogbomosho: 2500,
    Oyo: 2800,
    Iseyin: 3000,
    Saki: 3500,
  },
  Delta: {
    Warri: 3000,
    Sapele: 3200,
    Asaba: 3500,
    Ughelli: 3200,
    Effurun: 3000,
    Agbor: 3500,
  },
  Anambra: {
    Awka: 2800,
    Onitsha: 2500,
    Nnewi: 2800,
    Ekwulobia: 3000,
    Aguata: 3000,
    Idemili: 3000,
  },
  Enugu: {
    "Enugu North": 3000,
    "Enugu South": 3000,
    "Igbo-Eze": 3500,
    Nkanu: 3500,
    Udi: 3500,
    "Igbo-Etiti": 3500,
  },
  Kaduna: {
    "Kaduna North": 3500,
    "Kaduna South": 3500,
    Zaria: 3800,
    Kafanchan: 4000,
    Kagoro: 4000,
  },
  Imo: {
    Owerri: 3000,
    Orlu: 3200,
    Okigwe: 3500,
    Mbaise: 3200,
    Mbano: 3500,
    "Ngor Okpala": 3200,
  },
  Ogun: {
    Abeokuta: 1800,
    Sagamu: 1500,
    "Ijebu Ode": 2000,
    Ota: 1600,
    Ilaro: 2500,
    Shagamu: 1500,
  },
  Edo: {
    "Benin City": 2800,
    Ekpoma: 3000,
    Auchi: 3500,
    Uromi: 3200,
    Esan: 3200,
    Igueben: 3500,
  },
};

const itemsPerPage = 3;
let currentPage = 1;

function paginateCards() {
  const cards = document.querySelectorAll(".card");
  const isMobile = window.innerWidth < 768;

  if (!isMobile) {
    cards.forEach((card) => (card.style.display = ""));
    document.getElementById("pageInfo").textContent = "";
    return;
  }
  const totalPages = Math.ceil(cards.length / itemsPerPage);
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  cards.forEach((card, i) => {
    card.style.display = i >= start && i < end ? "block" : "none";
  });

  document.getElementById("pageInfo").textContent =
    `Page ${currentPage} of ${totalPages}`;
  document.getElementById("prevBtn").disabled = currentPage === 1;
  document.getElementById("nextBtn").disabled = currentPage === totalPages;
}

function changePage(direction) {
  currentPage += direction;
  paginateCards();
}

// Run on load
window.addEventListener("resize", paginateCards);
document.addEventListener("DOMContentLoaded", paginateCards);

const itemsPerp = 2;
let currPage = 1;

function pagination() {
  const plains = document.querySelectorAll(".plain");
  const isMobile = window.innerWidth < 768;

  if (!isMobile) {
    plains.forEach((plain) => (plain.style.display = ""));
    document.getElementById("pagInf").textContent = "";
    return;
  }

  const pages = Math.ceil(plains.length / itemsPerp);
  const begin = (currPage - 1) * itemsPerp;
  const stop = begin + itemsPerp;

  plains.forEach((plain, r) => {
    plain.style.display = r >= begin && r < stop ? "block" : "none";
  });

  document.getElementById("pageInf").textContent =
    `Page ${currPage} of ${pages}`;
  document.getElementById("prevBut").disabled = currPage === 1;
  document.getElementById("nextBut").disabled = currPage === pages;
}

function changeP(direction) {
  currPage += direction;
  pagination();
}

//Run on load
window.addEventListener("resize", pagination);
document.addEventListener("DOMContentLoaded", pagination);

/* cart and delivery */
let cart = [];
let deliveryFee = 0;

// Add To Cart
function addToCart(btn, name, price) {
  const sizeSelect = btn.previousElementSibling;
  const size = sizeSelect.value;

  if (!size) {
    alert("please Select a size!");
    return;
  }

  const itemName = `${name} (${size})`;
  let existing = cart.find((i) => i.name === itemName);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ name: itemName, price, qty: 1 });
  }

  btn.textContent = "Added";
  btn.classList.add("added");
  setTimeout(() => {
    btn.textContent = "Add to Cart";
    btn.classList.remove("added");
  }, 1000);
  renderCart();
  showCart();
  document.getElementById("cartSection").scrollIntoView({ behavior: "smooth" });
}

// Render Cart Items
function renderCart() {
  const list = document.getElementById("cartItems");
  list.innerHTML = "";
  let subtotal = 0;

  cart.forEach((item, i) => {
    subtotal += item.price * item.qty;
    const row = document.createElement("div");
    row.className = "cart-row";
    row.innerHTML = `
      <span class="cart-row-name">${item.name}</span>
      <span class="cart-row-price">₦${item.price.toLocaleString()}</span>
      <div class="qty-controls">
        <button class="qty-btn" onclick="changeQty(${i}, -1)">−</button>
        <span class="qty-count">${item.qty}</span>
        <button class="qty-btn" onclick="changeQty(${i}, 1)">+</button>
      </div>
      <button class="remove-btn" onclick="removeItem(${i})">✕</button>
    `;
    list.appendChild(row);
  });

  document.getElementById("subtotal").textContent =
    "₦" + subtotal.toLocaleString();
  document.getElementById("deliveryFee").textContent =
    "₦" + deliveryFee.toLocaleString();
  document.getElementById("cartTotal").textContent =
    "₦" + (subtotal + deliveryFee).toLocaleString();
  document.getElementById("bubbleCount").textContent = cart.reduce(
    (s, i) => s + i.qty,
    0,
  );
}
// Update Delivery fee When State Changes
function updateDeliveryFee() {
  const val = document.getElementById("stateSelect").value;
  if (!val) {
    deliveryFee = 0;
    document.getElementById("lgaSelect").innerHTML =
      '<option value="">-- Select State First --</option>';
    renderCart();
    return;
  }

  const lgas = lgaData[val] || {};
  const lgaSelect = document.getElementById("lgaSelect");
  lgaSelect.innerHTML = '<option value="">-- Select LGA --</option>';

  Object.keys(lgas).forEach((lga) => {
    const opt = document.createElement("option");
    opt.value = lga;
    opt.textContent = `${lga} — ₦${lgas[lga].toLocaleString()}`;
    lgaSelect.appendChild(opt);
  });

  deliveryFee = 0;
  renderCart();
}

function updateLGAFee() {
  const stateName = document.getElementById("stateSelect").value;
  const lga = document.getElementById("lgaSelect").value;
  if (stateName && lga) {
    deliveryFee = lgaData[stateName][lga] || 0;
  } else {
    deliveryFee = 0;
  }
  renderCart();
}

function changeQty(index, delta) {
  cart[index].qty += delta;
  if (cart[index].qty <= 0) cart.splice(index, 1);
  renderCart();
  if (cart.length === 0) hideCart();
}

function removeItem(index) {
  cart.splice(index, 1);
  renderCart();
  if (cart.length === 0) hideCart();
}

function showCart() {
  document.getElementById("cartSection").style.display = "block";
  document.getElementById("cartBubble").style.display = "none";
}

function hideCart() {
  document.getElementById("cartSection").style.display = "none";
  if (cart.length > 0)
    document.getElementById("cartBubble").style.display = "block";
}

async function handlePayment(response) {
  try {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reference: response.reference,
        email: document.getElementById("email").value,
        name: document.getElementById("customerName").value.trim(),
        phone: document.getElementById("customerPhone").value.trim(),
        items: cart.map((i) => `${i.name} x${i.qty}`).join(", "),
        subtotal: cart.reduce((s, i) => s + i.price * i.qty, 0),
        deliveryFee: deliveryFee,
        total: cart.reduce((s, i) => s + i.price * i.qty, 0) + deliveryFee,
        state: document.getElementById("stateSelect").value,
        lga: document.getElementById("lgaSelect").value,
        address: document.getElementById("streetAddress").value.trim(),
      }),
    });

    const data = await res.json();

    if (data.success) {
      alert("✅ Payment successful! Ref: " + response.reference);
      cart = [];
      deliveryFee = 0;
      renderCart();
      hideCart();
      document.getElementById("customerName").value = "";
      document.getElementById("customerPhone").value = "";
      document.getElementById("stateSelect").value = "";
      document.getElementById("lgaSelect").innerHTML =
        '<option value="">-- Select State First --</option>';
      document.getElementById("streetAddress").value = "";
      document.getElementById("email").value = "";
    } else {
      alert(
        "Payment received but something went wrong. Contact us with ref: " +
          response.reference,
      );
    }
  } catch (err) {
    alert(
      "Payment received but something went wrong. Contact us with ref: " +
        response.reference,
    );
  }
}

// ── CHECKOUT ──
function checkOut() {
  const email = document.getElementById("email").value.trim();
  const stateVal = document.getElementById("stateSelect").value;
  const lga = document.getElementById("lgaSelect").value;
  const address = document.getElementById("streetAddress").value.trim();
  const name = document.getElementById("customerName").value.trim();
  const phone = document.getElementById("customerPhone").value.trim();

  if (!email || !email.includes("@")) {
    alert("Please enter a valid email.");
    return;
  }
  if (!stateVal) {
    alert("Please select your state.");
    return;
  }
  if (!lga) {
    alert("Please select your area.");
    return;
  }
  if (!address) {
    alert("Please enter your street address.");
    return;
  }
  if (!name) {
    alert("Please enter your name.");
    return;
  }
  if (!phone) {
    alert("Please enter your phone number.");
    return;
  }
  if (cart.length === 0) {
    alert("Your cart is empty.");
    return;
  }

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const total = subtotal + deliveryFee;

  const handler = PaystackPop.setup({
    key: PAYSTACK_PUBLIC_KEY,
    email: email,
    amount: total * 100,
    currency: "NGN",
    callback: function (response) {
      handlePayment(response);
    },
    onClose: function () {},
  });

  handler.openIframe();
}
