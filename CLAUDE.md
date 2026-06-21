# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install        # first-time setup (platform-specific Next.js binaries)
npm run dev        # dev server → http://localhost:3000
npm run build      # production build (Sentry-wrapped; all public routes pre-rendered)
npm start          # serve production build locally
```

No lint or test scripts are configured.

## Stack

Next.js **16.2.6** (App Router) · React **19.2.4** · TypeScript 5 · Tailwind CSS **v4**.
Key deps: `@sentry/nextjs` (error tracking), `@vercel/analytics`, `resend` (contact-form email), `three` (3D/SVG drawing animation in the hero).

## Deployment

Two paths, both pointing at the same Vercel project (`vinyos-website`, `.vercel/project.json` → `prj_JAFEKAWtNVqjXa4jSzXw0fGyzx1N`):

- **Git:** remote `origin` = `github.com/vinyos/website`, branch `main`. If the Vercel project is git-connected, pushing to `main` triggers a production deploy.
- **CLI:** `vercel` (preview) / `vercel --prod` (production).

`vercel.json` pins the region to `fra1` (Frankfurt). Production domain is **https://vinyos.de**. The `/api/contact` route is server-rendered on demand; everything else is statically pre-rendered.

## Architecture

Public marketing website for **Vinyos Quote** (AI-powered quoting for CNC contract manufacturing). Standalone project; all CTAs link out to the separate app at `APP_URL`.

**The entire landing page is one file: `app/page.tsx`.** There is no `components/` directory — all sections and sub-components (`Reveal`, `DrawingScan`, `PartViewer`, `PlanItem`, `ScanTimer`, etc.) are defined inline in that file. Section order: Nav → Hero → Problem → HowItWorks → Features → Trust → Pricing → FAQ → CTA → Contact → Footer.

Other routes:
- `app/agb/`, `app/datenschutz/`, `app/impressum/` — static legal pages
- `app/api/contact/route.ts` — POST handler; sends the contact form via Resend to `kontakt@vinyos.de`
- `app/robots.ts`, `app/sitemap.ts`, `app/opengraph-image.tsx` — generated SEO/meta
- `app/layout.tsx` — root metadata (title, OG, canonical → `https://vinyos.de`) and `<Analytics />`

**URL / env config (no `lib/`):** URLs are inline constants with `NEXT_PUBLIC_*` env fallbacks:
- `SITE_URL` (in `app/robots.ts` + `app/sitemap.ts`) — default `https://vinyos.de`, override `NEXT_PUBLIC_SITE_URL`
- `APP_URL` (in `app/page.tsx`) — default `https://app.vinyos.de`, override `NEXT_PUBLIC_APP_URL`; the `go()` handler navigates to `${APP_URL}/login`

## Styling convention

This codebase does **not** use Tailwind utility classes in markup, even though Tailwind v4 is installed. Two layers:

1. **`app/globals.css`** (~38 lines) — imports Tailwind (`@import "tailwindcss"`) and defines design tokens in a Tailwind v4 `@theme {}` block: `--color-base`, `--color-surface`, `--color-primary`, `--color-accent`, `--font-sans`, `--font-mono`, `--radius-*`, etc. Plus a few base rules (`html`, `body`, `.mono`). Use these token names — **not** the old `--blue` / `--t1` names.
2. **Scoped `lnd-*` classes** — the landing page's styles live in a `const CSS = \`...\`` template literal at the **bottom** of `app/page.tsx` (~line 1332), injected once with `<style>{CSS}</style>`. All `lnd-*` classes are defined there, not in `globals.css`. Add/modify page styles in that block.

## Observability

Sentry is wired through `next.config.ts` (`withSentryConfig`), `instrumentation.ts` / `instrumentation-client.ts`, and `sentry.{edge,server}.config.ts`. Requests are tunneled via `/monitoring` (ad-blocker evasion). Org/project come from `SENTRY_ORG` / `SENTRY_PROJECT` env; source maps upload only with an auth token in CI. Build telemetry and Vercel cron monitors are disabled (datensparsam).

## Pricing

The pricing section in `app/page.tsx` (`id="preise"`) mirrors the single source of truth `business/pricing.md` in the parent Vinyos-Overview workspace (outside this repo). Current model: 3 plans — Starter (189 €/150 Anfragen), Pro (349 €/350), Enterprise (579 €/700) — with 1,00 € overage and a free first month. **When pricing changes, update both `pricing.md` and this section together.**

## Pre-launch status

Most former placeholders are now filled: legal pages (`impressum`/`datenschutz`) contain the real Vinyos AI UG data (Dieburg, HRB 108318, USt DE458264288), the domain is `vinyos.de`, and pricing is live. Before any relaunch, re-verify the legal pages (controller info, processor list, supervisory authority) and the hero example values in `app/page.tsx` against current reality.
