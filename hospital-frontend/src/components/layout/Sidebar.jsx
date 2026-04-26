import { Bot, CalendarCheck2, Compass, House, Hospital, ShieldCheck, ShieldPlus, Stethoscope, TimerReset, CalendarClock } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useI18n } from "../../i18n/I18nProvider";

const links = [
  { to: "/", key: "nav.home", icon: House },
  { to: "/explore", key: "nav.explore", icon: Compass },
  { to: "/ai", key: "nav.ai", icon: Bot },
  { to: "/bookings", key: "nav.bookings", icon: CalendarCheck2 },
  { to: "/admin", key: "nav.admin", icon: ShieldCheck, adminOnly: true },
];

const adminWorkspaceLinks = [
  { to: "/admin/services", label: "Services", icon: ShieldPlus },
  { to: "/admin/doctors", label: "Doctors", icon: Stethoscope },
  { to: "/admin/slots", label: "Slots", icon: TimerReset },
  { to: "/admin/approvals", label: "Approvals", icon: CalendarClock },
];

export default function Sidebar({ session }) {
  const { t } = useI18n();

  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col rounded-2xl border border-white/60 bg-white/70 p-4 shadow-card backdrop-blur-xl">
      <div className="mb-6 flex items-center gap-3 rounded-xl bg-brand-700 p-3 text-white">
        <Hospital className="h-5 w-5" />
        <div>
          <p className="text-xs uppercase tracking-wider text-white/80">{t("nav.healthcare")}</p>
          <h1 className="text-sm font-semibold">{t("nav.priceNavigator")}</h1>
        </div>
      </div>

      <nav className="space-y-1">
        {links
          .filter((link) => !link.adminOnly || session?.role === "ADMIN")
          .map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                    isActive ? "bg-brand-100 text-brand-800" : "text-slate-600 hover:bg-slate-100"
                  }`
                }
              >
                <Icon className="h-4 w-4" />
                <span>{t(link.key)}</span>
              </NavLink>
            );
          })}

        {session?.role === "ADMIN" ? (
          <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50/80 p-3">
            <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Admin Workspace
            </p>
            <div className="space-y-1">
              {adminWorkspaceLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) =>
                      `flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition ${
                        isActive
                          ? "bg-white text-brand-800 shadow-sm ring-1 ring-brand-100"
                          : "text-slate-600 hover:bg-white hover:text-slate-900"
                      }`
                    }
                  >
                    <Icon className="h-4 w-4" />
                    <span>{link.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        ) : null}
      </nav>
    </aside>
  );
}
