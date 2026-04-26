import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Sidebar from "./components/layout/Sidebar";
import TopNavbar from "./components/layout/TopNavbar";
import Skeleton from "./components/ui/Skeleton";
import {
  AI_API_BASE_URL,
  API_BASE_URL,
  buildHeaders,
  fetchJson,
} from "./lib/api";

const HomePage = lazy(() => import("./pages/HomePage"));
const AuthPage = lazy(() => import("./pages/AuthPage"));
const ExplorePage = lazy(() => import("./pages/ExplorePage"));
const AiAssistantPage = lazy(() => import("./pages/AiAssistantPage"));
const BookingPage = lazy(() => import("./pages/BookingPage"));
const UserDashboardPage = lazy(() => import("./pages/UserDashboardPage"));
const AdminDashboardPage = lazy(() => import("./pages/AdminDashboardPage"));
const HospitalDetailsPage = lazy(() => import("./pages/HospitalDetailsPage"));

const REMEMBERED_LOGIN_KEY = "rememberedLogin";

function readSession() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const name = localStorage.getItem("name");
  const email = localStorage.getItem("email");
  const hospitalId = localStorage.getItem("hospitalId");
  const hospitalName = localStorage.getItem("hospitalName");
  if (!token || !role || !email) {
    return null;
  }
  return {
    token,
    role,
    name: name || "Guest",
    email,
    hospitalId: hospitalId ? Number(hospitalId) : null,
    hospitalName: hospitalName || "",
  };
}

function readRememberedLogin() {
  try {
    const raw = localStorage.getItem(REMEMBERED_LOGIN_KEY);
    if (!raw) {
      return { email: "", password: "", remember: false };
    }
    const parsed = JSON.parse(raw);
    return {
      email: parsed?.email || "",
      password: parsed?.password || "",
      remember: Boolean(parsed?.email || parsed?.password),
    };
  } catch {
    return { email: "", password: "", remember: false };
  }
}

function saveSession(session) {
  localStorage.setItem("token", session.token);
  localStorage.setItem("role", session.role);
  localStorage.setItem("name", session.name);
  localStorage.setItem("email", session.email);
  localStorage.setItem("hospitalId", session.hospitalId ?? "");
  localStorage.setItem("hospitalName", session.hospitalName ?? "");
}

function clearSession() {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("name");
  localStorage.removeItem("email");
  localStorage.removeItem("hospitalId");
  localStorage.removeItem("hospitalName");
}

function Protected({ allow, children }) {
  return allow ? children : <Navigate to="/auth" replace />;
}

