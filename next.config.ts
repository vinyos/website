import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {};

// Sentry-Build-Wrapping (Source-Maps, Tunnel, Tree-Shaking).
// Org/Project per Env (SENTRY_ORG / SENTRY_PROJECT); ohne Auth-Token werden
// beim Build keine Source-Maps hochgeladen – Runtime-Error-Tracking bleibt aktiv.
export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  // Build-Logs nur in CI ausführlich.
  silent: !process.env.CI,
  // Source-Maps nach Upload aus dem Client-Bundle entfernen.
  sourcemaps: { deleteSourcemapsAfterUpload: true },
  // Werbe-/Tracking-Blocker umgehen: Sentry-Requests über eigene Route tunneln.
  tunnelRoute: "/monitoring",
  // Vercel Cron-Monitor-Instrumentierung aus (nicht genutzt).
  automaticVercelMonitors: false,
  // DSGVO/Datensparsam: keine zusätzliche Telemetrie an Sentry über den Build.
  telemetry: false,
});
