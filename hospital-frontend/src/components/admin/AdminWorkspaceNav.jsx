import { CalendarClock, LayoutDashboard, ShieldPlus, Stethoscope, TimerReset } from "lucide-react";
import { NavLink } from "react-router-dom";

const links = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/admin/services", label: "Services", icon: ShieldPlus },
  { to: "/admin/doctors", label: "Doctors", icon: Stethoscope },
  { to: "/admin/slots", label: "Slots", icon: TimerReset },
  { to: "/admin/approvals", label: "Approvals", icon: CalendarClock },
];

export default function AdminWorkspaceNav() {
  return (
    <div className="grid gap-2 sm:flex sm:flex-wrap">
      {links.map((link) => {
        const Icon = link.icon;
        return (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              `inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition sm:justify-start ${
                isActive
                  ? "bg-brand-700 text-white shadow-sm"
                  : "bg-white/80 text-slate-600 hover:bg-slate-100"
              }`
            }
          >
            <Icon className="h-4 w-4" />
            <span>{link.label}</span>
          </NavLink>
        );
      })}
    </div>
  );
}
