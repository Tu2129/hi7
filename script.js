const PAYSTACK_KEY = "pk_test_b8caca04e47c14d7e98e5ef05e5ac86d5e4e15aa";
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
let cart = [];
let deliveryFee = 0;
function addToCart(btn, name, price) {
  let existing = cart.find((i) => i.name === name);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ name, price, qty: 1 });
  }
  btn.textContent = "Added";
  btn.classList.add("added");
}
