import { createCipheriv, createDecipheriv, createHash, randomBytes, randomUUID, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { env } from "@/lib/env";

const SCHWAB_SESSION_COOKIE = "schwab_session";
const SCHWAB_STATE_COOKIE = "schwab_oauth_state";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 6;
const STATE_TTL_SECONDS = 60 * 10;
const ALGORITHM = "aes-256-gcm";

type SchwabTokenResponse = {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  refresh_token_expires_in?: number;
  scope?: string;
  token_type?: string;
  id_token?: string;
};

type SchwabSession = {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: number;
  refreshTokenExpiresAt?: number;
  scope?: string;
  tokenType?: string;
};

function requireSchwabConfig() {
  if (!env.SCHWAB_CLIENT_ID || !env.SCHWAB_CLIENT_SECRET || !env.SCHWAB_REDIRECT_URI || !env.APP_SESSION_SECRET) {
    throw new Error(
      "Missing Schwab OAuth configuration. Populate SCHWAB_CLIENT_ID, SCHWAB_CLIENT_SECRET, SCHWAB_REDIRECT_URI, and APP_SESSION_SECRET.",
    );
  }

  return {
    clientId: env.SCHWAB_CLIENT_ID,
    clientSecret: env.SCHWAB_CLIENT_SECRET,
    redirectUri: env.SCHWAB_REDIRECT_URI,
    authBaseUrl: env.SCHWAB_AUTH_BASE_URL ?? "https://api.schwabapi.com/v1/oauth/authorize",
    tokenUrl: env.SCHWAB_TOKEN_URL ?? "https://api.schwabapi.com/v1/oauth/token",
    apiBaseUrl: env.SCHWAB_API_BASE_URL ?? "https://api.schwabapi.com",
    sessionSecret: env.APP_SESSION_SECRET,
  };
}

function tokenExpiresAt(expiresInSeconds: number) {
  return Date.now() + Math.max(0, expiresInSeconds - 30) * 1000;
}

function getSessionCookieOptions() {
  const { redirectUri } = requireSchwabConfig();
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production" || redirectUri.startsWith("https://"),
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  };
}

function getSessionEncryptionKey() {
  const { sessionSecret } = requireSchwabConfig();
  return createHash("sha256").update(sessionSecret).digest();
}

function encodeSession(session: SchwabSession) {
  const iv = randomBytes(12);
  const cipher = createCipheriv(ALGORITHM, getSessionEncryptionKey(), iv);
  const payload = Buffer.from(JSON.stringify(session), "utf8");
  const encrypted = Buffer.concat([cipher.update(payload), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return `${iv.toString("base64url")}.${authTag.toString("base64url")}.${encrypted.toString("base64url")}`;
}

function decodeSession(value: string) {
  const [ivPart, authTagPart, encryptedPart] = value.split(".");
  if (!ivPart || !authTagPart || !encryptedPart) {
    return null;
  }

  try {
    const decipher = createDecipheriv(
      ALGORITHM,
      getSessionEncryptionKey(),
      Buffer.from(ivPart, "base64url"),
    );
    decipher.setAuthTag(Buffer.from(authTagPart, "base64url"));
    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(encryptedPart, "base64url")),
      decipher.final(),
    ]);

    return JSON.parse(decrypted.toString("utf8")) as SchwabSession;
  } catch {
    return null;
  }
}

function mergeTokenIntoSession(token: SchwabTokenResponse, existing?: SchwabSession | null): SchwabSession {
  const refreshToken = token.refresh_token ?? existing?.refreshToken;

  if (!refreshToken) {
    throw new Error("Schwab refresh token missing from token response.");
  }

  return {
    accessToken: token.access_token,
    refreshToken,
    accessTokenExpiresAt: tokenExpiresAt(token.expires_in),
    refreshTokenExpiresAt: token.refresh_token_expires_in
      ? tokenExpiresAt(token.refresh_token_expires_in)
      : existing?.refreshTokenExpiresAt,
    scope: token.scope ?? existing?.scope,
    tokenType: token.token_type ?? existing?.tokenType,
  };
}

