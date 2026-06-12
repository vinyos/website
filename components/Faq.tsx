const CSS = `
.faq { padding: 96px 0; border-bottom: 1px solid var(--border); background: var(--deep); }
.faq-list { margin-top: 40px; max-width: 800px; display: flex; flex-direction: column; gap: 10px; }
.faq details {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: var(--radius-md); overflow: hidden;
}
.faq details[open] { border-color: var(--border-s); }
.faq summary {
  list-style: none; cursor: pointer;
  display: flex; align-items: center; justify-content: space-between; gap: 16px;
  padding: 16px 20px; font-size: 15.5px; font-weight: 500; color: var(--tx);
}
.faq summary::-webkit-details-marker { display: none; }
.faq summary svg { flex-shrink: 0; color: var(--t3); transition: transform 0.18s ease; }
.faq details[open] summary svg { transform: rotate(45deg); color: var(--blue); }
.faq .faq-a { padding: 0 20px 18px; font-size: 14.5px; color: var(--t2); line-height: 1.65; max-width: 680px; }
`;

const Plus = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" stroke="currentColor" strokeWidth="1.6" fill="none" aria-hidden="true">
    <path d="M7 1.5v11M1.5 7h11" />
  </svg>
);

const ITEMS: { q: string; a: string }[] = [
  {
    q: "Welche Dateiformate werden unterstützt?",
    a: "Die technische Zeichnung als PDF und das 3D-Modell als STEP. Die Kombination aus beidem liefert die besten Ergebnisse: Die Zeichnung enthält Toleranzen und Schriftfeld, das Modell die exakte Geometrie.",
  },
  {
    q: "Wie genau ist die KI-Analyse?",
    a: "Die Analyse ist ein Vorschlag, kein Blindflug: Jede erkannte Angabe — Werkstoff, Maße, Toleranzen — ist im Arbeitsbereich sichtbar und korrigierbar. Was das System nicht sicher lesen kann, wird ausdrücklich gekennzeichnet. Ein Angebot verlässt das Haus erst nach Ihrer Prüfung.",
  },
  {
    q: "Wo liegen meine Daten?",
    a: "In der EU: Datenbank und Dateiablage laufen in Frankfurt am Main (eu-central-1), ebenso die KI-Analyse. Daten sind pro Organisation isoliert; Export und Löschung sind jederzeit über die Einstellungen möglich.",
  },
  {
    q: "Kann ich die Kalkulation an meinen Betrieb anpassen?",
    a: "Ja — das ist der Kern des Systems. Maschinen mit Stundensätzen und Rüstzeiten, Gemeinkosten, Marge, eigene Materialeinkaufspreise und Kundennormen werden in den Einstellungen gepflegt und fließen in jede Kalkulation ein.",
  },
  {
    q: "Was kostet Vinyos Quote?",
    a: "Der Testzugang ist kostenlos. Die Konditionen für Pro und Enterprise werden derzeit finalisiert — nehmen Sie für ein Angebot einfach Kontakt auf.",
  },
  {
    q: "Brauche ich eine CAD-Installation?",
    a: "Nein. Vinyos Quote läuft vollständig im Browser — inklusive 3D-Ansicht des STEP-Modells und PDF-Ansicht der Zeichnung.",
  },
];

export default function Faq() {
  return (
    <section className="faq" id="faq">
      <style>{CSS}</style>
      <div className="container">
        <p className="eyebrow">FAQ</p>
        <h2 className="h2">Häufige Fragen</h2>
        <div className="faq-list">
          {ITEMS.map((it) => (
            <details key={it.q}>
              <summary>
                {it.q}
                <Plus />
              </summary>
              <p className="faq-a">{it.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
