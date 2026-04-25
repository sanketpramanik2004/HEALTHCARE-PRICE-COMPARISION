import React, { useEffect, useState } from "react";
import "./App.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function App() {
  const [hospitals, setHospitals] = useState([]);
  const [serviceName, setServiceName] = useState("");
  const [results, setResults] = useState([]);
  const [bestResults, setBestResults] = useState([]);
  const [lat, setLat] = useState(0);
  const [lon, setLon] = useState(0);
  const [userName, setUserName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [appointments, setAppointments] = useState([]);

  // load hospitals
  useEffect(() => {
    fetch("http://localhost:8080/hospitals/all")
      .then((res) => res.json())
      .then((data) => setHospitals(data));

      fetch("http://localhost:8080/hospitals/appointments")
  .then((res) => res.json())
  .then((data) => setAppointments(data));
  }, []);

  // compare API call
  const handleCompare = () => {
    fetch(`http://localhost:8080/hospitals/compare?serviceName=${serviceName}`)
      .then((res) => res.json())
      .then((data) => setResults(data));
  };

  const handleBest = () => {
  fetch(`http://localhost:8080/hospitals/best?serviceName=${serviceName}&lat=${lat}&lon=${lon}`)
    .then((res) => res.json())
    .then((data) => setBestResults(data));
};

const handleGetLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLat(position.coords.latitude);
        setLon(position.coords.longitude);
      },
      (error) => {
        alert("Location access denied");
      }
    );
  } else {
    alert("Geolocation not supported");
  }
};

const openDirections = (destLat, destLon) => {
  const url = `https://www.google.com/maps/dir/?api=1&destination=${destLat},${destLon}`;
  window.open(url, "_blank");
};

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const handleBooking = () => {
  if (!selectedHospital) {
    alert("Select a hospital first");
    return;
  }

  const data = {
    userName,
    serviceName,
    date,
    time,
    hospital: {
      id: selectedHospital.id,
    },
  };

  fetch("http://localhost:8080/hospitals/book", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((data) => {
      alert("Booking request sent (PENDING)");
      console.log(data);
    });
};



const getNearestHospital = () => {
  if (!lat || !lon) return null;

  let nearest = null;
  let minDist = Infinity;

  hospitals.forEach((h) => {
    const d = calculateDistance(
      Number(lat),
      Number(lon),
      h.latitude,
      h.longitude
    );

    if (d < minDist) {
      minDist = d;
      nearest = h;
    }
  });

  return nearest;
};
const nearestHospital = getNearestHospital();

 return (
  <div className="container">
    <h1 className="title">Hospital Service Comparison</h1>

    <div className="search-box">
      <input
  type="text"
  placeholder="Latitude"
  value={lat}
  onChange={(e) => setLat(e.target.value)}
/>

<input
  type="text"
  placeholder="Longitude"
  value={lon}
  onChange={(e) => setLon(e.target.value)}
/>
      <input
        type="text"
        placeholder="Enter service (e.g. MRI)"
        value={serviceName}
        onChange={(e) => setServiceName(e.target.value)}
      />
     <button onClick={handleCompare}>Compare</button>
     <button onClick={handleBest}>Find Best</button>
     <button onClick={handleGetLocation}>Use My Location</button>
    </div>

    <h2>Results</h2>
   {results.map((r, index) => (
  <div key={index} className="card">
    <h3>{r.hospital.name}</h3>
    <p>Service: {r.serviceName}</p>
    <p>Price: ₹{r.price}</p>
    {lat && lon && (
  <p>
    Distance:{" "}
    {calculateDistance(
      Number(lat),
      Number(lon),
      r.hospital.latitude,
      r.hospital.longitude
    ).toFixed(2)}{" "}
    km
  </p>
)}

    <button onClick={() => setSelectedHospital(r.hospital)}>
     Select Hospital
    </button>

    <button onClick={() => setSelectedHospital(null)}>
     Cancel Selection
    </button>

    <button
      onClick={() => openDirections(r.hospital.latitude, r.hospital.longitude)}
    >
      Get Directions
    </button>
  </div>
))}

{selectedHospital && (
  <>
    <h2>Book Appointment</h2>

    <p><b>Selected:</b> {selectedHospital.name}</p>

    <input
      type="text"
      placeholder="Your Name"
      value={userName}
      onChange={(e) => setUserName(e.target.value)}
    />

    <input
      type="date"
      value={date}
      onChange={(e) => setDate(e.target.value)}
    />

    <input
      type="time"
      value={time}
      onChange={(e) => setTime(e.target.value)}
    />

    <button onClick={handleBooking}>Book Appointment</button>
  </>
)}
<h2>Your Appointments</h2>

{appointments.map((a) => (
  <div key={a.id} className="card">
    <h3>{a.hospital.name}</h3>
    <p>Service: {a.serviceName}</p>
    <p>Date: {a.date}</p>
    <p>Time: {a.time}</p>
    <p>Status: {a.status}</p>
  </div>
))}

<h2>Best Option</h2>
{bestResults.length > 0 && (
  <div className="card" style={{ border: "2px solid green" }}>
    <h3>{bestResults[0].hospital.name}</h3>
    <p>Service: {bestResults[0].serviceName}</p>
    <p>Price: ₹{bestResults[0].price}</p>

    {lat && lon && (
  <p>
    Distance:{" "}
    {calculateDistance(
      Number(lat),
      Number(lon),
      bestResults[0].hospital.latitude,
      bestResults[0].hospital.longitude
    ).toFixed(2)}{" "}
    km
  </p>
)}

    <button
  onClick={() =>
    openDirections(
      bestResults[0].hospital.latitude,
      bestResults[0].hospital.longitude
    )
  }
>
  Get Directions
</button>
  </div>
)}

<h2>Map View</h2>

<MapContainer
  center={[Number(lat) || 22.57, Number(lon) || 88.36]}
  zoom={13}
  style={{ height: "400px", width: "100%" }}
>
  <TileLayer
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  />

  {/* User location */}
  {lat && lon && (
   <Marker position={[Number(lat), Number(lon)]}>
      <Popup>You are here</Popup>
    </Marker>
  )}

  {/* Hospitals */}
  {hospitals.map((h) => {
  const isNearest = nearestHospital && h.id === nearestHospital.id;

  return (
    <Marker key={h.id} position={[h.latitude, h.longitude]}>
      <Popup>
        {h.name} <br />
        Rating: {h.rating} <br />
        {isNearest && "⭐ Nearest Hospital"}
      </Popup>
    </Marker>
  );
})}
</MapContainer>

    <h2>All Hospitals</h2>
    {hospitals.map((h) => (
      <div key={h.id} className="card">
        <h3>{h.name}</h3>
        <p>Location: {h.location}</p>
        <p>Rating: {h.rating}</p>
      </div>
    ))}
  </div>
);
}

export default App;