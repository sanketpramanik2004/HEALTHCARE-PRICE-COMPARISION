import { useMemo, useState } from "react";
import { Activity, CircleCheckBig, Clock3, IndianRupee, ListChecks, Plus, Search, ShieldCheck } from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import { useI18n } from "../i18n/I18nProvider";

export default function AdminDashboardPage({
  hospitalProfile,
  serviceForm,
  setServiceForm,
  slotForm,
  setSlotForm,
  adminServices,
  adminSlots,
  adminAppointments,
  onAddService,
  onAddSlot,
  onDeleteService,
  onDeleteSlot,
  onUpdateStatus,
  onRefresh,
}) {
  const { t } = useI18n();
  const [query, setQuery] = useState("");

  const filteredServices = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return adminServices;
    return adminServices.filter((service) => service.serviceName.toLowerCase().includes(normalized));
  }, [adminServices, query]);

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
        <div className="mt-5 grid gap-3 md:grid-cols-4">
          <Metric icon={ListChecks} label={t("adminDashboard.totalServices")} value={adminServices.length} />
          <Metric icon={Activity} label={t("adminDashboard.pendingApprovals")} value={pendingCount} />
          <Metric icon={CircleCheckBig} label={t("adminDashboard.confirmedToday")} value={confirmedCount} />
          <Metric icon={IndianRupee} label={t("adminDashboard.avgPrice")} value={`₹${avgPrice}`} />
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[360px,1fr]">
        <Card className="h-fit xl:sticky xl:top-6">
          <div className="mb-4 flex items-center gap-2">
            <div className="rounded-lg bg-brand-100 p-2 text-brand-800">
              <Plus className="h-4 w-4" />
            </div>
            <h3 className="font-semibold">{t("adminDashboard.addPricing")}</h3>
          </div>
          <form className="space-y-3" onSubmit={onAddService}>
            <input
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 transition focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100"
              placeholder={t("adminDashboard.serviceNamePlaceholder")}
              value={serviceForm.serviceName}
              onChange={(e) => setServiceForm((c) => ({ ...c, serviceName: e.target.value }))}
              required
            />
            <input
              type="number"
              min="0"
              step="0.01"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 transition focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100"
              placeholder={t("adminDashboard.pricePlaceholder")}
              value={serviceForm.price}
              onChange={(e) => setServiceForm((c) => ({ ...c, price: e.target.value }))}
              required
            />
            <Button className="w-full !py-3" type="submit">
              {t("adminDashboard.addService")}
            </Button>
          </form>

          <div className="mt-5 rounded-xl border border-brand-100 bg-brand-50 p-3 text-sm text-brand-900">
            <p className="inline-flex items-center gap-2 font-semibold">
              <ShieldCheck className="h-4 w-4" />
              {t("adminDashboard.adminTip")}
            </p>
            <p className="mt-1 text-brand-800/80">
              {t("adminDashboard.adminTipText")}
            </p>
          </div>

          <div className="mt-6 border-t border-slate-200 pt-5">
            <div className="mb-4 flex items-center gap-2">
              <div className="rounded-lg bg-emerald-100 p-2 text-emerald-700">
                <Clock3 className="h-4 w-4" />
              </div>
              <h3 className="font-semibold text-slate-900">Create booking slot</h3>
            </div>
            <form className="space-y-3" onSubmit={onAddSlot}>
              <select
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 transition focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100"
                value={slotForm.serviceName}
                onChange={(e) => setSlotForm((c) => ({ ...c, serviceName: e.target.value }))}
                required
              >
                <option value="">Select service</option>
                {adminServices.map((service) => (
                  <option key={service.id} value={service.serviceName}>
                    {service.serviceName}
                  </option>
                ))}
              </select>
              <input
                type="date"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 transition focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100"
                value={slotForm.slotDate}
                onChange={(e) => setSlotForm((c) => ({ ...c, slotDate: e.target.value }))}
                required
              />
              <input
                type="time"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 transition focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100"
                value={slotForm.slotTime}
                onChange={(e) => setSlotForm((c) => ({ ...c, slotTime: e.target.value }))}
                required
              />
              <Button className="w-full !py-3" type="submit" disabled={adminServices.length === 0}>
                Add Slot
              </Button>
            </form>
          </div>
        </Card>

        <div className="space-y-6">
          <Card>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h3 className="font-semibold text-lg">{t("adminDashboard.serviceList")}</h3>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    className="rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none transition focus:border-brand-300 focus:ring-2 focus:ring-brand-100"
                    placeholder={t("adminDashboard.searchService")}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
                <span className="text-sm text-slate-500">{filteredServices.length} services</span>
              </div>
            </div>
            <div className="grid max-h-[640px] gap-3 overflow-y-auto pr-1 md:grid-cols-2">
              {filteredServices.length === 0 ? (
                <EmptyState title={t("adminDashboard.noServicesTitle")} subtitle={t("adminDashboard.noServicesText")} />
              ) : (
                filteredServices.map((service) => (
                  <div
                    key={service.id}
                    className="rounded-xl border border-slate-200 bg-white p-4 transition hover:border-brand-200 hover:shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-semibold text-slate-800">{service.serviceName}</p>
                      <span className="rounded-lg bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700">
                        ₹{service.price}
                      </span>
                    </div>
                    <Button variant="secondary" className="mt-3" onClick={() => onDeleteService(service.id)}>
                      {t("adminDashboard.delete")}
                    </Button>
                  </div>
                ))
              )}
            </div>
          </Card>

          <Card>
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="font-semibold text-lg">Booking Slots</h3>
              <span className="text-sm text-slate-500">{adminSlots.length} total</span>
            </div>
            <div className="grid max-h-[360px] gap-3 overflow-y-auto pr-1 md:grid-cols-2">
              {adminSlots.length === 0 ? (
                <EmptyState
                  title="No slots created yet"
                  subtitle="Create slots so patients can book only the times your hospital supports."
                />
              ) : (
                adminSlots.map((slot) => (
                  <div
                    key={slot.id}
                    className="rounded-xl border border-slate-200 bg-white p-4 transition hover:border-brand-200 hover:shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-slate-800">{slot.serviceName}</p>
                        <p className="mt-1 text-sm text-slate-500">
                          {slot.slotDate} at {slot.slotTime}
                        </p>
                      </div>
                      <Button variant="secondary" onClick={() => onDeleteSlot(slot.id)}>
                        Delete
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

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
                    <p className="text-sm text-slate-500">
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
        </div>
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

  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${style}`}>{labels?.[status] || status}</span>;
}
