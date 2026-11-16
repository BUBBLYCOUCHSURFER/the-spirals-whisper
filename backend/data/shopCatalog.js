// Default shop catalog. Seeded into MongoDB on server start (and by
// `node backend/seed.js`) when the shop_items collection is empty.
// Prices are in cents. Stripe Checkout sessions are built with inline
// price_data, so no Stripe Price IDs need to exist first.
//
// grants: what a paid order gives the buyer.
//   souls          -> added to the user's Souls balance
//   unlock         -> sets user.unlocked = true (full game)
//   battlePassTier -> tiers added to user.battlePassTier
//   cards          -> that many random card ids added to the player's collection

const SHOP_CATALOG = [
  {
    key: 'booster-pack',
    name: 'Booster Pack',
    description: 'Three random cards for your collection. Duplicates can appear.',
    type: 'booster_pack',
    priceCents: 299,
    currency: 'usd',
    grants: { cards: 3 },
    active: true,
  },
  {
    key: 'souls-500',
    name: '500 Souls',
    description: 'Souls for cosmetics and battle pass tiers.',
    type: 'souls',
    priceCents: 499,
    currency: 'usd',
    grants: { souls: 500 },
    active: true,
  },
  {
    key: 'souls-2000',
    name: '2000 Souls',
    description: 'A bigger Souls bundle for cosmetics and battle pass tiers.',
    type: 'souls',
    priceCents: 1499,
    currency: 'usd',
    grants: { souls: 2000 },
    active: true,
  },
  {
    key: 'battle-pass',
    name: 'Battle Pass',
    description: 'Unlocks the current season battle pass track.',
    type: 'battle_pass',
    priceCents: 999,
    currency: 'usd',
    grants: { battlePassTier: 1 },
    active: true,
  },
  {
    key: 'full-unlock',
    name: 'Full Game Unlock',
    description: 'Unlocks all premium events, endings, and content in one purchase.',
    type: 'unlock',
    priceCents: 499,
    currency: 'usd',
    grants: { unlock: true },
    active: true,
  },
];

module.exports = { SHOP_CATALOG };
