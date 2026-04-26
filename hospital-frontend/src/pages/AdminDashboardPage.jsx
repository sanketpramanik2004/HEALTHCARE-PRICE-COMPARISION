import { ArrowRight, CalendarClock, ShieldPlus, Stethoscope, TimerReset } from "lucide-react";
import { Link } from "react-router-dom";
import AdminHero from "../components/admin/AdminHero";
import Card from "../components/ui/Card";
import EmptyState from "../components/ui/EmptyState";

export default function AdminDashboardPage({
  hospitalProfile,
  adminServices,
  adminDoctors,
  adminAppointments,
}) {
  const pendingAppointments = adminAppointments.filter((appt) => appt.status === "PENDING");

  return (
    <AdminHero hospitalProfile={hospitalProfile} adminServices={adminServices} adminAppointments={adminAppointments} adminDoctors={adminDoctors}>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <OverviewLinkCard
          icon={ShieldPlus}
          title="Services"
          text="Manage price catalog and keep comparison data up to date."
          count={`${adminServices.length} services`}
          to="/admin/services"
        />
        <OverviewLinkCard
          icon={Stethoscope}
          title="Doctors"
          text="Add consultation specialists and control doctor-facing bookings."
          count={`${adminDoctors.length} doctors`}
          to="/admin/doctors"
        />
        <OverviewLinkCard
          icon={TimerReset}
          title="Slots"
          text="Create and maintain slot availability for hospital services."
          count="Manage live slots"
          to="/admin/slots"
        />
        <OverviewLinkCard
          icon={CalendarClock}
          title="Approvals"
          text="Review incoming patient requests and update their booking status."
          count={`${pendingAppointments.length} pending`}
          to="/admin/approvals"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr,0.9fr]">
        <Card>
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-lg font-semibold text-slate-900">Pending approvals snapshot</h3>
            <Link to="/admin/approvals" className="text-sm font-semibold text-brand-700">
              Open approvals
            </Link>
          </div>
          <div className="space-y-3">
            {pendingAppointments.length === 0 ? (
              <EmptyState title="No pending approvals" subtitle="New appointment requests will appear here first." />
            ) : (
              pendingAppointments.slice(0, 4).map((appt) => (
                <div key={appt.id} className="rounded-xl border border-slate-200 bg-white p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-800">{appt.userName}</p>
                      <p className="text-sm text-slate-500">{appt.serviceName}</p>
                    </div>
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                      {appt.status}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-500">
                    {appt.date} at {appt.time}
                  </p>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card>
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-lg font-semibold text-slate-900">Team and catalog snapshot</h3>
            <Link to="/admin/doctors" className="text-sm font-semibold text-brand-700">
              Open doctors
            </Link>
          </div>
          <div className="space-y-5">
            <div>
              <p className="text-sm font-semibold text-slate-500">Recently managed doctors</p>
              <div className="mt-3 space-y-2">
                {adminDoctors.slice(0, 3).map((doctor) => (
                  <div key={doctor.id} className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                    <p className="font-semibold text-slate-800">Dr. {doctor.name}</p>
                    <p className="text-sm text-slate-500">{doctor.specialization}</p>
                  </div>
                ))}
                {adminDoctors.length === 0 ? <p className="text-sm text-slate-500">No doctors added yet.</p> : null}
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500">Recently managed services</p>
              <div className="mt-3 space-y-2">
                {adminServices.slice(0, 3).map((service) => (
                  <div key={service.id} className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                    <p className="font-semibold text-slate-800">{service.serviceName}</p>
                    <p className="text-sm text-slate-500">₹{service.price}</p>
                  </div>
                ))}
                {adminServices.length === 0 ? <p className="text-sm text-slate-500">No services added yet.</p> : null}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </AdminHero>
  );
}

function OverviewLinkCard({ icon: Icon, title, text, count, to }) {
  return (
    <Link to={to}>
      <Card className="h-full border-brand-100 bg-gradient-to-br from-white to-brand-50/60 transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-card">
        <div className="inline-flex rounded-xl bg-brand-100 p-2 text-brand-700 shadow-sm">
          <Icon className="h-4 w-4" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-slate-900">{title}</h3>
        <p className="mt-2 text-sm text-slate-500">{text}</p>
        <div className="mt-4 flex items-center justify-between rounded-xl bg-white/90 px-3 py-2 text-sm font-semibold text-brand-700 ring-1 ring-brand-100">
          <span>{count}</span>
          <span className="inline-flex items-center gap-1">
            Open
            <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </Card>
    </Link>
  );
}
