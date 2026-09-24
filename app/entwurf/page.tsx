import { permanentRedirect } from "next/navigation";

// Der Entwurf ist seit dem 24.09.2026 die Startseite. Alte Vorschau-Links führen dorthin.
export default function Entwurf() {
  permanentRedirect("/");
}
