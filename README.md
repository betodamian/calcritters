# CalCritters

CalCritters is an interactive campus alternate reality game. Students scan QR
codes placed at real campus landmarks to meet AI-driven critters, each with its
own personality, home, and stories to tell. Find a code, scan it, and have a
real conversation with the creature that lives there.

Built with Next.js and the Claude API. The app is fully playable out of the box:
with no API key set it runs in demo mode with scripted, in-character replies, and
adding a key powers live, model-driven conversations.

## Features

- **Six critters** stationed at recognizable campus locations, from the bell
  tower to the creek to the fire trails.
- **Live chat** with every critter through a streaming Claude API endpoint, each
  character driven by its own system prompt.
- **Demo mode** that keeps the whole experience working with zero configuration,
  so the project runs anywhere without secrets.
- **Critterdex** that tracks which critters you have met, stored in the browser
  so there are no accounts to manage.
- **Printable QR codes** generated in-app for organizers to place around campus.
- **Robust API route** with input validation and lightweight rate limiting to
  protect the chat endpoint and keep model spend in check.

## Tech stack

- [Next.js](https://nextjs.org) (App Router) and React
- TypeScript
- The [Claude API](https://www.anthropic.com/api) via `@anthropic-ai/sdk`
- `qrcode` for in-app QR generation
- Optional Postgres / Supabase schema for server-side persistence

## Getting started

Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

That is all you need to try it. The chat works immediately in demo mode.

### Enabling live conversations

To have critters reply through Claude instead of the scripted fallback, copy the
example env file and add your key:

```bash
cp .env.example .env.local
```

Then set `ANTHROPIC_API_KEY` in `.env.local`. You can get a key from the
[Anthropic Console](https://console.anthropic.com/). Restart the dev server and
the chat header will switch from "Demo mode" to "Online".

The model defaults to `claude-opus-4-8` and can be changed with the optional
`CALCRITTERS_MODEL` variable.

## How it works

1. An organizer prints the QR codes from the `/qr` page and places each one at
   its critter's campus location.
2. A player scans a code, which opens that critter's page and adds it to their
   Critterdex.
3. The player chats with the critter. Messages are sent to the `/api/chat`
   route, which builds the critter's persona into a system prompt and streams a
   reply back from Claude.

## Project structure

```
app/
  api/chat/route.ts        Streaming chat endpoint with validation + rate limiting
  critter/[slug]/          Critter page and its chat client component
  critters/                The Critterdex grid
  qr/                      Printable QR codes for organizers
  components/              Shared UI (critter card, progress stat)
lib/
  critters.ts              Critter data and personas
  anthropic.ts             Claude client and scripted demo fallback
  rate-limit.ts            In-memory rate limiter
  progress.ts              Browser-stored discovery tracking
supabase/
  schema.sql               Optional database schema for server-side persistence
```

## Configuration

All configuration is through environment variables. See `.env.example` for the
full list. Every key is optional. No secrets are committed to the repository.

| Variable | Required | Purpose |
| --- | --- | --- |
| `ANTHROPIC_API_KEY` | No | Enables live, model-driven critter chat. Without it the app runs in demo mode. |
| `CALCRITTERS_MODEL` | No | Overrides the Claude model used for chat. Defaults to `claude-opus-4-8`. |

## Deployment

The app deploys cleanly to any Next.js host (such as Vercel or Cloudflare). Set
`ANTHROPIC_API_KEY` in the host's environment settings to enable live chat in
production, then reload the `/qr` page so the printable codes encode your live
URL.

## Scripts

```bash
npm run dev      # start the dev server
npm run build    # production build
npm run start    # run the production build
npm run lint     # lint the project
```
