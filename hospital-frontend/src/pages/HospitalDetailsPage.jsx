import { useMemo } from "react";
import { useParams } from "react-router-dom";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";

export default function HospitalDetailsPage({ hospitals, compareResults, onBookNow }) {
  const { id } = useParams();
  const hospitalId = Number(id);

  const hospital = useMemo(() => hospitals.find((h) => h.id === hospitalId), [hospitals, hospitalId]);
  const services = useMemo(
    () => compareResults.filter((r) => r.hospital?.id === hospitalId),
    [compareResults, hospitalId]
  );

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
    </div>
  );
}
