import { motion } from "framer-motion";

export default function StepCard({
  step,
  title,
  description,
  icon: Icon,
  highlight = false,
  mockLines = [],
  align = "start",
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.35 }}
      className={`relative overflow-hidden rounded-2xl border p-4 shadow-[0_18px_45px_rgba(15,23,42,0.08)] transition sm:p-5 ${
        highlight
          ? "border-brand-200 bg-gradient-to-br from-white via-brand-50/80 to-emerald-50/70"
          : "border-slate-200 bg-white"
      } ${align === "end" ? "lg:mt-16" : align === "center" ? "lg:mt-8" : ""}`}
    >
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 h-24 ${
          highlight ? "bg-gradient-to-r from-brand-500/10 via-emerald-400/10 to-transparent" : "bg-gradient-to-r from-slate-100/70 to-transparent"
        }`}
      />

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-700">{step}</p>
          <h3 className="mt-2 text-lg font-semibold text-slate-900 sm:text-xl">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
        </div>
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
            highlight ? "bg-brand-700 text-white shadow-[0_10px_30px_rgba(13,148,136,0.28)]" : "bg-brand-50 text-brand-700"
          }`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <div className="relative mt-5 rounded-2xl border border-slate-200/80 bg-slate-50/90 p-3">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-rose-300" />
            <span className="h-2 w-2 rounded-full bg-amber-300" />
            <span className="h-2 w-2 rounded-full bg-emerald-300" />
          </div>
          <div className="h-2 w-16 rounded-full bg-slate-200" />
        </div>

        <div className="space-y-2">
          {mockLines.map((line, index) => (
            <div key={`${title}-${index}`} className="space-y-1">
              <div
                className={`rounded-full ${
                  line.accent ? "bg-brand-200/90" : "bg-slate-200"
                }`}
                style={{ width: line.width, height: line.height || 8 }}
              />
              {line.subWidth ? (
                <div className="rounded-full bg-slate-150 bg-slate-200/70" style={{ width: line.subWidth, height: 6 }} />
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </motion.article>
  );
}
