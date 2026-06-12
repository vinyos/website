import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { CONTACT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Impressum",
  robots: { index: false },
};

export default function Impressum() {
  return (
    <LegalPage title="Impressum">
      <h2>Angaben gemäß § 5 DDG</h2>
      <span className="placeholder">
        [PLATZHALTER: Firmenname und Rechtsform, Straße und Hausnummer, PLZ und
        Ort — bitte vor Veröffentlichung eintragen]
      </span>

      <h2>Vertreten durch</h2>
      <span className="placeholder">
        [PLATZHALTER: Name der vertretungsberechtigten Person(en) /
        Geschäftsführung]
      </span>

      <h2>Kontakt</h2>
      <p>E-Mail: {CONTACT_EMAIL}</p>
      <span className="placeholder">
        [PLATZHALTER: Telefonnummer prüfen/ergänzen — die E-Mail-Adresse oben ist
        ebenfalls ein Platzhalter]
      </span>

      <h2>Umsatzsteuer-ID</h2>
      <span className="placeholder">
        [PLATZHALTER: USt-IdNr. gemäß § 27a UStG, sofern vorhanden — sonst
        Abschnitt entfernen]
      </span>

      <h2>Registereintrag</h2>
      <span className="placeholder">
        [PLATZHALTER: Registergericht und Handelsregisternummer, sofern
        eingetragen — sonst Abschnitt entfernen]
      </span>

      <h2>Verantwortlich für den Inhalt</h2>
      <span className="placeholder">
        [PLATZHALTER: Name und Anschrift der inhaltlich verantwortlichen Person]
      </span>
    </LegalPage>
  );
}
