# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install        # first-time setup (platform-specific Next.js binaries)
npm run dev        # dev server → http://localhost:3000
npm run build      # production build (all routes are statically pre-rendered)
npm start          # serve production build locally
```

No lint or test scripts are configured.

### Deployment

The project is linked to Vercel (`vinyos-projects-da5aec3f/vinyos-website`, see `.vercel/project.json`). Live at **https://vinyos-website.vercel.app**.

```bash
vercel          # preview deploy (unique URL)
vercel --prod   # production deploy
```

All routes are statically pre-rendered, so deploys are pure static output (no server functions).

## Architecture

Public marketing website for **Vinyos Quote** (AI-powered quoting for CNC contract manufacturing). It is a standalone Next.js 16 App Router project; all CTAs link out to the separate app at `APP_URL`.

**Single source of truth for URLs and meta:** `lib/site.ts` — every CTA, OG tag, sitemap entry, and robots file reads from here. `APP_URL` and `SITE_URL` are overridable via `NEXT_PUBLIC_APP_URL` / `NEXT_PUBLIC_SITE_URL`.

**Landing page structure** (`app/page.tsx`): Nav → Hero → Problem → HowItWorks → Features → Trust → Pricing → FAQ → FinalCta → Footer. Each section is a single component file in `components/`.

## Styling convention

Styles live as a `const CSS = \`...\`` template literal at the top of each component, injected with `<style>{CSS}</style>`. Do not use Tailwind utility classes inside components — this codebase uses scoped inline `<style>` blocks exclusively, mirroring the convention of the `vinyos-quote` app.

Global design tokens (colors, typography, spacing, shared classes like `.btn`, `.eyebrow`, `.h2`, `.container`) are defined as CSS custom properties in `app/globals.css`. Always use these tokens (`var(--blue)`, `var(--t1)`, etc.) rather than raw values.

## Pre-launch placeholders

Before going live, replace:
- `lib/site.ts` — `SITE_URL` (final domain) and `CONTACT_EMAIL`
- `app/impressum/page.tsx` — company name, address, legal rep, VAT ID, register entry
- `app/datenschutz/page.tsx` — controller info, hosting provider, processor list, supervisory authority
- `components/Pricing.tsx` — Pro/Enterprise pricing (currently "Auf Anfrage")
- `components/HeroMock.tsx` — example values (optionally replace with real screenshot)
