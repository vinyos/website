import type { Metadata } from "next";
import HeroMotion from "./entwurf/HeroMotion";
import WebsiteContent from "./entwurf/WebsiteContent";

// Startseite von vinyos.de. Die Bausteine liegen in app/entwurf (Scroll-Story, Inhalte, Kontakt).
export const metadata: Metadata = {
  title: "Dreh- und Frästeile kalkulieren · Vinyos Quote",
  description: "Vom PDF und STEP-Modell zum Angebot: Dreh- und Frästeile mit Ihren Stundensätzen kalkulieren. 7 Tage kostenlos testen.",
};

export default function Home() {
  return <HeroMotion><WebsiteContent /></HeroMotion>;
}
