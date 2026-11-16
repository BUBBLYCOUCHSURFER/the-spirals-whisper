// Seed the shop catalog: `node backend/seed.js`
// Upserts every item in backend/data/shopCatalog.js without touching
// anything else. Needs MONGODB_URI (see .env.example).

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
require('dotenv').config();
const mongoose = require('mongoose');
const ShopItem = require('./models/ShopItem');
const { SHOP_CATALOG } = require('./data/shopCatalog');

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI is not set. Copy .env.example to .env and fill it in.');
    process.exit(1);
  }

  await mongoose.connect(uri);
  let created = 0;
  let updated = 0;
  for (const item of SHOP_CATALOG) {
    const result = await ShopItem.updateOne(
      { key: item.key },
      { $set: item },
      { upsert: true }
    );
    if (result.upsertedCount > 0) created += 1;
    else updated += 1;
  }
  console.log(`Shop catalog seeded: ${created} created, ${updated} already present.`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
