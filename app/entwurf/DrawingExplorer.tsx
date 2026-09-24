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
.de-open{display:inline-flex;align-items:center;gap:7px;padding:0;border:0;border-bottom:1px solid var(--hm-petrol);background:none;color:var(--hm-petrol);font:10px var(--hm-body);cursor:pointer;pointer-events:auto;text-decoration:none}
.de-open span{font-size:13px}
/* Das Portal liegt außerhalb der Website. hm-page liefert auch hier alle Farbtokens. */
.hm-page.de-backdrop{--hm-body:Arial,Helvetica,sans-serif;--hm-display:var(--hm-body);--hm-mono:var(--hm-body);position:fixed;inset:0;z-index:10000;display:grid;place-items:center;box-sizing:border-box;padding:24px;background:rgba(12,18,17,.58);backdrop-filter:blur(4px);font-family:var(--hm-body)}
.de-backdrop *{box-sizing:border-box}
.de-modal{width:min(1360px,100%);max-height:calc(100dvh - 48px);overflow:auto;padding:32px;border:1px solid var(--hm-line);border-radius:20px;background:var(--hm-bg);box-shadow:0 32px 96px rgba(12,18,17,.32);color:var(--hm-text);font:14px/1.5 var(--hm-body);overscroll-behavior:contain}
.de-header{display:flex;justify-content:space-between;align-items:center;gap:20px}
.de-header h2{margin:0;font:600 clamp(28px,3vw,44px)/1.15 var(--hm-body);letter-spacing:-.025em}
.de-close{flex:none;width:40px;height:40px;display:grid;place-items:center;padding:0;border:1px solid var(--hm-line);border-radius:12px;background:var(--hm-white);color:var(--hm-text);font:28px/1 var(--hm-body);cursor:pointer}
.de-toolbar{margin:24px 0;padding-bottom:20px;border-bottom:1px solid var(--hm-line)}
.de-filters{display:flex;flex-wrap:wrap;gap:8px}
.de-filter{display:inline-flex;align-items:center;gap:8px;padding:9px 13px;border:1px solid var(--hm-line);border-radius:9px;background:var(--hm-bg);color:var(--hm-muted);font:500 13px/1.25 var(--hm-body);cursor:pointer}
.de-filter i{width:8px;height:8px;border-radius:50%;background:var(--hm-feature);opacity:.45}
.de-filter.is-active{border-color:var(--hm-feature,var(--hm-petrol));background:var(--hm-white);color:var(--hm-text)}
.de-filter.is-active i{opacity:1}
.de-filter-surface,.de-highlight-surface,.de-list-item-surface{--hm-feature:var(--hm-surface-metal)}
.de-filter-tolerance,.de-highlight-tolerance,.de-list-item-tolerance{--hm-feature:var(--hm-bore-metal)}
.de-filter-thread,.de-highlight-thread,.de-list-item-thread{--hm-feature:var(--hm-thread-metal)}
.de-filter-gdt,.de-highlight-gdt,.de-list-item-gdt{--hm-feature:var(--hm-relief-metal)}
.de-filter-material,.de-highlight-material,.de-list-item-material{--hm-feature:var(--hm-positive)}
.de-layout{display:grid;grid-template-columns:minmax(0,1fr) 300px;gap:20px;align-items:start}
.de-sheet-wrap{min-width:0;padding:16px;border:1px solid var(--hm-line);border-radius:12px;background:var(--hm-white)}
.de-sheet{position:relative;width:100%;isolation:isolate}
.de-sheet img{display:block;width:100%;height:auto}
.de-highlight{position:absolute;z-index:1;padding:0;border:2px solid var(--hm-feature);border-radius:2px;background:color-mix(in srgb,var(--hm-feature) 22%,transparent);cursor:pointer;transition:background .15s,box-shadow .15s}
.de-highlight span{position:absolute;bottom:calc(100% + 2px);left:-2px;display:grid;place-items:center;min-width:18px;height:18px;padding:0 3px;border-radius:5px;background:var(--hm-feature);color:var(--hm-white);font:600 10px/1 var(--hm-body)}
.de-highlight:hover,.de-highlight.is-selected{z-index:3;background:color-mix(in srgb,var(--hm-feature) 38%,transparent);outline:2px solid var(--hm-feature);outline-offset:3px;box-shadow:0 0 0 3px var(--hm-white)}
.de-highlight.is-selected span{background:var(--hm-petrol)}
.de-list{min-width:0;overflow:hidden;border:1px solid var(--hm-line);border-radius:12px;background:var(--hm-white)}
.de-list-head{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:17px 16px;border-bottom:1px solid var(--hm-line)}
.de-list-head strong{font:600 15px/1.3 var(--hm-body)}
.de-list-head span{color:var(--hm-muted);font:12px/1.3 var(--hm-body)}
.de-list-items{display:grid;max-height:clamp(260px,calc(100dvh - 300px),560px);overflow:auto;overscroll-behavior:contain;padding:6px}
.de-list-item{display:flex;align-items:center;gap:10px;width:100%;padding:11px 9px;border:1px solid transparent;border-radius:8px;background:none;color:var(--hm-text);text-align:left;cursor:pointer}
.de-list-item:hover{background:var(--hm-bg)}
.de-list-item.is-selected{background:color-mix(in srgb,var(--hm-feature) 12%,var(--hm-white));border-color:var(--hm-feature)}
.de-list-number{display:grid;place-items:center;flex:0 0 26px;height:26px;border:1px solid var(--hm-feature);border-radius:7px;background:var(--hm-white);color:var(--hm-feature);font:600 12px/1 var(--hm-body)}
.de-list-item.is-selected .de-list-number{background:var(--hm-feature);color:var(--hm-white)}
.de-list-copy{display:grid;min-width:0;gap:3px}
.de-list-copy strong{font:600 13px/1.35 var(--hm-body);overflow-wrap:anywhere}
.de-gdt-detail{display:flex;justify-content:space-between;gap:16px;color:var(--hm-muted);font:12px/1.4 var(--hm-body)}
.de-gdt-detail b{color:var(--hm-text);font-weight:600}
.de-list-copy small{color:var(--hm-muted);font:12px/1.35 var(--hm-body)}
.de-modal button:focus-visible{outline:2px solid var(--hm-petrol);outline-offset:3px}
@media(max-width:900px){.de-layout{grid-template-columns:1fr}.de-list-items{max-height:250px}}
@media(max-width:600px){.hm-page.de-backdrop{padding:10px}.de-modal{max-height:calc(100dvh - 20px);padding:18px;border-radius:16px}.de-header h2{font-size:28px}.de-close{width:34px;height:34px}.de-toolbar{margin:18px 0;padding-bottom:16px}.de-filter{font-size:12px;padding:8px 10px}.de-layout{gap:14px}.de-sheet-wrap{padding:8px}.de-highlight{border-width:1px}.de-highlight span{min-width:14px;height:14px;font-size:9px}.de-list-head{padding:13px}}
`;
