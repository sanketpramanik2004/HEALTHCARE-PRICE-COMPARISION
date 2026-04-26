import { motion } from "framer-motion";
import { CalendarClock, LayoutDashboard, Map } from "lucide-react";
import { useI18n } from "../../i18n/I18nProvider";

export default function ProductPreviewSection() {
  const { t } = useI18n();
  const previews = [
    { title: t("home.comparisonDashboard"), text: t("home.comparisonDashboardText"), icon: LayoutDashboard },
    { title: t("home.mapView"), text: t("home.mapViewText"), icon: Map },
    { title: t("home.bookingSystem"), text: t("home.bookingSystemText"), icon: CalendarClock },
  ];
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 lg:px-6">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">{t("home.productPreview")}</p>
        <h2 className="mt-2 text-3xl font-bold text-slate-900">{t("home.productPreviewTitle")}</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {previews.map((item, i) => (
          <motion.article
            key={item.title}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="glass-card p-5"
          >
            <div className="mb-4 flex h-40 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-50 to-cream-100">
              <item.icon className="h-10 w-10 text-brand-700" />
            </div>
            <h3 className="text-lg font-semibold">{item.title}</h3>
            <p className="mt-2 text-sm text-slate-600">{item.text}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
