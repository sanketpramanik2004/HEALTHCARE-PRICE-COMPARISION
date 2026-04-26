import AdminHero from "../components/admin/AdminHero";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import EmptyState from "../components/ui/EmptyState";
import { useI18n } from "../i18n/I18nProvider";

export default function AdminApprovalsPage({
  hospitalProfile,
  adminServices,
  adminDoctors,
  adminAppointments,
  onUpdateStatus,
  onRefresh,
}) {
  const { t } = useI18n();

  return (
    <AdminHero
      hospitalProfile={hospitalProfile}
      adminServices={adminServices}
      adminAppointments={adminAppointments}
      adminDoctors={adminDoctors}
    >
      <Card>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-semibold text-lg">{t("adminDashboard.approvals")}</h3>
          <Button variant="ghost" onClick={onRefresh}>
            {t("adminDashboard.refresh")}
          </Button>
        </div>
        <div className="grid gap-3">
          {adminAppointments.length === 0 ? (
            <EmptyState title={t("adminDashboard.noPendingTitle")} subtitle={t("adminDashboard.noPendingText")} />
          ) : (
            adminAppointments.map((appt) => (
              <div key={appt.id} className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold text-slate-800">{appt.userName}</p>
                  <StatusPill
                    status={appt.status}
                    labels={{
                      CONFIRMED: t("userDashboard.confirmed"),
                      PENDING: t("userDashboard.pending"),
                      REJECTED: t("userDashboard.rejected"),
                    }}
                  />
                </div>
                <p className="text-sm text-slate-600">{appt.serviceName}</p>
                {appt.doctor ? <p className="mt-1 text-sm text-brand-700">Doctor: Dr. {appt.doctor.name}</p> : null}
                <div className="mt-2 grid gap-1 text-sm text-slate-500 md:grid-cols-2">
                  <p>Age: {appt.patientAge ?? "-"}</p>
                  <p>Gender: {appt.patientGender || "-"}</p>
                  <p>Phone: {appt.phoneNumber || "-"}</p>
                  <p>Email: {appt.userEmail || "-"}</p>
                </div>
                {appt.patientNotes ? (
                  <p className="mt-2 rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-600">
                    Notes: {appt.patientNotes}
                  </p>
                ) : null}
                <p className="mt-2 text-sm text-slate-500">
                  {appt.date} at {appt.time}
                </p>
                {appt.status === "PENDING" ? (
                  <div className="mt-3 flex gap-2">
                    <Button onClick={() => onUpdateStatus(appt.id, "CONFIRMED")}>{t("adminDashboard.confirm")}</Button>
                    <Button variant="secondary" onClick={() => onUpdateStatus(appt.id, "REJECTED")}>
                      {t("adminDashboard.reject")}
                    </Button>
                  </div>
                ) : null}
              </div>
            ))
          )}
        </div>
      </Card>
    </AdminHero>
  );
}

function StatusPill({ status, labels }) {
  const style =
    status === "CONFIRMED"
      ? "bg-emerald-100 text-emerald-700"
      : status === "REJECTED"
      ? "bg-rose-100 text-rose-700"
      : "bg-amber-100 text-amber-700";

  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${style}`}>{labels?.[status] || status}</span>;
}
