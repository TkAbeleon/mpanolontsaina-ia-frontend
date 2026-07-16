import { useI18n } from "@/i18n/I18nContext";
import { Link } from "wouter";

export function Footer() {
  const { t } = useI18n();
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full border-t border-border mt-auto py-6 bg-background transition-colors duration-300">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          © {currentYear} {t("app.name")}. {t("footer.rights")}
        </p>
        <div className="flex items-center gap-6">
          <Link 
            href="/about" 
            className="text-sm text-muted-foreground hover:text-foreground transition-all duration-200 hover:translate-y-[-1px]"
          >
            {t("footer.about")}
          </Link>
          <Link 
            href="/privacy" 
            className="text-sm text-muted-foreground hover:text-foreground transition-all duration-200 hover:translate-y-[-1px]"
          >
            {t("footer.privacy")}
          </Link>
          <Link 
            href="/terms" 
            className="text-sm text-muted-foreground hover:text-foreground transition-all duration-200 hover:translate-y-[-1px]"
          >
            {t("footer.terms")}
          </Link>
        </div>
      </div>
    </footer>
  );
}
