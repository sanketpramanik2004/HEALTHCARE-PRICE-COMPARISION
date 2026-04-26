import { Clock3 } from "lucide-react";
import AdminHero from "../components/admin/AdminHero";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import EmptyState from "../components/ui/EmptyState";

export default function AdminSlotsPage({
  hospitalProfile,
  slotForm,
  setSlotForm,
  adminServices,
  adminSlots,
  adminDoctors,
  adminAppointments,
  onAddSlot,
  onDeleteSlot,
}) {
  return (
    <AdminHero
      hospitalProfile={hospitalProfile}
      adminServices={adminServices}
      adminAppointments={adminAppointments}
      adminDoctors={adminDoctors}
    >
      <div className="grid gap-6 xl:grid-cols-[340px,1fr]">
        <Card className="h-fit xl:sticky xl:top-6">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-emerald-100 p-2 text-emerald-700">
              <Clock3 className="h-4 w-4" />
            </div>
            <h3 className="font-semibold text-slate-900">Create booking slot</h3>
          </div>
          <form className="mt-4 space-y-3" onSubmit={onAddSlot}>
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
        </Card>

        <Card>
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="font-semibold text-lg">Booking slots</h3>
            <span className="text-sm text-slate-500">{adminSlots.length} total</span>
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {adminSlots.length === 0 ? (
              <EmptyState title="No slots created yet" subtitle="Create slots so patients can book only the times your hospital supports." />
            ) : (
              adminSlots.map((slot) => (
                <div key={slot.id} className="rounded-xl border border-slate-200 bg-white p-4 transition hover:border-brand-200 hover:shadow-sm">
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
      </div>
    </AdminHero>
  );
}
