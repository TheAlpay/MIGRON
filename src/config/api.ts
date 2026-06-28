import { env } from '../lib/env';

// ── External API base URLs ────────────────────────────────────────────────────
// Can be overridden via VITE_* env vars (e.g. to point at a proxy or test server).
// Defaults are the canonical public endpoints.

export const FRANKFURTER_BASE = env.VITE_FRANKFURTER_API_URL ?? 'https://api.frankfurter.dev/v1';
export const COINGECKO_BASE   = env.VITE_COINGECKO_API_URL   ?? 'https://api.coingecko.com/api/v3';
export const GOLD_API_BASE    = env.VITE_GOLD_API_URL         ?? 'https://api.gold-api.com/price';
