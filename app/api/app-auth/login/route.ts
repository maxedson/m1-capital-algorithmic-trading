import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  clearFailedLoginAttempts,
  createAccessSessionToken,
  getAppAccessCookieName,
  getAppAccessCookieOptions,
  getLoginLockoutRemainingMs,
  isAppAccessPasswordConfigured,
  isAppTotpEnabled,
  recordFailedLoginAttempt,
  verifyAccessPassword,
  verifyTotpCode,
} from "@/lib/app-auth";

function getClientKey(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const realIp = request.headers.get("x-real-ip")?.trim();
  const userAgent = request.headers.get("user-agent")?.trim() ?? "unknown";

  return `${forwardedFor ?? realIp ?? "local"}:${userAgent}`;
}

function buildLockoutRedirect(nextPath: string, lockoutRemainingMs: number) {
  const retryAfterSeconds = Math.max(1, Math.ceil(lockoutRemainingMs / 1000));
  return `/login?error=rate_limited&retryAfter=${retryAfterSeconds}&next=${encodeURIComponent(nextPath)}`;
}

export async function POST(request: Request) {
  if (!isAppAccessPasswordConfigured()) {
    redirect("/login?error=missing_secret");
  }

  const formData = await request.formData();
  const password = String(formData.get("password") ?? "");
  const totp = String(formData.get("totp") ?? "");
  const next = String(formData.get("next") ?? "/trading");
  const nextPath = next.startsWith("/") ? next : "/trading";
  const clientKey = getClientKey(request);
  const lockoutRemainingMs = getLoginLockoutRemainingMs(clientKey);

  if (lockoutRemainingMs > 0) {
    redirect(buildLockoutRedirect(nextPath, lockoutRemainingMs));
  }

  if (!verifyAccessPassword(password)) {
    const updatedLockoutRemainingMs = recordFailedLoginAttempt(clientKey);
    if (updatedLockoutRemainingMs > 0) {
      redirect(buildLockoutRedirect(nextPath, updatedLockoutRemainingMs));
    }

    redirect(`/login?error=invalid_credentials&next=${encodeURIComponent(nextPath)}`);
  }

  if (isAppTotpEnabled()) {
    const isTotpValid = await verifyTotpCode(totp);
    if (!isTotpValid) {
      const updatedLockoutRemainingMs = recordFailedLoginAttempt(clientKey);
      if (updatedLockoutRemainingMs > 0) {
        redirect(buildLockoutRedirect(nextPath, updatedLockoutRemainingMs));
      }

      redirect(`/login?error=invalid_totp&next=${encodeURIComponent(nextPath)}`);
    }
  }

  clearFailedLoginAttempts(clientKey);

  const cookieStore = await cookies();
  cookieStore.set(
    getAppAccessCookieName(),
    await createAccessSessionToken(),
    getAppAccessCookieOptions(),
  );

  redirect(nextPath);
}
