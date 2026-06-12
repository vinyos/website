"use client";
import { useCallback, useRef, useState } from "react";

/**
 * Animiertes Produkt-Mockup: Die Zeichnung baut sich auf, eine Scanlinie
 * liest sie, die erkannten Daten erscheinen, der Preis zählt hoch.
 * Bei prefers-reduced-motion wird sofort der Endzustand gezeigt.
 */

const FINAL_PRICE = 23.84;

const CSS = `
.mock { position: relative; }
.mock-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: 0 24px 60px -20px rgba(0,0,0,0.55);
  overflow: hidden;
}
.mock-head {
  display: flex; flex-wrap: wrap; align-items: center; gap: 8px 10px;
  padding: 12px 16px; border-bottom: 1px solid var(--border);
  background: var(--deep);
}
.mock-file {
  font-family: var(--f-mono); font-size: 11.5px; color: var(--t2);
  background: var(--elevated); border: 1px solid var(--border);
  border-radius: var(--radius); padding: 4px 10px;
  max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.mock-status { margin-left: auto; display: grid; }
.mock-badge {
  grid-area: 1 / 1; justify-self: end;
  display: flex; align-items: center; gap: 6px;
  font-family: var(--f-mono); font-size: 11px;
  border-radius: 99px; padding: 3px 10px; white-space: nowrap;
}
.mock-badge i { width: 6px; height: 6px; border-radius: 50%; display: block; }
.badge-run {
  color: var(--copper-s); background: rgba(201,123,61,0.10);
  border: 1px solid rgba(201,123,61,0.35);
  opacity: 0; visibility: hidden;
}
.badge-run i { background: var(--copper); }
.badge-done {
  color: var(--moss); background: var(--moss-bg);
  border: 1px solid rgba(122,156,104,0.3);
}
.badge-done i { background: var(--moss); }

.mock-body { display: grid; grid-template-columns: 1.2fr 1fr; }
.mock-draw {
  position: relative; overflow: hidden;
  padding: 18px 8px 18px 16px; border-right: 1px solid var(--border);
}
.mock-draw svg { width: 100%; height: auto; display: block; }
.mock-scan {
  position: absolute; left: 10px; right: 10px; top: -4%;
  height: 2px; border-radius: 2px; opacity: 0; pointer-events: none;
  background: linear-gradient(90deg, transparent, var(--blue) 18%, var(--copper-s) 50%, var(--blue) 82%, transparent);
  box-shadow: 0 0 16px rgba(107,143,190,0.5), 0 0 4px rgba(214,151,91,0.6);
}
.mock-data { padding: 16px 18px; display: flex; flex-direction: column; }
.mock-row {
  display: flex; justify-content: space-between; align-items: baseline; gap: 12px;
  padding: 7px 0; border-bottom: 1px solid var(--border);
}
.mock-row:last-of-type { border-bottom: none; }
.mock-row .k { font-size: 12px; color: var(--t3); }
.mock-row .v { font-family: var(--f-mono); font-size: 12.5px; color: var(--t1); text-align: right; }
.mock-price { margin-top: auto; padding-top: 14px; border-top: 1px solid var(--border-s); }
.mock-price .pk { font-size: 11.5px; color: var(--t3); font-family: var(--f-mono); letter-spacing: 0.06em; text-transform: uppercase; }
.mock-price .pv {
  font-family: var(--f-mono); font-size: 30px; font-weight: 600; color: var(--tx);
  letter-spacing: -0.01em; margin-top: 2px;
}
.mock-price .pv small { font-size: 14px; color: var(--t2); font-weight: 400; }
.mock-tiers { display: flex; gap: 8px; margin-top: 12px; }
.mock-tier {
  flex: 1; text-align: center; padding: 7px 4px;
  background: var(--elevated); border: 1px solid var(--border); border-radius: var(--radius);
}
.mock-tier.active { border-color: var(--blue); background: var(--blue-bg); }
.mock-tier .q { font-family: var(--f-mono); font-size: 10.5px; color: var(--t3); display: block; }
.mock-tier .p { font-family: var(--f-mono); font-size: 12.5px; color: var(--t1); }
.mock-caption {
  margin-top: 12px; text-align: center;
  font-family: var(--f-mono); font-size: 11.5px; color: var(--t3);
}

@media (max-width: 520px) {
  .mock-body { grid-template-columns: 1fr; }
  .mock-draw { border-right: none; border-bottom: 1px solid var(--border); padding: 16px; }
}

/* ── Animationssequenz (nur ohne reduced motion) ─────────────── */
@media (prefers-reduced-motion: no-preference) {
  /* Zeichnung zeichnet sich selbst */
  .draw-anim .ad {
    stroke-dasharray: 1; stroke-dashoffset: 1;
    animation: vqDraw 0.7s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    animation-delay: var(--dd, 0s);
  }
  .draw-anim .contour {
    stroke-dasharray: 1; stroke-dashoffset: 1; fill-opacity: 0;
    animation: vqDraw 1.1s cubic-bezier(0.4, 0, 0.2, 1) forwards,
               vqFill 0.7s ease forwards;
    animation-delay: var(--dd, 0s), 1.1s;
  }
  .draw-anim .af {
    opacity: 0;
    animation: vqFade 0.4s ease forwards;
    animation-delay: var(--fd, 0s);
  }
  /* Scanlinie */
  .mock-scan { animation: vqScan 2s cubic-bezier(0.45, 0, 0.25, 1) 0.55s both; }
  /* Status-Badges */
  .badge-run {
    opacity: 1; visibility: visible;
    animation: vqBadgeOut 0.3s ease 2.4s forwards;
  }
  .badge-run i { animation: vqPulse 0.9s ease-in-out infinite; }
  .badge-done { opacity: 0; animation: vqFade 0.4s ease 2.55s forwards; }
  .badge-done i { animation: vqRing 2.6s ease-out 3s infinite; }
  /* Datenzeilen */
  .mock-row {
    opacity: 0; transform: translateY(6px);
    animation: vqRise 0.45s cubic-bezier(0.2, 0.6, 0.3, 1) forwards;
    animation-delay: var(--rd, 0s);
  }
  /* Preisblock, Staffeln, Caption */
  .mock-price {
    opacity: 0; transform: translateY(8px);
    animation: vqRise 0.55s cubic-bezier(0.2, 0.6, 0.3, 1) 2.75s forwards;
  }
  .mock-tier {
    opacity: 0; transform: translateY(6px);
    animation: vqRise 0.4s cubic-bezier(0.2, 0.6, 0.3, 1) forwards;
    animation-delay: var(--td, 3.2s);
  }
  .mock-tier.active {
    animation: vqRise 0.4s cubic-bezier(0.2, 0.6, 0.3, 1) forwards,
               vqGlow 1.1s ease-out;
    animation-delay: var(--td, 3.35s), 3.95s;
  }
  .mock-caption { opacity: 0; animation: vqFade 0.6s ease 4.15s forwards; }
}

@keyframes vqDraw { to { stroke-dashoffset: 0; } }
@keyframes vqFill { to { fill-opacity: 1; } }
@keyframes vqFade { to { opacity: 1; } }
@keyframes vqRise { to { opacity: 1; transform: translateY(0); } }
@keyframes vqScan {
  0%   { top: -4%; opacity: 0; }
  7%   { opacity: 1; }
  88%  { opacity: 1; }
  100% { top: 103%; opacity: 0; }
}
@keyframes vqBadgeOut { to { opacity: 0; visibility: hidden; } }
@keyframes vqPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.35; } }
@keyframes vqRing {
  0%   { box-shadow: 0 0 0 0 rgba(122,156,104,0.45); }
  55%  { box-shadow: 0 0 0 5px rgba(122,156,104,0); }
  100% { box-shadow: 0 0 0 0 rgba(122,156,104,0); }
}
@keyframes vqGlow {
  0%   { box-shadow: 0 0 0 0 rgba(107,143,190,0.0); }
  35%  { box-shadow: 0 0 0 4px rgba(107,143,190,0.25); }
  100% { box-shadow: 0 0 0 0 rgba(107,143,190,0); }
}
`;

