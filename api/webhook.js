const Stripe = require('stripe');
const { createClerkClient } = require('@clerk/backend');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

function getRawBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => { data += chunk; });
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();

  const rawBody = await getRawBody(req);
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.metadata?.clerk_user_id;
    if (userId) {
      await clerk.users.updateUserMetadata(userId, {
        publicMetadata: { isPremium: true, stripeCustomerId: session.customer },
      });
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    const customerId = event.data.object.customer;
    const customer = await stripe.customers.retrieve(customerId);
    const userId = customer.metadata?.clerk_user_id;
    if (userId) {
      await clerk.users.updateUserMetadata(userId, {
        publicMetadata: { isPremium: false },
      });
    }
  }

  res.json({ received: true });
};
