"use client";

import { useState } from "react";

type DiscreetLoginGateProps = {
  errorMessage: string | null;
  next: string;
  totpEnabled: boolean;
};

export function DiscreetLoginGate({ errorMessage, next, totpEnabled }: DiscreetLoginGateProps) {
  const [isFormVisible, setIsFormVisible] = useState(Boolean(errorMessage));

  return (
    <main className="login-page-shell parked-page-shell">
      <section className="parked-domain-card" aria-hidden={isFormVisible}>
        <div className="parked-domain-mark" />
        <div className="parked-domain-copy">
          <strong>Domain parked.</strong>
          <span>This site is reserved.</span>
        </div>
      </section>

      <button
        type="button"
        className="hidden-login-trigger"
        onClick={() => setIsFormVisible(true)}
        aria-label="Open access form"
      />

      {isFormVisible ? (
        <section className="login-panel discreet-login-panel">
          <form action="/api/app-auth/login" method="post" className="login-form">
            <input type="hidden" name="next" value={next} />

            <label className="stacked-control">
              <span className="control-label">Password</span>
              <input
                className="select-input login-input"
                type="password"
                name="password"
                autoComplete="current-password"
                required
              />
            </label>

            {totpEnabled ? (
              <label className="stacked-control">
                <span className="control-label">Code</span>
                <input
                  className="select-input login-input"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  name="totp"
                  autoComplete="one-time-code"
                  required
                />
              </label>
            ) : null}

            {errorMessage ? <p className="login-error-copy">{errorMessage}</p> : null}

            <button type="submit" className="btn btn-primary">
              Continue
            </button>
          </form>
        </section>
      ) : null}
    </main>
  );
}
