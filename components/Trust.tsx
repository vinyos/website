const CSS = `
.trust { padding: 96px 0; border-bottom: 1px solid var(--border); background: var(--deep); }
.trust-grid {
  display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-top: 44px;
}
.trust-card {
  display: flex; gap: 18px; align-items: flex-start;
  background: var(--surface); border: 1px solid var(--border);
  border-radius: var(--radius-lg); padding: 24px;
}
.trust-card .t-icon {
  flex-shrink: 0; width: 42px; height: 42px; border-radius: var(--radius-md);
  background: var(--moss-bg); border: 1px solid rgba(122,156,104,0.3);
  display: flex; align-items: center; justify-content: center; color: var(--moss);
}
.trust-card h3 { font-size: 16.5px; font-weight: 600; color: var(--tx); }
.trust-card p { font-size: 14px; color: var(--t2); margin-top: 6px; line-height: 1.6; }
.trust-card .t-tag {
  display: inline-block; margin-top: 10px;
  font-family: var(--f-mono); font-size: 11px; color: var(--t3);
  border: 1px solid var(--border); border-radius: 99px; padding: 2px 10px;
}
@media (max-width: 760px) { .trust-grid { grid-template-columns: 1fr; } }
`;

const I = {
  eu: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <circle cx="10" cy="10" r="7.5" />
      <path d="M2.5 10h15M10 2.5c-2.2 2-3.4 4.6-3.4 7.5s1.2 5.5 3.4 7.5c2.2-2 3.4-4.6 3.4-7.5S12.2 4.5 10 2.5Z" />
    </svg>
  ),
  shield: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M10 2.5l6.5 2.4v4.6c0 4-2.7 6.7-6.5 8-3.8-1.3-6.5-4-6.5-8V4.9L10 2.5Z" />
      <path d="M7 10l2 2 4-4.5" />
    </svg>
  ),
  lock: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <rect x="4" y="9" width="12" height="8.5" rx="1.5" />
      <path d="M6.5 9V6.5a3.5 3.5 0 0 1 7 0V9" />
      <circle cx="10" cy="13.2" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  ),
  glass: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M3 17.5V8M8 17.5V4M13 17.5v-7M18 17.5V6" opacity="0.45" />
      <path d="M2 17.5h16" />
      <path d="M3 8l5-4 5 6 5-4" />
    </svg>
  ),
};

const ITEMS = [
  {
    icon: I.eu,
    title: "Hosting in der EU",
    text: "Ihre Zeichnungen, Modelle und Kalkulationen liegen in Frankfurt am Main. Auch die KI-Analyse läuft in der Region eu-central-1.",
    tag: "AWS · Supabase · eu-central-1",
  },
  {
    icon: I.shield,
    title: "DSGVO-konform",
    text: "Datenexport und Konto-Löschung sind direkt im Produkt eingebaut. Die eingesetzten Auftragsverarbeiter sind transparent dokumentiert.",
    tag: "Export & Löschung integriert",
  },
  {
    icon: I.lock,
    title: "Datenisolation pro Organisation",
    text: "Jede Organisation sieht ausschließlich ihre eigenen Anfragen, Kunden und Preise — durchgesetzt auf Datenbankebene (Row Level Security).",
    tag: "Mandantenfähig per RLS",
  },
  {
    icon: I.glass,
    title: "Nachvollziehbare Kalkulation",
    text: "Kein Black-Box-Preis: Jede Kalkulation ist nach Material, Zeiten und Zuschlägen aufgeschlüsselt und lässt sich manuell übersteuern.",
    tag: "Transparent statt Blackbox",
  },
];

export default function Trust() {
  return (
    <section className="trust" id="vertrauen">
      <style>{CSS}</style>
      <div className="container">
        <p className="eyebrow">Sicherheit & Datenschutz</p>
        <h2 className="h2">Ihre Zeichnungen sind sensibel. Wir behandeln sie so.</h2>
        <p className="lead">
          Technische Zeichnungen sind Betriebsgeheimnisse. Vinyos Quote ist von
          Grund auf für den Betrieb in der EU gebaut.
        </p>
        <div className="trust-grid">
          {ITEMS.map((it) => (
            <article className="trust-card" key={it.title}>
              <div className="t-icon">{it.icon}</div>
              <div>
                <h3>{it.title}</h3>
                <p>{it.text}</p>
                <span className="t-tag mono">{it.tag}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
