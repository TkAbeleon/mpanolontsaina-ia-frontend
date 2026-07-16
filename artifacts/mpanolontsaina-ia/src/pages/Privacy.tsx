import { useI18n } from "@/i18n/I18nContext";
import { ShieldCheck } from "lucide-react";

export default function Privacy() {
  const { t } = useI18n();
  
  return (
    <div className="flex-1 max-w-3xl w-full mx-auto p-6 md:py-12">
      <div className="flex items-center gap-4 mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center transition-transform duration-300 hover:scale-110">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-serif font-bold text-foreground">{t("privacy.title")}</h1>
      </div>
      
      <div className="prose prose-sm md:prose-base dark:prose-invert prose-headings:font-serif max-w-none space-y-8">
        <p className="text-lg text-muted-foreground leading-relaxed stagger-item">{t("privacy.intro")}</p>
        
        <section className="stagger-item">
          <h2>{t("privacy.dataTitle")}</h2>
          <p>{t("privacy.dataText")}</p>
        </section>
        
        <section className="stagger-item">
          <h2>{t("privacy.useTitle")}</h2>
          <p>{t("privacy.useText")}</p>
        </section>
        
        <section className="stagger-item">
          <h2>{t("privacy.retentionTitle")}</h2>
          <p>{t("privacy.retentionText")}</p>
        </section>
        
        <section className="stagger-item">
          <h2>{t("privacy.rightsTitle")}</h2>
          <p>{t("privacy.rightsText")}</p>
        </section>
        
        <section className="stagger-item">
          <h2>{t("privacy.contactTitle")}</h2>
          <p>{t("privacy.contactText")}</p>
        </section>
      </div>
    </div>
  );
}
