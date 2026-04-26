import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useI18n } from "../../i18n/I18nProvider";

export default function CtaSection() {
  const { t } = useI18n();
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 lg:px-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-3xl bg-slate-900 px-6 py-14 text-center text-white md:px-10"
      >
        <h2 className="text-3xl font-bold">{t("home.ctaTitle")}</h2>
        <p className="mx-auto mt-3 max-w-2xl text-white/80">
          {t("home.ctaText")}
        </p>
        <Link
          to="/auth"
          className="mt-7 inline-flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-3 font-semibold text-white"
        >
          {t("home.getStarted")}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </motion.div>
    </section>
  );
}
