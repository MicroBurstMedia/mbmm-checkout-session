const express = require('express');
const app = express();
const cors = require('cors');
const axios = require('axios');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// --- 1. CONFIGURATION ---
app.use(express.json());
app.use(cors());

// --- 2. STRIPE ENDPOINT (Purchases) ---
app.post('/create-checkout-session', async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: { name: 'AI Automation Setup Systems E-Book' },
                    unit_amount: 9700, // $97.00
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: 'https://microburstmedia.github.io/success-thank-you-page',
            cancel_url: 'https://microburstmedia.github.io/digital-marketing-network/',
        });
        res.json({ id: session.id });
    } catch (err) {
        console.error("Stripe Error:", err.message);
        res.status(500).json({ error: "Checkout connection failed." });
    }
});

// --- 3. CHATBOT ENDPOINT (Google Sheets Only) ---
app.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;
        
        // YOUR GOOGLE APPS SCRIPT URL
        const scriptUrl = 'https://script.google.com/macros/s/AKfycbzYsW53JScMQ1lpe0Jfax7MzylYVXu0MypvBghtPHMSPEBraYMrpy2X4M0P-NcDkWVn/exec';

        // Direct hand-off to Google Sheets
        const response = await axios.post(scriptUrl, { message: message });
        
        // Send the Sheet's answer back to the website
        res.json({ reply: response.data.reply });

    } catch (err) {
        console.error("Chat Connection Error:", err.message);
        res.status(500).json({ reply: "The MBMN Switchboard is currently busy. Please try again." });
    }
});

// --- 4. START SERVER ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`MBMN System Active on Port ${PORT}`);
});
