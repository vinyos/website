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

      <h2>Verantwortlicher</h2>
      <p>
        Vinyos AI UG (haftungsbeschränkt)
        <br />
        Am Schlangensee 137
        <br />
        64807 Dieburg
        <br />
        Vertreten durch die Geschäftsführer: Toni Vogt, Jan Philip Walter, Henri
        Vogt
        <br />
        Datenschutz-Kontakt: datenschutz@vinyos.de
      </p>

      <h2>Verarbeitete Daten beim Besuch dieser Website</h2>
      <p>
        Beim Aufruf dieser Website werden technisch notwendige Daten verarbeitet
        (z.&nbsp;B. IP-Adresse, Zeitpunkt des Abrufs, aufgerufene Seite), um die
        Seite auszuliefern und die Sicherheit des Betriebs zu gewährleisten.
      </p>
      <p>
        Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse am
        sicheren Betrieb). Das Hosting erfolgt durch die Vercel Inc. als
        Auftragsverarbeiter (DPA/SCCs) in der Funktionsregion fra1 (EU).
      </p>

      <h2>Verarbeitung in der Anwendung (Vinyos Quote)</h2>
      <p>
        Bei Nutzung der Anwendung werden Konto- und Organisationsdaten, Team- und
        Rollendaten, hochgeladene Dateien (Zeichnungen, 3D-Modelle), Kalkulations-
        und Angebotsdaten sowie Kundenstammdaten verarbeitet. Zweck ist die
        Bereitstellung der KI-gestützten Angebotskalkulation. Rechtsgrundlage ist
        Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung); bei Auftragsverarbeitung
        für Kunden gilt zusätzlich der Auftragsverarbeitungsvertrag (Art. 28
        DSGVO).
      </p>
      <p>
        Speicherung und KI-Verarbeitung erfolgen in eu-central-1 (Frankfurt am
        Main) mit Mandantentrennung pro Organisation.
      </p>

      <h2>Auftragsverarbeiter (Empfänger)</h2>
      <p>
        Wir setzen folgende Auftragsverarbeiter ein:
      </p>
      <ul>
        <li>
          Supabase — Datenbank, Auth, Datei-Storage; Region eu-central-1;
          Garantie: DPA/SCCs.
        </li>
        <li>
          AWS (Bedrock + Lambda) — KI-Analyse, Kalkulation; Region eu-central-1;
          Garantie: DPA/SCCs.
        </li>
        <li>
          Vercel — Hosting/App-Compute; Region EU (fra1); Garantie: DPA/SCCs.
        </li>
        <li>
          Resend — ausgehende System-E-Mails; Region USA; Garantie: DPA + SCCs.
        </li>
        <li>
          Microsoft 365 — Geschäfts-Postfächer (Kontakt); EU Data Boundary;
          Garantie: DPA + SCCs.
        </li>
      </ul>
      <p>
        Die KI-Analyse läuft über AWS Bedrock; Anthropic als Modellanbieter
        erhält keinen Zugriff auf die Daten.
      </p>

      <h2>Künstliche Intelligenz &amp; kein Training</h2>
      <p>
        Die Analyse erfolgt KI-gestützt (Claude via AWS Bedrock, EU). Ergebnisse
        sind Vorschläge (siehe AGB §6). Ihre Daten werden nicht zum Training von
        KI-Modellen verwendet und nicht zu diesem Zweck weitergegeben. Der
        Transparenzhinweis gemäß Art. 50 KI-VO erfolgt im Produkt.
      </p>

      <h2>Speicherdauer &amp; Löschung</h2>
      <p>
        Die Verarbeitung erfolgt bis zur Kontolöschung. Export (Art. 15/20 DSGVO)
        und Löschung (Art. 17 DSGVO) stehen als Self-Service in den Einstellungen
        zur Verfügung. Für gesetzliche Aufbewahrungspflichten gilt: steuerrelevante
        Angebote werden 10 Jahre aufbewahrt (§ 147 AO); statt einer Löschung
        erfolgt insoweit eine Anonymisierung.
      </p>

      <h2>Ihre Rechte</h2>
      <p>
        Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung
        der Verarbeitung, Datenübertragbarkeit und Widerspruch (Art. 15–21 DSGVO).
        In der Anwendung stehen Datenexport und Konto-Löschung direkt in den
        Einstellungen zur Verfügung. Kontakt: datenschutz@vinyos.de.
      </p>
      <p>
        Ihnen steht ein Beschwerderecht bei einer Aufsichtsbehörde zu,
        insbesondere bei der für unseren Sitz zuständigen Behörde: Der Hessische
        Beauftragte für Datenschutz und Informationsfreiheit (HBDI), Postfach
        3163, 65021 Wiesbaden, poststelle@datenschutz.hessen.de.
      </p>

      <h2>Cookies &amp; Tracking</h2>
      <p>
        Diese Marketing-Seite setzt keine Tracking- oder Marketing-Cookies ein.
        In der Anwendung werden ausschließlich technisch notwendige Session- und
        Auth-Cookies (Login) verwendet.
      </p>

      <h2>Verschlüsselung</h2>
      <p>
        Die Übertragung erfolgt per TLS 1.3, die Speicherung mit AES-256.
      </p>
    </LegalPage>
  );
}
