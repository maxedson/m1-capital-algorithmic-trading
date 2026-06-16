import { isAppTotpEnabled } from "@/lib/app-auth";
import { DiscreetLoginGate } from "@/components/discreet-login-gate";

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
    next?: string;
  }>;
};

const errorMessages: Record<string, string> = {
  invalid_credentials: "Invalid password.",
  invalid_totp: "Invalid authentication code.",
  missing_secret: "Server authentication is not configured.",
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const next = params.next?.startsWith("/") ? params.next : "/trading";
  const errorMessage = params.error ? errorMessages[params.error] ?? "Unable to sign in." : null;
  const totpEnabled = isAppTotpEnabled();

  return (
    <DiscreetLoginGate errorMessage={errorMessage} next={next} totpEnabled={totpEnabled} />
  );
}
