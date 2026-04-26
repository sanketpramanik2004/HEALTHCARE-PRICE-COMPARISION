import { Link } from "react-router-dom";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import HospitalMap from "../components/map/HospitalMap";
import EmptyState from "../components/ui/EmptyState";
import { calculateDistance } from "../lib/api";
import { useI18n } from "../i18n/I18nProvider";

export default function ExplorePage({
  serviceName,
  setServiceName,
  lat,
  setLat,
  lon,
  setLon,
  compareResults,
  bestResults,
  hospitals,
  selectedHospital,
  setSelectedHospital,
  canBook,
  onCompare,
  onBest,
  onGetLocation,
  onSelectAndGoBooking,
}) {
  const { t } = useI18n();
  const hasLocation = lat !== "" && lon !== "" && !Number.isNaN(Number(lat)) && !Number.isNaN(Number(lon));
  const center = hasLocation ? [Number(lat), Number(lon)] : [22.57, 88.36];
  const highlighted = bestResults[0];

  return (
    <div className="grid gap-6 xl:grid-cols-[340px,1fr]">
      <Card className="space-y-4">
        <h2 className="text-xl font-semibold">{t("explore.title")}</h2>
        <input
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3"
          value={serviceName}
          onChange={(e) => setServiceName(e.target.value)}
          placeholder={t("explore.servicePlaceholder")}
        />
        <div className="grid grid-cols-2 gap-3">
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
          <Button className="w-full" onClick={onCompare}>
            {t("explore.compare")}
          </Button>
          <Button variant="secondary" className="w-full" onClick={onBest}>
            {t("explore.bestNearby")}
          </Button>
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
              Choose this hospital, then select one of its available booking slots on the next screen.
            </p>
            <Button className="w-full" type="button" onClick={() => onSelectAndGoBooking(selectedHospital)}>
              Continue To Slot Booking
            </Button>
          </div>
        ) : null}
      </Card>

      <div className="space-y-6">
        {highlighted && (
          <Card className="bg-brand-50 border-brand-100">
            <p className="text-xs uppercase tracking-[0.2em] text-brand-700">{t("explore.recommended")}</p>
            <h3 className="mt-2 text-xl font-semibold">{highlighted.hospital.name}</h3>
            <p className="mt-1 text-sm text-slate-600">
              {t("explore.bestMatch").replace("{{service}}", highlighted.serviceName)}
            </p>
            <div className="mt-3 flex flex-wrap gap-3 text-sm">
              <span className="rounded-lg bg-white px-3 py-1.5">₹{highlighted.price}</span>
              {hasLocation && (
                <span className="rounded-lg bg-white px-3 py-1.5">
                  {calculateDistance(Number(lat), Number(lon), highlighted.hospital.latitude, highlighted.hospital.longitude).toFixed(2)} km
                </span>
              )}
              <Button variant="secondary" onClick={() => onSelectAndGoBooking(highlighted.hospital)}>
                {t("explore.bookHospital")}
              </Button>
            </div>
          </Card>
        )}

        <Card>
          <h3 className="mb-4 text-lg font-semibold">{t("explore.hospitalMap")}</h3>
          <HospitalMap
            hospitals={hospitals}
            center={center}
            selectedHospitalId={selectedHospital?.id || null}
            onSelectHospital={setSelectedHospital}
            userPosition={hasLocation ? [Number(lat), Number(lon)] : null}
          />
        </Card>

        <section className="grid gap-4 md:grid-cols-2">
          {compareResults.length === 0 ? (
            <EmptyState
              title={t("explore.noCompareTitle")}
              subtitle={t("explore.noCompareText")}
            />
          ) : (
            compareResults.map((result) => (
              <Card key={`${result.hospital.id}-${result.serviceName}-${result.price}`} className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-semibold">{result.hospital.name}</h4>
                    <p className="text-sm text-slate-500">{result.hospital.location}</p>
                  </div>
                  <span className="rounded-lg bg-brand-100 px-3 py-1 text-sm font-semibold text-brand-800">₹{result.price}</span>
                </div>
                <div className="text-sm text-slate-600">
                  <p>{t("explore.service")}: {result.serviceName}</p>
                  <p>{t("explore.rating")}: {result.hospital.rating}</p>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => onSelectAndGoBooking(result.hospital)}>{t("explore.book")}</Button>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${result.hospital.latitude},${result.hospital.longitude}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Button variant="ghost">{t("explore.directions")}</Button>
                  </a>
                  <Link to={`/hospitals/${result.hospital.id}`}>
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
