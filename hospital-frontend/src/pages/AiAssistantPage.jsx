import { motion } from "framer-motion";
import { Bot, BrainCircuit, Hospital, MapPin, Send, Sparkles, Stethoscope, User } from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import { useI18n } from "../i18n/I18nProvider";

export default function AiAssistantPage({
  symptoms,
  setSymptoms,
  recommendation,
  busy,
  onAnalyze,
  onAnalyzeCompare,
  onCompareService,
  onBookDoctor,
}) {
  const { t } = useI18n();

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-brand-700 via-brand-700 to-emerald-600 p-7 text-white">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/75">{t("ai.badge")}</p>
        <h2 className="mt-2 text-3xl font-bold">{t("ai.title")}</h2>
        <p className="mt-1 max-w-3xl text-white/85">
          {t("ai.intro")}
        </p>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1.15fr,0.85fr]">
        <div className="space-y-6">
          <Card className="space-y-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-xl font-semibold text-slate-900">{t("ai.conversation")}</h3>
                <p className="text-sm text-slate-500">{t("ai.conversationText")}</p>
              </div>
              <div className="hidden rounded-xl bg-brand-50 px-3 py-2 text-sm font-semibold text-brand-800 md:block">
                {t("ai.secure")}
              </div>
            </div>

            <div className="space-y-4 rounded-3xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-4">
              <ChatBubble role="user" label={t("ai.user")}>
                {t("ai.prompt")}
              </ChatBubble>

              {symptoms && <ChatBubble role="patient" label={t("ai.patient")}>{symptoms}</ChatBubble>}

              {recommendation && (
                <>
                  <ChatBubble role="assistant" label={t("ai.assistant")}>
                    <strong>{t("ai.recommendedDoctor")}: {recommendation.recommendedDoctor}</strong>
                    <br />
                    {recommendation.reasoningSummary}
                  </ChatBubble>
                  <ChatBubble role="assistant" label={t("ai.assistant")}>{recommendation.note}</ChatBubble>
                </>
              )}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
              <textarea
                rows={6}
                className="w-full resize-none rounded-2xl border-0 bg-transparent px-2 py-2 text-slate-800 outline-none placeholder:text-slate-400"
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder={t("ai.examplePlaceholder")}
              />
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3">
                <div className="inline-flex items-center gap-2 text-sm text-slate-500">
                  <Send className="h-4 w-4 text-brand-700" />
                  {t("ai.explainHint")}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button onClick={onAnalyze} disabled={busy}>
                    {busy ? t("ai.analyzing") : t("ai.analyze")}
                  </Button>
                  <Button variant="secondary" onClick={onAnalyzeCompare} disabled={busy}>
                    {t("ai.analyzeCompare")}
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          <div className="grid gap-4 md:grid-cols-3">
            <QuickCard
              icon={BrainCircuit}
              title={t("ai.quick1")}
              text={t("ai.quick1Text")}
            />
            <QuickCard
              icon={Stethoscope}
              title={t("ai.quick2")}
              text={t("ai.quick2Text")}
            />
            <QuickCard
              icon={Hospital}
              title={t("ai.quick3")}
              text={t("ai.quick3Text")}
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.05fr,0.95fr]">
            <Card className="space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">Good Prompts</p>
                <h3 className="mt-2 text-lg font-semibold text-slate-900">Try symptom descriptions that work well</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  "itchy red rash on arms from last 5 days",
                  "knee pain and swelling while climbing stairs for 1 week",
                  "cough with shortness of breath and mild fever for 4 days",
                  "stomach pain with acidity and vomiting since yesterday",
                ].map((example) => (
                  <button
                    key={example}
                    type="button"
                    onClick={() => setSymptoms(example)}
                    className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-800"
                  >
                    {example}
                  </button>
                ))}
              </div>
              <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                The strongest prompts mention the symptom, how long it has been happening, and any trigger like walking,
                eating, fever, or swelling.
              </div>
            </Card>

            <Card className="space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">What Happens Next</p>
                <h3 className="mt-2 text-lg font-semibold text-slate-900">How to use the AI result well</h3>
              </div>
              <div className="space-y-3">
                <FlowRow index="1" title="Review the doctor suggestion" text="Use it as a first direction, not a final diagnosis." />
                <FlowRow index="2" title="Compare real services" text="Tap one of the suggested services to see matching hospitals and prices." />
                <FlowRow index="3" title="Book and track updates" text="Choose a doctor or hospital, then follow approval and completion from your dashboard." />
              </div>
            </Card>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-lg font-semibold">Recommended Doctors</h3>
              {recommendation?.doctorSuggestions?.length ? (
                <span className="text-sm text-slate-500">{recommendation.doctorSuggestions.length} doctors</span>
              ) : null}
            </div>

            {!recommendation?.doctorSuggestions?.length ? (
              <EmptyState
                title="No doctors suggested yet"
                subtitle="Once AI analysis runs, matching doctors will appear here."
              />
            ) : (
              <div className="space-y-3">
                {recommendation.doctorSuggestions.slice(0, 5).map((doctor, idx) => (
                  <motion.article
                    key={doctor.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    className="rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-brand-200 hover:shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-slate-800">Dr. {doctor.name}</p>
                        <p className="mt-1 text-sm text-slate-500">{doctor.specialization}</p>
                      </div>
                      <span className="rounded-lg bg-brand-50 px-2.5 py-1 text-sm font-semibold text-brand-700">
                        ₹{doctor.consultationFee}
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                      <span>{doctor.experience || 0} yrs</span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-brand-700" />
                        {doctor.hospital.name}
                      </span>
                      {doctor.distanceKm > 0 ? <span>{doctor.distanceKm.toFixed(2)} km</span> : null}
                    </div>
                    <div className="mt-3">
                      <Button onClick={() => onBookDoctor(doctor)}>Book Appointment</Button>
                    </div>
                  </motion.article>
                ))}
              </div>
            )}
          </Card>

          <Card className="space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-brand-700" />
              <h3 className="text-lg font-semibold">{t("ai.services")}</h3>
            </div>

            {!recommendation ? (
              <EmptyState
                title={t("ai.noAnalysisTitle")}
                subtitle={t("ai.noAnalysisText")}
              />
            ) : (
              <>
                <div className="rounded-2xl bg-brand-50 p-4">
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-700">{t("ai.suggestedDoctor")}</p>
                  <h4 className="mt-1 text-2xl font-bold text-slate-900">{recommendation.recommendedDoctor}</h4>
                  <p className="mt-2 text-sm text-slate-600">{recommendation.reasoningSummary}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {recommendation.suggestedServices?.map((service) => (
                    <motion.button
                      whileHover={{ y: -2, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      key={service}
                      onClick={() => onCompareService(service)}
                      className="rounded-full border border-brand-200 bg-white px-3 py-2 text-sm font-medium text-brand-800 shadow-sm transition hover:bg-brand-50"
                    >
                      {service}
                    </motion.button>
                  ))}
                </div>
              </>
            )}
          </Card>

          <Card className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-lg font-semibold">{t("ai.matchingHospitals")}</h3>
              {recommendation?.hospitalSuggestions?.length ? (
                <span className="text-sm text-slate-500">
                  {t("ai.matches").replace("{{count}}", recommendation.hospitalSuggestions.length)}
                </span>
              ) : null}
            </div>

            {!recommendation?.hospitalSuggestions?.length ? (
              <EmptyState
                title={t("ai.noHospitalsTitle")}
                subtitle={t("ai.noHospitalsText")}
              />
            ) : (
              <div className="space-y-3">
                {recommendation.hospitalSuggestions.slice(0, 5).map((suggestion, idx) => (
                  <motion.article
                    key={`${suggestion.serviceId}-${suggestion.hospital.id}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    className="rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-brand-200 hover:shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-slate-800">{suggestion.hospital.name}</p>
                        <p className="mt-1 text-sm text-slate-500">{suggestion.serviceName}</p>
                      </div>
                      <span className="rounded-lg bg-brand-50 px-2.5 py-1 text-sm font-semibold text-brand-700">
                        ₹{suggestion.price}
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-brand-700" />
                        {suggestion.hospital.location}
                      </span>
                      <span>{t("ai.rating")} {suggestion.hospital.rating}</span>
                    </div>
                  </motion.article>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

function ChatBubble({ role, children, label }) {
  const style =
    role === "assistant"
      ? "bg-brand-50 border-brand-100 text-brand-900"
      : role === "patient"
      ? "bg-white border-slate-200 text-slate-700"
      : "bg-slate-100 border-slate-200 text-slate-600";

  const Icon = role === "assistant" ? Bot : User;

  return (
    <div className={`rounded-2xl border px-4 py-3 text-sm ${style}`}>
      <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider">
        <Icon className="h-3.5 w-3.5" />
        {label || role}
      </div>
      {children}
    </div>
  );
}

function QuickCard({ icon: Icon, title, text }) {
  return (
    <Card className="space-y-2">
      <Icon className="h-5 w-5 text-brand-700" />
      <h4 className="font-semibold text-slate-800">{title}</h4>
      <p className="text-sm text-slate-500">{text}</p>
    </Card>
  );
}

function FlowRow({ index, title, text }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-700 text-sm font-bold text-white">
        {index}
      </div>
      <div>
        <h4 className="font-semibold text-slate-800">{title}</h4>
        <p className="mt-1 text-sm text-slate-600">{text}</p>
      </div>
    </div>
  );
}
