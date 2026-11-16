const express = require('express');
const Player = require('../models/Player');
const { CARD_IDS, CLASSES } = require('../data/cards');
const { requireDb } = require('../middleware/requireDb');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.use(requireAuth);
router.use(requireDb);

const MAX_DECK_SIZE = 40;
const XP_PER_LEVEL = 100;

async function loadPlayer(req, res) {
  const player = await Player.findOne({ user: req.userId });
  if (!player) {
    res.status(404).json({ error: 'Player profile not found' });
    return null;
  }
  return player;
}

// GET /api/player — own profile (class, level, gold, deck, collection).
router.get('/', async (req, res, next) => {
  try {
    const player = await loadPlayer(req, res);
    if (player) res.json({ player: player.toPublic() });
  } catch (err) {
    next(err);
  }
});

// GET /api/player/collection — just the owned card ids.
router.get('/collection', async (req, res, next) => {
  try {
    const player = await loadPlayer(req, res);
    if (player) res.json({ collection: player.cardCollection });
  } catch (err) {
    next(err);
  }
});

// PUT /api/player/deck { deck: [cardId, ...] }
// Deck must hold only known card ids the player owns, max 40 cards.
router.put('/deck', async (req, res, next) => {
  try {
    const { deck } = req.body || {};
    if (!Array.isArray(deck)) {
      return res.status(400).json({ error: 'deck must be an array of card ids' });
    }
    if (deck.length === 0) {
      return res.status(400).json({ error: 'Deck cannot be empty' });
    }
    if (deck.length > MAX_DECK_SIZE) {
      return res.status(400).json({ error: `Deck cannot hold more than ${MAX_DECK_SIZE} cards` });
    }
    const unknown = deck.filter((id) => !CARD_IDS.includes(id));
    if (unknown.length > 0) {
      return res.status(400).json({ error: `Unknown card ids: ${unknown.join(', ')}` });
    }

    const player = await loadPlayer(req, res);
    if (!player) return;

    const owned = new Set(player.cardCollection);
    const notOwned = [...new Set(deck)].filter((id) => !owned.has(id));
    if (notOwned.length > 0) {
      return res.status(400).json({ error: `Cards not in your collection: ${notOwned.join(', ')}` });
    }

    player.deck = deck;
    await player.save();
    return res.json({ player: player.toPublic() });
  } catch (err) {
    return next(err);
  }
});

// PUT /api/player/class { class: "Hunter" | "Occultist" | "Beastmaster" | "Rogue" }
router.put('/class', async (req, res, next) => {
  try {
    const { class: playerClass } = req.body || {};
    if (!CLASSES.includes(playerClass)) {
      return res.status(400).json({ error: `class must be one of: ${CLASSES.join(', ')}` });
    }
    const player = await loadPlayer(req, res);
    if (!player) return;
    player.class = playerClass;
    await player.save();
    return res.json({ player: player.toPublic() });
  } catch (err) {
    return next(err);
  }
});

// POST /api/player/progress { xp?, gold?, won? }
// Reports a finished run: adds xp/gold, counts a win or loss, levels up
// at 100 xp per level. Clients never set level directly.
router.post('/progress', async (req, res, next) => {
  try {
    const { xp = 0, gold = 0, won } = req.body || {};
    if (!Number.isInteger(xp) || xp < 0 || xp > 10000) {
      return res.status(400).json({ error: 'xp must be a whole number between 0 and 10000' });
    }
    if (!Number.isInteger(gold) || gold < 0 || gold > 10000) {
      return res.status(400).json({ error: 'gold must be a whole number between 0 and 10000' });
    }
    if (won !== undefined && typeof won !== 'boolean') {
      return res.status(400).json({ error: 'won must be true or false when given' });
    }

    const player = await loadPlayer(req, res);
    if (!player) return;

    player.xp += xp;
    player.gold += gold;
    if (won === true) player.wins += 1;
    if (won === false) player.losses += 1;
    player.level = Math.floor(player.xp / XP_PER_LEVEL) + 1;
    await player.save();
    return res.json({ player: player.toPublic() });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
