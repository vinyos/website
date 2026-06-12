// Next.js 16 Instrumentation-Hook.
// Lädt die laufzeit-spezifische Sentry-Config und meldet Server-Fehler an Sentry.
import * as Sentry from "@sentry/nextjs";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }
  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}

// Fängt Fehler aus Server Components, Route Handlers etc. ab.
export const onRequestError = Sentry.captureRequestError;
