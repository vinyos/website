"use client";

import { useEffect, useState, type FormEvent } from "react";

type ContactState = "idle" | "sending" | "done" | "error";

export default function ContactWidget() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("Frage zu Vinyos Quote");
  const [message, setMessage] = useState("");
  const [state, setState] = useState<ContactState>("idle");

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  const resetForm = () => {
    setName("");
    setEmail("");
    setSubject("Frage zu Vinyos Quote");
    setMessage("");
    setState("idle");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setState("sending");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });
      setState(response.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  };

  return (
    <>
      <style>{CSS}</style>
      {open && <div className="vc-contact-backdrop" onClick={() => setOpen(false)} aria-hidden="true" />}
      <div className="vc-contact-widget">
        {open && (
          <section className="vc-contact-panel" role="dialog" aria-modal="false" aria-labelledby="vc-contact-title">
            <div className="vc-contact-panel-head">
              <div>
                <span className="vc-contact-eyebrow">KONTAKT</span>
                <h2 id="vc-contact-title">Schreiben Sie uns</h2>
              </div>
              <button className="vc-contact-close" type="button" onClick={() => setOpen(false)} aria-label="Kontaktfenster schließen">×</button>
            </div>
            {state === "done" ? (
              <div className="vc-contact-success">
                <span className="vc-contact-check" aria-hidden="true">✓</span>
                <h3>Nachricht gesendet</h3>
                <p>Wir melden uns so bald wie möglich bei Ihnen.</p>
                <button type="button" className="vc-contact-secondary" onClick={resetForm}>Weitere Nachricht senden</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <p className="vc-contact-intro">Schildern Sie uns Ihre Frage. Wir antworten meist innerhalb eines Werktages.</p>
                <div className="vc-contact-fields">
                  <label>Name<input value={name} onChange={(event) => setName(event.target.value)} placeholder="Max Mustermann" required disabled={state === "sending"} /></label>
                  <label>E-Mail<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="name@firma.de" required disabled={state === "sending"} /></label>
                  <label>Betreff<select value={subject} onChange={(event) => setSubject(event.target.value)} disabled={state === "sending"}><option>Frage zu Vinyos Quote</option><option>Demo anfragen</option><option>Preise</option><option>Sonstiges</option></select></label>
                  <label>Nachricht<textarea value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Ihre Frage oder Nachricht …" rows={4} required disabled={state === "sending"} /></label>
                </div>
                {state === "error" && <p className="vc-contact-error">Die Nachricht konnte nicht gesendet werden. Bitte versuchen Sie es erneut oder schreiben Sie an <a href="mailto:kontakt@vinyos.de">kontakt@vinyos.de</a>.</p>}
                <button className="vc-contact-submit" type="submit" disabled={state === "sending"}>{state === "sending" ? "Wird gesendet …" : "Nachricht senden"}<span aria-hidden="true">↗</span></button>
              </form>
            )}
          </section>
        )}
        <button className="vc-contact-trigger" type="button" onClick={() => { if (!open) setState("idle"); setOpen((current) => !current); }} aria-expanded={open} aria-controls="vc-contact-title">
          <span className="vc-contact-trigger-dot" aria-hidden="true" />
          <span>{open ? "Fenster schließen" : "Nachricht schreiben"}</span>
        </button>
      </div>
    </>
  );
}

