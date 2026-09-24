import LegalPage from "../_legal/LegalPage";

export default function Datenschutz() {
  return (
    <LegalPage title="Datenschutzerklärung" meta="Stand: September 2026" current="/datenschutz">

          <div className="legal-section">
            <h2>1. Verantwortlicher</h2>
            <p>
              Vinyos AI UG (haftungsbeschränkt)<br />
              Am Schlangensee 137, 64807 Dieburg<br />
              Vertreten durch: Toni Vogt, Jan Philip Walter, Henri Vogt<br />
              Datenschutz-Kontakt: <a href="mailto:datenschutz@vinyos.de">datenschutz@vinyos.de</a>
            </p>
          </div>

          <div className="legal-section">
            <h2>2. Verarbeitung beim Besuch der Website</h2>
            <p>Beim Besuch der Website werden technisch notwendige Server-Logs (IP-Adresse, Zeitpunkt, aufgerufene Seite) zur Auslieferung und Betriebssicherheit verarbeitet. Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse: sicherer Betrieb). Hosting erfolgt über <strong>Vercel Inc.</strong> als Auftragsverarbeiter (DPA/SCCs); Funktionsregion EU (Frankfurt).</p>
          </div>

          <div className="legal-section">
            <h2>3. Verarbeitung in der Anwendung (Vinyos Quote)</h2>
            <p>In der Anwendung werden Konto- und Organisationsdaten, Team- und Rollendaten, hochgeladene Dateien (Zeichnungen, 3D-Modelle), Kalkulations- und Angebotsdaten sowie Kundenstammdaten verarbeitet. Zweck ist die Bereitstellung der KI-gestützten Angebotskalkulation. Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung). Bei Auftragsverarbeitung für Kunden gilt zusätzlich der AVV (Art. 28 DSGVO). Speicherung und KI-Verarbeitung erfolgen in <strong>eu-central-1 (Frankfurt)</strong> mit Mandantentrennung pro Organisation.</p>
          </div>

          <div className="legal-section">
            <h2>4. Auftragsverarbeiter</h2>
            <table className="legal-table">
              <thead>
                <tr><th>Dienst</th><th>Zweck</th><th>Region</th></tr>
              </thead>
              <tbody>
                <tr><td>Supabase</td><td>Datenbank, Auth, Datei-Storage</td><td>eu-central-1</td></tr>
                <tr><td>AWS (Bedrock + Lambda)</td><td>KI-Analyse, Kalkulation</td><td>eu-central-1</td></tr>
                <tr><td>Vercel</td><td>Hosting / App-Compute</td><td>EU (fra1)</td></tr>
                <tr><td>Resend</td><td>Ausgehende System-E-Mails</td><td>USA (SCCs)</td></tr>
              </tbody>
            </table>
            <p style={{marginTop: "12px"}}>Alle Auftragsverarbeiter sind durch DPA und Standardvertragsklauseln (SCCs) gebunden. Die KI-Analyse läuft über AWS Bedrock; Anthropic als Modellanbieter erhält <strong>keinen Zugriff</strong> auf die Daten.</p>
          </div>

          <div className="legal-section">
            <h2>5. Zahlungsabwicklung (Stripe)</h2>
            <p>Die Bezahlung der regulären Tarife wickeln wir über <strong>Stripe Payments Europe, Ltd.</strong>, 1 Grand Canal Street Lower, Grand Canal Dock, Dublin, Irland, ab. Bei der Buchung eines Tarifs geben Sie Ihre Zahlungsdaten (Kreditkarte oder SEPA-Lastschrift), Ihre Rechnungsanschrift und gegebenenfalls Ihre Umsatzsteuer-Identifikationsnummer direkt bei Stripe ein. Vinyos AI UG speichert davon nur die Stripe-Kundennummer, die Abonnementnummer, den Abonnementstatus und das Ende des Abrechnungszeitraums, keine Karten- oder Kontodaten.</p>
            <p>Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung) sowie Art. 6 Abs. 1 lit. c DSGVO (steuer- und handelsrechtliche Aufbewahrungspflichten). Stripe verarbeitet die Daten zur Zahlungsabwicklung, zur Betrugsprävention und zur Erfüllung gesetzlicher Pflichten in eigener Verantwortung. Dabei können Daten an Stripe, Inc. in den USA übermittelt werden; die Übermittlung ist durch das EU-US Data Privacy Framework und Standardvertragsklauseln abgesichert. Weitere Informationen: <a href="https://stripe.com/de/privacy" target="_blank" rel="noopener noreferrer">stripe.com/de/privacy</a>.</p>
          </div>

          <div className="legal-section">
            <h2>6. Künstliche Intelligenz & kein Training</h2>
            <p>Die Analyse erfolgt KI-gestützt (Claude via AWS Bedrock, EU). Ergebnisse sind unverbindliche Vorschläge. <strong>Ihre Daten werden nicht zum Training von KI-Modellen verwendet</strong> und nicht zu diesem Zweck weitergegeben. Ein Transparenzhinweis gemäß Art. 50 KI-VO erfolgt im Produkt.</p>
          </div>

          <div className="legal-section">
            <h2>7. Speicherdauer & Löschung</h2>
            <p>Daten werden bis zur Kontolöschung verarbeitet. Datenexport (Art. 15/20 DSGVO) und Kontolöschung (Art. 17 DSGVO) sind als Self-Service in den Einstellungen verfügbar. Steuerrelevante Angebotsdaten werden gemäß § 147 AO 10 Jahre aufbewahrt (Anonymisierung statt Löschung).</p>
          </div>

          <div className="legal-section">
            <h2>8. Ihre Rechte</h2>
            <p>Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch (Art. 15–21 DSGVO). Kontakt: <a href="mailto:datenschutz@vinyos.de">datenschutz@vinyos.de</a>.</p>
            <p style={{marginTop: "8px"}}>Beschwerderecht bei der zuständigen Aufsichtsbehörde: <strong>Der Hessische Beauftragte für Datenschutz und Informationsfreiheit (HBDI)</strong>, Postfach 3163, 65021 Wiesbaden, <a href="mailto:poststelle@datenschutz.hessen.de">poststelle@datenschutz.hessen.de</a>.</p>
          </div>

          <div className="legal-section">
            <h2>9. Cookies & Tracking</h2>
            <p>Marketing-Website: keine Tracking- oder Marketing-Cookies. Anwendung: ausschließlich technisch notwendige Session- und Auth-Cookies für den Login.</p>
          </div>

          <div className="legal-section">
            <h2>10. Verschlüsselung</h2>
            <p>Datenübertragung erfolgt über TLS 1.3. Datenspeicherung erfolgt AES-256-verschlüsselt.</p>
          </div>
      </LegalPage>
  );
}

