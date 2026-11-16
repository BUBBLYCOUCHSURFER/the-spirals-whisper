// Server-side copy of the card list and starter decks.
// This mirrors frontend/js/cardEngine.js — keep the two in sync when new
// cards are added. The backend needs the ids to validate decks and to
// grant cards from booster packs.

const CARD_IDS = [
  'keen-shot',
  'bloodhound-snarl',
  'shadow-bolt',
  'cursed-mirror',
  'pack-tactics',
  'shadow-pact',
  'backstab',
  'smokescreen',
];

const CLASSES = ['Hunter', 'Occultist', 'Beastmaster', 'Rogue'];

const STARTER_DECKS = {
  Hunter: [
    'keen-shot', 'keen-shot', 'keen-shot',
    'bloodhound-snarl', 'bloodhound-snarl',
    'keen-shot', 'keen-shot',
    'bloodhound-snarl', 'bloodhound-snarl',
    'keen-shot',
  ],
  Occultist: [
    'shadow-bolt', 'shadow-bolt', 'shadow-bolt',
    'cursed-mirror', 'cursed-mirror',
    'shadow-bolt', 'shadow-bolt',
    'cursed-mirror',
    'shadow-bolt', 'shadow-bolt',
  ],
  Beastmaster: [
    'pack-tactics', 'pack-tactics', 'pack-tactics',
    'shadow-pact', 'shadow-pact',
    'pack-tactics', 'pack-tactics', 'pack-tactics',
    'shadow-pact',
    'pack-tactics',
  ],
  Rogue: [
    'backstab', 'backstab', 'backstab',
    'smokescreen', 'smokescreen',
    'backstab', 'backstab', 'backstab',
    'smokescreen',
    'backstab',
  ],
};

module.exports = { CARD_IDS, CLASSES, STARTER_DECKS };
