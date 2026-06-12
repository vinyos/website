// Sentry – Server-Runtime (Node.js) Konfiguration.
// Wird von instrumentation.ts geladen, wenn NEXT_RUNTIME === "nodejs".
//
// Datensparsam by default: keine PII, niedrige Trace-Sampling-Rate.
// DSN per Env (SENTRY_DSN bzw. NEXT_PUBLIC_SENTRY_DSN als Fallback).
import * as Sentry from "@sentry/nextjs";

const dsn = process.env.SENTRY_DSN ?? process.env.NEXT_PUBLIC_SENTRY_DSN;

Sentry.init({
  dsn,
  // Nur aktiv, wenn ein DSN gesetzt ist (sonst No-Op).
  enabled: !!dsn,
  // DSGVO: keine personenbezogenen Daten (IP, Cookies, Header-Inhalte) senden.
  sendDefaultPii: false,
  // Niedrige Sampling-Rate für Performance-Tracing.
  tracesSampleRate: 0.1,
  // Environment aus Vercel ableiten (production / preview / development).
  environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV,
  // Nur loggen, wenn explizit gewünscht.
  debug: false,
});
