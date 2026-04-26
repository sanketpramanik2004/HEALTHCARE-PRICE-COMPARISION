import { useEffect, useState } from "react";
import { CalendarDays, Clock3, MapPin, ShieldCheck, Stethoscope, UserRound } from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";

export default function BookingPage({
  selectedHospital,
  selectedDoctor,
  serviceName,
  bookingForm,
  setBookingForm,
  availableSlots,
  onLoadSlots,
  onSubmit,
  canBook,
}) {
  const [step, setStep] = useState(1);

  useEffect(() => {
    setStep(1);
  }, [selectedHospital?.id, selectedDoctor?.id, serviceName]);

  if (!canBook) {
    return <EmptyState title="Patient login required" subtitle="Please sign in with a USER account to book." />;
  }

  if (!selectedHospital) {
    return (
      <EmptyState
        title="No hospital selected"
        subtitle="Go to Explore or Hospital Details and select a hospital before booking."
      />
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-mesh">
        <p className="text-xs uppercase tracking-[0.2em] text-brand-700">Step {step} of 2</p>
        <h2 className="mt-2 text-2xl font-bold">Book at {selectedHospital.name}</h2>
        <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-600">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1.5">
            <Stethoscope className="h-4 w-4 text-brand-700" />
            {selectedDoctor ? `${selectedDoctor.specialization} Consultation` : serviceName}
          </span>
          {selectedDoctor ? (
            <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1.5">
              <UserRound className="h-4 w-4 text-brand-700" />
              Dr. {selectedDoctor.name}
            </span>
          ) : null}
          <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1.5">
            <CalendarDays className="h-4 w-4 text-brand-700" />
            {selectedDoctor ? "Choose a consultation slot" : "Choose a verified hospital slot"}
          </span>
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1.2fr,0.8fr]">
        <div className="space-y-6">
          <Card>
            {step === 1 ? (
              <div className="space-y-3">
                <h3 className="font-semibold">Patient details</h3>
                <div className="grid gap-3 md:grid-cols-2">
                  <input
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3"
                    placeholder="Patient full name"
                    value={bookingForm.userName}
                    onChange={(e) => setBookingForm((c) => ({ ...c, userName: e.target.value }))}
                    required
                  />
                  <input
                    type="number"
                    min="0"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3"
                    placeholder="Age"
                    value={bookingForm.patientAge}
                    onChange={(e) => setBookingForm((c) => ({ ...c, patientAge: e.target.value }))}
                    required
                  />
                  <select
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3"
                    value={bookingForm.patientGender}
                    onChange={(e) => setBookingForm((c) => ({ ...c, patientGender: e.target.value }))}
                    required
                  >
                    <option value="">Select gender</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                  <input
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3"
                    placeholder="Phone number"
                    value={bookingForm.phoneNumber}
                    onChange={(e) => setBookingForm((c) => ({ ...c, phoneNumber: e.target.value }))}
                    required
                  />
                </div>
                <textarea
                  rows={4}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3"
                  placeholder="Symptoms, reason for visit, or any patient notes"
                  value={bookingForm.patientNotes}
                  onChange={(e) => setBookingForm((c) => ({ ...c, patientNotes: e.target.value }))}
                />
                <Button
                  onClick={() => setStep(2)}
                  disabled={
                    !bookingForm.userName.trim() ||
                    !String(bookingForm.patientAge).trim() ||
                    !bookingForm.patientGender.trim() ||
                    !bookingForm.phoneNumber.trim()
                  }
                >
                  Continue
                </Button>
              </div>
            ) : (
              <form className="space-y-4" onSubmit={onSubmit}>
                <h3 className="font-semibold">Select schedule</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-[240px,1fr]">
                  <input
                    type="date"
                    className="rounded-xl border border-slate-200 bg-white px-4 py-3"
                    value={bookingForm.date}
                    onChange={(e) => {
                      const value = e.target.value;
                      setBookingForm((c) => ({ ...c, date: value, time: "" }));
                      onLoadSlots(value);
                    }}
                    required
                  />
                  <div className="min-h-[172px] rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                    <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <Clock3 className="h-4 w-4 text-brand-700" />
                      Available time slots
                    </div>

                    {!bookingForm.date ? (
                      <p className="text-sm text-slate-500">Pick a date first to load available slots.</p>
                    ) : availableSlots.length === 0 ? (
                      <div className="rounded-xl border border-dashed border-slate-200 bg-white/70 p-4 text-sm text-slate-500">
                        No open slots for this date yet. Try another date.
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {availableSlots.map((slot) => (
                          <button
                            key={slot.id}
                            type="button"
                            onClick={() => setBookingForm((c) => ({ ...c, time: slot.slotTime }))}
                            className={`rounded-full border px-3 py-2 text-sm font-medium transition ${
                              bookingForm.time === slot.slotTime
                                ? "border-brand-700 bg-brand-700 text-white"
                                : "border-slate-200 bg-white text-slate-700 hover:border-brand-200 hover:bg-brand-50"
                            }`}
                          >
                            {slot.slotTime}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" type="button" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button type="submit" disabled={!bookingForm.date || !bookingForm.time}>
                    Confirm Booking
                  </Button>
                </div>
              </form>
            )}
          </Card>

          <div className="grid gap-4 md:grid-cols-3">
            <InfoCard
              icon={ShieldCheck}
              title="Admin-reviewed bookings"
              text="Every request goes through hospital approval before it becomes confirmed."
            />
            <InfoCard
              icon={Clock3}
              title="Live slot protection"
              text="Only verified available slots are shown, which helps prevent double booking."
            />
            <InfoCard
              icon={MapPin}
              title="Hospital-aware flow"
              text="Your request is tied to the selected hospital, service, and route-ready location."
            />
          </div>
        </div>

        <div className="space-y-6">
          <Card className="space-y-4">
            <div className="flex items-center gap-2">
              <UserRound className="h-4 w-4 text-brand-700" />
              <h3 className="text-lg font-semibold">Booking summary</h3>
            </div>
            <div className="space-y-3 text-sm text-slate-600">
              <SummaryRow label="Hospital" value={selectedHospital.name} />
              <SummaryRow label="Location" value={selectedHospital.location} />
              <SummaryRow label="Service" value={selectedDoctor ? `${selectedDoctor.specialization} Consultation` : serviceName} />
              {selectedDoctor ? <SummaryRow label="Doctor" value={`Dr. ${selectedDoctor.name}`} /> : null}
              {selectedDoctor ? <SummaryRow label="Experience" value={`${selectedDoctor.experience || 0} years`} /> : null}
              {selectedDoctor ? <SummaryRow label="Consultation Fee" value={`₹${selectedDoctor.consultationFee}`} /> : null}
              <SummaryRow label="Patient" value={bookingForm.userName || "Add patient details"} />
              <SummaryRow label="Age" value={bookingForm.patientAge || "-"} />
              <SummaryRow label="Gender" value={bookingForm.patientGender || "-"} />
              <SummaryRow label="Phone" value={bookingForm.phoneNumber || "-"} />
              <SummaryRow label="Date" value={bookingForm.date || "Select a date"} />
              <SummaryRow label="Slot" value={bookingForm.time || "Pick an available slot"} />
            </div>
            {bookingForm.patientNotes ? (
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Patient notes</p>
                <p className="mt-2 text-sm text-slate-600">{bookingForm.patientNotes}</p>
              </div>
            ) : null}
          </Card>

          <Card className="space-y-3">
            <h3 className="text-lg font-semibold">Before you confirm</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>Check patient name and phone number carefully so the hospital can contact you if needed.</li>
              <li>Choose a live slot from the list to avoid failed booking attempts.</li>
              <li>Use patient notes to mention symptoms, history, or special assistance requirements.</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ icon: Icon, title, text }) {
  return (
    <Card className="space-y-2">
      <div className="inline-flex rounded-xl bg-brand-50 p-2 text-brand-700">
        <Icon className="h-4 w-4" />
      </div>
      <h4 className="font-semibold text-slate-800">{title}</h4>
      <p className="text-sm text-slate-500">{text}</p>
    </Card>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-2">
      <span className="text-slate-500">{label}</span>
      <span className="text-right font-medium text-slate-800">{value}</span>
    </div>
  );
}
