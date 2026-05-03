import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { ArrowLeft, Compass, Eye, EyeOff, Hospital, ShieldCheck, Sparkles, Stethoscope } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import { useI18n } from "../i18n/I18nProvider";

export default function AuthPage({
  authMode,
  setAuthMode,
  authForm,
  setAuthForm,
  showPassword,
  setShowPassword,
  rememberLogin,
  setRememberLogin,
  onSubmit,
  onGoogleSignIn,
  googleClientId,
  busy,
}) {
  const isRegister = authMode === "register";
  const { t } = useI18n();
  const googleButtonRef = useRef(null);

  useEffect(() => {
    if (isRegister || !googleClientId || !googleButtonRef.current) {
      return;
    }

    const existingScript = document.querySelector('script[data-google-identity="true"]');

    function renderGoogleButton() {
      if (!window.google?.accounts?.id || !googleButtonRef.current) {
        return;
      }
      googleButtonRef.current.innerHTML = "";
      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: (response) => {
          if (response?.credential) {
            onGoogleSignIn?.(response.credential);
          }
        },
      });
      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: "outline",
        size: "large",
        text: "signin_with",
        shape: "pill",
        width: googleButtonRef.current.offsetWidth || 360,
      });
    }

    if (existingScript) {
      renderGoogleButton();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.dataset.googleIdentity = "true";
    script.onload = renderGoogleButton;
    document.body.appendChild(script);
  }, [googleClientId, isRegister, onGoogleSignIn]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream-100 via-cream-100 to-emerald-50/40 px-4 py-6 lg:px-8 lg:py-10">
      <div className="mx-auto grid max-w-7xl items-stretch gap-5 lg:grid-cols-[1.08fr,0.92fr] lg:gap-6">
        <motion.section
          initial={{ opacity: 0, x: -18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35 }}
          className="relative flex min-h-[520px] flex-col overflow-hidden rounded-3xl border border-white/70 bg-gradient-to-br from-brand-800 via-brand-700 to-emerald-500 p-6 text-white shadow-card sm:min-h-[600px] sm:p-8 lg:min-h-[700px] lg:p-10"
        >
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-emerald-200/20 blur-3xl" />

          <p className="inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]">
            <ShieldCheck className="h-3.5 w-3.5" />
            {t("auth.secureAccess")}
          </p>
          <h2 className="mt-5 max-w-lg text-3xl font-extrabold leading-tight sm:text-4xl">
            {t("auth.authTitle")}
          </h2>
          <p className="mt-4 max-w-xl text-white/85">
            {t("auth.authText")}
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              { label: t("auth.hospitals"), value: "500+" },
              { label: t("auth.serviceRates"), value: "Live" },
              { label: t("auth.aiTriage"), value: "24/7" },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-white/20 bg-white/10 p-3 backdrop-blur">
                <p className="text-xl font-bold">{item.value}</p>
                <p className="text-xs uppercase tracking-wider text-white/75">{item.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-auto rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur">
            <p className="text-sm font-semibold">{t("auth.whyWorks")}</p>
            <div className="mt-3 space-y-2 text-sm text-white/85">
              <p className="inline-flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                {t("auth.why1")}
              </p>
              <p className="inline-flex items-center gap-2">
                <Stethoscope className="h-4 w-4" />
                {t("auth.why2")}
              </p>
              <p className="inline-flex items-center gap-2">
                <Hospital className="h-4 w-4" />
                {t("auth.why3")}
              </p>
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, x: 18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="h-full"
        >
          <Card className="flex min-h-[520px] flex-col rounded-3xl p-5 sm:min-h-[600px] sm:p-8 lg:min-h-[700px]">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50/90 px-4 py-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Navigation</p>
                <div className="mt-1 flex items-center gap-2 text-sm text-slate-600">
                  <Link to="/" className="font-semibold text-brand-700 transition hover:text-brand-800">
                    Home
                  </Link>
                  <span className="text-slate-300">/</span>
                  <span>{isRegister ? "Create Account" : "Sign In"}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="hidden sm:inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Secure Login
                </div>
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 transition hover:border-brand-200 hover:text-brand-700"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Home
                </Link>
              </div>
            </div>

            <div className="mb-6 flex rounded-xl bg-slate-100 p-1">
              <button
                className={`flex-1 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
                  !isRegister ? "bg-white shadow text-slate-900" : "text-slate-600"
                }`}
                onClick={() => {
                  setAuthMode("login");
                  setShowPassword(false);
                }}
                type="button"
              >
                {t("auth.login")}
              </button>
              <button
                className={`flex-1 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
                  isRegister ? "bg-white shadow text-slate-900" : "text-slate-600"
                }`}
                onClick={() => {
                  setAuthMode("register");
                  setShowPassword(false);
                }}
                type="button"
              >
                {t("auth.register")}
              </button>
            </div>

            <div className="mb-5">
              <h3 className="text-2xl font-bold text-slate-900">
                {isRegister ? t("auth.createAccount") : t("auth.welcomeBack")}
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                {isRegister
                  ? t("auth.registerText")
                  : t("auth.loginText")}
              </p>
            </div>

            <form className="flex-1 space-y-4" onSubmit={onSubmit}>
              {isRegister && (
                <input
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 transition focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100"
                  placeholder={t("auth.fullName")}
                  value={authForm.name}
                  onChange={(e) => setAuthForm((c) => ({ ...c, name: e.target.value }))}
                  required
                />
              )}
              {isRegister && authForm.role === "USER" ? (
                <div className="grid gap-3 md:grid-cols-3">
                  <input
                    type="number"
                    min="0"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 transition focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100"
                    placeholder="Age"
                    value={authForm.age}
                    onChange={(e) => setAuthForm((c) => ({ ...c, age: e.target.value }))}
                  />
                  <select
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 transition focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100"
                    value={authForm.gender}
                    onChange={(e) => setAuthForm((c) => ({ ...c, gender: e.target.value }))}
                  >
                    <option value="">Gender</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                  <input
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 transition focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100"
                    placeholder="Phone number"
                    value={authForm.phoneNumber}
                    onChange={(e) => setAuthForm((c) => ({ ...c, phoneNumber: e.target.value }))}
                  />
                </div>
              ) : null}
              <input
                type="email"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 transition focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100"
                placeholder={t("auth.email")}
                value={authForm.email}
                onChange={(e) => setAuthForm((c) => ({ ...c, email: e.target.value }))}
                required
              />
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-12 transition focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100"
                  placeholder={t("auth.password")}
                  value={authForm.password}
                  onChange={(e) => setAuthForm((c) => ({ ...c, password: e.target.value }))}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-3.5 text-slate-500 transition hover:text-brand-700"
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              {isRegister && (
                <select
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 transition focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100"
                  value={authForm.role}
                  onChange={(e) => setAuthForm((c) => ({ ...c, role: e.target.value }))}
                >
                  <option value="USER">{t("auth.patient")}</option>
                  <option value="ADMIN">{t("auth.hospitalAdmin")}</option>
                </select>
              )}

              {isRegister && authForm.role === "ADMIN" && (
                <div className="grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <p className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <Hospital className="h-4 w-4" /> {t("auth.hospitalProfile")}
                  </p>
                  <input
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3"
                    placeholder={t("auth.hospitalName")}
                    value={authForm.hospital.name}
                    onChange={(e) =>
                      setAuthForm((c) => ({ ...c, hospital: { ...c.hospital, name: e.target.value } }))
                    }
                    required
                  />
                  <input
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3"
                    placeholder={t("auth.location")}
                    value={authForm.hospital.location}
                    onChange={(e) =>
                      setAuthForm((c) => ({ ...c, hospital: { ...c.hospital, location: e.target.value } }))
                    }
                    required
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3"
                        placeholder={t("auth.latitude")}
                      value={authForm.hospital.latitude}
                      onChange={(e) =>
                        setAuthForm((c) => ({ ...c, hospital: { ...c.hospital, latitude: e.target.value } }))
                      }
                      required
                    />
                    <input
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3"
                        placeholder={t("auth.longitude")}
                      value={authForm.hospital.longitude}
                      onChange={(e) =>
                        setAuthForm((c) => ({ ...c, hospital: { ...c.hospital, longitude: e.target.value } }))
                      }
                      required
                    />
                  </div>
                  <input
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3"
                    placeholder={t("auth.rating")}
                    value={authForm.hospital.rating}
                    onChange={(e) =>
                      setAuthForm((c) => ({ ...c, hospital: { ...c.hospital, rating: e.target.value } }))
                    }
                    required
                  />
                </div>
              )}

              {!isRegister && (
                <label className="flex items-center gap-2 text-sm text-slate-600">
                  <input
                    type="checkbox"
                    checked={rememberLogin}
                    onChange={(e) => setRememberLogin(e.target.checked)}
                    className="h-4 w-4 accent-teal-600"
                  />
                  {t("auth.remember")}
                </label>
              )}

              <Button className="w-full !py-3.5" type="submit" disabled={busy}>
                {busy ? t("auth.wait") : isRegister ? t("auth.create") : t("auth.signIn")}
              </Button>

              {!isRegister ? (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-3">
                    <div className="h-px flex-1 bg-slate-200" />
                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">or</span>
                    <div className="h-px flex-1 bg-slate-200" />
                  </div>

                  {googleClientId ? (
                    <div>
                      <div ref={googleButtonRef} className="min-h-[44px] w-full" />
                      <p className="mt-2 text-xs text-slate-500">
                        Google sign-in creates or opens a patient account.
                      </p>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
                      Google sign-in is available after setting <code>REACT_APP_GOOGLE_CLIENT_ID</code>.
                    </div>
                  )}
                </div>
              ) : null}
            </form>

            <div className="mt-auto grid gap-3 pt-6 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Go Home</p>
                <p className="mt-2 text-sm text-slate-600">
                  Return to the main page to explore the platform before signing in.
                </p>
                <Link
                  to="/"
                  className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-brand-700"
                >
                  <Compass className="h-4 w-4" />
                  Open Home
                </Link>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  {isRegister ? "Account Setup" : "Quick Reminder"}
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  {isRegister
                    ? "Patients can save profile details later, and hospital admins can continue to their workspace right after sign-up."
                    : "Use your patient account for bookings and profile history, or your admin account for hospital operations."}
                </p>
              </div>
            </div>
          </Card>
        </motion.section>
      </div>
    </div>
  );
}
