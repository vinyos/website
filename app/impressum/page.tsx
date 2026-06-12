import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { CONTACT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Impressum",
  robots: { index: false },
};

export default function Impressum() {
  return (
    <LegalPage title="Impressum">
      <h2>Angaben gemäß § 5 DDG</h2>
      <p>
        Vinyos AI UG (haftungsbeschränkt)
        <br />
        Am Schlangensee 137
        <br />
        64807 Dieburg
      </p>

      <h2>Vertreten durch</h2>
      <p>Geschäftsführer: Toni Vogt, Jan Philip Walter, Henri Vogt</p>

      <h2>Kontakt</h2>
      <p>
        Telefon: +49 1515 39111466
        <br />
        E-Mail: {CONTACT_EMAIL}
      </p>

      <h2>Umsatzsteuer-ID</h2>
      <p>
        Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG:
        <br />
        DE458264288
      </p>

      <h2>Registereintrag</h2>
      <p>
        Eingetragen im Handelsregister.
        <br />
        Registergericht: Amtsgericht Darmstadt
        <br />
        Registernummer: HRB 108318
      </p>

      <h2>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
      <p>
        Jan Philip Walter
        <br />
        Anschrift wie oben
      </p>

      <h2>Verbraucherstreitbeilegung / Universalschlichtungsstelle</h2>
      <p>
        Vinyos AI UG (haftungsbeschränkt) richtet sich ausschließlich an
        Unternehmer (B2B) und ist nicht bereit oder verpflichtet, an
        Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
        teilzunehmen.
      </p>
    </LegalPage>
  );
}