function writeSessionCookie(cookieStore: Awaited<ReturnType<typeof cookies>>, session: SchwabSession) {
  cookieStore.set(SCHWAB_SESSION_COOKIE, encodeSession(session), getSessionCookieOptions());
}

function deleteSessionCookie(cookieStore: Awaited<ReturnType<typeof cookies>>) {
  cookieStore.delete(SCHWAB_SESSION_COOKIE);
}

async function exchangeToken(params: URLSearchParams) {
  const config = requireSchwabConfig();
  const basicAuth = Buffer.from(`${config.clientId}:${config.clientSecret}`).toString("base64");
  const response = await fetch(config.tokenUrl, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basicAuth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
    cache: "no-store",
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Schwab token exchange failed (${response.status}): ${details}`);
  }

  return response.json() as Promise<SchwabTokenResponse>;
}

export async function createSchwabAuthorizationUrl() {
  const config = requireSchwabConfig();
  const state = randomUUID();
  const authUrl = new URL(config.authBaseUrl);
  authUrl.searchParams.set("client_id", config.clientId);
  authUrl.searchParams.set("redirect_uri", config.redirectUri);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", "readonly");
  authUrl.searchParams.set("state", state);

  const cookieStore = await cookies();
  cookieStore.set(SCHWAB_STATE_COOKIE, state, {
    httpOnly: true,
    sameSite: "lax",
    secure: getSessionCookieOptions().secure,
    path: "/",
    maxAge: STATE_TTL_SECONDS,
  });

  return authUrl.toString();
}

export async function completeSchwabAuthorization(code: string, state: string | null) {
  const cookieStore = await cookies();
  const expectedState = cookieStore.get(SCHWAB_STATE_COOKIE)?.value;

  if (
    !state ||
    !expectedState ||
    state.length !== expectedState.length ||
    !timingSafeEqual(Buffer.from(state), Buffer.from(expectedState))
  ) {
    throw new Error("Invalid Schwab OAuth state.");
  }

  cookieStore.delete(SCHWAB_STATE_COOKIE);

  const config = requireSchwabConfig();
  const token = await exchangeToken(
    new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: config.redirectUri,
    }),
  );

  writeSessionCookie(cookieStore, mergeTokenIntoSession(token));
}

export async function disconnectSchwabSession() {
  const cookieStore = await cookies();
  deleteSessionCookie(cookieStore);
}

async function refreshSchwabSession(
  cookieStore: Awaited<ReturnType<typeof cookies>>,
  session: SchwabSession,
) {
  const config = requireSchwabConfig();
  const token = await exchangeToken(
    new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: session.refreshToken,
      redirect_uri: config.redirectUri,
    }),
  );

  const refreshedSession = mergeTokenIntoSession(token, session);
  writeSessionCookie(cookieStore, refreshedSession);
  return refreshedSession;
}

export async function getSchwabSession() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SCHWAB_SESSION_COOKIE)?.value;

  if (!sessionCookie) {
    return null;
  }

  const session = decodeSession(sessionCookie);
  if (!session) {
    deleteSessionCookie(cookieStore);
    return null;
  }

  if (session.refreshTokenExpiresAt && session.refreshTokenExpiresAt <= Date.now()) {
    deleteSessionCookie(cookieStore);
    return null;
  }

  if (session.accessTokenExpiresAt <= Date.now()) {
    return refreshSchwabSession(cookieStore, session);
  }

  return session;
}

export async function schwabFetch(path: string, init?: RequestInit) {
  const session = await getSchwabSession();
  if (!session) {
    throw new Error("No active Schwab session. Connect your broker first.");
  }

  const config = requireSchwabConfig();
  const response = await fetch(new URL(path, config.apiBaseUrl), {
    ...init,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${session.accessToken}`,
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Schwab API request failed (${response.status}): ${details}`);
  }

  return response;
}

export async function getSchwabConnectionStatus() {
  const session = await getSchwabSession();
  return {
    connected: Boolean(session),
    expiresAt: session?.accessTokenExpiresAt ?? null,
    scope: session?.scope ?? null,
  };
}
