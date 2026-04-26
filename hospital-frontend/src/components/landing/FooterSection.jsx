import { Github, Linkedin, Mail } from "lucide-react";
import { useI18n } from "../../i18n/I18nProvider";

export default function FooterSection() {
  const { t } = useI18n();
  return (
    <footer className="mt-8 border-t border-slate-200 bg-white/70">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 px-4 py-8 text-sm text-slate-600 md:flex-row md:items-center lg:px-6">
        <p>© {new Date().getFullYear()} HealthCompass</p>
        <div className="flex items-center gap-4">
          <a href="/#/about" className="hover:text-brand-700">
            {t("home.about")}
          </a>
          <a href="mailto:contact@healthcompass.app" className="inline-flex items-center gap-1 hover:text-brand-700">
            <Mail className="h-4 w-4" />
            {t("home.contact")}
          </a>
          <a
            href="https://github.com/sanketpramanik2004/HEALTHCARE-PRICE-COMPARISION"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 hover:text-brand-700"
          >
            <Github className="h-4 w-4" />
            {t("home.github")}
          </a>
          <a
            href="https://www.linkedin.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 hover:text-brand-700"
          >
            <Linkedin className="h-4 w-4" />
            {t("home.linkedin")}
          </a>
        </div>
      </div>
    </footer>
  );
}
