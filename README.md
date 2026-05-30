# The Spiral's Whisper

A social horror game for group calls and late-night chats. The more you talk about it, the closer it gets.

## Features

- **Free Demo**: 2 events to get started
- **Premium Unlock**: One-time Gumroad payment to unlock 4+ additional events with deeper, creepier narratives
- **Group Play**: Read prompts aloud, vote as a group, tap the choice together
- **Corruption Meter**: Track how far the spiral has pulled you in
- **Junji Ito Aesthetic**: Dark, atmospheric UI with glitch text and horror vibes

## Tech Stack

- **Next.js 14** (Pages Router)
- **React 18** + TypeScript
- **Gumroad** for one-time payments
- **Vercel** deployment-ready

## Getting Started

### 1. Clone and Install

```bash
git clone https://github.com/BUBBLYCOUCHSURFER/the-spirals-whisper.git
cd the-spirals-whisper
npm install
```

### 2. Set Up Gumroad

1. Create a [Gumroad account](https://gumroad.com)
2. Create a new product:
   - Name: "Unlock The Spiral's Whisper"
   - Price: Set your desired price (e.g., $2.99, $4.99, $9.99)
   - Enable **License Keys** in product settings
3. Get your **Product ID** from the product URL (example: `https://gumroad.com/products/XXXXXX` → `XXXXXX`)
4. Update `.env.local`:

```bash
GUMROAD_USERNAME=your_gumroad_username
GUMROAD_PRODUCT_ID=your_product_id
GUMROAD_LICENSE_KEY=your_license_key (optional for advanced verification)
```

### 3. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
the-spirals-whisper/
├─ src/
│  ├─ pages/
│  │  ├─ index.tsx          # Landing page
│  │  ├─ play.tsx           # Game room
│  │  ├─ unlock.tsx         # Post-payment success
│  │  └─ _app.tsx           # Global app wrapper
│  ├─ components/
│  │  ├─ Layout.tsx         # Main container
│  │  ├─ SpiralMeter.tsx    # Corruption progress bar
│  │  └─ EventCard.tsx      # Individual event prompt + choices
│  ├─ lib/
│  │  ├─ gumroad.ts         # Gumroad integration
│  │  ├─ gameData.ts        # Free + premium events
│  │  └─ unlockStore.ts     # localStorage unlock manager
│  └─ styles/
│     └─ globals.css        # Dark theme + animations
├─ public/
│  └─ favicon.ico
├─ package.json
├─ next.config.mjs
├─ tsconfig.json
└─ .env.local (git-ignored)
```

## Pages

- **`/`** – Landing page with game description
- **`/play`** – Main game room (free events or all events if unlocked)
- **`/unlock`** – Post-payment success screen

## Gameplay

1. Start a session on `/play`
2. Read the event prompt aloud to your group
3. Let everyone vote; tap the choice you agree on
4. Watch your corruption meter rise
5. If you run out of events, you get an ending message
6. Premium unlock reveals darker, longer events

## Deployment to Vercel

1. Push this repo to GitHub
2. Import it into [Vercel](https://vercel.com/new)
3. Add environment variables:
   - `GUMROAD_USERNAME`
   - `GUMROAD_PRODUCT_ID`
4. Deploy!

## How Gumroad Integration Works

- When a user clicks "Unlock the Spiral," they're prompted to enter their email
- The app redirects to your Gumroad checkout with a success redirect URL
- After payment, Gumroad redirects back to `/unlock?success=1`
- The game unlocks locally via localStorage
- Users receive their license key via email from Gumroad

## Next Steps

- Add 10–20 more events in Junji Ito–inspired themes
- Implement room codes so groups can sync choices in real-time
- Add user authentication for persistent unlock status
- Add sound effects and visual glitches on certain choices
- Integrate license key verification (backend validation)

## License

MIT
