import { z } from "zod";

/**
 * Server-side environment contract. Import this instead of reading
 * `process.env` directly so misconfiguration fails fast at boot with a clear
 * error rather than surfacing as an obscure runtime bug.
 */
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_DEFAULT_LOCALE: z.string().default("en"),

  DATABASE_URL: z.string().min(1),
  DIRECT_URL: z.string().min(1),

  AUTH_SECRET: z.string().min(1),
  AUTH_URL: z.string().url().optional(),
  AUTH_TRUST_HOST: z.string().optional(),

  STORAGE_ENDPOINT: z.string().optional(),
  STORAGE_REGION: z.string().optional(),
  STORAGE_BUCKET: z.string().optional(),
  STORAGE_ACCESS_KEY_ID: z.string().optional(),
  STORAGE_SECRET_ACCESS_KEY: z.string().optional(),
  STORAGE_SIGNED_URL_TTL_SECONDS: z.coerce.number().default(300),

  EMAIL_PROVIDER: z.enum(["resend", "sendgrid", "smtp"]).default("resend"),
  EMAIL_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().optional(),

  CRON_SECRET: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

function loadEnv(): Env {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    console.error("❌ Invalid environment variables:", parsed.error.flatten().fieldErrors);
    throw new Error("Invalid environment variables — see .env.example");
  }
  return parsed.data;
}

// Lazily validated so this module can be imported without throwing during
// build steps (e.g. `next build`) that don't need every runtime secret.
let cached: Env | undefined;
export function env(): Env {
  if (!cached) cached = loadEnv();
  return cached;
}
