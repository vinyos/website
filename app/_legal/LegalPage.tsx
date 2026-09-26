"use client";

import { useEffect, useRef, useState } from "react";
import ContactWidget from "../entwurf/ContactWidget";
import { LOGIN_URL, SIGNUP_URL } from "../entwurf/story";

// Gemeinsamer Rahmen für Impressum, AGB und Datenschutz im Design von app/entwurf.
// Die Inhalte bleiben in den jeweiligen page.tsx; hier stehen nur Kopf, Fuß und Gestaltung.
const HOME = "/";
const PAGES = [
  { href: "/impressum", label: "Impressum" },
  { href: "/datenschutz", label: "Datenschutz" },
  { href: "/agb", label: "AGB" },
];

type Entry = { id: string; label: string };

export default function LegalPage({ title, meta, current, children }: { title: string; meta?: string; current: string; children: React.ReactNode }) {
  const body = useRef<HTMLDivElement>(null);
  const [toc, setToc] = useState<Entry[]>([]);
  const [active, setActive] = useState("");

  // Inhaltsverzeichnis aus den Abschnittsüberschriften, damit die Texte selbst unverändert bleiben.
  useEffect(() => {
    const root = body.current;
    if (!root) return;
    const heads = [...root.querySelectorAll<HTMLHeadingElement>(".legal-section h2")];
    const entries = heads.map((h, i) => {
      const id = h.id || `abschnitt-${i + 1}`;
      h.id = id;
      return { id, label: h.textContent ?? "" };
    });
    setToc(entries);
    const observer = new IntersectionObserver(items => {
      const visible = items.filter(item => item.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (visible) setActive(visible.target.id);
    }, { rootMargin: "-15% 0px -70% 0px" });
    heads.forEach(h => observer.observe(h));
    return () => observer.disconnect();
  }, []);

  const withToc = toc.length > 8;

  return (
    <div className="lx">
      <style>{CSS}</style>
      <header className="lx-head">
        <a className="lx-logo" href={HOME}>vinyos<span>QUOTE</span></a>
        <nav aria-label="Hauptnavigation"><a href={`${HOME}#entdecken`}>So funktioniert es</a><a href={`${HOME}#preise`}>Preise</a></nav>
        <div className="lx-actions"><a href={LOGIN_URL}>Anmelden</a><a className="lx-cta" href={SIGNUP_URL}>Kostenlos testen <span>↗</span></a></div>
      </header>

      <div className="lx-hero">
        <div className="lx-eyebrow">Rechtliches</div>
        <h1>{title}</h1>
        {meta && <p className="lx-meta">{meta}</p>}
      </div>

      <div className={withToc ? "lx-grid" : "lx-grid lx-grid-single"}>
        {withToc && (
          <aside className="lx-toc" aria-label="Inhalt">
            <div className="lx-toc-head">Inhalt</div>
            <ol>{toc.map(entry => <li key={entry.id}><a href={`#${entry.id}`} data-active={entry.id === active}>{entry.label}</a></li>)}</ol>
          </aside>
        )}
        <div className="lx-body" ref={body}>{children}</div>
      </div>

      <footer className="lx-foot">
        <span>© 2026 Vinyos AI UG</span>
        <nav>{PAGES.map(page => <a key={page.href} href={page.href} aria-current={page.href === current ? "page" : undefined}>{page.label}</a>)}</nav>
      </footer>
      <ContactWidget />
    </div>
  );
}

// Farbwerte mit denselben Namen wie in app/entwurf/motion-style.ts (auch für das Kontakt-Widget).
const CSS = `
html,body{background:#eef0ed}
.lx{--hm-bg:#eef0ed;--hm-white:#fafcf9;--hm-text:#1c302d;--hm-muted:#606e67;--hm-line:#cbd4ce;--hm-petrol:#286b63;
  --hm-display:var(--font-heading),sans-serif;--hm-body:var(--font-sans),sans-serif;--hm-mono:var(--font-mono),monospace;
  min-height:100svh;padding:0 5%;background:var(--hm-bg);color:var(--hm-text);font-family:var(--hm-body);font-size:14px;line-height:1.7;-webkit-font-smoothing:antialiased}
.lx *{box-sizing:border-box}
:where(.lx) a{color:inherit;text-decoration:none}
.lx a:focus-visible{outline:2px solid var(--hm-petrol);outline-offset:4px}

.lx-head{position:sticky;top:0;z-index:10;height:90px;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:24px;border-bottom:1px solid var(--hm-line);background:var(--hm-bg)}
.lx-logo{font:600 29px/1 var(--hm-display);letter-spacing:-1.7px;display:flex;align-items:baseline;gap:7px}
.lx-logo span{font:400 12px var(--hm-body);letter-spacing:.8px;color:var(--hm-muted)}
.lx-head nav{display:flex;gap:30px;font-size:12px}
.lx-actions{display:flex;justify-content:flex-end;align-items:center;gap:26px;font-size:12px}
.lx-head a:hover{filter:brightness(.8)}
.lx .lx-cta{display:inline-flex;align-items:center;gap:24px;padding:12px 17px;background:var(--hm-petrol);color:var(--hm-white);border-radius:5px;font-size:11px;font-weight:500}

.lx-hero{padding:clamp(48px,9vh,96px) 0 clamp(32px,5vh,56px);border-bottom:1px solid var(--hm-line)}
.lx-eyebrow{font:10px var(--hm-mono);letter-spacing:2px;text-transform:uppercase;color:var(--hm-petrol);margin-bottom:20px}
.lx-hero h1{font:500 clamp(36px,4.6vw,68px)/1.08 var(--hm-display);letter-spacing:-.055em;margin:0;max-width:900px;text-wrap:balance}
.lx-meta{font:10px/1.7 var(--hm-mono);letter-spacing:.8px;text-transform:uppercase;color:var(--hm-muted);margin:22px 0 0;max-width:720px}

.lx-grid{display:grid;grid-template-columns:minmax(200px,3fr) minmax(0,7fr);gap:6%;padding:clamp(36px,6vh,64px) 0 96px}
.lx-grid-single{grid-template-columns:minmax(0,1fr)}
.lx-grid-single .lx-body{max-width:760px}
.lx-toc{position:sticky;top:120px;align-self:start;max-height:calc(100svh - 150px);overflow:auto}
.lx-toc-head{font:9px var(--hm-mono);letter-spacing:1.4px;text-transform:uppercase;color:var(--hm-muted);padding-bottom:12px;border-bottom:1px solid var(--hm-line)}
.lx-toc ol{list-style:none;margin:0;padding:0}
.lx-toc a{display:block;padding:8px 0 8px 12px;border-left:2px solid transparent;font-size:12px;line-height:1.45;color:var(--hm-muted);transition:color .15s,border-color .15s}
.lx-toc a:hover{color:var(--hm-text)}
.lx-toc a[data-active=true]{color:var(--hm-petrol);border-left-color:var(--hm-petrol)}

.lx-body .legal-section{padding:0 0 30px;margin:0 0 30px;border-bottom:1px solid var(--hm-line);scroll-margin-top:120px}
.lx-body .legal-section:last-child{border-bottom:0}
.lx-body .legal-section h2{font:500 21px/1.3 var(--hm-display);letter-spacing:-.03em;color:var(--hm-text);margin:0 0 12px;scroll-margin-top:120px}
.lx-body .legal-section p{font-size:14px;line-height:1.8;color:var(--hm-muted);margin:0;max-width:720px}
.lx-body .legal-section p + p{margin-top:12px}
.lx-body .legal-section strong{color:var(--hm-text);font-weight:500}
.lx-body .legal-section a{color:var(--hm-petrol);border-bottom:1px solid color-mix(in srgb,var(--hm-petrol) 35%,transparent)}
.lx-body .legal-section a:hover{border-bottom-color:var(--hm-petrol)}
.lx-body .legal-table{width:100%;border-collapse:collapse;margin:4px 0 0;font-size:13px;background:var(--hm-white);border:1px solid var(--hm-line);border-radius:5px;overflow:hidden}
.lx-body .legal-table th{text-align:left;padding:10px 14px;font:9px var(--hm-mono);letter-spacing:1.2px;text-transform:uppercase;color:var(--hm-muted);border-bottom:1px solid var(--hm-line)}
.lx-body .legal-table td{padding:11px 14px;color:var(--hm-muted);border-bottom:1px solid var(--hm-line);vertical-align:top}
.lx-body .legal-table tr:last-child td{border-bottom:0}

.lx-foot{height:64px;display:flex;align-items:center;justify-content:space-between;gap:16px;border-top:1px solid var(--hm-line);font-size:11px;color:var(--hm-muted);padding-right:210px}
.lx-foot nav{display:flex;gap:22px}
.lx-foot a:hover,.lx-foot a[aria-current=page]{color:var(--hm-petrol)}

@media(max-width:959px){
  .lx-head{grid-template-columns:1fr auto;height:70px}
  .lx-head nav{display:none}
  .lx-grid{grid-template-columns:1fr}
  .lx-toc{display:none}
  .lx-foot{padding-right:0;flex-direction:column;justify-content:center;height:auto;padding:18px 0 80px;gap:8px}
}
@media(max-width:480px){
  .lx{padding:0 16px}
  .lx-logo{font-size:24px}
  .lx-actions>a:first-child{display:none}
  .lx-body .legal-table{display:block;overflow-x:auto}
}
`;
