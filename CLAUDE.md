@AGENTS.md

# CLAUDE.md

Guidance for AI assistants working in this repository. Read this fully before
making changes, and follow the rules in `AGENTS.md` (imported above).

## What this is

The personal portfolio + telehealth website of **Dr. Rahul Parajuli**, an
ECFMG-certified physician and clinical researcher. It is a single Next.js app
served in production from a cPanel host (domain `rahulparajuli.com.np`) behind a
custom Node runner. Despite the profile-style `README.md` at the repo root, the
actual project is the Next.js app documented here.

## Critical rules (read first)

- **This is Next.js 16 / React 19 — not the versions in your training data.**
  Per `AGENTS.md`, breaking changes exist in APIs, conventions, and file
  structure. Before writing framework code, consult the bundled docs at
  `node_modules/next/dist/docs/` and heed deprecation notices. (These docs only
  exist after `npm install`; run it first — `node_modules` is gitignored.)
- **Never commit secrets.** All credentials live in `.env.local`, which is
  gitignored along with `.env*`. Never hardcode API keys or SMTP passwords.
- **`messages.csv` and `*.log` are gitignored runtime data** written by the
  contact form at runtime — do not commit them.

## Tech stack

- **Next.js 16.2.9** (App Router) + **React 19.2.4**, TypeScript (strict).
- **Tailwind CSS v4** via `@tailwindcss/postcss` (config lives in
  `src/app/globals.css`, not a JS config file).
- **Framer Motion** (`framer-motion`) for 2D animation/parallax.
- **Three.js** via **@react-three/fiber** + **@react-three/drei** for 3D/WebGL.
  These are listed in `transpilePackages` in `next.config.ts`.
- **@google/genai** (Gemini 2.5 Pro) powers the `/talk` telehealth chat.
- **nodemailer** sends CV-request, contact, and consultation-summary emails via
  SMTP.
- **ssh2** / **dotenv** support the custom server and deploy tooling.
- Icons: **lucide-react**. Class merging: **clsx** + **tailwind-merge**.

## Commands

```bash
npm install       # required first — populates node_modules incl. Next.js docs
npm run dev       # Next dev server (next dev)
npm run build     # production build (next build) — run before deploying
npm run start     # next start (standard prod server)
npm run lint      # eslint (flat config in eslint.config.mjs)
node server.js    # custom production runner used on the cPanel host
```

There is currently **no test suite**. Validate changes with `npm run build` and
`npm run lint`.

## Directory layout

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout: metadata/OG, fonts, Navbar/Footer,
│   │                       #   AIAssistant, InteractiveBackground; locked dark mode
│   ├── page.tsx            # Home: hero, filterable timeline, skills, volunteer
│   ├── research/page.tsx   # Publications list
│   ├── blog/page.tsx       # Blog (currently links out to LinkedIn)
│   ├── media/page.tsx      # Image gallery
│   ├── talk/page.tsx       # Telehealth chat UI (Gemini-backed)
│   ├── globals.css         # Tailwind v4 entrypoint + design tokens
│   ├── icon.svg            # Favicon (stethoscope)
│   └── api/                # Route handlers (server-only)
│       ├── chat/route.ts           # Gemini chat as the doctor persona
│       ├── chat/summary/route.ts   # Gemini summary + emails consultation
│       ├── contact/route.ts        # Saves to messages.csv + emails
│       └── request-cv/route.ts     # Emails a CV request via SMTP
├── components/             # React components (client where interactive)
│   └── three/              # All Three.js / R3F scenes and helpers
└── data/
    └── portfolioData.ts    # SINGLE SOURCE OF TRUTH for all site content
