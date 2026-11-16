// Lazy Stripe client.
//
// Returns null when no STRIPE_SECRET_KEY is configured, so the server can
// boot and serve everything except real payments. Shop checkout answers
// 503 with a plain message in that case instead of crashing.
// Never hard-code or invent a key here — the key comes from the environment.

const Stripe = require('stripe');

let stripe = null;

function getStripe() {
  if (stripe) return stripe;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  stripe = new Stripe(key);
  return stripe;
}

function isStripeConfigured() {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

module.exports = { getStripe, isStripeConfigured };
