const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    passwordHash: { type: String, required: true },
    // Souls are the in-game currency (bought in the shop, earned in play).
    souls: { type: Number, default: 0, min: 0 },
    // Full-game unlock (premium events / content), granted by a paid order.
    unlocked: { type: Boolean, default: false },
    battlePassTier: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

userSchema.methods.setPassword = async function setPassword(password) {
  this.passwordHash = await bcrypt.hash(password, 10);
};

userSchema.methods.checkPassword = async function checkPassword(password) {
  return bcrypt.compare(password, this.passwordHash);
};

// Public view: never send passwordHash to a client.
userSchema.methods.toPublic = function toPublic() {
  return {
    id: String(this._id),
    username: this.username,
    email: this.email,
    souls: this.souls,
    unlocked: this.unlocked,
    battlePassTier: this.battlePassTier,
    createdAt: this.createdAt,
  };
};

module.exports = mongoose.model('User', userSchema);
