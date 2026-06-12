import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Datenschutzerklärung",
  robots: { index: false },
};

export default function Datenschutz() {
  return (
    <LegalPage title="Datenschutzerklärung">
      <p>
        Der Schutz Ihrer Daten ist Bestandteil des Produkts: Vinyos Quote wird in
        der EU betrieben (Region eu-central-1, Frankfurt am Main), Daten sind pro
        Organisation isoliert, und Export wie Löschung sind direkt in der
        Anwendung verfügbar.
      </p>
      <span className="placeholder">
        [PLATZHALTER: Diese Seite ist ein Gerüst und ersetzt keine
        Rechtsberatung. Vor Veröffentlichung durch eine vollständige, geprüfte
        Datenschutzerklärung ersetzen.]
      </span>

      <h2>Verantwortlicher</h2>
      <span className="placeholder">
        [PLATZHALTER: Name und Kontaktdaten des Verantwortlichen im Sinne der
        DSGVO]
      </span>

      <h2>Verarbeitete Daten beim Besuch dieser Website</h2>
      <p>
        Beim Aufruf dieser Website werden technisch notwendige Daten verarbeitet
        (z.&nbsp;B. IP-Adresse, Zeitpunkt des Abrufs, aufgerufene Seite), um die
        Seite auszuliefern und die Sicherheit des Betriebs zu gewährleisten.
      </p>
      <span className="placeholder">
        [PLATZHALTER: Hosting-Anbieter der Marketing-Seite benennen (z. B.
        Vercel) inkl. Rechtsgrundlage Art. 6 Abs. 1 lit. f DSGVO und
        Auftragsverarbeitungsvertrag]
      </span>

      <h2>Verarbeitung in der Anwendung</h2>
      <p>
        Bei Nutzung der Anwendung werden Konto- und Organisationsdaten sowie die
        von Ihnen hochgeladenen Dateien (Zeichnungen, 3D-Modelle) verarbeitet.
        Die Verarbeitung erfolgt in der EU (eu-central-1).
      </p>
      <span className="placeholder">
        [PLATZHALTER: Liste der Auftragsverarbeiter (z. B. Supabase, AWS,
        Vercel, Anthropic/AWS Bedrock für die KI-Analyse) mit Zweck, Region und
        Garantien — konsistent zur Auftragsverarbeiter-Übersicht in den
        App-Einstellungen]
      </span>

      <h2>Ihre Rechte</h2>
      <p>
        Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung
        der Verarbeitung, Datenübertragbarkeit und Widerspruch. In der Anwendung
        stehen Datenexport und Konto-Löschung direkt in den Einstellungen zur
        Verfügung.
      </p>
      <span className="placeholder">
        [PLATZHALTER: Kontaktweg für Datenschutzanfragen + zuständige
        Aufsichtsbehörde ergänzen]
      </span>

      <h2>Cookies & Tracking</h2>
      <p>
        Diese Marketing-Seite setzt keine Tracking- oder Marketing-Cookies ein.
      </p>
      <span className="placeholder">
        [PLATZHALTER: Aussage verifizieren, falls später Analytics eingebunden
        wird — dann Einwilligungslösung (Consent) ergänzen]
      </span>
    </LegalPage>
  );
}
