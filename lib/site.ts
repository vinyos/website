/** Zentrale Site-Konstanten — eine Quelle für alle CTAs und Meta-Daten. */

/** Bestehende App (Supabase-Login auf der Root). Per Env überschreibbar. */
export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://vinyos-quote.vercel.app";

/** Finale Domain der Marketing-Seite — PLATZHALTER, vor Launch setzen. */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://vinyos-quote.vercel.app";

export const SITE_NAME = "Vinyos Quote";

export const SITE_TITLE =
  "Vinyos Quote — KI-Kalkulation für CNC-Drehteile";

export const SITE_DESCRIPTION =
  "Zeichnung und STEP-Modell hochladen, KI-Analyse erhalten, Angebotspreis kalkulieren — in Minuten statt Stunden. Für Lohnfertiger und CNC-Drehereien. Hosting in der EU.";

/** Kontakt-E-Mail — PLATZHALTER, vor Launch ersetzen. */
export const CONTACT_EMAIL = "kontakt@vinyos.de";
