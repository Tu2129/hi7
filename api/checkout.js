// api/checkout.js
// This file runs on the server — nobody can see it

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      reference,
      email,
      items,
      subtotal,
      deliveryFee,
      total,
      state,
      lga,
      address,
    } = req.body;

    // ── STEP 1: Verify payment with Paystack ──
    // This confirms the payment is real and not fake
    const paystackRes = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      },
    );

    const paystackData = await paystackRes.json();

    if (!paystackData.status || paystackData.data.status !== "success") {
      return res.status(400).json({ error: "Payment verification failed" });
    }

    // ── STEP 2: Save order to Supabase ──
    const supabaseRes = await fetch(
      `${process.env.SUPABASE_URL}/rest/v1/orders`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: process.env.SUPABASE_KEY,
          Authorization: `Bearer ${process.env.SUPABASE_KEY}`,
        },
        body: JSON.stringify({
          reference,
          email,
          items,
          subtotal,
          delivery_fee: deliveryFee,
          total,
          state,
          lga,
          address,
        }),
      },
    );

    if (!supabaseRes.ok) {
      return res.status(500).json({ error: "Failed to save order" });
    }

    // ── STEP 3: Send success back to the browser ──
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
