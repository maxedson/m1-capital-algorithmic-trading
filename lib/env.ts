import { z } from "zod";

const envSchema = z.object({
  SCHWAB_CLIENT_ID: z.string().min(1).optional(),
  SCHWAB_CLIENT_SECRET: z.string().min(1).optional(),
  SCHWAB_REDIRECT_URI: z.string().url().optional(),
  SCHWAB_AUTH_BASE_URL: z.string().url().optional(),
  SCHWAB_TOKEN_URL: z.string().url().optional(),
  SCHWAB_API_BASE_URL: z.string().url().optional(),
  APP_SESSION_SECRET: z.string().min(32).optional(),
  APP_ACCESS_PASSWORD: z.string().min(8).optional(),
  APP_TOTP_SECRET_BASE32: z.string().min(16).optional(),
});

export const env = envSchema.parse({
  SCHWAB_CLIENT_ID: process.env.SCHWAB_CLIENT_ID,
  SCHWAB_CLIENT_SECRET: process.env.SCHWAB_CLIENT_SECRET,
  SCHWAB_REDIRECT_URI: process.env.SCHWAB_REDIRECT_URI,
  SCHWAB_AUTH_BASE_URL: process.env.SCHWAB_AUTH_BASE_URL,
  SCHWAB_TOKEN_URL: process.env.SCHWAB_TOKEN_URL,
  SCHWAB_API_BASE_URL: process.env.SCHWAB_API_BASE_URL,
  APP_SESSION_SECRET: process.env.APP_SESSION_SECRET,
  APP_ACCESS_PASSWORD: process.env.APP_ACCESS_PASSWORD,
  APP_TOTP_SECRET_BASE32: process.env.APP_TOTP_SECRET_BASE32,
});
