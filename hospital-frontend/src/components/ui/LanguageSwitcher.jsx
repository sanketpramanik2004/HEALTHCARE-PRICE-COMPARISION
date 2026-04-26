import { Languages } from "lucide-react";
import { useI18n } from "../../i18n/I18nProvider";

export default function LanguageSwitcher() {
  const { language, setLanguage, languages, t } = useI18n();

  return (
    <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
      <Languages className="h-4 w-4 text-brand-700" />
      <label className="sr-only">{t("lang.label", "Language")}</label>
      <select
        value={language}
        onChange={(event) => setLanguage(event.target.value)}
        className="bg-transparent text-sm font-medium text-slate-700 outline-none"
      >
        {languages.map((item) => (
          <option key={item.code} value={item.code}>
            {item.label}
          </option>
        ))}
      </select>
    </div>
  );
}
