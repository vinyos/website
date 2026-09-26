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
          <svg className="vc-contact-trigger-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v11H9l-5 4z" /></svg>
          <span className="vc-contact-trigger-label">{open ? "Fenster schließen" : "Nachricht schreiben"}</span>
        </button>
      </div>
    </>
  );
}

const CSS = `
.vc-contact-backdrop{position:fixed;inset:0;z-index:18;background:rgba(28,48,45,.08)}.vc-contact-widget{position:fixed;right:calc(24*var(--hm-u));bottom:calc(24*var(--hm-u));z-index:20;font-family:var(--hm-body,sans-serif);color:var(--hm-text,#1c302d)}.vc-contact-trigger{display:inline-flex;align-items:center;gap:calc(10*var(--hm-u));padding:calc(13*var(--hm-u)) calc(17*var(--hm-u));border:1px solid var(--hm-line,#cbd4ce);border-radius:calc(999*var(--hm-u));background:var(--hm-white,#fafcf9);box-shadow:0 calc(10*var(--hm-u)) calc(28*var(--hm-u)) rgba(28,48,45,.13);color:var(--hm-text,#1c302d);font:500 calc(14*var(--hm-u)) var(--hm-body,sans-serif);cursor:pointer;transition:transform .16s ease,box-shadow .16s ease}.vc-contact-trigger:hover{transform:translateY(-2px);box-shadow:0 calc(14*var(--hm-u)) calc(32*var(--hm-u)) rgba(28,48,45,.18)}.vc-contact-trigger-dot{width:calc(8*var(--hm-u));height:calc(8*var(--hm-u));border-radius:50%;background:var(--hm-petrol,#286b63)}.vc-contact-panel{position:absolute;right:0;bottom:calc(58*var(--hm-u));width:min(calc(390*var(--hm-u)),calc(100vw - calc(32*var(--hm-u))));padding:calc(22*var(--hm-u));border:1px solid var(--hm-line,#cbd4ce);border-radius:calc(9*var(--hm-u));background:var(--hm-white,#fafcf9);box-shadow:0 calc(20*var(--hm-u)) calc(60*var(--hm-u)) rgba(28,48,45,.2)}.vc-contact-panel-head{display:flex;justify-content:space-between;gap:calc(18*var(--hm-u));align-items:flex-start;margin-bottom:calc(16*var(--hm-u))}.vc-contact-eyebrow{display:block;margin-bottom:calc(7*var(--hm-u));color:var(--hm-petrol,#286b63);font:calc(11*var(--hm-u)) var(--hm-mono,monospace);letter-spacing:1.4px}.vc-contact-panel h2{margin:0;font:500 calc(24*var(--hm-u))/1.1 var(--hm-display,sans-serif);letter-spacing:-.04em}.vc-contact-close{width:calc(28*var(--hm-u));height:calc(28*var(--hm-u));border:1px solid var(--hm-line,#cbd4ce);border-radius:50%;background:transparent;color:var(--hm-muted,#606e67);font:calc(22*var(--hm-u))/1 var(--hm-body,sans-serif);cursor:pointer}.vc-contact-intro{margin:0 0 calc(17*var(--hm-u));color:var(--hm-muted,#606e67);font-size:calc(13*var(--hm-u));line-height:1.55}.vc-contact-fields{display:grid;gap:calc(12*var(--hm-u))}.vc-contact-fields label{display:grid;gap:calc(5*var(--hm-u));color:var(--hm-text,#1c302d);font-size:calc(13*var(--hm-u))}.vc-contact-fields input,.vc-contact-fields select,.vc-contact-fields textarea{width:100%;padding:calc(10*var(--hm-u)) calc(11*var(--hm-u));border:1px solid var(--hm-line,#cbd4ce);border-radius:calc(4*var(--hm-u));background:var(--hm-bg,#eef0ed);color:var(--hm-text,#1c302d);font:400 calc(14*var(--hm-u))/1.45 var(--hm-body,sans-serif);outline:0;resize:vertical}.vc-contact-fields input:focus,.vc-contact-fields select:focus,.vc-contact-fields textarea:focus{border-color:var(--hm-petrol,#286b63);box-shadow:0 0 0 2px color-mix(in srgb,var(--hm-petrol,#286b63) 14%,transparent)}.vc-contact-fields input::placeholder,.vc-contact-fields textarea::placeholder{color:var(--hm-muted,#606e67)}.vc-contact-error{margin:calc(12*var(--hm-u)) 0 0;color:#a14e46;font-size:calc(13*var(--hm-u));line-height:1.5}.vc-contact-error a{color:inherit}.vc-contact-submit{display:flex;align-items:center;justify-content:space-between;width:100%;margin-top:calc(15*var(--hm-u));padding:calc(12*var(--hm-u)) calc(14*var(--hm-u));border:1px solid var(--hm-petrol,#286b63);border-radius:calc(4*var(--hm-u));background:var(--hm-petrol,#286b63);color:var(--hm-white,#fafcf9);font:500 calc(13*var(--hm-u)) var(--hm-body,sans-serif);cursor:pointer}.vc-contact-submit:disabled{opacity:.6;cursor:wait}.vc-contact-submit span{font-size:calc(16*var(--hm-u))}.vc-contact-success{text-align:center;padding:calc(18*var(--hm-u)) calc(5*var(--hm-u)) calc(5*var(--hm-u))}.vc-contact-check{display:grid;place-items:center;width:calc(34*var(--hm-u));height:calc(34*var(--hm-u));margin:0 auto calc(11*var(--hm-u));border-radius:50%;background:color-mix(in srgb,var(--hm-petrol,#286b63) 14%,transparent);color:var(--hm-petrol,#286b63);font-size:calc(19*var(--hm-u))}.vc-contact-success h3{margin:0 0 calc(6*var(--hm-u));font:500 calc(18*var(--hm-u)) var(--hm-display,sans-serif)}.vc-contact-success p{margin:0;color:var(--hm-muted,#606e67);font-size:calc(13*var(--hm-u))}.vc-contact-secondary{margin-top:calc(17*var(--hm-u));padding:calc(9*var(--hm-u)) calc(12*var(--hm-u));border:1px solid var(--hm-line,#cbd4ce);border-radius:calc(4*var(--hm-u));background:transparent;color:var(--hm-text,#1c302d);font-size:calc(13*var(--hm-u));cursor:pointer}.vc-contact-trigger-icon{display:none}
@media(max-width:759px){.vc-contact-trigger{width:calc(48*var(--hm-u));height:calc(48*var(--hm-u));padding:0;justify-content:center;border-radius:50%}.vc-contact-trigger-dot{display:none}.vc-contact-trigger-icon{display:block;width:calc(20*var(--hm-u));height:calc(20*var(--hm-u));fill:none;stroke:currentColor;stroke-width:1.6;stroke-linejoin:round}.vc-contact-trigger-label{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}}
@media(max-width:759px){.vc-contact-widget{right:calc(14*var(--hm-u));bottom:calc(14*var(--hm-u))}.vc-contact-panel{bottom:calc(52*var(--hm-u));padding:calc(17*var(--hm-u))}.vc-contact-panel h2{font-size:calc(21*var(--hm-u))}}
`;
