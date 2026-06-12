const CSS = `
.how { padding: 96px 0; border-bottom: 1px solid var(--border); background: var(--deep); }
.how-grid {
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 0; margin-top: 48px;
  border: 1px solid var(--border); border-radius: var(--radius-lg);
  background: var(--surface); overflow: hidden;
}
.how-step { padding: 28px 24px 30px; border-right: 1px solid var(--border); position: relative; }
.how-step:last-child { border-right: none; }
.how-step .step-no {
  font-family: var(--f-mono); font-size: 12px; color: var(--blue); letter-spacing: 0.12em;
}
.how-step .step-icon {
  margin-top: 16px; width: 44px; height: 44px; border-radius: var(--radius-md);
  background: var(--blue-bg); border: 1px solid rgba(107,143,190,0.3);
  display: flex; align-items: center; justify-content: center; color: var(--blue-s);
}
.how-step h3 { font-size: 17px; font-weight: 600; color: var(--tx); margin-top: 16px; }
.how-step p { font-size: 14px; color: var(--t2); margin-top: 8px; line-height: 1.6; }
.how-step .step-arrow {
  position: absolute; top: 50%; right: -9px; transform: translateY(-50%);
  width: 18px; height: 18px; border-radius: 50%;
  background: var(--elevated); border: 1px solid var(--border-s);
  display: flex; align-items: center; justify-content: center;
  color: var(--t2); z-index: 2;
}
.how-step:last-child .step-arrow { display: none; }
@media (max-width: 960px) {
  .how-grid { grid-template-columns: 1fr 1fr; }
  .how-step:nth-child(2) { border-right: none; }
  .how-step:nth-child(-n+2) { border-bottom: 1px solid var(--border); }
  .how-step:nth-child(2) .step-arrow { display: none; }
}
@media (max-width: 560px) {
  .how-grid { grid-template-columns: 1fr; }
  .how-step { border-right: none !important; border-bottom: 1px solid var(--border); }
  .how-step:last-child { border-bottom: none; }
  .how-step .step-arrow { display: none; }
}
`;

const Arrow = () => (
  <span className="step-arrow" aria-hidden="true">
    <svg width="9" height="9" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M2 5h6M5.5 2.5L8 5 5.5 7.5" />
    </svg>
  </span>
);

const icons = {
  upload: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M10 13V4M6.5 7.5L10 4l3.5 3.5" />
      <path d="M3 13v2.5A1.5 1.5 0 0 0 4.5 17h11a1.5 1.5 0 0 0 1.5-1.5V13" />
    </svg>
  ),
  scan: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M3 6V4.5A1.5 1.5 0 0 1 4.5 3H6M14 3h1.5A1.5 1.5 0 0 1 17 4.5V6M17 14v1.5a1.5 1.5 0 0 1-1.5 1.5H14M6 17H4.5A1.5 1.5 0 0 1 3 15.5V14" />
      <path d="M3 10h14" stroke="var(--copper)" />
      <circle cx="10" cy="10" r="3.2" />
    </svg>
  ),
  calc: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <rect x="3.5" y="2.5" width="13" height="15" rx="1.5" />
      <path d="M6.5 6h7M6.5 10h2M11.5 10h2M6.5 13.5h2M11.5 13.5h2" />
    </svg>
  ),
  doc: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M5 2.5h7L16 6.5v11H5v-15Z" />
      <path d="M12 2.5V7h4M7.5 11h5M7.5 14h5" />
    </svg>
  ),
};

const STEPS = [
  {
    no: "01",
    icon: icons.upload,
    title: "Hochladen",
    text: "Technische Zeichnung als PDF, 3D-Modell als STEP. Mehr braucht es nicht — keine CAD-Installation, alles im Browser.",
  },
  {
    no: "02",
    icon: icons.scan,
    title: "KI-Analyse",
    text: "Das System erkennt Geometrie, Maße, Toleranzen und Schriftfeld-Angaben — und kennzeichnet, was es nicht sicher lesen kann.",
  },
  {
    no: "03",
    icon: icons.calc,
    title: "Kalkulation",
    text: "Material, Rohteil, Bearbeitungszeit, Maschinenstundensatz, Toleranz- und Qualitätszuschläge — transparent aufgeschlüsselt, jede Position anpassbar.",
  },
  {
    no: "04",
    icon: icons.doc,
    title: "Angebot",
    text: "Mehrere Positionen zum Sammelangebot bündeln, Staffelpreise festlegen und als PDF versenden — mit Ihren Stammdaten und Ihrem Logo.",
  },
];

export default function HowItWorks() {
  return (
    <section className="how" id="funktionsweise">
      <style>{CSS}</style>
      <div className="container">
        <p className="eyebrow">Funktionsweise</p>
        <h2 className="h2">In vier Schritten zum Angebot</h2>
        <p className="lead">
          Der gesamte Weg von der Kundenanfrage zum versandfertigen Angebot — in einem Werkzeug.
        </p>
        <div className="how-grid">
          {STEPS.map((s) => (
            <article className="how-step" key={s.no}>
              <span className="step-no">{s.no}</span>
              <div className="step-icon">{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
              <Arrow />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
