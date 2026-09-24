export const DRAWING_SIZE = { width: 3309, height: 2339 } as const;

export type DrawingHighlight = {
  nr: number;
  kategorie: string;
  wert: string;
  ausleseHeute: boolean;
  pngPx: [number, number, number, number];
  vorkommen?: string;
  details?: { label: string; value: string }[];
};

export const DRAWING_HIGHLIGHTS: DrawingHighlight[] = [
  {
    "nr": 1,
    "kategorie": "Oberflaeche",
    "wert": "Ra 1,6",
    "ausleseHeute": true,
    "pngPx": [
      702,
      207,
      767,
      249
    ],
    "vorkommen": "1/2"
  },
  {
    "nr": 2,
    "kategorie": "Oberflaeche",
    "wert": "Ra 1,6",
    "ausleseHeute": true,
    "pngPx": [
      883,
      241,
      948,
      282
    ],
    "vorkommen": "2/2"
  },
  {
    "nr": 3,
    "kategorie": "Oberflaeche",
    "wert": "Rz 6,3",
    "ausleseHeute": true,
    "pngPx": [
      1017,
      272,
      1085,
      314
    ]
  },
  {
    "nr": 4,
    "kategorie": "Radius",
    "wert": "8x R3",
    "ausleseHeute": false,
    "pngPx": [
      1896,
      321,
      1958,
      363
    ]
  },
  {
    "nr": 5,
    "kategorie": "Fase",
    "wert": "1,5 x 45°",
    "ausleseHeute": true,
    "pngPx": [
      1211,
      762,
      1307,
      804
    ]
  },
  {
    "nr": 6,
    "kategorie": "Werkstoff",
    "wert": "42CrMo4+QT (1.7225)",
    "ausleseHeute": true,
    "pngPx": [
      2364,
      833,
      2579,
      875
    ]
  },
  {
    "nr": 7,
    "kategorie": "Masztoleranz",
    "wert": "80 ±0,05",
    "ausleseHeute": true,
    "pngPx": [
      684,
      834,
      785,
      881
    ]
  },
  {
    "nr": 8,
    "kategorie": "ISO-Passung",
    "wert": "⌀48 h7",
    "ausleseHeute": true,
    "pngPx": [
      1786,
      1046,
      1864,
      1087
    ],
    "vorkommen": "2/2"
  },
  {
    "nr": 9,
    "kategorie": "Allgemeintoleranz",
    "wert": "ISO 2768-mK",
    "ausleseHeute": true,
    "pngPx": [
      2467,
      1126,
      2604,
      1168
    ]
  },
  {
    "nr": 10,
    "kategorie": "Oberflaeche",
    "wert": "Ra 3,2 (Sammelangabe)",
    "ausleseHeute": true,
    "pngPx": [
      2293,
      1367,
      2360,
      1408
    ]
  },
  {
    "nr": 11,
    "kategorie": "Kantenangabe",
    "wert": "Kanten ISO 13715 -0,3",
    "ausleseHeute": false,
    "pngPx": [
      2614,
      1412,
      2819,
      1449
    ]
  },
  {
    "nr": 12,
    "kategorie": "Bezug",
    "wert": "A (Bezugsdreieck, Flanschstirnflaeche)",
    "ausleseHeute": false,
    "pngPx": [
      180,
      1648,
      198,
      1696
    ]
  },
  {
    "nr": 13,
    "kategorie": "ISO-Passung",
    "wert": "⌀56,5 h9",
    "ausleseHeute": true,
    "pngPx": [
      654,
      1685,
      762,
      1732
    ]
  },
  {
    "nr": 14,
    "kategorie": "ISO-Passung",
    "wert": "⌀48 h7",
    "ausleseHeute": true,
    "pngPx": [
      843,
      1685,
      931,
      1732
    ],
    "vorkommen": "1/2"
  },
  {
    "nr": 15,
    "kategorie": "Form-/Lagetoleranz",
    "wert": "⊥ 0,02",
    "ausleseHeute": true,
    "pngPx": [
      894,
      1745,
      940,
      1792
    ]
  },
  {
    "nr": 16,
    "kategorie": "Bezug",
    "wert": "A (Toleranzrahmen)",
    "ausleseHeute": false,
    "pngPx": [
      962,
      1745,
      980,
      1792
    ]
  },
  {
    "nr": 17,
    "kategorie": "Form-/Lagetoleranz",
    "wert": "⊥ (Symbol)",
    "ausleseHeute": true,
    "pngPx": [
      852,
      1761,
      873,
      1790
    ]
  },
  {
    "nr": 18,
    "kategorie": "Gewinde",
    "wert": "M36 x 2 - 6H, 22 tief",
    "ausleseHeute": false,
    "pngPx": [
      953,
      1779,
      1219,
      1826
    ]
  }
];

// Symbol, Wert und Bezug bilden gemeinsam einen Toleranzrahmen.
const gdtParts = DRAWING_HIGHLIGHTS.filter(({ nr }) => [15, 16, 17].includes(nr));
export const DRAWING_FEATURES: DrawingHighlight[] = DRAWING_HIGHLIGHTS
  .filter(({ nr }) => nr !== 16 && nr !== 17)
  .map((entry) => entry.nr === 15 ? {
    ...entry,
    kategorie: "GD&T",
    wert: "Rechtwinkligkeit",
    ausleseHeute: gdtParts.every((part) => part.ausleseHeute),
    pngPx: [
      Math.min(...gdtParts.map((part) => part.pngPx[0])),
      Math.min(...gdtParts.map((part) => part.pngPx[1])),
      Math.max(...gdtParts.map((part) => part.pngPx[2])),
      Math.max(...gdtParts.map((part) => part.pngPx[3])),
    ] as [number, number, number, number],
    details: [
      { label: "Symbol", value: "⊥" },
      { label: "Toleranzwert", value: "0,02 mm" },
      { label: "Bezug", value: "A" },
    ],
  } : entry);
