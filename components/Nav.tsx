"use client";
import { useState } from "react";
import { APP_URL } from "@/lib/site";

const CSS = `
.nav {
  position: sticky; top: 0; z-index: 50;
  background: rgba(26, 28, 34, 0.86);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
}
.nav-inner {
  max-width: var(--maxw); margin: 0 auto; padding: 0 24px;
  height: 64px; display: flex; align-items: center; gap: 32px;
}
.nav-brand { display: flex; align-items: center; gap: 10px; color: var(--tx); }
.nav-brand svg { color: var(--blue); flex-shrink: 0; }
.nav-brand b { font-size: 16px; font-weight: 600; letter-spacing: -0.01em; }
.nav-brand span { font-size: 16px; font-weight: 400; color: var(--t2); margin-left: -6px; }
.nav-links { display: flex; gap: 26px; margin-left: 8px; }
.nav-links a { font-size: 14.5px; color: var(--t2); transition: color 0.15s ease; }
.nav-links a:hover { color: var(--tx); }
.nav-cta { margin-left: auto; display: flex; align-items: center; gap: 10px; }
.nav-cta .btn { height: 38px; padding: 0 16px; font-size: 14px; }
.nav-burger {
  display: none; margin-left: auto;
  background: none; border: 1px solid var(--border-s); border-radius: var(--radius-md);
  color: var(--t1); width: 38px; height: 38px; cursor: pointer;
  align-items: center; justify-content: center;
}
.nav-mobile { display: none; }
@media (max-width: 880px) {
  .nav-links, .nav-cta { display: none; }
  .nav-burger { display: flex; }
  .nav-mobile.open {
    display: flex; flex-direction: column; gap: 4px;
    padding: 12px 24px 20px; border-top: 1px solid var(--border);
    background: var(--deep);
  }
  .nav-mobile a { padding: 10px 0; font-size: 15px; color: var(--t1); }
  .nav-mobile .btn { margin-top: 10px; }
}
`;

const LINKS = [
  { href: "#funktionsweise", label: "Funktionsweise" },
  { href: "#leistungen", label: "Leistungen" },
  { href: "#vertrauen", label: "Sicherheit" },
  { href: "#preise", label: "Preise" },
  { href: "#faq", label: "FAQ" },
];

const Logomark = () => (
  <svg width="26" height="26" viewBox="0 0 32 32" fill="none" aria-hidden="true">
    <g stroke="currentColor" strokeWidth="2" strokeLinecap="square" fill="none">
      <path d="M5 8 L5 26 L10 26" />
      <path d="M27 8 L27 26 L22 26" />
      <path d="M10 22 L22 22" />
      <path d="M16 22 L16 10" />
    </g>
  </svg>
);

export default function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="nav">
      <style>{CSS}</style>
      <div className="nav-inner">
        <a href="#top" className="nav-brand" aria-label="Vinyos Quote — Startseite">
          <Logomark />
          <b>vinyos</b>
          <span>quote</span>
        </a>
        <nav className="nav-links" aria-label="Hauptnavigation">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href}>{l.label}</a>
          ))}
        </nav>
        <div className="nav-cta">
          <a className="btn btn-ghost" href={APP_URL}>Anmelden</a>
          <a className="btn btn-primary" href={APP_URL}>Kostenlos testen</a>
        </div>
        <button
          className="nav-burger"
          aria-label={open ? "Menü schließen" : "Menü öffnen"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            {open
              ? <path d="M3 3l12 12M15 3L3 15" />
              : <path d="M2 5h14M2 9h14M2 13h14" />}
          </svg>
        </button>
      </div>
      <div className={`nav-mobile${open ? " open" : ""}`}>
        {LINKS.map((l) => (
          <a key={l.href} href={l.href} onClick={() => setOpen(false)}>{l.label}</a>
        ))}
        <a className="btn btn-ghost" href={APP_URL}>Anmelden</a>
        <a className="btn btn-primary" href={APP_URL}>Kostenlos testen</a>
      </div>
    </header>
  );
}
