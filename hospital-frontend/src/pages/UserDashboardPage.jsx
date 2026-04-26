import { useMemo, useState } from "react";
import { CalendarClock, CircleCheckBig, Clock3, Filter, MapPin, ShieldX } from "lucide-react";
import { motion } from "framer-motion";
import Card from "../components/ui/Card";
import EmptyState from "../components/ui/EmptyState";
import Button from "../components/ui/Button";
import { useI18n } from "../i18n/I18nProvider";

export default function UserDashboardPage({ appointments }) {
  const { t } = useI18n();
  const [statusFilter, setStatusFilter] = useState("ALL");

  const counts = useMemo(() => {
    return {
      total: appointments.length,
      confirmed: appointments.filter((a) => a.status === "CONFIRMED").length,
      pending: appointments.filter((a) => a.status === "PENDING").length,
      rejected: appointments.filter((a) => a.status === "REJECTED").length,
    };
  }, [appointments]);

  const filteredAppointments = useMemo(() => {
    if (statusFilter === "ALL") return appointments;
    return appointments.filter((a) => a.status === statusFilter);
  }, [appointments, statusFilter]);

  const nextAppointment = useMemo(() => {
    const confirmed = appointments.filter((a) => a.status === "CONFIRMED");
    if (confirmed.length === 0) return null;
    return confirmed[0];
  }, [appointments]);

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-brand-700 via-brand-700 to-emerald-600 p-7 text-white">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/75">{t("userDashboard.badge")}</p>
        <h2 className="mt-2 text-3xl font-bold">{t("userDashboard.title")}</h2>
        <p className="mt-1 text-white/85">{t("userDashboard.subtitle")}</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Metric icon={CalendarClock} label={t("userDashboard.total")} value={counts.total} />
          <Metric icon={CircleCheckBig} label={t("userDashboard.confirmed")} value={counts.confirmed} />
          <Metric icon={Clock3} label={t("userDashboard.pending")} value={counts.pending} />
          <Metric icon={ShieldX} label={t("userDashboard.rejected")} value={counts.rejected} />
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1fr,300px]">
        <section className="space-y-4">
          <Card>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="inline-flex items-center gap-2 text-slate-700">
                <Filter className="h-4 w-4 text-brand-700" />
                <p className="text-sm font-semibold">{t("userDashboard.filter")}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {["ALL", "PENDING", "CONFIRMED", "REJECTED"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                      statusFilter === status
                        ? "bg-brand-700 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {status === "ALL"
                      ? t("userDashboard.all")
                      : status === "PENDING"
                      ? t("userDashboard.pending")
                      : status === "CONFIRMED"
                      ? t("userDashboard.confirmed")
                      : t("userDashboard.rejected")}
                  </button>
                ))}
              </div>
            </div>
          </Card>

          <section className="grid gap-4 md:grid-cols-2">
            {filteredAppointments.length === 0 ? (
              <EmptyState
                title={t("userDashboard.noFilteredTitle")}
                subtitle={t("userDashboard.noFilteredText")}
              />
            ) : (
              filteredAppointments.map((appt, idx) => (
                <motion.div
                  key={appt.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                >
                  <Card className="h-full border border-slate-100">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-slate-800">{appt.hospital?.name}</h3>
                        <p className="text-sm text-slate-500">{appt.serviceName}</p>
                      </div>
                      <StatusPill status={appt.status} />
                    </div>
                    <div className="mt-3 space-y-1 text-sm text-slate-600">
                      {appt.doctor ? <p>Doctor: Dr. {appt.doctor.name}</p> : null}
                      <p className="inline-flex items-center gap-2">
                        <CalendarClock className="h-4 w-4 text-brand-700" />
                        {appt.date} at {appt.time}
                      </p>
                      <p className="inline-flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-brand-700" />
                        {appt.hospital?.location || t("userDashboard.locationUnavailable")}
                      </p>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button variant="ghost" className="!px-3 !py-2 text-xs">
                        {t("userDashboard.viewDetails")}
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))
            )}
          </section>
        </section>

        <aside className="space-y-4">
          <Card>
            <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">{t("userDashboard.nextVisit")}</h3>
            {nextAppointment ? (
              <div className="mt-3 space-y-2">
                <p className="text-lg font-semibold text-slate-800">{nextAppointment.hospital?.name}</p>
                <p className="text-sm text-slate-600">{nextAppointment.serviceName}</p>
                <p className="inline-flex items-center gap-2 text-sm text-slate-600">
                  <CalendarClock className="h-4 w-4 text-brand-700" />
                  {nextAppointment.date} at {nextAppointment.time}
                </p>
                <StatusPill
                  status="CONFIRMED"
                  labels={{
                    CONFIRMED: t("userDashboard.confirmed"),
                    PENDING: t("userDashboard.pending"),
                    REJECTED: t("userDashboard.rejected"),
                  }}
                />
              </div>
            ) : (
              <p className="mt-3 text-sm text-slate-500">{t("userDashboard.noConfirmed")}</p>
            )}
          </Card>

          <Card>
            <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">{t("userDashboard.quickTips")}</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>{t("userDashboard.tip1")}</li>
              <li>{t("userDashboard.tip2")}</li>
              <li>{t("userDashboard.tip3")}</li>
            </ul>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function Metric({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl border border-white/20 bg-white/10 p-3 backdrop-blur">
      <div className="inline-flex items-center gap-2 text-white/85">
        <Icon className="h-4 w-4" />
        <span className="text-xs uppercase tracking-wider">{label}</span>
      </div>
      <p className="mt-1 text-2xl font-bold">{value}</p>
    </div>
  );
}

function StatusPill({ status, labels }) {
  const style =
    status === "CONFIRMED"
      ? "bg-emerald-100 text-emerald-700"
      : status === "REJECTED"
      ? "bg-rose-100 text-rose-700"
      : "bg-amber-100 text-amber-700";

  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${style}`}>{labels?.[status] || status}</span>;
}
