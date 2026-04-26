import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useI18n } from "../../i18n/I18nProvider";

export default function HeroSection({ session }) {
  const { t } = useI18n();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-700 via-teal-600 to-cream-100">
      <div className="mx-auto grid min-h-[78vh] max-w-7xl items-center gap-10 px-4 py-14 text-white lg:grid-cols-2 lg:px-6">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
          <p className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
            <Sparkles className="h-3.5 w-3.5" />
            {t("home.heroBadge")}
          </p>
          <h1 className="mt-5 text-4xl font-extrabold leading-tight md:text-5xl">
            {t("home.heroTitle")}
          </h1>
          <p className="mt-4 max-w-xl text-base text-white/90 md:text-lg">
            {t("home.heroText")}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/explore"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-brand-800 shadow-card"
            >
              {t("home.explore")}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to={session ? "/ai" : "/auth"}
              className="rounded-xl border border-white/40 bg-white/10 px-5 py-3 font-semibold text-white backdrop-blur"
            >
              {t("home.tryAi")}
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-2xl border border-white/35 bg-white/20 p-4 backdrop-blur-2xl"
        >
          <div className="rounded-2xl bg-white p-4 text-slate-900 shadow-card">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold">{t("home.livePreview")}</h3>
              <span className="rounded-full bg-brand-100 px-2 py-1 text-xs font-semibold text-brand-700">{t("home.realtime")}</span>
            </div>
            <div className="space-y-3">
              {[
                { name: "Apollo Gleneagles", price: "₹1,100", eta: "14 min" },
                { name: "Fortis Anandapur", price: "₹1,250", eta: "18 min" },
                { name: "Medica Specialty", price: "₹980", eta: "22 min" },
              ].map((item) => (
                <div key={item.name} className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
                  <div>
                    <p className="text-sm font-semibold">{item.name}</p>
                    <p className="text-xs text-slate-500">Cardiology Consultation</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-brand-700">{item.price}</p>
                    <p className="text-xs text-slate-500">{item.eta}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