type CP = React.CSSProperties;
const v = (o: Record<string, string>) => o as CP;

/** Stilisierte technische Zeichnung eines Drehteils (Beispiel) */
const Drawing = () => (
  <svg
    className="draw-anim"
    viewBox="0 0 300 200"
    role="img"
    aria-label="Stilisierte technische Zeichnung eines gestuften Drehteils mit Bemaßung"
  >
    {/* Mittellinie (strichpunktiert) */}
    <line className="af" style={v({ "--fd": "0.1s" })} x1="18" y1="108" x2="282" y2="108" stroke="#5F6878" strokeWidth="0.8" strokeDasharray="14 4 2 4" />
    {/* Kontur Drehteil */}
    <g stroke="#D8DCE4" strokeWidth="1.4" fill="rgba(107,143,190,0.06)">
      <path className="contour" style={v({ "--dd": "0.15s" })} pathLength={1} d="M40 76 L114 76 L114 86 L196 86 L196 94 L246 94 L250 98 L250 118 L246 122 L196 122 L196 130 L114 130 L114 140 L40 140 L40 76 Z" />
    </g>
    {/* Absatz-Kanten */}
    <g stroke="#8E96A4" strokeWidth="0.7" style={v({ "--dd": "1s" })}>
      <line className="ad" pathLength={1} x1="114" y1="86" x2="114" y2="130" />
      <line className="ad" pathLength={1} x1="196" y1="94" x2="196" y2="122" />
    </g>
    {/* Gesamtlänge oben */}
    <g stroke="#8E96A4" strokeWidth="0.8" style={v({ "--dd": "1.15s" })}>
      <line className="ad" pathLength={1} x1="40" y1="72" x2="40" y2="48" />
      <line className="ad" pathLength={1} x1="250" y1="90" x2="250" y2="48" />
      <line className="ad" pathLength={1} x1="40" y1="52" x2="250" y2="52" />
    </g>
    <g className="af" style={v({ "--fd": "1.5s" })}>
      <path d="M40 52 l6 -2.4 v4.8 Z" fill="#8E96A4" stroke="none" />
      <path d="M250 52 l-6 -2.4 v4.8 Z" fill="#8E96A4" stroke="none" />
      <text x="145" y="46" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="11" fill="#D8DCE4">112</text>
    </g>
    {/* Durchmesser links */}
    <g stroke="#8E96A4" strokeWidth="0.8" style={v({ "--dd": "1.3s" })}>
      <line className="ad" pathLength={1} x1="36" y1="76" x2="24" y2="76" />
      <line className="ad" pathLength={1} x1="36" y1="140" x2="24" y2="140" />
      <line className="ad" pathLength={1} x1="28" y1="76" x2="28" y2="140" />
    </g>
    <g className="af" style={v({ "--fd": "1.65s" })}>
      <path d="M28 76 l-2.4 6 h4.8 Z" fill="#8E96A4" stroke="none" />
      <path d="M28 140 l-2.4 -6 h4.8 Z" fill="#8E96A4" stroke="none" />
      <text x="20" y="112" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="10" fill="#D8DCE4" transform="rotate(-90 20 112)">⌀38</text>
    </g>
    {/* Durchmesser rechts mit Toleranz (blau hervorgehoben) */}
    <g stroke="#6B8FBE" strokeWidth="0.8" style={v({ "--dd": "1.45s" })}>
      <line className="ad" pathLength={1} x1="254" y1="94" x2="272" y2="94" />
      <line className="ad" pathLength={1} x1="254" y1="122" x2="272" y2="122" />
      <line className="ad" pathLength={1} x1="268" y1="94" x2="268" y2="122" />
    </g>
    <g className="af" style={v({ "--fd": "1.8s" })}>
      <path d="M268 94 l-2.4 5 h4.8 Z" fill="#6B8FBE" stroke="none" />
      <path d="M268 122 l-2.4 -5 h4.8 Z" fill="#6B8FBE" stroke="none" />
      <text x="278" y="104" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="9.5" fill="#88A6CE" transform="rotate(-90 278 104)">⌀22 h6</text>
    </g>
    {/* Toleranz-Callout am Absatz */}
    <g>
      <line className="ad" style={v({ "--dd": "1.6s" })} pathLength={1} x1="155" y1="86" x2="172" y2="64" stroke="#6B8FBE" strokeWidth="0.8" />
      <g className="af" style={v({ "--fd": "1.75s" })}>
        <circle cx="155" cy="86" r="2" fill="#6B8FBE" />
        <rect x="172" y="54" width="52" height="16" rx="2" fill="rgba(107,143,190,0.12)" stroke="#6B8FBE" strokeWidth="0.8" />
        <text x="198" y="65.5" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="9.5" fill="#88A6CE">±0,02</text>
      </g>
    </g>
    {/* Oberflächenzeichen */}
    <g className="af" style={v({ "--fd": "1.9s" })}>
      <g stroke="#8E96A4" strokeWidth="0.9" fill="none">
        <path d="M148 130 l5 9 l5 -16" transform="translate(0 14)" />
      </g>
      <text x="162" y="152" fontFamily="IBM Plex Mono, monospace" fontSize="8.5" fill="#8E96A4">Ra 0,8</text>
    </g>
    {/* Längenmaß unten */}
    <g stroke="#8E96A4" strokeWidth="0.8" style={v({ "--dd": "1.5s" })}>
      <line className="ad" pathLength={1} x1="114" y1="134" x2="114" y2="170" />
      <line className="ad" pathLength={1} x1="196" y1="126" x2="196" y2="170" />
      <line className="ad" pathLength={1} x1="114" y1="166" x2="196" y2="166" />
    </g>
    <g className="af" style={v({ "--fd": "1.85s" })}>
      <path d="M114 166 l6 -2.4 v4.8 Z" fill="#8E96A4" stroke="none" />
      <path d="M196 166 l-6 -2.4 v4.8 Z" fill="#8E96A4" stroke="none" />
      <text x="155" y="180" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="10" fill="#D8DCE4">58</text>
    </g>
  </svg>
);

