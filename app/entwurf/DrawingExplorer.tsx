"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { DRAWING_FEATURES, DRAWING_SIZE, type DrawingHighlight } from "./drawing-highlights";

type CategoryKey = "surface" | "tolerance" | "thread" | "gdt" | "material";

const CATEGORIES: { key: CategoryKey; label: string; matches: string[] }[] = [
  { key: "surface", label: "Oberfläche", matches: ["Oberflaeche"] },
  { key: "tolerance", label: "Toleranz", matches: ["Masztoleranz", "Masstoleranz", "ISO-Passung", "Allgemeintoleranz"] },
  { key: "thread", label: "Gewinde", matches: ["Gewinde"] },
  { key: "gdt", label: "GD&T", matches: ["GD&T"] },
  { key: "material", label: "Werkstoff", matches: ["Werkstoff"] },
];

const categoryFor = (entry: DrawingHighlight): CategoryKey | undefined => CATEGORIES.find((category) => category.matches.includes(entry.kategorie))?.key;

export default function DrawingExplorer() {
  const modalRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<Set<CategoryKey>>(() => new Set(CATEGORIES.map(({ key }) => key)));
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    if (!open) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    modalRef.current?.querySelector<HTMLButtonElement>(".de-close")?.focus();
    const handleKeys = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
      if (event.key !== "Tab") return;
      const controls = modalRef.current?.querySelectorAll<HTMLElement>("button, a[href]");
      if (!controls?.length) return;
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", handleKeys);
    return () => {
      window.removeEventListener("keydown", handleKeys);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus({ preventScroll: true });
    };
  }, [open]);

  useEffect(() => {
    if (selected === null) return;
    const list = listRef.current;
    const item = list?.querySelector<HTMLElement>('[aria-pressed="true"]');
    if (!list || !item) return;
    const itemBox = item.getBoundingClientRect();
    const listBox = list.getBoundingClientRect();
    if (itemBox.top < listBox.top || itemBox.bottom > listBox.bottom) {
      list.scrollTop += itemBox.top - listBox.top - list.clientHeight / 2 + item.clientHeight / 2;
    }
  }, [selected]);

  const visibleEntries = useMemo(
    () => DRAWING_FEATURES.filter((entry) => {
      const category = categoryFor(entry);
      return category !== undefined && active.has(category);
    }),
    [active],
  );

  const toggle = (key: CategoryKey) => {
    setActive((current) => {
      const next = new Set(current);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
    setSelected(null);
  };

  return (
    <>
      <style>{CSS}</style>
      <button className="hm-document-link de-open" type="button" onClick={() => setOpen(true)}>
        Zeichnung interaktiv ansehen <span aria-hidden="true">↗</span>
      </button>
      {open && typeof document !== "undefined" && createPortal(
        <div className="hm-page de-backdrop" role="presentation" onWheel={(event) => event.stopPropagation()} onTouchMove={(event) => event.stopPropagation()} onClick={() => setOpen(false)}>
          <section ref={modalRef} className="de-modal" role="dialog" aria-modal="true" aria-labelledby="de-title" onClick={(event) => event.stopPropagation()}>
            <header className="de-header">
              <div>
                <h2 id="de-title">Zeichnung auslesen</h2>
              </div>
              <button className="de-close" type="button" onClick={() => setOpen(false)} aria-label="Zeichnung schließen">×</button>
            </header>
            <div className="de-toolbar">
              <div className="de-filters">
                <button className={`de-filter de-filter-all${active.size === CATEGORIES.length ? " is-active" : ""}`} type="button" onClick={() => setActive(new Set(CATEGORIES.map(({ key }) => key)))} aria-pressed={active.size === CATEGORIES.length}>Alle</button>
                {CATEGORIES.map((category) => {
                  return <button key={category.key} className={`de-filter de-filter-${category.key}${active.has(category.key) ? " is-active" : ""}`} type="button" onClick={() => toggle(category.key)} aria-pressed={active.has(category.key)}><i aria-hidden="true" />{category.label}</button>;
                })}
              </div>
            </div>
            <div className="de-layout">
              <div className="de-sheet-wrap">
                <div className="de-sheet" style={{ aspectRatio: `${DRAWING_SIZE.width} / ${DRAWING_SIZE.height}` }}>
                  <img src="/hero2/VY-DEMO-04-roh.png" alt="Technische Zeichnung VY-DEMO-04" />
                  {visibleEntries.map((entry) => {
                    const [x0, y0, x1, y1] = entry.pngPx;
                    const category = categoryFor(entry);
                    return <button key={entry.nr} data-number={entry.nr} type="button" className={`de-highlight de-highlight-${category}${selected === entry.nr ? " is-selected" : ""}`} style={{ left: `${x0 / DRAWING_SIZE.width * 100}%`, top: `${y0 / DRAWING_SIZE.height * 100}%`, width: `${(x1 - x0) / DRAWING_SIZE.width * 100}%`, height: `${(y1 - y0) / DRAWING_SIZE.height * 100}%` }} onClick={() => setSelected(selected === entry.nr ? null : entry.nr)} aria-label={`${entry.kategorie}: ${entry.wert}`} aria-pressed={selected === entry.nr}><span>{entry.nr}</span></button>;
                  })}
                </div>
              </div>
              <aside className="de-list" aria-label="Merkmale in der Zeichnung">
                <div className="de-list-head"><strong>Merkmale</strong><span>{visibleEntries.length} Positionen</span></div>
                <div ref={listRef} className="de-list-items">
                  {visibleEntries.map((entry) => {
                    const category = categoryFor(entry);
                    return <button key={entry.nr} data-number={entry.nr} type="button" className={`de-list-item de-list-item-${category}${selected === entry.nr ? " is-selected" : ""}`} onClick={() => setSelected(selected === entry.nr ? null : entry.nr)} aria-pressed={selected === entry.nr}><span className="de-list-number">{entry.nr}</span><span className="de-list-copy"><strong>{entry.wert}</strong><small>{entry.kategorie.replace("Oberflaeche", "Oberfläche").replace(/Mas[sz]toleranz/, "Maßtoleranz")}</small>{entry.details?.map((detail) => <span className="de-gdt-detail" key={detail.label}><span>{detail.label}</span><b>{detail.value}</b></span>)}</span></button>;
                  })}
                </div>
              </aside>
            </div>
          </section>
        </div>,
        document.body,
      )}
    </>
  );
}

const CSS = `
.de-open{display:inline-flex;align-items:center;gap:calc(7*var(--hm-u));padding:0;border:0;border-bottom:1px solid var(--hm-petrol);background:none;color:var(--hm-petrol);font:calc(13*var(--hm-u)) var(--hm-body);cursor:pointer;pointer-events:auto;text-decoration:none}
.de-open span{font-size:calc(15*var(--hm-u))}
/* Das Portal liegt außerhalb der Website. hm-page liefert auch hier alle Farbtokens. */
.hm-page.de-backdrop{--hm-body:Arial,Helvetica,sans-serif;--hm-display:var(--hm-body);--hm-mono:var(--hm-body);position:fixed;inset:0;z-index:10000;display:grid;place-items:center;box-sizing:border-box;padding:calc(24*var(--hm-u));background:rgba(12,18,17,.58);backdrop-filter:blur(4px);font-family:var(--hm-body)}
.de-backdrop *{box-sizing:border-box}
.de-modal{width:min(calc(1360*var(--hm-u)),100%);max-height:calc(100dvh - calc(48*var(--hm-u)));overflow:auto;padding:calc(32*var(--hm-u));border:1px solid var(--hm-line);border-radius:calc(20*var(--hm-u));background:var(--hm-bg);box-shadow:0 calc(32*var(--hm-u)) calc(96*var(--hm-u)) rgba(12,18,17,.32);color:var(--hm-text);font:calc(15*var(--hm-u))/1.5 var(--hm-body);overscroll-behavior:contain}
.de-header{display:flex;justify-content:space-between;align-items:center;gap:calc(20*var(--hm-u))}
.de-header h2{margin:0;font:600 clamp(calc(28*var(--hm-u)),3vw,calc(44*var(--hm-u)))/1.15 var(--hm-body);letter-spacing:-.025em}
.de-close{flex:none;width:calc(40*var(--hm-u));height:calc(40*var(--hm-u));display:grid;place-items:center;padding:0;border:1px solid var(--hm-line);border-radius:calc(12*var(--hm-u));background:var(--hm-white);color:var(--hm-text);font:calc(28*var(--hm-u))/1 var(--hm-body);cursor:pointer}
.de-toolbar{margin:calc(24*var(--hm-u)) 0;padding-bottom:calc(20*var(--hm-u));border-bottom:1px solid var(--hm-line)}
.de-filters{display:flex;flex-wrap:wrap;gap:calc(8*var(--hm-u))}
.de-filter{display:inline-flex;align-items:center;gap:calc(8*var(--hm-u));padding:calc(9*var(--hm-u)) calc(13*var(--hm-u));border:1px solid var(--hm-line);border-radius:calc(9*var(--hm-u));background:var(--hm-bg);color:var(--hm-muted);font:500 calc(15*var(--hm-u))/1.25 var(--hm-body);cursor:pointer}
.de-filter i{width:calc(8*var(--hm-u));height:calc(8*var(--hm-u));border-radius:50%;background:var(--hm-feature);opacity:.45}
.de-filter.is-active{border-color:var(--hm-feature,var(--hm-petrol));background:var(--hm-white);color:var(--hm-text)}
.de-filter.is-active i{opacity:1}
.de-filter-surface,.de-highlight-surface,.de-list-item-surface{--hm-feature:var(--hm-surface-metal)}
.de-filter-tolerance,.de-highlight-tolerance,.de-list-item-tolerance{--hm-feature:var(--hm-bore-metal)}
.de-filter-thread,.de-highlight-thread,.de-list-item-thread{--hm-feature:var(--hm-thread-metal)}
.de-filter-gdt,.de-highlight-gdt,.de-list-item-gdt{--hm-feature:var(--hm-relief-metal)}
.de-filter-material,.de-highlight-material,.de-list-item-material{--hm-feature:var(--hm-positive)}
.de-layout{display:grid;grid-template-columns:minmax(0,1fr) calc(300*var(--hm-u));gap:calc(20*var(--hm-u));align-items:start}
.de-sheet-wrap{min-width:0;padding:calc(16*var(--hm-u));border:1px solid var(--hm-line);border-radius:calc(12*var(--hm-u));background:var(--hm-white)}
.de-sheet{position:relative;width:100%;isolation:isolate}
.de-sheet img{display:block;width:100%;height:auto}
.de-highlight{position:absolute;z-index:1;padding:0;border:2px solid var(--hm-feature);border-radius:2px;background:color-mix(in srgb,var(--hm-feature) 22%,transparent);cursor:pointer;transition:background .15s,box-shadow .15s}
.de-highlight span{position:absolute;bottom:calc(100% + 2px);left:-2px;display:grid;place-items:center;min-width:calc(18*var(--hm-u));height:calc(18*var(--hm-u));padding:0 3px;border-radius:calc(5*var(--hm-u));background:var(--hm-feature);color:var(--hm-white);font:600 calc(13*var(--hm-u))/1 var(--hm-body)}
.de-highlight:hover,.de-highlight.is-selected{z-index:3;background:color-mix(in srgb,var(--hm-feature) 38%,transparent);outline:2px solid var(--hm-feature);outline-offset:3px;box-shadow:0 0 0 3px var(--hm-white)}
.de-highlight.is-selected span{background:var(--hm-petrol)}
.de-list{min-width:0;overflow:hidden;border:1px solid var(--hm-line);border-radius:calc(12*var(--hm-u));background:var(--hm-white)}
.de-list-head{display:flex;justify-content:space-between;align-items:center;gap:calc(12*var(--hm-u));padding:calc(17*var(--hm-u)) calc(16*var(--hm-u));border-bottom:1px solid var(--hm-line)}
.de-list-head strong{font:600 calc(16*var(--hm-u))/1.3 var(--hm-body)}
.de-list-head span{color:var(--hm-muted);font:calc(14*var(--hm-u))/1.3 var(--hm-body)}
.de-list-items{display:grid;max-height:clamp(calc(260*var(--hm-u)),calc(100dvh - calc(300*var(--hm-u))),calc(560*var(--hm-u)));overflow:auto;overscroll-behavior:contain;padding:calc(6*var(--hm-u))}
.de-list-item{display:flex;align-items:center;gap:calc(10*var(--hm-u));width:100%;padding:calc(11*var(--hm-u)) calc(9*var(--hm-u));border:1px solid transparent;border-radius:calc(8*var(--hm-u));background:none;color:var(--hm-text);text-align:left;cursor:pointer}
.de-list-item:hover{background:var(--hm-bg)}
.de-list-item.is-selected{background:color-mix(in srgb,var(--hm-feature) 12%,var(--hm-white));border-color:var(--hm-feature)}
.de-list-number{display:grid;place-items:center;flex:0 0 calc(26*var(--hm-u));height:calc(26*var(--hm-u));border:1px solid var(--hm-feature);border-radius:calc(7*var(--hm-u));background:var(--hm-white);color:var(--hm-feature);font:600 calc(14*var(--hm-u))/1 var(--hm-body)}
.de-list-item.is-selected .de-list-number{background:var(--hm-feature);color:var(--hm-white)}
.de-list-copy{display:grid;min-width:0;gap:3px}
.de-list-copy strong{font:600 calc(15*var(--hm-u))/1.35 var(--hm-body);overflow-wrap:anywhere}
.de-gdt-detail{display:flex;justify-content:space-between;gap:calc(16*var(--hm-u));color:var(--hm-muted);font:calc(14*var(--hm-u))/1.4 var(--hm-body)}
.de-gdt-detail b{color:var(--hm-text);font-weight:600}
.de-list-copy small{color:var(--hm-muted);font:calc(14*var(--hm-u))/1.35 var(--hm-body)}
.de-modal button:focus-visible{outline:2px solid var(--hm-petrol);outline-offset:3px}
@media(max-width:900px){.de-layout{grid-template-columns:1fr}.de-list-items{max-height:calc(250*var(--hm-u))}}
@media(max-width:600px){.hm-page.de-backdrop{padding:calc(10*var(--hm-u))}.de-modal{max-height:calc(100dvh - calc(20*var(--hm-u)));padding:calc(18*var(--hm-u));border-radius:calc(16*var(--hm-u))}.de-header h2{font-size:calc(28*var(--hm-u))}.de-close{width:calc(34*var(--hm-u));height:calc(34*var(--hm-u))}.de-toolbar{margin:calc(18*var(--hm-u)) 0;padding-bottom:calc(16*var(--hm-u))}.de-filter{font-size:calc(14*var(--hm-u));padding:calc(8*var(--hm-u)) calc(10*var(--hm-u))}.de-layout{gap:calc(14*var(--hm-u))}.de-sheet-wrap{padding:calc(8*var(--hm-u))}.de-highlight{border-width:1px}.de-highlight span{min-width:calc(14*var(--hm-u));height:calc(14*var(--hm-u));font-size:calc(12*var(--hm-u))}.de-list-head{padding:calc(13*var(--hm-u))}}
`;
