# The Spiral's Whisper

A social horror game for group calls and late-night chats. The more you talk about it, the closer it gets.

## Features

- **Free Demo**: 2 events to get started
- **Premium Unlock**: One-time Stripe payment to unlock 4+ additional events with deeper, creepier narratives
- **Group Play**: Read prompts aloud, vote as a group, tap the choice together
- **Corruption Meter**: Track how far the spiral has pulled you in
- **Junji Ito Aesthetic**: Dark, atmospheric UI with glitch text and horror vibes

## Tech Stack

- **Next.js 14** (Pages Router)
- **React 18** + TypeScript
- **Stripe** for one-time payments
- **Vercel** deployment-ready

## Getting Started

### 1. Clone and Install

```bash
git clone https://github.com/BUBBLYCOUCHSURFER/the-spirals-whisper.git
cd the-spirals-whisper
npm install
```

### 2. Set Up Stripe

1. Create a [Stripe account](https://stripe.com)
2. Go to **Developers → API Keys** and copy your secret and publishable keys
3. Create a **Product** and **Price** in the Stripe Dashboard
4. Update `.env.local`:

```bash
STRIPESECRETKEY=sk_test_...
NEXTPUBLICSTRIPEPUBLISHABLEKEY=pk_test_...
STRIPEPRICEID=price_...
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
│  │  ├─ _app.tsx           # Global app wrapper
│  │  └─ api/
│  │     ├─ checkout.ts     # Stripe Checkout session
│  │     └─ webhook.ts      # Stripe webhook (optional)
│  ├─ components/
│  │  ├─ Layout.tsx         # Main container
│  │  ├─ SpiralMeter.tsx    # Corruption progress bar
│  │  └─ EventCard.tsx      # Individual event prompt + choices
│  ├─ lib/
│  │  ├─ stripe.ts          # Stripe client
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
- **`/api/checkout`** – Create Stripe Checkout session
- **`/api/webhook`** – Stripe webhook handler (stub for now)

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
   - `STRIPESECRETKEY`
   - `NEXTPUBLICSTRIPEPUBLISHABLEKEY`
   - `STRIPEPRICEID`
   - `STRIPEWEBHOOKSECRET` (optional)
4. Deploy!

## Next Steps

- Add 10–20 more events in Junji Ito–inspired themes
- Implement room codes so groups can sync choices in real-time
- Add user authentication for persistent unlock status
- Wire up Stripe webhooks to a database for unlock verification
- Add sound effects and visual glitches on certain choices

## License

MIT
