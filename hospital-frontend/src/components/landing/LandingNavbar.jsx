import { useEffect, useState } from "react";
import { ChevronDown, Compass, HeartPulse } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import LanguageSwitcher from "../ui/LanguageSwitcher";
import { useI18n } from "../../i18n/I18nProvider";

export default function LandingNavbar({ session }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { t } = useI18n();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const dashboardRoute = session?.role === "ADMIN" ? "/admin" : "/dashboard";

  return (
    <header
      className={`sticky top-0 z-50 transition ${
        isScrolled ? "bg-white/85 shadow-card backdrop-blur-xl" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 lg:px-6">
        <Link to="/" className="inline-flex min-w-0 items-center gap-2">
          <div className="rounded-xl bg-brand-700 p-2 text-white">
            <HeartPulse className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-slate-900">{t("nav.healthCompass")}</p>
            <p className="truncate text-xs text-slate-500">{t("nav.healthcareIntelligence")}</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-700 md:flex">
          <Link to="/" className="hover:text-brand-700">
            {t("nav.home")}
          </Link>
          <Link to="/explore" className="hover:text-brand-700">
            {t("nav.explore")}
          </Link>
          <Link to="/ai" className="hover:text-brand-700">
            {t("nav.ai")}
          </Link>
          <Link to={dashboardRoute} className="hover:text-brand-700">
            {t("nav.dashboard")}
          </Link>
        </nav>

        <div className="ml-auto flex w-full items-center justify-end gap-2 sm:w-auto sm:gap-3">
          <LanguageSwitcher />
        {!session ? (
          <Link to="/auth" className="rounded-xl bg-brand-700 px-3 py-2 text-sm font-semibold text-white sm:px-4">
            {t("nav.signIn")}
          </Link>
        ) : (
          <div className="relative">
            <button
              onClick={() => setOpen((v) => !v)}
              className="inline-flex max-w-[min(72vw,260px)] items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow"
            >
              <Compass className="h-4 w-4 text-brand-700" />
              <span className="truncate">{session.name}</span>
              <ChevronDown className="h-4 w-4" />
            </button>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 mt-2 w-44 rounded-xl border border-slate-200 bg-white p-2 shadow-card"
              >
                <Link to={dashboardRoute} className="block rounded-lg px-3 py-2 text-sm hover:bg-slate-100">
                  {t("nav.openDashboard")}
                </Link>
                <Link to="/bookings" className="block rounded-lg px-3 py-2 text-sm hover:bg-slate-100">
                  {t("nav.myBookings")}
                </Link>
              </motion.div>
            )}
          </div>
        )}
        </div>
      </div>
    </header>
  );
}
