// Sentry – Edge-Runtime Konfiguration (Middleware, Edge-Routes).
// Wird von instrumentation.ts geladen, wenn NEXT_RUNTIME === "edge".
//
// Datensparsam by default: keine PII, niedrige Trace-Sampling-Rate.
import * as Sentry from "@sentry/nextjs";

const dsn = process.env.SENTRY_DSN ?? process.env.NEXT_PUBLIC_SENTRY_DSN;

Sentry.init({
  dsn,
  enabled: !!dsn,
  sendDefaultPii: false,
  tracesSampleRate: 0.1,
  environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV,
  debug: false,
});
