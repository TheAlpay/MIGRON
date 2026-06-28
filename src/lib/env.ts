import { z } from 'zod';

// ── Client-side environment variables (VITE_ prefix, bundled into the browser) ──
const clientEnvSchema = z.object({
  // ── Firebase (all required) ───────────────────────────────────────────────
  VITE_FIREBASE_API_KEY:            z.string().min(1, 'VITE_FIREBASE_API_KEY is required'),
  VITE_FIREBASE_AUTH_DOMAIN:        z.string().min(1, 'VITE_FIREBASE_AUTH_DOMAIN is required'),
  VITE_FIREBASE_PROJECT_ID:         z.string().min(1, 'VITE_FIREBASE_PROJECT_ID is required'),
  VITE_FIREBASE_STORAGE_BUCKET:     z.string().min(1, 'VITE_FIREBASE_STORAGE_BUCKET is required'),
  VITE_FIREBASE_MESSAGING_SENDER_ID:z.string().min(1, 'VITE_FIREBASE_MESSAGING_SENDER_ID is required'),
  VITE_FIREBASE_APP_ID:             z.string().min(1, 'VITE_FIREBASE_APP_ID is required'),
  // Optional — only needed when Google Analytics is active
  VITE_FIREBASE_MEASUREMENT_ID:     z.string().optional(),

  // ── Site identity (required) ──────────────────────────────────────────────
  VITE_SITE_URL: z.string().url('VITE_SITE_URL must be a valid URL'),

  // ── External API base URLs (optional — defaults built into src/config/api.ts) ──
  VITE_FRANKFURTER_API_URL: z.string().url().optional(),
  VITE_COINGECKO_API_URL:   z.string().url().optional(),
  VITE_GOLD_API_URL:        z.string().url().optional(),

  // ── Optional / future integrations ───────────────────────────────────────
  VITE_OPENWEATHER_API_KEY:    z.string().optional(),
  VITE_WAQI_API_KEY:           z.string().optional(),
  VITE_WINDY_WEBCAMS_KEY:      z.string().optional(),
  VITE_NSW_TRANSPORT_API_KEY:  z.string().optional(),
});

const parsed = clientEnvSchema.safeParse(import.meta.env);

if (!parsed.success) {
  const errors = parsed.error.flatten().fieldErrors;
  console.error('❌ Missing or invalid environment variables:', errors);
  throw new Error(
    `Environment configuration error — check your .env file.\n` +
    Object.entries(errors)
      .map(([key, msgs]) => `  ${key}: ${msgs?.join(', ')}`)
      .join('\n')
  );
}

export const env = parsed.data;
