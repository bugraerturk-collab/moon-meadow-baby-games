# Moon & Meadow — Interactive Baby Shower Games

A responsive, QR-powered multiplayer baby shower game prototype built with Next.js.

## Included

- Host room creation with a unique six-digit code
- Room-specific QR joining without accounts or downloads
- Separate `/host/[room]` and `/join/[room]` experiences
- Live lobby, questions, answer reveal, scores, leaderboard, and final podium
- Six English baby shower games with demo content
- Touch-friendly responsive player UI and large-screen host UI
- Demo support for 30+ player records

## Realtime modes

The prototype works immediately in local demo mode across tabs on the same origin using `BroadcastChannel` and storage events.

For real phones and multiple devices, copy `.env.example` to `.env.local` and add a Supabase project URL and anon key. The app then uses Supabase Realtime broadcast channels automatically; no database table is required for the prototype.

## Run locally

```bash
npm install
npm run dev
```

## Vercel

The repository includes `vercel.json` and a verified `vercel-build` script. Add the optional Supabase environment variables in Vercel for multi-device realtime, then deploy normally.
