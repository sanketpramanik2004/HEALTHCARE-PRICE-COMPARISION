import { motion } from "framer-motion";
import { BrainCircuit, CalendarCheck2, Radar, WalletCards } from "lucide-react";
import { useI18n } from "../../i18n/I18nProvider";

export default function FeaturesSection() {
  const { t } = useI18n();
  const features = [
    { title: t("home.aiFeature"), text: t("home.aiFeatureText"), icon: BrainCircuit },
    { title: t("home.priceFeature"), text: t("home.priceFeatureText"), icon: WalletCards },
    { title: t("home.distanceFeature"), text: t("home.distanceFeatureText"), icon: Radar },
    { title: t("home.bookingFeature"), text: t("home.bookingFeatureText"), icon: CalendarCheck2 },
  ];
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:py-14 lg:px-6">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">{t("home.features")}</p>
        <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">{t("home.featuresTitle")}</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {features.map((item, idx) => (
          <motion.article
            key={item.title}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -5, scale: 1.01 }}
            transition={{ delay: idx * 0.06 }}
            className="glass-card h-full p-4 sm:p-5"
          >
            <item.icon className="h-6 w-6 text-brand-700" />
            <h3 className="mt-3 text-lg font-semibold">{item.title}</h3>
            <p className="mt-2 text-sm text-slate-600">{item.text}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
