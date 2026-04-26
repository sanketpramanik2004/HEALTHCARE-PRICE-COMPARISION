import AdminHero from "../components/admin/AdminHero";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import EmptyState from "../components/ui/EmptyState";

export default function AdminDoctorsPage({
  hospitalProfile,
  doctorForm,
  setDoctorForm,
  adminServices,
  adminDoctors,
  adminAppointments,
  onAddDoctor,
  onDeleteDoctor,
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
          <h3 className="font-semibold text-lg">Add doctor</h3>
          <form className="mt-4 space-y-3" onSubmit={onAddDoctor}>
            <input
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3"
              placeholder="Doctor name"
              value={doctorForm.name}
              onChange={(e) => setDoctorForm((c) => ({ ...c, name: e.target.value }))}
              required
            />
            <input
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3"
              placeholder="Specialization"
              value={doctorForm.specialization}
              onChange={(e) => setDoctorForm((c) => ({ ...c, specialization: e.target.value }))}
              required
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                min="0"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3"
                placeholder="Experience"
                value={doctorForm.experience}
                onChange={(e) => setDoctorForm((c) => ({ ...c, experience: e.target.value }))}
              />
              <input
                type="number"
                min="0"
                step="0.01"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3"
                placeholder="Fee"
                value={doctorForm.consultationFee}
                onChange={(e) => setDoctorForm((c) => ({ ...c, consultationFee: e.target.value }))}
                required
              />
            </div>
            <input
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3"
              placeholder="Availability e.g. 09:00,10:00,11:00"
              value={doctorForm.availability}
              onChange={(e) => setDoctorForm((c) => ({ ...c, availability: e.target.value }))}
            />
            <Button className="w-full" type="submit">
              Add Doctor
            </Button>
          </form>
        </Card>

        <Card>
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="font-semibold text-lg">Doctor list</h3>
            <span className="text-sm text-slate-500">{adminDoctors.length} doctors</span>
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {adminDoctors.length === 0 ? (
              <EmptyState title="No doctors added yet" subtitle="Add doctors so users can book consultation appointments by specialization." />
            ) : (
              adminDoctors.map((doctor) => (
                <div key={doctor.id} className="rounded-xl border border-slate-200 bg-white p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-800">Dr. {doctor.name}</p>
                      <p className="text-sm text-slate-500">{doctor.specialization}</p>
                    </div>
                    <span className="rounded-lg bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700">₹{doctor.consultationFee}</span>
                  </div>
                  <div className="mt-2 space-y-1 text-sm text-slate-500">
                    <p>Experience: {doctor.experience || 0} years</p>
                    <p>Availability: {doctor.availability || "Not set"}</p>
                  </div>
                  <Button variant="secondary" className="mt-3" onClick={() => onDeleteDoctor(doctor.id)}>
                    Delete
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
