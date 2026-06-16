import { env } from "@/lib/env";

const ACCESS_COOKIE_NAME = "app_access_session";
const ACCESS_COOKIE_TTL_SECONDS = 60 * 60 * 12;
const LOGIN_ATTEMPT_WINDOW_MS = 15 * 60 * 1000;
const LOGIN_ATTEMPT_LOCKOUT_MS = 15 * 60 * 1000;
const MAX_LOGIN_ATTEMPTS = 5;

type FailedLoginAttemptState = {
  count: number;
  firstFailureAt: number;
  lockedUntil: number;
};

type AccessSessionPayload = {
  exp: number;
};

const failedLoginAttempts = new Map<string, FailedLoginAttemptState>();

function requireAppSessionSecret() {
  if (!env.APP_SESSION_SECRET) {
    throw new Error("Missing APP_SESSION_SECRET.");
  }

  return env.APP_SESSION_SECRET;
}

function encodeBase64Url(input: Uint8Array) {
  let binary = "";
  for (const byte of input) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function decodeBase64Url(input: string) {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  const padding = "=".repeat((4 - (normalized.length % 4)) % 4);
  const binary = atob(`${normalized}${padding}`);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

async function signValue(value: string) {
  const keyMaterial = new TextEncoder().encode(requireAppSessionSecret());
  const key = await crypto.subtle.importKey(
    "raw",
    keyMaterial,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  return encodeBase64Url(new Uint8Array(signature));
}

function safeEqual(left: string, right: string) {
  if (left.length !== right.length) {
    return false;
  }

  let mismatch = 0;
  for (let index = 0; index < left.length; index += 1) {
    mismatch |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }

  return mismatch === 0;
}

export function isAppAccessPasswordConfigured() {
  return Boolean(env.APP_ACCESS_PASSWORD);
}

export function isAppTotpEnabled() {
  return Boolean(env.APP_TOTP_SECRET_BASE32);
}

export function getAppAccessCookieName() {
  return ACCESS_COOKIE_NAME;
}

function shouldUseSecureCookies() {
  return process.env.NODE_ENV === "production" || env.SCHWAB_REDIRECT_URI?.startsWith("https://") === true;
}

export function getAppAccessCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: shouldUseSecureCookies(),
    path: "/",
    maxAge: ACCESS_COOKIE_TTL_SECONDS,
  };
}

export async function createAccessSessionToken() {
  const payload: AccessSessionPayload = {
    exp: Date.now() + ACCESS_COOKIE_TTL_SECONDS * 1000,
  };
  const payloadEncoded = encodeBase64Url(new TextEncoder().encode(JSON.stringify(payload)));
  const signature = await signValue(payloadEncoded);
  return `${payloadEncoded}.${signature}`;
}

export async function verifyAccessSessionToken(token: string | undefined) {
  if (!token) {
    return false;
  }

  const [payloadEncoded, signature] = token.split(".");
  if (!payloadEncoded || !signature) {
    return false;
  }

  const expectedSignature = await signValue(payloadEncoded);
  if (!safeEqual(signature, expectedSignature)) {
    return false;
  }

  try {
    const payloadJson = new TextDecoder().decode(decodeBase64Url(payloadEncoded));
    const payload = JSON.parse(payloadJson) as AccessSessionPayload;
    return payload.exp > Date.now();
  } catch {
    return false;
  }
}

export function verifyAccessPassword(password: string) {
  return Boolean(env.APP_ACCESS_PASSWORD) && password === env.APP_ACCESS_PASSWORD;
}

function getActiveFailedLoginAttemptState(clientKey: string) {
  const state = failedLoginAttempts.get(clientKey);
  if (!state) {
    return null;
  }

  const now = Date.now();
  const lockoutExpired = state.lockedUntil > 0 && state.lockedUntil <= now;
  const windowExpired = now - state.firstFailureAt > LOGIN_ATTEMPT_WINDOW_MS;

  if (lockoutExpired || windowExpired) {
    failedLoginAttempts.delete(clientKey);
    return null;
  }

  return state;
}

export function getLoginLockoutRemainingMs(clientKey: string) {
  const state = getActiveFailedLoginAttemptState(clientKey);
  if (!state || state.lockedUntil === 0) {
    return 0;
  }

  return Math.max(0, state.lockedUntil - Date.now());
}

export function recordFailedLoginAttempt(clientKey: string) {
  const now = Date.now();
  const activeState = getActiveFailedLoginAttemptState(clientKey);
  const state =
    activeState && now - activeState.firstFailureAt <= LOGIN_ATTEMPT_WINDOW_MS
      ? activeState
      : { count: 0, firstFailureAt: now, lockedUntil: 0 };

  state.count += 1;
  if (state.count >= MAX_LOGIN_ATTEMPTS) {
    state.lockedUntil = now + LOGIN_ATTEMPT_LOCKOUT_MS;
  }

  failedLoginAttempts.set(clientKey, state);
  return Math.max(0, state.lockedUntil - now);
}

export function clearFailedLoginAttempts(clientKey: string) {
  failedLoginAttempts.delete(clientKey);
}

function decodeBase32(input: string) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  const normalized = input.toUpperCase().replace(/=+$/g, "").replace(/[\s-]/g, "");
  let bits = "";

  for (const character of normalized) {
    const value = alphabet.indexOf(character);
    if (value === -1) {
      throw new Error("Invalid APP_TOTP_SECRET_BASE32.");
    }

    bits += value.toString(2).padStart(5, "0");
  }

  const bytes: number[] = [];
  for (let index = 0; index + 8 <= bits.length; index += 8) {
    bytes.push(Number.parseInt(bits.slice(index, index + 8), 2));
  }

  return new Uint8Array(bytes);
}

async function generateTotpAt(secret: Uint8Array, timestampMs: number) {
  const counter = Math.floor(timestampMs / 30000);
  const buffer = new ArrayBuffer(8);
  const view = new DataView(buffer);
  view.setUint32(4, counter, false);
  const secretBytes = Uint8Array.from(secret);

  const key = await crypto.subtle.importKey(
    "raw",
    secretBytes,
    { name: "HMAC", hash: "SHA-1" },
    false,
    ["sign"],
  );
  const digest = new Uint8Array(await crypto.subtle.sign("HMAC", key, buffer));
  const offset = digest[digest.length - 1] & 0x0f;
  const code =
    ((digest[offset] & 0x7f) << 24) |
    ((digest[offset + 1] & 0xff) << 16) |
    ((digest[offset + 2] & 0xff) << 8) |
    (digest[offset + 3] & 0xff);

  return (code % 1_000_000).toString().padStart(6, "0");
}

export async function verifyTotpCode(code: string) {
  if (!env.APP_TOTP_SECRET_BASE32) {
    return true;
  }

  const normalizedCode = code.trim();
  if (!/^\d{6}$/.test(normalizedCode)) {
    return false;
  }

  const secret = decodeBase32(env.APP_TOTP_SECRET_BASE32);
  const timestamps = [Date.now() - 30000, Date.now(), Date.now() + 30000];

  for (const timestamp of timestamps) {
    const expectedCode = await generateTotpAt(secret, timestamp);
    if (safeEqual(normalizedCode, expectedCode)) {
      return true;
    }
  }

  return false;
}
