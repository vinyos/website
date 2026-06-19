"use client";
import { useEffect, useState } from "react";

/* Light/Dark-Umschalter — liest/schreibt data-theme auf <html> + localStorage.
   Das No-FOUC-Inline-Skript in layout.tsx setzt data-theme bereits vor dem Paint. */
export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");
    setTheme(current === "dark" ? "dark" : "light");
    setMounted(true);
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("vinyos-theme", next);
    } catch {
      /* localStorage evtl. blockiert — Umschalten funktioniert trotzdem für die Session */
    }
    // 3D-Hero & andere JS-Hörer informieren
    window.dispatchEvent(new Event("themechange"));
  };

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      className="lnd-theme-toggle"
      onClick={toggle}
      aria-label={isDark ? "Helles Design aktivieren" : "Dunkles Design aktivieren"}
      title={isDark ? "Helles Design" : "Dunkles Design"}
      suppressHydrationWarning
    >
      {mounted && isDark ? (
        // Sonne (im Dark-Mode angezeigt → wechselt zu Hell)
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      ) : (
        // Mond (im Light-Mode angezeigt → wechselt zu Dunkel)
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  );
}
