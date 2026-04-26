import { Search, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";
import AdminHero from "../components/admin/AdminHero";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import EmptyState from "../components/ui/EmptyState";
import { useI18n } from "../i18n/I18nProvider";

export default function AdminServicesPage({
  hospitalProfile,
  serviceForm,
  setServiceForm,
  adminServices,
  adminAppointments,
  adminDoctors,
  onAddService,
  onDeleteService,
}) {
  const { t } = useI18n();
  const [query, setQuery] = useState("");

  const filteredServices = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return adminServices;
    return adminServices.filter((service) => service.serviceName.toLowerCase().includes(normalized));
  }, [adminServices, query]);

  return (
    <AdminHero
      hospitalProfile={hospitalProfile}
      adminServices={adminServices}
      adminAppointments={adminAppointments}
      adminDoctors={adminDoctors}
    >
      <div className="grid gap-6 xl:grid-cols-[360px,1fr]">
        <Card className="h-fit xl:sticky xl:top-6">
          <h3 className="font-semibold">{t("adminDashboard.addPricing")}</h3>
          <form className="mt-4 space-y-3" onSubmit={onAddService}>
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
            <p className="mt-1 text-brand-800/80">{t("adminDashboard.adminTipText")}</p>
          </div>
        </Card>

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
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {filteredServices.length === 0 ? (
              <EmptyState title={t("adminDashboard.noServicesTitle")} subtitle={t("adminDashboard.noServicesText")} />
            ) : (
              filteredServices.map((service) => (
                <div key={service.id} className="rounded-xl border border-slate-200 bg-white p-4 transition hover:border-brand-200 hover:shadow-sm">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-slate-800">{service.serviceName}</p>
                    <span className="rounded-lg bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700">₹{service.price}</span>
                  </div>
                  <Button variant="secondary" className="mt-3" onClick={() => onDeleteService(service.id)}>
                    {t("adminDashboard.delete")}
                  </Button>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </AdminHero>
  );
}
