# vinyos-website

Öffentliche Marketing-Website für **Vinyos Quote** — KI-gestützte Angebotskalkulation
für die CNC-Lohnfertigung. Eigenständiges Next.js-Projekt; alle CTAs führen in die
bestehende App (Supabase-Login).

## Starten

```bash
npm install   # wichtig: einmal lokal ausführen (plattformspezifische Next.js-Binaries)
npm run dev   # → http://localhost:3000
```

Produktions-Build: `npm run build && npm start`. Alle Routen sind statisch
vorgerendert (gute Core Web Vitals, kein Server-Code nötig).

## Stack & Konventionen

- Next.js 16 (App Router), React 19, Tailwind v4 — gleiche Versionen wie `vinyos-quote`
- Styles als inline `const CSS = \`...\``-String pro Komponente (Konvention des App-Repos)
- IBM Plex Sans / IBM Plex Mono, Dark-Industrial-Token (identisch zur App, s. `app/globals.css`)

## Konfiguration (`lib/site.ts` bzw. Env)

| Variable | Zweck | Default |
|---|---|---|
| `NEXT_PUBLIC_APP_URL` | Ziel der CTAs (App/Login) | `https://vinyos-quote.vercel.app` |
| `NEXT_PUBLIC_SITE_URL` | Finale Domain für SEO/OG/Sitemap | Platzhalter: App-URL |

## Struktur

```
app/
├── page.tsx            ← Landingpage (Hero → Problem → Funktionsweise → Features
│                          → Vertrauen → Preise → FAQ → CTA → Footer)
├── impressum/          ← Gerüst mit markierten Platzhaltern
├── datenschutz/        ← Gerüst mit markierten Platzhaltern
├── opengraph-image.tsx ← OG-Bild (zur Build-Zeit generiert)
├── robots.ts · sitemap.ts
components/             ← Eine Datei pro Sektion
lib/site.ts             ← Zentrale Konstanten (URLs, Meta, Kontakt)
```

## Vor dem Launch zu ersetzende Platzhalter

1. **`lib/site.ts`** — `SITE_URL` (finale Domain) und `CONTACT_EMAIL` (derzeit `kontakt@vinyos.de`, unverifiziert)
2. **`/impressum`** — Firmenname, Anschrift, Vertretung, USt-ID, Registereintrag, Verantwortlicher
3. **`/datenschutz`** — Verantwortlicher, Hosting-Anbieter, Auftragsverarbeiter-Liste, Aufsichtsbehörde; durch geprüfte Fassung ersetzen (keine Rechtsberatung)
4. **Preise** — Pro/Enterprise stehen auf „Auf Anfrage"; Konditionen/Funktionsumfang sind als „werden finalisiert" gekennzeichnet
5. **Hero-Mockup** — nutzt gekennzeichnete Beispielwerte; optional durch echten Produkt-Screenshot ersetzen

Bewusst **nicht** enthalten: erfundene Kundenlogos, Testimonials, Kennzahlen oder Zertifikate.
