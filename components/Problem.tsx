const CSS = `
.problem { padding: 96px 0; border-bottom: 1px solid var(--border); }
.problem-grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 44px;
}
.problem-card {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: var(--radius-lg); padding: 26px 24px;
}
.problem-card .num {
  font-family: var(--f-mono); font-size: 12px; color: var(--copper);
  letter-spacing: 0.1em;
}
.problem-card h3 { font-size: 18px; font-weight: 600; color: var(--tx); margin-top: 10px; }
.problem-card p { font-size: 14.5px; color: var(--t2); margin-top: 8px; line-height: 1.6; }
.problem-result {
  margin-top: 28px; padding: 18px 22px;
  border-left: 2px solid var(--copper);
  background: rgba(201,123,61,0.07);
  border-radius: 0 var(--radius-md) var(--radius-md) 0;
  color: var(--t1); font-size: 15.5px; max-width: 760px;
}
@media (max-width: 880px) { .problem-grid { grid-template-columns: 1fr; } }
`;

const ITEMS = [
  {
    num: "I",
    title: "Stunden pro Position",
    text: "Zeichnung lesen, Rohteil bestimmen, Zeiten schätzen, Materialpreise nachschlagen — bei jeder Anfrage von vorn. Kalkulationszeit ist unbezahlte Zeit.",
  },
  {
    num: "II",
    title: "Jeder rechnet anders",
    text: "Zwei Kalkulatoren, zwei Preise. Zuschläge und Erfahrungswerte sind nicht standardisiert — Margen werden zur Glückssache.",
  },
  {
    num: "III",
    title: "Wissen hängt an Personen",
    text: "Die Kalkulationslogik steckt in Köpfen und gewachsenen Excel-Tabellen. Fällt der Kalkulator aus, steht die Angebotserstellung.",
  },
];

export default function Problem() {
  return (
    <section className="problem">
      <style>{CSS}</style>
      <div className="container">
        <p className="eyebrow">Status quo</p>
        <h2 className="h2">Die Kalkulation ist der Engpass im Angebotsprozess</h2>
        <p className="lead">
          Wer Drehteile fertigt, kennt es: Die Maschinen sind schnell — das Angebot ist es nicht.
        </p>
        <div className="problem-grid">
          {ITEMS.map((it) => (
            <article className="problem-card" key={it.num}>
              <span className="num">{it.num}</span>
              <h3>{it.title}</h3>
              <p>{it.text}</p>
            </article>
          ))}
        </div>
        <p className="problem-result">
          Die Folge: Anfragen bleiben liegen, Angebote gehen zu spät raus — und der
          Auftrag geht an den, der schneller geantwortet hat.
        </p>
      </div>
    </section>
  );
}
