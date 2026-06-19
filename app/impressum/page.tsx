export default function Impressum() {
  return (
    <>
      <style>{CSS}</style>
      <div className="legal-root">
        <div className="legal-inner">
          <a href="/" className="legal-back">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M9 2L4 7l5 5" /></svg>
            Zurück
          </a>
          <h1 className="legal-h1">Impressum</h1>

          <div className="legal-section">
            <h2>Angaben gemäß § 5 DDG</h2>
            <p>Vinyos AI UG (haftungsbeschränkt)<br />Am Schlangensee 137<br />64807 Dieburg</p>
          </div>

          <div className="legal-section">
            <h2>Vertreten durch</h2>
            <p>Geschäftsführer: Toni Vogt, Jan Philip Walter, Henri Vogt</p>
          </div>

          <div className="legal-section">
            <h2>Kontakt</h2>
            <p>Telefon: +49 1515 39111466<br />E-Mail: <a href="mailto:kontakt@vinyos.de">kontakt@vinyos.de</a></p>
          </div>

          <div className="legal-section">
            <h2>Registereintrag</h2>
            <p>Eingetragen im Handelsregister.<br />Registergericht: Amtsgericht Darmstadt<br />Registernummer: HRB 108318</p>
          </div>

          <div className="legal-section">
            <h2>Umsatzsteuer-ID</h2>
            <p>Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG:<br />DE458264288</p>
          </div>

          <div className="legal-section">
            <h2>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
            <p>Jan Philip Walter<br />Anschrift wie oben</p>
          </div>

          <div className="legal-section">
            <h2>Verbraucherstreitbeilegung / Universalschlichtungsstelle</h2>
            <p>Vinyos AI UG (haftungsbeschränkt) richtet sich ausschließlich an Unternehmer (B2B) und ist nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>
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
  .legal-h1 { font: 700 32px/1.2 'Poppins',system-ui,sans-serif; color: var(--color-text); margin: 0 0 48px; letter-spacing: -0.02em; }
  .legal-section { margin-bottom: 40px; }
  .legal-section h2 { font: 600 15px/1.3 'Poppins',system-ui,sans-serif; color: var(--color-accent-text); text-transform: uppercase; letter-spacing: 0.06em; margin: 0 0 12px; }
  .legal-section p { font: 400 15px/1.7 'Lora',Georgia,serif; color: var(--color-text-secondary); margin: 0; }
  .legal-section a { color: var(--color-accent-text); text-decoration: none; }
  .legal-section a:hover { color: var(--color-accent-hover); text-decoration: underline; }
`;
