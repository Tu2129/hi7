module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      reference,
      email,
      name,
      phone,
      items,
      subtotal,
      deliveryFee,
      total,
      state,
      lga,
      address,
    } = req.body;

    console.log("Step 1: Verifying payment with Paystack...");
    console.log("Reference:", reference);
    console.log(
      "PAYSTACK_SECRET_KEY exists:",
      !!process.env.PAYSTACK_SECRET_KEY,
    );
    console.log("SUPABASE_URL:", process.env.SUPABASE_URL);

    // Verify payment with Paystack
    const paystackRes = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      },
    );

    const paystackData = await paystackRes.json();
    console.log("Paystack response status:", paystackData.status);
    console.log("Paystack transaction status:", paystackData.data?.status);

    if (!paystackData.status || paystackData.data.status !== "success") {
      return res
        .status(400)
        .json({ error: "Payment verification failed", paystackData });
    }

    console.log("Step 2: Saving to Supabase...");

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
          name,
          phone,
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

    const supabaseText = await supabaseRes.text();
    console.log("Supabase status:", supabaseRes.status);
    console.log("Supabase response:", supabaseText);

    if (!supabaseRes.ok) {
      return res
        .status(500)
        .json({ error: "Failed to save order", supabaseText });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.log("Error:", err.message);
    return res.status(500).json({ error: err.message });
  }
};
