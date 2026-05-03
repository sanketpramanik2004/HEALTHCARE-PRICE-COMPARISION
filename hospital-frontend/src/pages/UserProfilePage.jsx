import { useEffect, useMemo, useState } from "react";
import { CalendarClock, FileHeart, Plus, ShieldCheck, Star, Trash2, UserRound } from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import {
  MEDICAL_HISTORY_API_BASE_URL,
  REVIEW_API_BASE_URL,
  USER_API_BASE_URL,
  buildHeaders,
  fetchJson,
} from "../lib/api";

export default function UserProfilePage({ session, onSessionUpdate }) {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    age: "",
    gender: "",
    phoneNumber: "",
  });
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [draftHistory, setDraftHistory] = useState({ condition: "", notes: "" });
  const [reviewDrafts, setReviewDrafts] = useState({});
  const [message, setMessage] = useState({ error: "", success: "" });

  const reviewedAppointmentIds = useMemo(
    () => new Set(reviews.map((review) => review.appointmentId)),
    [reviews]
  );

  useEffect(() => {
    let ignore = false;

    async function loadProfileWorkspace() {
      setLoading(true);
      try {
        const headers = { headers: buildHeaders(session.token) };
        const [profileResult, historyResult, appointmentsResult, reviewsResult] = await Promise.allSettled([
          fetchJson(`${USER_API_BASE_URL}/profile`, headers),
          fetchJson(MEDICAL_HISTORY_API_BASE_URL, headers),
          fetchJson(`${USER_API_BASE_URL}/appointments`, headers),
          fetchJson(`${REVIEW_API_BASE_URL}/mine`, headers),
        ]);

        if (!ignore) {
          if (profileResult.status === "fulfilled") {
            setProfile({
              name: profileResult.value.name || "",
              email: profileResult.value.email || "",
              age: profileResult.value.age ?? "",
              gender: profileResult.value.gender || "",
              phoneNumber: profileResult.value.phoneNumber || "",
            });
          }

          setMedicalHistory(historyResult.status === "fulfilled" ? historyResult.value : []);
          setAppointments(appointmentsResult.status === "fulfilled" ? appointmentsResult.value : []);
          setReviews(reviewsResult.status === "fulfilled" ? reviewsResult.value : []);

          const failures = [
            profileResult.status === "rejected" ? `profile: ${profileResult.reason?.message || "failed"}` : null,
            historyResult.status === "rejected" ? `medical history: ${historyResult.reason?.message || "failed"}` : null,
            appointmentsResult.status === "rejected" ? `appointments: ${appointmentsResult.reason?.message || "failed"}` : null,
            reviewsResult.status === "rejected" ? `reviews: ${reviewsResult.reason?.message || "failed"}` : null,
          ].filter(Boolean);

          setMessage({
            error: failures.length ? `Some profile data could not be loaded (${failures.join(" | ")})` : "",
            success: "",
          });
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    if (session?.token) {
      loadProfileWorkspace();
    }

    return () => {
      ignore = true;
    };
  }, [session?.token]);

  const handleProfileSave = async (event) => {
    event.preventDefault();
    try {
      const payload = await fetchJson(`${USER_API_BASE_URL}/profile`, {
        method: "PUT",
        headers: buildHeaders(session.token, { "Content-Type": "application/json" }),
        body: JSON.stringify({
          name: profile.name,
          age: profile.age === "" ? null : Number(profile.age),
          gender: profile.gender,
          phoneNumber: profile.phoneNumber,
        }),
      });
      setProfile((current) => ({ ...current, ...payload, age: payload.age ?? "" }));
      onSessionUpdate?.(payload);
      setMessage({ error: "", success: "Profile updated." });
    } catch (error) {
      setMessage({ error: error.message, success: "" });
    }
  };

  const handleAddHistory = async (event) => {
    event.preventDefault();
    try {
      const payload = await fetchJson(MEDICAL_HISTORY_API_BASE_URL, {
        method: "POST",
        headers: buildHeaders(session.token, { "Content-Type": "application/json" }),
        body: JSON.stringify(draftHistory),
      });
      setMedicalHistory((current) => [payload, ...current]);
      setDraftHistory({ condition: "", notes: "" });
      setMessage({ error: "", success: "Medical history updated." });
    } catch (error) {
      setMessage({ error: error.message, success: "" });
    }
  };

  const handleDeleteHistory = async (historyId) => {
    try {
      await fetchJson(`${MEDICAL_HISTORY_API_BASE_URL}/${historyId}`, {
        method: "DELETE",
        headers: buildHeaders(session.token),
      });
      setMedicalHistory((current) => current.filter((entry) => entry.id !== historyId));
      setMessage({ error: "", success: "Medical history entry removed." });
    } catch (error) {
      setMessage({ error: error.message, success: "" });
    }
  };

  const handleSubmitReview = async (appointmentId) => {
    const draft = reviewDrafts[appointmentId] || { rating: 5, comment: "" };
    try {
      const payload = await fetchJson(REVIEW_API_BASE_URL, {
        method: "POST",
        headers: buildHeaders(session.token, { "Content-Type": "application/json" }),
        body: JSON.stringify({
          appointmentId,
          rating: Number(draft.rating),
          comment: draft.comment || "",
        }),
      });
      setReviews((current) => [payload, ...current]);
      setReviewDrafts((current) => {
        const next = { ...current };
        delete next[appointmentId];
        return next;
      });
      setMessage({ error: "", success: "Review submitted." });
    } catch (error) {
      setMessage({ error: error.message, success: "" });
    }
  };

  if (!session?.token) {
    return <EmptyState title="Patient login required" subtitle="Please sign in with a user account to open your profile." />;
  }

  if (loading) {
    return <Card>Loading your profile...</Card>;
  }

  return (
    <div className="space-y-6">
      {(message.error || message.success) ? (
        <div className={`rounded-xl px-4 py-3 text-sm break-words ${message.error ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"}`}>
          {message.error || message.success}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1.1fr,0.9fr]">
        <Card className="space-y-5">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-brand-50 p-2 text-brand-700">
              <UserRound className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-brand-700">Patient Profile</p>
              <h2 className="mt-2 text-2xl font-bold text-slate-900">Personal details and visit defaults</h2>
            </div>
          </div>

          <form className="grid gap-4 md:grid-cols-2" onSubmit={handleProfileSave}>
            <input
              className="rounded-xl border border-slate-200 bg-white px-4 py-3"
              placeholder="Full name"
              value={profile.name}
              onChange={(event) => setProfile((current) => ({ ...current, name: event.target.value }))}
            />
            <input
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-500"
              value={profile.email}
              disabled
            />
            <input
              type="number"
              min="0"
              className="rounded-xl border border-slate-200 bg-white px-4 py-3"
              placeholder="Age"
              value={profile.age}
              onChange={(event) => setProfile((current) => ({ ...current, age: event.target.value }))}
            />
            <select
              className="rounded-xl border border-slate-200 bg-white px-4 py-3"
              value={profile.gender}
              onChange={(event) => setProfile((current) => ({ ...current, gender: event.target.value }))}
            >
              <option value="">Select gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
            <input
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 md:col-span-2"
              placeholder="Phone number"
              value={profile.phoneNumber}
              onChange={(event) => setProfile((current) => ({ ...current, phoneNumber: event.target.value }))}
            />
            <div className="md:col-span-2">
              <Button type="submit">Save Profile</Button>
            </div>
          </form>
        </Card>

        <Card className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-emerald-50 p-2 text-emerald-700">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-emerald-700">Care Summary</p>
              <h3 className="mt-2 text-xl font-semibold text-slate-900">At-a-glance patient record</h3>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <MiniMetric label="Appointments" value={appointments.length} />
            <MiniMetric label="Conditions" value={medicalHistory.length} />
            <MiniMetric label="Reviews" value={reviews.length} />
          </div>
          <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
            Keep this profile updated so booking forms are faster and hospitals see the right contact and patient context.
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr,1.05fr]">
        <Card className="space-y-5">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-rose-50 p-2 text-rose-700">
              <FileHeart className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-rose-700">Medical History</p>
              <h3 className="mt-2 text-xl font-semibold text-slate-900">Conditions, allergies, and patient notes</h3>
            </div>
          </div>

          <form className="space-y-3" onSubmit={handleAddHistory}>
            <input
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3"
              placeholder="Condition or history item"
              value={draftHistory.condition}
              onChange={(event) => setDraftHistory((current) => ({ ...current, condition: event.target.value }))}
            />
            <textarea
              rows={3}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3"
              placeholder="Notes, severity, medication context, or anything the care team should know"
              value={draftHistory.notes}
              onChange={(event) => setDraftHistory((current) => ({ ...current, notes: event.target.value }))}
            />
            <Button type="submit">
              <Plus className="h-4 w-4" />
              Add Medical History
            </Button>
          </form>

          <div className="space-y-3">
            {medicalHistory.length === 0 ? (
              <EmptyState title="No medical history yet" subtitle="Add conditions or notes you want available for future care decisions." />
            ) : (
              medicalHistory.map((entry) => (
                <div key={entry.id} className="rounded-xl border border-slate-200 bg-white p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900">{entry.condition}</p>
                      <p className="mt-1 break-words text-sm text-slate-600">{entry.notes || "No extra notes added."}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteHistory(entry.id)}
                      className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                      title="Delete history item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="space-y-5">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-brand-50 p-2 text-brand-700">
                <CalendarClock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-brand-700">Appointment History</p>
                <h3 className="mt-2 text-xl font-semibold text-slate-900">Bookings, outcomes, and review actions</h3>
              </div>
            </div>

            <div className="space-y-4">
              {appointments.length === 0 ? (
                <EmptyState title="No appointments yet" subtitle="Book a hospital or doctor consultation to start building your care timeline." />
              ) : (
                appointments.map((appointment) => {
                  const reviewDraft = reviewDrafts[appointment.id] || { rating: 5, comment: "" };
                  const canReview = appointment.status === "COMPLETED" && !reviewedAppointmentIds.has(appointment.id);

                  return (
                    <div key={appointment.id} className="rounded-xl border border-slate-200 bg-white p-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="break-words font-semibold text-slate-900">{appointment.hospital?.name}</p>
                          <p className="text-sm text-slate-500">{appointment.serviceName}</p>
                        </div>
                        <StatusPill status={appointment.status} />
                      </div>
                      <div className="mt-3 grid gap-1 text-sm text-slate-600 md:grid-cols-2">
                        <p>Date: {appointment.date}</p>
                        <p>Time: {appointment.time}</p>
                        <p>Doctor: {appointment.doctor ? `Dr. ${appointment.doctor.name}` : "Hospital service visit"}</p>
                        <p>Notes: {appointment.patientNotes || "-"}</p>
                      </div>

                      {canReview ? (
                        <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                          <p className="text-sm font-semibold text-slate-800">Leave a review</p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {[1, 2, 3, 4, 5].map((value) => (
                              <button
                                key={value}
                                type="button"
                                onClick={() =>
                                  setReviewDrafts((current) => ({
                                    ...current,
                                    [appointment.id]: { ...reviewDraft, rating: value },
                                  }))
                                }
                                className={`inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-sm font-medium ${
                                  Number(reviewDraft.rating) === value
                                    ? "border-amber-300 bg-amber-50 text-amber-700"
                                    : "border-slate-200 bg-white text-slate-600"
                                }`}
                              >
                                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                                {value}
                              </button>
                            ))}
                          </div>
                          <textarea
                            rows={3}
                            className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-4 py-3"
                            placeholder="Share your visit experience"
                            value={reviewDraft.comment}
                            onChange={(event) =>
                              setReviewDrafts((current) => ({
                                ...current,
                                [appointment.id]: { ...reviewDraft, comment: event.target.value },
                              }))
                            }
                          />
                          <div className="mt-3">
                            <Button className="w-full sm:w-auto" type="button" onClick={() => handleSubmitReview(appointment.id)}>
                              Submit Review
                            </Button>
                          </div>
                        </div>
                      ) : reviewedAppointmentIds.has(appointment.id) ? (
                        <div className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                          Review submitted for this appointment.
                        </div>
                      ) : null}
                    </div>
                  );
                })
              )}
            </div>
          </Card>

          <Card className="space-y-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-brand-700">Review History</p>
              <h3 className="mt-2 text-xl font-semibold text-slate-900">Your submitted ratings</h3>
            </div>
            {reviews.length === 0 ? (
              <EmptyState title="No reviews yet" subtitle="Completed appointments can be reviewed here once they are marked completed." />
            ) : (
              <div className="space-y-3">
                {reviews.map((review) => (
                  <div key={review.id} className="rounded-xl border border-slate-200 bg-white p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="break-words font-semibold text-slate-900">
                        {review.doctor?.name ? `Dr. ${review.doctor.name}` : review.hospital?.name}
                      </p>
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-700">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        {review.rating}
                      </span>
                    </div>
                    <p className="mt-2 break-words text-sm text-slate-600">{review.comment || "No written comment shared."}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

function MiniMetric({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

function StatusPill({ status }) {
  const style =
    status === "COMPLETED"
      ? "bg-sky-100 text-sky-700"
      : status === "CONFIRMED"
      ? "bg-emerald-100 text-emerald-700"
      : status === "REJECTED"
      ? "bg-rose-100 text-rose-700"
      : "bg-amber-100 text-amber-700";

  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${style}`}>{status}</span>;
}
