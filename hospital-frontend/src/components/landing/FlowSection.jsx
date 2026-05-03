import { motion } from "framer-motion";
import {
  Activity,
  Bot,
  CalendarCheck2,
  ClipboardCheck,
  Clock3,
  FileClock,
  HeartHandshake,
  LogIn,
  MapPinned,
  ShieldCheck,
  Star,
  Stethoscope,
  UserRoundCheck,
} from "lucide-react";
import StepCard from "./StepCard";
import TimelineConnector from "./TimelineConnector";

const steps = [
  {
    step: "01",
    title: "Login / Signup",
    description: "Create a patient account or sign in to unlock AI guidance, booking, profile history, and care updates.",
    icon: LogIn,
    mockLines: [
      { width: "68%", accent: true, subWidth: "42%" },
      { width: "100%" },
      { width: "84%" },
    ],
    align: "start",
  },
  {
    step: "02",
    title: "Enter Symptoms (AI Assistant)",
    description: "Describe symptoms in plain language so the assistant can understand context, duration, and urgency cues.",
    icon: Activity,
    mockLines: [
      { width: "100%", accent: true, subWidth: "88%" },
      { width: "92%" },
      { width: "76%" },
    ],
    align: "center",
  },
  {
    step: "03",
    title: "AI Recommends Doctor",
    description: "HealthCompass maps the symptoms to the most relevant specialist and explains why that direction fits.",
    icon: Bot,
    highlight: true,
    mockLines: [
      { width: "58%", accent: true, subWidth: "32%" },
      { width: "88%" },
      { width: "72%" },
    ],
    align: "end",
  },
  {
    step: "04",
    title: "Compare Hospitals",
    description: "View real service pricing, ratings, and distance so the patient can choose the most practical option.",
    icon: MapPinned,
    mockLines: [
      { width: "40%", accent: true, subWidth: "22%" },
      { width: "100%" },
      { width: "100%" },
    ],
    align: "start",
  },
  {
    step: "05",
    title: "Select Doctor / Hospital",
    description: "Pick either a specific doctor consultation or a hospital service path, depending on the case.",
    icon: Stethoscope,
    mockLines: [
      { width: "72%", accent: true, subWidth: "48%" },
      { width: "82%" },
      { width: "94%" },
    ],
    align: "center",
  },
  {
    step: "06",
    title: "Choose Time Slot",
    description: "Only live, available slots are shown so the schedule stays accurate and overbooking is prevented.",
    icon: Clock3,
    mockLines: [
      { width: "34%", accent: true, subWidth: "20%" },
      { width: "64%" },
      { width: "52%" },
    ],
    align: "end",
  },
  {
    step: "07",
    title: "Booking Created (Pending)",
    description: "The request is stored immediately and enters the admin queue with patient details and selected slot.",
    icon: FileClock,
    highlight: true,
    mockLines: [
      { width: "78%", accent: true, subWidth: "42%" },
      { width: "90%" },
      { width: "66%" },
    ],
    align: "start",
  },
  {
    step: "08",
    title: "Admin Approves",
    description: "Hospital admins review the request, approve or reject it, and the patient gets a booking email update.",
    icon: ShieldCheck,
    mockLines: [
      { width: "52%", accent: true, subWidth: "34%" },
      { width: "96%" },
      { width: "72%" },
    ],
    align: "center",
  },
  {
    step: "09",
    title: "Visit Hospital",
    description: "The patient attends the consultation or service appointment once the hospital confirms and completes the visit.",
    icon: HeartHandshake,
    mockLines: [
      { width: "64%", accent: true, subWidth: "28%" },
      { width: "86%" },
      { width: "80%" },
    ],
    align: "end",
  },
  {
    step: "10",
    title: "Leave Review",
    description: "After completion, the patient can rate the doctor or hospital to build trust and improve discovery quality.",
    icon: Star,
    mockLines: [
      { width: "48%", accent: true, subWidth: "22%" },
      { width: "76%" },
      { width: "68%" },
    ],
    align: "start",
  },
  {
    step: "11",
    title: "Saved in Profile & History",
    description: "Appointments, reviews, and medical history stay connected to the patient profile for future care journeys.",
    icon: UserRoundCheck,
    mockLines: [
      { width: "82%", accent: true, subWidth: "50%" },
      { width: "100%" },
      { width: "62%" },
    ],
    align: "center",
  },
];

export default function FlowSection() {
  return (
    <section className="bg-slate-50 py-12 sm:py-14 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-700">How HealthCompass Works</p>
          <h2 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl md:text-4xl">
            From symptoms to treatment in a few simple steps
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            A guided care journey that starts with AI triage, moves through booking and approval, and ends with
            long-term profile history and trust-building reviews.
          </p>
        </div>

        <div className="relative mt-10 sm:mt-12">
          <TimelineConnector />

          <div className="grid gap-4 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
            {steps.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.05, duration: 0.35 }}
                className="relative min-w-0 pl-10 lg:pl-0"
              >
                <div className="absolute left-0 top-10 h-4 w-4 rounded-full border-4 border-slate-50 bg-brand-500 shadow-[0_0_0_6px_rgba(13,148,136,0.12)] lg:hidden" />
                <StepCard {...item} />
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-[1.15fr,0.85fr]">
          <div className="rounded-2xl border border-brand-100 bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
                <CalendarCheck2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-900 sm:text-lg">Built for the full care loop</h3>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  This flow does more than search. It helps patients move from uncertainty to treatment, while giving
                  hospitals a structured approval workflow and a review loop that improves trust over time.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-gradient-to-r from-white via-emerald-50/70 to-brand-50/60 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-[0_12px_30px_rgba(16,185,129,0.22)]">
                <ClipboardCheck className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-900 sm:text-lg">Why recruiters notice it</h3>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  It clearly shows an end-to-end healthcare product: AI triage, real comparison logic, booking,
                  approvals, reviews, and patient history in one connected system.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
