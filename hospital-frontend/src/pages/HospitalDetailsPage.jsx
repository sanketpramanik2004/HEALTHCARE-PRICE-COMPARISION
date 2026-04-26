import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { BriefcaseMedical, Clock3, MapPin } from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import { API_BASE_URL, fetchJson } from "../lib/api";

export default function HospitalDetailsPage({ hospitals, compareResults, onBookNow, onBookDoctor }) {
  const { id } = useParams();
  const hospitalId = Number(id);
  const [doctors, setDoctors] = useState([]);
  const [doctorError, setDoctorError] = useState("");

  const hospital = useMemo(() => hospitals.find((h) => h.id === hospitalId), [hospitals, hospitalId]);
  const services = useMemo(
    () => compareResults.filter((r) => r.hospital?.id === hospitalId),
    [compareResults, hospitalId]
  );

  useEffect(() => {
    let ignore = false;

    async function loadDoctors() {
      try {
        const data = await fetchJson(`${API_BASE_URL}/${hospitalId}/doctors`);
        if (!ignore) {
          setDoctors(data);
          setDoctorError("");
        }
      } catch (error) {
        if (!ignore) {
          setDoctors([]);
          setDoctorError(error.message);
        }
      }
    }

    if (hospitalId) {
      loadDoctors();
    }

    return () => {
      ignore = true;
    };
  }, [hospitalId]);

  if (!hospital) {
    return <EmptyState title="Hospital not found" subtitle="Return to Explore and select a hospital card." />;
  }

  return (
    <div className="space-y-6">
      <Card className="bg-mesh p-8">
        <p className="text-xs uppercase tracking-[0.2em] text-brand-700">Hospital Details</p>
        <h2 className="mt-3 text-3xl font-bold">{hospital.name}</h2>
        <p className="mt-2 text-slate-600">{hospital.location}</p>
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <span className="rounded-lg bg-white px-3 py-1.5">Rating: {hospital.rating}</span>
          <span className="rounded-lg bg-white px-3 py-1.5">
            Co-ordinates: {hospital.latitude}, {hospital.longitude}
          </span>
        </div>
        <div className="mt-5">
          <Button onClick={() => onBookNow(hospital)}>Book Appointment</Button>
        </div>
      </Card>

      <section className="grid gap-4 md:grid-cols-2">
        {services.length === 0 ? (
          <EmptyState
            title="No loaded services yet"
            subtitle="Run a compare query from Explore to pull services into this detail view."
          />
        ) : (
          services.map((s) => (
            <Card key={`${s.hospital.id}-${s.serviceName}-${s.price}`}>
              <h3 className="font-semibold">{s.serviceName}</h3>
              <p className="mt-1 text-sm text-slate-500">Estimated price</p>
              <p className="mt-2 text-lg font-bold text-brand-800">₹{s.price}</p>
            </Card>
          ))
        )}
      </section>

      <Card className="space-y-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-brand-700">Doctor Network</p>
            <h3 className="mt-2 text-2xl font-semibold">Consultation specialists at this hospital</h3>
          </div>
          <span className="rounded-full bg-brand-50 px-3 py-1.5 text-sm font-semibold text-brand-700">
            {doctors.length} doctors
          </span>
        </div>

        {doctorError ? (
          <EmptyState title="Doctors could not be loaded" subtitle={doctorError} />
        ) : doctors.length === 0 ? (
          <EmptyState
            title="No doctors listed yet"
            subtitle="Add doctors from the admin dashboard to enable consultation booking here."
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {doctors.map((doctor) => (
              <Card key={doctor.id} className="space-y-4 border border-slate-100">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="font-semibold text-slate-900">Dr. {doctor.name}</h4>
                    <p className="mt-1 text-sm text-slate-500">{doctor.specialization}</p>
                  </div>
                  <span className="rounded-lg bg-brand-100 px-3 py-1 text-sm font-semibold text-brand-800">
                    ₹{doctor.consultationFee}
                  </span>
                </div>

                <div className="space-y-2 text-sm text-slate-600">
                  <p className="inline-flex items-center gap-2">
                    <BriefcaseMedical className="h-4 w-4 text-brand-700" />
                    {doctor.experience || 0} years experience
                  </p>
                  <p className="inline-flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-brand-700" />
                    {doctor.hospital.location}
                  </p>
                  <p className="inline-flex items-center gap-2">
                    <Clock3 className="h-4 w-4 text-brand-700" />
                    {doctor.availability || "Availability shared during booking"}
                  </p>
                </div>

                <Button className="w-full" onClick={() => onBookDoctor(doctor)}>
                  Book Consultation
                </Button>
              </Card>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
