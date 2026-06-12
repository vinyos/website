import { APP_URL } from "@/lib/site";

const CSS = `
.final { padding: 110px 0; position: relative; overflow: hidden; }
.final-grid-bg {
  position: absolute; inset: 0; pointer-events: none;
  background-image:
    linear-gradient(to right, rgba(107,143,190,0.05) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(107,143,190,0.05) 1px, transparent 1px);
  background-size: 48px 48px;
  mask-image: radial-gradient(ellipse 70% 90% at 50% 100%, black 25%, transparent 75%);
  -webkit-mask-image: radial-gradient(ellipse 70% 90% at 50% 100%, black 25%, transparent 75%);
}
.final-inner { position: relative; text-align: center; max-width: 660px; margin: 0 auto; padding: 0 24px; }
.final h2 {
  font-size: clamp(28px, 4.4vw, 40px); font-weight: 600;
  letter-spacing: -0.02em; line-height: 1.15; color: var(--tx);
}
.final p { color: var(--t2); font-size: 16.5px; margin-top: 16px; line-height: 1.65; }
.final-ctas { display: flex; justify-content: center; flex-wrap: wrap; gap: 12px; margin-top: 32px; }
.final-note { font-family: var(--f-mono); font-size: 12.5px; color: var(--t3); margin-top: 18px; }
`;

export default function FinalCta() {
  return (
    <section className="final">
      <style>{CSS}</style>
      <div className="final-grid-bg" aria-hidden="true" />
      <div className="final-inner">
        <h2>Laden Sie Ihre erste Zeichnung hoch.</h2>
        <p>
          Registrieren, Zeichnung und STEP-Modell hochladen, Analyse und
          Kalkulation ansehen — am eigenen Teil zeigt sich der Nutzen am schnellsten.
        </p>
        <div className="final-ctas">
          <a className="btn btn-primary" href={APP_URL}>Kostenlos testen</a>
          <a className="btn btn-ghost" href={APP_URL}>Anmelden</a>
        </div>
        <p className="final-note">Registrierung mit E-Mail und Passwort · Daten in der EU</p>
      </div>
    </section>
  );
}
