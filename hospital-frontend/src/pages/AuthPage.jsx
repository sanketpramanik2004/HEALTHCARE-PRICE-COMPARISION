import { motion } from "framer-motion";
import { Eye, EyeOff, Hospital, ShieldCheck, Sparkles, Stethoscope } from "lucide-react";
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
  busy,
}) {
  const isRegister = authMode === "register";
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream-100 via-cream-100 to-emerald-50/40 px-4 py-8 lg:px-8 lg:py-10">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.08fr,0.92fr]">
        <motion.section
          initial={{ opacity: 0, x: -18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35 }}
          className="relative overflow-hidden rounded-3xl border border-white/70 bg-gradient-to-br from-brand-800 via-brand-700 to-emerald-500 p-8 text-white shadow-card lg:p-10"
        >
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-emerald-200/20 blur-3xl" />

          <p className="inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]">
            <ShieldCheck className="h-3.5 w-3.5" />
            {t("auth.secureAccess")}
          </p>
          <h2 className="mt-5 max-w-lg text-4xl font-extrabold leading-tight">
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

          <div className="mt-8 rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur">
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
        >
          <Card className="h-full rounded-3xl p-6 sm:p-8">
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

            <form className="space-y-4" onSubmit={onSubmit}>
              {isRegister && (
                <input
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 transition focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100"
                  placeholder={t("auth.fullName")}
                  value={authForm.name}
                  onChange={(e) => setAuthForm((c) => ({ ...c, name: e.target.value }))}
                  required
                />
              )}
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
            </form>
          </Card>
        </motion.section>
      </div>
    </div>
  );
}
