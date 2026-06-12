import { APP_URL, CONTACT_EMAIL } from "@/lib/site";

const CSS = `
.footer { border-top: 1px solid var(--border); background: var(--deep); }
.footer-inner {
  max-width: var(--maxw); margin: 0 auto; padding: 56px 24px 32px;
}
.footer-top { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 32px; }
.footer-brand { display: flex; align-items: center; gap: 10px; color: var(--tx); }
.footer-brand svg { color: var(--blue); }
.footer-brand b { font-size: 15px; font-weight: 600; }
.footer-brand span { font-size: 15px; color: var(--t2); margin-left: -6px; }
.footer-claim { font-size: 13.5px; color: var(--t3); margin-top: 12px; max-width: 280px; line-height: 1.6; }
.footer h4 {
  font-family: var(--f-mono); font-size: 11.5px; font-weight: 500;
  letter-spacing: 0.12em; text-transform: uppercase; color: var(--t3);
}
.footer-col { display: flex; flex-direction: column; gap: 10px; }
.footer-col a { font-size: 14px; color: var(--t2); transition: color 0.15s ease; margin-top: 2px; }
.footer-col a:hover { color: var(--tx); }
.footer-col h4 { margin-bottom: 6px; }
.footer-bottom {
  margin-top: 48px; padding-top: 24px; border-top: 1px solid var(--border);
  display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap;
}
.footer-bottom p { font-size: 13px; color: var(--t3); }
.footer-bottom .eu {
  font-family: var(--f-mono); font-size: 11.5px; color: var(--t3);
  display: flex; align-items: center; gap: 8px;
}
.footer-bottom .eu i { width: 6px; height: 6px; border-radius: 50%; background: var(--moss); display: block; }
@media (max-width: 760px) { .footer-top { grid-template-columns: 1fr 1fr; } }
@media (max-width: 480px) { .footer-top { grid-template-columns: 1fr; } }
`;

const Logomark = () => (
  <svg width="24" height="24" viewBox="0 0 32 32" fill="none" aria-hidden="true">
    <g stroke="currentColor" strokeWidth="2" strokeLinecap="square" fill="none">
      <path d="M5 8 L5 26 L10 26" />
      <path d="M27 8 L27 26 L22 26" />
      <path d="M10 22 L22 22" />
      <path d="M16 22 L16 10" />
    </g>
  </svg>
);

export default function Footer() {
  return (
    <footer className="footer">
      <style>{CSS}</style>
      <div className="footer-inner">
        <div className="footer-top">
          <div>
            <div className="footer-brand">
              <Logomark />
              <b>vinyos</b>
              <span>quote</span>
            </div>
            <p className="footer-claim">
              KI-gestützte Angebotskalkulation für die CNC-Lohnfertigung.
            </p>
          </div>
          <nav className="footer-col" aria-label="Produkt">
            <h4>Produkt</h4>
            <a href="#funktionsweise">Funktionsweise</a>
            <a href="#leistungen">Leistungen</a>
            <a href="#preise">Preise</a>
            <a href="#faq">FAQ</a>
          </nav>
          <nav className="footer-col" aria-label="App">
            <h4>App</h4>
            <a href={APP_URL}>Anmelden</a>
            <a href={APP_URL}>Registrieren</a>
          </nav>
          <nav className="footer-col" aria-label="Rechtliches">
            <h4>Rechtliches</h4>
            <a href="/impressum">Impressum</a>
            <a href="/datenschutz">Datenschutz</a>
            <a href={`mailto:${CONTACT_EMAIL}`}>Kontakt</a>
          </nav>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Vinyos</p>
          <span className="eu"><i />Hosting & KI-Verarbeitung in der EU</span>
        </div>
      </div>
    </footer>
  );
}
