const mongoose = require('mongoose');

const shopItemSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true },
    description: { type: String, default: '' },
    type: {
      type: String,
      required: true,
      enum: ['booster_pack', 'souls', 'battle_pass', 'unlock'],
    },
    priceCents: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'usd' },
    // Optional Stripe Price ID. When empty, checkout builds the price
    // inline from priceCents, so nothing has to be pre-created in Stripe.
    stripePriceId: { type: String, default: '' },
    grants: {
      souls: { type: Number, default: 0 },
      unlock: { type: Boolean, default: false },
      battlePassTier: { type: Number, default: 0 },
      cards: { type: Number, default: 0 },
    },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

shopItemSchema.methods.toPublic = function toPublic() {
  return {
    key: this.key,
    name: this.name,
    description: this.description,
    type: this.type,
    priceCents: this.priceCents,
    currency: this.currency,
    grants: this.grants,
    active: this.active,
  };
};

module.exports = mongoose.model('ShopItem', shopItemSchema);
