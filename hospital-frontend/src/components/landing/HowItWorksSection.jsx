import { motion } from "framer-motion";
import { Bot, MapPinned, Stethoscope } from "lucide-react";
import { useI18n } from "../../i18n/I18nProvider";

export default function HowItWorksSection() {
  const { t } = useI18n();
  const steps = [
    {
      title: t("home.step1"),
      text: t("home.step1Text"),
      icon: Stethoscope,
    },
    {
      title: t("home.step2"),
      text: t("home.step2Text"),
      icon: MapPinned,
    },
    {
      title: t("home.step3"),
      text: t("home.step3Text"),
      icon: Bot,
    },
  ];
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 lg:px-6">
      <div className="mb-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">{t("home.howItWorks")}</p>
        <h2 className="mt-2 text-3xl font-bold text-slate-900">{t("home.howTitle")}</h2>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {steps.map((step, idx) => (
          <motion.article
            key={step.title}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.08 }}
            className="glass-card p-6"
          >
            <step.icon className="h-6 w-6 text-brand-700" />
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Step {idx + 1}</p>
            <h3 className="mt-1 text-lg font-semibold text-slate-900">{step.title}</h3>
            <p className="mt-2 text-sm text-slate-600">{step.text}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
