export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://app.vinyos.de";
export const LOGIN_URL = `${APP_URL}/login`;
export const SIGNUP_URL = `${LOGIN_URL}?view=signup`;

// short: ein Satz für Bildschirme unter 760 px, dort entfallen die Listen und Tabellen.
export const CHAPTERS = [
  { label: "Überblick", eyebrow: "FÜR DREH- UND FRÄSTEILE", title: "CNC-Teile kalkulieren.\nIn unter 60 Sekunden.", body: "", segment: -1, side: "center", kind: "hero", short: "" },
  { label: "Das Problem", eyebrow: "DAS PROBLEM", title: "Kalkulation frisst Zeit,\ndie Ihnen woanders fehlt.", body: "Von Hand zu kalkulieren bindet Ihre besten Leute. Teil für Teil.", segment: 0, side: "right", kind: "problem", short: "Von Hand zu kalkulieren bindet Ihre besten Leute bei jedem Teil." },
  { label: "Der Ablauf", eyebrow: "DER ABLAUF", title: "So läuft ein Teil\ndurch Vinyos Quote.", body: "STEP und PDF werden parallel analysiert. Die Geometrie kommt aus der STEP-Datei, Toleranzen und Oberflächenangaben aus dem PDF. Vinyos Quote ordnet alles im Modell zu, damit Sie die Ergebnisse prüfen und den Preis mit einem Klick kalkulieren können.", segment: 1, side: "left", kind: "process", short: "Vinyos Quote liest STEP und PDF gleichzeitig aus, damit Sie den Preis mit einem Klick kalkulieren." },
  { label: "Präzision", eyebrow: "PRÄZISION", title: "Jede Anforderung.\nAm richtigen Detail.", body: "Form- und Lagetoleranzen, ISO-Klassen und Oberflächenangaben werden aus der Zeichnung ausgelesen und in die STEP-Geometrie eingefügt. So erhält jedes Feature die passende Anforderung. Sie können jede Zuordnung prüfen und bearbeiten.", segment: 2, side: "right", kind: "precision", short: "Vinyos Quote überträgt Toleranzen und Oberflächen aus der Zeichnung an das passende Feature im Modell." },
  { label: "Kalkulation", eyebrow: "KALKULATION", title: "Ihre Maschinen.\nIhr Angebotspreis.", body: "Schnittzeiten, Rüstkosten und Material werden regelbasiert berechnet. Ihre Stundensätze, Gemeinkosten und Marge fließen in die Kalkulation ein.", segment: 3, side: "left", kind: "calculation", short: "Vinyos Quote rechnet mit Ihren Stundensätzen, Gemeinkosten und Ihrer Marge." },
  { label: "Funktionen", eyebrow: "DER ANGEBOTSPROZESS", title: "Ein Werkzeug.\nVom Teil zum Angebot.", body: "Ihre Maschinen, Werkstoffe und Kundennormen bilden die gemeinsame Grundlage. Sie berechnen Mengenstaffeln und erstellen Angebote mit Ihrem Logo.", segment: 4, side: "right", kind: "features", short: "Sie berechnen Mengenstaffeln und erstellen Angebote mit Ihrem Logo." },
  { label: "Kostenlos testen", eyebrow: "IHRE ENTSCHEIDUNG", title: "Ihr nächstes Teil.\nIhre erste Kalkulation.", body: "Bestätigen Sie Maschine und Rohteil, prüfen Sie den Preis und erstellen Sie Ihr Angebots-PDF. Testen Sie Vinyos Quote mit Ihren eigenen Dreh- und Frästeilen.", segment: -1, side: "left", kind: "trial", short: "Testen Sie Vinyos Quote mit Ihren eigenen Dreh- und Frästeilen." },
] as const;

import type { Feature } from "./feature-surfaces";
export type Detail = { label: string; value: string; source: string; note: string; point: [number, number, number]; kind: Feature; };
// Maße: docs/hero-teil-2/teil.json. Oberflächen und Toleranzklasse: zeichnung.py / Zeichnungs-PDF.
// Gewindetiefe wird nicht gezeigt: Modell-Metadaten und Zeichnung nennen unterschiedliche Werte.
export const DETAILS: Detail[][] = [
  [
    { label: "Frästasche", value: "Eckenradius R3", note: "Taschenboden und Wände", source: "STEP", point: [-18,18,6], kind: "tasche" },
    { label: "Bohrung", value: "⌀4,13 mm", note: "4 Bohrungen im Lochkreis", source: "STEP", point: [0,24.567,1.5], kind: "bohrung" },
    { label: "Zylindersenkung", value: "⌀8 mm", note: "1,3 mm tief · 4 Positionen", source: "STEP", point: [26.5,0,.75], kind: "bohrung" },
  ],
  [
    { label: "Querbohrung", value: "⌀8 mm", note: "2 Achsen · 90° versetzt", source: "STEP", point: [-27.97,0,49], kind: "bohrung" },
    { label: "Oberfläche", value: "Ra 1,6", note: "Zeichnungsvorgabe am Mantel", source: "PDF", point: [-22,-17.72,35], kind: "flaeche" },
  ],
  [
    { label: "Freistich", value: "E 1,6 × 0,5", note: "DIN 509 · am Absatz", source: "STEP + PDF", point: [23.5,0,62.5], kind: "nut" },
    { label: "O-Ring-Nut", value: "4 × 2,5 mm", note: "Breite × Tiefe · ⌀43 mm", source: "STEP + PDF", point: [0,21.5,72], kind: "nut" },
  ],
  [
    { label: "Oberfläche", value: "Ra 1,6", note: "Am Schaft mit ⌀48 mm", source: "PDF", point: [-16.97056,16.97056,78], kind: "flaeche" },
  ],
  [
    { label: "Innengewinde", value: "M36 × 2 · 6H", note: "2 mm Steigung · ISO 965-1", source: "PDF + STEP", point: [17,0,98], kind: "gewinde" },
    { label: "Fase", value: "1,5 × 45°", note: "Außenkante am Gewindekopf", source: "STEP", point: [-23.25,0,102.55], kind: "fraesen" },
  ],
];

// Jeder Abschnitt hält ein Segment auf einer Seite. Andere Segmente verlassen die Bühne ohne Transparenz.
const visibility = (segment: number) => Object.fromEntries(Array.from({length:5},(_,i)=>[`s${i}`,segment<0||segment===i?1:0])) as Record<`s${number}`,number>;
export const STOPS = [
  { rx:-.56, ry:.9, rz:-.44, x:0, y:-27, scale:1.08, assembly:1, ...visibility(-1) },
  { rx:.28, ry:Math.PI+.55, rz:-.24, x:-.16, y:0, scale:1.5, assembly:0, ...visibility(0) },
  { rx:-.32, ry:1.02, rz:-.25, x:.16, y:0, scale:1.8, assembly:0, ...visibility(1) },
  { rx:.3, ry:.58, rz:.15, x:-.16, y:0, scale:2.35, assembly:0, ...visibility(2) },
  { rx:-.35, ry:1.1, rz:-.32, x:.16, y:0, scale:2.35, assembly:0, ...visibility(3) },
  { rx:.32, ry:.4, rz:-.28, x:-.16, y:0, scale:2.2, assembly:0, ...visibility(4) },
  { rx:-.5, ry:1.05, rz:-.4, x:.15, y:0, scale:1.05, assembly:1, ...visibility(-1) }, // Abschluss näher zur Mitte, hier stehen keine Beschriftungen
];
