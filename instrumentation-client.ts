// Sentry – Client-Runtime Konfiguration (Browser).
// Next.js 16 lädt diese Datei automatisch vor dem App-Code (instrumentation-client).
//
// Datensparsam by default: keine PII, kein Session-Replay, niedriges Tracing.
import * as Sentry from "@sentry/nextjs";

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

Sentry.init({
  dsn,
  enabled: !!dsn,
  // DSGVO: keine personenbezogenen Daten senden, kein Replay.
  sendDefaultPii: false,
  tracesSampleRate: 0.1,
  environment: process.env.NEXT_PUBLIC_VERCEL_ENV ?? process.env.NODE_ENV,
  debug: false,
});

// Erforderlich für Navigations-Instrumentierung im App Router.
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
