export default function Datenschutz() {
  return (
    <>
      <style>{CSS}</style>
      <div className="legal-root">
        <div className="legal-inner">
          <a href="/" className="legal-back">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M9 2L4 7l5 5" /></svg>
            Zurück
          </a>
          <h1 className="legal-h1">Datenschutzerklärung</h1>
          <p className="legal-meta">Stand: Juni 2026</p>

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
            <h2>5. Künstliche Intelligenz & kein Training</h2>
            <p>Die Analyse erfolgt KI-gestützt (Claude via AWS Bedrock, EU). Ergebnisse sind unverbindliche Vorschläge. <strong>Ihre Daten werden nicht zum Training von KI-Modellen verwendet</strong> und nicht zu diesem Zweck weitergegeben. Ein Transparenzhinweis gemäß Art. 50 KI-VO erfolgt im Produkt.</p>
          </div>

          <div className="legal-section">
            <h2>6. Speicherdauer & Löschung</h2>
            <p>Daten werden bis zur Kontolöschung verarbeitet. Datenexport (Art. 15/20 DSGVO) und Kontolöschung (Art. 17 DSGVO) sind als Self-Service in den Einstellungen verfügbar. Steuerrelevante Angebotsdaten werden gemäß § 147 AO 10 Jahre aufbewahrt (Anonymisierung statt Löschung).</p>
          </div>

          <div className="legal-section">
            <h2>7. Ihre Rechte</h2>
            <p>Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch (Art. 15–21 DSGVO). Kontakt: <a href="mailto:datenschutz@vinyos.de">datenschutz@vinyos.de</a>.</p>
            <p style={{marginTop: "8px"}}>Beschwerderecht bei der zuständigen Aufsichtsbehörde: <strong>Der Hessische Beauftragte für Datenschutz und Informationsfreiheit (HBDI)</strong>, Postfach 3163, 65021 Wiesbaden, <a href="mailto:poststelle@datenschutz.hessen.de">poststelle@datenschutz.hessen.de</a>.</p>
          </div>

          <div className="legal-section">
            <h2>8. Cookies & Tracking</h2>
            <p>Marketing-Website: keine Tracking- oder Marketing-Cookies. Anwendung: ausschließlich technisch notwendige Session- und Auth-Cookies für den Login.</p>
          </div>

          <div className="legal-section">
            <h2>9. Verschlüsselung</h2>
            <p>Datenübertragung erfolgt über TLS 1.3. Datenspeicherung erfolgt AES-256-verschlüsselt.</p>
          </div>
        </div>
      </div>
    </>
  );
}

const CSS = `
  html, body { background: var(--color-base); }
  .legal-root { min-height: 100vh; background: var(--color-base); font-family: 'Lora', Georgia, serif; color: var(--color-text); -webkit-font-smoothing: antialiased; }
  .legal-inner { max-width: 720px; margin: 0 auto; padding: 64px 32px 96px; }
  .legal-back { display: inline-flex; align-items: center; gap: 6px; font-family: 'Poppins',system-ui,sans-serif; font-size: 13px; color: var(--color-text-muted); text-decoration: none; margin-bottom: 40px; transition: color 120ms; }
  .legal-back:hover { color: var(--color-accent-text); }
  .legal-h1 { font: 700 32px/1.2 'Poppins',system-ui,sans-serif; color: var(--color-text); margin: 0 0 12px; letter-spacing: -0.02em; }
  .legal-meta { font: 400 13px/1.5 'Poppins',system-ui,sans-serif; color: var(--color-text-muted); margin: 0 0 48px; }
  .legal-section { margin-bottom: 36px; }
  .legal-section h2 { font: 600 15px/1.3 'Poppins',system-ui,sans-serif; color: var(--color-accent-text); text-transform: uppercase; letter-spacing: 0.06em; margin: 0 0 12px; }
  .legal-section p { font: 400 15px/1.7 'Lora',Georgia,serif; color: var(--color-text-secondary); margin: 0; }
  .legal-section strong { color: var(--color-text); font-weight: 600; }
  .legal-section a { color: var(--color-accent-text); text-decoration: none; }
  .legal-section a:hover { color: var(--color-accent-hover); text-decoration: underline; }
  .legal-table { width: 100%; border-collapse: collapse; margin: 0; font: 400 14px/1.5 'Lora',Georgia,serif; }
  .legal-table th { text-align: left; padding: 8px 12px; font-size: 12px; font-weight: 600; color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid var(--color-border); }
  .legal-table td { padding: 10px 12px; color: var(--color-text-secondary); border-bottom: 1px solid var(--color-border); }
  .legal-table tr:last-child td { border-bottom: none; }
`;
