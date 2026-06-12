import { APP_URL } from "@/lib/site";
import HeroMock from "@/components/HeroMock";

const CSS = `
.hero {
  position: relative;
  overflow: hidden;
  border-bottom: 1px solid var(--border);
}
.hero-grid-bg {
  position: absolute; inset: 0; pointer-events: none;
  background-image:
    linear-gradient(to right, rgba(107,143,190,0.05) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(107,143,190,0.05) 1px, transparent 1px);
  background-size: 48px 48px;
  mask-image: radial-gradient(ellipse 90% 80% at 50% 0%, black 30%, transparent 75%);
  -webkit-mask-image: radial-gradient(ellipse 90% 80% at 50% 0%, black 30%, transparent 75%);
}
.hero-inner {
  position: relative;
  max-width: var(--maxw); margin: 0 auto; padding: 84px 24px 96px;
  display: grid; grid-template-columns: minmax(0, 5fr) minmax(0, 6fr);
  gap: 56px; align-items: center;
}
.hero-inner > * { min-width: 0; }
.hero h1 {
  font-size: clamp(32px, 4.6vw, 48px);
  font-weight: 600; letter-spacing: -0.025em; line-height: 1.12;
  color: var(--tx); margin-top: 18px;
}
.hero h1 em { font-style: normal; color: var(--blue-s); }
.hero-lead { color: var(--t2); font-size: 17.5px; line-height: 1.65; margin-top: 20px; max-width: 520px; }
.hero-ctas { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 32px; }
.hero-note {
  margin-top: 18px; font-family: var(--f-mono); font-size: 12.5px; color: var(--t3);
  display: flex; align-items: center; gap: 8px;
}
.hero-note svg { color: var(--moss); flex-shrink: 0; }
@media (max-width: 960px) {
  .hero-inner { grid-template-columns: 1fr; padding: 56px 24px 64px; gap: 44px; }
  .hero-lead { max-width: 640px; }
}
`;

export default function Hero() {
  return (
    <section className="hero" id="top">
      <style>{CSS}</style>
      <div className="hero-grid-bg" aria-hidden="true" />
      <div className="hero-inner">
        <div>
          <p className="eyebrow">Angebotssystem für die CNC-Lohnfertigung</p>
          <h1>
            Vom Zeichnungssatz zum <em>Angebotspreis</em> — in Minuten.
          </h1>
          <p className="hero-lead">
            Vinyos Quote liest technische Zeichnungen und STEP-Modelle automatisch
            per KI: Geometrie, Maße, Toleranzen. Daraus entsteht eine nachvollziehbare
            Kalkulation — auf Basis Ihrer Maschinen, Stundensätze und Werkstoffe.
          </p>
          <div className="hero-ctas">
            <a className="btn btn-primary" href={APP_URL}>Kostenlos testen</a>
            <a className="btn btn-ghost" href="#funktionsweise">So funktioniert es</a>
          </div>
          <p className="hero-note">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M2.5 7.5l3 3 6-7" />
            </svg>
            Kostenloser Testzugang · Daten in der EU
          </p>
        </div>
        <HeroMock />
      </div>
    </section>
  );
}
