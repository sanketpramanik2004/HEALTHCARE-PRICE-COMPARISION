import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import HospitalMap from "../components/map/HospitalMap";
import EmptyState from "../components/ui/EmptyState";
import { calculateDistance } from "../lib/api";
import { useI18n } from "../i18n/I18nProvider";

export default function ExplorePage({
  searchMode,
  setSearchMode,
  serviceName,
  setServiceName,
  lat,
  setLat,
  lon,
  setLon,
  compareResults,
  bestResults,
  doctorResults,
  hospitals,
  selectedHospital,
  setSelectedHospital,
  selectedDoctor,
  setSelectedDoctor,
  canBook,
  onCompare,
  onSearchDoctors,
  onBest,
  onGetLocation,
  onSelectAndGoBooking,
  onSelectDoctorAndGoBooking,
}) {
  const { t } = useI18n();
  const hasLocation = lat !== "" && lon !== "" && !Number.isNaN(Number(lat)) && !Number.isNaN(Number(lon));
  const center = hasLocation ? [Number(lat), Number(lon)] : [22.57, 88.36];
  const highlighted = bestResults[0];
  const doctorHospitals = doctorResults.map((doctor) => doctor.hospital);
  const mapHospitals = searchMode === "doctors" && doctorHospitals.length > 0 ? doctorHospitals : hospitals;

  return (
    <div className="grid gap-6 xl:grid-cols-[340px,1fr]">
      <Card className="space-y-4 xl:sticky xl:top-6">
        <h2 className="text-xl font-semibold">{t("explore.title")}</h2>
        <div className="grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => setSearchMode("services")}
            className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
              searchMode === "services" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
            }`}
          >
            Services
          </button>
          <button
            type="button"
            onClick={() => setSearchMode("doctors")}
            className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
              searchMode === "doctors" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
            }`}
          >
            Consult Doctors
          </button>
        </div>
        <input
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3"
          value={serviceName}
          onChange={(e) => setServiceName(e.target.value)}
          placeholder={searchMode === "doctors" ? "Cardiologist, Dermatologist..." : t("explore.servicePlaceholder")}
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            className="rounded-xl border border-slate-200 bg-white px-4 py-3"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            placeholder={t("explore.latitude")}
          />
          <input
            className="rounded-xl border border-slate-200 bg-white px-4 py-3"
            value={lon}
            onChange={(e) => setLon(e.target.value)}
            placeholder={t("explore.longitude")}
          />
        </div>
        <div className="space-y-2">
          <Button className="w-full" onClick={searchMode === "doctors" ? onSearchDoctors : onCompare}>
            {searchMode === "doctors" ? "Find Doctors" : t("explore.compare")}
          </Button>
          {searchMode === "services" ? (
            <Button variant="secondary" className="w-full" onClick={onBest}>
              {t("explore.bestNearby")}
            </Button>
          ) : null}
          <Button variant="ghost" className="w-full" onClick={onGetLocation}>
            {t("explore.useLocation")}
          </Button>
        </div>

        {!canBook ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white/50 p-4">
            <p className="text-sm text-slate-600">{t("explore.signInBook")}</p>
            <Link to="/auth" className="mt-2 inline-block text-sm font-semibold text-brand-700">
              {t("explore.goLogin")}
            </Link>
          </div>
        ) : selectedHospital ? (
          <div className="space-y-3 rounded-xl border border-slate-200 bg-white/60 p-4">
            <p className="text-sm font-semibold text-slate-800">{t("explore.booking")}: {selectedHospital.name}</p>
            <p className="text-sm text-slate-600">
              {searchMode === "doctors" && selectedDoctor
                ? `Book Dr. ${selectedDoctor.name} at ${selectedHospital.name} using available consultation slots.`
                : "Choose this hospital, then select one of its available booking slots on the next screen."}
            </p>
            {searchMode === "doctors" && selectedDoctor ? (
              <Button className="w-full" type="button" onClick={() => onSelectDoctorAndGoBooking(selectedDoctor)}>
                Continue To Doctor Booking
              </Button>
            ) : (
              <Button className="w-full" type="button" onClick={() => onSelectAndGoBooking(selectedHospital)}>
                Continue To Slot Booking
              </Button>
            )}
          </div>
        ) : null}
      </Card>

      <div className="space-y-6">
        {searchMode === "services" && highlighted && (
          <Card className="bg-brand-50 border-brand-100">
            <p className="text-xs uppercase tracking-[0.2em] text-brand-700">{t("explore.recommended")}</p>
            <h3 className="mt-2 text-xl font-semibold">{highlighted.hospital.name}</h3>
            <p className="mt-1 text-sm text-slate-600">
              {t("explore.bestMatch").replace("{{service}}", highlighted.serviceName)}
            </p>
            <div className="mt-3 flex flex-col gap-3 text-sm sm:flex-row sm:flex-wrap">
              <span className="rounded-lg bg-white px-3 py-1.5">₹{highlighted.price}</span>
              {hasLocation && (
                <span className="rounded-lg bg-white px-3 py-1.5">
                  {calculateDistance(Number(lat), Number(lon), highlighted.hospital.latitude, highlighted.hospital.longitude).toFixed(2)} km
                </span>
              )}
              <Button variant="secondary" className="w-full sm:w-auto" onClick={() => onSelectAndGoBooking(highlighted.hospital)}>
                {t("explore.bookHospital")}
              </Button>
            </div>
          </Card>
        )}

        <Card>
          <h3 className="mb-4 text-lg font-semibold">{t("explore.hospitalMap")}</h3>
          <HospitalMap
            hospitals={mapHospitals}
            center={center}
            selectedHospitalId={selectedHospital?.id || null}
            onSelectHospital={(hospital) => {
              setSelectedHospital(hospital);
              if (searchMode === "doctors") {
                const firstDoctor = doctorResults.find((doctor) => doctor.hospital.id === hospital.id);
                if (firstDoctor) {
                  setSelectedDoctor(firstDoctor);
                }
              }
            }}
            userPosition={hasLocation ? [Number(lat), Number(lon)] : null}
          />
        </Card>

        <section className="grid gap-4 md:grid-cols-2">
          {searchMode === "doctors" ? (
            doctorResults.length === 0 ? (
              <EmptyState title="No doctors loaded yet" subtitle="Search by specialization or use the AI assistant." />
            ) : (
              doctorResults.map((doctor) => (
                <Card key={doctor.id} className="space-y-3">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h4 className="break-words font-semibold">Dr. {doctor.name}</h4>
                      <p className="text-sm text-slate-500">{doctor.specialization}</p>
                    </div>
                    <span className="shrink-0 rounded-lg bg-brand-100 px-3 py-1 text-sm font-semibold text-brand-800">
                      ₹{doctor.consultationFee}
                    </span>
                  </div>
                  <div className="text-sm text-slate-600">
                    <p>Experience: {doctor.experience || 0} years</p>
                    <p>Hospital: {doctor.hospital.name}</p>
                    <p className="inline-flex items-center gap-1">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      {doctor.averageRating?.toFixed?.(1) || "0.0"} doctor rating
                      {doctor.reviewCount ? ` (${doctor.reviewCount})` : ""}
                    </p>
                    <p className="inline-flex items-center gap-1">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      {doctor.hospital.rating?.toFixed?.(1) || "0.0"} hospital rating
                      {doctor.hospital.reviewCount ? ` (${doctor.hospital.reviewCount})` : ""}
                    </p>
                    {hasLocation ? <p>Distance: {doctor.distanceKm.toFixed(2)} km</p> : null}
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Button
                      className="w-full sm:w-auto"
                      onClick={() => {
                        setSelectedDoctor(doctor);
                        setSelectedHospital(doctor.hospital);
                        onSelectDoctorAndGoBooking(doctor);
                      }}
                    >
                      Book Appointment
                    </Button>
                    <Link to={`/hospitals/${doctor.hospital.id}`} className="w-full sm:w-auto">
                      <Button variant="ghost">{t("explore.details")}</Button>
                    </Link>
                  </div>
                </Card>
              ))
            )
          ) : compareResults.length === 0 ? (
            <EmptyState
              title={t("explore.noCompareTitle")}
              subtitle={t("explore.noCompareText")}
            />
          ) : (
            compareResults.map((result) => (
              <Card key={`${result.hospital.id}-${result.serviceName}-${result.price}`} className="space-y-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h4 className="break-words font-semibold">{result.hospital.name}</h4>
                    <p className="text-sm text-slate-500">{result.hospital.location}</p>
                  </div>
                  <span className="shrink-0 rounded-lg bg-brand-100 px-3 py-1 text-sm font-semibold text-brand-800">₹{result.price}</span>
                </div>
                <div className="text-sm text-slate-600">
                  <p>{t("explore.service")}: {result.serviceName}</p>
                  <p className="inline-flex items-center gap-1">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    {t("explore.rating")}: {result.hospital.rating?.toFixed?.(1) || "0.0"}
                    {result.hospital.reviewCount ? ` (${result.hospital.reviewCount})` : ""}
                  </p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                  <Button className="w-full sm:w-auto" onClick={() => onSelectAndGoBooking(result.hospital)}>{t("explore.book")}</Button>
                  <a
                    className="w-full sm:w-auto"
                    href={`https://www.google.com/maps/dir/?api=1&destination=${result.hospital.latitude},${result.hospital.longitude}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Button variant="ghost">{t("explore.directions")}</Button>
                  </a>
                  <Link to={`/hospitals/${result.hospital.id}`} className="w-full sm:w-auto">
                    <Button variant="ghost">{t("explore.details")}</Button>
                  </Link>
                </div>
              </Card>
            ))
          )}
        </section>
      </div>
    </div>
  );
}
