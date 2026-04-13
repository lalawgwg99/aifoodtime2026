import React, { FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { User } from "@supabase/supabase-js";

interface AuthSectionProps {
  user: User | null;
  loading: boolean;
  hasConfig: boolean;
  onSignIn: (email: string, password: string) => Promise<void>;
  onSignUp: (email: string, password: string) => Promise<void>;
  onSignOut: () => Promise<void>;
}

type Mode = "signin" | "signup";

export function AuthSection({
  user,
  loading,
  hasConfig,
  onSignIn,
  onSignUp,
  onSignOut,
}: AuthSectionProps) {
  const { t } = useTranslation();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!hasConfig) {
      setStatus("error");
      setErrorMessage(t("auth.errorMissing"));
      return;
    }

    try {
      if (mode === "signin") {
        await onSignIn(email, password);
      } else {
        await onSignUp(email, password);
      }
      setStatus("success");
      setErrorMessage("");
      setPassword("");
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "auth_error");
    }
  };

  return (
    <section className="section section-surface" id="auth">
      <div className="container">
        <div className="panel">
          <div className="section-heading compact-heading">
            <p className="section-kicker">{t("auth.kicker")}</p>
            <h2>{t("auth.title")}</h2>
            <p>{t("auth.description")}</p>
          </div>

          {!hasConfig && <p className="feedback feedback-error">{t("auth.errorMissing")}</p>}

          {user ? (
            <div className="auth-signed">
              <p>{t("auth.signedIn", { email: user.email ?? user.id })}</p>
              <button
                type="button"
                className="button button-secondary"
                onClick={() => {
                  void onSignOut();
                }}
              >
                {t("auth.signOut")}
              </button>
            </div>
          ) : (
            <div className="auth-box">
              <div className="chip-row">
                <button
                  type="button"
                  className={mode === "signin" ? "chip chip-active" : "chip"}
                  onClick={() => setMode("signin")}
                >
                  {t("auth.modeSignIn")}
                </button>
                <button
                  type="button"
                  className={mode === "signup" ? "chip chip-active" : "chip"}
                  onClick={() => setMode("signup")}
                >
                  {t("auth.modeSignUp")}
                </button>
              </div>

              <form className="waitlist-form auth-form" onSubmit={handleSubmit}>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder={t("auth.email")}
                  aria-label={t("auth.email")}
                  required
                />
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder={t("auth.password")}
                  aria-label={t("auth.password")}
                  minLength={6}
                  required
                />
                <button className="button button-primary" type="submit" disabled={loading}>
                  {mode === "signin" ? t("auth.submitSignIn") : t("auth.submitSignUp")}
                </button>
              </form>

              {status === "success" && (
                <p className="feedback feedback-success">
                  {mode === "signin" ? t("auth.successSignIn") : t("auth.successSignUp")}
                </p>
              )}
              {status === "error" && <p className="feedback feedback-error">{errorMessage}</p>}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
