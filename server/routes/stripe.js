const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
require("dotenv").config();

// POST /api/payment/create-checkout-session
router.post("/create-checkout-session", async (req, res) => {
    const { amount, name, email } = req.body;

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "cad",
                        product_data: {
                            name: name || "Anonymous Donor",
                        },
                        unit_amount: Math.round(amount * 100), 
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            // using dynamic URLs from environment variables
            success_url: `${process.env.FRONTEND_URL}/`,
            cancel_url: `${process.env.FRONTEND_URL}/`,
            customer_email: email || undefined,
        });

        res.json({ id: session.id });
    } catch (error) {
        console.error("❌ Stripe error:", error.message);
        res.status(500).json({ error: "Stripe session creation failed" });
    }
});

module.exports = router;