function App() {
  const remembered = readRememberedLogin();
  const navigate = useNavigate();
  const location = useLocation();

  const [session, setSession] = useState(readSession());
  const [ui, setUi] = useState({ busy: false, loading: false, error: "", success: "" });

  const [hospitals, setHospitals] = useState([]);
  const [compareResults, setCompareResults] = useState([]);
  const [bestResults, setBestResults] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [adminAppointments, setAdminAppointments] = useState([]);
  const [adminServices, setAdminServices] = useState([]);
  const [adminSlots, setAdminSlots] = useState([]);
  const [hospitalProfile, setHospitalProfile] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);

  const [serviceName, setServiceName] = useState("General Consultation");
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [aiRecommendation, setAiRecommendation] = useState(null);
  const [aiBusy, setAiBusy] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState(null);

  const [authMode, setAuthMode] = useState("login");
  const [authForm, setAuthForm] = useState({
    name: "",
    email: remembered.email,
    password: remembered.password,
    role: "USER",
    hospital: { name: "", location: "", latitude: "", longitude: "", rating: "" },
  });
  const [rememberLogin, setRememberLogin] = useState(remembered.remember);
  const [showPassword, setShowPassword] = useState(false);
  const [serviceForm, setServiceForm] = useState({ serviceName: "", price: "" });
  const [slotForm, setSlotForm] = useState({ serviceName: "", slotDate: "", slotTime: "" });
  const [bookingForm, setBookingForm] = useState({
    userName: "",
    patientAge: "",
    patientGender: "",
    phoneNumber: "",
    patientNotes: "",
    date: "",
    time: "",
  });

  const canBook = session?.role === "USER" && Boolean(session?.token);
  const isAdmin = session?.role === "ADMIN" && Boolean(session?.token);

  const setMessage = (type, message) => {
    setUi((c) => ({ ...c, error: type === "error" ? message : "", success: type === "success" ? message : "" }));
  };

  useEffect(() => {
    let ignore = false;
    async function loadHospitals() {
      setUi((c) => ({ ...c, loading: true }));
      try {
        const data = await fetchJson(`${API_BASE_URL}/all`);
        if (!ignore) {
          setHospitals(data);
        }
      } catch (error) {
        if (!ignore) {
          setMessage("error", error.message);
        }
      } finally {
        if (!ignore) {
          setUi((c) => ({ ...c, loading: false }));
        }
      }
    }
    loadHospitals();
    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (!session?.token || session.role !== "USER") {
      setAppointments([]);
      return;
    }
    fetchJson(`${API_BASE_URL}/myAppointments`, { headers: buildHeaders(session.token) })
      .then(setAppointments)
      .catch((error) => setMessage("error", error.message));
  }, [session]);

  useEffect(() => {
    if (!isAdmin) {
      setAdminAppointments([]);
      setAdminServices([]);
      setAdminSlots([]);
      setHospitalProfile(null);
      return;
    }
    Promise.allSettled([
      fetchJson(`${API_BASE_URL}/myHospitalAppointments`, { headers: buildHeaders(session.token) }),
      fetchJson(`${API_BASE_URL}/myHospitalServices`, { headers: buildHeaders(session.token) }),
      fetchJson(`${API_BASE_URL}/myHospitalProfile`, { headers: buildHeaders(session.token) }),
      fetchJson(`${API_BASE_URL}/myHospitalSlots`, { headers: buildHeaders(session.token) }),
    ]).then(([appointmentsResult, servicesResult, profileResult, slotsResult]) => {
      if (appointmentsResult.status === "fulfilled") {
        setAdminAppointments(appointmentsResult.value);
      }

      if (servicesResult.status === "fulfilled") {
        setAdminServices(servicesResult.value);
      } else {
        setAdminServices([]);
      }

      if (profileResult.status === "fulfilled") {
        setHospitalProfile(profileResult.value);
      } else {
        setHospitalProfile(null);
      }

      if (slotsResult.status === "fulfilled") {
        setAdminSlots(slotsResult.value);
      } else {
        setAdminSlots([]);
        const message =
          slotsResult.reason?.message?.includes("404") || slotsResult.reason?.message === "Failed to fetch"
            ? "Slots could not be loaded. Restart backend once to enable slot booking."
            : slotsResult.reason?.message || "Slots could not be loaded.";
        setMessage("error", message);
      }
    });
  }, [isAdmin, session]);

  const handleCompare = async (serviceOverride = "") => {
    const normalized = typeof serviceOverride === "string" ? serviceOverride : "";
    const effective = (normalized || serviceName).trim();
    if (!effective) {
      setMessage("error", "Please enter a service.");
      return;
    }
    if (normalized) {
      setServiceName(effective);
    }
    try {
      const data = await fetchJson(`${API_BASE_URL}/compare?serviceName=${encodeURIComponent(effective)}`);
      setCompareResults(data);
      if (data.length === 0) {
        setMessage("success", `No hospitals have "${effective}" yet.`);
      }
    } catch (error) {
      setMessage("error", error.message);
    }
  };

  const handleBest = async () => {
    if (lat === "" || lon === "") {
      setMessage("error", "Add location first.");
      return;
    }
    try {
      const data = await fetchJson(
        `${API_BASE_URL}/best?serviceName=${encodeURIComponent(serviceName)}&lat=${Number(lat)}&lon=${Number(lon)}`
      );
      setBestResults(data);
    } catch (error) {
      setMessage("error", error.message);
    }
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setMessage("error", "Geolocation is not supported.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(String(pos.coords.latitude));
        setLon(String(pos.coords.longitude));
        setMessage("success", "Location captured.");
      },
      () => setMessage("error", "Location permission denied.")
    );
  };

  const handleAnalyze = async (autoCompare = false) => {
    if (!session?.token) {
      setMessage("error", "Please login to use AI assistant.");
      navigate("/auth");
      return;
    }
    if (!symptoms.trim()) {
      setMessage("error", "Please enter symptoms.");
      return;
    }
    setAiBusy(true);
    try {
      const payload = await fetchJson(
        `${AI_API_BASE_URL}/recommendDoctor?symptoms=${encodeURIComponent(symptoms.trim())}`,
        { headers: buildHeaders(session.token) }
      );
      setAiRecommendation(payload);
      setMessage("success", `Recommended doctor: ${payload.recommendedDoctor}`);
      const primary = payload?.suggestedServices?.[0];
      if (autoCompare && primary) {
        await handleCompare(primary);
        navigate("/explore");
      }
    } catch (error) {
      setMessage("error", error.message);
    } finally {
      setAiBusy(false);
    }
  };

  const handleAuthSubmit = async (event) => {
    event.preventDefault();
    setUi((c) => ({ ...c, busy: true }));
    try {
      if (authMode === "register") {
        const payload =
          authForm.role === "ADMIN"
            ? {
                ...authForm,
                hospital: {
                  ...authForm.hospital,
                  latitude: Number(authForm.hospital.latitude),
                  longitude: Number(authForm.hospital.longitude),
                  rating: Number(authForm.hospital.rating),
                },
              }
            : { ...authForm, hospital: null };

        await fetchJson(`${API_BASE_URL}/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        setAuthMode("login");
        setMessage("success", "Account created. Please sign in.");
        return;
      }

      const payload = await fetchJson(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: authForm.email, password: authForm.password }),
      });
      if (rememberLogin) {
        localStorage.setItem(
          REMEMBERED_LOGIN_KEY,
          JSON.stringify({ email: authForm.email, password: authForm.password })
        );
      } else {
        localStorage.removeItem(REMEMBERED_LOGIN_KEY);
      }
      saveSession(payload);
      setSession(payload);
      setBookingForm((c) => ({ ...c, userName: payload.name || "" }));
      navigate(payload.role === "ADMIN" ? "/admin" : "/dashboard");
      setMessage("success", "Signed in successfully.");
    } catch (error) {
      setMessage("error", error.message);
    } finally {
      setUi((c) => ({ ...c, busy: false }));
    }
  };

  const handleBook = async (event) => {
    event.preventDefault();
    if (!canBook || !selectedHospital) {
      setMessage("error", "Select a hospital and login as patient.");
      return;
    }
    if (!bookingForm.date || !bookingForm.time) {
      setMessage("error", "Please select an available slot.");
      return;
    }
    try {
      await fetchJson(`${API_BASE_URL}/book`, {
        method: "POST",
        headers: buildHeaders(session.token, { "Content-Type": "application/json" }),
        body: JSON.stringify({
          userName: bookingForm.userName,
          patientAge: bookingForm.patientAge ? Number(bookingForm.patientAge) : null,
          patientGender: bookingForm.patientGender,
          phoneNumber: bookingForm.phoneNumber,
          patientNotes: bookingForm.patientNotes,
          serviceName,
          date: bookingForm.date,
          time: bookingForm.time,
          hospital: { id: selectedHospital.id },
        }),
      });
      const data = await fetchJson(`${API_BASE_URL}/myAppointments`, { headers: buildHeaders(session.token) });
      setAppointments(data);
      setBookingForm((c) => ({ ...c, date: "", time: "" }));
      setAvailableSlots([]);
      setMessage("success", "Appointment request sent.");
      navigate("/bookings");
    } catch (error) {
      setMessage("error", error.message);
    }
  };

  const refreshAdminAppointments = async () => {
    if (!isAdmin) return;
    try {
      const data = await fetchJson(`${API_BASE_URL}/myHospitalAppointments`, { headers: buildHeaders(session.token) });
      setAdminAppointments(data);
    } catch (error) {
      setMessage("error", error.message);
    }
  };

  const handleUpdateStatus = async (appointmentId, status) => {
    try {
      await fetchJson(`${API_BASE_URL}/updateStatus?id=${appointmentId}&status=${status}`, {
        method: "PUT",
        headers: buildHeaders(session.token),
      });
      await refreshAdminAppointments();
      setMessage("success", `Appointment marked as ${status}.`);
    } catch (error) {
      setMessage("error", error.message);
    }
  };

  const handleAddService = async (event) => {
    event.preventDefault();
    try {
      const payload = await fetchJson(`${API_BASE_URL}/addService`, {
        method: "POST",
        headers: buildHeaders(session.token, { "Content-Type": "application/json" }),
        body: JSON.stringify(serviceForm),
      });
      setAdminServices((c) => [...c, payload]);
      setServiceForm({ serviceName: "", price: "" });
      setMessage("success", "Service added.");
    } catch (error) {
      setMessage("error", error.message);
    }
  };

  const handleAddSlot = async (event) => {
    event.preventDefault();
    try {
      const payload = await fetchJson(`${API_BASE_URL}/slots`, {
        method: "POST",
        headers: buildHeaders(session.token, { "Content-Type": "application/json" }),
        body: JSON.stringify(slotForm),
      });
      setAdminSlots((current) =>
        [...current, payload].sort(
          (a, b) =>
            `${a.slotDate}T${a.slotTime}`.localeCompare(`${b.slotDate}T${b.slotTime}`) ||
            a.serviceName.localeCompare(b.serviceName)
        )
      );
      setSlotForm({ serviceName: slotForm.serviceName, slotDate: "", slotTime: "" });
      setMessage("success", "Slot added.");
    } catch (error) {
      setMessage("error", error.message);
    }
  };

  const handleDeleteSlot = async (slotId) => {
    try {
      await fetchJson(`${API_BASE_URL}/slots/${slotId}`, {
        method: "DELETE",
        headers: buildHeaders(session.token),
      });
      setAdminSlots((current) => current.filter((slot) => slot.id !== slotId));
      setMessage("success", "Slot deleted.");
    } catch (error) {
      setMessage("error", error.message);
    }
  };

  const loadAvailableSlots = async ({ hospitalId, service, date }) => {
    if (!hospitalId || !service || !date) {
      setAvailableSlots([]);
      return;
    }

    try {
      const data = await fetchJson(
        `${API_BASE_URL}/availableSlots?hospitalId=${hospitalId}&serviceName=${encodeURIComponent(service)}&slotDate=${date}`,
        { headers: buildHeaders(session?.token) }
      );
      setAvailableSlots(data);
    } catch (error) {
      setAvailableSlots([]);
      setMessage("error", error.message);
    }
  };

  const handleDeleteService = async (serviceId) => {
    try {
      await fetchJson(`${API_BASE_URL}/services/${serviceId}`, {
        method: "DELETE",
        headers: buildHeaders(session.token),
      });
      setAdminServices((c) => c.filter((s) => s.id !== serviceId));
      setMessage("success", "Service deleted.");
    } catch (error) {
      setMessage("error", error.message);
    }
  };

  const handleLogout = () => {
    clearSession();
    setSession(null);
    navigate("/auth");
  };

  const shellVisible = location.pathname !== "/auth" && location.pathname !== "/";
  const contentClass = useMemo(() => (shellVisible ? "lg:pl-0" : ""), [shellVisible]);

  return (
    <div className="min-h-screen bg-mesh">
      <div className={`mx-auto flex gap-4 ${shellVisible ? "max-w-[1440px] p-4 lg:p-6" : "max-w-none p-0"}`}>
        {shellVisible && <Sidebar session={session} />}

        <main className={`w-full ${contentClass}`}>
          {shellVisible && <TopNavbar session={session} onLogout={handleLogout} />}

          {(ui.error || ui.success) && (
            <div className={`mb-4 rounded-xl px-4 py-3 text-sm ${ui.error ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"}`}>
              {ui.error || ui.success}
            </div>
          )}

          <Suspense fallback={<Skeleton className="h-64 w-full" />}>
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
              >
                <Routes>
                  <Route path="/" element={<HomePage session={session} hospitals={hospitals} />} />
                  <Route
                    path="/auth"
                    element={
                      <AuthPage
                        authMode={authMode}
                        setAuthMode={setAuthMode}
                        authForm={authForm}
                        setAuthForm={setAuthForm}
                        showPassword={showPassword}
                        setShowPassword={setShowPassword}
                        rememberLogin={rememberLogin}
                        setRememberLogin={setRememberLogin}
                        onSubmit={handleAuthSubmit}
                        busy={ui.busy}
                      />
                    }
                  />
                  <Route
                    path="/explore"
                    element={
                      <ExplorePage
                        serviceName={serviceName}
                        setServiceName={setServiceName}
                        lat={lat}
                        setLat={setLat}
                        lon={lon}
                        setLon={setLon}
                        compareResults={compareResults}
                        bestResults={bestResults}
                        hospitals={hospitals}
                        selectedHospital={selectedHospital}
                        setSelectedHospital={setSelectedHospital}
                        bookingForm={bookingForm}
                        setBookingForm={setBookingForm}
                        canBook={canBook}
                        onCompare={() => handleCompare()}
                        onBest={handleBest}
                        onGetLocation={handleGetLocation}
                        onBook={handleBook}
                        onSelectAndGoBooking={(hospital) => {
                          setSelectedHospital(hospital);
                          setAvailableSlots([]);
                          navigate("/booking");
                        }}
                      />
                    }
                  />
                  <Route
                    path="/ai"
                    element={
                      <Protected allow={Boolean(session?.token)}>
                        <AiAssistantPage
                          symptoms={symptoms}
                          setSymptoms={setSymptoms}
                          recommendation={aiRecommendation}
                          busy={aiBusy}
                          onAnalyze={() => handleAnalyze(false)}
                          onAnalyzeCompare={() => handleAnalyze(true)}
                          onCompareService={(service) => {
                            handleCompare(service);
                            navigate("/explore");
                          }}
                        />
                      </Protected>
                    }
                  />
                  <Route
                    path="/booking"
                    element={
                      <BookingPage
                        selectedHospital={selectedHospital}
                        serviceName={serviceName}
                        bookingForm={bookingForm}
                        setBookingForm={setBookingForm}
                        availableSlots={availableSlots}
                        onLoadSlots={(date) =>
                          loadAvailableSlots({
                            hospitalId: selectedHospital?.id,
                            service: serviceName,
                            date,
                          })
                        }
                        onSubmit={handleBook}
                        canBook={canBook}
                      />
                    }
                  />
                  <Route
                    path="/bookings"
                    element={
                      <Protected allow={canBook}>
                        <UserDashboardPage appointments={appointments} />
                      </Protected>
                    }
                  />
                  <Route
                    path="/dashboard"
                    element={
                      <Protected allow={canBook}>
                        <UserDashboardPage appointments={appointments} />
                      </Protected>
                    }
                  />
                  <Route
                    path="/admin"
                    element={
                      <Protected allow={isAdmin}>
                        <AdminDashboardPage
                          hospitalProfile={hospitalProfile}
                          serviceForm={serviceForm}
                          setServiceForm={setServiceForm}
                          slotForm={slotForm}
                          setSlotForm={setSlotForm}
                          adminServices={adminServices}
                          adminSlots={adminSlots}
                          adminAppointments={adminAppointments}
                          onAddService={handleAddService}
                          onAddSlot={handleAddSlot}
                          onDeleteService={handleDeleteService}
                          onDeleteSlot={handleDeleteSlot}
                          onUpdateStatus={handleUpdateStatus}
                          onRefresh={refreshAdminAppointments}
                        />
                      </Protected>
                    }
                  />
                  <Route
                    path="/hospitals/:id"
                    element={
                      <HospitalDetailsPage
                        hospitals={hospitals}
                        compareResults={compareResults}
                        onBookNow={(hospital) => {
                          setSelectedHospital(hospital);
                          setAvailableSlots([]);
                          navigate("/booking");
                        }}
                      />
                    }
                  />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </motion.div>
            </AnimatePresence>
          </Suspense>
        </main>
      </div>
    </div>
  );
}

export default App;
