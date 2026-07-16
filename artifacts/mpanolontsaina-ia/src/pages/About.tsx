import { useI18n } from "@/i18n/I18nContext";
import { Scale } from "lucide-react";

export default function About() {
  const { t } = useI18n();
  
  return (
    <div className="flex-1 max-w-3xl w-full mx-auto p-6 md:py-12">
      <div className="flex items-center gap-4 mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center transition-transform duration-300 hover:scale-110">
          <Scale className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-serif font-bold text-foreground">{t("about.title")}</h1>
      </div>
      
      <div className="prose prose-sm md:prose-base dark:prose-invert prose-headings:font-serif max-w-none space-y-8">
        <p className="text-lg text-muted-foreground leading-relaxed stagger-item">{t("about.intro")}</p>
        
        <section className="stagger-item">
          <h2>{t("about.missionTitle")}</h2>
          <p>{t("about.missionText")}</p>
        </section>
        
        <section className="stagger-item">
          <h2>{t("about.howItWorksTitle")}</h2>
          <p>{t("about.howItWorksText")}</p>
        </section>
        
        <section className="stagger-item bg-muted/50 p-6 rounded-xl border border-border transition-all duration-200 hover:shadow-md">
          <h2 className="mt-0">{t("about.disclaimerTitle")}</h2>
          <p className="mb-0">{t("about.disclaimerText")}</p>
        </section>
      </div>
    </div>
  );
}
