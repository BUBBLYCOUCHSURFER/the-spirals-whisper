const mongoose = require('mongoose');
const { CLASSES, STARTER_DECKS } = require('../data/cards');

const playerSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    class: { type: String, enum: CLASSES, default: 'Hunter' },
    level: { type: Number, default: 1, min: 1 },
    xp: { type: Number, default: 0, min: 0 },
    gold: { type: Number, default: 0, min: 0 },
    wins: { type: Number, default: 0, min: 0 },
    losses: { type: Number, default: 0, min: 0 },
    // Deck and collection hold card ids from backend/data/cards.js, which
    // mirrors frontend/js/cardEngine.js. Duplicates are allowed: a deck
    // can hold several copies of the same card.
    deck: { type: [String], default: [] },
    // Stored as cardCollection: `collection` is a reserved Mongoose
    // pathname and breaks document behavior. The API still exposes it
    // as `collection` (see toPublic below).
    cardCollection: { type: [String], default: [] },
  },
  { timestamps: true }
);

playerSchema.methods.toPublic = function toPublic() {
  return {
    user: String(this.user),
    class: this.class,
    level: this.level,
    xp: this.xp,
    gold: this.gold,
    wins: this.wins,
    losses: this.losses,
    deck: this.deck,
    collection: this.cardCollection,
    updatedAt: this.updatedAt,
  };
};

// A new player starts with their class starter deck, owned from the start.
playerSchema.statics.newForUser = function newForUser(userId, playerClass) {
  const klass = CLASSES.includes(playerClass) ? playerClass : 'Hunter';
  const starter = STARTER_DECKS[klass] || STARTER_DECKS.Hunter;
  return new this({ user: userId, class: klass, deck: [...starter], cardCollection: [...starter] });
};

module.exports = mongoose.model('Player', playerSchema);
