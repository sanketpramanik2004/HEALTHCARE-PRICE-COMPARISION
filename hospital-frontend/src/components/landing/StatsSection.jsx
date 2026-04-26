import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Building2, Globe2, Star } from "lucide-react";
import { useI18n } from "../../i18n/I18nProvider";

function useCount(target, duration = 900) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const start = performance.now();
    let frame = 0;
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      setValue(Math.round(target * progress));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);
  return value;
}

export default function StatsSection({ hospitals }) {
  const { t } = useI18n();
  const indexed = hospitals.length || 0;
  const avgRating =
    hospitals.length > 0
      ? Number((hospitals.reduce((acc, h) => acc + (h.rating || 0), 0) / hospitals.length).toFixed(1))
      : 0;
  const regions = new Set(hospitals.map((h) => h.location)).size;

  const cards = [
    { label: t("home.statsHospitals"), value: indexed, icon: Building2, suffix: "+" },
    { label: t("home.statsRating"), value: avgRating, icon: Star, suffix: "/5", decimal: true },
    { label: t("home.statsRegions"), value: regions, icon: Globe2, suffix: "+" },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 lg:px-6">
      <div className="grid gap-4 md:grid-cols-3">
        {cards.map((card, i) => (
          <StatCard key={card.label} {...card} delay={i * 0.08} />
        ))}
      </div>
    </section>
  );
}

function StatCard({ label, value, suffix = "", icon: Icon, delay = 0, decimal = false }) {
  const current = useCount(decimal ? Math.round(value * 10) : value);
  const shown = decimal ? (current / 10).toFixed(1) : current;
  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="glass-card p-6"
    >
      <Icon className="h-5 w-5 text-brand-700" />
      <p className="mt-4 text-3xl font-extrabold text-slate-900">
        {shown}
        {suffix}
      </p>
      <p className="mt-1 text-sm text-slate-500">{label}</p>
    </motion.article>
  );
}