const fmt = (n: number) => n.toFixed(2).replace(".", ",");

const ROWS: { k: string; v: string; d: string }[] = [
  { k: "Werkstoff", v: "1.4301 · X5CrNi18-10", d: "1.5s" },
  { k: "Rohteil", v: "⌀40 × 116 mm", d: "1.7s" },
  { k: "Feinste Toleranz", v: "±0,02 / IT6", d: "1.9s" },
  { k: "Oberfläche", v: "Ra 0,8", d: "2.1s" },
  { k: "Hauptzeit", v: "4:32 min", d: "2.3s" },
];

export default function HeroMock() {
  // Endwert ist Initialzustand → korrekt ohne JS und bei reduced motion.
  const [price, setPrice] = useState(fmt(FINAL_PRICE));
  const started = useRef(false);

  /** Startet den Count-up synchron zum Einblenden des Preisblocks. */
  const onPriceIn = useCallback((e: React.AnimationEvent<HTMLDivElement>) => {
    if (e.animationName !== "vqRise" || e.target !== e.currentTarget) return;
    if (started.current) return;
    started.current = true;
    const dur = 950;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min((t - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      setPrice(fmt(FINAL_PRICE * eased));
      if (p < 1) requestAnimationFrame(tick);
    };
    setPrice(fmt(0));
    requestAnimationFrame(tick);
  }, []);

  return (
    <div className="mock" aria-label="Beispielansicht der Analyse- und Kalkulationsoberfläche">
      <style>{CSS}</style>
      <div className="mock-card">
        <div className="mock-head">
          <span className="mock-file">flanschwelle_07-114.pdf</span>
          <span className="mock-file">.step</span>
          <span className="mock-status">
            <span className="mock-badge badge-run"><i />Analysiere Zeichnung …</span>
            <span className="mock-badge badge-done"><i />Analyse abgeschlossen</span>
          </span>
        </div>
        <div className="mock-body">
          <div className="mock-draw">
            <Drawing />
            <div className="mock-scan" aria-hidden="true" />
          </div>
          <div className="mock-data">
            {ROWS.map((r) => (
              <div className="mock-row" style={v({ "--rd": r.d })} key={r.k}>
                <span className="k">{r.k}</span>
                <span className="v">{r.v}</span>
              </div>
            ))}
            <div className="mock-price" onAnimationStart={onPriceIn}>
              <span className="pk">Stückpreis · 100 Stk</span>
              <div className="pv">{price}&nbsp;€ <small>netto</small></div>
              <div className="mock-tiers">
                <div className="mock-tier" style={v({ "--td": "3.2s" })}><span className="q">25 Stk</span><span className="p">31,10 €</span></div>
                <div className="mock-tier active" style={v({ "--td": "3.35s" })}><span className="q">100 Stk</span><span className="p">23,84 €</span></div>
                <div className="mock-tier" style={v({ "--td": "3.5s" })}><span className="q">250 Stk</span><span className="p">21,02 €</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p className="mock-caption">Stilisierte Beispielansicht mit Beispielwerten</p>
    </div>
  );
}
