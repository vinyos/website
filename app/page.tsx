"use client";
import { useEffect, useRef, useState } from "react";
import ThemeToggle from "./ThemeToggle";

/* ────────────────────────────────────────────────
   Scroll-Reveal
──────────────────────────────────────────────── */
function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: React.ElementType;
}) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setShown(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, []);
  return (
    <Tag ref={ref} className={`lnd-reveal${shown ? " is-in" : ""} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </Tag>
  );
}

/* ────────────────────────────────────────────────
   Count-up Zahl (Stats-Band)
──────────────────────────────────────────────── */
function CountUp({ end, suffix = "", duration = 1200 }: { end: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [val, setVal] = useState(0);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setVal(end); return; }
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      obs.disconnect();
      const t0 = performance.now();
      const tick = (t: number) => {
        const p = Math.min((t - t0) / duration, 1);
        setVal(Math.round(end * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.5 });
    obs.observe(node);
    return () => obs.disconnect();
  }, [end, duration]);
  return <span ref={ref}>{val}{suffix}</span>;
}

/* ────────────────────────────────────────────────
   Scan-Timer (zählt 0,0 → 3,8 s pro Zyklus)
──────────────────────────────────────────────── */
function ScanTimer({ reduced }: { reduced: boolean }) {
  const [t, setT] = useState(reduced ? 3.8 : 0);
  useEffect(() => {
    if (reduced) return;
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const v = Math.min((now - t0) / 1000, 3.8);
      setT(v);
      if (v < 3.8) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);
  return <>{t.toFixed(1).replace(".", ",")} s</>;
}

/* ────────────────────────────────────────────────
   GD&T-Symbol-Icons (SVG, 24×24)
──────────────────────────────────────────────── */
function GdtIcon({ kind }: { kind: string }) {
  const s = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const };
  switch (kind) {
    case "geradheit": return <svg width="24" height="24" viewBox="0 0 24 24"><line x1="4" y1="12" x2="20" y2="12" {...s} /></svg>;
    case "ebenheit": return <svg width="24" height="24" viewBox="0 0 24 24"><path d="M7 8h12l-4 8H3z" {...s} strokeLinejoin="round" /></svg>;
    case "rundheit": return <svg width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="6.5" {...s} /></svg>;
    case "zylinder": return <svg width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5.5" {...s} /><line x1="4" y1="19" x2="9" y2="5" {...s} /><line x1="15" y1="19" x2="20" y2="5" {...s} /></svg>;
    case "linienprofil": return <svg width="24" height="24" viewBox="0 0 24 24"><path d="M5 15a7 7 0 0 1 14 0" {...s} /></svg>;
    case "flaechenprofil": return <svg width="24" height="24" viewBox="0 0 24 24"><path d="M5 15a7 7 0 0 1 14 0z" {...s} strokeLinejoin="round" /></svg>;
    case "parallel": return <svg width="24" height="24" viewBox="0 0 24 24"><line x1="8" y1="19" x2="13" y2="5" {...s} /><line x1="14" y1="19" x2="19" y2="5" {...s} /></svg>;
    case "rechtwinklig": return <svg width="24" height="24" viewBox="0 0 24 24"><line x1="4" y1="18" x2="20" y2="18" {...s} /><line x1="12" y1="18" x2="12" y2="5" {...s} /></svg>;
    case "neigung": return <svg width="24" height="24" viewBox="0 0 24 24"><line x1="4" y1="18" x2="20" y2="18" {...s} /><line x1="4" y1="18" x2="17" y2="6" {...s} /></svg>;
    case "position": return <svg width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5.5" {...s} /><line x1="12" y1="3" x2="12" y2="21" {...s} /><line x1="3" y1="12" x2="21" y2="12" {...s} /></svg>;
    case "konzentrisch": return <svg width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="7" {...s} /><circle cx="12" cy="12" r="3" {...s} /></svg>;
    case "symmetrie": return <svg width="24" height="24" viewBox="0 0 24 24"><line x1="6" y1="8" x2="18" y2="8" {...s} /><line x1="4" y1="12" x2="20" y2="12" {...s} /><line x1="6" y1="16" x2="18" y2="16" {...s} /></svg>;
    case "rundlauf": return <svg width="24" height="24" viewBox="0 0 24 24"><line x1="6" y1="18" x2="17" y2="7" {...s} /><path d="M17 13V7h-6" {...s} strokeLinejoin="round" /></svg>;
    case "gesamtlauf": return <svg width="24" height="24" viewBox="0 0 24 24"><line x1="4" y1="19" x2="13" y2="10" {...s} /><line x1="9" y1="19" x2="18" y2="10" {...s} /><path d="M18 15v-5h-5" {...s} strokeLinejoin="round" /></svg>;
    default: return null;
  }
}

/* ────────────────────────────────────────────────
   Technische Zeichnung mit Scan-Animation (Hero)
──────────────────────────────────────────────── */
function DrawingScan({ reduced }: { reduced: boolean }) {
  return (
    <div className={`lnd-draw${reduced ? " lnd-draw--static" : ""}`}>
      {/* Scan-Linie */}
      <div className="lnd-draw-scanline" />

      <svg viewBox="0 0 340 190" className="lnd-draw-svg" aria-hidden>
        {/* Mittellinie (strichpunktiert) */}
        <line x1="20" y1="95" x2="320" y2="95" className="lnd-de-base" strokeDasharray="14 4 2 4" strokeWidth="0.8" />

        {/* Wellen-Kontur: gestufte Welle */}
        <g className="lnd-de lnd-de-1">
          <path d="M50 70 h80 v-13 h95 v13 h65 v50 h-65 v13 h-95 v-13 h-80 z" fill="none" strokeWidth="1.6" />
          {/* Fasen */}
          <path d="M50 70 l6 6 M50 120 l6 -6 M290 70 l-6 6 M290 120 l-6 -6" strokeWidth="1" />
          {/* Absatz-Kanten */}
          <line x1="130" y1="57" x2="130" y2="133" strokeWidth="1" />
          <line x1="225" y1="57" x2="225" y2="133" strokeWidth="1" />
        </g>

        {/* Maß ⌀40 h7 (links, vertikal) */}
        <g className="lnd-de lnd-de-2" strokeWidth="1">
          <line x1="36" y1="70" x2="36" y2="120" />
          <path d="M36 70 l-2.5 6 h5 z M36 120 l-2.5 -6 h5 z" className="lnd-de-fill" />
          <line x1="36" y1="70" x2="48" y2="70" strokeWidth="0.7" />
          <line x1="36" y1="120" x2="48" y2="120" strokeWidth="0.7" />
          <text x="30" y="98" textAnchor="end" className="lnd-draw-txt">⌀40 h7</text>
        </g>

        {/* Maß 80 (unten, horizontal) */}
        <g className="lnd-de lnd-de-3" strokeWidth="1">
          <line x1="50" y1="150" x2="290" y2="150" />
          <path d="M50 150 l6 -2.5 v5 z M290 150 l-6 -2.5 v5 z" className="lnd-de-fill" />
          <line x1="50" y1="124" x2="50" y2="154" strokeWidth="0.7" />
          <line x1="290" y1="124" x2="290" y2="154" strokeWidth="0.7" />
          <text x="170" y="146" textAnchor="middle" className="lnd-draw-txt">80 ±0,05</text>
        </g>

        {/* GD&T-Rahmen ⊥ 0,02 A */}
        <g className="lnd-de lnd-de-4" strokeWidth="1">
          <rect x="196" y="22" width="86" height="18" fill="none" />
          <line x1="222" y1="22" x2="222" y2="40" />
          <line x1="258" y1="22" x2="258" y2="40" />
          {/* ⊥ Symbol */}
          <line x1="203" y1="35" x2="215" y2="35" strokeWidth="1.3" />
          <line x1="209" y1="35" x2="209" y2="26" strokeWidth="1.3" />
          <text x="240" y="35" textAnchor="middle" className="lnd-draw-txt">0,02</text>
          <text x="270" y="35" textAnchor="middle" className="lnd-draw-txt">A</text>
          <line x1="239" y1="40" x2="239" y2="57" strokeWidth="0.7" />
          <path d="M239 57 l-2.5 -6 h5 z" className="lnd-de-fill" />
        </g>

        {/* Rz 6,3 Oberflächenzeichen */}
        <g className="lnd-de lnd-de-5" strokeWidth="1">
          <path d="M86 48 l5 9 l9 -16" fill="none" />
          <text x="104" y="46" className="lnd-draw-txt">Rz 6,3</text>
          <line x1="91" y1="57" x2="91" y2="68" strokeWidth="0.7" />
        </g>

        {/* Datum A */}
        <g className="lnd-de lnd-de-6" strokeWidth="1">
          <rect x="305" y="88" width="15" height="15" fill="none" />
          <text x="312.5" y="99.5" textAnchor="middle" className="lnd-draw-txt">A</text>
          <line x1="290" y1="95" x2="305" y2="95" strokeWidth="0.7" />
          <path d="M290 95 l6 -2.5 v5 z" className="lnd-de-fill" />
        </g>
      </svg>

      {/* Extrahierte Chips */}
      <div className="lnd-draw-chips">
        {["⌀40 h7", "IT7", "⊥ 0,02 A", "Rz 6,3", "C45"].map((c, i) => (
          <span key={c} className="lnd-draw-chip" style={{ animationDelay: `${1.0 + i * 0.45}s` }}>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M1.5 5l2.5 2.5L8.5 2.5" /></svg>
            {c}
          </span>
        ))}
      </div>

      {/* Timer + Preis */}
      <div className="lnd-draw-foot">
        <span className="lnd-draw-timer">
          <span className="lnd-draw-timer-dot" />
          Analyse · <ScanTimer reduced={reduced} />
        </span>
        <span className="lnd-draw-price">
          <span className="lnd-draw-price-lab">10 Stk</span>
          182,68 €
        </span>
      </div>
    </div>
  );
}

const GDT_SYMBOLS = [
  { kind: "geradheit", name: "Geradheit" },
  { kind: "ebenheit", name: "Ebenheit" },
  { kind: "rundheit", name: "Rundheit" },
  { kind: "zylinder", name: "Zylinderform" },
  { kind: "linienprofil", name: "Linienprofil" },
  { kind: "flaechenprofil", name: "Flächenprofil" },
  { kind: "parallel", name: "Parallelität" },
  { kind: "rechtwinklig", name: "Rechtwinkligkeit" },
  { kind: "neigung", name: "Neigung" },
  { kind: "position", name: "Position" },
  { kind: "konzentrisch", name: "Konzentrizität" },
  { kind: "symmetrie", name: "Symmetrie" },
  { kind: "rundlauf", name: "Rundlauf" },
  { kind: "gesamtlauf", name: "Gesamtlauf" },
];

/* ────────────────────────────────────────────────
   Interaktiver 3D-Teil-Viewer (Three.js, lazy)
──────────────────────────────────────────────── */
type ViewMode = "solid" | "profil" | "explosion" | "zeichnung";

/* Gemeinsame Teil-Geometrie für 3D-Volumen + 2D-Schnitt/Explosion (Stufenwelle) */
const DEMO_SEGS: { len: number; dia: number; tol?: string }[] = [
  { len: 12, dia: 16 },
  { len: 9, dia: 28 },
  { len: 32, dia: 22, tol: "±0.05" },
  { len: 7, dia: 42, tol: "h7" },
  { len: 26, dia: 18 },
  { len: 12, dia: 12, tol: "±0.02" },
];

/* ────────────────────────────────────────────────
   Starre 2D-Ansicht (Schnitt + Explosion) — wie im Dashboard
──────────────────────────────────────────────── */
function Profile2D({ mode }: { mode: "profil" | "explosion" }) {
  const VW = 720, VH = 400, CY = 196;
  const explosion = mode === "explosion";
  const total = DEMO_SEGS.reduce((a, s) => a + s.len, 0);
  const maxDia = Math.max(...DEMO_SEGS.map(s => s.dia));
  const PAD_X = 100;
  const GAP = explosion ? 26 : 0;
  const gapsTotal = GAP * (DEMO_SEGS.length - 1);
  const sc = Math.min((VH / 2 - 118) / (maxDia / 2), (VW - 2 * PAD_X - gapsTotal) / total);
  const r = (d: number) => (d / 2) * sc;

  let cx = (VW - (total * sc + gapsTotal)) / 2;
  const boxes = DEMO_SEGS.map((s) => {
    const w = s.len * sc;
    const b = { ...s, x0: cx, x1: cx + w, w, rr: r(s.dia) };
    cx += w + GAP;
    return b;
  });
  const firstX = boxes[0].x0, lastX = boxes[boxes.length - 1].x1;

  // Durchgehendes, gestuftes Schnittprofil
  let pp = `M ${boxes[0].x0} ${CY - boxes[0].rr}`;
  boxes.forEach(b => { pp += ` L ${b.x0} ${CY - b.rr} L ${b.x1} ${CY - b.rr}`; });
  for (let i = boxes.length - 1; i >= 0; i--) { const b = boxes[i]; pp += ` L ${b.x1} ${CY + b.rr} L ${b.x0} ${CY + b.rr}`; }
  pp += " Z";

  const Arrow = (x: number, y: number, dir: 1 | -1) => (
    <path d={`M ${x} ${y} l ${dir * 5} -2.6 l 0 5.2 Z`} style={{ fill: "var(--lnd-t2)" }} />
  );

  // ⌀-Bemaßung mit Hinweislinie (Toleranz in Kupfer hervorgehoben)
  const diaCallout = (b: typeof boxes[number], dx: number, dy: number, anchor: "start" | "end") => {
    const sx = b.x0 + b.w / 2, sy = CY - b.rr;
    const ex = sx + dx, ey = sy + dy;
    const tx = ex + (anchor === "start" ? 5 : -5);
    return (
      <g key={`d${b.x0}`} fontFamily="IBM Plex Mono, monospace">
        <line x1={sx} y1={sy} x2={ex} y2={ey} style={{ stroke: "var(--lnd-accent)" }} strokeWidth={0.7} />
        <circle cx={sx} cy={sy} r={1.7} style={{ fill: "var(--lnd-accent)" }} />
        <text x={tx} y={ey + 3.5} textAnchor={anchor} fontSize={12.5} style={{ fill: "var(--lnd-t1)" }}>
          ⌀{b.dia}
          {b.tol && <tspan dx={4} fontSize={10.5} style={{ fill: "var(--lnd-accent-h)" }}>{b.tol}</tspan>}
        </text>
      </g>
    );
  };

  return (
    <svg viewBox={`0 0 ${VW} ${VH}`} className="lnd-p2d-svg" preserveAspectRatio="xMidYMid meet">
      <defs>
        <pattern id="lnd-hatch" patternUnits="userSpaceOnUse" width={6} height={6}>
          <line x1={0} y1={6} x2={6} y2={0} style={{ stroke: "var(--lnd-border-s)" }} strokeWidth={0.7} />
        </pattern>
        <linearGradient id="lnd-seg-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" style={{ stopColor: "var(--lnd-surface)" }} />
          <stop offset="50%" style={{ stopColor: "var(--lnd-bg-alt)" }} />
          <stop offset="100%" style={{ stopColor: "var(--lnd-bg-alt)" }} />
        </linearGradient>
        <clipPath id="lnd-prof-clip"><path d={pp} /></clipPath>
      </defs>

      {/* Rotationsachse (Strich-Punkt) */}
      <line x1={firstX - 26} y1={CY} x2={lastX + 26} y2={CY}
        style={{ stroke: "var(--lnd-t4)" }} strokeWidth={0.8} strokeDasharray="9 3 2 3" />

      {explosion ? (
        boxes.map((b, i) => (
          <g key={i} style={{ opacity: 0, animation: `lnd-fade 0.5s ${0.05 + i * 0.07}s ease-out forwards` }}>
            <rect x={b.x0} y={CY - b.rr} width={b.w} height={b.rr * 2} fill="url(#lnd-seg-grad)" />
            <rect x={b.x0} y={CY - b.rr} width={b.w} height={b.rr * 2} fill="url(#lnd-hatch)" />
            <rect x={b.x0} y={CY - b.rr} width={b.w} height={b.rr * 2} fill="none" style={{ stroke: "var(--lnd-accent)" }} strokeWidth={1.2} />
            <ellipse cx={b.x1} cy={CY} rx={2.6} ry={b.rr} style={{ fill: "var(--lnd-t4)", stroke: "var(--lnd-accent)" }} strokeWidth={0.8} />
            {/* Länge oben */}
            <g fontFamily="IBM Plex Mono, monospace" fontSize={10.5} style={{ fill: "var(--lnd-t2)" }}>
              <line x1={b.x0} y1={CY - b.rr - 12} x2={b.x1} y2={CY - b.rr - 12} style={{ stroke: "var(--lnd-t3)" }} strokeWidth={0.6} />
              {Arrow(b.x0, CY - b.rr - 12, 1)}{Arrow(b.x1, CY - b.rr - 12, -1)}
              <text x={(b.x0 + b.x1) / 2} y={CY - b.rr - 17} textAnchor="middle">{b.len}</text>
            </g>
            {/* ⌀ + Toleranz unten */}
            <text x={(b.x0 + b.x1) / 2} y={CY + b.rr + 18} textAnchor="middle"
              fontFamily="IBM Plex Mono, monospace" fontSize={11} style={{ fill: "var(--lnd-t1)" }}>
              ⌀{b.dia}{b.tol && <tspan dx={3} fontSize={9.5} style={{ fill: "var(--lnd-accent-h)" }}>{b.tol}</tspan>}
            </text>
          </g>
        ))
      ) : (
        <g style={{ opacity: 0, animation: "lnd-fade 0.6s 0.05s ease-out forwards" }}>
          <path d={pp} fill="url(#lnd-seg-grad)" />
          <rect x={0} y={0} width={VW} height={VH} fill="url(#lnd-hatch)" clipPath="url(#lnd-prof-clip)" />
          <path d={pp} fill="none" style={{ stroke: "var(--lnd-accent)" }} strokeWidth={1.3} strokeLinejoin="miter" />
          <ellipse cx={firstX} cy={CY} rx={3} ry={boxes[0].rr} style={{ fill: "var(--lnd-t4)", stroke: "var(--lnd-accent)" }} strokeWidth={0.8} />
          <ellipse cx={lastX} cy={CY} rx={2.4} ry={boxes[boxes.length - 1].rr} style={{ fill: "var(--lnd-t4)", stroke: "var(--lnd-accent)" }} strokeWidth={0.8} />
        </g>
      )}

      {/* ── Bemaßung (nur Schnittansicht; Explosion bemaßt je Block) ── */}
      {!explosion && (
        <g style={{ opacity: 0, animation: "lnd-fade 0.5s 0.5s ease-out forwards" }}>
          {/* ⌀-Hinweise — toleranzbehaftete Maße hervorgehoben */}
          {diaCallout(boxes[0], -30, -42, "end")}
          {diaCallout(boxes[2], -34, -54, "end")}
          {diaCallout(boxes[3], 32, -48, "start")}
          {diaCallout(boxes[5], 34, -30, "start")}

          {/* Maßkette der Segmentlängen unten */}
          {(() => {
            const dy = CY + maxDia / 2 * sc + 40;
            return (
              <g fontFamily="IBM Plex Mono, monospace" fontSize={10.5} style={{ fill: "var(--lnd-t2)" }}>
                {boxes.map((b, i) => (
                  <g key={i}>
                    <line x1={b.x0} y1={CY + b.rr} x2={b.x0} y2={dy + 5} style={{ stroke: "var(--lnd-t4)" }} strokeWidth={0.5} />
                    <line x1={b.x0} y1={dy} x2={b.x1} y2={dy} style={{ stroke: "var(--lnd-t3)" }} strokeWidth={0.6} />
                    {Arrow(b.x0, dy, 1)}{Arrow(b.x1, dy, -1)}
                    <text x={(b.x0 + b.x1) / 2} y={dy - 5} textAnchor="middle">{b.len}</text>
                  </g>
                ))}
                <line x1={lastX} y1={CY + boxes[boxes.length - 1].rr} x2={lastX} y2={dy + 5} style={{ stroke: "var(--lnd-t4)" }} strokeWidth={0.5} />
                {/* Gesamtlänge */}
                <line x1={firstX} y1={dy + 22} x2={lastX} y2={dy + 22} style={{ stroke: "var(--lnd-t2)" }} strokeWidth={0.7} />
                {Arrow(firstX, dy + 22, 1)}{Arrow(lastX, dy + 22, -1)}
                <text x={(firstX + lastX) / 2} y={dy + 17} textAnchor="middle" fontSize={11.5} style={{ fill: "var(--lnd-t1)" }}>{total}</text>
              </g>
            );
          })()}
        </g>
      )}

      {/* Label */}
      <text x={VW / 2} y={VH - 8} textAnchor="middle"
        fontFamily="IBM Plex Mono, monospace" fontSize={9} style={{ fill: "var(--lnd-t3)" }} letterSpacing={2}>
        {explosion ? "EXPLOSIONSANSICHT" : "SCHNITTANSICHT · A–A"}
      </text>
    </svg>
  );
}

/* ────────────────────────────────────────────────
   Technische Zeichnung — im Website-Stil (CSS-Variablen, kein hartes Weiß/Schwarz)
──────────────────────────────────────────────── */
function TechnicalDrawing() {
  const VW = 720, VH = 400, CY = 168;
  const total = DEMO_SEGS.reduce((a, s) => a + s.len, 0);
  const maxDia = Math.max(...DEMO_SEGS.map(s => s.dia));
  const PAD_X = 110;
  const sc = Math.min((CY - 48) / (maxDia / 2), (VW - 2 * PAD_X) / total);
  const r = (d: number) => (d / 2) * sc;

  let cx = (VW - total * sc) / 2;
  const boxes = DEMO_SEGS.map((s) => {
    const w = s.len * sc;
    const b = { ...s, x0: cx, x1: cx + w, w, rr: r(s.dia) };
    cx += w;
    return b;
  });
  const firstX = boxes[0].x0;
  const lastX = boxes[boxes.length - 1].x1;

  let pp = `M ${firstX} ${CY - boxes[0].rr}`;
  boxes.forEach(b => { pp += ` L ${b.x0} ${CY - b.rr} L ${b.x1} ${CY - b.rr}`; });
  for (let i = boxes.length - 1; i >= 0; i--) { const b = boxes[i]; pp += ` L ${b.x1} ${CY + b.rr} L ${b.x0} ${CY + b.rr}`; }
  pp += " Z";

  const FONT = "IBM Plex Mono, monospace";

  const Arrow = (x: number, y: number, dir: 1 | -1) => (
    <path d={`M ${x} ${y} l ${dir * 5} -2.4 l 0 4.8 Z`} style={{ fill: "var(--lnd-accent)" }} />
  );

  const HorizDim = (x0: number, x1: number, y: number, label: string, tol?: string, total?: boolean) => (
    <g>
      <line x1={x0} y1={y - 4} x2={x0} y2={y + 4} stroke="var(--lnd-accent)" strokeWidth={0.6} />
      <line x1={x1} y1={y - 4} x2={x1} y2={y + 4} stroke="var(--lnd-accent)" strokeWidth={0.6} />
      <line x1={x0} y1={y} x2={x1} y2={y} stroke="var(--lnd-accent)" strokeWidth={0.6} />
      {Arrow(x0, y, 1)}{Arrow(x1, y, -1)}
      <text x={(x0 + x1) / 2} y={y - 6} textAnchor="middle" fontSize={total ? 10 : 9} fontFamily={FONT}
        style={{ fill: total ? "var(--lnd-t1)" : "var(--lnd-t2)" }} fontWeight={total ? "600" : "400"}>
        {label}
        {tol && <tspan dx={3} fontSize={8} style={{ fill: "var(--lnd-accent-h)" }}>{tol}</tspan>}
      </text>
    </g>
  );

  const DiaCallout = (b: typeof boxes[number], dx: number, dy: number, anchor: "start" | "end") => {
    const sx = b.x0 + b.w / 2, sy = CY - b.rr;
    const ex = sx + dx, ey = sy + dy;
    const tx = ex + (anchor === "start" ? 5 : -5);
    return (
      <g fontFamily={FONT}>
        <line x1={sx} y1={sy} x2={ex} y2={ey} stroke="var(--lnd-accent)" strokeWidth={0.7} />
        <circle cx={sx} cy={sy} r={1.8} style={{ fill: "var(--lnd-accent)" }} />
        <text x={tx} y={ey + 3.5} textAnchor={anchor} fontSize={11} style={{ fill: "var(--lnd-t1)" }}>
          ⌀{b.dia}
          {b.tol && <tspan dx={4} fontSize={9.5} style={{ fill: "var(--lnd-accent-h)" }}>{b.tol}</tspan>}
        </text>
      </g>
    );
  };

  const dimY = CY + maxDia / 2 * sc + 28;

  return (
    <svg viewBox={`0 0 ${VW} ${VH}`} className="lnd-td-svg" preserveAspectRatio="xMidYMid meet">
      <defs>
        <pattern id="td-hatch" patternUnits="userSpaceOnUse" width={6} height={6}>
          <line x1={0} y1={6} x2={6} y2={0} style={{ stroke: "var(--lnd-border-s)" }} strokeWidth={0.7} />
        </pattern>
        <clipPath id="td-clip"><path d={pp} /></clipPath>
        <linearGradient id="td-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" style={{ stopColor: "var(--lnd-surface)" }} />
          <stop offset="60%" style={{ stopColor: "var(--lnd-bg-alt)" }} />
        </linearGradient>
      </defs>

      {/* Füllung & Schraffur */}
      <path d={pp} fill="url(#td-fill)" />
      <rect x={0} y={0} width={VW} height={VH} fill="url(#td-hatch)" clipPath="url(#td-clip)" />

      {/* Mittelachse */}
      <line x1={firstX - 28} y1={CY} x2={lastX + 28} y2={CY}
        style={{ stroke: "var(--lnd-t4)" }} strokeWidth={0.7} strokeDasharray="9 3 2 3" />

      {/* Kontur */}
      <path d={pp} fill="none" style={{ stroke: "var(--lnd-accent)" }} strokeWidth={1.4} strokeLinejoin="miter" />

      {/* Stirnflächen */}
      <line x1={firstX} y1={CY - boxes[0].rr} x2={firstX} y2={CY + boxes[0].rr} style={{ stroke: "var(--lnd-accent)" }} strokeWidth={1.4} />
      <line x1={lastX} y1={CY - boxes[boxes.length-1].rr} x2={lastX} y2={CY + boxes[boxes.length-1].rr} style={{ stroke: "var(--lnd-accent)" }} strokeWidth={1.4} />

      {/* Ellipsen an den Enden */}
      <ellipse cx={firstX} cy={CY} rx={3} ry={boxes[0].rr} style={{ fill: "var(--lnd-t4)", stroke: "var(--lnd-accent)" }} strokeWidth={0.8} />
      <ellipse cx={lastX} cy={CY} rx={2.4} ry={boxes[boxes.length-1].rr} style={{ fill: "var(--lnd-t4)", stroke: "var(--lnd-accent)" }} strokeWidth={0.8} />

      {/* ⌀-Callouts */}
      <g style={{ opacity: 0, animation: "lnd-fade 0.5s 0.4s ease-out forwards" }}>
        {DiaCallout(boxes[0], -28, -36, "end")}
        {DiaCallout(boxes[2], -32, -50, "end")}
        {DiaCallout(boxes[3], 30, -44, "start")}
        {DiaCallout(boxes[5], 32, -28, "start")}
      </g>

      {/* Längen-Bemaßung */}
      <g style={{ opacity: 0, animation: "lnd-fade 0.5s 0.6s ease-out forwards" }}>
        {boxes.map((b, i) => HorizDim(b.x0, b.x1, dimY + (i % 2 === 0 ? 0 : 16), `${b.len}`, b.tol))}
        {HorizDim(firstX, lastX, dimY + 34, `${total}`, undefined, true)}
      </g>

      {/* Label */}
      <text x={VW / 2} y={VH - 10} textAnchor="middle"
        fontFamily={FONT} fontSize={9} style={{ fill: "var(--lnd-t3)" }} letterSpacing={2}>
        SCHNITTANSICHT · A–A · WERKSTOFF C45
      </text>
    </svg>
  );
}

/* 3D-Hero-Farben (Three.js liest kein CSS — Werte spiegeln die Light/Petrol-Palette).
   Warme, helle Szene; anthrazit-getöntes Metall, das auf Off-White (#faf9f5) liest;
   Petrol-Akzent (#3f7d7b) für Kanten/Rim. */
// JS kann keine CSS-Variablen lesen → Farb-Sets für beide Themes hier gespiegelt.
const HERO3D_LIGHT = {
  partMetal:   0xb8b6ad, // helles, warm-neutrales Metall (zwischen --lnd-t4 #b0aea5 und Surface)
  accent:      0x3f7d7b, // --lnd-accent (Profil-Kanten + Rim-Licht)
  ambient:     0xfaf9f5, // --lnd-bg, warmes Umgebungslicht
  keyLight:    0xfffdf6, // warmes Weiß (Key)
  fillLight:   0xe9e6da, // --lnd-bg-alt-artiges weiches Fülllicht
} as const;
const HERO3D_DARK = {
  partMetal:   0x9fb0c8, // kühler, mittlerer Stahl — liest auf #141413
  accent:      0x6fb3b1, // --lnd-accent (dark) für Profil-Kanten + Rim-Licht
  ambient:     0x20242b, // dunkles, leicht kühles Umgebungslicht
  keyLight:    0xcdd6e4, // kühles Key-Licht
  fillLight:   0x2a2f38, // gedämpftes kühles Fülllicht
} as const;
type Hero3DColors = Record<keyof typeof HERO3D_LIGHT, number>;
function hero3dColors(): Hero3DColors {
  const dark =
    typeof document !== "undefined" &&
    document.documentElement.getAttribute("data-theme") === "dark";
  return dark ? HERO3D_DARK : HERO3D_LIGHT;
}

function PartViewer() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<{ setMode: (m: ViewMode) => void } | null>(null);
  const [mounted, setMounted] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [mode, setMode] = useState<ViewMode>("solid");

  // Erst laden, wenn die Sektion in den Viewport scrollt
  useEffect(() => {
    const node = wrapRef.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setMounted(true); obs.disconnect(); } },
      { threshold: 0.2 }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!mounted) return;
    let disposed = false;
    let cleanup = () => {};
    (async () => {
      try {
        const THREE = await import("three");
        const { OrbitControls } = await import("three/examples/jsm/controls/OrbitControls.js");
        const host = hostRef.current;
        if (!host || disposed) return;

        const W = host.clientWidth || 640;
        const H = host.clientHeight || 460;
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        let HERO3D = hero3dColors();
        const scene = new THREE.Scene();
        const steel = new THREE.MeshStandardMaterial({ color: HERO3D.partMetal, metalness: 0.72, roughness: 0.42 });
        const accent = new THREE.Color(HERO3D.accent);

        // Stufenwelle als einzelne Segmente { Länge, Radius } — geteilt mit der 2D-Ansicht
        const segs = DEMO_SEGS.map(s => ({ l: s.len, r: s.dia / 2 }));
        const total = segs.reduce((a, s) => a + s.l, 0);
        const part = new THREE.Group();
        const subs: InstanceType<typeof THREE.Group>[] = [];
        const edgeMats: InstanceType<typeof THREE.LineBasicMaterial>[] = [];
        let cx = -total / 2;
        segs.forEach((s, i) => {
          const geo = new THREE.CylinderGeometry(s.r, s.r, s.l, 56);
          geo.rotateZ(Math.PI / 2);
          const mesh = new THREE.Mesh(geo, steel);
          const edgeMat = new THREE.LineBasicMaterial({ color: accent });
          edgeMats.push(edgeMat);
          const edges = new THREE.LineSegments(
            new THREE.EdgesGeometry(geo, 18),
            edgeMat
          );
          edges.visible = false;
          const sub = new THREE.Group();
          sub.add(mesh);
          sub.add(edges);
          const baseX = cx + s.l / 2;
          sub.position.x = baseX;
          sub.userData = { baseX, targetX: baseX, idx: i, mesh, edges };
          part.add(sub);
          subs.push(sub);
          cx += s.l;
        });
        scene.add(part);

        const cam = new THREE.PerspectiveCamera(40, W / H, 0.1, 2000);
        cam.position.set(total * 0.45, total * 0.42, total * 1.25);
        cam.lookAt(0, 0, 0);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(W, H);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.15;
        host.appendChild(renderer.domElement);

        const controls = new OrbitControls(cam, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.08;
        controls.enablePan = false;
        controls.autoRotate = !reduced;
        controls.autoRotateSpeed = 1.1;
        controls.minDistance = total * 0.7;
        controls.maxDistance = total * 2.6;

        const ambient = new THREE.AmbientLight(HERO3D.ambient, 2.4);
        scene.add(ambient);
        const key = new THREE.DirectionalLight(HERO3D.keyLight, 2.8);
        key.position.set(total, total * 1.4, total);
        scene.add(key);
        const fill = new THREE.DirectionalLight(HERO3D.fillLight, 1.4);
        fill.position.set(total * 0.6, total * 0.8, -total);
        scene.add(fill);
        const rim = new THREE.DirectionalLight(HERO3D.accent, 1.6);
        rim.position.set(-total, -total * 0.4, -total * 0.5);
        scene.add(rim);

        // Theme-Wechsel live übernehmen (JS liest keine CSS-Vars → Farb-Set neu wählen).
        const applyTheme = () => {
          HERO3D = hero3dColors();
          steel.color.set(HERO3D.partMetal);
          accent.set(HERO3D.accent);
          edgeMats.forEach((m) => m.color.set(HERO3D.accent));
          ambient.color.set(HERO3D.ambient);
          key.color.set(HERO3D.keyLight);
          fill.color.set(HERO3D.fillLight);
          rim.color.set(HERO3D.accent);
        };
        window.addEventListener("themechange", applyTheme);
        const themeObserver = new MutationObserver(applyTheme);
        themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

        const applyMode = (m: ViewMode) => {
          subs.forEach((sub) => {
            const u = sub.userData as { baseX: number; idx: number; mesh: InstanceType<typeof THREE.Mesh>; edges: InstanceType<typeof THREE.LineSegments> };
            if (m === "profil") {
              u.mesh.visible = false; u.edges.visible = true;
              sub.userData.targetX = u.baseX;
            } else if (m === "explosion") {
              u.mesh.visible = true; u.edges.visible = false;
              sub.userData.targetX = u.baseX + (u.idx - (subs.length - 1) / 2) * 16;
            } else {
              u.mesh.visible = true; u.edges.visible = false;
              sub.userData.targetX = u.baseX;
            }
          });
        };
        apiRef.current = { setMode: applyMode };

        const onResize = () => {
          const w = host.clientWidth, h = host.clientHeight;
          if (!w || !h) return;
          cam.aspect = w / h; cam.updateProjectionMatrix();
          renderer.setSize(w, h);
        };
        window.addEventListener("resize", onResize);

        let raf = 0;
        const tick = () => {
          subs.forEach((sub) => {
            const tx = sub.userData.targetX as number;
            sub.position.x += (tx - sub.position.x) * 0.14;
          });
          controls.update();
          renderer.render(scene, cam);
          raf = requestAnimationFrame(tick);
        };
        tick();
        setReady(true);

        cleanup = () => {
          cancelAnimationFrame(raf);
          window.removeEventListener("resize", onResize);
          window.removeEventListener("themechange", applyTheme);
          themeObserver.disconnect();
          controls.dispose();
          renderer.dispose();
          if (renderer.domElement.parentNode === host) host.removeChild(renderer.domElement);
        };
      } catch {
        setFailed(true);
      }
    })();
    return () => { disposed = true; cleanup(); };
  }, [mounted]);

  // 3D bleibt immer Volumen; Profil/Explosion sind starre 2D-Overlays darüber
  useEffect(() => { apiRef.current?.setMode("solid"); }, [mode, ready]);

  const is2D = mode !== "solid";

  const MODES: { k: ViewMode; l: string }[] = [];

  return (
    <div className="lnd-viewer-box" ref={wrapRef}>
      <div className="lnd-viewer-modes">
        {MODES.map((o) => (
          <button key={o.k} className={`lnd-viewer-mode${mode === o.k ? " is-active" : ""}`} onClick={() => setMode(o.k)}>
            {o.l}
          </button>
        ))}
      </div>
      <div className="lnd-viewer-stage" ref={hostRef}>
        {!ready && !failed && (
          <div className="lnd-viewer-overlay"><span className="lnd-viewer-spinner" />Modell wird geladen…</div>
        )}
        {failed && (
          <div className="lnd-viewer-overlay">3D-Ansicht in diesem Browser nicht verfügbar.</div>
        )}
        {mode === "zeichnung" && (
          <div className="lnd-p2d-wrap">
            <TechnicalDrawing />
          </div>
        )}
        {(mode === "profil" || mode === "explosion") && (
          <div className="lnd-p2d-wrap">
            <Profile2D mode={mode as "profil" | "explosion"} />
          </div>
        )}
      </div>
    </div>
  );
}

export default function LandingPage() {
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://app.vinyos.de";
  const go = (next?: string) => {
    window.location.href = next
      ? `${APP_URL}/login?next=${encodeURIComponent(next)}`
      : `${APP_URL}/login`;
  };
  const goPlan = (plan: "starter" | "pro" | "enterprise", mode: "trial" | "direct") =>
    go(`/einstellungen/tarif?plan=${plan}&mode=${mode}`);

  const heroRef = useRef<HTMLElement>(null);
  const ctaActionsRef = useRef<HTMLDivElement>(null);
  const [heroIn, setHeroIn] = useState(false);
  const [cycle, setCycle] = useState(0);
  const [reduced, setReduced] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [heroPassed, setHeroPassed] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState(false);
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactSubject, setContactSubject] = useState("Demo anfragen");
  const [contactMsg, setContactMsg] = useState("");
  const [contactState, setContactState] = useState<"idle" | "sending" | "done" | "error">("idle");

  const CALENDLY_URL = "https://calendly.com/kontakt-vinyos/30min?background_color=faf9f5&text_color=141413&primary_color=3f7d7b";

  const openCalendly = () => {
    (window as any).Calendly?.initPopupWidget({ url: CALENDLY_URL });
  };

  useEffect(() => {
    if (!document.querySelector('link[href*="calendly.com/assets"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://assets.calendly.com/assets/external/widget.css";
      document.head.appendChild(link);
    }
    if (!document.querySelector('script[src*="calendly.com/assets"]')) {
      const script = document.createElement("script");
      script.src = "https://assets.calendly.com/assets/external/widget.js";
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  const sendContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactState("sending");
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: contactName, email: contactEmail, subject: contactSubject, message: contactMsg }),
    });
    setContactState(res.ok ? "done" : "error");
  };

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const node = heroRef.current;
    if (!node) { setHeroIn(true); return; }
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setHeroIn(true); obs.disconnect(); } }, { threshold: 0.1 });
    obs.observe(node);
    return () => obs.disconnect();
  }, []);

  // CTA-Proximity-Glow: je näher der Cursor dem Button kommt, desto stärker leuchtet er.
  // Distanz Cursor → Button-Mitte wird auf die CSS-Variable --cta-glow (0…1) gemappt.
  useEffect(() => {
    const el = ctaActionsRef.current;
    if (!el) return;
    const panel = el.closest(".lnd-cta-panel") ?? el; // Bezugsrechteck für die Reichweite
    let raf = 0;
    let pending: { x: number; y: number } | null = null;
    const apply = () => {
      raf = 0;
      if (!pending) return;
      const pr = panel.getBoundingClientRect();
      // Außerhalb des Panels: kein Glow → er startet exakt am Rand des Rechtecks.
      if (pending.x < pr.left || pending.x > pr.right || pending.y < pr.top || pending.y > pr.bottom) {
        el.style.setProperty("--cta-glow", "0");
        return;
      }
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dist = Math.hypot(pending.x - cx, pending.y - cy);
      // Reichweite = Distanz Button-Mitte → entfernteste Panel-Ecke (am Rand ⇒ t≈0, am Button ⇒ t=1)
      const reach = Math.max(
        Math.hypot(pr.left - cx, pr.top - cy),
        Math.hypot(pr.right - cx, pr.top - cy),
        Math.hypot(pr.left - cx, pr.bottom - cy),
        Math.hypot(pr.right - cx, pr.bottom - cy),
      );
      const t = reach > 0 ? Math.max(0, 1 - dist / reach) : 0;
      // Floor = sichtbare Grund-Aufhellung, sobald der Cursor im Panel ist; quadratisch nach oben bis zum Button.
      const FLOOR = 0.22;
      const glow = FLOOR + (1 - FLOOR) * t * t;
      el.style.setProperty("--cta-glow", glow.toFixed(3));
    };
    const onMove = (e: PointerEvent) => {
      pending = { x: e.clientX, y: e.clientY };
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        window.addEventListener("pointermove", onMove, { passive: true });
      } else {
        window.removeEventListener("pointermove", onMove);
        el.style.setProperty("--cta-glow", "0");
      }
    }, { threshold: 0 });
    io.observe(el);
    return () => {
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Scan-Loop: alle 7,5 s neu starten
  useEffect(() => {
    if (reduced || !heroIn) return;
    const id = setInterval(() => setCycle((c) => c + 1), 7500);
    return () => clearInterval(id);
  }, [reduced, heroIn]);

  // Body-Scroll-Lock, solange das Mobile-Menü offen ist
  useEffect(() => {
    document.body.style.overflow = navOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [navOpen]);

  // Sticky-CTA (mobil) einblenden, sobald der Hero aus dem Blick gescrollt ist
  useEffect(() => {
    const node = heroRef.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      ([e]) => setHeroPassed(!e.isIntersecting),
      { threshold: 0 }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <style>{CSS}</style>
      <div className="lnd-root">

        {/* ───────── NAVBAR ───────── */}
        <nav className="lnd-nav">
          <div className="lnd-nav-inner">
            <div className="lnd-logo">
              <span className="lnd-logo-name">VINYOS</span>
              <span className="lnd-logo-sep">⟂</span>
              <span className="lnd-logo-product">QUOTE</span>
            </div>
            <div className="lnd-nav-links">
              <a href="#funktionen" className="lnd-nav-link">Funktionen</a>
              <a href="#praezision" className="lnd-nav-link">Präzision</a>
              <a href="#kalkulation" className="lnd-nav-link">Kalkulation</a>
              <a href="#preise" className="lnd-nav-link">Preise</a>
              <a href="#kontakt" className="lnd-nav-link">Kontakt</a>
            </div>
            <ThemeToggle />
            <button className="lnd-btn-demo-nav" onClick={openCalendly}>Demo buchen</button>
            <button className="lnd-btn-nav" onClick={() => go()}>Kostenlos testen</button>
            <button
              className="lnd-nav-burger"
              aria-label={navOpen ? "Menü schließen" : "Menü öffnen"}
              aria-expanded={navOpen}
              onClick={() => setNavOpen((v) => !v)}
            >
              {navOpen ? (
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M5 5l12 12M17 5L5 17" /></svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M3 6h16M3 11h16M3 16h16" /></svg>
              )}
            </button>
          </div>
          <div className="lnd-nav-drawer" data-open={navOpen}>
            <a href="#funktionen" className="lnd-nav-drawer-link" onClick={() => setNavOpen(false)}>Funktionen</a>
            <a href="#praezision" className="lnd-nav-drawer-link" onClick={() => setNavOpen(false)}>Präzision</a>
            <a href="#kalkulation" className="lnd-nav-drawer-link" onClick={() => setNavOpen(false)}>Kalkulation</a>
            <a href="#preise" className="lnd-nav-drawer-link" onClick={() => setNavOpen(false)}>Preise</a>
            <a href="#kontakt" className="lnd-nav-drawer-link" onClick={() => setNavOpen(false)}>Kontakt</a>
            <button className="lnd-btn-primary lnd-nav-drawer-cta" onClick={() => { setNavOpen(false); go(); }}>Kostenlos testen</button>
            <button className="lnd-btn-outline lnd-nav-drawer-cta" onClick={() => { setNavOpen(false); openCalendly(); }}>Demo buchen</button>
          </div>
        </nav>

        {/* ───────── HERO ───────── */}
        <section ref={heroRef} className={`lnd-hero${heroIn ? " lnd-hero--visible" : ""}`}>
          <div className="lnd-hero-dots" />
          <div className="lnd-hero-glow" />
          <div className="lnd-hero-inner">
            <div className="lnd-hero-grid">
              <div className="lnd-hero-left">
                <h1 className="lnd-hero-h1">
                  CNC-Drehteile kalkulieren —<br />
                  <span className="lnd-hero-h1-accent">in unter 60 Sekunden.</span>
                </h1>
                <p className="lnd-hero-sub">
                  Für CNC-Lohnfertiger im DACH-Raum: Zeichnung (PDF + STEP) hochladen, Geometrie und Toleranzen werden automatisch erkannt — und ein präziser Angebotspreis mit Ihren Stundensätzen berechnet.
                </p>
                <div className="lnd-hero-cta">
                  <button className="lnd-btn-primary" onClick={() => go()}>
                    Kostenlos testen
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M2 7h10M8 3l4 4-4 4" /></svg>
                  </button>
                  <button className="lnd-btn-ghost" onClick={openCalendly}>Demo buchen</button>
                </div>
              </div>

              {/* Zeichnungs-Scan-Card */}
              <div className="lnd-hero-right">
                <div className="lnd-draw-card">
                  <DrawingScan key={cycle} reduced={reduced} />
                </div>
              </div>
            </div>
          </div>
        </section>



        {/* ───────── PROBLEM ───────── */}
        <section className="lnd-section lnd-section--alt lnd-section--compact">
          <div className="lnd-section-inner">
            <Reveal className="lnd-section-head">
              <div className="lnd-label">Das Problem</div>
              <h2 className="lnd-section-h2">Kalkulation frisst Zeit, die Ihnen woanders fehlt.</h2>
              <p className="lnd-section-lead">
                Von Hand zu kalkulieren bindet Ihre besten Leute. Teil für Teil.
              </p>
            </Reveal>
            <div className="lnd-contrast">
              <div className="lnd-contrast-heads">
                <div className="lnd-contrast-head lnd-contrast-head--before">Heute, von Hand</div>
                <span />
                <div className="lnd-contrast-head lnd-contrast-head--after">Mit Vinyos</div>
              </div>
              <Reveal className="lnd-contrast-row lnd-contrast-row--metric">
                <div className="lnd-c-before lnd-c-metric">
                  <span className="lnd-c-x" aria-hidden>✕</span>
                  <span className="lnd-c-metric-body">
                    <span className="lnd-c-metric-num">Über 15 Minuten</span>
                  </span>
                </div>
                <div className="lnd-c-arrow" aria-hidden>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 8h11M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
                <div className="lnd-c-after lnd-c-metric">
                  <span className="lnd-c-check" aria-hidden>✓</span>
                  <span className="lnd-c-metric-body">
                    <span className="lnd-c-metric-num">Unter 60 Sekunden</span>
                  </span>
                </div>
              </Reveal>
              {PAINS.map((p, i) => (
                <Reveal key={i} delay={(i + 1) * 70} className="lnd-contrast-row">
                  <div className="lnd-c-before">
                    <span className="lnd-c-x" aria-hidden>✕</span>
                    <span>{p.pain}</span>
                  </div>
                  <div className="lnd-c-arrow" aria-hidden>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 8h11M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </div>
                  <div className="lnd-c-after">
                    <span className="lnd-c-check" aria-hidden>✓</span>
                    <span>{p.gain}</span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ───────── ABLAUF (Pipeline) ───────── */}
        <section className="lnd-section lnd-section--compact" id="funktionen">
          <div className="lnd-section-inner">
            <Reveal className="lnd-section-head">
              <div className="lnd-label">Der Ablauf</div>
              <h2 className="lnd-section-h2">So läuft ein Teil durch Vinyos.</h2>
            </Reveal>
            <Reveal className="lnd-flow">
              {/* Fortschrittslinie */}
              <div className="lnd-flow-track"><div className="lnd-flow-fill" /></div>
              <div className="lnd-flow-grid">

                {/* 01 — Upload */}
                <div className="lnd-flow-step">
                  <div className="lnd-flow-node" />
                  <div className="lnd-flow-meta">
                    <span className="lnd-flow-num">01</span>
                    <span className="lnd-flow-time">0 s</span>
                  </div>
                  <h3 className="lnd-flow-title">Hochladen</h3>
                  <div className="lnd-art">
                    <div className="lnd-art-file">
                      <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M8 1H3a.8.8 0 0 0-.8.8v9.4a.8.8 0 0 0 .8.8h7a.8.8 0 0 0 .8-.8V4z" /><path d="M8 1v3h3" /></svg>
                      welle_40h7.pdf
                    </div>
                    <div className="lnd-art-file">
                      <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M6.5 1l5 2.9v5.7l-5 2.9-5-2.9V3.9z" /><path d="M6.5 1v5.7M1.5 3.9l5 2.9 5-2.9" /></svg>
                      welle_40h7.step
                    </div>
                    <div className="lnd-art-status">
                      <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M2 5.5l2.5 2.5L9 3.5" /></svg>
                      + 11 weitere Teile · automatisch gepaart
                    </div>
                  </div>
                  <p className="lnd-flow-desc">Einzelne Teile oder ganze Ordner auf einmal hochladen — Vinyos paart PDF + STEP automatisch und verarbeitet alle parallel.</p>
                </div>

                {/* 02 — Analyse */}
                <div className="lnd-flow-step">
                  <div className="lnd-flow-node" />
                  <div className="lnd-flow-meta">
                    <span className="lnd-flow-num">02</span>
                    <span className="lnd-flow-time">~30 s</span>
                  </div>
                  <h3 className="lnd-flow-title">Alle parallel analysiert</h3>
                  <div className="lnd-art">
                    <div className="lnd-art-row"><span className="lnd-art-dot" />4 Segmente · 2 Bohrungen</div>
                    <div className="lnd-art-row"><span className="lnd-art-dot" />IT7 · Rz 6,3 · ⊥ 0,02 A</div>
                    <div className="lnd-art-row"><span className="lnd-art-dot" />Werkstoff C45 · ⌀45 Rohteil</div>
                  </div>
                  <p className="lnd-flow-desc">Jedes Teil wird einzeln und gleichzeitig ausgewertet — Geometrie, Toleranzen und Werkstoff, im 3D-Viewer prüfbar.</p>
                </div>

                {/* 03 — Freigabe */}
                <div className="lnd-flow-step">
                  <div className="lnd-flow-node" />
                  <div className="lnd-flow-meta">
                    <span className="lnd-flow-num">03</span>
                    <span className="lnd-flow-time">Ihre Entscheidung</span>
                  </div>
                  <h3 className="lnd-flow-title">Sie prüfen &amp; geben frei</h3>
                  <div className="lnd-art">
                    <div className="lnd-art-qty"><span>1 Stk</span><span className="lnd-art-price">103,70 €</span></div>
                    <div className="lnd-art-qty"><span>10 Stk</span><span className="lnd-art-price">18,27 €</span></div>
                    <div className="lnd-art-qty"><span>50 Stk</span><span className="lnd-art-price">14,05 €</span></div>
                    <div className="lnd-art-status">
                      <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M2 5.5l2.5 2.5L9 3.5" /></svg>
                      freigegeben · PDF exportiert
                    </div>
                  </div>
                  <p className="lnd-flow-desc">Maschine und Rohteil bestätigen, Preis freigeben — die Entscheidung bleibt bei Ihnen.</p>
                </div>

              </div>
            </Reveal>
          </div>
        </section>

        {/* ───────── PRÄZISION / GD&T ───────── */}
        <section className="lnd-section lnd-section--alt lnd-section--compact" id="praezision">
          <div className="lnd-section-inner">
            <Reveal className="lnd-section-head">
              <div className="lnd-label">Präzision</div>
              <h2 className="lnd-section-h2">Wir erkennen, was andere Tools übersehen.</h2>
              <p className="lnd-section-lead">
                14 Form- und Lagetoleranzen, ISO-Klassen und Oberflächenangaben — automatisch
                aus der Zeichnung extrahiert. Jedes Ergebnis prüfbar, jedes editierbar.
              </p>
            </Reveal>
            <div className="lnd-gdt-grid">
              {GDT_SYMBOLS.map((g, i) => (
                <Reveal key={g.kind} delay={(i % 7) * 60} className="lnd-gdt-tile">
                  <div className="lnd-gdt-icon"><GdtIcon kind={g.kind} /></div>
                  <span className="lnd-gdt-name">{g.name}</span>
                </Reveal>
              ))}
            </div>
            <Reveal delay={200} className="lnd-gdt-chips">
              {["ISO 2768", "IT5–IT13", "Rz / Ra je Segment", "Gewinde M / Tr", "Einzeltoleranzen", "Datumsbezüge A–C"].map((c) => (
                <span key={c} className="lnd-gdt-chip">{c}</span>
              ))}
            </Reveal>
          </div>
        </section>


        {/* ───────── KALKULATION ───────── */}
        <section className="lnd-section lnd-section--compact" id="kalkulation">
          <div className="lnd-section-inner">
            <div className="lnd-split lnd-split--rev">
              <Reveal className="lnd-split-text">
                <div className="lnd-label">Kalkulation</div>
                <h2 className="lnd-split-h2">Deterministische Engine.<br />Kein KI-Schätzwert.</h2>
                <p className="lnd-split-lead">
                  Schnittzeiten, Rüstkosten und Material werden physikalisch berechnet —
                  aufgeschlüsselt in 18+ Positionen, mit Ihren Stundensätzen und Ihrer Marge.
                </p>
                <div className="lnd-calc-meta">
                  <div className="lnd-calc-meta-item">
                    <span className="lnd-calc-meta-val">n = v<sub>c</sub>·1000 / π·D</span>
                    <span className="lnd-calc-meta-lab">Drehzahl je Schnitt</span>
                  </div>
                  <div className="lnd-calc-meta-item">
                    <span className="lnd-calc-meta-val">√(Stückzahl)</span>
                    <span className="lnd-calc-meta-lab">QS-Stichprobenlogik</span>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={150} className="lnd-calc-card">
                <div className="lnd-calc-card-head">
                  <span>Kostenaufschlüsselung</span>
                  <span className="lnd-calc-card-qty">C45 · ⌀40×80 · 10 Stk</span>
                </div>
                <div className="lnd-calc-bars">
                  {COST_BARS.map((b, i) => (
                    <RevealBar key={b.label} label={b.label} pct={b.pct} value={b.value} delay={i * 90} />
                  ))}
                </div>
                <div className="lnd-calc-total">
                  <span className="lnd-calc-total-lab">Verkaufspreis / Stk</span>
                  <span className="lnd-calc-total-val">18,27 €</span>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ───────── FEATURES ───────── */}
        <section className="lnd-section lnd-section--alt">
          <div className="lnd-section-inner">
            <Reveal className="lnd-section-head">
              <div className="lnd-label">Funktionen</div>
              <h2 className="lnd-section-h2">Ein Werkzeug für den ganzen Angebotsprozess.</h2>
            </Reveal>
            <div className="lnd-features">
              {FEATURES.map((f, i) => (
                <Reveal key={f.title} delay={(i % 3) * 80} className="lnd-feature">
                  <div className="lnd-feature-icon">{f.icon}</div>
                  <h3 className="lnd-feature-title">{f.title}</h3>
                  <p className="lnd-feature-desc">{f.desc}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ───────── STATS BAND ───────── */}
        <section className="lnd-band">
          <div className="lnd-band-glow" />
          <div className="lnd-band-inner">
            <Reveal className="lnd-band-item">
              <div className="lnd-band-val">&lt;60 s</div>
              <div className="lnd-band-lab">Analyse pro Teil</div>
            </Reveal>
            <Reveal delay={80} className="lnd-band-item">
              <div className="lnd-band-val"><CountUp end={84} /></div>
              <div className="lnd-band-lab">Werkstoffe mit Schnittdaten</div>
            </Reveal>
            <Reveal delay={160} className="lnd-band-item">
              <div className="lnd-band-val"><CountUp end={14} /></div>
              <div className="lnd-band-lab">GD&amp;T-Symbole erkannt</div>
            </Reveal>
            <Reveal delay={240} className="lnd-band-item">
              <div className="lnd-band-val"><CountUp end={18} suffix="+" /></div>
              <div className="lnd-band-lab">Kostenpositionen je Kalkulation</div>
            </Reveal>
          </div>
        </section>

        {/* ───────── PREISE ───────── */}
        <section className="lnd-section lnd-section--alt" id="preise">
          <div className="lnd-section-inner">
            <Reveal className="lnd-section-head">
              <div className="lnd-label">Preise</div>
              <h2 className="lnd-section-h2">Transparent. Ohne Überraschungen.</h2>
              <p className="lnd-section-lead">
                Eine manuelle Kalkulation kostet Sie ein Vielfaches an Arbeitszeit.
              </p>
            </Reveal>
            <div className="lnd-pricing">
              <Reveal className="lnd-plan">
                <div className="lnd-plan-badge lnd-plan-badge--free">1. Monat gratis</div>
                <div className="lnd-plan-head">
                  <div className="lnd-plan-name">Starter</div>
                  <div className="lnd-plan-price"><span className="lnd-plan-amount">189 €</span><span className="lnd-plan-period">/ Monat</span></div>
                  <p className="lnd-plan-sub">150 Anfragen/Monat · 1. Monat kostenfrei · monatlich kündbar.</p>
                </div>
                <div className="lnd-plan-cta">
                  <button className="lnd-plan-btn lnd-plan-btn--featured" onClick={() => goPlan("starter", "trial")}>Gratis testen</button>
                  <button className="lnd-plan-btn" onClick={() => goPlan("starter", "direct")}>Direkt buchen</button>
                </div>
                <ul className="lnd-plan-items">
                  <PlanItem on>150 Anfragen / Monat inklusive</PlanItem>
                  <PlanItem on>Weitere Anfragen: 1,00 €</PlanItem>
                  <PlanItem on>Vollständige KI-Analyse</PlanItem>
                  <PlanItem on>3D-Viewer &amp; PDF-Export</PlanItem>
                  <PlanItem on>Unbegrenzte Maschinen</PlanItem>
                  <PlanItem on>Team-Mitglieder</PlanItem>
                </ul>
              </Reveal>

              <Reveal delay={90} className="lnd-plan lnd-plan--featured">
                <div className="lnd-plan-badge">Empfohlen</div>
                <div className="lnd-plan-head">
                  <div className="lnd-plan-name">Pro</div>
                  <div className="lnd-plan-price"><span className="lnd-plan-amount">349 €</span><span className="lnd-plan-period">/ Monat</span></div>
                  <p className="lnd-plan-sub">350 Anfragen/Monat · effektiv 1,00 € pro Anfrage · monatlich kündbar.</p>
                </div>
                <div className="lnd-plan-cta">
                  <button className="lnd-plan-btn lnd-plan-btn--featured" onClick={() => goPlan("pro", "direct")}>Direkt buchen</button>
                </div>
                <ul className="lnd-plan-items">
                  <PlanItem on>350 Anfragen / Monat inklusive</PlanItem>
                  <PlanItem on>Weitere Anfragen: 1,00 €</PlanItem>
                  <PlanItem on>Vollständige KI-Analyse</PlanItem>
                  <PlanItem on>3D-Viewer &amp; PDF-Export</PlanItem>
                  <PlanItem on>Unbegrenzte Maschinen</PlanItem>
                  <PlanItem on>Team-Mitglieder</PlanItem>
                </ul>
              </Reveal>

              <Reveal delay={180} className="lnd-plan">
                <div className="lnd-plan-head">
                  <div className="lnd-plan-name">Enterprise</div>
                  <div className="lnd-plan-price"><span className="lnd-plan-amount">579 €</span><span className="lnd-plan-period">/ Monat</span></div>
                  <p className="lnd-plan-sub">700 Anfragen/Monat · effektiv 0,83 € pro Anfrage · monatlich kündbar.</p>
                </div>
                <div className="lnd-plan-cta">
                  <button className="lnd-plan-btn lnd-plan-btn--featured" onClick={() => goPlan("enterprise", "direct")}>Direkt buchen</button>
                </div>
                <ul className="lnd-plan-items">
                  <PlanItem on>700 Anfragen / Monat inklusive</PlanItem>
                  <PlanItem on>Weitere Anfragen: 1,00 €</PlanItem>
                  <PlanItem on>Vollständige KI-Analyse</PlanItem>
                  <PlanItem on>3D-Viewer &amp; PDF-Export</PlanItem>
                  <PlanItem on>Unbegrenzte Maschinen</PlanItem>
                  <PlanItem on>Prioritäts-Support</PlanItem>
                </ul>
              </Reveal>
            </div>
            <Reveal>
              <p className="lnd-pricing-note" style={{ marginTop: "28px" }}>Mehr als 700 Anfragen/Monat oder individuelle Anforderungen? <strong>Custom-Tarife auf Anfrage.</strong></p>
            </Reveal>
          </div>
        </section>

        {/* ───────── CTA-BAND ───────── */}
        <section className="lnd-cta-band">
          <div className="lnd-cta-band-inner">
            <div>
              <h2 className="lnd-cta-band-h2">In Sekunden zum ersten kalkulierten Teil.</h2>
              <p className="lnd-cta-band-sub">1. Monat gratis — keine Kreditkarte, keine Einrichtung.</p>
            </div>
            <div className="lnd-cta-actions" ref={ctaActionsRef}>
              <button className="lnd-btn-white" onClick={() => go()}>
                Kostenlos testen
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M2 7h10M8 3l4 4-4 4" /></svg>
              </button>
            </div>
          </div>
        </section>

        {/* ───────── FAQ + KONTAKT ───────── */}
        <section className="lnd-bottom" id="kontakt">
          <div className="lnd-bottom-inner">

            {/* FAQ — Trennlinien-Stil */}
            <Reveal className="lnd-bottom-col">
              <div className="lnd-label">FAQ</div>
              <h2 className="lnd-bottom-h">Häufige Fragen</h2>
              <div className="lnd-faq-lines">
                {[
                  { q: "Welche Dateiformate werden unterstützt?", a: "Vinyos verarbeitet technische Zeichnungen als PDF und 3D-Modelle im STEP-Format (.stp / .step). PDF + STEP werden automatisch als Paar erkannt, wenn der Dateiname übereinstimmt." },
                  { q: "Wie genau ist die Kalkulation?", a: "Die Engine berechnet Schnittzeiten, Rüstkosten und Material physikalisch — keine KI-Schätzwerte. Sie hinterlegen Ihre eigenen Stundensätze, Maschinensätze und Marge. Das Ergebnis ist ein Vorschlag, den Sie vor der Freigabe prüfen und anpassen können." },
                  { q: "Sind meine Zeichnungen und Daten sicher?", a: "Ja. Alle Daten werden ausschließlich in der EU (Frankfurt, AWS eu-central-1) gespeichert. Ihre Zeichnungen werden nicht zum Training von KI-Modellen verwendet. DSGVO-konform." },
                  { q: "Was ist eine Anfrage genau?", a: "Eine Anfrage = ein Teil (PDF + STEP-Paar). Mehrere Stückzahlen für dasselbe Teil zählen als eine Anfrage." },
                  { q: "Kann ich Vinyos mit meinem Team nutzen?", a: "Ja. Teammitglieder teilen sich Anfragen, Angebote und Einstellungen — mit rollenbasiertem Zugriff (Admin, Kalkulator). Verfügbar in allen Tarifen." },
                ].map(({ q, a }, i) => (
                  <details key={i} className="lnd-fql-item">
                    <summary className="lnd-fql-q">
                      {q}
                      <svg className="lnd-fql-chevron" width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M4 6l4 4 4-4" /></svg>
                    </summary>
                    <p className="lnd-fql-a">{a}</p>
                  </details>
                ))}

              </div>
            </Reveal>

            {/* 3D-Viewer */}
            <Reveal delay={100} className="lnd-bottom-col lnd-bottom-viewer">
              <PartViewer />
            </Reveal>

          </div>
        </section>

        {/* ───────── KONTAKT ───────── */}
        <section id="kontakt" className="lnd-contact-wrap">
          <Reveal className="lnd-contact-inner">
            <h2 className="lnd-contact-h2">Noch Fragen?</h2>
            <p className="lnd-contact-sub">Buchen Sie eine Live-Demo oder schreiben Sie uns — wir antworten meist innerhalb eines Werktages.</p>
            <div className="lnd-contact-demo">
              <button className="lnd-btn-primary lnd-contact-demo-btn" onClick={openCalendly}>
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="2" y="3" width="11" height="10" rx="1.5" /><path d="M5 2v2M10 2v2M2 6h11" /></svg>
                Demo buchen — 30 Min.
              </button>
              <span className="lnd-contact-demo-hint">Kostenlos · Kein Skript · Ihr echter Anwendungsfall</span>
            </div>
            <div className="lnd-contact-divider">
              <span>oder schreiben Sie uns</span>
            </div>
            {contactState === "done" ? (
              <div className="lnd-contact-success">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="20" cy="20" r="18" /><path d="M12 20l6 6 10-12" /></svg>
                <h3>Nachricht gesendet!</h3>
                <p>Wir melden uns so schnell wie möglich.</p>
                <button className="lnd-btn-primary" onClick={() => setContactState("idle")}>Weitere Nachricht senden</button>
              </div>
            ) : (
              <form className="lnd-contact-form" onSubmit={sendContact}>
                <div className="lnd-contact-row">
                  <label>Name<input type="text" value={contactName} onChange={(e) => setContactName(e.target.value)} placeholder="Max Mustermann" required disabled={contactState === "sending"} /></label>
                  <label>E-Mail<input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} placeholder="name@firma.de" required disabled={contactState === "sending"} /></label>
                </div>
                <label>Betreff
                  <select value={contactSubject} onChange={(e) => setContactSubject(e.target.value)} disabled={contactState === "sending"}>
                    <option value="Demo anfragen">Demo anfragen</option>
                    <option value="Frage zum Produkt">Frage zum Produkt</option>
                    <option value="Preise & Pläne">Preise &amp; Pläne</option>
                    <option value="Sonstiges">Sonstiges</option>
                  </select>
                </label>
                <label>Nachricht<textarea value={contactMsg} onChange={(e) => setContactMsg(e.target.value)} placeholder="Ihre Frage oder Nachricht…" rows={4} required disabled={contactState === "sending"} /></label>
                {contactState === "error" && (
                  <p className="lnd-contact-error">Fehler beim Senden. Bitte schreiben Sie direkt an <a href="mailto:kontakt@vinyos.de">kontakt@vinyos.de</a>.</p>
                )}
                <button className="lnd-btn-primary lnd-contact-submit" type="submit" disabled={contactState === "sending"}>
                  {contactState === "sending" ? "Wird gesendet…" : "Nachricht senden"}
                  {contactState !== "sending" && <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M2 7h10M8 3l4 4-4 4" /></svg>}
                </button>
              </form>
            )}
          </Reveal>
        </section>

        {/* ───────── FOOTER ───────── */}
        <footer className="lnd-footer">
          <div className="lnd-footer-inner">
            <div className="lnd-logo">
              <span className="lnd-logo-name">VINYOS</span>
              <span className="lnd-logo-sep">⟂</span>
              <span className="lnd-logo-product">QUOTE</span>
            </div>
            <div className="lnd-footer-links">
              <a href="/impressum">Impressum</a>
              <a href="/datenschutz">Datenschutz</a>
              <a href="/agb">AGB</a>
              <a href="#kontakt">Kontakt</a>
            </div>
            <div className="lnd-footer-copy">© 2026 Vinyos AI UG</div>
          </div>
        </footer>

        {/* ───────── STICKY CTA (mobil) ───────── */}
        <div className="lnd-sticky-cta" data-show={heroPassed && !navOpen}>
          <div className="lnd-sticky-cta-inner">
            <span className="lnd-sticky-cta-txt">1. Monat gratis testen</span>
            <button className="lnd-btn-primary" onClick={() => go()}>
              Starten
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M2 7h10M8 3l4 4-4 4" /></svg>
            </button>
          </div>
        </div>

      </div>
    </>
  );
}

/* ────────────────────────────────────────────────
   Kostenbalken mit Reveal-Animation
──────────────────────────────────────────────── */
function RevealBar({ label, pct, value, delay }: { label: string; pct: number; value: string; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setShown(true); obs.disconnect(); } }, { threshold: 0.3 });
    obs.observe(node);
    return () => obs.disconnect();
  }, []);
  return (
    <div className="lnd-calc-bar" ref={ref}>
      <div className="lnd-calc-bar-top">
        <span className="lnd-calc-bar-lab">{label}</span>
        <span className="lnd-calc-bar-val">{value}</span>
      </div>
      <div className="lnd-calc-bar-track">
        <div className="lnd-calc-bar-fill" style={{ width: shown ? `${pct}%` : "0%", transitionDelay: `${delay}ms` }} />
      </div>
    </div>
  );
}

function PlanItem({ on, children }: { on?: boolean; children: React.ReactNode }) {
  return (
    <li className={`lnd-plan-item${on ? " lnd-plan-item--on" : " lnd-plan-item--off"}`}>
      {on
        ? <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M2.5 7l3 3 6-6" /></svg>
        : <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M4 4l6 6M10 4l-6 6" /></svg>}
      {children}
    </li>
  );
}


/* ────────────────────────────────────────────────
   Daten
──────────────────────────────────────────────── */
const PAINS = [
  {
    pain: "Kalkulationsaufwand verlorener Aufträge belasten die Marge.",
    gain: "Verlorene Aufträge belasten nicht zusätzlich.",
  },
  {
    pain: "Individuelle Erfahrung und Bauchgefühl. Ein Teil, viele Preise.",
    gain: "Regelbasiert und konsistent für jeden Auftrag.",
  },
  {
    pain: "Anfragen stapeln sich, Fristen verstreichen.",
    gain: "Angebot am selben Tag führt zu mehr Anfragen und Aufträgen.",
  },
];

const COST_BARS = [
  { label: "Maschinenzeit", pct: 32, value: "5,84 €" },
  { label: "Rüstzeit (anteilig)", pct: 24, value: "4,39 €" },
  { label: "Material / Rohteil", pct: 16, value: "2,92 €" },
  { label: "QS & Prüfung", pct: 9, value: "1,64 €" },
  { label: "Nachbehandlung", pct: 5, value: "0,91 €" },
  { label: "Gemeinkosten & Marge", pct: 14, value: "2,57 €" },
];

const FEATURES = [
  {
    title: "Interaktiver 3D-Viewer",
    desc: "STEP-Modell im Browser drehen und prüfen — Klick aufs Segment hebt es im 3D hervor.",
    icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M10 2l7 4v8l-7 4-7-4V6z" /><path d="M10 2v8M3 6l7 4 7-4" /></svg>,
  },
  {
    title: "84 Werkstoffe, eine Quelle",
    desc: "Von C45 bis Ti-6Al-4V — mit Dichte, Schnittdaten und Preis, identisch in Frontend und Engine.",
    icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4"><rect x="3" y="3" width="14" height="14" rx="1" /><path d="M3 8h14M8 3v14" /></svg>,
  },
  {
    title: "Eigene Maschinen & Sätze",
    desc: "Stundensätze, Rüstzeiten, Gemeinkosten und Marge einmal hinterlegen — jede Kalkulation rechnet damit.",
    icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4"><circle cx="10" cy="10" r="3" /><path d="M10 1v3M10 16v3M1 10h3M16 10h3M3.5 3.5l2 2M14.5 14.5l2 2M16.5 3.5l-2 2M5.5 14.5l-2 2" /></svg>,
  },
  {
    title: "Kundennormen mit PDF-Import",
    desc: "Norm-PDF hochladen, KI liest Toleranz- und Prüfvorgaben aus — automatisch auf Anfragen angewendet.",
    icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M12 2H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V6z" /><path d="M12 2v4h4M7 11h6M7 14h4" /></svg>,
  },
  {
    title: "Mengenstaffeln & Angebots-PDF",
    desc: "Mehrere Stückzahlen auf einen Klick, Rüstkosten degressiv verteilt — fertiges PDF mit Ihrem Logo.",
    icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M3 17V9M8 17V5M13 17v-6M18 17V3" strokeLinecap="round" /></svg>,
  },
  {
    title: "Team, Rollen & Analytics",
    desc: "Mehrere Kalkulatoren, geteilte Daten, rollenbasierter Zugriff — plus Auswertungen zur Erfolgsrate.",
    icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4"><circle cx="7" cy="7" r="3" /><circle cx="14" cy="7" r="3" /><path d="M1 18c0-2.8 2.7-5 6-5M10 18c0-2.8 2.7-5 6-5" /></svg>,
  },
];

const CSS = `
  :root {
    --lnd-bg:        #faf9f5;
    --lnd-bg-alt:    #f4f2ea;
    --lnd-surface:   #ffffff;
    --lnd-elevated:  #ffffff;
    --lnd-border:    #e8e6dc;
    --lnd-border-s:  #b0aea5;
    --lnd-rule:      #e8e6dc;
    --lnd-accent:    #3f7d7b;
    --lnd-accent-h:  #336463;
    --lnd-accent-rgb: 63 125 123;
    --lnd-bg-rgb:     250 249 245;
    --lnd-danger:     #b3534c;
    --lnd-danger-rgb: 179 83 76;
    --lnd-accent-bg: rgb(var(--lnd-accent-rgb) / 0.08);
    --lnd-accent-b:  rgb(var(--lnd-accent-rgb) / 0.22);
    --lnd-t1:        #141413;
    --lnd-t2:        #57564f;
    --lnd-t3:        #8a8980;
    --lnd-t4:        #b0aea5;
    --lnd-tx:        #141413;
    --lnd-success:   #788c5d;
    --lnd-f-display: 'Poppins','IBM Plex Sans',system-ui,sans-serif;
    --lnd-f-ui:      'Poppins','IBM Plex Sans',system-ui,sans-serif;
    --lnd-f-body:    'Lora',Georgia,serif;
    --lnd-f-mono:    'IBM Plex Mono',ui-monospace,monospace;
  }
  :root[data-theme="dark"] {
    --lnd-bg:        #141413;
    --lnd-bg-alt:    #1f1e1c;
    --lnd-surface:   #1f1e1c;
    --lnd-elevated:  #26241f;
    --lnd-border:    #2a2926;
    --lnd-border-s:  #3a3833;
    --lnd-rule:      #2a2926;
    --lnd-accent:    #6fb3b1;
    --lnd-accent-h:  #8cc5c3;
    --lnd-accent-rgb: 111 179 177;
    --lnd-bg-rgb:     20 20 19;
    --lnd-danger:     #cf6b63;
    --lnd-danger-rgb: 207 107 99;
    --lnd-t1:        #faf9f5;
    --lnd-t2:        #c4c2b8;
    --lnd-t3:        #8a8980;
    --lnd-t4:        #57564f;
    --lnd-tx:        #faf9f5;
    --lnd-success:   #9ab87a;
  }
  html, body { background: var(--lnd-bg); scroll-behavior: smooth; }
  .lnd-root {
    min-height: 100vh; font-family: var(--lnd-f-ui);
    font-size: 15px; line-height: 1.6; color: var(--lnd-t1);
    -webkit-font-smoothing: antialiased;
    overflow-x: clip;
  }

  /* STICKY CTA (nur mobil sichtbar, siehe Media-Queries) */
  .lnd-sticky-cta { display: none; }

  /* REVEAL */
  .lnd-reveal {
    opacity: 0; transform: translateY(24px);
    transition: opacity 0.7s cubic-bezier(.22,.68,0,1), transform 0.7s cubic-bezier(.22,.68,0,1);
  }
  .lnd-reveal.is-in { opacity: 1; transform: translateY(0); }
  @media (prefers-reduced-motion: reduce) {
    .lnd-reveal { opacity: 1; transform: none; transition: none; }
  }

  /* NAV */
  .lnd-nav {
    position: sticky; top: 0; z-index: 50;
    background: rgb(var(--lnd-bg-rgb) /0.88);
    backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
    border-bottom: 1px solid var(--lnd-rule);
  }
  .lnd-nav-inner {
    max-width: 1100px; margin: 0 auto; padding: 0 32px; height: 60px;
    display: flex; align-items: center; gap: 8px;
  }
  .lnd-nav-links { display: flex; gap: 4px; flex: 1; margin-left: 24px; }
  .lnd-nav-link {
    padding: 6px 12px; font-size: 13px; color: var(--lnd-t2);
    text-decoration: none; border-radius: 2px; transition: color 120ms;
  }
  .lnd-nav-link:hover { color: var(--lnd-tx); }

  /* MOBILE-NAV (Burger + Drawer) — Default versteckt, erst <960px aktiv */
  .lnd-nav-burger {
    display: none; align-items: center; justify-content: center;
    width: 44px; height: 44px; margin-right: -10px; flex-shrink: 0;
    background: transparent; border: 0; color: var(--lnd-t1); cursor: pointer;
  }
  .lnd-nav-drawer { display: none; }

  /* LOGO */
  .lnd-logo { display: flex; align-items: baseline; flex-shrink: 0; }
  .lnd-logo-name { font-family: var(--lnd-f-display); font-size: 13px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--lnd-tx); }
  .lnd-logo-sep { color: var(--lnd-accent); font-size: 15px; margin: 0 5px; }
  .lnd-logo-product { font-family: var(--lnd-f-display); font-size: 13px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--lnd-t2); }

  /* BUTTONS */
  .lnd-btn-primary {
    display: inline-flex; align-items: center; gap: 8px; height: 44px; padding: 0 22px;
    background: var(--lnd-accent); color: #fff; border: 0; border-radius: 2px;
    font: 600 14px/1 var(--lnd-f-ui); cursor: pointer; white-space: nowrap;
    transition: background 120ms, transform 120ms, box-shadow 120ms;
  }
  .lnd-btn-primary:hover { background: var(--lnd-accent-h); transform: translateY(-1px); box-shadow: 0 8px 24px rgb(var(--lnd-accent-rgb) /0.25); }
  .lnd-btn-outline {
    display: inline-flex; align-items: center; height: 36px; padding: 0 16px;
    background: transparent; border: 1px solid var(--lnd-border-s); color: var(--lnd-t1);
    border-radius: 2px; font: 500 13px/1 var(--lnd-f-ui); cursor: pointer; white-space: nowrap;
    transition: border-color 120ms, color 120ms;
  }
  .lnd-btn-outline:hover { border-color: var(--lnd-accent); color: var(--lnd-tx); }
  .lnd-nav-signin {
    font: 500 13px/1 var(--lnd-f-ui); color: var(--lnd-t2); text-decoration: none;
    padding: 0 6px; flex-shrink: 0; transition: color 120ms;
  }
  .lnd-nav-signin:hover { color: var(--lnd-tx); }
  .lnd-btn-nav {
    display: inline-flex; align-items: center; height: 36px; padding: 0 16px;
    background: var(--lnd-accent); color: #fff; border: 0; border-radius: 2px;
    font: 600 13px/1 var(--lnd-f-ui); cursor: pointer; white-space: nowrap; flex-shrink: 0;
    transition: background 120ms;
  }
  .lnd-btn-nav:hover { background: var(--lnd-accent-h); }
  .lnd-theme-toggle {
    display: inline-flex; align-items: center; justify-content: center;
    width: 36px; height: 36px; flex-shrink: 0;
    background: transparent; border: 0; border-radius: 2px;
    color: var(--lnd-t2); cursor: pointer;
    transition: color 120ms, background 120ms;
  }
  .lnd-theme-toggle:hover { color: var(--lnd-accent); background: var(--lnd-accent-bg); }
  .lnd-btn-ghost {
    display: inline-flex; align-items: center; height: 44px; padding: 0 16px;
    color: var(--lnd-t2); font: 500 14px/1 var(--lnd-f-ui); text-decoration: none; transition: color 120ms;
  }
  .lnd-btn-ghost:hover { color: var(--lnd-tx); }

  /* ANIMATIONS */
  @keyframes cnc-pulse { 0%,100% { opacity: 0.25; } 50% { opacity: 1; } }
  @keyframes hero-intro { 0% { opacity: 0; transform: translateY(40px); filter: blur(10px); } 60% { filter: blur(0); } 100% { opacity: 1; transform: translateY(0); filter: blur(0); } }
  @keyframes hero-card { 0% { opacity: 0; transform: translateY(24px) scale(0.97); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
  @keyframes scan-move {
    0%   { left: 0; opacity: 0; }
    4%   { opacity: 1; }
    55%  { left: calc(100% - 2px); opacity: 1; }
    62%  { opacity: 0; }
    100% { left: calc(100% - 2px); opacity: 0; }
  }
  @keyframes de-on {
    to { color: var(--lnd-accent); filter: drop-shadow(0 0 5px rgb(var(--lnd-accent-rgb) /0.7)); }
  }
  @keyframes chip-in {
    0%   { opacity: 0; transform: translateY(8px) scale(0.92); }
    100% { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes price-in {
    0%   { opacity: 0; transform: scale(0.85); }
    60%  { transform: scale(1.06); }
    100% { opacity: 1; transform: scale(1); }
  }

  /* HERO */
  .lnd-hero { position: relative; overflow: hidden; padding: 84px 32px 92px; opacity: 0; min-height: 100vh; display: flex; flex-direction: column; justify-content: center; }
  .lnd-hero--visible { animation: hero-intro 0.9s cubic-bezier(.22,.68,0,1) forwards; }
  .lnd-hero-dots {
    position: absolute; inset: 0; pointer-events: none;
    background-image: radial-gradient(circle at 20% 20%, rgb(var(--lnd-accent-rgb) /0.07) 0.8px, transparent 1px), radial-gradient(circle at 80% 80%, rgb(var(--lnd-accent-rgb) /0.07) 0.8px, transparent 1px);
    background-size: 28px 28px;
  }
  .lnd-hero-glow {
    position: absolute; inset: 0; pointer-events: none;
    background: radial-gradient(ellipse 55% 45% at 70% 25%, rgb(var(--lnd-accent-rgb) /0.13) 0%, transparent 65%), radial-gradient(ellipse 40% 30% at 15% 85%, rgb(var(--lnd-accent-rgb) /0.06) 0%, transparent 60%);
    filter: blur(16px);
  }
  .lnd-hero-inner { position: relative; z-index: 1; max-width: 1100px; margin: 0 auto; }
  .lnd-hero-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: center; }
  .lnd-hero-left { display: flex; flex-direction: column; }
  .lnd-hero-badge {
    display: inline-flex; align-items: center; gap: 8px;
    font: 600 11px/1 var(--lnd-f-mono); letter-spacing: 0.14em; text-transform: uppercase;
    color: var(--lnd-t2); border: 1px solid var(--lnd-border-s); border-radius: 100px;
    padding: 6px 14px; margin-bottom: 28px; align-self: flex-start;
  }
  .lnd-hero-badge-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--lnd-accent); animation: cnc-pulse 3s ease-in-out infinite; }
  .lnd-hero-h1 { font: 700 50px/1.08 var(--lnd-f-display); color: var(--lnd-tx); margin: 0 0 20px; letter-spacing: -0.025em; }
  .lnd-hero-h1-accent { color: var(--lnd-accent); }
  .lnd-hero-sub { font-family: var(--lnd-f-body); font-size: 17px; color: var(--lnd-t2); max-width: 460px; margin: 0 0 32px; line-height: 1.7; }
  .lnd-hero-cta { display: flex; align-items: center; gap: 4px; margin-bottom: 36px; }
  .lnd-hero-stats { display: inline-flex; align-items: stretch; border: 1px solid var(--lnd-border); border-radius: 2px; overflow: hidden; background: var(--lnd-surface); align-self: flex-start; }
  .lnd-stat { padding: 14px 22px; }
  .lnd-stat-val { font: 600 23px/1 var(--lnd-f-mono); color: var(--lnd-tx); letter-spacing: -0.02em; margin-bottom: 5px; }
  .lnd-stat-unit { font-size: 14px; color: var(--lnd-t2); margin-left: 2px; }
  .lnd-stat-lab { font-size: 11px; color: var(--lnd-t3); }
  .lnd-stat-div { width: 1px; background: var(--lnd-border); }

  /* DRAWING SCAN CARD */
  .lnd-hero-right { display: flex; justify-content: flex-end; }
  .lnd-draw-card {
    width: 100%; max-width: 480px; background: var(--lnd-surface);
    border: 1px solid var(--lnd-border); border-radius: 3px;
    position: relative; overflow: hidden; padding: 24px 16px;
    animation: hero-card 0.8s cubic-bezier(.22,.68,0,1) 0.25s both;
  }
  .lnd-draw-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, var(--lnd-accent), transparent); opacity: 0.6; z-index: 2; }
  .lnd-draw-head {
    display: flex; justify-content: space-between; align-items: center;
    padding: 14px 18px; border-bottom: 1px solid var(--lnd-border);
  }
  .lnd-draw-head-file { font: 500 11px/1 var(--lnd-f-mono); color: var(--lnd-t2); letter-spacing: 0.02em; }
  .lnd-draw-head-tag {
    font: 600 9px/1 var(--lnd-f-mono); letter-spacing: 0.1em; text-transform: uppercase;
    color: var(--lnd-accent); background: var(--lnd-accent-bg); border: 1px solid var(--lnd-accent-b);
    border-radius: 100px; padding: 4px 10px;
  }
  .lnd-draw { position: relative; padding: 18px 18px 20px; }
  .lnd-draw-scanline {
    position: absolute; top: 18px; bottom: 96px; left: 0; width: 2px;
    background: linear-gradient(180deg, transparent, var(--lnd-accent) 25%, var(--lnd-accent) 75%, transparent);
    box-shadow: 0 0 14px rgb(var(--lnd-accent-rgb) /0.7);
    opacity: 0; z-index: 1; pointer-events: none;
    animation: scan-move 3.2s cubic-bezier(.4,0,.6,1) 0.2s forwards;
  }
  .lnd-draw-svg { width: 100%; height: auto; display: block; }
  .lnd-de-base { stroke: var(--lnd-t4); }
  .lnd-de { color: var(--lnd-t3); stroke: currentColor; }
  .lnd-de text { stroke: none; }
  .lnd-de-fill { fill: currentColor; stroke: none; }
  .lnd-draw-txt { font: 500 10px var(--lnd-f-mono); fill: currentColor; letter-spacing: 0.02em; }
  .lnd-de-1 { animation: de-on 0.5s ease forwards 0.7s; }
  .lnd-de-2 { animation: de-on 0.5s ease forwards 1.0s; }
  .lnd-de-5 { animation: de-on 0.5s ease forwards 1.3s; }
  .lnd-de-3 { animation: de-on 0.5s ease forwards 1.7s; }
  .lnd-de-4 { animation: de-on 0.5s ease forwards 2.1s; }
  .lnd-de-6 { animation: de-on 0.5s ease forwards 2.5s; }
  .lnd-draw-chips { display: flex; flex-wrap: wrap; gap: 7px; margin: 16px 0 0; min-height: 27px; }
  .lnd-draw-chip {
    display: inline-flex; align-items: center; gap: 6px;
    font: 500 11.5px/1 var(--lnd-f-mono); color: var(--lnd-t1);
    background: var(--lnd-elevated); border: 1px solid var(--lnd-border-s);
    border-radius: 2px; padding: 6px 10px;
    opacity: 0; animation: chip-in 0.4s cubic-bezier(.22,.68,0,1) forwards;
  }
  .lnd-draw-chip svg { color: var(--lnd-success); }
  .lnd-draw-foot {
    display: flex; justify-content: space-between; align-items: center;
    margin-top: 16px; padding-top: 14px; border-top: 1px solid var(--lnd-border);
  }
  .lnd-draw-timer { display: inline-flex; align-items: center; gap: 8px; font: 500 11px/1 var(--lnd-f-mono); color: var(--lnd-t2); letter-spacing: 0.04em; }
  .lnd-draw-timer-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--lnd-accent); animation: cnc-pulse 1.2s ease-in-out infinite; }
  .lnd-draw-price {
    display: inline-flex; align-items: baseline; gap: 8px;
    font: 700 20px/1 var(--lnd-f-mono); color: var(--lnd-accent); letter-spacing: -0.01em;
    opacity: 0; animation: price-in 0.5s cubic-bezier(.22,.68,0,1) forwards 3.4s;
  }
  .lnd-draw-price-lab { font: 500 10px/1 var(--lnd-f-mono); color: var(--lnd-t3); text-transform: uppercase; letter-spacing: 0.06em; }

  /* Statischer Endzustand (reduced motion) */
  .lnd-draw--static .lnd-draw-scanline { animation: none; opacity: 0; }
  .lnd-draw--static .lnd-de { animation: none; color: var(--lnd-accent); }
  .lnd-draw--static .lnd-draw-chip { animation: none; opacity: 1; }
  .lnd-draw--static .lnd-draw-price { animation: none; opacity: 1; }
  @media (prefers-reduced-motion: reduce) {
    .lnd-draw-scanline { animation: none; opacity: 0; }
    .lnd-de { animation: none; color: var(--lnd-accent); }
    .lnd-draw-chip, .lnd-draw-price { animation: none; opacity: 1; }
  }

  /* TRUST STRIP */
  .lnd-trust { border-top: 1px solid var(--lnd-rule); border-bottom: 1px solid var(--lnd-rule); background: var(--lnd-bg-alt); }
  .lnd-trust-inner { max-width: 1100px; margin: 0 auto; padding: 26px 32px; display: flex; align-items: center; gap: 28px; flex-wrap: wrap; }
  .lnd-trust-lab { font: 600 11px/1.4 var(--lnd-f-mono); letter-spacing: 0.08em; text-transform: uppercase; color: var(--lnd-t3); flex-shrink: 0; }
  .lnd-trust-tags { display: flex; gap: 8px; flex-wrap: wrap; }
  .lnd-trust-tag { font: 500 12px/1 var(--lnd-f-ui); color: var(--lnd-t2); border: 1px solid var(--lnd-border); border-radius: 100px; padding: 7px 14px; }

  /* SECTIONS */
  .lnd-section { padding: 96px 32px; min-height: 100vh; display: flex; flex-direction: column; justify-content: center; }
  .lnd-section--alt { background: var(--lnd-bg-alt); }
  .lnd-section--compact { min-height: unset; }
  .lnd-section-inner { max-width: 1100px; margin: 0 auto; }
  .lnd-section-head { text-align: center; margin-bottom: 52px; }
  .lnd-label { font: 600 11px/1 var(--lnd-f-mono); letter-spacing: 0.14em; text-transform: uppercase; color: var(--lnd-accent); margin-bottom: 14px; }
  .lnd-section-h2 { font: 700 36px/1.15 var(--lnd-f-display); color: var(--lnd-tx); margin: 0; letter-spacing: -0.01em; }
  .lnd-section-lead { font-family: var(--lnd-f-body); font-size: 17px; color: var(--lnd-t2); max-width: 620px; margin: 18px auto 0; line-height: 1.7; }

  /* PROBLEMS */
  /* PROBLEM — Vorher/Nachher-Kontrast */
  .lnd-contrast { display: flex; flex-direction: column; gap: 10px; margin-top: 8px; }
  .lnd-contrast-heads { display: grid; grid-template-columns: 1fr 52px 1fr; margin-bottom: 4px; }
  .lnd-contrast-head { font: 600 11px/1 var(--lnd-f-mono); letter-spacing: 0.1em; text-transform: uppercase; padding: 0 4px; }
  .lnd-contrast-head--before { color: var(--lnd-danger); }
  .lnd-contrast-head--after { color: var(--lnd-accent-h); }
  .lnd-contrast-row { display: grid; grid-template-columns: 1fr 52px 1fr; align-items: stretch; }
  .lnd-c-before, .lnd-c-after { display: flex; gap: 11px; padding: 17px 20px; border: 1px solid; border-radius: 2px; font-size: 14px; line-height: 1.5; transition: transform 160ms, border-color 160ms; }
  .lnd-c-before { background: rgb(var(--lnd-danger-rgb) /0.045); border-color: rgb(var(--lnd-danger-rgb) /0.16); color: var(--lnd-t2); }
  .lnd-c-after { background: var(--lnd-accent-bg); border-color: var(--lnd-accent-b); color: var(--lnd-t1); }
  .lnd-contrast-row:hover .lnd-c-after { border-color: var(--lnd-accent); transform: translateX(2px); }
  .lnd-c-x { color: var(--lnd-danger); font-weight: 700; flex-shrink: 0; }
  .lnd-c-check { color: var(--lnd-accent-h); font-weight: 700; flex-shrink: 0; }
  .lnd-c-metric { align-items: center; padding-top: 15px; padding-bottom: 15px; }
  .lnd-c-metric-body { display: flex; flex-direction: column; gap: 2px; }
  .lnd-c-metric-num { font: 700 22px/1.1 var(--lnd-f-mono); letter-spacing: -0.01em; }
  .lnd-c-before .lnd-c-metric-num { color: var(--lnd-danger); }
  .lnd-c-after .lnd-c-metric-num { color: var(--lnd-accent-h); }
  .lnd-c-metric-cap { font-size: 12px; color: var(--lnd-t3); }
  .lnd-c-arrow { display: flex; align-items: center; justify-content: center; color: var(--lnd-t4); }
  .lnd-contrast-row:hover .lnd-c-arrow { color: var(--lnd-accent); }
  .lnd-contrast-kicker { margin-top: 26px; text-align: center; font-size: 15px; color: var(--lnd-t2); line-height: 1.6; }
  .lnd-contrast-kicker strong { color: var(--lnd-tx); font-weight: 600; }

  /* ABLAUF — Pipeline */
  .lnd-flow { position: relative; padding-top: 5px; }
  .lnd-flow-track {
    position: absolute; top: 5px; left: calc(16.666% + 0px); right: calc(16.666% + 0px);
    height: 2px; background: var(--lnd-border); border-radius: 1px; overflow: hidden;
  }
  .lnd-flow-fill {
    height: 100%; width: 0;
    background: linear-gradient(90deg, var(--lnd-accent), var(--lnd-accent-h));
    transition: width 1.6s cubic-bezier(.22,.68,0,1) 0.4s;
  }
  .lnd-reveal.is-in .lnd-flow-fill { width: 100%; }
  .lnd-flow-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
  .lnd-flow-step { display: flex; flex-direction: column; }
  .lnd-flow-node {
    width: 12px; height: 12px; border-radius: 50%;
    background: var(--lnd-bg-alt); border: 2px solid var(--lnd-accent);
    margin: 0 auto 24px; position: relative; top: -10px;
    box-shadow: 0 0 10px rgb(var(--lnd-accent-rgb) /0.45);
  }
  .lnd-flow-meta { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 10px; }
  .lnd-flow-num { font: 600 11px/1 var(--lnd-f-mono); color: var(--lnd-accent); letter-spacing: 0.1em; }
  .lnd-flow-time { font: 500 10px/1 var(--lnd-f-mono); color: var(--lnd-t3); text-transform: uppercase; letter-spacing: 0.06em; }
  .lnd-flow-title { font: 600 16px/1.3 var(--lnd-f-display); color: var(--lnd-tx); margin: 0 0 14px; }
  .lnd-flow-desc { font-family: var(--lnd-f-body); font-size: 14px; color: var(--lnd-t2); line-height: 1.65; margin: 14px 0 0; }

  /* Mini-Artefakte */
  .lnd-art {
    background: var(--lnd-surface); border: 1px solid var(--lnd-border); border-radius: 2px;
    padding: 14px; display: flex; flex-direction: column; gap: 8px;
    flex: 1;
  }
  .lnd-art-file {
    display: flex; align-items: center; gap: 8px;
    font: 500 11.5px/1 var(--lnd-f-mono); color: var(--lnd-t1);
    background: var(--lnd-elevated); border: 1px solid var(--lnd-border);
    border-radius: 2px; padding: 8px 10px;
  }
  .lnd-art-file svg { color: var(--lnd-t3); flex-shrink: 0; }
  .lnd-art-row {
    display: flex; align-items: center; gap: 9px;
    font: 500 11.5px/1.4 var(--lnd-f-mono); color: var(--lnd-t1);
    padding: 5px 2px;
  }
  .lnd-art-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--lnd-accent); flex-shrink: 0; }
  .lnd-art-qty {
    display: flex; justify-content: space-between; align-items: baseline;
    font: 500 11.5px/1 var(--lnd-f-mono); color: var(--lnd-t2);
    padding: 5px 2px; border-bottom: 1px solid var(--lnd-border);
  }
  .lnd-art-price { color: var(--lnd-t1); font-weight: 600; }
  .lnd-art-status {
    display: flex; align-items: center; gap: 7px;
    font: 600 10.5px/1 var(--lnd-f-mono); color: var(--lnd-success);
    letter-spacing: 0.04em; padding-top: 2px;
  }
  .lnd-art-status svg { flex-shrink: 0; }

  /* GD&T GRID */
  .lnd-gdt-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 10px; margin-bottom: 28px; }
  .lnd-gdt-tile {
    background: var(--lnd-surface); border: 1px solid var(--lnd-border); border-radius: 2px;
    padding: 18px 10px 14px; text-align: center;
    display: flex; flex-direction: column; align-items: center; gap: 10px;
    transition: border-color 160ms, transform 160ms, background 160ms;
  }
  .lnd-gdt-tile:hover { border-color: var(--lnd-accent); background: var(--lnd-elevated); transform: translateY(-3px); }
  .lnd-gdt-tile:hover .lnd-gdt-icon { color: var(--lnd-accent-h); }
  .lnd-gdt-icon { color: var(--lnd-accent); display: flex; transition: color 160ms; }
  .lnd-gdt-name { font: 500 10.5px/1.3 var(--lnd-f-mono); color: var(--lnd-t2); letter-spacing: 0.01em; }
  .lnd-gdt-chips { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; }
  .lnd-gdt-chip {
    font: 500 12px/1 var(--lnd-f-mono); color: var(--lnd-t1);
    background: var(--lnd-elevated); border: 1px solid var(--lnd-border-s);
    border-radius: 100px; padding: 8px 16px;
  }
  .lnd-ainote { display: flex; gap: 12px; align-items: flex-start; margin-top: 28px; padding: 16px 18px; background: var(--lnd-accent-bg); border: 1px solid var(--lnd-accent-b); border-radius: 2px; font-size: 13px; color: var(--lnd-t2); line-height: 1.6; }
  .lnd-ainote svg { color: var(--lnd-accent); flex-shrink: 0; margin-top: 1px; }
  .lnd-ainote--center { max-width: 640px; margin-left: auto; margin-right: auto; justify-content: center; align-items: center; text-align: left; }

  /* 3D-VIEWER */
  .lnd-viewer-box {
    position: relative; background: var(--lnd-surface);
    border: 1px solid var(--lnd-border); border-radius: 3px; overflow: hidden;
  }
  .lnd-viewer-box::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, var(--lnd-accent), transparent); opacity: 0.6; z-index: 3;
  }
  .lnd-viewer-modes {
    position: absolute; top: 16px; left: 50%; transform: translateX(-50%); z-index: 5;
    display: flex; gap: 2px; padding: 4px;
    background: rgb(var(--lnd-bg-rgb) /0.72); border: 1px solid var(--lnd-border);
    border-radius: 100px; backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
  }
  .lnd-viewer-mode {
    border: 0; background: transparent; color: var(--lnd-t2);
    font: 600 12px/1 var(--lnd-f-ui); padding: 8px 16px; border-radius: 100px;
    cursor: pointer; transition: color 120ms, background 120ms;
  }
  .lnd-viewer-mode:hover { color: var(--lnd-tx); }
  .lnd-viewer-mode.is-active { background: var(--lnd-accent-h); color: #fff; }
  .lnd-viewer-stage {
    width: 100%; height: 460px; position: relative;
    background:
      radial-gradient(ellipse 50% 60% at 50% 45%, rgb(var(--lnd-accent-rgb) /0.10) 0%, transparent 70%),
      radial-gradient(circle at 20% 20%, rgb(var(--lnd-accent-rgb) /0.06) 0.8px, transparent 1px);
    background-size: auto, 26px 26px;
  }
  .lnd-viewer-stage canvas { display: block; position: relative; z-index: 1; }
  .lnd-viewer-overlay {
    position: absolute; inset: 0; z-index: 2;
    display: flex; align-items: center; justify-content: center; gap: 10px;
    color: var(--lnd-t3); font: 500 13px/1 var(--lnd-f-mono);
  }
  .lnd-viewer-spinner { width: 14px; height: 14px; border: 2px solid var(--lnd-border-s); border-top-color: var(--lnd-accent); border-radius: 50%; animation: vspin 0.8s linear infinite; }
  @keyframes vspin { to { transform: rotate(360deg); } }
  .lnd-viewer-hint {
    position: absolute; bottom: 14px; left: 50%; transform: translateX(-50%); z-index: 5;
    display: flex; align-items: center; gap: 7px;
    font: 500 11px/1 var(--lnd-f-mono); color: var(--lnd-t3);
    background: rgb(var(--lnd-bg-rgb) /0.6); border: 1px solid var(--lnd-border);
    border-radius: 100px; padding: 7px 12px;
  }
  .lnd-viewer-hint svg { color: var(--lnd-accent); }
  .lnd-p2d-wrap {
    position: absolute; inset: 0; z-index: 2; display: flex; align-items: center; justify-content: center;
    padding: 56px 24px 24px;
    background:
      radial-gradient(ellipse 60% 70% at 50% 48%, rgb(var(--lnd-accent-rgb) /0.08) 0%, transparent 72%),
      var(--lnd-surface);
  }
  .lnd-p2d-svg { width: 100%; height: 100%; }
  .lnd-td-svg { width: 100%; height: 100%; }
  @keyframes lnd-fade { from { opacity: 0; } to { opacity: 1; } }
  @media (prefers-reduced-motion: reduce) {
    .lnd-p2d-svg [style*="lnd-fade"] { animation: none !important; opacity: 1 !important; }
  }

  /* SPLIT */
  .lnd-split { display: grid; grid-template-columns: 1fr 1fr; gap: 56px; align-items: center; }
  .lnd-split--rev .lnd-split-text { order: 2; }
  .lnd-split-h2 { font: 700 34px/1.15 var(--lnd-f-display); color: var(--lnd-tx); margin: 14px 0 18px; letter-spacing: -0.02em; }
  .lnd-split-lead { font-family: var(--lnd-f-body); font-size: 16px; color: var(--lnd-t2); line-height: 1.75; margin: 0 0 24px; }

  /* CALC */
  .lnd-calc-meta { display: flex; gap: 14px; margin-top: 6px; }
  .lnd-calc-meta-item { flex: 1; background: var(--lnd-surface); border: 1px solid var(--lnd-border); border-radius: 2px; padding: 12px 14px; }
  .lnd-calc-meta-val { display: block; font: 600 13px/1.3 var(--lnd-f-mono); color: var(--lnd-accent); margin-bottom: 5px; }
  .lnd-calc-meta-val sub { font-size: 0.75em; }
  .lnd-calc-meta-lab { font: 500 11px/1.3 var(--lnd-f-mono); color: var(--lnd-t3); text-transform: uppercase; letter-spacing: 0.04em; }
  .lnd-calc-card { background: var(--lnd-surface); border: 1px solid var(--lnd-border); border-radius: 3px; padding: 26px 24px; }
  .lnd-calc-card-head { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 22px; font: 600 12px/1 var(--lnd-f-mono); letter-spacing: 0.06em; text-transform: uppercase; color: var(--lnd-t2); }
  .lnd-calc-card-qty { font-size: 10px; color: var(--lnd-t3); letter-spacing: 0.04em; }
  .lnd-calc-bars { display: flex; flex-direction: column; gap: 16px; }
  .lnd-calc-bar-top { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 7px; }
  .lnd-calc-bar-lab { font: 500 13px/1 var(--lnd-f-ui); color: var(--lnd-t1); }
  .lnd-calc-bar-val { font: 600 12px/1 var(--lnd-f-mono); color: var(--lnd-t2); }
  .lnd-calc-bar-track { height: 6px; background: var(--lnd-elevated); border-radius: 100px; overflow: hidden; }
  .lnd-calc-bar-fill { height: 100%; background: linear-gradient(90deg, var(--lnd-accent), var(--lnd-accent-h)); border-radius: 100px; width: 0; transition: width 1s cubic-bezier(.22,.68,0,1); }
  .lnd-calc-total { display: flex; justify-content: space-between; align-items: center; margin-top: 22px; padding-top: 20px; border-top: 1px solid var(--lnd-border); }
  .lnd-calc-total-lab { font: 600 12px/1 var(--lnd-f-mono); letter-spacing: 0.06em; text-transform: uppercase; color: var(--lnd-t2); }
  .lnd-calc-total-val { font: 700 26px/1 var(--lnd-f-mono); color: var(--lnd-accent); letter-spacing: -0.02em; }

  /* FEATURES */
  .lnd-features { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; border: 1px solid var(--lnd-border); border-radius: 2px; overflow: hidden; background: var(--lnd-border); }
  .lnd-feature { background: var(--lnd-surface); padding: 32px 28px; transition: background 160ms; }
  .lnd-feature:hover { background: var(--lnd-elevated); }
  .lnd-feature-icon { width: 40px; height: 40px; background: var(--lnd-accent-bg); border: 1px solid var(--lnd-accent-b); border-radius: 2px; display: flex; align-items: center; justify-content: center; color: var(--lnd-accent); margin-bottom: 18px; }
  .lnd-feature-title { font: 600 15px/1.3 var(--lnd-f-display); color: var(--lnd-tx); margin: 0 0 8px; }
  .lnd-feature-desc { font-family: var(--lnd-f-body); font-size: 14px; color: var(--lnd-t2); line-height: 1.65; margin: 0; }

  /* STATS BAND */
  .lnd-band { position: relative; overflow: hidden; background: var(--lnd-bg); border-top: 1px solid var(--lnd-border); border-bottom: 1px solid var(--lnd-border); padding: 64px 32px; }
  .lnd-band-glow { position: absolute; inset: 0; pointer-events: none; background: radial-gradient(ellipse 60% 80% at 50% 50%, rgb(var(--lnd-accent-rgb) /0.10) 0%, transparent 70%); }
  .lnd-band-inner { position: relative; z-index: 1; max-width: 1100px; margin: 0 auto; display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
  .lnd-band-item { text-align: center; }
  .lnd-band-val { font: 700 40px/1 var(--lnd-f-mono); color: var(--lnd-tx); letter-spacing: -0.02em; margin-bottom: 10px; }
  .lnd-band-lab { font-size: 13px; color: var(--lnd-t2); line-height: 1.4; }

  /* PRICING */
  .lnd-pricing { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; align-items: stretch; }
  .lnd-plan { background: var(--lnd-surface); border: 1px solid var(--lnd-border); border-radius: 2px; padding: 28px 24px; position: relative; }
  .lnd-plan--featured { border-color: var(--lnd-accent); background: var(--lnd-elevated); }
  .lnd-plan-badge { position: absolute; top: -1px; left: 50%; transform: translateX(-50%); background: var(--lnd-accent-h); color: #fff; font: 600 10px/1 var(--lnd-f-mono); letter-spacing: 0.1em; text-transform: uppercase; padding: 4px 12px; border-radius: 0 0 3px 3px; white-space: nowrap; }
  .lnd-plan-badge--free { background: var(--lnd-success); }
  .lnd-plan-head { margin-bottom: 20px; }
  .lnd-plan-name { font: 600 12px/1 var(--lnd-f-ui); text-transform: uppercase; letter-spacing: 0.08em; color: var(--lnd-t2); margin-bottom: 14px; }
  .lnd-plan-billing { font-weight: 400; color: var(--lnd-t3); }
  .lnd-plan-price { display: flex; align-items: baseline; gap: 6px; margin-bottom: 12px; }
  .lnd-plan-amount { font: 700 38px/1 var(--lnd-f-mono); color: var(--lnd-tx); letter-spacing: -0.025em; }
  .lnd-plan-period { font-size: 13px; color: var(--lnd-t3); }
  .lnd-plan-usage {
    display: flex; align-items: baseline; gap: 8px;
    border: 1px solid var(--lnd-border); border-radius: 2px;
    padding: 10px 12px; margin-bottom: 12px; background: var(--lnd-elevated);
  }
  .lnd-plan-usage--accent { border-color: var(--lnd-accent-b); background: var(--lnd-accent-bg); }
  .lnd-plan-usage-val { font: 700 18px/1 var(--lnd-f-mono); color: var(--lnd-tx); letter-spacing: -0.02em; }
  .lnd-plan-usage--accent .lnd-plan-usage-val { color: var(--lnd-accent); }
  .lnd-plan-usage-lab { font: 500 11px/1.3 var(--lnd-f-mono); color: var(--lnd-t2); }
  .lnd-plan-sub { font-size: 12px; color: var(--lnd-t3); margin: 0; line-height: 1.5; min-height: 36px; }
  .lnd-plan-cta { display: flex; flex-direction: column; gap: 8px; margin-bottom: 24px; }
  .lnd-plan-btn { width: 100%; height: 40px; display: inline-flex; align-items: center; justify-content: center; background: transparent; border: 1px solid var(--lnd-border-s); color: var(--lnd-t1); border-radius: 2px; font: 500 13px/1 var(--lnd-f-ui); cursor: pointer; transition: background 120ms, border-color 120ms, color 120ms, transform 120ms; }
  .lnd-plan-btn:hover { border-color: var(--lnd-accent); color: var(--lnd-tx); transform: translateY(-1px); }
  .lnd-plan-btn--featured { background: var(--lnd-accent); border-color: var(--lnd-accent); color: #fff; }
  .lnd-plan-btn--featured:hover { background: var(--lnd-accent-h); border-color: var(--lnd-accent-h); color: #fff; }
  .lnd-plan-btn--ghost-featured { background: transparent; border-color: var(--lnd-accent-b); color: var(--lnd-accent); }
  .lnd-plan-btn--ghost-featured:hover { border-color: var(--lnd-accent); color: var(--lnd-accent); }
  .lnd-plan-items { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
  .lnd-plan-item { display: flex; align-items: center; gap: 10px; font-size: 13px; }
  .lnd-plan-item--on { color: var(--lnd-t1); }
  .lnd-plan-item--on svg { color: var(--lnd-success); flex-shrink: 0; }
  .lnd-plan-item--off { color: var(--lnd-t4); }
  .lnd-plan-item--off svg { color: var(--lnd-t4); flex-shrink: 0; }
  .lnd-pricing-note { text-align: center; margin-top: 28px; font: 500 13px/1.5 var(--lnd-f-mono); color: var(--lnd-t3); }
  .lnd-pricing-note a { color: var(--lnd-accent); text-decoration: none; }
  .lnd-pricing-note a:hover { color: var(--lnd-accent-h); }

  /* CTA-PANEL */
  .lnd-cta-wrap { padding: 96px 32px; background: var(--lnd-bg-alt); }
  .lnd-cta-panel {
    position: relative; overflow: hidden;
    max-width: 1100px; margin: 0 auto;
    padding: 72px 32px;
  }
  .lnd-cta-grid { display: none; }
  .lnd-cta-split { position: relative; z-index: 1; display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: stretch; min-height: 500px; }
  .lnd-cta-viewer { border-radius: 4px; overflow: hidden; min-height: 400px; }
  .lnd-cta-viewer .lnd-viewer-box { height: 100%; }
  .lnd-cta-content { text-align: left; display: flex; flex-direction: column; justify-content: center; }
  .lnd-cta-h2 { font: 700 42px/1.12 var(--lnd-f-display); color: var(--lnd-tx); margin: 0 0 14px; letter-spacing: -0.02em; }
  .lnd-cta-sub { font-family: var(--lnd-f-body); font-size: 16px; color: var(--lnd-t2); margin: 0 0 32px; }
  .lnd-cta-actions { position: relative; display: flex; align-items: center; justify-content: center; gap: 8px; flex-wrap: wrap; }
  .lnd-cta-actions::before {
    content: ''; position: absolute; left: 50%; top: 50%; z-index: -1;
    width: 360px; height: 360px;
    transform: translate(-50%, -50%) scale(calc(0.5 + 0.5 * var(--cta-glow, 0)));
    background: radial-gradient(circle, rgb(var(--lnd-accent-rgb) /0.6) 0%, rgb(var(--lnd-accent-rgb) /0.2) 38%, transparent 70%);
    filter: blur(28px); pointer-events: none;
    opacity: var(--cta-glow, 0);
    transition: opacity 140ms ease, transform 140ms ease;
  }
  /* Fallback (kein JS / Touch): voller Glow bei direktem Hover */
  .lnd-cta-actions:has(.lnd-btn-primary:hover)::before { opacity: 1; transform: translate(-50%, -50%) scale(1); }
  @media (prefers-reduced-motion: reduce) {
    .lnd-cta-actions::before { transform: translate(-50%, -50%) scale(1); transition: opacity 140ms ease; }
  }
  .lnd-cta-faq-col { display: flex; flex-direction: column; justify-content: center; }
  .lnd-cta-faq-h2 { font: 700 36px/1.15 var(--lnd-f-display); color: var(--lnd-tx); margin: 0 0 24px; letter-spacing: -0.01em; }
  .lnd-cta-faq-col .lnd-faq { max-width: none; margin: 0; }
  .lnd-cta-faq-col .lnd-faq-item { border-radius: 4px; }
  .lnd-cta-faq-col .lnd-faq-q { text-align: left; }
  .lnd-cta-faq-col .lnd-faq-a { text-align: left; }

  /* CTA-BAND */
  .lnd-cta-band { background: var(--lnd-accent); padding: 56px 32px; }
  .lnd-cta-band-inner { max-width: 1100px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; gap: 32px; }
  .lnd-cta-band-h2 { font: 700 36px/1.1 var(--lnd-f-display); color: #fff; margin: 0 0 8px; letter-spacing: -0.02em; }
  .lnd-cta-band-sub { font-family: var(--lnd-f-body); font-size: 15px; color: rgba(255,255,255,0.75); margin: 0; }
  .lnd-btn-white {
    display: inline-flex; align-items: center; gap: 8px; flex-shrink: 0;
    background: #fff; color: var(--lnd-accent); border: none; border-radius: 2px;
    padding: 14px 22px; font: 600 14px/1 var(--lnd-f-ui); cursor: pointer; white-space: nowrap;
    transition: opacity 140ms, transform 140ms;
  }
  .lnd-btn-white:hover { opacity: 0.9; transform: translateY(-1px); }

  .lnd-cta-contact { margin-top: 28px; font: 500 13px/1.5 var(--lnd-f-mono); color: var(--lnd-t3); }
  .lnd-cta-contact a { color: var(--lnd-accent); text-decoration: none; }
  .lnd-cta-contact a:hover { color: var(--lnd-accent-h); }

  /* FINALE SEKTION */
  .lnd-final {
    position: relative; overflow: hidden;
    background: var(--lnd-bg);
    border-top: 1px solid var(--lnd-border);
  }
  .lnd-final-glow {
    position: absolute; top: 0; left: 50%; transform: translateX(-50%);
    width: 900px; height: 500px; pointer-events: none; z-index: 0;
    background: radial-gradient(ellipse 65% 55% at 50% 0%, rgb(var(--lnd-accent-rgb) /0.13) 0%, transparent 68%);
  }
  .lnd-final-top {
    position: relative; z-index: 1;
    max-width: 1100px; margin: 0 auto; padding: 100px 32px 80px;
    display: flex; flex-direction: column; align-items: center; gap: 18px; text-align: center;
  }
  .lnd-final-h2 {
    font: 700 54px/1.08 var(--lnd-f-display); color: var(--lnd-tx);
    letter-spacing: -0.028em; margin: 0;
  }
  .lnd-final-lead {
    font-family: var(--lnd-f-body); font-size: 16px; color: var(--lnd-t2); margin: 0;
  }
  .lnd-btn-primary--lg { padding: 16px 28px; font-size: 15px; margin-top: 6px; }
  .lnd-final-divider { padding: 0 32px; }
  .lnd-final-divider-inner { max-width: 1100px; margin: 0 auto; height: 1px; background: var(--lnd-border); }
  .lnd-final-split {
    position: relative; z-index: 1;
    max-width: 1100px; margin: 0 auto; padding: 72px 32px 96px;
    display: grid; grid-template-columns: 1fr 1fr; gap: 64px;
  }
  .lnd-final-col { display: flex; flex-direction: column; }
  .lnd-final-col-h {
    font: 600 22px/1.3 var(--lnd-f-display); color: var(--lnd-tx);
    margin: 0 0 20px; letter-spacing: -0.01em;
  }
  .lnd-final-col-sub {
    font-family: var(--lnd-f-body); font-size: 14px; color: var(--lnd-t2);
    margin: -12px 0 22px; line-height: 1.6;
  }
  .lnd-faq--final { max-width: none; margin: 0; }
  .lnd-faq--final .lnd-faq-item { border-radius: 4px; }

  /* FAQ + KONTAKT NEBENEINANDER */
  .lnd-bottom { background: var(--lnd-bg-alt); border-top: 1px solid var(--lnd-border); padding: 80px 32px 96px; }
  .lnd-bottom-inner { max-width: 1100px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 72px; align-items: stretch; }
  .lnd-bottom-col { display: flex; flex-direction: column; }
  .lnd-bottom-h { font: 700 28px/1.2 var(--lnd-f-display); color: var(--lnd-tx); margin: 0 0 28px; letter-spacing: -0.015em; }
  .lnd-bottom-sub { font-family: var(--lnd-f-body); font-size: 14px; color: var(--lnd-t2); margin: -16px 0 24px; line-height: 1.6; }
  .lnd-bottom-viewer { min-height: 0; }
  .lnd-bottom-viewer .lnd-viewer-box { height: 100%; }
  .lnd-bottom-viewer .lnd-viewer-stage { height: 100%; min-height: 0; }

  /* Trennlinien-FAQ */
  .lnd-faq-lines { display: flex; flex-direction: column; border-top: 1px solid var(--lnd-border); }
  .lnd-fql-item { border-bottom: 1px solid var(--lnd-border); }
  .lnd-fql-q {
    display: flex; align-items: center; justify-content: space-between; gap: 16px;
    padding: 15px 0; width: 100%; background: none; border: none; cursor: pointer;
    font: 500 14px/1.45 var(--lnd-f-ui); color: var(--lnd-t1); text-align: left;
    transition: color 120ms; list-style: none; user-select: none;
  }
  .lnd-fql-q::-webkit-details-marker { display: none; }
  .lnd-fql-q:hover { color: var(--lnd-tx); }
  .lnd-fql-chevron { flex-shrink: 0; color: var(--lnd-t4); transition: transform 0.2s, color 0.15s; }
  .lnd-fql-item[open] .lnd-fql-chevron { transform: rotate(180deg); color: var(--lnd-accent); }
  .lnd-fql-a { padding: 0 0 15px; font: 400 13px/1.7 var(--lnd-f-body); color: var(--lnd-t2); margin: 0; }

  /* FAQ FOOTER */
  .lnd-faq-wrap { border-top: 1px solid var(--lnd-border); background: var(--lnd-bg); padding: 48px 32px 56px; }
  .lnd-faq-wrap-inner { max-width: 720px; margin: 0 auto; }
  .lnd-faq-wrap-label { font: 600 11px/1 var(--lnd-f-mono); letter-spacing: 0.14em; text-transform: uppercase; color: var(--lnd-accent); margin: 0 0 20px; }
  .lnd-faq-toggle {
    width: 100%; display: flex; align-items: center; justify-content: space-between;
    padding: 22px 0; background: none; border: none; cursor: pointer;
    font: 600 15px/1 var(--lnd-f-ui); color: var(--lnd-t2);
    transition: color 140ms;
  }
  .lnd-faq-toggle:hover { color: var(--lnd-tx); }
  .lnd-faq-toggle-icon { color: var(--lnd-t4); transition: transform 0.22s ease, color 0.14s; flex-shrink: 0; }
  .lnd-faq-toggle-icon.is-open { transform: rotate(180deg); color: var(--lnd-accent); }
  .lnd-faq--footer { max-width: none; margin: 0 0 28px; animation: lnd-fade 0.2s ease; }
  .lnd-faq--footer .lnd-faq-item { border-radius: 4px; }

  /* FOOTER */
  .lnd-footer { padding: 32px; border-top: 1px solid var(--lnd-rule); }
  .lnd-footer-inner { max-width: 1100px; margin: 0 auto; display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
  .lnd-footer-links { display: flex; gap: 2px; flex: 1; }
  .lnd-footer-links a { padding: 4px 10px; font-size: 12px; color: var(--lnd-t3); text-decoration: none; transition: color 120ms; }
  .lnd-footer-links a:hover { color: var(--lnd-t1); }
  .lnd-footer-copy { font-size: 12px; color: var(--lnd-t3); }

  /* RESPONSIVE */
  @media (max-width: 960px) {
    .lnd-hero-grid { grid-template-columns: 1fr; gap: 40px; }
    .lnd-hero-right { justify-content: flex-start; }
    .lnd-draw-card { max-width: 100%; }
    .lnd-hero-h1 { font-size: 38px; }
    .lnd-contrast-heads { display: none; }
    .lnd-contrast { gap: 12px; }
    /* Pain/Gain-Paare als EINE Kombi-Karte: Problem oben, Lösung unten */
    .lnd-contrast-row:not(.lnd-contrast-row--metric) {
      grid-template-columns: 1fr; gap: 0;
      border: 1px solid var(--lnd-border); border-radius: 8px;
      overflow: hidden; background: var(--lnd-surface);
    }
    .lnd-contrast-row:not(.lnd-contrast-row--metric) .lnd-c-before {
      border: none; background: none; border-radius: 0;
      color: var(--lnd-t3); font-size: 13px; padding-bottom: 13px;
    }
    .lnd-contrast-row:not(.lnd-contrast-row--metric) .lnd-c-after {
      border: none; border-top: 1px dashed var(--lnd-rule); border-radius: 0;
      background: var(--lnd-accent-bg); color: var(--lnd-t1);
    }
    .lnd-contrast-row:not(.lnd-contrast-row--metric) .lnd-c-arrow { display: none; }
    .lnd-contrast-row:hover .lnd-c-after,
    .lnd-contrast-row:hover .lnd-c-arrow { transform: none; }
    /* Metrik-Zeile bleibt horizontaler Akzent-Banner */
    .lnd-contrast-row--metric {
      grid-template-columns: 1fr auto 1fr; align-items: center;
      border: 1px solid var(--lnd-accent-b); border-radius: 8px;
      background: var(--lnd-accent-bg);
    }
    .lnd-contrast-row--metric .lnd-c-before,
    .lnd-contrast-row--metric .lnd-c-after {
      border: none; background: none; border-radius: 0;
      flex-direction: column; align-items: center; text-align: center; gap: 4px;
    }
    .lnd-contrast-row--metric .lnd-c-x,
    .lnd-contrast-row--metric .lnd-c-check { display: none; }
    .lnd-contrast-row--metric .lnd-c-arrow { display: flex; transform: none; color: var(--lnd-accent); }
    .lnd-flow-grid { grid-template-columns: 1fr; gap: 32px; }
    .lnd-flow-track, .lnd-flow-node { display: none; }
    .lnd-flow { padding-top: 0; }
    .lnd-gdt-grid { grid-template-columns: repeat(4, 1fr); }
    .lnd-split { grid-template-columns: 1fr; gap: 36px; }
    .lnd-split--rev .lnd-split-text { order: 0; }
    .lnd-features { grid-template-columns: 1fr 1fr; }
    .lnd-band-inner { grid-template-columns: 1fr 1fr; gap: 36px 24px; }
    .lnd-pricing { grid-template-columns: 1fr; }
    .lnd-nav-links, .lnd-nav-signin, .lnd-btn-nav { display: none; }
    .lnd-nav-burger { display: inline-flex; }
    .lnd-nav-drawer {
      display: flex; flex-direction: column; gap: 2px;
      position: fixed; top: 60px; left: 0; right: 0;
      max-height: calc(100vh - 60px); overflow-y: auto;
      padding: 12px 20px 24px;
      background: rgb(var(--lnd-bg-rgb) /0.97);
      backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
      border-bottom: 1px solid var(--lnd-rule);
      transform: translateY(-10px); opacity: 0; pointer-events: none;
      transition: opacity 180ms ease, transform 180ms ease;
    }
    .lnd-nav-drawer[data-open="true"] { transform: translateY(0); opacity: 1; pointer-events: auto; }
    .lnd-nav-drawer-link {
      display: flex; align-items: center; min-height: 48px; padding: 0 8px;
      font: 500 16px/1 var(--lnd-f-ui); color: var(--lnd-t1); text-decoration: none;
      border-bottom: 1px solid var(--lnd-rule);
    }
    .lnd-nav-drawer-link:active { color: var(--lnd-accent-h); }
    .lnd-nav-drawer-cta { width: 100%; justify-content: center; margin-top: 16px; }
    .lnd-cta-h2 { font-size: 32px; }
    .lnd-cta-panel { padding: 56px 24px; }
    .lnd-cta-split { grid-template-columns: 1fr; }
    .lnd-cta-viewer { min-height: 360px; }
    .lnd-cta-band-inner { flex-direction: column; align-items: flex-start; gap: 24px; }
    .lnd-cta-band-h2 { font-size: 28px; }
    .lnd-sticky-cta {
      display: block; position: fixed; left: 0; right: 0; bottom: 0; z-index: 90;
      padding: 12px 16px calc(12px + env(safe-area-inset-bottom));
      background: rgb(var(--lnd-bg-rgb) /0.95);
      backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
      border-top: 1px solid var(--lnd-rule);
      transform: translateY(130%);
      transition: transform 280ms cubic-bezier(.22,.68,0,1);
    }
    .lnd-sticky-cta[data-show="true"] { transform: translateY(0); }
    .lnd-sticky-cta-inner { display: flex; align-items: center; gap: 12px; max-width: 480px; margin: 0 auto; }
    .lnd-sticky-cta-txt { flex: 1; font: 500 13px/1.3 var(--lnd-f-ui); color: var(--lnd-t2); }
    .lnd-sticky-cta .lnd-btn-primary { flex-shrink: 0; }
    .lnd-footer { padding-bottom: 96px; }
    .lnd-final-h2 { font-size: 38px; }
    .lnd-final-split { grid-template-columns: 1fr; gap: 48px; padding: 56px 24px 80px; }
    .lnd-final-top { padding: 72px 24px 60px; }
    .lnd-bottom-inner { grid-template-columns: 1fr; gap: 48px; }
  }
  @media (max-width: 768px) {
    .lnd-section { padding: 72px 24px; }
    .lnd-features { grid-template-columns: 1fr; }
    .lnd-gdt-grid { grid-template-columns: repeat(3, 1fr); }
    .lnd-cta-panel { padding: 48px 24px; }
    /* Zahlen-Band weglassen — dieselben Werte stehen schon im Hero */
    .lnd-band { display: none; }
  }
  @media (max-width: 600px) {
    .lnd-hero { padding: 48px 20px 56px; }
    .lnd-hero-h1 { font-size: 30px; }
    .lnd-cta-wrap { padding: 32px 16px 64px; }
    .lnd-cta-h2 { font-size: 26px; }
    .lnd-hero-stats { display: grid; grid-template-columns: repeat(3, 1fr); width: 100%; gap: 8px; border: none; background: none; border-radius: 0; overflow: visible; }
    .lnd-stat { padding: 13px 6px; text-align: center; border: 1px solid var(--lnd-border); border-radius: 4px; background: var(--lnd-surface); }
    .lnd-stat-val { font-size: 20px; }
    .lnd-stat-div { display: none; }
    .lnd-section { padding: 64px 20px; }
    .lnd-section-h2 { font-size: 28px; }
    .lnd-split-h2 { font-size: 27px; }
    .lnd-gdt-grid { grid-template-columns: repeat(2, 1fr); }
    .lnd-viewer-stage { height: 360px; }
    .lnd-viewer-modes { left: 12px; right: 12px; transform: none; justify-content: center; }
    .lnd-viewer-mode { flex: 1; padding: 11px 8px; min-height: 40px; }
    .lnd-viewer-hint { font-size: 12px; padding: 8px 12px; bottom: 12px; max-width: calc(100% - 24px); text-align: center; }
    .lnd-p2d-wrap { padding: 56px 10px 14px; }
    .lnd-features { grid-template-columns: 1fr; }
    .lnd-band-inner { grid-template-columns: 1fr; }
    .lnd-calc-meta { flex-direction: column; }
    .lnd-footer-inner { flex-direction: column; align-items: flex-start; }
    .lnd-trust-inner { flex-direction: column; align-items: flex-start; gap: 16px; }
    /* nur die wichtigsten Branchen-Tags zeigen, Rest spart Höhe */
    .lnd-trust-tag:nth-child(n+4) { display: none; }
    .lnd-faq { gap: 0; }
  }

  /* ── PRICING NOTE ── */
  .lnd-pricing-note { font: 400 13px/1.6 var(--lnd-f-mono); color: var(--lnd-t3); margin: -8px 0 0; }
  .lnd-pricing-note strong { color: var(--lnd-t2); font-weight: 500; }

  /* ── FAQ ── */
  .lnd-faq { display: flex; flex-direction: column; gap: 2px; max-width: 720px; margin: 0 auto; }
  .lnd-faq-item { background: var(--lnd-surface); border: 1px solid var(--lnd-border); border-radius: 10px; overflow: hidden; }
  .lnd-faq-item + .lnd-faq-item { margin-top: 6px; }
  .lnd-faq-q { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 18px 20px; font: 500 15px/1.4 var(--lnd-f-ui); color: var(--lnd-t1); cursor: pointer; list-style: none; user-select: none; }
  .lnd-faq-q::-webkit-details-marker { display: none; }
  .lnd-faq-q:hover { color: var(--lnd-tx); }
  .lnd-faq-chevron { flex-shrink: 0; color: var(--lnd-t3); transition: transform 0.2s; }
  .lnd-faq-item[open] .lnd-faq-chevron { transform: rotate(180deg); }
  .lnd-faq-a { padding: 0 20px 18px; font: 400 15px/1.7 var(--lnd-f-body); color: var(--lnd-t2); margin: 0; }

  /* ── KONTAKT-SEKTION ── */
  .lnd-contact-wrap { padding: 80px 32px; border-top: 1px solid var(--lnd-rule); }
  .lnd-contact-inner { max-width: 600px; margin: 0 auto; }
  .lnd-contact-h2 { font: 700 36px/1.15 var(--lnd-f-display); color: var(--lnd-tx); margin: 0 0 10px; letter-spacing: -0.02em; text-align: center; }
  .lnd-contact-sub { font-family: var(--lnd-f-body); font-size: 15px; color: var(--lnd-t2); text-align: center; margin: 0 0 36px; }
  .lnd-contact-form { display: flex; flex-direction: column; gap: 16px; }
  .lnd-contact-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  @media (max-width: 520px) { .lnd-contact-row { grid-template-columns: 1fr; } }
  .lnd-contact-form label {
    display: flex; flex-direction: column; gap: 6px;
    font: 500 13px/1 var(--lnd-f-ui); color: var(--lnd-t2);
  }
  .lnd-contact-form input,
  .lnd-contact-form select,
  .lnd-contact-form textarea {
    background: var(--lnd-surface); border: 1px solid var(--lnd-border); border-radius: 8px;
    color: var(--lnd-t1); font: 400 14px/1.5 var(--lnd-f-ui); padding: 10px 12px;
    outline: none; resize: vertical; transition: border-color 0.15s;
    appearance: none; -webkit-appearance: none;
  }
  .lnd-contact-form select {
    background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%238E96A4' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: right 12px center; padding-right: 32px; cursor: pointer;
  }
  .lnd-contact-form input:focus,
  .lnd-contact-form select:focus,
  .lnd-contact-form textarea:focus { border-color: var(--lnd-accent); }
  .lnd-contact-form input::placeholder, .lnd-contact-form textarea::placeholder { color: var(--lnd-t3); }
  .lnd-contact-error { font: 400 13px/1.5 var(--lnd-f-ui); color: var(--lnd-danger); }
  .lnd-contact-error a { color: var(--lnd-danger); }
  .lnd-contact-toggle { display: inline-flex; align-items: center; gap: 8px; }
  .lnd-contact-form--open { animation: lnd-fade 0.25s ease; }
  .lnd-contact-submit { align-self: center; }
  .lnd-contact-submit:disabled { opacity: 0.6; cursor: not-allowed; }
  .lnd-contact-success {
    display: flex; flex-direction: column; align-items: center; gap: 12px;
    text-align: center; padding: 32px 0; color: var(--lnd-success);
  }
  .lnd-contact-success h3 { font: 600 20px/1.2 var(--lnd-f-ui); color: var(--lnd-t1); margin: 0; }
  .lnd-contact-success p { font: 400 14px/1.5 var(--lnd-f-ui); color: var(--lnd-t2); margin: 0 0 8px; }
  .lnd-contact-success .lnd-btn-primary { margin-top: 8px; }

  /* ── DEMO-NAV-BUTTON ── */
  .lnd-btn-demo-nav {
    display: inline-flex; align-items: center; height: 36px; padding: 0 16px;
    background: transparent; border: 1px solid var(--lnd-border-s); color: var(--lnd-t1);
    border-radius: 2px; font: 500 13px/1 var(--lnd-f-ui); cursor: pointer; flex-shrink: 0;
    transition: border-color 120ms, color 120ms, background 120ms;
  }
  .lnd-btn-demo-nav:hover { border-color: var(--lnd-accent); color: var(--lnd-accent); background: var(--lnd-accent-bg); }

  /* ── KONTAKT-DEMO-BLOCK ── */
  .lnd-contact-demo { display: flex; flex-direction: column; align-items: center; gap: 10px; margin-bottom: 28px; }
  .lnd-contact-demo-btn { gap: 9px; height: 48px; padding: 0 28px; font-size: 15px; }
  .lnd-contact-demo-hint { font: 400 13px/1 var(--lnd-f-mono); color: var(--lnd-t3); letter-spacing: 0.01em; }
  .lnd-contact-divider {
    display: flex; align-items: center; gap: 12px; margin-bottom: 28px;
  }
  .lnd-contact-divider::before,
  .lnd-contact-divider::after { content: ""; flex: 1; height: 1px; background: var(--lnd-border); }
  .lnd-contact-divider span { font: 400 12px/1 var(--lnd-f-ui); color: var(--lnd-t3); white-space: nowrap; }
`;
