const express = require('express');
const ShopItem = require('../models/ShopItem');
const Order = require('../models/Order');
const User = require('../models/User');
const Player = require('../models/Player');
const { CARD_IDS } = require('../data/cards');
const { requireDb } = require('../middleware/requireDb');
const { requireAuth } = require('../middleware/auth');
const { getStripe, isStripeConfigured } = require('../lib/stripe');

const router = express.Router();

// Grant a paid order's items to the buyer. Idempotent: a second call for
// an already-granted order changes nothing.
async function grantOrder(order) {
  if (order.granted) return;

  const user = await User.findById(order.user);
  if (!user) throw new Error(`Cannot grant order ${order._id}: user not found`);

  const items = await ShopItem.find({ key: { $in: order.items.map((i) => i.key) } });
  const byKey = new Map(items.map((item) => [item.key, item]));

  const player = await Player.findOne({ user: user._id });

  for (const line of order.items) {
    const item = byKey.get(line.key);
    if (!item) continue;
    const grants = item.grants || {};
    for (let n = 0; n < line.quantity; n += 1) {
      if (grants.souls) user.souls += grants.souls;
      if (grants.unlock) user.unlocked = true;
      if (grants.battlePassTier) user.battlePassTier += grants.battlePassTier;
      if (grants.cards && player) {
        for (let c = 0; c < grants.cards; c += 1) {
          player.cardCollection.push(CARD_IDS[Math.floor(Math.random() * CARD_IDS.length)]);
        }
      }
    }
  }

  await user.save();
  if (player) await player.save();

  order.granted = true;
  await order.save();
}

// GET /api/shop/items — public catalog of active shop items.
router.get('/items', requireDb, async (req, res, next) => {
  try {
    const items = await ShopItem.find({ active: true }).sort({ priceCents: 1 });
    return res.json({ items: items.map((item) => item.toPublic()) });
  } catch (err) {
    return next(err);
  }
});

// GET /api/shop/orders — the logged-in user's orders, newest first.
router.get('/orders', requireAuth, requireDb, async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.userId }).sort({ createdAt: -1 }).limit(50);
    return res.json({ orders: orders.map((order) => order.toPublic()) });
  } catch (err) {
    return next(err);
  }
});

// POST /api/shop/checkout { items: [{ key, quantity }] }
// Creates a pending order and a Stripe Checkout session, and returns the
// session URL to redirect the buyer to. Needs STRIPE_SECRET_KEY; without
// it, answers 503 and no order is created.
router.post('/checkout', requireAuth, requireDb, async (req, res, next) => {
  try {
    const { items } = req.body || {};
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'items must be a non-empty array of { key, quantity }' });
    }

    const keys = items.map((i) => i && i.key).filter(Boolean);
    const catalog = await ShopItem.find({ key: { $in: keys }, active: true });
    if (catalog.length !== keys.length) {
      return res.status(400).json({ error: 'One or more shop items are unknown or unavailable' });
    }
    const byKey = new Map(catalog.map((item) => [item.key, item]));

    const lines = [];
    let amountCents = 0;
    for (const line of items) {
      const quantity = line.quantity === undefined ? 1 : line.quantity;
      if (!Number.isInteger(quantity) || quantity < 1 || quantity > 10) {
        return res.status(400).json({ error: 'quantity must be a whole number between 1 and 10' });
      }
      const item = byKey.get(line.key);
      lines.push({ key: item.key, name: item.name, priceCents: item.priceCents, quantity });
      amountCents += item.priceCents * quantity;
    }

    const stripe = getStripe();
    if (!stripe) {
      return res.status(503).json({
        error: 'Payments are not configured — set STRIPE_SECRET_KEY (see .env.example) and restart the server.',
      });
    }

    const currency = process.env.STRIPE_CURRENCY || 'usd';
    const frontendUrl = (process.env.FRONTEND_URL || 'http://localhost:3000').replace(/\/$/, '');
    const successUrl = process.env.PAYMENT_SUCCESS_URL || `${frontendUrl}/payment/success`;
    const cancelUrl = process.env.PAYMENT_CANCEL_URL || `${frontendUrl}/payment/cancel`;

    const order = new Order({ user: req.userId, items: lines, amountCents, currency });
    await order.save();

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lines.map((line) => {
        const item = byKey.get(line.key);
        if (item.stripePriceId) {
          return { price: item.stripePriceId, quantity: line.quantity };
        }
        return {
          price_data: {
            currency,
            unit_amount: line.priceCents,
            product_data: { name: line.name },
          },
          quantity: line.quantity,
        };
      }),
      success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
      metadata: { orderId: String(order._id), userId: String(req.userId) },
    });

    order.stripeSessionId = session.id;
    await order.save();

    return res.status(201).json({ order: order.toPublic(), url: session.url });
  } catch (err) {
    return next(err);
  }
});

// POST /api/shop/webhook — Stripe webhook (raw body; mounted before the
// JSON parser in server.js). Verifies the Stripe signature, marks the
// order paid on checkout.session.completed, and grants its items.
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res, next) => {
  try {
    const stripe = getStripe();
    if (!stripe) {
      return res.status(503).send('Payments are not configured');
    }
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      return res.status(503).send('STRIPE_WEBHOOK_SECRET is not set');
    }

    const signature = req.headers['stripe-signature'];
    if (!signature) {
      return res.status(400).send('Missing Stripe signature');
    }

    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const orderId = session.metadata && session.metadata.orderId;
      const order = orderId ? await Order.findById(orderId) : null;
      if (order && order.status !== 'paid') {
        order.status = 'paid';
        order.stripePaymentIntentId = session.payment_intent || '';
        await order.save();
        await grantOrder(order);
      }
    } else if (event.type === 'checkout.session.expired' || event.type === 'payment_intent.payment_failed') {
      const session = event.data.object;
      const orderId = session.metadata && session.metadata.orderId;
      const order = orderId ? await Order.findById(orderId) : null;
      if (order && order.status === 'pending') {
        order.status = event.type === 'checkout.session.expired' ? 'cancelled' : 'failed';
        await order.save();
      }
    }

    return res.json({ received: true });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
