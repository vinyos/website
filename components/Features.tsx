const CSS = `
.features { padding: 96px 0; border-bottom: 1px solid var(--border); }
.features-grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 44px;
}
.feature {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: var(--radius-lg); padding: 24px;
  transition: border-color 0.15s ease;
}
.feature:hover { border-color: var(--border-s); }
.feature .f-icon {
  width: 40px; height: 40px; border-radius: var(--radius-md);
  background: var(--elevated); border: 1px solid var(--border);
  display: flex; align-items: center; justify-content: center; color: var(--blue-s);
}
.feature h3 { font-size: 16.5px; font-weight: 600; color: var(--tx); margin-top: 14px; }
.feature p { font-size: 14px; color: var(--t2); margin-top: 7px; line-height: 1.6; }
@media (max-width: 960px) { .features-grid { grid-template-columns: 1fr 1fr; } }
@media (max-width: 600px) { .features-grid { grid-template-columns: 1fr; } }
`;

const I = {
  tol: (
    <svg width="19" height="19" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <circle cx="10" cy="10" r="6.5" />
      <path d="M10 1.5v3M10 15.5v3M1.5 10h3M15.5 10h3" />
      <circle cx="10" cy="10" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  ),
  mat: (
    <svg width="19" height="19" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <ellipse cx="10" cy="5" rx="6.5" ry="2.5" />
      <path d="M3.5 5v10c0 1.4 2.9 2.5 6.5 2.5s6.5-1.1 6.5-2.5V5" />
      <path d="M3.5 10c0 1.4 2.9 2.5 6.5 2.5s6.5-1.1 6.5-2.5" />
    </svg>
  ),
  machine: (
    <svg width="19" height="19" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <circle cx="10" cy="10" r="2.4" />
      <path d="M10 3.2v2M10 14.8v2M3.2 10h2M14.8 10h2M5.2 5.2l1.4 1.4M13.4 13.4l1.4 1.4M14.8 5.2l-1.4 1.4M6.6 13.4l-1.4 1.4" />
    </svg>
  ),
  norm: (
    <svg width="19" height="19" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M4 2.5h12v15H4z" />
      <path d="M7 6h6M7 9h6M7 12h3.5" />
      <path d="M12 14.5l1.5 1.5 2.5-3" stroke="var(--moss)" />
    </svg>
  ),
  pdf: (
    <svg width="19" height="19" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M5 2.5h7L16 6.5V17.5H5v-15Z" />
      <path d="M12 2.5V7h4" />
      <path d="M7.5 11h5M7.5 14h3" />
    </svg>
  ),
  team: (
    <svg width="19" height="19" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <circle cx="7" cy="7" r="2.6" />
      <path d="M2.5 16.5c0-2.6 2-4.2 4.5-4.2s4.5 1.6 4.5 4.2" />
      <circle cx="14" cy="8" r="2" />
      <path d="M13 12.4c2.4 0 4.3 1.5 4.3 3.8" />
    </svg>
  ),
};

const FEATURES = [
  {
    icon: I.tol,
    title: "Toleranz- & GD&T-Erkennung",
    text: "Allgemeintoleranzen, Passungen, Form- und Lagetoleranzen werden erkannt und fließen als Qualitätszuschläge in den Preis ein.",
  },
  {
    icon: I.mat,
    title: "Werkstoff- & Rohteilkatalog",
    text: "Über 80 Werkstoffe mit Dichte, Preis und Schnittdaten, dazu Norm-Halbzeuge für die Rohteilermittlung. Eigene Einkaufspreise hinterlegbar.",
  },
  {
    icon: I.machine,
    title: "Maschinen & Stundensätze",
    text: "Ihr Maschinenpark mit Stundensätzen und Rüstzeiten. Die Kalkulation rechnet mit Ihren Zahlen — nicht mit Branchenpauschalen.",
  },
  {
    icon: I.norm,
    title: "Kundennormen",
    text: "Werksnormen je Kunde hinterlegen — Toleranz-, Oberflächen- und Prüfvorgaben werden bei der Kalkulation automatisch berücksichtigt.",
  },
  {
    icon: I.pdf,
    title: "Sammelangebote als PDF",
    text: "Mehrere Positionen, Staffelpreise, Gültigkeit und Angebotsnummer — als sauber formatiertes PDF, bereit zum Versand.",
  },
  {
    icon: I.team,
    title: "Team & Organisationen",
    text: "Mandantenfähig mit Rollen (Owner, Admin, Member). Anfragen, Kunden und Einstellungen werden im Team geteilt.",
  },
];

export default function Features() {
  return (
    <section className="features" id="leistungen">
      <style>{CSS}</style>
      <div className="container">
        <p className="eyebrow">Leistungen</p>
        <h2 className="h2">Gebaut für die Praxis der Lohnfertigung</h2>
        <p className="lead">
          Kein generisches Kalkulationstool: Vinyos Quote bildet die Abläufe einer
          CNC-Dreherei ab — vom Schriftfeld bis zur Staffelpreisliste.
        </p>
        <div className="features-grid">
          {FEATURES.map((f) => (
            <article className="feature" key={f.title}>
              <div className="f-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
