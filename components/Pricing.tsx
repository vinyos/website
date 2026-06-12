import { APP_URL, CONTACT_EMAIL } from "@/lib/site";

const CSS = `
.pricing { padding: 96px 0; border-bottom: 1px solid var(--border); }
.pricing-grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 44px;
}
.plan {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: var(--radius-lg); padding: 28px 26px;
  display: flex; flex-direction: column;
}
.plan.highlight { border-color: var(--blue); position: relative; }
.plan.highlight::before {
  content: "Für den Tagesbetrieb";
  position: absolute; top: -11px; left: 24px;
  font-family: var(--f-mono); font-size: 10.5px; letter-spacing: 0.08em;
  color: var(--blue-s); background: var(--bg);
  border: 1px solid var(--blue); border-radius: 99px; padding: 2px 10px;
}
.plan .p-name { font-family: var(--f-mono); font-size: 13px; color: var(--t2); letter-spacing: 0.1em; text-transform: uppercase; }
.plan .p-price { font-size: 28px; font-weight: 600; color: var(--tx); margin-top: 12px; letter-spacing: -0.01em; }
.plan .p-price small { font-size: 14px; font-weight: 400; color: var(--t2); }
.plan .p-desc { font-size: 14px; color: var(--t2); margin-top: 8px; line-height: 1.6; }
.plan ul { list-style: none; margin: 20px 0 26px; padding: 0; display: flex; flex-direction: column; gap: 10px; }
.plan li { display: flex; gap: 10px; font-size: 14px; color: var(--t1); line-height: 1.5; }
.plan li svg { flex-shrink: 0; margin-top: 4px; color: var(--moss); }
.plan .btn { margin-top: auto; width: 100%; }
.pricing-note {
  margin-top: 24px; font-size: 13px; color: var(--t3); max-width: 720px;
}
@media (max-width: 880px) { .pricing-grid { grid-template-columns: 1fr; } }
`;

const Check = () => (
  <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
    <path d="M2 7.5l3 3 7-8" />
  </svg>
);

const PLANS = [
  {
    name: "Trial",
    price: "Kostenlos",
    priceNote: "",
    desc: "Das Produkt mit eigenen Zeichnungen ausprobieren — ohne Verpflichtung.",
    features: [
      "Upload von Zeichnung (PDF) + Modell (STEP)",
      "KI-Analyse von Geometrie & Toleranzen",
      "Vollständige Kalkulation mit Preisaufschlüsselung",
    ],
    cta: { label: "Kostenlos testen", href: APP_URL, primary: true },
    highlight: false,
  },
  {
    name: "Pro",
    price: "Auf Anfrage",
    priceNote: "",
    desc: "Für Betriebe, die Angebote im Tagesgeschäft erstellen.",
    features: [
      "Alles aus Trial",
      "Sammelangebote als PDF mit Staffelpreisen",
      "Kundennormen & eigene Materialpreise",
      "Maschinenpark & Stundensatz-Konfiguration",
      "Team-Funktionen mit Rollen",
    ],
    cta: { label: "Kontakt aufnehmen", href: `mailto:${CONTACT_EMAIL}`, primary: true },
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Auf Anfrage",
    priceNote: "",
    desc: "Für größere Organisationen mit individuellen Anforderungen.",
    features: [
      "Alles aus Pro",
      "Individuelle Kalkulationskataloge & Normen",
      "Persönliches Onboarding",
      "Priorisierter Support",
    ],
    cta: { label: "Kontakt aufnehmen", href: `mailto:${CONTACT_EMAIL}`, primary: false },
    highlight: false,
  },
];

export default function Pricing() {
  return (
    <section className="pricing" id="preise">
      <style>{CSS}</style>
      <div className="container">
        <p className="eyebrow">Preise</p>
        <h2 className="h2">Erst testen, dann entscheiden</h2>
        <p className="lead">
          Der Einstieg ist kostenlos: Registrieren, eigene Zeichnung hochladen,
          Ergebnis prüfen.
        </p>
        <div className="pricing-grid">
          {PLANS.map((p) => (
            <article className={`plan${p.highlight ? " highlight" : ""}`} key={p.name}>
              <span className="p-name">{p.name}</span>
              <div className="p-price">{p.price} <small>{p.priceNote}</small></div>
              <p className="p-desc">{p.desc}</p>
              <ul>
                {p.features.map((f) => (
                  <li key={f}><Check />{f}</li>
                ))}
              </ul>
              <a className={`btn ${p.cta.primary ? "btn-primary" : "btn-ghost"}`} href={p.cta.href}>
                {p.cta.label}
              </a>
            </article>
          ))}
        </div>
        <p className="pricing-note">
          Konditionen für Pro und Enterprise werden derzeit finalisiert — sprechen
          Sie uns an. Der Funktionsumfang der Pläne kann sich bis zum offiziellen
          Launch noch ändern.
        </p>
      </div>
    </section>
  );
}
