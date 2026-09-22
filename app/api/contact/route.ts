import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { name, email, subject, message } = await req.json();

  if (!name || !email || !subject || !message) {
    return NextResponse.json({ error: "Alle Felder sind erforderlich." }, { status: 400 });
  }

  const { error } = await resend.emails.send({
    from: "Vinyos Kontaktformular <kontakt@vinyos.de>",
    to: "kontakt@vinyos.de",
    replyTo: email,
    subject: `[${subject}] ${name}`,
    text: `Name: ${name}\nE-Mail: ${email}\nBetreff: ${subject}\n\nNachricht:\n${message}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; color: #333;">
        <h2 style="margin-bottom: 8px;">Neue Kontaktanfrage</h2>
        <p><strong>Name:</strong> ${esc(name)}</p>
        <p><strong>E-Mail:</strong> <a href="mailto:${esc(email)}">${esc(email)}</a></p>
        <p><strong>Betreff:</strong> ${esc(subject)}</p>
        <hr style="border:none;border-top:1px solid #eee;margin:16px 0;" />
        <p style="white-space:pre-wrap;">${esc(message)}</p>
      </div>
    `,
  });

  if (error) {
    console.error("Resend error:", error);
    return NextResponse.json({ error: "E-Mail konnte nicht gesendet werden." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

/**
 * Entschärft alle vier Formularfelder für die HTML-Fassung der Mail. Vorher
 * wurde nur "<" in der Nachricht ersetzt, wodurch Anführungszeichen und
 * spitze Klammern in Name, E-Mail und Betreff ungeschützt blieben. Wer sie
 * verwendet, kann aus dem vorgesehenen Kontext ausbrechen. Reihenfolge ist
 * wichtig: das kaufmännische Und zuerst, sonst werden die eigenen
 * Ersetzungen wieder zerstört.
 */
function esc(s: string): string {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
