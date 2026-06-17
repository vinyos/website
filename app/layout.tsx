import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vinyos Quote – KI-Kalkulation für CNC-Drehteile | Angebot in 60 Sekunden",
  description: "Vinyos Quote analysiert Ihre Zeichnung (PDF + STEP) automatisch und kalkuliert Drehteile in unter 60 Sekunden — mit Ihren Stundensätzen, 84 Werkstoffen und 14 GD&T-Toleranzen. Kostenlos testen.",
  openGraph: {
    title: "Vinyos Quote – KI-Kalkulation für CNC-Drehteile",
    description: "Zeichnung rein. Präziser Preis raus. In unter 60 Sekunden — deterministisch kalkuliert mit Ihren Stundensätzen. 1. Monat gratis testen.",
    url: "https://vinyos.de",
    siteName: "Vinyos Quote",
    locale: "de_DE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vinyos Quote – KI-Kalkulation für CNC-Drehteile",
    description: "Zeichnung rein. Präziser Preis raus. In unter 60 Sekunden. 1. Monat gratis testen.",
  },
  alternates: {
    canonical: "https://vinyos.de",
  },
  keywords: ["CNC Drehteile kalkulieren", "Angebotskalkulation Lohnfertigung", "Drehteil Kalkulation Software", "CNC Kalkulation Software", "Drehteile Angebot erstellen"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body>
        {children}
        {/* Produkt-Analytics (datensparsam, keine PII / Custom-Events). */}
        <Analytics />
      </body>
    </html>
  );
}
