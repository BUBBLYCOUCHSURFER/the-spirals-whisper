// Card definitions and game mechanics

const CARD_CATALOG = {
  'keen-shot': {
    id: 'keen-shot',
    name: 'Keen Shot',
    class: 'Hunter',
    type: 'Attack',
    cost: 1,
    effect: () => ({ damage: 3, description: 'Deal 3 damage' }),
    flavor: 'Swift and true.'
  },
  'bloodhound-snarl': {
    id: 'bloodhound-snarl',
    name: "Bloodhound's Snarl",
    class: 'Hunter',
    type: 'Attack',
    cost: 2,
    effect: (target) => ({
      damage: 4,
      gold: target.health <= 4 ? 1 : 0,
      description: 'Deal 4 damage. If fatal, gain +1 Gold'
    }),
    flavor: 'The hunt always pays.'
  },
  'shadow-bolt': {
    id: 'shadow-bolt',
    name: 'Shadow Bolt',
    class: 'Occultist',
    type: 'Spell',
    cost: 2,
    effect: () => ({ damage: 4, description: 'Deal 4 damage' }),
    flavor: 'Darkness answers.'
  },
  'cursed-mirror': {
    id: 'cursed-mirror',
    name: 'Cursed Mirror',
    class: 'Occultist',
    type: 'Relic',
    cost: 1,
    effect: () => ({ description: 'Copy last spell (+1 Mana)' }),
    flavor: 'Reflections lie louder than words.'
  },
  'pack-tactics': {
    id: 'pack-tactics',
    name: 'Pack Tactics',
    class: 'Beastmaster',
    type: 'Summon',
    cost: 2,
    effect: () => ({ description: 'Summon 1/1 Wolf' }),
    flavor: 'Strength in numbers.'
  },
  'shadow-pact': {
    id: 'shadow-pact',
    name: 'Shadow Pact',
    class: 'Beastmaster',
    type: 'Summon',
    cost: 3,
    effect: () => ({ description: 'Summon 3/3 Phantom Wolf' }),
    flavor: 'Loyalty has teeth.'
  },
  'backstab': {
    id: 'backstab',
    name: 'Backstab',
    class: 'Rogue',
    type: 'Attack',
    cost: 1,
    effect: () => ({ damage: 5, description: 'Deal 5 damage' }),
    flavor: 'They never saw it coming.'
  },
  'smokescreen': {
    id: 'smokescreen',
    name: 'Smokescreen',
    class: 'Rogue',
    type: 'Skill',
    cost: 2,
    effect: () => ({ description: 'Gain +2 Armor, draw a card' }),
    flavor: 'Vanish.'
  }
};

const STARTER_DECKS = {
  hunter: ['keen-shot', 'keen-shot', 'keen-shot', 'bloodhound-snarl', 'bloodhound-snarl', 'keen-shot', 'keen-shot', 'bloodhound-snarl', 'bloodhound-snarl', 'keen-shot'],
  occultist: ['shadow-bolt', 'shadow-bolt', 'shadow-bolt', 'cursed-mirror', 'cursed-mirror', 'shadow-bolt', 'shadow-bolt', 'cursed-mirror', 'shadow-bolt', 'shadow-bolt'],
  beastmaster: ['pack-tactics', 'pack-tactics', 'pack-tactics', 'shadow-pact', 'shadow-pact', 'pack-tactics', 'pack-tactics', 'pack-tactics', 'shadow-pact', 'pack-tactics'],
  rogue: ['backstab', 'backstab', 'backstab', 'smokescreen', 'smokescreen', 'backstab', 'backstab', 'backstab', 'smokescreen', 'backstab']
};

const CLASS_STATS = {
  hunter: { health: 30, mana: 5, specialty: 'Gold Multiplier' },
  occultist: { health: 25, mana: 6, specialty: 'Doom Affinity' },
  beastmaster: { health: 28, mana: 5, specialty: 'Summon Scaling' },
  rogue: { health: 32, mana: 5, specialty: 'Evasion' }
};

function getCard(cardId) { return CARD_CATALOG[cardId]; }
function getStarterDeck(className) { return STARTER_DECKS[className.toLowerCase()] || STARTER_DECKS.hunter; }
function getClassStats(className) { return CLASS_STATS[className.toLowerCase()] || CLASS_STATS.hunter; }

window.CardEngine = { CARD_CATALOG, STARTER_DECKS, CLASS_STATS, getCard, getStarterDeck, getClassStats };
