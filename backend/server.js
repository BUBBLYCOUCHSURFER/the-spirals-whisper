require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const { connectToDatabase, isDbConnected } = require('./db');
const { isStripeConfigured } = require('./lib/stripe');
const ShopItem = require('./models/ShopItem');
const { SHOP_CATALOG } = require('./data/shopCatalog');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:3000' }));

const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || 900000),
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || 100),
  message: 'Too many requests, please try again later.'
});
app.use('/api/', limiter);

// Stripe webhooks need the raw request body to verify the signature, so
// the JSON parser skips that one path. The webhook route parses the raw
// body itself (see backend/routes/shop.js).
app.use((req, res, next) => {
  if (req.path === '/api/shop/webhook') return next();
  return express.json()(req, res, next);
});
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: isDbConnected() ? 'connected' : 'disconnected',
    stripeConfigured: isStripeConfigured(),
  });
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/player', require('./routes/player'));
app.use('/api/shop', require('./routes/shop'));

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

// Seed the default shop catalog the first time the database is empty.
async function seedShopCatalog() {
  try {
    const count = await ShopItem.estimatedDocumentCount();
    if (count === 0) {
      await ShopItem.insertMany(SHOP_CATALOG);
      console.log(`🛒 Seeded ${SHOP_CATALOG.length} default shop items (see backend/data/shopCatalog.js).`);
    }
  } catch (err) {
    console.warn('[shop] Could not seed shop catalog:', err.message);
  }
}

async function start() {
  const connected = await connectToDatabase();
  if (connected) await seedShopCatalog();

  app.listen(PORT, () => {
    console.log(`🎮 Cardbound Chronicles server running on port ${PORT}`);
    if (!connected) {
      console.log('⚠️  Running without a database — /api/auth, /api/player and /api/shop answer 503 until MONGODB_URI is set.');
    }
    if (!isStripeConfigured()) {
      console.log('⚠️  STRIPE_SECRET_KEY is not set — shop checkout answers 503 until payments are configured.');
    }
  });
}

if (require.main === module) {
  start();
}

module.exports = app;
