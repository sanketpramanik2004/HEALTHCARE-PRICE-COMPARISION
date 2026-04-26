import { motion } from "framer-motion";
import { Bot, Send } from "lucide-react";
import { Link } from "react-router-dom";
import { useI18n } from "../../i18n/I18nProvider";

export default function AiHighlightSection({ session }) {
  const { t } = useI18n();
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 lg:px-6">
      <div className="grid gap-6 rounded-3xl bg-gradient-to-r from-brand-900 to-brand-700 p-6 text-white md:p-8 lg:grid-cols-[1fr,1.15fr]">
        <motion.div initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80">{t("home.aiHighlight")}</p>
          <h2 className="mt-2 text-3xl font-bold">{t("home.aiHighlightTitle")}</h2>
          <p className="mt-3 text-white/85">
            {t("home.aiHighlightText")}
          </p>
          <Link
            to={session ? "/ai" : "/auth"}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-brand-800"
          >
            {t("home.analyzeSymptoms")}
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl bg-white p-4 text-slate-900 shadow-card"
        >
          <div className="space-y-3">
            <Bubble role="user" text="I have chest discomfort and shortness of breath." />
            <Bubble role="assistant" text="Recommended: Cardiologist. Reason: symptoms indicate possible cardiac load under exertion." />
            <Bubble role="assistant" text="Suggested services: ECG, ECHO, Cardiology Consultation." />
          </div>
          <div className="mt-3 flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2">
            <Bot className="h-4 w-4 text-brand-700" />
            <input
              value="Type your symptoms..."
              readOnly
              className="w-full bg-transparent text-sm text-slate-400 outline-none"
            />
            <Send className="h-4 w-4 text-brand-700" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Bubble({ role, text }) {
  const styles =
    role === "user"
      ? "ml-auto w-[88%] bg-slate-900 text-white"
      : "w-[92%] bg-brand-50 text-slate-800 border border-brand-100";
  return <div className={`rounded-xl px-3 py-2 text-sm ${styles}`}>{text}</div>;
}
