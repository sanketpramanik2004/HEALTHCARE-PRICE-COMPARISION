import { LogOut, UserRound } from "lucide-react";
import Button from "../ui/Button";
import LanguageSwitcher from "../ui/LanguageSwitcher";
import { useI18n } from "../../i18n/I18nProvider";

export default function TopNavbar({ session, onLogout }) {
  const { t } = useI18n();

  return (
    <header className="mb-6 flex flex-col gap-3 rounded-2xl border border-white/60 bg-white/70 px-4 py-3 shadow-card backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-wider text-slate-500">{t("topbar.dashboard")}</p>
        <p className="truncate font-semibold text-slate-800">
          {session ? `${t("topbar.welcome")}, ${session.name}` : t("topbar.welcome")}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2 sm:justify-end sm:gap-3">
        <LanguageSwitcher />
        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-sm text-slate-700 sm:max-w-[320px] sm:flex-none">
          <UserRound className="h-4 w-4" />
          <span className="truncate">{session?.email || t("topbar.guest")}</span>
        </div>
        {session && (
          <Button variant="ghost" onClick={onLogout} className="inline-flex w-full items-center justify-center gap-2 sm:w-auto">
            <LogOut className="h-4 w-4" />
            {t("nav.logout")}
          </Button>
        )}
      </div>
    </header>
  );
}
