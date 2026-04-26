import { Activity, CircleCheckBig, IndianRupee, ListChecks } from "lucide-react";
import Card from "../ui/Card";
import AdminWorkspaceNav from "./AdminWorkspaceNav";
import { useI18n } from "../../i18n/I18nProvider";

export default function AdminHero({ hospitalProfile, adminServices, adminAppointments, adminDoctors, children }) {
  const { t } = useI18n();
  const pendingCount = adminAppointments.filter((a) => a.status === "PENDING").length;
  const confirmedCount = adminAppointments.filter((a) => a.status === "CONFIRMED").length;
  const avgPrice =
    adminServices.length > 0
      ? Math.round(adminServices.reduce((sum, s) => sum + Number(s.price || 0), 0) / adminServices.length)
      : 0;

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-brand-700 via-brand-700 to-emerald-600 p-7 text-white">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/75">{t("adminDashboard.badge")}</p>
        <h2 className="mt-2 text-3xl font-bold">{hospitalProfile?.name || t("adminDashboard.fallbackTitle")}</h2>
        <p className="mt-1 text-white/85">
          {hospitalProfile?.location || t("adminDashboard.fallbackText")}
        </p>
        <div className="mt-5 grid gap-3 md:grid-cols-5">
          <Metric icon={ListChecks} label={t("adminDashboard.totalServices")} value={adminServices.length} />
          <Metric icon={Activity} label={t("adminDashboard.pendingApprovals")} value={pendingCount} />
          <Metric icon={CircleCheckBig} label={t("adminDashboard.confirmedToday")} value={confirmedCount} />
          <Metric icon={IndianRupee} label={t("adminDashboard.avgPrice")} value={`₹${avgPrice}`} />
          <Metric icon={CircleCheckBig} label="Doctors" value={adminDoctors.length} />
        </div>
      </Card>

      <Card className="space-y-4 bg-white/70">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Admin Navigation</p>
            <h3 className="mt-1 text-xl font-semibold text-slate-900">Manage hospital operations by section</h3>
          </div>
        </div>
        <AdminWorkspaceNav />
      </Card>

      {children}
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
