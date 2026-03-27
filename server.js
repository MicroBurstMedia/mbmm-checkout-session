const express = require('express');
const app = express();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const cors = require('cors');

app.use(express.json());
app.use(cors());

app.post('/create-checkout-session', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: { name: 'AI Automation Setup Systems E-Book' },
        unit_amount: 9700, // $97.00 in cents
      },
      quantity: 1,
    }],
    mode: 'payment',
    // These redirect the user back to your GitHub site after payment
    success_url: 'https://microburstmedia.github.io/success-thank-you-page',
    cancel_url: 'https://microburstmedia.github.io/digital-marketing-network/',
  });

  res.json({ id: session.id });
});

// --- CHATBOT ENDPOINT ---
app.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;
        
        // Replace this with your actual Google Apps Script Web App URL
        const scriptUrl = 'https://script.google.com/macros/s/AKfycbyA6OpUvs_Dqx5mnTH2HMmTWwz6-VM_KkdTFmQEI64DsKnvYAFpch0424Ye-u1iLIOWXA/exec';

        const response = await axios.post(scriptUrl, { message: message });
        
        res.json({ reply: response.data.reply });
    } catch (err) {
        res.status(500).json({ reply: "The operator is busy. Please try again." });
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));
