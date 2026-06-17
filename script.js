const PAYSTACK_PUBLIC_KEY = "pk_test_b8caca04e47c14d7e98e5ef05e5ac86d5e4e15aa";
// local government areas
const lgaData = {
  Lagos: [
    "Ikeja",
    "Lagos Island",
    "Surulere",
    "Lekki",
    "Alimosho",
    "Mushin",
    "Oshodi",
    "Badagry",
    "Epe",
    "Ikorodu",
  ],
  Abuja: ["Abuja Municipal", "Bwari", "Gwagwalada", "Kuje", "Kwali", "Abaji"],
  Rivers: [
    "Port Harcourt",
    "Obio-Akpor",
    "Eleme",
    "Ikwerre",
    "Etche",
    "Oyigbo",
    "Tai",
  ],
  Kano: [
    "Kano Municipal",
    "Fagge",
    "Dala",
    "Gwale",
    "Tarauni",
    "Nassarawa",
    "Ungogo",
  ],
  Oyo: ["Ibadan North", "Ibadan South", "Ogbomosho", "Oyo", "Iseyin", "Saki"],
  Delta: ["Warri", "Sapele", "Asaba", "Ughelli", "Effurun", "Agbor"],
  Anambra: ["Awka", "Onitsha", "Nnewi", "Ekwulobia", "Aguata", "Idemili"],
  Enugu: [
    "Enugu North",
    "Enugu South",
    "Igbo-Eze",
    "Nkanu",
    "Udi",
    "Igbo-Etiti",
  ],
  Kaduna: ["Kaduna North", "Kaduna South", "Zaria", "Kafanchan", "Kagoro"],
  Imo: ["Owerri", "Orlu", "Okigwe", "Mbaise", "Mbano", "Ngor Okpala"],
  Ogun: ["Abeokuta", "Sagamu", "Ijebu Ode", "Ota", "Ilaro", "Shagamu"],
  Edo: ["Benin City", "Ekpoma", "Auchi", "Uromi", "Esan", "Igueben"],
};

/* cart and delivery */
let cart = [];
let deliveryFee = 0;

// Add To Cart
function addToCart(btn, name, price) {
  let existing = cart.find((i) => i.name === name);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ name, price, qty: 1 });
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
  const [stateName, fee] = val.split(":");
  deliveryFee = parseInt(fee);

  const lgas = lgaData[stateName] || [];
  const lgaSelect = document.getElementById("lgaSelect");
  lgaSelect.innerHTML = '<option value="">-- Select LGA --</option>';
  lgas.forEach((lga) => {
    const opt = document.createElement("option");
    opt.value = lga;
    opt.textContent = lga;
    lgaSelect.appendChild(opt);
  });
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
        state: document.getElementById("stateSelect").value.split(":")[0],
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
