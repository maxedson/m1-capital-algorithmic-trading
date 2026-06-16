import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  createAccessSessionToken,
  getAppAccessCookieName,
  getAppAccessCookieOptions,
  isAppAccessPasswordConfigured,
  isAppTotpEnabled,
  verifyAccessPassword,
  verifyTotpCode,
} from "@/lib/app-auth";

export async function POST(request: Request) {
  if (!isAppAccessPasswordConfigured()) {
    redirect("/login?error=missing_secret");
  }

  const formData = await request.formData();
  const password = String(formData.get("password") ?? "");
  const totp = String(formData.get("totp") ?? "");
  const next = String(formData.get("next") ?? "/trading");
  const nextPath = next.startsWith("/") ? next : "/trading";

  if (!verifyAccessPassword(password)) {
    redirect(`/login?error=invalid_credentials&next=${encodeURIComponent(nextPath)}`);
  }

  if (isAppTotpEnabled()) {
    const isTotpValid = await verifyTotpCode(totp);
    if (!isTotpValid) {
      redirect(`/login?error=invalid_totp&next=${encodeURIComponent(nextPath)}`);
    }
  }

  const cookieStore = await cookies();
  cookieStore.set(
    getAppAccessCookieName(),
    await createAccessSessionToken(),
    getAppAccessCookieOptions(),
  );

  redirect(nextPath);
}
