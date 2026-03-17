const Stripe = require('stripe');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const PRICE_ID = 'price_1TBzpeBAti4xomeCGdX5BfN1';

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const { userId, email } = req.body;
  if (!userId) return res.status(400).json({ error: 'Missing userId' });

  const origin = req.headers.origin || 'https://breathwod.app';

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    customer_email: email,
    line_items: [{ price: PRICE_ID, quantity: 1 }],
    success_url: `${origin}/?payment=success`,
    cancel_url: `${origin}/?payment=cancel`,
    allow_promotion_codes: true,
    metadata: { clerk_user_id: userId },
  });

  res.json({ url: session.url });
};