const CSS = `
.vc-contact-backdrop{position:fixed;inset:0;z-index:18;background:rgba(28,48,45,.08)}.vc-contact-widget{position:fixed;right:24px;bottom:24px;z-index:20;font-family:var(--hm-body,sans-serif);color:var(--hm-text,#1c302d)}.vc-contact-trigger{display:inline-flex;align-items:center;gap:10px;padding:13px 17px;border:1px solid var(--hm-line,#cbd4ce);border-radius:999px;background:var(--hm-white,#fafcf9);box-shadow:0 10px 28px rgba(28,48,45,.13);color:var(--hm-text,#1c302d);font:500 12px var(--hm-body,sans-serif);cursor:pointer;transition:transform .16s ease,box-shadow .16s ease}.vc-contact-trigger:hover{transform:translateY(-2px);box-shadow:0 14px 32px rgba(28,48,45,.18)}.vc-contact-trigger-dot{width:8px;height:8px;border-radius:50%;background:var(--hm-petrol,#286b63)}.vc-contact-panel{position:absolute;right:0;bottom:58px;width:min(390px,calc(100vw - 32px));padding:22px;border:1px solid var(--hm-line,#cbd4ce);border-radius:9px;background:var(--hm-white,#fafcf9);box-shadow:0 20px 60px rgba(28,48,45,.2)}.vc-contact-panel-head{display:flex;justify-content:space-between;gap:18px;align-items:flex-start;margin-bottom:16px}.vc-contact-eyebrow{display:block;margin-bottom:7px;color:var(--hm-petrol,#286b63);font:8px var(--hm-mono,monospace);letter-spacing:1.4px}.vc-contact-panel h2{margin:0;font:500 24px/1.1 var(--hm-display,sans-serif);letter-spacing:-.04em}.vc-contact-close{width:28px;height:28px;border:1px solid var(--hm-line,#cbd4ce);border-radius:50%;background:transparent;color:var(--hm-muted,#606e67);font:22px/1 var(--hm-body,sans-serif);cursor:pointer}.vc-contact-intro{margin:0 0 17px;color:var(--hm-muted,#606e67);font-size:11px;line-height:1.55}.vc-contact-fields{display:grid;gap:12px}.vc-contact-fields label{display:grid;gap:5px;color:var(--hm-text,#1c302d);font-size:10px}.vc-contact-fields input,.vc-contact-fields select,.vc-contact-fields textarea{width:100%;padding:10px 11px;border:1px solid var(--hm-line,#cbd4ce);border-radius:4px;background:var(--hm-bg,#eef0ed);color:var(--hm-text,#1c302d);font:400 12px/1.45 var(--hm-body,sans-serif);outline:0;resize:vertical}.vc-contact-fields input:focus,.vc-contact-fields select:focus,.vc-contact-fields textarea:focus{border-color:var(--hm-petrol,#286b63);box-shadow:0 0 0 2px color-mix(in srgb,var(--hm-petrol,#286b63) 14%,transparent)}.vc-contact-fields input::placeholder,.vc-contact-fields textarea::placeholder{color:var(--hm-muted,#606e67)}.vc-contact-error{margin:12px 0 0;color:#a14e46;font-size:10px;line-height:1.5}.vc-contact-error a{color:inherit}.vc-contact-submit{display:flex;align-items:center;justify-content:space-between;width:100%;margin-top:15px;padding:12px 14px;border:1px solid var(--hm-petrol,#286b63);border-radius:4px;background:var(--hm-petrol,#286b63);color:var(--hm-white,#fafcf9);font:500 11px var(--hm-body,sans-serif);cursor:pointer}.vc-contact-submit:disabled{opacity:.6;cursor:wait}.vc-contact-submit span{font-size:15px}.vc-contact-success{text-align:center;padding:18px 5px 5px}.vc-contact-check{display:grid;place-items:center;width:34px;height:34px;margin:0 auto 11px;border-radius:50%;background:color-mix(in srgb,var(--hm-petrol,#286b63) 14%,transparent);color:var(--hm-petrol,#286b63);font-size:19px}.vc-contact-success h3{margin:0 0 6px;font:500 18px var(--hm-display,sans-serif)}.vc-contact-success p{margin:0;color:var(--hm-muted,#606e67);font-size:11px}.vc-contact-secondary{margin-top:17px;padding:9px 12px;border:1px solid var(--hm-line,#cbd4ce);border-radius:4px;background:transparent;color:var(--hm-text,#1c302d);font-size:10px;cursor:pointer}@media(max-width:759px){.vc-contact-widget{right:14px;bottom:14px}.vc-contact-trigger{padding:11px 14px;font-size:11px}.vc-contact-panel{bottom:52px;padding:17px}.vc-contact-panel h2{font-size:21px}}
`;
