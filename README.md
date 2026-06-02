# Cardbound Chronicles: Dungeon Run

**A Premium Dark Fantasy TTRPG Deckbuilder Game**

A desktop-optimized, atmospheric card-battler blending Yu-Gi-Oh strategy with asymmetric horror survival. Players explore procedurally generated dungeons, battle horrific creatures, and build powerful decks in real-time tactical duels.

## 🎮 Game Overview

- **Genre**: Dark Fantasy, Deckbuilder, Rogue-like, Tactical RPG
- **Modes**: Solo, Co-op (1-4 players), PvPvE
- **Aesthetics**: Deep obsidian backgrounds, slate gray UI, crimson danger indicators, radiant gold accents
- **Core Mechanics**: Turn-based card combat, deck synergy, Doom scaling, deck fusion, ghost hand legacy

## 🎨 Design System

**Color Palette**:
- Background: Deep Obsidian Black (#0B0B0C)
- UI Containers: Slate Gray (#1F2937)
- Danger: Crimson (#DC2626)
- Highlights: Gold (#F59E0B)
- Text: Parchment White (#F8FAFC)

## 🚀 Features

### Landing Page
- Hero section with title & CTA
- Media download with SHA-256 verification
- Interactive class showcases with morality sliders
- Card spotlight gallery
- Monetization preview (packs, souls, battle pass)

### Combat Simulator
- Turn-based card battles
- Monster AI with attacks
- Hand management & discard pile
- Victory/defeat overlays

### Backend
- Player persistence (MongoDB/PostgreSQL)
- Card collections & decks
- Battle pass tracking
- Stripe integration with webhooks

## 📦 Installation

```bash
git clone https://github.com/BUBBLYCOUCHSURFER/the-spirals-whisper.git
cd the-spirals-whisper
npm install
cp .env.example .env
npm run dev
```

## 🎮 Starting the Game

Open `frontend/index.html` in your browser to view the landing page and combat simulator.

## 🔗 Key Files

- `frontend/index.html` - Landing page + combat simulator markup
- `frontend/css/style.css` - Dark tabletop theme (obsidian, slate, gold, crimson)
- `frontend/js/app.js` - Main application logic
- `frontend/js/cardEngine.js` - Card definitions & starter decks
- `frontend/js/combat.js` - Combat mechanics & UI rendering
- `backend/server.js` - Express.js server (development stage)

## 📋 Game Rules Summary

### Turn Structure
1. **Draw Phase**: Draw 5 cards (reshuffle discard if deck empty)
2. **Action Phase**: Play cards spending Mana
3. **End Phase**: Discard hand, reset Mana, trigger monster attack

### Victory
Reduce monster health to 0

## 🎴 Classes

- **Hunter** (30 HP, 5 Mana): Burst damage + loot
- **Occultist** (25 HP, 6 Mana): Forbidden magic + Doom
- **Beastmaster** (28 HP, 5 Mana): Board presence + summoning
- **Rogue** (32 HP, 5 Mana): Cheap spells + evasion

## 📄 License

MIT License