```

Root-level `AI-HANDOFF.md` is a running human/AI changelog and deployment
runbook — read it for deployment history and the **cPanel tar.gz deploy
gotchas** (never deploy via zip; rename remote `.next` before extracting).
`PROJECT_README.md` is the stock create-next-app readme.

## Key conventions

### Content lives in `portfolioData.ts`
`src/data/portfolioData.ts` is the centralized, typed data store for the entire
site — personal info, positions (with `category` tags), publications, skills,
references, and volunteer work. It exports typed interfaces (`Position`,
`Publication`, `SkillGroup`, `Reference`, `VolunteerWork`) plus the
`portfolioData` object. **Update content here, not in JSX.** It is also injected
verbatim into the Gemini system prompt in `api/chat/route.ts`, so the chat
persona stays in sync automatically.

### `@/*` path alias
Import from `src` with `@/` (e.g. `@/components/Navbar`,
`@/data/portfolioData`) — configured in `tsconfig.json`.

### Client vs. server
Interactive components and all pages that use hooks/animation start with
`"use client"`. API `route.ts` files are server-only and read `process.env`
directly. Never expose SMTP/Gemini secrets to client components.

### Dark mode is locked on
The site is permanently dark: `<html>` carries a hardcoded `dark` class in
`layout.tsx` and there is no toggle. Tailwind v4's dark variant is wired via
`@custom-variant dark (&:where(.dark, .dark *))` in `globals.css`. Still author
`dark:` classes so the palette stays coherent, but assume dark is always active.

### Styling
Tailwind v4 with a teal/slate design-token palette defined as CSS variables in
`globals.css` (`@theme inline`). Prefer these tokens and existing utility
patterns over ad-hoc colors. Both `layout.tsx` and `body` set
`suppressHydrationWarning` to tolerate browser-extension-injected attributes.

### 3D / WebGL system (`src/components/three/`)
All Three.js work goes through a shared capability + perf policy — do not add
raw `<Canvas>` elements:
- **`useWebGLCapability()`** returns a tier: `"none" | "low" | "high"`. It
  respects `prefers-reduced-motion` (→ `none`) and downshifts on coarse-pointer
  / low-core / low-memory devices. Every 3D feature must gate on this and render
  a non-WebGL fallback (or nothing) when the tier is `none`.
- **`CanvasRoot`** is the only `<Canvas>` wrapper: it applies capped DPR, alpha
  compositing over the existing background, `high-performance` power preference,
  and a `Suspense` boundary. Pass it the `tier` and put scenes inside.
- Heavy scenes are typically loaded via `next/dynamic` with `ssr: false` and
  wrapped so SSR content renders immediately around them.
Follow the pattern in existing scenes (e.g. `HeroVisual`, `TimelineSpine`,
`HelixScene`, `GalleryTileTilt`) when adding new 3D accents.

### Images
Use `next/image` (`<Image>`), not raw `<img>` — the media gallery was
specifically refactored to fix broken loading and asset delivery. Static assets
live in `public/`.

## Environment variables

Set these in `.env.local` (never committed):

| Variable         | Used by                                   |
| ---------------- | ----------------------------------------- |
| `GEMINI_API_KEY` | `api/chat`, `api/chat/summary`            |
| `SMTP_HOST`      | nodemailer transports                     |
| `SMTP_PORT`      | nodemailer (defaults to 465, secure)      |
| `SMTP_USER`      | nodemailer auth / envelope `from`         |
| `SMTP_PASS`      | nodemailer auth                           |

`server.js` loads `.env.local` explicitly via `dotenv` before starting Next, so
the custom runner has access to these at runtime.

## Custom server & deployment

`server.js` wraps Next in a raw Node HTTP server for the cPanel/Passenger host.
Its one piece of app logic: requests to `talk.rahulparajuli.com.np` are
301-redirected to `/talk` (subdomain → route bridging). Production deploys go to
cPanel over SSH — **see `AI-HANDOFF.md` for the mandatory tar.gz procedure and
the `.next` file-lock workaround.** Do not deploy via zip/PHP extraction.

## When you finish a task

- Run `npm run lint` and `npm run build` to confirm the app compiles under
  React 19 / Next 16.
- If the user says "**REMEMBER**", append the new context/updates to
  `AI-HANDOFF.md` (per its own standing instruction).
- Commit to the designated feature branch with clear messages; do not open a PR
  unless explicitly asked.
