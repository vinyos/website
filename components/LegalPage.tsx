import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const CSS = `
.legal { padding: 72px 0 96px; min-height: 50vh; }
.legal-inner { max-width: 760px; margin: 0 auto; padding: 0 24px; }
.legal h1 { font-size: 32px; font-weight: 600; letter-spacing: -0.02em; color: var(--tx); }
.legal h2 { font-size: 19px; font-weight: 600; color: var(--tx); margin-top: 40px; }
.legal p { font-size: 15px; color: var(--t2); line-height: 1.7; margin-top: 12px; }
.legal .placeholder {
  display: block; margin-top: 12px; padding: 14px 18px;
  background: rgba(201,123,61,0.08); border: 1px dashed var(--copper);
  border-radius: var(--radius-md);
  font-family: var(--f-mono); font-size: 13px; color: var(--copper-s); line-height: 1.6;
}
`;

export default function LegalPage({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <Nav />
      <main className="legal">
        <style>{CSS}</style>
        <div className="legal-inner">
          <h1>{title}</h1>
          {children}
        </div>
      </main>
      <Footer />
    </>
  );
}
