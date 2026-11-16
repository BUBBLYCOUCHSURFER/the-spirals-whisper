const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    key: { type: String, required: true },
    name: { type: String, required: true },
    priceCents: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: { type: [orderItemSchema], required: true },
    amountCents: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'usd' },
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'cancelled'],
      default: 'pending',
    },
    stripeSessionId: { type: String, default: '' },
    stripePaymentIntentId: { type: String, default: '' },
    // Set once the webhook has granted the items, so a retried webhook
    // can never grant the same purchase twice.
    granted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

orderSchema.methods.toPublic = function toPublic() {
  return {
    id: String(this._id),
    items: this.items,
    amountCents: this.amountCents,
    currency: this.currency,
    status: this.status,
    granted: this.granted,
    createdAt: this.createdAt,
  };
};

module.exports = mongoose.model('Order', orderSchema);
