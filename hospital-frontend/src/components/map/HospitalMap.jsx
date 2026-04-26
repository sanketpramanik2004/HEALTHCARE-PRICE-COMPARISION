import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import { useEffect, useMemo } from "react";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const selectedIcon = new L.Icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [32, 52],
  iconAnchor: [16, 52],
});

export default function HospitalMap({
  hospitals,
  center,
  selectedHospitalId,
  onSelectHospital,
  userPosition,
}) {
  const normalizedCenter = useMemo(() => center || [22.57, 88.36], [center]);

  return (
    <div className="h-[420px] overflow-hidden rounded-2xl">
      <MapContainer center={normalizedCenter} zoom={12} className="h-full w-full">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {userPosition && (
          <Marker position={userPosition}>
            <Popup>Your location</Popup>
          </Marker>
        )}
        <ClusteredMarkers
          hospitals={hospitals}
          selectedHospitalId={selectedHospitalId}
          onSelectHospital={onSelectHospital}
        />
      </MapContainer>
    </div>
  );
}

function ClusteredMarkers({ hospitals, selectedHospitalId, onSelectHospital }) {
  const map = useMap();

  useEffect(() => {
    const clusterGroup = L.markerClusterGroup();
    hospitals.forEach((hospital) => {
      const markerOptions = selectedHospitalId === hospital.id ? { icon: selectedIcon } : {};
      const marker = L.marker([hospital.latitude, hospital.longitude], markerOptions);
      marker.bindPopup(
        `<strong>${hospital.name}</strong><br/>${hospital.location}<br/>Rating: ${hospital.rating}`
      );
      marker.on("click", () => onSelectHospital?.(hospital));
      clusterGroup.addLayer(marker);
    });
    map.addLayer(clusterGroup);
    return () => {
      map.removeLayer(clusterGroup);
    };
  }, [hospitals, map, onSelectHospital, selectedHospitalId]);

  return null;
}
